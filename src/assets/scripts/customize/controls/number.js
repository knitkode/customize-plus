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