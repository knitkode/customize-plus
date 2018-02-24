import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import Helper from '../core/helper';
import Base from './base';

/**
 * Control Slider
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_slider`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Slider
 *
 * @extends controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 * @requires Helper
 */
class Slider extends Base {

  constructor (id, args) {
    super(id, args);

    this.validate = Validate.slider;
    this.sanitize = Sanitize.slider;
  }

  /**
   * Let's consider '44' to be equal to 44.
   * @override
   */
  softenize ($value) {
    return $value.toString();
  }

  /**
   * @override
   */
  shouldComponentUpdate ($value) {
    return !_.isEqual(this.softenize($value), this._getValueFromUI());
  }

  /**
   * @override
   */
  componentDidUpdate ($value) {
    this._setPartialValue($value, 'API');
  }

  /**
   * This function is divided in subfunctions to make it easy to reuse part of
   * this control in other controls that extends this, such as `size_dynamic`.
   *
   * @override
   */
  componentDidMount () {
    this._setDOMrefs();
    this._initSliderAndBindInputs();
    this._updateUI(this.setting());
  }

  /**
   * Set DOM element as control properties
   *
   * @since   1.0.0
   * @memberof! controls.Slider#
   * @access protected
   */
  _setDOMrefs () {
    const container = this._container;
    this.__inputNumber = container.getElementsByClassName('kkcp-slider-number')[0];
    this.__$inputUnits = $(container.getElementsByClassName('kkcp-unit'));
    this.__$inputSlider = $(container.getElementsByClassName('kkcp-slider')[0]);
  }

  /**
   * Init slider and bind input UI.
   *
   * @since   1.0.0
   * @memberof! controls.Slider#
   * @access protected
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
    if (params['units'] && params['units'].length > 1) {
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
    let sliderOptions = params['attrs'] || {};
    $inputSlider.slider(_.extend(sliderOptions, {
      value: Helper.extractNumber(this.setting()),
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
   * Get current `setting` value from DOM or from given arg
   *
   * @since   1.0.0
   * @memberof! controls.Slider#
   * @access protected
   *
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
    if (this.params['units']) {
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
   *
   * @since   1.0.0
   * @memberof! controls.Slider#
   * @access protected
   *
   * @param {?string} value Optional, the value from where to extract number and unit,
   *                        uses `this.setting()` if a `null` value is passed.
   */
  _updateUI (value) {
    const params = this.params;
    const number = Helper.extractNumber(value);
    const unit = Helper.extractSizeUnit(value);

    // update number input
    this.__inputNumber.value = number;
    // update number slider
    this.__$inputSlider.slider('value', number);
    // update unit picker
    if (params['units']) {
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
   * @since   1.0.0
   * @memberof! controls.Slider#
   * @access protected
   *
   * @param  {string} value
   * @param  {string} from  Where the value come from (could be from the UI:
   *                        picker, dynamic fields, expr field) or from the
   *                        API (on programmatic value change).
   */
  _setPartialValue (value, from) {
    if (from === 'API') {
      this._updateUI(value);
    } else {
      this.setting.set(this._getValueFromUI(value));
    }
  }

  /**
   * Separate the slider template to make it reusable by child classes
   *
   * @override
   */
  _tplSlider () {
    return `
      <# if (data.units) { #>
        <div class="kkcp-inputs-wrap">
          <input type="number" class="kkcp-slider-number" value="" tabindex="-1"
            <# for (var key in data.attrs) { if (data.attrs.hasOwnProperty(key)) { #>{{ key }}="{{ data.attrs[key] }}" <# } } #>>
          <div class="kkcp-unit-wrap"><# for (var i = 0, l = data.units.length; i < l; i++) { #><input type="text" class="kkcp-unit" readonly="true" tabindex="-1" value="{{ data.units[i] }}"><# } #></div>
        </div>
      <# } else { #>
        <input type="number" class="kkcp-slider-number" value="" tabindex="-1"
          <# for (var key in data.attrs) { if (data.attrs.hasOwnProperty(key)) { #>{{ key }}="{{ data.attrs[key] }}" <# } } #>>
        <# } #>
      <div class="kkcp-slider-wrap">
        <div class="kkcp-slider"></div>
      </div>
    `
  }

  /**
   * @override
   */
  _tpl () {
    return `${this._tplHeader()}${this._tplSlider()}`
  }
}

export default wpApi.controlConstructor['kkcp_slider'] = api.controls.Slider = Slider;
