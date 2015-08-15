/**
 * Control Base Radio class
 *
 * @constructor
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
api.controls.BaseRadio = api.controls.Base.extend({
  /**
   * @override
   */
  validate: function (newValue) {
    // validate value as a string
    if (_.isString(newValue) && this.params.choices.hasOwnProperty(newValue)) {
      return newValue;
    }
    // otherwise return last value
    else {
      return { error: true };
    }
  },
  /**
   * @override
   */
  syncUIFromAPI: function () {
    this._syncRadios();
  },
  /**
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