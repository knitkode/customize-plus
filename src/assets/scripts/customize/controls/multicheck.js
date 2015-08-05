/* global ControlBase */

/**
 * Control Multicheck
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
var ControlMulticheck = ControlBase.extend({
  /**
   * Validate
   *
   * @param  {string|array} rawNewValue Value of the checkbox clicked or sent
   *                                    through js API
   * @return {string} A JSONified Array
   */
  _validate: function (rawNewValue) {
    var newValue;
    try {
      newValue = JSON.parse(rawNewValue);
    } catch(e) {
      newValue = rawNewValue;
      // console.warn('Control->Multicheck: Failed to parse a supposed-to-be JSON value', rawNewValue, e);
    }
    var params = this.params;
    var lastValueAsArray = JSON.parse(this.setting());
    /**
     * Validate string
     * @return {string}
     */
    var _validateString = function () {
      var index = lastValueAsArray.indexOf(newValue);

      // if the checkbox ticked was in the last value array remove it
      if (index !== -1) {
        lastValueAsArray.splice(index, 1);
      // otherwise push it
      } else {
        // only if it is an allowed choice...
        if (params.choices[newValue]) {
          lastValueAsArray.push(newValue);
        }
      }
      return JSON.stringify(lastValueAsArray);
    };
    /**
     * Validate array
     * @return {string}
     */
    var _validateArray = function () {
      var validArray = [];
      var validArrayAsString;
      for (var i = 0; i < newValue.length; i++) {
        // only if it is an allowed choice...
        if (params.choices[ newValue[i] ]) {
          validArray.push( newValue[i] );
        }
      }
      validArrayAsString = JSON.stringify(validArray);
      return validArrayAsString;
    };
    // check type and do appropriate validation
    if (_.isString(newValue)) {
      return _validateString();
    } else if(_.isArray(newValue)){
      return _validateArray();
    } else {
      // @@todo maybe throws exception? \\
      return lastValueAsArray;
    }
  },
  /**
   * On initialization
   *
   * Add custom validation function overriding the empty function from WP API.
   * Update checkboxes status if the setting is changed programmatically.
   *
   * @override
   */
  onInit: function () {
    this.setting.validate = this._validate.bind(this);

    this.setting.bind(function () {
      if (this.rendered) {
        this._syncCheckboxes();
      }
    }.bind(this));
  },
  /**
   * On ready
   *
   * @override
   */
  ready: function () {
    this.__inputs = this._container.getElementsByTagName('input');

    // sync checked state on checkboxes on ready and bind (argument `true`)
    this._syncCheckboxes(true);
  },
  /**
   * Sync checkboxes and maybe bind change event
   * We need to be fast here, use vanilla js.
   *
   * @param  {boolean} bindAsWell Bind on change?
   */
  _syncCheckboxes: function (bindAsWell) {
    var valueAsArray = JSON.parse(this.setting());
    for (var i = 0, l = this.__inputs.length; i < l; i++) {
      var input = this.__inputs[i];
      input.checked = valueAsArray.indexOf(input.value) !== -1;
      if (bindAsWell) {
        input.onchange = function (event) {
          this.setting.set(event.target.value);
        }.bind(this);
      }
    }
  }
});

wpApi['controlConstructor']['pwpcp_multicheck'] = ControlMulticheck;