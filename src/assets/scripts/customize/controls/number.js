import validator from 'validator';
import { api } from '../core/api';
import { wpApi } from '../core/globals';
import Utils from '../core/utils';
import ControlBaseInput from './base-input';

/**
 * Control Number
 *
 * @class wp.customize.controlConstructor.pwpcp_number
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

    if (isNaN(value)) {
      errorMsg += api.l10n['vNotAnumber'];
    } else {

    }
    if (!params.allowFloat) {

      // @@tobecareful, `isDecimal` is the same as `isFloat`? See the validator
      // library because `isFloat` returns true both for `2` and for `2.11` \\
      if (validator.isDecimal(value)) {
        errorMsg += api.l10n['vNoFloat'] + ' ';
      } else if (!validator.isInt(value)) {
        errorMsg += api.l10n['vNotAnInteger'] + ' ';
      }
    }
    if (attrs) {
      if (attrs.min && value < attrs.min) {
        errorMsg += Utils._sprintf(api.l10n['vNumberLow'], attrs.min) + ' ';
      }
      if (attrs.max && value > attrs.max) {
        errorMsg += Utils._sprintf(api.l10n['vNumberHigh'], attrs.max) + ' ';
      }
      if (attrs.step && !validator.isMultipleOf(value, attrs.step)) {
        errorMsg += Utils._sprintf(api.l10n['vNumberStep'], attrs.step) + ' ';
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

export default wpApi.controlConstructor['pwpcp_number'] = api.controls.Number = Control;
