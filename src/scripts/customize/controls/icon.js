import $ from 'jquery';
import _ from 'underscore';
import sprintf from 'locutus/php/strings/sprintf';
import { api, wpApi } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
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
   * @return {array} $validity
   */
  validate: function (value) {
    return Validate.oneOrMoreChoices([], value, this.setting, this);
  },
  /**
   * @override
   * @return {string|array}
   */
  sanitize: function (value) {
    return Sanitize.oneOrMoreChoices(value);
  },
  /**
   * @override
   */
  syncUI: function (value) {
    if (_.isString(value)) {
      value = [value];
    }
    if (!_.isEqual(value, this._getValueFromUI())) {
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
  onInit: function () {
    this._iconSet = this._getIconsSet();
    const data = this._extractDataFromIconsSet(api.constants[this._iconSet]);
    this._options = data._options;
    this._groups = data._groups;
    this.params.choices = data._choices;
  },
  /**
   * @override
   */
  ready: function () {
    this.__input = this._container.getElementsByClassName('kkcp-selectize')[0];
    this._initUI();
    this._updateUI(this.setting())
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
   * Extract data for this control from the icon set
   *
   * Besides the creation of the `options` and `groups` array to populate
   * the `<select>` field we also create the `choices` array. We do this
   * here in order to avoid defining it in each icon php control that would
   * print a lot of duplicated JSON data, since icons sets have usually many
   * entries we just define them globally and then use them as in the other
   * select-like controls on the `params.choices` to provide validation.
   *
   * @param  {object} set
   * @return {object<array,array,array>}
   */
  _extractDataFromIconsSet: function (set) {
    let options = [];
    let groups = [];
    let choices = [];

    for (let groupId in set) {
      if (set.hasOwnProperty(groupId)) {
        let group = set[groupId];
        groups.push({
          id: groupId,
          label: group.label
        });
        let icons = group.icons;
        for (let i = 0; i < icons.length; i++) {
          options.push({
            id: icons[i],
            group: groupId
          });
          choices.push(icons[i]);
        }
      }
    }
    return {
      _options: options,
      _groups: groups,
      _choices: choices,
    };
  },
  /**
   * Init UI
   */
  _initUI: function () {
    // if there is an instance of selectize destroy it
    if (this.__input.selectize) {
      this.__input.selectize.destroy();
    }

    // @@note this is not needed, in case if it was the setting value should be
    // transformed to a string probably \\
    // this.__input.value = this.setting();

    // init selectize plugin
    $(this.__input).selectize(_.extend({
      plugins: ['drag_drop','remove_button'],
      maxItems: this.params.max,
      options: this._options,
      optgroups: this._groups,
      optgroupField: 'group',
      optgroupValueField: 'id',
      lockOptgroupOrder: true,
      valueField: 'id',
      sortField: 'id',
      searchField: ['id'],
      render: {
        item: this._renderItem.bind(this),
        option: this._renderOption.bind(this),
        optgroup_header: this._renderGroupHeader.bind(this),
      },
      onChange: (value) => {
        this.setting.set(value);
      }
    }, this.params.selectize || {}));
  },
  /**
   * Get value from UI
   *
   * @return {?array}
   */
  _getValueFromUI () {
    if (!this.__input) {
      return null;
    }
    const selectize = this.__input.selectize;
    if (selectize) {
      return selectize.getValue();
    }
    return null; // @@note this should not happen \\
  },
  /**
   * Update UI
   *
   * Check if there is an instance of selectize otherwise reinitialise it.
   * Pass `true` as second argument to perform a `silent` update, that does
   * not trigger the `onChange` event of `selectize`.
   *
   * @param  {array} value
   */
  _updateUI: function (value) {
    if (this.__input.selectize) {
      this.__input.selectize.setValue(value, true);
    } else {
      this._initUI();
      this._updateUI(value);
    }
  },
  /**
   * Selectize render item function
   *
   * @param  {Object} data     The selectize option object representation.
   * @param  {function} escape Selectize escape function.
   * @return {string}          The option template.
   */
  _renderItem: function (data, escape) {
    var value = data.id;
    return '<div class="kkcp-icon-selectItem kkcpui-tooltip--top" title="' + escape(value) + '">' +
        '<i class="' + escape(this._getIconClassName(value)) + '"></i>' +
      '</div>';
  },
  /**
   * Selectize render option function
   *
   * @param  {Object} data     The selectize option object representation.
   * @param  {function} escape Selectize escape function.
   * @return {string}          The option template.
   */
  _renderOption: function (data, escape) {
    var value = data.id;
    return '<div class="kkcp-icon-selectOption kkcpui-tooltip--top" title="' + escape(value) + '">' +
        '<i class="' + escape(this._getIconClassName(value)) + '"></i>' +
      '</div>';
  },
  /**
   * Selectize render option function
   *
   * @param  {Object} data     The selectize option object representation.
   * @param  {function} escape Selectize escape function.
   * @return {string}          The option template.
   */
  _renderGroupHeader: function (data, escape) {
    return '<div class="kkcp-icon-selectHeader">' + escape(data.label) + '</div>';
  },
  /**
   * Get icon class name
   *
   * @param  {string} icon
   * @return {string}
   */
  _getIconClassName: function (icon) {
    return `${this._iconSet} ${this._iconSet}-${icon}`;
  }
});

export default wpApi.controlConstructor['kkcp_icon'] = api.controls.Icon = Control;
