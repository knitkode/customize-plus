import _ from 'underscore';
import { api } from '../core/globals';
// import ControlBase from './base';

/**
 * Control Base Choices class
 *
 * @class api.controls.BaseRadio
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = api.controls.Base.extend({
  /**
   * @override
   */
  onInit: function () {
    api.controls.Base.prototype.onInit.apply(this);

    this._validChoices = this._getValidChoices(this.params.choices)
  },
  /**
   * Get valid choicesvalues from given choices
   *
   * @param  {array|object} choices
   * @return {array}
   */
  _getValidChoices: function (choices) {
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
});

export default api.controls.BaseChoices = Control;
