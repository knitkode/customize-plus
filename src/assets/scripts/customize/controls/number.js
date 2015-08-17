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
   * @override
   */
  validate: function (value) {
    var number = Number(value);
    var attrs = this.params.attrs;
    var errorMsg = '';

    if (isNaN(number)) {
      errorMsg += api.l10n['vNotNumber'];
    }
    else if (!validator.is_int(number) && !validator.is_float(number)) {
      errorMsg += api.l10n['vNotNumber'];
    }
    else if (!this.params.allowFloat && validator.is_float(number)) {
      errorMsg += api.l10n['vNoFloat'] + ' ';
    }
    else {
      // read attrs if any
      if (attrs) {
        // min value
        if (attrs.min && number < attrs.min) {
          errorMsg += api.l10n['vNumberLow'] + ' ';
        }
        // max value
        if (attrs.max && number > attrs.max) {
          errorMsg += api.l10n['vNumberHigh'] + ' ';
        }
        // step
        if (attrs.step && !validator.isDivisibleBy(number, attrs.step)) {
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
      return number;
    }
  }
});