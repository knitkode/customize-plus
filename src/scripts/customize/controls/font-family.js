import $ from 'jquery';
import { api, wpApi } from '../core/globals';
// import ControlBase from './base';

/**
 * Font Family Control
 *
 * @class wp.customize.controlConstructor.kkcp_font_family
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = api.controls.Base.extend({
  /**
   * @override
   * @see php `KKcp_Sanitize::font_families`
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
    var sanitized = [];
    var singleValues = value.split(',');
    for (var i = 0, l = singleValues.length; i < l; i++) {
      var valueUnquoted = singleValues[i].replace(/'/g, '').replace(/"/g, '');
      sanitized.push('\'' + valueUnquoted.trim() + '\'');
    }
    return sanitized.join(',');
  },
  /**
   * @override
   */
  syncUI: function (value) {
    if (value !== this.__input.value) {
      this._updateUI(value);
    }
  },
  /**
   * Destroy `selectize` instance.
   *
   * @override
   */
  onDeflate: function () {
    if (this.__input  && this.__input.selectize) {
      this.__input.selectize.destroy();
    }
  },
  /**
   * @override
   */
  ready: function () {
    this.__input = this._container.getElementsByClassName('kkcp-selectize')[0];
    this._fontFamilies = api.constants['font_families'].map(function (fontFamilyName) {
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
    if (this.__input.selectize) {
      this.__input.selectize.destroy();
    }

    this.__input.value = value || setting();

    // init selectize plugin
    $(this.__input).selectize({
      plugins: ['drag_drop','remove_button'],
      delimiter: ',',
      maxItems: 10,
      persist: false,
      hideSelected: true,
      options: this._fontFamilies,
      labelField: 'item',
      valueField: 'item',
      sortField: 'item',
      searchField: 'item',
      create: function (input) {
        return {
          value: input,
          text: input.replace(/'/g, '') // remove quotes from UI only
        };
      },
      render: {
        item: this._selectizeRenderItemAndOption,
        option: this._selectizeRenderItemAndOption
      }
    })
    .on('change', function () {
      setting.set(this.value);
    })
    .on('item_remove', function (e,b) {
      if (DEBUG) console.log(this, e, b);
    });
  },
  /**
   * Selectize render item and option function
   *
   * @static
   * @param  {Object} data     The selectize option object representation.
   * @param  {function} escape Selectize escape function.
   * @return {string}          The option template.
   */
  _selectizeRenderItemAndOption: function (data, escape) {
    var value = escape(data.item);
    return '<div style="font-family:' + value + '">' + value.replace(/'/g, '').replace(/"/g, '') + '</div>';
  }
});

export default wpApi.controlConstructor['kkcp_font_family'] = api.controls.FontFamily = Control;
