/**
 * Control Text class
 *
 * @constructor
 * @augments api.controls.BaseInput
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
wpApi.controlConstructor.pwpcp_text = api.controls.BaseInput.extend({
  /**
   * Validate
   *
   * @override
   * @param  {string} value
   * @return {string|object<error,boolean|string>}
   */
  validate: function (value) {
    var attrs = this.params.attrs;
    var inputType = attrs.type || 'text';
    var errorMsg = '';

    // optional check
    if (!this.params.optional && !value.length) {
      errorMsg += api.l10n['vNotEmpty'];
    } else {
      // max length
      if (attrs.maxlength && value.length > attrs.maxlength) {
        errorMsg += api.l10n['vTooLong'];
      }
      // url
      if (inputType === 'url' && !validator.isURL(value)) {
        errorMsg += api.l10n['vInvalidUrl'];
      }
      // email
      else if (inputType === 'email' && !validator.isEmail(value)) {
        errorMsg += api.l10n['vInvalidEmail'];
      }
      // text
      else {
        // always strip HTML
        value = Utils.stripHTML(value);
      }
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