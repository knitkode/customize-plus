import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import Base from './base';

/**
 * Control Tags class
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_tags`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Tags
 *
 * @extends controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 */
class Tags extends Base {

  /**
   * @override
   */
  validate (value) {
    return Validate.tags({}, value, this.setting, this);
  }

  /**
   * @override
   */
  sanitize (value) {
    return Sanitize.tags(value, this.setting, this);
  }

  /**
   * @override
   */
  onDeflate () {
    if (this.__input && this.__input.selectize) {
      this.__input.selectize.destroy();
    }
  }

  /**
   * @override
   */
  syncUI (value) {
    const selectize = this.__input.selectize;

    if (selectize && selectize.getValue() !== value) {
      // this is due to a bug, we should use:
      // selectize.setValue(value, true);
      // @see https://github.com/brianreavis/selectize.js/issues/568
      // instead here first we have to destroy thene to reinitialize, this
      // happens only through a programmatic change such as a reset action
      selectize.destroy();
      this._initUI(value);
    }
  }

  /**
   * @override
   */
  ready () {
    this.__input = this._container.getElementsByTagName('input')[0];

    this._initUI(this.setting());
  }

  /**
   * Init select plugin on text input
   *
   * @since   1.0.0
   * @memberof! controls.Tags#
   * @access protected
   *
   * @param {string} value
   */
  _initUI (value) {
    const attrs = this.params['attrs'] || {};

    let pluginOptions = {
      plugins: [],
      persist: false,
      create: function (input) {
        return {
          value: input,
          text: input
        };
      },
      onChange: (value) => {
        this.setting.set(value);
      }
    };

    if (attrs['persist']) {
      pluginOptions.persist = true;
    }
    if (attrs['removable']) {
      pluginOptions.plugins.push('remove_button')
    }
    if (attrs['draggable']) {
      pluginOptions.plugins.push('drag_drop')
    }
    if (attrs['restore_on_backspace']) {
      pluginOptions.plugins.push('restore_on_backspace')
    }

    this.__input.value = value;

    $(this.__input).selectize(pluginOptions);
  }

  /**
   * @override
   */
  _tpl() {
    return `
      <label>
        ${this._tplHeader()}
        <input type="text" value="">
      </label>
    `
  }
}

export default wpApi.controlConstructor['kkcp_tags'] = api.controls.Tags = Tags;
