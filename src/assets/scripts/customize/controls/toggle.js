/* global ControlBase, Utils */

/**
 * Control Toggle
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires Utils
 */
var ControlToggle = ControlBase.extend({
  /**
   * On ready
   *
   */
  ready: function (isForTheFirstTimeReady) {
    var toBoolean = Utils.toBoolean;
    var params = this.params;
    var setting = this.setting;
    var input = this._container.getElementsByTagName('input')[0];

    // sync input value on ready
    input.checked = toBoolean(params.value);

    // bind input on ready
    input.onchange = function (e) {
      e.preventDefault();
      var value = this.checked ? 1 : 0;
      params.value = value;
      setting.set(value);
    };

    // if the setting is changed programmatically (i.e. through code)
    // update input value
    if (isForTheFirstTimeReady) {
      setting.bind(function (val) {
        params.value = val;
        var value = toBoolean(val);
        var inputStatus = toBoolean(input.checked);
        if (inputStatus !== value) {
          input.checked = value;
        }
      });
    }
  }
});
api.controlConstructor['k6_toggle'] = ControlToggle;