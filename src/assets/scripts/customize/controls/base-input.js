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
   * On validation error
   * @override
   * @param  {object<string,boolean|string>} errorObject `{ error: true, msg: string }`
   */
  _onValidateError: function (errorObject) {
    this.__input.style.cssText = 'border-color: #c00; background: #fff9f9; box-shadow: 0 0 4px #c00;';
    this.__inputFeedback.style.color = '#c00';
    if (_.isString(errorObject.msg)) {
      this.__inputFeedback.innerHTML = errorObject.msg;
    }
  },
  /**
   * On validation success
   * @override
   */
  _onValidateSuccess: function () {
    this.__input.removeAttribute('style');
    this.__inputFeedback.removeAttribute('style');
    this.__inputFeedback.innerHTML = '';
  },
  /**
   * Sync UI with value coming from API, a programmatic change like a reset.
   * @override
   * @param {string} value The new setting value.
   */
  syncUIFromAPI: function (value) {
    // here value can be undefined if it doesn't pass the validate function
    if (value && this.__input.value !== value) {
      this.__input.value = value;
    }
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
    var self = this;
    $(self.__input)
      .val(self.setting())
      .on('change keyup paste', function () {
        self.setting.set(this.value);
      });
  }
});