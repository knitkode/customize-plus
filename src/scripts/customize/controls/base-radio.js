import _ from 'underscore';
import { api } from '../core/globals';
// import ControlBase from './base';
import ControlBaseChoices from './base-choices';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';

/**
 * Control Base Radio class
 *
 * @class api.controls.BaseRadio
 * @constructor
 * @extends api.controls.BaseChoices
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = ControlBaseChoices.extend({
  /**
   * @override
   */
  validate: function (value) {
    return Validate.singleChoice({}, value, this.setting, this);
  },
  /**
   * @override
   */
  sanitize: function (value) {
    return Sanitize.singleChoice(value, this.setting, this);
  },
  /**
   * @override
   */
  syncUI: function () {
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

export default api.controls.BaseRadio = Control;
