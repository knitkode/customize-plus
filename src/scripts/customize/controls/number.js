import { api, wpApi } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import ControlBaseInput from './base-input';

/**
 * Control Number
 *
 * @class api.controls.Number
 * @alias wp.customize.controlConstructor.kkcp_number
 * @extends api.controls.BaseInput
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class ControlNumber extends ControlBaseInput {

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

export default wpApi.controlConstructor['kkcp_number'] = api.controls.Number = ControlNumber;
