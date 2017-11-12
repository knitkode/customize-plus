import _ from 'underscore';
import { api, wpApi } from '../core/globals';
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
   */
  validate: function (rawNewValue) {
    var choices = this.params.choices;
    var newValue;
    // it could come as a stringified array through a programmatic change
    // of the setting (i.e. from a a reset action)
    try {
      newValue = JSON.parse(rawNewValue);
    } catch(e) {
      newValue = rawNewValue;
    }
    // validate array of values
    if (_.isArray(newValue)) {
      var validatedArray = [];
      for (var i = 0, l = newValue.length; i < l; i++) {
        var item = newValue[i];
        if (choices.hasOwnProperty(item)) {
          validatedArray.push(item);
        }
      }
      return JSON.stringify(validatedArray);
    }
    else {
      return { error: true };
    }
  },
  /**
   * @override
   */
  syncUI: function (value) {
    if (value !== this.params.lastValue) {
      this._reorder();
      this.params.lastValue = value;
    }
  },
  /**
   * @override
   */
  ready: function () {
    var setting = this.setting;
    var container = this.container;

    this._buildItemsMap();

    this.params.lastValue = this.setting();

    container.sortable({
      items: '.kkcp-sortable',
      cursor: 'move',
      update: function () {
        setting.set(container.sortable('toArray', { attribute: 'title' }));
      }
    });
  },
  /**
   * Build sortable items map, a key (grabbed from the `title` attrbiute)
   * with the corresponding DOM element
   */
  _buildItemsMap: function () {
    var items = this._container.getElementsByClassName('kkcp-sortable');
    this.__itemsMap = {};

    for (var i = 0, l = items.length; i < l; i++) {
      this.__itemsMap[items[i].title] = {
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
    var valueAsArray = JSON.parse(this.setting());

    for (var i = 0, l = valueAsArray.length; i < l; i++) {
      var itemValue = valueAsArray[i];
      var itemDOM = this.__itemsMap[itemValue]._sortable;
      itemDOM.parentNode.removeChild(itemDOM);
      this._container.appendChild(itemDOM);
    }

    this.container.sortable('refresh');
  }
});

export default wpApi.controlConstructor['kkcp_sortable'] = api.controls.Sortable = Control;
