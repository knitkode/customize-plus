import _ from 'underscore';
import { api } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import Base from './base';

/**
 * Control Base Set class
 *
 * Unlike its PHP respective class KKcp_Customize_Control_Base_Set this does not
 * extends the BaseChoices class because we don't actually share anything with
 * it. In fact the data `min`, `max`, `choices` come from PHP anyway and the
 * population of the valid choices uses a different approach here.
 *
 * @since  1.0.0
 *
 * @memberof controls
 *
 * @extends controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 */
class BaseSet extends Base {

  constructor (id, args) {
    super(id, args);

    this.validate = Validate.oneOrMoreChoices;
    this.sanitize = Sanitize.oneOrMoreChoices;

  }

  /**
   * @see KKcp_Customize_Control_Base_Set->populate_valid_choices where we do
   * kind of the same extraction but a bit differently because we don't need
   * to extract data for the `<select>Select</select>` field too, and also
   * because in php arrays are just arrays.
   *
   * @override
   */
  componentInit () {
    const filteredSets = this._getFilteredSets(this.params.choices);
    const data = this._getSelectDataFromSets(filteredSets);
    this._options = data._options;
    this._groups = data._groups;
    this._validChoices = data._validChoices;
    // console.log(this._validChoices);
  }

  /**
   * @override
   */
  shouldComponentUpdate ($value) {
    if (_.isString($value)) {
      $value = [$value];
    }
    return !_.isEqual(value, this._getValueFromUI());
  }

  /**
   * @override
   */
  componentDidUpdate ($value) {
    this._updateUI($value);
  }

  /**
   * @override
   */
  componentWillUnmount () {
    if (this.__input  && this.__input.selectize) {
      this.__input.selectize.destroy();
    }
  }

  /**
   * @override
   */
  componentDidMount () {
    this.__input = this._container.getElementsByClassName('kkcp-select')[0];
    this._initUI();
    this._updateUI(this.setting())
  }

  /**
   * Get set from constants
   *
   * It uses the `setVar` added in `base-set.php` control class
   *
   * @since   1.0.0
   *
   * @param  {string} name
   * @return {Object}
   */
  _getSet (name) {
    return api.constants[this.params.setVar][name];
  }

  /**
   * Get flatten set values (bypass the subdivision in groups)
   *
   * @since   1.0.0
   * @static
   *
   * @param  {Object} set
   * @return {Array}
   */
  _getFlattenSetValues (set) {
    return _.flatten(_.pluck(set, 'values'));
  }

  /**
   * Get filtered sets
   *
   * @since   1.0.0
   *
   * @param  {mixed}  choices
   * @return {Object}
   */
  _getFilteredSets (choices) {
    const {supportedSets} = this.params;
    let filteredSets = {};

    for (let i = 0; i < supportedSets.length; i++) {
      let setName = supportedSets[i];
      filteredSets[setName] = this._getFilteredSet(setName, choices);
    }
    return filteredSets;
  }

  /**
   * Get filtered set
   *
   * @since   1.0.0
   *
   * @param  {string} name
   * @param  {?string|Array|Object} filter
   * @return {Object}
   */
  _getFilteredSet (name, filter) {
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
  }

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
   * @since   1.0.0
   *
   * @param  {Object<Object>} sets
   * @return {Object<string,Array<string>,string,Array<string>,string,Array<string>>}
   */
  _getSelectDataFromSets (sets) {
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
  }

  /**
   * Get select options
   *
   * The select can either have or not have options divided by groups.
   *
   * @since   1.0.0
   *
   * @return {Object}
   */
  _getSelectOpts () {
    const customOpts = this._getSelectCustomOpts();

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

    return _.extend(defaultOpts, customOpts)
  }

  /**
   * Get select custom options (subclasses can implement this)
   *
   * @since   1.0.0
   * @abstract
   *
   * @return {Object}
   */
  _getSelectCustomOpts () {
    return {};
  }

  /**
   * Init UI
   *
   * @since   1.0.0
   */
  _initUI () {
    if (this.__input.selectize) {
      this.__input.selectize.destroy();
    }

    $(this.__input).selectize(this._getSelectOpts());
  }

  /**
   * Get value from UI
   *
   * @since   1.0.0
   *
   * @return {?string|Array}
   */
  _getValueFromUI () {
    if (!this.__input) {
      return null;
    }
    if (this.__input.selectize) {
      return this.__input.selectize.getValue();
    }
    return null; // @@note this should not happen \\
  }

  /**
   * Update UI
   *
   * Pass `true` as second argument to perform a `silent` update, that does
   * not trigger the `onChange` event.
   *
   * @since   1.0.0
   *
   * @param  {string|Array} value
   */
  _updateUI (value) {
    if (this.__input.selectize) {
      this.__input.selectize.setValue(value, true);
    } else {
      this._initUI();
      this._updateUI(value);
    }
  }

  /**
   * Select render item function
   *
   * @since   1.0.0
   * @abstract
   *
   * @param  {Object} data     The selct option object representation.
   * @return {string}          The option template.
   */
  _renderItem (data) {}

  /**
   * Select render option function
   *
   * @since   1.0.0
   * @abstract
   *
   * @param  {Object} data     The selct option object representation.
   * @return {string}          The option template.
   */
  _renderOption (data) {}

  /**
   * Select render option function
   *
   * @since   1.0.0
   * @abstract
   *
   * @param  {Object} data     The select option object representation.
   * @return {string}          The option template.
   */
  _renderGroupHeader (data) {}

}

export default /*api.controls.BaseSet =*/ BaseSet;
