/**
 * Control Slider
 *
 * @class wp.customize.controlConstructor.pwpcp_slider
 * @alias api.controls.Slider
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires api.Regexes
 */
wpApi.controlConstructor.pwpcp_slider = api.controls.Slider = api.controls.Base.extend({
  /**
   * Let's consider '44' to be equal to 44.
   * @override
   */
  softenize: function (value) {
    return value.toString();
  },
  /**
   * @override
   */
  validate: function (newValue) {
    var params = this.params;
    var errorMsg = '';
    var unit = '';
    var number = '';

    if (params.units) {
      unit = this._extractFirstUnit(newValue);
      if (!unit || params.units.indexOf(unit) === -1) {
        errorMsg = api.l10n['vInvalidUnit'];
      }
    }

    // validate number with the api.controls.Number method
    number = api.controls.Number.prototype.validate.call(this,
      this._extractFirstNumber(newValue));

    if (number.error) {
      errorMsg += ' ' + number.msg;
    }

    if (errorMsg) {
      return {
        error: true,
        msg: errorMsg
      };
    } else {
      return number.toString() + unit;
    }
  },
  /**
   * @override
   */
  syncUIFromAPI: function (value) {
    if (value !== this._getValueFromUI()) {
      this._setPartialValue(value, 'API');
    }
  },
  /**
   * This function is divided in subfunction to make it easy to reuse part of
   * this control in other controls that extend this, such as `size_dynamic`.
   * @override
   */
  ready: function () {
    this._setDOMelements();
    this._initSliderAndBindInputs();
    // update UI with current values (wait for the slider to be initialized)
    this._updateUIcustomControl(this.setting());
  },
  /**
   * Set DOM element as control properties
   */
  _setDOMelements: function () {
    var container = this._container;
    /** @type {HTMLelement} */
    this.__inputNumber = container.getElementsByClassName('pwpcp-slider-number')[0];
    /** @type {jQuery} */
    this.__$inputUnits = $(container.getElementsByClassName('pwpcp-unit'));
    /** @type {jQuery} */
    this.__$inputSlider = $(container.getElementsByClassName('pwpcp-slider')[0]);
  },
  /**
   * Init slider and bind input UI.
   */
  _initSliderAndBindInputs: function () {
    var self = this;
    var params = self.params;
    var inputNumber = self.__inputNumber;
    var $inputSlider = self.__$inputSlider;

    // Bind click action to unit picker
    // (only if there is more than one unit allowed)
    if (params.units && params.units.length > 1) {
      var $inputUnits = self.__$inputUnits;
      $inputUnits.on('click', function () {
        $inputUnits.removeClass('pwpcp-current');
        this.className += ' pwpcp-current';
        self._setPartialValue({ _unit: this.value });
      });
    }

    // Bind number input
    inputNumber.onchange = function () {
      var value = this.value;
      $inputSlider.slider('value', value);
      self._setPartialValue({ _number: value });
    };

    // Init Slider
    var sliderOptions = params.attrs || {};
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
  },
  /**
   * Extract first found unit from value
   * @param  {?string} value [description]
   * @return {?string}       [description]
   */
  _extractFirstUnit: function (value) {
    var valueOrigin = value || this.setting();
    var matchesUnit = api.Regexes._extractUnit.exec(valueOrigin);
    if (matchesUnit && matchesUnit[1]) {
      return matchesUnit[1];
    }
    return null;
  },
  /**
   * Extract first number found in value
   * @param  {?string|number} value [description]
   * @return {?string}              [description]
   */
  _extractFirstNumber: function (value) {
    var valueOrigin = value || this.setting();
    var matchesNumber = api.Regexes._extractNumber.exec(valueOrigin);
    if (matchesNumber && matchesNumber[0]) {
      return matchesNumber[0];
    }
    return null;
  },
  /**
   * Get current `setting` value from DOM or from given arg
   * @param  {Object<string,string>} value An optional value formed as
   *                                       `{ number: ?, unit: ? }`
   * @return {string}
   */
  _getValueFromUI: function (value) {
    var output;
    if (value && value._number) {
      output = value._number.toString();
    } else {
      output = this.__inputNumber.value;
    }
    if (this.params.units) {
      if (value && value._unit) {
        output += value._unit;
      } else {
        output += this.__$inputUnits.filter('.pwpcp-current').val();
      }
    }
    return output;
  },
  /**
   * Update UI control
   *
   * Reflect a programmatic setting change on the UI.
   * @param {?string} value Optional, the value from where to extract number and unit,
   *                        uses `this.setting()` if a `null` value is passed.
   */
  _updateUIcustomControl: function (value) {
    var params = this.params;
    var number = this._extractFirstNumber(value);
    var unit = this._extractFirstUnit(value);

    // update number input
    this.__inputNumber.value = number;
    // update number slider
    this.__$inputSlider.slider('value', number);
    // update unit picker
    if (params.units) {
      this.__$inputUnits.removeClass('pwpcp-current').filter(function () {
        return this.value === unit;
      }).addClass('pwpcp-current');
    }
  },
  /**
   * Set partial value
   *
   * Wrap the `setting.set()` function doing some additional stuff.
   *
   * @access private
   * @param  {string} value
   * @param  {string} from  Where the value come from (could be from the UI:
   *                        picker, dynamic fields, expr field) or from the
   *                        API (on programmatic value change).
   */
  _setPartialValue: function (value, from) {
    if (from === 'API') {
      this._updateUIcustomControl(value);
    } else {
      this.setting.set(this._getValueFromUI(value));
    }
  }
});
