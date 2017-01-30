import $ from 'jquery';
import _ from 'underscore';
import { api } from '../core/api';
import { wpApi } from '../core/globals';
// import ControlBase from './base';

/**
 * Control Icon
 *
 * @class wp.customize.controlConstructor.pwpcp_icon
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = api.controls.Base.extend({
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
    var sanitized = [];
    var singleValues = value.split(',');
    for (var i = 0, l = singleValues.length; i < l; i++) {
      sanitized.push(singleValues[i].trim());
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
    this.__input = this._container.getElementsByClassName('pwpcp-selectize')[0];
    this.__iconSet = this._getIconsSet();

    var selectizeStuff = this._getSelectizeDataFromIconsSet(api.constants[this.__iconSet]);
    this._iconOptions = selectizeStuff._options;
    this._iconGroups = selectizeStuff._groups;

    this._updateUI();
  },
  /**
   * Get Icons set
   * @return {String} [description]
   */
  _getIconsSet: function () {
    var choices = this.params.choices;
    if (_.isString(choices)) {
      return choices;
    }
    // @@todo api error? \\
  },
  /**
   * Get selectize items from icon set
   * @param  {Object} set
   * @return {Object<Array,Array>}
   */
  _getSelectizeDataFromIconsSet: function (set) {
    var selectizeOptions = [];
    var selectizeGroups = [];
    for (var groupId in set) {
      if (set.hasOwnProperty(groupId)) {
        var group = set[groupId];
        selectizeGroups.push({
          id: groupId,
          label: group.label
        });
        var icons = group.icons;
        for (var i = 0; i < icons.length; i++) {
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
      // maxItems: 10,
      persist: false,
      hideSelected: true,
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
      }
    })
    .on('change', function () {
      setting.set(this.value);
    });
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
    return '<div class="pwpcpui-tooltip--top" title="' + escape(value) + '">' +
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
    return '<div class="pwpcp-icon-selectOption pwpcpui-tooltip--top" title="' + escape(value) + '">' +
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
    return '<div class="pwpcp-icon-selectHeader">' + escape(data.label) + '</div>';
  },
  /**
   * Get icon class name
   * @param  {[type]} icon [description]
   * @return {[type]}      [description]
   */
  _getIconClassName: function (icon) {
    var iconsSetName = this.__iconSet;
    return iconsSetName + ' ' + iconsSetName + '-' + icon;
  }
});

export default wpApi.controlConstructor['pwpcp_icon'] = api.controls.Icon = Control;
