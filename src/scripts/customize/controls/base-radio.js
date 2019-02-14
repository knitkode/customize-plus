import _ from 'underscore';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import BaseChoices from './base-choices';

/**
 * Control Base Radio class
 *
 * @since  1.0.0
 *
 * @memberof controls
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
  
  static type = `base_radio`;

  constructor (id, args) {
    super(id, args);

    this.validate = Validate.singleChoice;
    this.sanitize = Sanitize.singleChoice;
  }

  /**
   * @override
   */
  shouldComponentUpdate ($value) {
    return $value.toString() !== this._getValueFromUI();
  }

  /**
   * @override
   */
  componentDidUpdate ($value) {
    this._updateUI($value);
  }

  /**
   * @override
   */
  componentDidMount () {
    this.__inputs = this._container.getElementsByTagName('input');
    this._updateUI(this.setting(), true);
  }

  /**
   * Sync radios and maybe bind change event
   *
   * @since   1.0.0
   *
   * @param {mixed}   $value
   * @param {boolean} bind
   */
  _updateUI ($value, bind) {
    for (let i = 0, l = this.__inputs.length; i < l; i++) {
      let input = this.__inputs[i];
      input.checked = $value === input.value;
      if (bind) {
        input.onchange = (event) => {
          this.setting.set(event.target.value);
        };
      }
    }
  }

  /**
   * Get value from UI
   *
   * @since   1.1.0
   *
   * @return {?string}
   */
  _getValueFromUI () {
    for (let i = 0, l = this.__inputs.length; i < l; i++) {
      if (this.__inputs[i].checked) {
        return this.__inputs[i].value;
      }
    }
    return null;
  }
}

export default BaseRadio;
