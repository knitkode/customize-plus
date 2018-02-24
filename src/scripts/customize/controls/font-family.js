import _ from 'underscore';
import $ from 'jquery';
import { api, wpApi } from '../core/globals';
import Helper from '../core/helper';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import BaseSet from './base-set';

/**
 * Font Family Control
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_font_family`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class FontFamily
 *
 * @extends controls.BaseSet
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 * @requires Helper
 */
class FontFamily extends BaseSet {

  constructor (id, args) {
    super(id, args);

    this.validate = Validate.fontFamily;
    this.sanitize = Sanitize.fontFamily;
  }

  /**
   * Always quote all font families
   *
   * @override
   */
  componentInit () {
    super.componentInit();

    this._options = _.map(this._options, option => {
      option.value = Helper.normalizeFontFamily(option.value);
      return option;
    });
    this._validChoices = _.map(this._validChoices, value => Helper.normalizeFontFamily(value));
  }

  /**
   * @override
   */
  softenize ($value) {
    if (_.isArray($value)) {
      $value = $value.join(',');
    }
    return $value;
  }

  /**
   * @override
   */
  shouldComponentUpdate ($value) {
    return !_.isEqual(this.softenize($value), this.__input.selectize.getValue());
  }

  /**
   * @override
   */
  componentDidUpdate ($value) {
    this._initUI(this.softenize($value));
  }

  /**
   * @override
   */
  componentDidMount () {
    this.__input = this._container.getElementsByClassName('kkcp-select')[0];
    this._initUI(this.setting());
  }

  /**
   * @override
   */
  _initUI (value) {
    // this is due to a bug, we should use:
    // this.__input.selectize.setValue(value, true);
    // @see https://github.com/brianreavis/selectize.js/issues/568
    // instead here first we have to destroy thene to reinitialize, this
    // happens only through a programmatic change such as a reset action
    if (this.__input.selectize) {
      this.__input.selectize.destroy();
    }

    this.__input.value = value;

    // init select plugin
    $(this.__input).selectize(this._getSelectOpts());
  }

  /**
   * @override
   */
  _getSelectCustomOpts () {
    return {
      hideSelected: true,
      delimiter: ',',
    }
  }

  /**
   * @override
   */
  _renderItem (data) {
    const label = data.value.replace(/'/g, '').replace(/"/g, '');
    const value = _.escape(data.value);
    return `<div style="font-family:${value}">${_.escape(label)}</div>`;
  }

  /**
   * @override
   */
  _renderOption (data) {
    const label = data.value.replace(/'/g, '').replace(/"/g, '');
    const value = _.escape(data.value);
    return `<div style="font-family:${value}">${_.escape(label)}</div>`;
  }

  /**
   * @override
   */
  _renderGroupHeader (data) {
    return `<div class="kkcp-icon-selectHeader">${_.escape(data.label)}</div>`;
  }

  /**
   * @override
   */
  _tpl() {
    return `
      <label>
        ${this._tplHeader()}
      </label>
      <input class="kkcp-select" type="text">
    `;
  }
}

export default wpApi.controlConstructor['kkcp_font_family'] = api.controls.FontFamily = FontFamily;
