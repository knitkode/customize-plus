/* global ControlBase */
/* exported: ControlBaseInput */

/**
 * Control Base Input class
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
var ControlBaseInput = ControlBase.extend({
  /**
   * On ready
   *
   */
  ready: function (isForTheFirstTimeReady) {
    var params = this.params;
    var setting = this.setting;
    var input = this._container.getElementsByTagName('input')[0];

    // sync input value on ready
    input.value = params.value;

    // bind input on ready
    $(input).on('change keyup paste', function () {
      var value = this.value;
      params.value = value;
      setting.set(value);
    });

    // if the setting is changed programmatically (i.e. through code)
    // update input value only if is different than current value, otherwise
    // th einput get a double change and the caret moves lways at the end.
    if (isForTheFirstTimeReady) {
      setting.bind(function (value) {
        params.value = value;
        if (input.value !== value) {
          input.value = value;
        }
      });
    }
  }
});