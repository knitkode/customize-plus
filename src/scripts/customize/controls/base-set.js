import _ from 'underscore';
import { api } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
// import ControlBase from './base';

/**
 * Control Base Set class
 *
 * @class api.controls.BaseSet
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = api.controls.Base.extend({
  /**
   * @override
   */
  validate: function (value) {
    return Validate.oneOrMoreChoices({}, value, this.setting, this);
  },
  /**
   * @override
   */
  sanitize: function (value) {
    return Sanitize.oneOrMoreChoices(value, this.setting, this);
  },
  /**
   * @override
   * @see KKcp_Customize_Control_Base_Set->populate_valid_choices where we do
   * kind of the same extraction but a bit differently because we don't need
   * to extract data for the `<select>` field too, and also because in php
   * arrays are just arrays.
   */
  onInit: function () {
    const filteredSets = this._getFilteredSets(this.params.choices);
    const data = this._getSelectDataFromSets(filteredSets);
    this._options = data._options;
    this._groups = data._groups;
    this._validChoices = data._validChoices;
    // console.log(this._validChoices);
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
  ready: function () {
    this.__input = this._container.getElementsByClassName('kkcp-selectize')[0];
    this._initUI();
    this._updateUI(this.setting())
  },
  /**
   * Get set from constants
   *
   * It uses the `setVar` added in `base-set.php` control class
   *
   * @param  {string} name
   * @return {array}
   */
  _getSet: function (name) {
    return api.constants[this.params.setVar][name];
  },
  /**
   * Get flatten set values (bypass the subdivision in groups)
   *
   * @static
   * @param  {object} set
   * @return {array}
   */
  _getFlattenSetValues: function (set) {
    return _.flatten(_.pluck(set, 'values'));
  },
  /**
   * Get filtered sets
   *
   * @param  {mixed}  choices
   * @return {object}
   */
  _getFilteredSets: function (choices) {
    const {supportedSets} = this.params;
    let filteredSets = {};

    for (let i = 0; i < supportedSets.length; i++) {
      let setName = supportedSets[i];
      filteredSets[setName] = this._getFilteredSet(setName, choices);
    }
    return filteredSets;
  },
  /**
   * Get filtered set
   *
   * @param  {string} name
   * @param  {?string|array|object} filter
   * @return {objcet}
   */
  _getFilteredSet: function (name, filter) {
    const set = this._getSet(name);
    let filteredSet = {};

    // choices filter is a single set name
    if (_.isString(filter) && name === filter) {
      filteredSet = set;
    }
    // choices filter is an array of set names
    else if (_.isArray(filter) && filter.indexOf(name) !== -1) {
      filteredSet = set;
    }
    // choices filter is a more complex filter that filters per set
    else if (!_.isUndefined(filter)) {
      for (let filterGroupKey in filter) {
        if (filter.hasOwnProperty(filterGroupKey)) {
          let filterGroups = filter[filterGroupKey];

          // whitelist based on a filter string
          if (_.isString(filterGroups)) {
            // whitelist simply a group by its name
            if (set[filterGroups]) {
              filteredSet[filterGroups] = set[filterGroups];
            } else {
              // whitelist with a quickChoices filter, which filter by values
              // on all the set groups regardless of the set group names.
              let quickChoices = filterGroups.split(',');
              if (quickChoices.length) {
                filteredSet = _.intersection(this._getFlattenSetValues(set), quickChoices);
                // we can break here, indeed, this is a quick filter...
                break;
              }
            }
          }
          // whitelist multiple groups of a set
          else if (_.isArray(filterGroups)) {
            filteredSet = _.pick(set, filterGroups);
          }
          // whitelist specific values per each group of the set
          else if (!_.isUndefined(filterGroups)) {
            for (let filterGroupKey in filterGroups) {
              if (filterGroups.hasOwnProperty(filterGroupKey)) {
                filteredSet[filterGroupKey] = _.intersection(set[filterGroupKey]['values'], filterGroups[filterGroupKey]);
              }
            }
          }
        }
      }
    // choices filter is not present, just use all the set
    } else {
      filteredSet = set;
    }

    return filteredSet;
  },

  /**
   * Get select data for this control from the filtered set
   *
   * Besides the creation of the `options` and `groups` array to populate
   * the `<select>` field we also create the `choices` array. We do this
   * here in order to avoid defining it in each icon php control that would
   * print a lot of duplicated JSON data, since icons sets have usually many
   * entries we just define them globally and then use them as in the other
   * select-like controls on the `params.choices` to provide validation.
   *
   * @param  {object<object>} sets
   * @return {object<array,array,array>}
   */
  _getSelectDataFromSets: function (sets) {
    let options = [];
    let groups = [];
    let validChoices = [];

    for (let setName in sets) {
      if (sets.hasOwnProperty(setName)) {
        let set = sets[setName];

        // set can be a flat array ... (e.g. when is filtered by a quickChoices)
        if (_.isArray(set)) {
          for (let i = 0; i < set.length; i++) {
            let value = set[i];

            options.push({
              value: value,
              set: setName,
            });

            validChoices.push(value);
          }
        // set can be an object, and here we divide the select data in groups
        } else {
          for (let groupId in set) {
            if (set.hasOwnProperty(groupId)) {
              let group = set[groupId];
              groups.push({
                value: groupId,
                label: group['label']
              });
              let values = group['values'];
              for (let i = 0; i < values.length; i++) {
                options.push({
                  value: values[i],
                  group: groupId,
                  set: setName,
                });
                validChoices.push(values[i]);
              }
            }
          }
        }
      }
    }

    return {
      _options: options,
      _groups: groups,
      _validChoices: validChoices,
    };
  },
  /**
   * Get selectize options
   *
   * The select can either have or not have options divided by groups.
   *
   * @return {object}
   */
  _getSelectizeOpts: function () {
    const customOpts = this._getSelectizeCustomOpts();
    let defaultOpts = {
      plugins: ['drag_drop','remove_button'],
      maxItems: this.params.max,
      options: this._options,
      valueField: 'value',
      sortField: 'value',
      searchField: ['value'],
      render: {
        item: this._renderItem.bind(this),
        option: this._renderOption.bind(this)
      },
      onChange: (value) => {
        this.setting.set(value);
      }
    };

    if (this._groups.length) {
      defaultOpts['optgroups'] = this._groups;
      defaultOpts['optgroupField'] = 'group';
      defaultOpts['optgroupValueField'] = 'value';
      defaultOpts['lockOptgroupOrder'] = true;
      defaultOpts['render']['optgroup_header'] = this._renderGroupHeader.bind(this);
    }

    return _.extend(defaultOpts, customOpts, this.params.selectize || {})
  },
  /**
   * Get selectize custom options (subclasses can implement this)
   *
   * @abstract
   * @return {object}
   */
  _getSelectizeCustomOpts: function () {
    return {};
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
    $(this.__input).selectize(this._getSelectizeOpts());
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
   * @abstract
   * @param  {Object} data     The selectize option object representation.
   * @param  {function} escape Selectize escape function.
   * @return {string}          The option template.
   */
  _renderItem: function (data, escape) {
  },
  /**
   * Selectize render option function
   *
   * @abstract
   * @param  {Object} data     The selectize option object representation.
   * @param  {function} escape Selectize escape function.
   * @return {string}          The option template.
   */
  _renderOption: function (data, escape) {
  },
  /**
   * Selectize render option function
   *
   * @abstract
   * @param  {Object} data     The selectize option object representation.
   * @param  {function} escape Selectize escape function.
   * @return {string}          The option template.
   */
  _renderGroupHeader: function (data, escape) {
  },
});

export default api.controls.BaseSet = Control;
