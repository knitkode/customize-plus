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
    var params = this.params;
    var attrs = params.attrs;
    var number;
    var unit;
    var _isValidNumber = function (value) {
      return _.isNumber(value) && value >= attrs.min && value <= attrs.max; // k6ie8 \\
    };
    var _isValidUnit = function (value) {
      return params.units.indexOf(value) !== -1;
    };
    var matches = Regexes.sizeWithUnit.exec(newValue);

    // if it has found a number
    if (matches && _isValidNumber(parseInt(matches[1], 10))) { // k6todo allow float ? \\
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
    this.inputNumber.value = params.number;
    // update number slider
    this.$inputSlider.slider('value', params.number);
    // update unit picker
    this.$inputUnits.removeClass('k6-current').filter(function () {
      return (this.textContent || this.innerText) === params.unit; // k6ie8 \\
    }).addClass('k6-current');
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
    this.setting.bind(function () {
      this._updateUI(); // k6todo, this updates the UI also when the value comes ... from the UI \\
    }.bind(this));
  },
  /**
   * On ready
   */
  ready: function (isForTheFirstTimeReady) {
    var setting = this.setting;
    var params = this.params;
    var attrs = params.attrs;
    var inputNumber = this._container.getElementsByClassName('k6-slider-number')[0];
    var $inputUnits = this.container.find('.k6-unit');
    var $inputSlider = this.container.find('.k6-slider');

    /**
     * Set elements as control properties
     *
     */
    /** @type {HTMLelement} */
    this.inputNumber = inputNumber;
    /** @type {jQuery} */
    this.$inputUnits = $inputUnits;
    /** @type {jQuery} */
    this.$inputSlider = $inputSlider;

    /**
     * Bind click action to unit picker
     * (only if there is more than one unit allowed)
     */
    if (params.units.length > 1) {
      $inputUnits.on('click', function () {
        var value = this.textContent || this.innerText; // k6ie8 \\
        $inputUnits.removeClass('k6-current');
        this.className += ' k6-current';
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
    $inputSlider.slider({
      value: params.number,
      min: attrs.min,
      max: attrs.max,
      step: attrs.step,
      slide: function(event, ui) {
        inputNumber.value = ui.value;
      },
      change: function(event, ui) {
        setting.set(ui.value);
      }
    });

    // // if the setting is changed programmatically (i.e. through code)
    // if (isForTheFirstTimeReady) {

    //   // update inputs value
    //   setting.bind(function (value) {
    //     // update number input
    //     inputNumber.value = params.number;
    //     // update number slider
    //     $inputSlider.slider('value', params.number);
    //     // update unit picker
    //     $inputUnits.removeClass('k6-current').filter(function () {
    //       return (this.textContent || this.innerText) === params.unit; // k6ie8 \\
    //     }).addClass('k6-current');
    //   });
    // }
  }
});

api.controlConstructor['k6_slider'] = ControlSlider;