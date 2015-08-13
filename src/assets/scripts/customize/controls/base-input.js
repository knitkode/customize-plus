/**
 * Control Base Input class
 *
 * @constructor
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
// export to our API
api.controls.BaseInput = api.controls.Base.extend({
  /**
   * Validate value
   *
   * @abstract To implement in subclasses
   * @param  {string} newValue
   * @return {string|object<boolean,string>}
   */
  _validateValue: function (newValue) {
    // var errorObj = { error: true, msg: '' };
    return newValue;
  },
  /**
   * Validate (private)
   *
   * @param  {string} newValue
   * @return {string|boolean}
   */
  validate: function (newValue) {
    var validationResult = this._validateValue(newValue);
    if (validationResult.error) {
      this.__input.style.cssText = 'border-color: #c00; background: #fff9f9; box-shadow: 0 0 4px #c00;';
      this.__inputFeedback.style.color = '#c00';
      if (_.isString(validationResult.msg)) {
        this.__inputFeedback.innerHTML = validationResult.msg;
      }
      return this.setting();
    } else {
      this.__input.removeAttribute('style');
      this.__inputFeedback.removeAttribute('style');
      this.__inputFeedback.innerHTML = '';
      return newValue;
    }
  },
  /**
   * On initialization
   *
   * Update input value if the setting is changed programmatically.
   *
   * @override
   */
  onInit: function () {
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
   * @override
   */
  ready: function () {
    this.__input = this._container.getElementsByTagName('input')[0];
    this.__inputFeedback = this._container.getElementsByClassName('pwpcp-input-feedback')[0];

    this._syncAndListen();
  },
  /**
   * Sync input and listen for changes
   */
  _syncAndListen: function () {
    $(this.__input)
      .val(this.setting())
      .on('change keyup paste', function (event) {
        this.setting.set(event.target.value);
      }.bind(this));
  }
});