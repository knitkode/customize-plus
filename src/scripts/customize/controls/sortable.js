import _ from 'underscore';
import sprintf from 'locutus/php/strings/sprintf';
import { api, wpApi } from '../core/globals';
import logger from '../core/logger';
// import ControlBase from './base';

/**
 * Control Sortable
 *
 * @class wp.customize.controlConstructor.kkcp_sortable
 * @alias api.controls.Sortable
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = api.controls.Base.extend({
  /**
   * @override
   * @return {array|object}
   */
  validate: function (value) {
    const choices = this.params.choices;

    // validate array of values
    if (_.isArray(value)) {
      for (let i = 0, l = value.length; i < l; i++) {
        let itemValue = value[i];
        if (!choices.hasOwnProperty(itemValue)) {
          return {
            error: true,
            msg: sprintf(api.l10n['vNotAChoice'], itemValue),
          };
        }
      }
      return value;
    }
    else {
      return {
        error: true,
        msg: api.l10n['vNotArray'],
      };
    }
  },
  /**
   * @override
   * @return {array}
   */
  sanitize: function (value) {
    let sanitizedValue = value;

    // in the edge case it comes as a stringified array
    if (_.isString(value)) {
      try {
        sanitizedValue = JSON.parse(value);
      } catch(e) {
        sanitizedValue = value;
      }
    }

    // coerce in any case to an array, the rest will be dealt during validation
    if (!_.isArray(sanitizedValue)) {
      return [value];
    }

    return sanitizedValue;
  },
  /**
   * @override
   */
  syncUI: function (value) {
    if (!_.isEqual(value, this.params.lastValue)) {
      this._reorder();
      this.params.lastValue = value;
    }
  },
  /**
   * @override
   */
  ready: function () {
    const setting = this.setting;
    const container = this.container;

    this._buildItemsMap();

    this.params.lastValue = this.setting();

    container.sortable({
      items: '.kkcp-sortable',
      cursor: 'move',
      update: function () {
        const newValue = container.sortable('toArray', { attribute: 'data-value' });
        setting.set(newValue);
      }
    });
  },
  /**
   * Build sortable items map, a key (grabbed from the `data-value` attrbiute)
   * with the corresponding DOM element
   */
  _buildItemsMap: function () {
    const items = this._container.getElementsByClassName('kkcp-sortable');
    this.__itemsMap = {};

    for (let i = 0, l = items.length; i < l; i++) {
      let itemKey = items[i].getAttribute('data-value');
      this.__itemsMap[itemKey] = {
        _sortable: items[i]
      };
    }
  },
  /**
   * Manually reorder the sortable list, needed when a programmatic change
   * is triggered. Unfortunately jQuery UI sortable does not have a method
   * to keep in sync the order of an array and its corresponding DOM.
   */
  _reorder: function () {
    const value = this.setting();

    if (!_.isArray(value)) {
      return logger.error('controls.Sortable->_reorder', `setting.value must be an array`);
    }

    for (let i = 0, l = value.length; i < l; i++) {
      let itemValueAsKey = value[i];
      let item = this.__itemsMap[itemValueAsKey];
      if (item) {
        let itemSortableDOM = item._sortable;
        itemSortableDOM.parentNode.removeChild(itemSortableDOM);
        this._container.appendChild(itemSortableDOM);
      } else {
        logger.error('controls.Sortable->_reorder', `item '${itemValueAsKey}' has no '_sortable' DOM in 'this.__itemsMap'`);
      }
    }

    this.container.sortable('refresh');
  }
});

export default wpApi.controlConstructor['kkcp_sortable'] = api.controls.Sortable = Control;
