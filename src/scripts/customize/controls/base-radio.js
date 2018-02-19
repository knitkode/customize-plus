import _ from 'underscore';
import { api } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import ControlBaseChoices from './base-choices';

/**
 * Control Base Radio class
 *
 * @class api.controls.BaseRadio
 * @extends api.controls.BaseChoices
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class ControlBaseRadio extends ControlBaseChoices {

  /**
   * @override
   */
  validate (value) {
    return Validate.singleChoice({}, value, this.setting, this);
  }

  /**
   * @override
   */
  sanitize (value) {
    return Sanitize.singleChoice(value, this.setting, this);
  }

  /**
   * @override
   */
  syncUI () {
    this._syncRadios();
  }

  /**
   * @override
   */
  ready () {
    this.__inputs = this._container.getElementsByTagName('input');
    // sync checked state on radios on ready and bind (argument `true`)
    this._syncRadios(true);
  }

  /**
   * Sync radios and maybe bind change event
   * We need to be fast here, use vanilla js.
   *
   * @param  {boolean} bindAsWell Bind on change?
   */
  _syncRadios (bindAsWell) {
    const value = this.setting();

    for (var i = 0, l = this.__inputs.length; i < l; i++) {
      var input = this.__inputs[i];
      input.checked = value === input.value;
      if (bindAsWell) {
        input.onchange = (event) => {
          this.setting.set(event.target.value);
        };
      }
    }
  }
}

export default api.controls.BaseRadio = ControlBaseRadio;
