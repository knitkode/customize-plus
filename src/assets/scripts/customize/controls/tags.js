/* global Utils */

/**
 * Control Tags class
 *
 * @class wp.customize.controlConstructor.pwpcp_tags
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires api.Utils
 */
wpApi.controlConstructor.pwpcp_tags = api.controls.Base.extend({
  /**
   * @override
   */
  validate: function (rawNewValue) {
    if (_.isString(rawNewValue)) {
      var newValue = rawNewValue;
      newValue = _.map(newValue.split(','), function (string) {
        return string.trim();
      });
      newValue = _.uniq(newValue);
      var maxItems = this.params.selectize.maxItems;
      if (maxItems && _.isNumber(maxItems)) {
        if (newValue.length > maxItems) {
          newValue = newValue.slice(0, maxItems);
        }
      }
      return Utils._stripHTML(newValue.join(','));
    }
    return { error: true };
  },
  /**
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
   * @override
   */
  syncUIFromAPI: function (value) {
    var selectize = this.__input.selectize;
    if (selectize && selectize.getValue() !== value) {
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
