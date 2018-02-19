import $ from 'jquery';
import { api, wpApi } from '../core/globals';
import Helper from '../core/helper';
import Sanitize from '../core/sanitize';
import ControlBaseSet from './base-set';

/**
 * Font Family Control
 *
 * @class api.controls.FontFamily
 * @alias wp.customize.controlConstructor.kkcp_font_family
 * @extends api.controls.BaseSet
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class ControlFontFamily extends ControlBaseSet {

  /**
   * @override
   * @param  {string|array} value
   * @return {array} $validity
   */
  validate (value) {
    if ( _.isString(value)) {
      value = value.split(',');
    }
    return super.validate(value);
  }

  /**
   * @override
   * @return {string}
   */
  sanitize (value) {
    return Sanitize.fontFamily(value, this.setting, this);
  }

  /**
   * Always quote all font families
   * @override
   */
  onInit () {
    super.onInit();

    this._options = _.map(this._options, option => {
      option.value = Helper.normalizeFontFamily(option.value);
      return option;
    });
    this._validChoices = _.map(this._validChoices, value => Helper.normalizeFontFamily(value));

    this.params['vInitial'] = Sanitize.fontFamily(this.params['vInitial']);
    this.params['vFactory'] = Sanitize.fontFamily(this.params['vFactory']);
  }

  /**
   * @override
   */
  syncUI (value) {
    if (_.isArray(value)) {
      value = value.join(',');
    }
    if (!_.isEqual(value, this.__input.selectize.getValue())) {
      this._initUI(value);
    }
  }

  /**
   * @override
   */
  ready () {
    this.__input = this._container.getElementsByClassName('kkcp-selectize')[0];
    this._initUI(this.setting());
  }

  /**
   * When the value is not set by the UI directly we need to destroy selectize
   * and recreate it to sync the UI correctly.
   *
   * @override
   */
  _initUI (value) {
    // if there is an instance of selectize destroy it
    if (this.__input.selectize) {
      this.__input.selectize.destroy();
    }

    this.__input.value = Sanitize.fontFamily(value);

    // init selectize plugin
    const opts = this._getSelectizeOpts();

    $(this.__input).selectize(this._getSelectizeOpts());
  }

  /**
   * @override
   */
  _getSelectizeCustomOpts () {
    return {
      hideSelected: true,
      delimiter: ',',
    }
  }

  /**
   * @override
   */
  _renderItem (data, escape) {
    const value = escape(data.value);
    return `<div style="font-family:${value}">${value.replace(/'/g, '').replace(/"/g, '')}</div>`;
  }

  /**
   * @override
   */
  _renderOption (data, escape) {
    const value = escape(data.value);
    return `<div style="font-family:${value}">${value.replace(/'/g, '').replace(/"/g, '')}</div>`;
  }

  /**
   * @override
   */
  _renderGroupHeader (data, escape) {
    return `<div class="kkcp-icon-selectHeader">${escape(data.label)}</div>`;
  }

}

export default wpApi.controlConstructor['kkcp_font_family'] = api.controls.FontFamily = ControlFontFamily;
