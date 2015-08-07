/* global ControlBaseInput */

/**
 * Control Textarea class
 *
 * @constructor
 * @augments ControlBaseInput
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
wpApi['controlConstructor']['pwpcp_textarea'] = ControlBaseInput.extend({
  /**
   * Validate value
   *
   * @param  {string} newValue
   * @return {string} The new value if it is a string
   */
  _validateValue: function (newValue) {
    if (_.isString(newValue)) {
      if (!this.params.allowHTML) {
        return validator.escape(newValue);
      } else {
        return newValue;
      }
    } else {
      return this.setting();
    }
  },
  /**
   * On ready
   *
   * @override
   */
  ready: function () {
    this.__input = this._container.getElementsByTagName('textarea')[0];
    this.__inputFeedback = this._container.getElementsByClassName('pwpcp-input-feedback')[0];

    this._syncAndListen();
  }
});