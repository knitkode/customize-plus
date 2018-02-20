import _ from 'underscore';
import { api } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import BaseChoices from './base-choices';

/**
 * Control Base Radio class
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class controls.BaseRadio
 *
 * @extends controls.BaseChoices
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 */
class BaseRadio extends BaseChoices {

  /**
   * @since   1.0.0
   * @override
   */
  validate (value) {
    return Validate.singleChoice({}, value, this.setting, this);
  }

  /**
   * @since   1.0.0
   * @override
   */
  sanitize (value) {
    return Sanitize.singleChoice(value, this.setting, this);
  }

  /**
   * @since   1.0.0
   * @override
   */
  syncUI () {
    this._syncRadios();
  }

  /**
   * @since   1.0.0
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
   * @since   1.0.0
   * @memberof! controls.BaseRadio#
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

export default api.controls.BaseRadio = BaseRadio;
