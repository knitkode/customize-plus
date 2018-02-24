import $ from 'jquery';
import { api } from '../core/globals';
import Base from './base';

/**
 * Control Base Input class
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class controls.BaseInput
 *
 * @extends controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class BaseInput extends Base {

  /**
   * @override
   */
  syncUI (value) {
    if (value && this.__input.value !== value) {
      this.__input.value = value;
    }
  }

  /**
   * @override
   */
  ready () {
    const self = this;
    self.__input = self._container.getElementsByTagName('input')[0];

    // sync input and listen for changes
    $(self.__input)
      .val(self.setting())
      .on('change keyup paste', function () {
        self.setting.set(this.value);
      });
  }

  /**
   * {@inheritDoc}. Note that the `tooltip` input_attr is printed in a wrapping
   * span instead of directly on the input field.
   *
   * @since 1.1.0
   * @override
   */
  _tpl () {
    return `
      <label>
        ${this._tplHeader()}<# var attrs = data.attrs || {}; #>
        <# if (attrs.tooltip) { #><span class="kkcpui-tooltip--top" title="{{ attrs.tooltip || '' }}"><# } #>
        ${this._tplInner()}
        <# if (attrs.tooltip) { #></span><# } #>
      </label>
    `
  }

  /**
   * Js template for the actual input element area, override this e.g. in the
   * Password Control
   *
   * @since 1.1.0
   * @abstract
   */
  _tplInner () {
    return this._tplInput();
  }

  /**
   * Js template for the actual input element
   *
   * @since 1.1.0
   * @abstract
   */
  _tplInput () {
    return `
      <input class="kkcp-input" type="{{ attrs.type || data.type.replace('kkcp_','') }}" value=""
        <# for (var key in attrs) { if (attrs.hasOwnProperty(key) && key !== 'title') { #>{{ key }}="{{ attrs[key] }}" <# } } #>
      >
    `
  }
}

export default /*api.controls.BaseInput =*/ BaseInput;
