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
   * Normalize setting for soft comparison
   *
   * We need this to fix situations like: `'1' === 1` returning false,
   * due to the fact that we can't use a real soft comparison (`==`).
   *
   * @override
   * @static
   * @param  {?} value Could be the factory, the initial, or the current
   *                   session value
   * @return {string} The 'normalized' value passed as an argument.
   */
  softenize: function (value) {
    return (value === 0 || value === 1) ? value.toString() : value;
  },
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

    // if the setting is changed programmatically (i.e. through code)
    // update input value
    this.setting.bind(function (val) {
      var value = Utils.toBoolean(val);
      var inputStatus = Utils.toBoolean(this.__input.checked);
      // important here is to do a soft comparison so that
      // '1' is equal to 1 and '0' to 0
      if (inputStatus !== value) {
        this.__input.checked = value;
      }
    }.bind(this));
  },
  /**
   * On ready
   *
   */
  ready: function () {
    var setting = this.setting;
    this.__input = this._container.getElementsByTagName('input')[0];

    // sync input value on ready
    this.__input.checked = Utils.toBoolean(setting());

    // bind input on ready
    this.__input.onchange = function (event) {
      event.preventDefault();
      var value = this.checked ? 1 : 0;
      setting.set(value);
    };
  }
});

wpApi['controlConstructor']['pwpcp_toggle'] = ControlToggle;
