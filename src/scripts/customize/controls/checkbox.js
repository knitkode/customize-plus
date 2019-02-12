import { api, wpApi } from '../core/globals';
import { numberToBoolean } from '../core/helper';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import Base from './base';

/**
 * Control Checkbox
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_checkbox`
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
class Checkbox extends Base {

  constructor (id, args) {
    super(id, args);

    this.validate = Validate.checkbox;
    this.sanitize = Sanitize.checkbox;
  }

  /**
   * We need this to fix situations like: `'1' === 1` returning false.
   *
   * @override
   */
  softenize ($value) {
    return ($value === 0 || $value === 1) ? $value.toString() : $value;
  }

  /**
   * @override
   */
  shouldComponentUpdate ($value) {
    const $uiValue = numberToBoolean(this.__input.checked);

    return this.softenize($uiValue) !== this.softenize($value);
  }

  /**
   * @override
   */
  componentDidUpdate ($value) {
    this.__input.checked = numberToBoolean($value);
  }

  /**
   * @override
   */
  componentDidMount () {
    this.__input = this._container.getElementsByTagName('input')[0];

    this.__input.checked = numberToBoolean(this.setting());

    this.__input.onchange = (event) => {
      event.preventDefault();
      const value = event.target.checked ? 1 : 0;
      this.setting.set(value);
    };
  }

  /**
   * @override
   */
  _tpl () {
    return `
      ${this._tplHeader()}
      <label>
        <input type="checkbox" name="_customize-kkcp_checkbox-{{ data.id }}" value="" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #>>
        <# if (data.attrs && data.attrs.label) { #>{{{ data.attrs.label }}}<# } #>
      </label>
    `
  }
}

wpApi.controlConstructor['kkcp_checkbox'] = api.controls.Checkbox = Checkbox;
export default Checkbox;
