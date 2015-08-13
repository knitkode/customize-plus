/* global Utils */

/**
 * Control Toggle
 *
 * @constructor
 * @augments api.controls.BaseInput
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires Utils
 */
wpApi.controlConstructor.pwpcp_toggle = api.controls.Base.extend({
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
  validate: function (newValue) {
    return Utils.toBoolean(newValue) ? 1 : 0;
  },
  /**
   * On initialization
   *
   * Add custom validation function overriding the empty function from WP API.
   * Update input value if the setting is changed programmatically.
   *
   * @override
   */
  onInit: function () {
    this.setting.bind(function (val) {
      if (this.rendered) {
        var value = Utils.toBoolean(val);
        var inputStatus = Utils.toBoolean(this.__input.checked);
        if (inputStatus !== value) {
          this.__input.checked = value;
        }
      }
    }.bind(this));
  },
  /**
   * On ready
   *
   * @override
   */
  ready: function () {
    this.__input = this._container.getElementsByTagName('input')[0];

    // sync input value on ready
    this.__input.checked = Utils.toBoolean(this.setting());

    // bind input on ready
    this.__input.onchange = function (event) {
      event.preventDefault();
      var value = event.target.checked ? 1 : 0;
      this.setting.set(value);
    }.bind(this);
  }
});
