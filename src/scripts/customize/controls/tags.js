import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import Base from './base';

/**
 * Control Tags class
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_tags`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Tags
 *
 * @extends controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 */
class Tags extends Base {

  /**
   * @override
   */
  validate (value) {
    return Validate.tags({}, value, this.setting, this);
  }

  /**
   * @override
   */
  sanitize (value) {
    return Sanitize.tags(value, this.setting, this);
  }

  /**
   * Destroy `selectize` instance if any.
   *
   * @override
   */
  onDeflate () {
    if (this.__input && this.__input.selectize) {
      this.__input.selectize.destroy();
    }
  }

  /**
   * @override
   */
  syncUI (value) {
    const selectize = this.__input.selectize;

    if (selectize && selectize.getValue() !== value) {
      this.__input.value = value;
      // this is due to a bug, we should use:
      // selectize.setValue(value, true);
      // but @see https://github.com/brianreavis/selectize.js/issues/568
      // so first we have to destroy thene to reinitialize, this happens
      // only through a programmatic change such as a reset action
      selectize.destroy();
      this._initSelectize();
    }
  }

  /**
   * @override
   */
  ready () {
    this.__input = this._container.getElementsByTagName('input')[0];

    // fill input before to initialize selectize so selectize grabs the value
    // directly from the DOM
    this.__input.value = this.setting();

    this._initSelectize();
  }

  /**
   * Init selectize on text input
   *
   * @since   1.0.0
   * @memberof! controls.Tags#
   * @access protected
   */
  _initSelectize () {
    const selectizeOpts = this.params.selectize || {};

    $(this.__input).selectize(_.extend({
      persist: false,
      create: function (input) {
        return {
          value: input,
          text: input
        };
      },
      onChange: (value) => {
        this.setting.set(value);
      }
    }, selectizeOpts));
  }
}

export default wpApi.controlConstructor['kkcp_tags'] = api.controls.Tags = Tags;
