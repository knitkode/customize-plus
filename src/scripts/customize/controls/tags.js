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

  constructor (id, args) {
    super(id, args);

    this.validate = Validate.tags;
    this.sanitize = Sanitize.tags;
  }

  /**
   * @override
   */
  componentWillUnmount () {
    this.__input.selectize.destroy();
  }

  /**
   * @override
   */
  shouldComponentUpdate ($value) {
    return this.__input.selectize.getValue() !== $value;
  }

  /**
   * @override
   */
  componentDidUpdate ($value) {
    // this is due to a bug, we should use:
    // selectize.setValue(value, true);
    // @see https://github.com/brianreavis/selectize.js/issues/568
    // instead here first we have to destroy thene to reinitialize, this
    // happens only through a programmatic change such as a reset action
    this.__input.selectize.destroy();
    this._initUI($value);
  }

  /**
   * @override
   */
  componentDidMount () {
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
