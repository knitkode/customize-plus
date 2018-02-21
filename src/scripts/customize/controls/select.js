import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import BaseChoices from './base-choices';

/**
 * Control Select class
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_select`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Select
 *
 * @extends controls.BaseChoices
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 */
class Select extends BaseChoices {

  /**
   * @override
   */
  validate (value) {
    return Validate.oneOrMoreChoices({}, value, this.setting, this);
  }

  /**
   * @override
   */
  sanitize (value) {
    return Sanitize.oneOrMoreChoices(value, this.setting, this);
  }

  /**
   * @override
   */
  onDeflate () {
    if (this.__select && this.__select.selectize) {
      this.__select.selectize.destroy();
    }
  }

  /**
   * We do a comparison with two equals `==` because sometimes we want to
   * compare `500` to `'500'` (like in the font-weight dropdown) and return
   * true from that. // @@todo the before comment... \\
   *
   * @override
   */
  syncUI (value) {
    if (!_.isEqual(value, this._getValueFromUI())) {
      this._updateUI(value);
    }
  }

  /**
   * @override
   */
  ready () {
    const attrs = this.params['input_attrs'] || {};
    const setting = this.setting;

    this.__select = this._container.getElementsByTagName('select')[0];

    // or use normal DOM API
    if (attrs['native']) {
      this.__options = this._container.getElementsByTagName('option');

      this.__select.onchange = function () {
        setting.set(this.value);
      };
    // use select plugin
    } else {
      let pluginOptions = {
        plugins: [],
        maxItems: this.params.max,
        onChange: (value) => {
          setting.set(value);
        }
      };

      if (attrs['hide_selected']) {
        pluginOptions.hideSelected = true;
      }
      if (attrs['sort']) {
        pluginOptions.sortField = 'text';
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

      $(this.__select).selectize(pluginOptions);
    }

    // sync selected state on options on ready
    this._updateUI(this.setting());
  }

  /**
   * Get value from UI
   *
   * @since   1.0.0
   * @memberof! controls.Select#
   * @access protected
   *
   * @return {?Array<string>}
   */
  _getValueFromUI () {
    if (!this.__select) {
      return null;
    }
    if (this.__select.selectize) {
      return this.__select.selectize.getValue();
    }
    return this.__select.value;
  }

  /**
   * Update UI syncing options values
   *
   * Pass `true` as second argument to perform a `silent` update, that does
   * not trigger the `onChange` event
   *
   * @since   1.0.0
   * @memberof! controls.Select#
   * @access protected
   *
   * @param {string|Array<string>} value
   */
  _updateUI (value) {
    // use plugin
    if (this.__select.selectize) {
      this.__select.selectize.setValue(value, true);
    }
    // or use normal DOM API
    else {
      for (let i = this.__options.length; i--;) {
        let option = this.__options[i];
        option.selected = (value == option.value);
      }
    }
  }
}

export default wpApi.controlConstructor['kkcp_select'] = api.controls.Select = Select;
