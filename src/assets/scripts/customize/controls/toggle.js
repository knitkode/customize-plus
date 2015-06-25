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
   * Validate
   *
   * @param  {string|array} newValue Value of the checkbox or sent through js API
   * @return {number} 0 or 1 as integer
   */
  _validate: function (newValue) {
    return Utils.toBoolean(newValue) ? 1 : 0;
  },
  /**
   * On initialization
   *
   * add custom validation function overriding the empty function from WP API.
   *
   * @override
   */
  onInit: function () {
    this.setting.validate = this._validate.bind(this);
  },
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
        // important here is to do a soft comparison so that
        // '1' is equal to 1 and '0' to 0
        if (inputStatus != value) {
          input.checked = value;
        }
      });
    }
  }
});

wpApi['controlConstructor']['pwpcp_toggle'] = ControlToggle;
