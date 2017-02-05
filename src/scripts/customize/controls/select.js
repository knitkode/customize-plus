import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
// import ControlBase from './base';

/**
 * Control Select class
 *
 * @class wp.customize.controlConstructor.pwpcp_select
 * @alias api.controls.Select
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = api.controls.Base.extend({
  /**
   * override
   */
  validate: function (rawNewValue) {
    const choices = this.params.choices;
    let newValue;
    // it could come as a stringified array through a programmatic change
    // of the setting (i.e. from a a reset action)
    try {
      newValue = JSON.parse(rawNewValue);
    } catch(e) {
      newValue = rawNewValue;
    }
    // validate array of values
    if (_.isArray(newValue) && this.params.selectize) {
      let validatedArray = [];
      for (let i = 0, l = newValue.length; i < l; i++) {
        let item = newValue[i];
        if (choices.hasOwnProperty(item)) {
          validatedArray.push(item);
        }
      }
      return JSON.stringify(validatedArray);
    }
    // validate string value
    if (choices.hasOwnProperty(newValue)) {
      return newValue;
    }
    // otherwise return error
    return { error: true };
  },
  /**
   * Destroy `selectize` instance if any.
   *
   * @override
   */
  onDeflate: function () {
    if (this.__select && this.__select.selectize) {
      this.__select.selectize.destroy();
    }
  },
  /**
   * @override
   */
  syncUI: function () {
    this._syncOptions();
  },
  /**
   * @override
   */
  ready: function () {
    const selectizeOpts = this.params.selectize || false;
    const setting = this.setting;

    this.__select = this._container.getElementsByTagName('select')[0];
    this.__options = this._container.getElementsByTagName('option');

    // use selectize
    if (selectizeOpts) {
      let options = _.extend({
        onChange: function (value) {
          setting.set(value);
        }
      }, selectizeOpts);
      $(this.__select).selectize(options);
    // or use normal DOM API
    } else {
      this.__select.onchange = function () {
        setting.set(this.value);
      };
    }

    // sync selected state on options on ready
    this._syncOptions();
  },
  /**
   * Sync options and maybe bind change event
   *
   * We need to be fast here, use vanilla js.
   * We do a comparison with two equals `==` because sometimes we want to
   * compare `500` to `'500'` (like in the font-weight dropdown) and return
   * true from that.
   * // @@doubt We could use `.toString()` on the two values to compare, not
   * if those value can be `null` or `undefined`, probably they can \\
   */
  _syncOptions: function () {
    const value = this.setting();

    // use selectize
    if (this.params.selectize) {
      // it could be a json array or a simple string
      try {
        this.__select.selectize.setValue(JSON.parse(value));
      } catch(e) {
        this.__select.selectize.setValue(value);
      }
    }
    // or use normal DOM API
    else {
      for (let i = this.__options.length; i--;) {
        let option = this.__options[i];
        option.selected = (value == option.value);
      }
    }
  }
});

export default wpApi.controlConstructor['pwpcp_select'] = api.controls.Select = Control;
