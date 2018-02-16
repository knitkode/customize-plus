import $ from 'jquery';
import { api, wpApi } from '../core/globals';
import ControlBaseSet from './base-set';
import Sanitize from '../core/sanitize';
import {Utils} from '../core/utils';

/**
 * Font Family Control
 *
 * @class wp.customize.controlConstructor.kkcp_font_family
 * @constructor
 * @extends api.controls.BaseSet
 * @augments api.controls.Base
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
      option.value = Utils.normalizeFontFamily(option.value);
      return option;
    });
    this._validChoices = _.map(this._validChoices, value => Utils.normalizeFontFamily(value));

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
    if (!_.isEqual(value, this.__input.selectize.getValue())) {
      this._initUI(value);
    }
  },
  /**
   * @override
   */
  ready: function () {
    this.__input = this._container.getElementsByClassName('kkcp-selectize')[0];
    this._initUI(this.setting());
  },
  /**
   * When the value is not set by the UI directly we need to destroy selectize
   * and recreate it to sync the UI correctly.
   *
   * @override
   */
  _initUI: function (value) {
    // if there is an instance of selectize destroy it
    if (this.__input.selectize) {
      this.__input.selectize.destroy();
    }

    this.__input.value = Sanitize.fontFamily(value);

    // init selectize plugin
    const opts = this._getSelectizeOpts();

    $(this.__input).selectize(this._getSelectizeOpts());
  },
  /**
   * @override
   */
  _getSelectizeCustomOpts: function () {
    return {
      hideSelected: true,
      delimiter: ',',
    }
  },
  /**
   * @override
   */
  _renderItem: function (data, escape) {
    const value = escape(data.value);
    return `<div style="font-family:${value}">${value.replace(/'/g, '').replace(/"/g, '')}</div>`;
  },
  /**
   * @override
   */
  _renderOption: function (data, escape) {
    const value = escape(data.value);
    return `<div style="font-family:${value}">${value.replace(/'/g, '').replace(/"/g, '')}</div>`;
  },
  /**
   * @override
   */
  _renderGroupHeader: function (data, escape) {
    return `<div class="kkcp-icon-selectHeader">${escape(data.label)}</div>`;
  },
});

export default wpApi.controlConstructor['kkcp_font_family'] = api.controls.FontFamily = Control;
