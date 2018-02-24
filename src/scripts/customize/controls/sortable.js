import _ from 'underscore';
import sprintf from 'locutus/php/strings/sprintf';
import { api, wpApi } from '../core/globals';
import { logError } from '../core/logger';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import BaseChoices from './base-choices';

/**
 * Control Sortable
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_sortable`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Sortable
 *
 * @extends controls.BaseChoices
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 */
class Sortable extends BaseChoices {

  /**
   * @override
   */
  validate (value) {
    return Validate.multipleChoices({}, value, this.setting, this, true);
  }

  /**
   * @override
   */
  sanitize (value) {
    return Sanitize.multipleChoices(value, this.setting, this, true);
  }

  /**
   * @override
   */
  syncUI (value) {
    if (!_.isEqual(value, this.params.lastValue)) {
      this._reorder();
      this.params.lastValue = value;
    }
  }

  /**
   * @override
   */
  ready () {
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
  }

  /**
   * Build items map
   *
   * It creates a sortable items map, a key (grabbed from the `data-value`
   * attribute) with the corresponding DOM element
   *
   * @since   1.0.0
   * @memberof! controls.Sortable#
   * @access protected
   */
  _buildItemsMap () {
    const items = this._container.getElementsByClassName('kkcp-sortable');
    this.__itemsMap = {};

    for (let i = 0, l = items.length; i < l; i++) {
      let itemKey = items[i].getAttribute('data-value');
      this.__itemsMap[itemKey] = {
        _sortable: items[i]
      };
    }
  }

  /**
   * Manually reorder the sortable list, needed when a programmatic change
   * is triggered. Unfortunately jQuery UI sortable does not have a method
   * to keep in sync the order of an array and its corresponding DOM.
   *
   * @since   1.0.0
   * @memberof! controls.Sortable#
   * @access protected
   */
  _reorder () {
    const value = this.setting();

    if (!_.isArray(value)) {
      return logError('controls.Sortable->_reorder', `setting.value must be an array`);
    }

    for (let i = 0, l = value.length; i < l; i++) {
      let itemValueAsKey = value[i];
      let item = this.__itemsMap[itemValueAsKey];
      if (item) {
        let itemSortableDOM = item._sortable;
        itemSortableDOM.parentNode.removeChild(itemSortableDOM);
        this._container.appendChild(itemSortableDOM);
      } else {
        logError('controls.Sortable->_reorder', `item '${itemValueAsKey}' has no '_sortable' DOM in 'this.__itemsMap'`);
      }
    }

    this.container.sortable('refresh');
  }

  /**
   * @override
   */
  _tplChoicesLoop() {
    return `
      <# if (_.isArray(data.choicesOrdered)) {
        for (var i = 0; i < data.choicesOrdered.length; i++) {
          var val = data.choicesOrdered[i]; #>
          ${this._tplChoice()}
        <# }
      } #>
    `;
  }

  /**
   * @override
   */
  _tplChoiceUi() {
    return `<div class="kkcp-sortable" title="{{ val }}" data-value="{{ val }}" class="{{ classes }}" {{ attributes }}>{{ label }}</div>`;
  }
}

export default wpApi.controlConstructor['kkcp_sortable'] = api.controls.Sortable = Sortable;
