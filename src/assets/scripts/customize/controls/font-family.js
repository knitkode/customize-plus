/**
 * Font Family
 *
 * @constructor
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
wpApi.controlConstructor.pwpcp_font_family = api.controls.Base.extend({
  /**
   * @override
   */
  syncUIFromAPI: function (value) {
    if (value !== this.input.value) {
      this._updateUI(this._sanitize(value));
    }
  },
  /**
   * @override
   */
  ready: function () {
    this.input = this._container.getElementsByClassName('pwpcp-selectize')[0];
    this.fontFamilies = api['constants']['FONT_FAMILIES'].map(function (fontFamilyName) {
      return { item: fontFamilyName };
    });
    this._updateUI();
  },
  /**
   * Destroy `selectize` instance.
   *
   * @override
   */
  onDeflate: function () {
    if (this.rendered && this.input) {
      this.input.selectize.destroy();
    }
  },
  /**
   * @see php `PWPcp_Sanitize::font_families`
   * @param  {string|array} value [description]
   * @return {string}       [description]
   */
  _sanitize: function (value) {
    // treat value only if it's a string (unlike the php function)
    // because here we alway have to get a string.
    if (typeof value === 'string') {
      var fontFamiliesSanitized = [];
      var fontFamilies = value.split(',');
      for (var i = 0, l = fontFamilies.length; i < l; i++) {
        var _fontFamilyUnquoted = fontFamilies[i].replace(/'/g, '').replace(/"/g, '');
        fontFamiliesSanitized.push('\'' + _fontFamilyUnquoted.trim() + '\'');
      }
      return fontFamiliesSanitized.join(',');
    }
  },
  _updateUI: function (value) {
    var setting = this.setting;

    // if there is an instance of selectize destroy it
    if (this.input.selectize) {
      this.onDeflate();
    }

    if (value) {
      this.input.value = value;
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
        console.log(input);
        return {
          value: input,
          text: input.replace(/'/g, '') // remove quotes from UI only
        }
      }
    }).on('change', function () {
      setting.set(this.value);
      // if (this.value)
    }).on('item_remove', function (e,b) {
      console.log(this, e, b);
    });
  }
});