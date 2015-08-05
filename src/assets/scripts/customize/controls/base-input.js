/* global ControlBase */
/* exported: ControlBaseInput */

/**
 * Control Base Input class
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
var ControlBaseInput = ControlBase.extend({
  /**
   * Validate (private)
   *
   * @param  {string} newValue
   * @return {string|boolean}
   */
  _validate: function (newValue) {
    var validationResult = this.validate(newValue);
    if (validationResult.error) {
      this.__input.style.cssText = 'border-color: #c00; background: #fff9f9; box-shadow: 0 0 4px #c00;';
      this.__inputFeedback.style.color = '#c00';
      if (_.isString(validationResult.msg)) {
        this.__inputFeedback.innerHTML = validationResult.msg;
      }
    } else {
      this.__input.removeAttribute('style');
      this.__inputFeedback.removeAttribute('style');
      this.__inputFeedback.innerHTML = '';
      return newValue;
    }
  },
  /**
   * Validate
   *
   * @abstract To implement in subclasses
   * @param  {string} newValue
   * @return {string|object<boolean,string>}
   */
  validate: function (newValue) {
    // var errorObj = { error: true, msg: '' };
    return newValue;
  },
  /**
   * On initialization
   *
   * Add custom validation function overriding the empty function from WP API.
   * Update input value if the setting is changed programmatically.
   *
   * @override
   */
  onInit: function () {
    this.setting.validate = this._validate.bind(this);

    // here value can be undefined if it doesn't pass the validate function
    this.setting.bind(function (value) {
      if (this.rendered && value && this.__input.value !== value) {
        this.__input.value = value;
      }
    }.bind(this));
  },
  /**
   * On ready
   *
   */
  ready: function () {
    this.__input = this._container.getElementsByTagName('input')[0];
    this.__inputFeedback = this._container.getElementsByClassName('pwpcp-input-feedback')[0];

    // sync value and bind input on ready
    $(this.__input)
      .val(this.setting())
      .on('change keyup paste', function (event) {
        this.setting.set(event.target.value);
      }.bind(this));
  }
});