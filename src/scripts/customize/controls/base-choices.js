import _ from 'underscore';
import { api } from '../core/globals';
import Base from './base';

/**
 * Control Base Choices class
 *
 * @since  1.0.0
 *
 * @memberof controls
 *
 * @extends controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class BaseChoices extends Base {

  /**
   * @override
   */
  componentInit () {
    this._validChoices = this._getValidChoices(this.params.choices)
  }

  /**
   * Get valid choices values from given choices
   *
   * @since   1.0.0
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

  /**
   * {@inheritdoc}. Choice supports both a string if you only want to pass a
   * label or an array with `label`, `sublabel`, `tooltip`, `popover_title`,
   * `popover_txt`, etc.
   *
   * @since 1.1.0
   * @override
   */
  _tpl () {
    return `
      <# var choices = data.choices, idx = 0;
        if (!_.isEmpty(choices)) { #>
          ${this._tplHeader()}
          ${this._tplAboveChoices()}
          ${this._tplChoicesLoop()}
          ${this._tplBelowChoices()}
      <# } #>
    `
  }

  /**
   * Ouput the choices template in a loop. Override this in subclasses
   * to change behavior, for instance in sortable controls.
   *
   * @since   1.1.0
   *
   * @access package
   * @return {string}
   */
  _tplChoicesLoop () {
    return `<# for (var val in choices) { #>${this._tplChoice()}<#} #>`
  }

  /**
   * Ouput the js to configure each choice template data and its UI
   *
   * @since   1.1.0
   *
   * @access package
   * @return {string}
   */
  _tplChoice () {
    return `
      <# if (choices.hasOwnProperty(val)) {
        var label;
        var choice = choices[val];
        var classes = '';
        var attributes = '';
        var tooltip = '';
        var id = data.id + idx++;
        if (!_.isUndefined(choice.label)) {
          label = choice.label;
          if (choice.popover) {
            classes += 'kkcpui-popover ';
            if (choice.popover.title) attributes += ' data-title="' + choice.popover.title + '"';
            if (choice.popover.img) attributes += ' data-img="' + choice.popover.img + '"';
            if (choice.popover.text) attributes += ' data-text="' + choice.popover.text + '"';
            if (choice.popover.video) attributes += ' data-video="' + choice.popover.video + '"';
          }
          if (choice.tooltip) {
            classes += 'kkcpui-tooltip--top ';
            attributes += ' title="' + choice.tooltip + '"';
            tooltip = choice.tooltip;
          }
        } else {
          label = choice;
        }
        if (!tooltip) {
          tooltip = label;
        }
      #>
        ${this._tplChoiceUi()}
      <# } #>
    `
  }

  /**
   * Custom choice template UI
   *
   * @since   1.1.0
   *
   * @abstract
   * @access package
   * @return {string}
   */
  _tplChoiceUi () {
    return ``
  }

  /**
   * Add a part of template just before the choices loop
   *
   * @since   1.1.0
   *
   * @abstract
   * @access package
   * @return {string}
   */
  _tplAboveChoices () {
    return ``
  }

  /**
   * Add a part of template just after the choices loop
   *
   * @since   1.1.0
   *
   * @abstract
   * @access package
   * @return {string}
   */
  _tplBelowChoices () {
    return ``
  }
}

export default /*api.controls.BaseChoices =*/ BaseChoices;
