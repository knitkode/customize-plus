import $ from 'jquery';
import _ from 'underscore';
import sprintf from 'locutus/php/strings/sprintf';
import { api, wpApi } from '../core/globals';
// import ControlBase from './base';

/**
 * Control Icon
 *
 * @class wp.customize.controlConstructor.kkcp_icon
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = api.controls.Base.extend({
  /**
   * @override
   * @param  {string|array} value
   * @return {string}
   */
  validate: function (value) {
    return api.controls['Sortable'].prototype.validate.call(this, value);
  },
  /**
   * @override
   * @return {array|string}
   */
  sanitize: function (value) {
    return api.controls['Sortable'].prototype.sanitize.call(this, value);
  },
  /**
   * @override
   */
  syncUI: function (value) {
    const selectize = this.__input.selectize;
    const valueFromUi = selectize ? this.__input.selectize.getValue() : null; // this._getValueFromUI()
    if (!_.isEqual(value, valueFromUi)) {
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
    this._iconSet = this._getIconsSet();

    const selectizeData = this._getSelectizeDataFromIconsSet(api.constants[this._iconSet]);
    this._iconOptions = selectizeData._options;
    this._iconGroups = selectizeData._groups;

    this._updateUI();
  },
  /**
   * Get Icons set
   * @return {String} [description]
   */
  _getIconsSet: function () {
    const iconsSet = this.params['icons_set'];
    if (_.isString(iconsSet)) {
      return iconsSet;
    }
    // @@todo api error? \\
  },
  /**
   * Get selectize items from icon set
   * @param  {Object} set
   * @return {Object<Array,Array>}
   */
  _getSelectizeDataFromIconsSet: function (set) {
    let selectizeOptions = [];
    let selectizeGroups = [];
    for (let groupId in set) {
      if (set.hasOwnProperty(groupId)) {
        let group = set[groupId];
        selectizeGroups.push({
          id: groupId,
          label: group.label
        });
        let icons = group.icons;
        for (let i = 0; i < icons.length; i++) {
          selectizeOptions.push({
            id: icons[i],
            group: groupId
          });
        }
      }
    }
    return {
      _options: selectizeOptions,
      _groups: selectizeGroups
    };
  },
  /**
   * Update UI
   *
   * @param  {string} value
   */
  _updateUI: function (value) {
    const setting = this.setting;
    const max = this.params.max;
    const selectizeOpts = this.params.selectize || {};

    // if there is an instance of selectize destroy it
    if (this.__input.selectize) {
      this.__input.selectize.destroy();
    }

    this.__input.value = value || setting();

    // init selectize plugin
    $(this.__input).selectize(_.extend({
      plugins: ['drag_drop','remove_button'],
      maxItems: max,
      options: this._iconOptions,
      optgroups: this._iconGroups,
      optgroupField: 'group',
      optgroupValueField: 'id',
      lockOptgroupOrder: true,
      valueField: 'id',
      sortField: 'id',
      searchField: ['id'],
      render: {
        item: this._selectizeRenderItem.bind(this),
        option: this._selectizeRenderOption.bind(this),
        optgroup_header: this._selectizeRenderGroupHeader.bind(this),
      },
      onChange: function (value) {
        setting.set(value);
      }
    }, selectizeOpts));
  },
  /**
   * Selectize render item function
   *
   * @static
   * @param  {Object} data     The selectize option object representation.
   * @param  {function} escape Selectize escape function.
   * @return {string}          The option template.
   */
  _selectizeRenderItem: function (data, escape) {
    var value = data.id;
    return '<div class="kkcp-icon-selectItem kkcpui-tooltip--top" title="' + escape(value) + '">' +
        '<i class="' + escape(this._getIconClassName(value)) + '"></i>' +
      '</div>';
  },
  /**
   * Selectize render option function
   *
   * @static
   * @param  {Object} data     The selectize option object representation.
   * @param  {function} escape Selectize escape function.
   * @return {string}          The option template.
   */
  _selectizeRenderOption: function (data, escape) {
    var value = data.id;
    return '<div class="kkcp-icon-selectOption kkcpui-tooltip--top" title="' + escape(value) + '">' +
        '<i class="' + escape(this._getIconClassName(value)) + '"></i>' +
      '</div>';
  },
  /**
   * Selectize render option function
   *
   * @static
   * @param  {Object} data     The selectize option object representation.
   * @param  {function} escape Selectize escape function.
   * @return {string}          The option template.
   */
  _selectizeRenderGroupHeader: function (data, escape) {
    return '<div class="kkcp-icon-selectHeader">' + escape(data.label) + '</div>';
  },
  /**
   * Get icon class name
   * @param  {[type]} icon [description]
   * @return {[type]}      [description]
   */
  _getIconClassName: function (icon) {
    var iconsSetName = this._iconSet;
    return iconsSetName + ' ' + iconsSetName + '-' + icon;
  }
});

export default wpApi.controlConstructor['kkcp_icon'] = api.controls.Icon = Control;
