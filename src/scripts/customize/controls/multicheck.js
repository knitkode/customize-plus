import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import { logError } from '../core/logger';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import BaseChoices from './base-choices';

/**
 * Control Multicheck
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_multicheck`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Multicheck
 *
 * @extends controls.BaseChoices
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 */
class Multicheck extends BaseChoices {

  /**
   * @override
   */
  validate (value) {
    return Validate.multipleChoices({}, value, this.setting, this);
  }

  /**
   * @override
   */
  sanitize (value) {
    return Sanitize.multipleChoices(value, this.setting, this);
  }

  /**
   * @override
   */
  syncUI (value) {
    if (!_.isEqual(value, this._getValueFromUI())) {
      this._syncCheckboxes();

      if (this.params.sortable) {
        this._reorder();
      }
    }
  }

  /**
   * @override
   */
  ready () {
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
  }

  /**
   * Build items map
   *
   * @since   1.0.0
   * @memberof! controls.Multicheck#
   * @access protected
   */
  _buildItemsMap () {
    const items = this._container.getElementsByTagName('label');
    this.__itemsMap = {};

    for (let i = 0, l = items.length; i < l; i++) {
      this.__itemsMap[items[i].title] = {
        _sortable: items[i],
        _input: items[i].getElementsByTagName('input')[0]
      };
    }
  }

  /**
   * @override
   */
  _reorder () {
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
        logError('controls.Multicheck->_reorder', `item '${itemValueAsKey}' has no '_sortable' DOM in 'this.__itemsMap'`);
      }
    }
  }

  /**
   * Get sorted value, reading checkboxes status from the DOM
   *
   * @since   1.0.0
   * @memberof! controls.Multicheck#
   * @access protected
   *
   * @return {Array}
   */
  _getValueFromUI () {
    let valueSorted = [];

    for (let i = 0, l = this.__inputs.length; i < l; i++) {
      let input = this.__inputs[i];
      if (input.checked) {
        valueSorted.push(input.value);
      }
    }
    return valueSorted;
  }

  /**
   * Sync checkboxes and maybe bind change event
   * We need to be fast here, use vanilla js.
   *
   * @since   1.0.0
   * @memberof! controls.Multicheck#
   * @access protected
   *
   * @param  {boolean} bindAsWell Bind on change?
   */
  _syncCheckboxes (bindAsWell) {
    const value = this.setting();

    if (!_.isArray(value)) {
      return logError('controls.Multicheck->_syncCheckboxes', `setting.value must be an array`);
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

  /**
   * If the control is sortable we first show the ordered choices (the ones
   * stored as value in the DB, gathered with `$this->value()`) and then the
   * other choices, that's why the double loop with the `indexOf` condition.
   *
   * @override
   */
  _tplChoicesLoop() {
    const tplChoice = this._tplChoice();

    return `
      <# if (data.sortable) {
        if (_.isArray(data.choicesOrdered)) {
          for (var i = 0; i < data.choicesOrdered.length; i++) {
            var val = data.choicesOrdered[i]; #>
            ${tplChoice}
          <# }
          for (var val in choices) {
            if (data.choicesOrdered.indexOf(val) === -1) { #>
              ${tplChoice}
            <# }
          }
        }
      } else {
        for (var val in choices) { #>
          ${tplChoice}
        <# }
      } #>
    `
  }

  /**
   * @override
   */
  _tplChoiceUi() {
    return `
      <label class="{{ classes }}" {{ attributes }}>
        <input type="checkbox" name="_customize-kkcp_multicheck-{{ data.id }}" value="{{ val }}">{{{ label }}}
      </label>
    `
  }
}

export default wpApi.controlConstructor['kkcp_multicheck'] = api.controls.Multicheck = Multicheck;
