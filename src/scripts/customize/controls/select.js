import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
// import ControlBase from './base';
import { oneOrMoreChoices } from '../core/validate';

/**
 * Control Select class
 *
 * @class wp.customize.controlConstructor.kkcp_select
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
  validate: function (value) {
    return oneOrMoreChoices(value);
    // otherwise return error
    // return { error: true }; // @@todo remove
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
      $(this.__select).selectize(_.extend({
        maxItems: this.params.max,
        onChange: (value) => {
          // if it's an array be sure the value is actually different and not
          // just a JSON vs non-JSON situation
          if (_.isArray(value)) {
            if (!this._isSameAsSetting(value)) {
              setting.set(value);
            }
          } else {
            setting.set(value);
          }
        }
      }, selectizeOpts));
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
  },
  /**
   * Check if the given value is the same as the current setting value,
   * this will return `true` even in the scenario where the two values
   * are one a real JS array and the other its JSONified version. This
   * equality (that shouldn't trigger a `setting.set`) happens e.g. on load
   *
   * @param  {Array}  value
   * @return {Boolean}
   */
  _isSameAsSetting (value) {
    let settingValue = this.setting.get();
    let valueToCompare = value;

    try {
      settingValue = JSON.parse(settingValue);
    } catch (e) {
      settingValue = JSON.stringify(settingValue);
      valueToCompare = JSON.stringify(valueToCompare);
    }
    return _.isEqual(settingValue, valueToCompare);
  }
});

export default wpApi.controlConstructor['kkcp_select'] = api.controls.Select = Control;
