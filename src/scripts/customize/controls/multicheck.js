import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import logger from '../core/logger';
// import ControlBase from './base';

/**
 * Control Multicheck
 *
 * @class wp.customize.controlConstructor.kkcp_multicheck
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
    return api.controls['Sortable'].prototype.validate.call(this, value);
  },
  /**
   * @override
   */
  sanitize: function (value) {
    return api.controls['Sortable'].prototype.sanitize.call(this, value);
  },
  /**
   * @override
   */
  syncUI: function (value) {
    if (!_.isEqual(value, this._getValueFromUI())) {
      this._syncCheckboxes();

      if (this.params.sortable) {
        this._reorder();
      }
    }
  },
  /**
   * @override
   */
  ready: function () {
    this.__inputs = this._container.getElementsByTagName('input');

    // special stuff for sortable multicheck controls
    if (this.params.sortable) {
      this.container.sortable({
        items: '> label',
        cursor: 'move',
        update: () => {
          this.setting.set(this._getValueFromUI());
        }
      });

      this._buildItemsMap();
    }

    // sync checked state on checkboxes on ready and bind (argument `true`)
    this._syncCheckboxes(true);
  },
  /**
   * @override
   */
  _buildItemsMap: function () {
    const items = this._container.getElementsByTagName('label');
    this.__itemsMap = {};

    for (let i = 0, l = items.length; i < l; i++) {
      this.__itemsMap[items[i].title] = {
        _sortable: items[i],
        _input: items[i].getElementsByTagName('input')[0]
      };
    }
  },
  /**
   * @override
   */
  _reorder: function () {
    // sort first the checked ones
    api.controls['Sortable'].prototype._reorder.apply(this);

    // then sort the unchecked ones
    const value = this.setting();

    for (let itemValueAsKey in this.params.choices) {
      let item = this.__itemsMap[itemValueAsKey];

      if (item) {
        if (value.indexOf(itemValueAsKey) === -1) {
          let itemSortableDOM = item._sortable;
          itemSortableDOM.parentNode.removeChild(itemSortableDOM);
          this._container.appendChild(itemSortableDOM);
        }
      } else {
        logger.error('controls.Multicheck->_reorder', `item '${itemValueAsKey}' has no '_sortable' DOM in 'this.__itemsMap'`);
      }
    }
  },
  /**
   * Get sorted value, reaading checkboxes status from the DOM
   *
   * @return {array}
   */
  _getValueFromUI: function () {
    let valueSorted = [];

    for (let i = 0, l = this.__inputs.length; i < l; i++) {
      let input = this.__inputs[i];
      if (input.checked) {
        valueSorted.push(input.value);
      }
    }
    return valueSorted;
  },
  /**
   * Sync checkboxes and maybe bind change event
   * We need to be fast here, use vanilla js.
   *
   * @param  {boolean} bindAsWell Bind on change?
   */
  _syncCheckboxes: function (bindAsWell) {
    const value = this.setting();

    if (!_.isArray(value)) {
      return logger.error('controls.Multicheck->_syncCheckboxes', `setting.value must be an array`);
    }

    for (let i = 0, l = this.__inputs.length; i < l; i++) {
      let input = this.__inputs[i];
      input.checked = value.indexOf(input.value) !== -1;
      if (bindAsWell) {
        input.onchange = () => {
          this.setting.set(this._getValueFromUI());
        };
      }
    }
  }
});

export default wpApi.controlConstructor['kkcp_multicheck'] = api.controls.Multicheck = Control;
