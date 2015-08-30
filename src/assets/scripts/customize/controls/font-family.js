/**
 * Font Family Control
 *
 * @class wp.customize.controlConstructor.pwpcp_font_family
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
wpApi.controlConstructor.pwpcp_font_family = api.controls.Base.extend({
  /**
   * @override
   * @see php `PWPcp_Sanitize::font_families`
   * @param  {string|array} value [description]
   * @return {string}       [description]
   */
  validate: function (value) {
    // treat value only if it's a string (unlike the php function)
    // because here we always have to get a string.
    if (typeof value === 'string') {
      return value;
    } else {
      return { error: true };
    }
  },
  /**
   * @override
   */
  sanitize: function (value) {
    var fontFamiliesSanitized = [];
    var fontFamilies = value.split(',');
    for (var i = 0, l = fontFamilies.length; i < l; i++) {
      var _fontFamilyUnquoted = fontFamilies[i].replace(/'/g, '').replace(/"/g, '');
      fontFamiliesSanitized.push('\'' + _fontFamilyUnquoted.trim() + '\'');
    }
    return fontFamiliesSanitized.join(',');
  },
  /**
   * @override
   */
  syncUIFromAPI: function (value) {
    if (value !== this.input.value) {
      this._updateUI(value);
    }
  },
  /**
   * Destroy `selectize` instance.
   *
   * @override
   */
  onDeflate: function () {
    if (this.input  && this.input.selectize) {
      this.input.selectize.destroy();
    }
  },
  /**
   * @override
   */
  ready: function () {
    this.input = this._container.getElementsByClassName('pwpcp-selectize')[0];
    this.fontFamilies = api.constants['font_families'].map(function (fontFamilyName) {
      return { item: fontFamilyName };
    });
    this._updateUI();
  },
  /**
   * Update UI
   *
   * @param  {string} value
   */
  _updateUI: function (value) {
    var setting = this.setting;

    // if there is an instance of selectize destroy it
    if (this.input.selectize) {
      this.input.selectize.destroy();
    }

    if (value) {
      this.input.value = value || setting();
    }

    // init selectize plugin
    $(this.input).selectize({
      plugins: ['drag_drop','remove_button'],
      delimiter: ',',
      maxItems: 10,
      persist: false,
      hideSelected: true,
      options: this.fontFamilies,
      labelField: 'item',
      valueField: 'item',
      sortField: 'item',
      searchField: 'item',
      create: function (input) {
        return {
          value: input,
          text: input.replace(/'/g, '') // remove quotes from UI only
        };
      }
    })
    .on('change', function () {
      setting.set(this.value);
    })
    .on('item_remove', function (e,b) {
      if (DEBUG) console.log(this, e, b);
    });
  }
});
