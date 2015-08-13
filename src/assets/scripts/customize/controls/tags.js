/**
 * Control Tags class
 *
 * @constructor
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
wpApi.controlConstructor.pwpcp_tags = api.controls.Base.extend({
  /**
   * Validate
   *
   * @param  {string} rawNewValue
   * @return {string|object<string,boolean>} The new value if it is a string
   *                                         or the error object.
   */
  validate: function (rawNewValue) {
    if (_.isString(rawNewValue)) {
      return Utils.stripHTML(rawNewValue);
    } else {
      return { error: true };
    }
  },
  /**
   * On deflate
   *
   * Destroy `selectize` instance if any.
   *
   * @override
   */
  onDeflate: function () {
    if (this.__input && this.__input.selectize) {
      this.__input.selectize.destroy();
    }
  },
  /**
   * On initialization
   *
   * Update tags status if the setting is changed programmatically.
   *
   * @override
   */
  syncUIFromAPI: function (value) {
    var selectize = this.__input ? this.__input.selectize : null;
    if (this.rendered && selectize && selectize.getValue() !== value) {
      this.__input.value = value;
      // this is due to a bug, we should use:
      // selectize.setValue(value, true);
      // but @see https://github.com/brianreavis/selectize.js/issues/568
      // so first we have to destroy thene to reinitialize, this happens
      // only through a programmatic change such as a reset action
      selectize.destroy();
      this._initSelectize();
    }
  },
  /**
   * On ready
   *
   * @override
   */
  ready: function () {
    this.__input = this._container.getElementsByTagName('input')[0];

    // fill input before to initialize selectize
    // so it grabs the value directly from the DOM
    this.__input.value = this.setting();

    this._initSelectize();
  },
  /**
   * Init selectize on text input
   */
  _initSelectize: function () {
    var setting = this.setting;
    var selectize = this.params.selectize || {};
    var options = _.extend({
      persist: false,
      create: function (input) {
        return {
          value: input,
          text: input
        };
      },
      onChange: function (value) {
        setting.set(value);
      }
    }, selectize);

    $(this.__input).selectize(options);
  }
});