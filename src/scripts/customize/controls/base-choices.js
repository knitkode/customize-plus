import _ from 'underscore';
import { api } from '../core/globals';
import ControlBase from './base';

/**
 * Control Base Choices class
 *
 * @class api.controls.BaseChoices
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class ControlBaseChoices extends ControlBase {

  /**
   * @override
   */
  onInit () {
    super.onInit();

    this._validChoices = this._getValidChoices(this.params.choices)
  }

  /**
   * Get valid choicesvalues from given choices
   *
   * @param  {array|object} choices
   * @return {array}
   */
  _getValidChoices (choices) {
    if (_.isArray(choices)) {
      return choices;
    }
    if (!_.isUndefined(choices)) {
      let validChoices = [];
      for (let choiceKey in choices) {
        if (choices.hasOwnProperty(choiceKey)) {
          validChoices.push(choiceKey);
        }
      }
      return validChoices;
    }
    return [];
  }
}

export default api.controls.BaseChoices = ControlBaseChoices;
