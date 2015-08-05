/* global ControlBaseInput */

/**
 * Control Number
 *
 * @constructor
 * @augments ControlBaseInput
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
wpApi['controlConstructor']['pwpcp_number'] = ControlBaseInput.extend({
  /**
   * Validate
   *
   * @override
   * @param  {string} value
   * @return {string|object<error,boolean|string>}
   */
  validate: function (value) {
    var attrs = this.params.attrs;
    var errorMsg = '';

    // required
    if (attrs.required && !value.length) {
      errorMsg += api['l10n']['vNotEmpty'];
    } else {
      // min value
      if (attrs.min && value < attrs.min) {
        errorMsg += api['l10n']['vNumberLow'] + ' ';
      }
      // max value
      if (attrs.max && value > attrs.max) {
        errorMsg += api['l10n']['vNumberHigh'] + ' ';
      }
      // step
      if (attrs.step && !validator.isDivisibleBy(value, attrs.step)) {
        errorMsg += api['l10n']['vNumberStep'] + ' ' + attrs.step;
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