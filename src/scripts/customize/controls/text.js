import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';
import { api } from '../core/api';
import { wpApi } from '../core/globals';
import Utils from '../core/utils';
import ControlBaseInput from './base-input';

/**
 * Control Text class
 *
 * @class wp.customize.controlConstructor.pwpcp_text
 * @constructor
 * @extends api.controls.BaseInput
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Classnds
 * @requires api.core.Utils
 */
let Control = ControlBaseInput.extend({
  /**
   * @override
   * @inheritdoc api.controls.Base.validate
   */
  validate: function (value) {
    var attrs = this.params.attrs;
    var inputType = attrs.type || 'text';
    var errorMsg = '';

    // max length
    if (attrs.maxlength && value.length > attrs.maxlength) {
      errorMsg += api.l10n['vTooLong'];
    }
    // url
    if (inputType === 'url' && !isURL(value)) {
      errorMsg += api.l10n['vInvalidUrl'];
    }
    // email
    else if (inputType === 'email' && !isEmail(value)) {
      errorMsg += api.l10n['vInvalidEmail'];
    }
    // text
    else {
      // always strip HTML
      value = Utils._stripHTML(value);
    }

    if (errorMsg) {
      return {
        error: true,
        msg: errorMsg
      };
    } else {
      return value;
    }
  }
});

export default wpApi.controlConstructor['pwpcp_text'] = api.controls.Text = Control;
