/* global Regexes */

/**
 * Control Slider
 *
 * @constructor
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires Regexes
 */
// export to our API and to WordPress API
api.controls.Slider = wpApi.controlConstructor.pwpcp_slider = api.controls.Base.extend({
  /**
   * @override
   */
  validate: function (newValue) {
    var params = this.params;
    var min = params.attrs.min;
    var max = params.attrs.max;
    var number;
    var unit;
    var _isValidNumber = function (value) {
      if (_.isNumber(value)) { // @@ie8 \\
        if (min && max) {
          return value >= min && value <= max;
        } else if (min) {
          return value >= min;
        } else if (max) {
          return value <= max;
        } else {
          return true;
        }
      } else {
        return false;
      }
    };
    var _isValidUnit = function (value) {
      return params.units.indexOf(value) !== -1;
    };
    var matches = Regexes._sizeWithUnit.exec(newValue);

    // if it has found a number
    if (matches && _isValidNumber(parseInt(matches[1], 10))) { // @@todo allow float ? \\
      number = matches[1];
    // otherwise check if the newValue is an ok number
    } else if (_isValidNumber(newValue)) {
      number = newValue;
    // otherwise use the last valid number stored in params
    } else {
      number = params.number;
    }

    // if it has found a unit
    if (matches && _isValidUnit(matches[2])) {
      unit = matches[2];
    // otherwise check if the newValue is an ok unit
    } else if (_isValidUnit(newValue)) {
      unit = newValue;
    // otherwise use the last valid unit stored in params
    } else {
      unit = params.unit;
    }
    // update storage in params
    params.number = number;
    params.unit = unit;
    // return unified string
    return number.toString() + unit;
  },
  /**
   * @override
   */
  syncUIFromAPI: function (value) {
    if (value !== this._getValueFromUI()) {
      this._updateUI();
    }
  },
  /**
   * @override
   */
  ready: function () {
    var setting = this.setting;
    var params = this.params;
    var container = this._container;
    var inputNumber = container.getElementsByClassName('pwpcp-slider-number')[0];
    var $inputUnits = $(container.getElementsByClassName('pwpcp-unit'));
    var $inputSlider = $(container.getElementsByClassName('pwpcp-slider')[0]);

    /** @type {HTMLelement} */
    this.__inputNumber = inputNumber;
    /** @type {jQuery} */
    this.__$inputUnits = $inputUnits;
    /** @type {jQuery} */
    this.__$inputSlider = $inputSlider;

    /**
     * Bind click action to unit picker
     * (only if there is more than one unit allowed)
     */
    if (params.units.length > 1) {
      $inputUnits.on('click', function () {
        var value = this.value;
        $inputUnits.removeClass('pwpcp-current');
        this.className += ' pwpcp-current';
        setting.set(value);
      });
    }

    /**
     * Bind number input
     */
    inputNumber.onchange = function () {
      var value = this.value;
      setting.set(value);
      $inputSlider.slider('value', value);
    };

    /**
     * Init Slider
     */
    $inputSlider.slider(_.extend({
      value: params.number,
      slide: function(event, ui) {
        inputNumber.value = ui.value;
      },
      change: function(event, ui) {
        setting.set(ui.value);
      }
    }, params.attrs));

    // update UI with current values (we have to wait that the jQuery UI
    // slider has been initialized)
    this._updateUI();
  },
  /**
   * Get current `setting` value from DOM
   * @return {string} JSONified array
   */
  _getValueFromUI: function () {
    return this.__inputNumber.value +
      this.__$inputUnits.filter('.pwpcp-current').val();
  },
  /**
   * Update UI
   *
   * Reflect a programmatic setting change on the UI.
   */
  _updateUI: function () {
    var params = this.params;
    // update number input
    this.__inputNumber.value = params.number;
    // update number slider
    this.__$inputSlider.slider('value', params.number);
    // update unit picker
    this.__$inputUnits.removeClass('pwpcp-current').filter(function () {
      return this.value === params.unit;
    }).addClass('pwpcp-current');
  }
});