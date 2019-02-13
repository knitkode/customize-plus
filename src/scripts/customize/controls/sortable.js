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

  constructor (id, args) {
    super(id, args);

    this.validate = Validate.sortable;
    this.sanitize = Sanitize.sortable;
  }

  /**
   * @override
   */
  shouldComponentUpdate ($value) {
    return !_.isEqual($value, this._getValueFromUI());
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
  componentDidMount () {
    this._buildItemsMap();

    this.container.sortable({
      items: '.kkcp-sortable',
      cursor: 'move',
      update: () => {
        const value = this._getValueFromUI();
        this.setting.set(value);
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
   * Get value from UI
   *
   * @since   1.1.0
   * @access protected
   *
   * @return {Array}
   */
  _getValueFromUI () {
    return this.container.sortable('toArray', { attribute: 'data-value' });
  }

  /**
   * Update UI
   *
   * Manually reorder the sortable list, needed when a programmatic change
   * is triggered. Unfortunately jQuery UI sortable does not have a method
   * to keep in sync the order of an array and its corresponding DOM.
   *
   * @since   1.0.0
   * @access protected
   *
   * @param {mixed} $value
   */
  _updateUI ($value) {
    const value = this.setting();

    if (!_.isArray($value)) {
      return logError('controls.Sortable->_updateUI', `setting.value must be an array`);
    }

    for (let i = 0, l = $value.length; i < l; i++) {
      let itemValueAsKey = $value[i];
      let item = this.__itemsMap[itemValueAsKey];
      if (item) {
        let itemSortableDOM = item._sortable;
        itemSortableDOM.parentNode.removeChild(itemSortableDOM);
        this._container.appendChild(itemSortableDOM);
      } else {
        logError('controls.Sortable->_updateUI', `item '${itemValueAsKey}' has no '_sortable' DOM in 'this.__itemsMap'`);
      }
    }

    this.container.sortable('refresh');
  }

  /**
   * @override
   */
  _tplChoicesLoop() {
    return `
      <# if (_.isArray(data.choicesOrdered)) { for (var i = 0; i < data.choicesOrdered.length; i++) {
        var val = data.choicesOrdered[i]; #>
        ${this._tplChoice()}
      <# } } #>
    `;
  }

  /**
   * @override
   */
  _tplChoiceUi() {
    return `<div class="kkcp-sortable" title="{{ val }}" data-value="{{ val }}" class="{{ classes }}" {{ attributes }}>{{ label }}</div>`;
  }
}

wpApi.controlConstructor['kkcp_sortable'] = api.controls.Sortable = Sortable;
export default Sortable;
