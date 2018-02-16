import { api, wpApi } from '../core/globals';
import ControlBaseInput from './base-input';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';

/**
 * Control Number
 *
 * @class wp.customize.controlConstructor.kkcp_number
 * @alias api.controls.Number
 * @constructor
 * @extends api.controls.BaseInput
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = ControlBaseInput.extend({
  /**
   * @override
   */
  validate: function (value) {
    return Validate.number([], value, this.setting, this);
  },
  /**
   * @override
   */
  sanitize: function (value) {
    return Sanitize.number(value, this.setting, this);
  },
  /**
   * We just neet to convert the value to string for the check, for the rest
   * is the same as in the base input control
   *
   * @override
   */
  syncUI: function (value) {
    if (value && this.__input.value !== value.toString()) {
      this.__input.value = value;
    }
  },
});

export default wpApi.controlConstructor['kkcp_number'] = api.controls.Number = Control;
