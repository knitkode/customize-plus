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
    var errorMsg = '';
    var unit = '';

    if (params.units) {
      var matchesUnit = Regexes._extractUnit.exec(newValue);
      unit = matchesUnit && matchesUnit[1] ? matchesUnit[1] : null;
      if (!unit || params.units.indexOf(unit) === -1) {
        errorMsg = api.l10n['vInvalidUnit'];
      }
    }
    var matchesNumber = Regexes._extractNumber.exec(newValue);
    var number = matchesNumber && matchesNumber[0] ? matchesNumber[0] : null;
    number = api.controls.Number.prototype.validate.call(this, number);

    if (number.error) {
      errorMsg =+ ' ' + number.msg;
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
      this._updateUI();
    }
  },
  /**
   * @override
   */
  ready: function () {
    var self = this;
    var setting = self.setting;
    var params = self.params;
    var container = self._container;
    var inputNumber = container.getElementsByClassName('pwpcp-slider-number')[0];
    var $inputUnits = $(container.getElementsByClassName('pwpcp-unit'));
    var $inputSlider = $(container.getElementsByClassName('pwpcp-slider')[0]);

    /** @type {HTMLelement} */
    self.__inputNumber = inputNumber;
    /** @type {jQuery} */
    self.__$inputUnits = $inputUnits;
    /** @type {jQuery} */
    self.__$inputSlider = $inputSlider;

    // Bind click action to unit picker
    // (only if there is more than one unit allowed)
    if (params.units && params.units.length > 1) {
      $inputUnits.on('click', function () {
        var unit = this.value;
        $inputUnits.removeClass('pwpcp-current');
        this.className += ' pwpcp-current';
        setting.set(self._getValueFromUI(null, unit));
      });
    }

    // Bind number input
    inputNumber.onchange = function () {
      var number = this.value;
      setting.set(self._getValueFromUI(number, null));
      $inputSlider.slider('value', number);
    };

    // Init Slider
    $inputSlider.slider(_.extend(params.attrs, {
      value: params.number,
      slide: function(event, ui) {
        inputNumber.value = ui.value;
      },
      change: function(event, ui) {
        setting.set(self._getValueFromUI(ui.value));
      }
    }));

    // update UI with current values (wait for the slider to be initialized)
    self._updateUI();
  },
  /**
   * Get current `setting` value from DOM
   * @return {string}
   */
  _getValueFromUI: function (number, unit) {
    var output = number ? number.toString() : this.__inputNumber.value;
    if (this.params.units) {
      output +=  unit || this.__$inputUnits.filter('.pwpcp-current').val();
    }
    return output;
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
    if (params.units) {
      this.__$inputUnits.removeClass('pwpcp-current').filter(function () {
        return this.value === params.unit;
      }).addClass('pwpcp-current');
    }
  }
});