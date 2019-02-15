import $ from 'jquery';
import _ from 'underscore';
import { oneOrMoreChoices as validate } from '../core/validate';
import { oneOrMoreChoices as sanitize } from '../core/sanitize';
import BaseChoices from './base-choices';

/**
 * Control Select class
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_select`
 *
 * @since  1.0.0
 *
 * @memberof controls
 *
 * @extends controls.BaseChoices
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires validate
 * @requires sanitize
 */
class Select extends BaseChoices {
    
  static type = `select`;

  static _onWpConstructor = true;

  validate = validate;

  sanitize = sanitize;

  /**
   * @override
   */
  componentWillUnmount () {
    if (this.__select.selectize) {
      this.__select.selectize.destroy();
    }
  }

  /**
   * We do a comparison with two equals `==` because sometimes we want to
   * compare `500` to `'500'` (like in the font-weight dropdown) and return
   * true from that
   *
   * @override
   */
  shouldComponentUpdate ($value) {
    return this._getValueFromUI() != $value;
  }

  /**
   * @override
   */
  componentDidUpdate (value) {
    this._updateUI(value);
  }

  /**
   * @override
   */
  componentDidMount () {
    const attrs = this.params['attrs'] || {};
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

  /**
   * @override
   */
  _tplChoiceUi () {
    return `
      <option class="{{ classes }}" {{ attributes }} value="{{ val }}"<# if (choice.sublabel) { #> data-sublabel="{{{ choice.sublabel }}}"<# } #>>
        {{ label }}
      </option>
    `
  }

  /**
   * @override
   */
  _tplAboveChoices () {
    return `<select name="_customize-kkcp_select-{{ data.id }}">`
  }

  /**
   * @override
   */
  _tplBelowChoices () {
    return `</select>`
  }
}

export default Select;
