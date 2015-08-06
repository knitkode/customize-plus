/* global ControlBase */

/**
 * Control Select class
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
var ControlSelect = ControlBase.extend({
  /**
   * Validate
   *
   * @param  {string} newValue
   * @return {string} The new value if is an allowed choice or the last value
   */
  _validate: function (newValue) {
    if (Object.keys(this.params.choices).indexOf(newValue) !== -1) {
      return newValue;
    } else {
      return this.setting();
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
    if (this.__select && this.__select.selectize) {
      this.__select.selectize.destroy();
    }
  },
  /**
   * On initialization
   *
   * Update select status if the setting is changed programmatically.
   *
   * @override
   */
  onInit: function () {
    this.setting.validate = this._validate.bind(this);

    this.setting.bind(function () {
      if (this.rendered) {
        this._syncOptions();
      }
    }.bind(this));
  },
  /**
   * On ready
   *
   */
  ready: function () {
    var select = this._container.getElementsByTagName('select')[0];
    this.__options = this._container.getElementsByTagName('option');

    // sync selected state on options on ready
    this._syncOptions();

    var selectize = this.params.selectize;
    if (selectize) {
      this.__$select = $(select);
      var options = _.isObject(selectize) ? selectize : {};
      // var options = _.isObject(selectize) ? _.extend({
      // }, selectize) : {};
      this.__$select.selectize(options);
      // this.__$select.selectize.setValue(this.setting());
    }

    // bind select on ready
    select.onchange = function (event) {
      this.setting.set(event.target.value);
    }.bind(this);
  },
  /**
   * Sync options and maybe bind change event
   * We need to be fast here, use vanilla js.
   * We do a comparison with two equals `==`
   * because sometimes we want to compare `500` to `'500'`
   * (like in the font-weight dropdown) and return true from that.
   */
  _syncOptions: function () {
    var value = this.setting();
    for (var i = 0, l = this.__options.length; i < l; i++) {
      var option = this.__options[i];
      option.selected = value == option.value;
    }
  }
});

wpApi['controlConstructor']['pwpcp_select'] = ControlSelect;
