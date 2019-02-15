import $ from 'jquery';
import _ from 'underscore';
import { tags as validate } from '../core/validate';
import { tags as sanitize } from '../core/sanitize';
import Base from './base';

/**
 * Control Tags class
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_tags`
 *
 * @since  1.0.0
 *
 * @memberof controls
 *
 * @extends controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 */
class Tags extends Base {
    
  static type = `tags`;

  static onWpConstructor = true;

  validate = validate;

  sanitize = sanitize;

  /**
   * @override
   */
  componentInit () {
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

    this._pluginOptions = pluginOptions;
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
    this._updateUI($value);
  }

  /**
   * @override
   */
  componentDidMount () {
    this.__input = this._container.getElementsByTagName('input')[0];

    this._updateUI(this.setting());
  }

  /**
   * Update UI
   *
   * @since   1.0.0
   * @access protected
   *
   * @param {string} $value
   */
  _updateUI ($value) {
    // here we should not destroy and recreate, but this is a plugin bug:
    // @see https://github.com/brianreavis/selectize.js/issues/568
    if (this.__input.selectize) {
      this.__input.selectize.destroy();
    }
    this.__input.value = $value;
    $(this.__input).selectize(this._pluginOptions);

    // this.__input.selectize.setValue($value, true);
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

export default Tags;
