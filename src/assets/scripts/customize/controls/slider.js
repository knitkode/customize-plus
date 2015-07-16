/* global ControlBase, Regexes */

/**
 * Control Slider
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires Regexes
 */
var ControlSlider = ControlBase.extend({
  /**
   * Validate
   *
   * {@link http://stackoverflow.com/a/175787/1938970 stackoverflow}
   *
   * @param  {string|number} newValue The value that has been set through
   *                                  `control.setting.set(value)`.
   * @return {string} The validate control value.
   */
  _validate: function (newValue) {
    console.info('_validate', newValue);
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
   * Update UI.
   *
   * Reflect a programmatic setting change on the UI, only
   * if the control is rendered.
   *
   * @private
   */
  _updateUI: function () {
    if (!this.rendered) {
      return;
    }
    var params = this.params;
    // update number input
    this.__inputNumber.value = params.number;
    // update number slider
    this.__$inputSlider.slider('value', params.number);
    // update unit picker
    this.__$inputUnits.removeClass('pwpcp-current').filter(function () {
      return (this.textContent || this.innerText) === params.unit; // @@ie8 \\
    }).addClass('pwpcp-current');
  },
  /**
   * On initialization
   *
   * add custom validation function overriding the empty function from WP API.
   *
   * @override
   */
  onInit: function () {
    this.setting.validate = this._validate.bind(this);

    // bind setting change to pass value on apply value
    // if we are programmatically changing the control value
    // for instance through js (during import, debugging, etc.)
    this.setting.bind(function (value) {
      console.info('_updateUI', value);
      this._updateUI(); // @@todo, this updates the UI also when the value comes ... from the UI \\
    }.bind(this));
  },
  /**
   * On ready
   */
  ready: function () {
    var setting = this.setting;
    var params = this.params;
    var container = this._container;
    var inputNumber = container.getElementsByClassName('pwpcp-slider-number')[0];
    var $inputUnits = this.container.find('.pwpcp-unit');
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
        var value = this.textContent || this.innerText; // @@ie8 \\
        $inputUnits.removeClass('pwpcp-current');
        this.className += ' pwpcp-current';
        setting.set(value);
      });
    }

    /**
     * Bind number input
     */
    inputNumber.value = params.number;
    $(inputNumber).on('change', function () {
      var value = this.value;
      setting.set(value);
      $inputSlider.slider('value', value);
    });

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
  }
});

// export to our API and to WordPress API
api['controls']['Slider'] = wpApi['controlConstructor']['pwpcp_slider'] = ControlSlider;
