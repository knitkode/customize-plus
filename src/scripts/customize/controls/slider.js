import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import Regexes from '../core/regexes';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import ControlBase from './base';

/**
 * Control Slider
 *
 * @class api.controls.Slider
 * @alias wp.customize.controlConstructor.kkcp_slider
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires api.core.Regexes
 */
class ControlSlider extends ControlBase {

  /**
   * @override
   */
  validate (value) {
    return Validate.slider({}, value, this.setting, this);
  }

  /**
   * @override
   */
  sanitize (value) {
    return Sanitize.slider(value, this.setting, this);
  }

  /**
   * Let's consider '44' to be equal to 44.
   * @override
   */
  softenize (value) {
    return value.toString();
  }

  /**
   * @override
   */
  syncUI (value) {
    if (value !== this._getValueFromUI()) {
      this._setPartialValue(value, 'API');
    }
  }

  /**
   * This function is divided in subfunction to make it easy to reuse part of
   * this control in other controls that extend this, such as `size_dynamic`.
   * @override
   */
  ready () {
    this._setDOMelements();
    this._initSliderAndBindInputs();
    // update UI with current values (wait for the slider to be initialized)
    this._updateUIcustomControl(this.setting());
  }

  /**
   * Set DOM element as control properties
   */
  _setDOMelements () {
    const container = this._container;
    /** @type {HTMLElement} */
    this.__inputNumber = container.getElementsByClassName('kkcp-slider-number')[0];
    /** @type {JQuery} */
    this.__$inputUnits = $(container.getElementsByClassName('kkcp-unit'));
    /** @type {JQuery} */
    this.__$inputSlider = $(container.getElementsByClassName('kkcp-slider')[0]);
  }

  /**
   * Init slider and bind input UI.
   */
  _initSliderAndBindInputs () {
    const self = this;
    const params = self.params;
    const inputNumber = self.__inputNumber;
    const $inputSlider = self.__$inputSlider;
    const onInputNumberChange = function () {
      var value = this.value;
      $inputSlider.slider('value', value);
      self._setPartialValue({ _number: value });
    };

    // Bind click action to unit picker
    // (only if there is more than one unit allowed)
    if (params.units && params.units.length > 1) {
      let $inputUnits = self.__$inputUnits;
      $inputUnits.on('click', function () {
        $inputUnits.removeClass('kkcp-current');
        this.className += ' kkcp-current';
        self._setPartialValue({ _unit: this.value });
      });
    }

    // Bind number input
    inputNumber.onchange = onInputNumberChange;
    inputNumber.onkeyup = onInputNumberChange;

    // Init Slider
    let sliderOptions = params.attrs || {};
    $inputSlider.slider(_.extend(sliderOptions, {
      value: self._extractFirstNumber(),
      slide: function(event, ui) {
        inputNumber.value = ui.value;
        self._setPartialValue({ _number: ui.value });
      },
      change: function(event, ui) {
        // trigger change effect only on user input, @see
        // https://forum.jquery.com/topic/setting-a-sliders-value-without-triggering-the-change-event
        if (event.originalEvent) {
          self._setPartialValue({ _number: ui.value });
        }
      }
    }));
  }

  /**
   * Extract first found unit from value
   * @param  {?string} value [description]
   * @return {?string}       [description]
   */
  _extractFirstUnit (value) {
    const valueOrigin = value || this.setting();
    const matchesUnit = Regexes._extractUnit.exec(valueOrigin);
    if (matchesUnit && matchesUnit[0]) {
      return matchesUnit[0];
    }
    return null;
  }

  /**
   * Extract first number found in value
   * @param  {?string|number} value [description]
   * @return {?string}              [description]
   */
  _extractFirstNumber (value) {
    const valueOrigin = value || this.setting();
    const matchesNumber = Regexes._extractNumber.exec(valueOrigin);
    if (matchesNumber && matchesNumber[0]) {
      return matchesNumber[0];
    }
    return null;
  }

  /**
   * Get current `setting` value from DOM or from given arg
   * @param  {Object<string,string>} value An optional value formed as
   *                                       `{ number: ?, unit: ? }`
   * @return {string}
   */
  _getValueFromUI (value) {
    let output;

    if (value && value._number) {
      output = value._number.toString();
    } else {
      output = this.__inputNumber.value;
    }
    if (this.params.units) {
      if (value && value._unit) {
        output += value._unit;
      } else {
        output += this.__$inputUnits.filter('.kkcp-current').val();
      }
    }
    return output;
  }

  /**
   * Update UI control
   *
   * Reflect a programmatic setting change on the UI.
   * @param {?string} value Optional, the value from where to extract number and unit,
   *                        uses `this.setting()` if a `null` value is passed.
   */
  _updateUIcustomControl (value) {
    const params = this.params;
    const number = this._extractFirstNumber(value);
    const unit = this._extractFirstUnit(value);

    // update number input
    this.__inputNumber.value = number;
    // update number slider
    this.__$inputSlider.slider('value', number);
    // update unit picker
    if (params.units) {
      this.__$inputUnits.removeClass('kkcp-current').filter(function () {
        return this.value === unit;
      }).addClass('kkcp-current');
    }
  }

  /**
   * Set partial value
   *
   * Wraps `setting.set()` with some additional stuff.
   *
   * @access private
   * @param  {string} value
   * @param  {string} from  Where the value come from (could be from the UI:
   *                        picker, dynamic fields, expr field) or from the
   *                        API (on programmatic value change).
   */
  _setPartialValue (value, from) {
    if (from === 'API') {
      this._updateUIcustomControl(value);
    } else {
      this.setting.set(this._getValueFromUI(value));
    }
  }
}

export default wpApi.controlConstructor['kkcp_slider'] = api.controls.Slider = ControlSlider;
