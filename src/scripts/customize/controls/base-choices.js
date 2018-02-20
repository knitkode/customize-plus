import _ from 'underscore';
import { api } from '../core/globals';
import Base from './base';

/**
 * Control Base Choices class
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class BaseChoices
 *
 * @extends controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class BaseChoices extends Base {

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
   * @since   1.0.0
   * @memberof! controls.BaseChoices#
   *
   * @param  {Array<string>|Object<string, Object>} choices
   * @return {Array<string>}
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

export default api.controls.BaseChoices = BaseChoices;
