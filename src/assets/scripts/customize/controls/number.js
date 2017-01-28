import validator from 'validator';
import { api } from '../core/api';
import { wpApi } from '../core/globals';
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
      errorMsg += api.l10n['vNotNumber'];
    }
    else if (!params.allowFloat && validator.is_float(value)) {
      errorMsg += api.l10n['vNoFloat'] + ' ';
    }
    else {
      if (attrs) {
        if (attrs.min && value < attrs.min) {
          errorMsg += api.l10n['vNumberLow'] + ' ';
        }
        if (attrs.max && value > attrs.max) {
          errorMsg += api.l10n['vNumberHigh'] + ' ';
        }
        if (attrs.step && !validator.isMultipleOf(value, attrs.step)) {
          errorMsg += api.l10n['vNumberStep'] + ' ' + attrs.step;
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

export default wpApi.controlConstructor['pwpcp_number'] = api.controls.Number = Control;
