import { api, wpApi } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import BaseInput from './base-input';

/**
 * Control Number
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_number`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Number
 *
 * @extends controls.BaseInput
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 */
class Number extends BaseInput {

  /**
   * @override
   */
  validate (value) {
    return Validate.number({}, value, this.setting, this);
  }

  /**
   * @override
   */
  sanitize (value) {
    return Sanitize.number(value, this.setting, this);
  }

  /**
   * We just neet to convert the value to string for the check, for the rest
   * is the same as in the base input control
   *
   * @override
   */
  syncUI (value) {
    if (value && this.__input.value !== value.toString()) {
      this.__input.value = value;
    }
  }
}

export default wpApi.controlConstructor['kkcp_number'] = api.controls.Number = Number;
