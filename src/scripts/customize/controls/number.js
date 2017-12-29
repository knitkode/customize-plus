import sprintf from 'locutus/php/strings/sprintf';
import is_float from 'locutus/php/var/is_float';
import isInt from 'validator/lib/isInt';
import { isMultipleOf } from '../core/validators';
import { api, wpApi } from '../core/globals';
import ControlBaseInput from './base-input';

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
  /**
   * @override
   */
  sanitize: function (value) {
    return Number(value);
  },
  /**
   * @override
   */
  validate: function (value) {
    var params = this.params;
    var attrs = params.attrs;
    var errorMsg = '';

    if (isNaN(value) || value === null) {
      errorMsg += api.l10n['vNotAnumber'];
    } else {
      if (!params.allowFloat) {
        if (is_float(value)) {
          errorMsg += api.l10n['vNoFloat'] + ' ';
        } else if (!isInt(value.toString())) {
          errorMsg += api.l10n['vNotAnInteger'] + ' ';
        }
      }
      if (attrs) {
        if (attrs.min && value < attrs.min) {
          errorMsg += sprintf(api.l10n['vNumberLow'], attrs.min) + ' ';
        }
        if (attrs.max && value > attrs.max) {
          errorMsg += sprintf(api.l10n['vNumberHigh'], attrs.max) + ' ';
        }
        if (attrs.step && !isMultipleOf(value.toString(), attrs.step)) {
          errorMsg += sprintf(api.l10n['vNumberStep'], attrs.step) + ' ';
        }
      }
    }

    // if there is an error return it
    if (errorMsg) {
      return {
        error: true,
        msg: errorMsg
      };
    // otherwise return the valid value
    } else {
      return value;
    }
  }
});

export default wpApi.controlConstructor['kkcp_number'] = api.controls.Number = Control;
