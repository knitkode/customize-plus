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
   * On ready
   *
   */
  ready: function (isForTheFirstTimeReady) {
    var params = this.params;
    var setting = this.setting;
    var inputs = this._container.getElementsByTagName('input');
    /**
     * Sync radios and maybe bind change event
     * We need to be fast here, use vanilla js.
     *
     * @param  {boolean} bindAsWell Bind on change?
     */
    var _syncRadios = function (bindAsWell) {
      var value = params.value;
      for (var i = 0, l = inputs.length; i < l; i++) {
        var input = inputs[i];
        input.checked = value === input.value;
        if (bindAsWell) {
          input.onchange = function (event) {
            setting.set(event.target.value);
          };
        }
      }
    };

    // sync checked state on radios on ready and bind (argument `true`)
    _syncRadios(true);

    // if the setting is changed programmatically (i.e. through code)
    // update radios status
    if (isForTheFirstTimeReady) {
      setting.bind(function (value) {
        params.value = value;
        _syncRadios();
      });
    }
  }
});