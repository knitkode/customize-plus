/**
 * Control Number
 *
 * @constructor
 * @augments api.controls.BaseInput
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
// export to our API and to WordPress API
api.controls.Number = wpApi.controlConstructor.pwpcp_number = api.controls.BaseInput.extend({
  /**
   * Validate value
   *
   * @override
   * @param  {string} value
   * @return {string|object<error,boolean|string>}
   */
  _validateValue: function (rawValue) {
    var value = parseInt(rawValue, 10);
    var attrs = this.params.attrs;
    var errorMsg = '';
    // required
    if (attrs.required && !_.isNumber(value)) {
      errorMsg += api.l10n['vNotEmpty'];
    } else {
      // min value
      if (attrs.min && value < attrs.min) {
        errorMsg += api.l10n['vNumberLow'] + ' ';
      }
      // max value
      if (attrs.max && value > attrs.max) {
        errorMsg += api.l10n['vNumberHigh'] + ' ';
      }
      // step
      if (attrs.step && !validator.isDivisibleBy(value, attrs.step)) {
        errorMsg += api.l10n['vNumberStep'] + ' ' + attrs.step;
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