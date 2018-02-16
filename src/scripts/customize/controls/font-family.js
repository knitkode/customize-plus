import $ from 'jquery';
import { api, wpApi } from '../core/globals';
import ControlBaseSet from './base-set';
import Sanitize from '../core/sanitize';

/**
 * Font Family Control
 *
 * @class wp.customize.controlConstructor.kkcp_font_family
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = ControlBaseSet.extend({
  /**
   * @override
   * @param  {string|array} value
   * @return {array} $validity
   */
  validate: function (value) {
    if ( _.isString(value)) {
      value = value.split(',');
    }
    return ControlBaseSet.prototype.validate.call(this, value);
  },
  /**
   * @override
   * @return {string}
   */
  sanitize: function (value) {
    return Sanitize.fontFamily(value);
  },
  /**
   * Always quote all font families
   * @override
   */
  onInit: function () {
    ControlBaseSet.prototype.onInit.apply(this);
    this._options = _.map(this._options, option => {
      option.value = Sanitize.normalizeFontFamily(option.value);
      return option;
    });
    this._validChoices = _.map(this._validChoices, value => Sanitize.normalizeFontFamily(value));

    this.params['vInitial'] = Sanitize.fontFamily(this.params['vInitial']);
    this.params['vFactory'] = Sanitize.fontFamily(this.params['vFactory']);
  },
  /**
   * @override
   */
  syncUI: function (value) {
    if (_.isArray(value)) {
      value = value.join(',');
    }
    if (!_.isEqual(value, this.__input.value)) {
      this._updateUI(value);
    }
  },
  /**
   * @override
   */
  ready: function () {
    this.__input = this._container.getElementsByClassName('kkcp-selectize')[0];
    this.__input.value = Sanitize.fontFamily(this.setting());
    this._initUI();
  },
  /**
   * When the value is not set by the UI directly we need to destroy selectize
   * and recreate it to sync the UI correctly.
   *
   * @override
   */
  _updateUI: function (value) {
    this.__input.value = Sanitize.fontFamily(value);
    this._initUI();
  },
  /**
   * @override
   */
  _getSelectizeCustomOpts: function () {
    const self = this;
    return {
      hideSelected: true,
      delimiter: ',',
      persist: false,
      onChange: function () {
        // self.setting.set(this.value);
        self.setting.set(this.getValue());
      },
    }
  },
  /**
   * @override
   */
  _renderItem: function (data, escape) {
    const value = escape(data.value);
    const text = data.text ? escape(data.text) : value;
    return `<div style="font-family:${value}">${text.replace(/'/g, '').replace(/"/g, '')}</div>`;
  },
  /**
   * @override
   */
  _renderOption: function (data, escape) {
    return this._renderItem(data, escape);
  },
  /**
   * @override
   */
  _renderGroupHeader: function (data, escape) {
    return `<div class="kkcp-icon-selectHeader">${escape(data.label)}</div>`;
  },
});

export default wpApi.controlConstructor['kkcp_font_family'] = api.controls.FontFamily = Control;
