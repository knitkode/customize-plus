/* global ControlBase */
/* exported: ControlBaseRadio */

/**
 * Control Base Radio class
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
var ControlBaseRadio = ControlBase.extend({
  /**
   * Validate
   *
   * @param  {string} newValue
   * @return {string} The new value if is an allowed choice or the last value
   */
  validate: function (newValue) {
    var choices = this.params.choices;

    // validate value as a string
    if (_.isString(newValue) && choices.hasOwnProperty(newValue)) {
      return newValue;
    }
    // otherwise return last value
    else {
      return this.setting();
    }
  },
  /**
   * On initialization
   *
   * Update radios status if the setting is changed programmatically.
   *
   * @override
   */
  onInit: function () {
    this.setting.bind(function () {
      if (this.rendered) {
        this._syncRadios();
      }
    }.bind(this));
  },
  /**
   * On ready
   *
   * @override
   */
  ready: function () {
    this.__inputs = this._container.getElementsByTagName('input');
    // sync checked state on radios on ready and bind (argument `true`)
    this._syncRadios(true);
  },
  /**
   * Sync radios and maybe bind change event
   * We need to be fast here, use vanilla js.
   *
   * @param  {boolean} bindAsWell Bind on change?
   */
  _syncRadios: function (bindAsWell) {
    var value = this.setting();
    for (var i = 0, l = this.__inputs.length; i < l; i++) {
      var input = this.__inputs[i];
      input.checked = value === input.value;
      if (bindAsWell) {
        input.onchange = function (event) {
          this.setting.set(event.target.value);
        }.bind(this);
      }
    }
  }
});