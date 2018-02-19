import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import ControlBaseSet from './base-set';

/**
 * Control Icon
 *
 * @class api.controls.Icon
 * @alias wp.customize.controlConstructor.kkcp_icon
 * @extends api.controls.BaseSet
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class ControlIcon extends ControlBaseSet {

  /**
   * @override
   */
  _renderItem (data, escape) {
    return `<div class="kkcp-icon-selectItem kkcpui-tooltip--top" title="${escape(data.value)}">
        <i class="${escape(this._getIconClassName(data))}"></i>
      </div>`;
  }

  /**
   * @override
   */
  _renderOption (data, escape) {
    return `<div class="kkcp-icon-selectOption kkcpui-tooltip--top" title="${escape(data.value)}">
        <i class="${escape(this._getIconClassName(data))}"></i>
      </div>`;
  }

  /**
   * @override
   */
  _renderGroupHeader (data, escape) {
    return `<div class="kkcp-icon-selectHeader">${escape(data.label)}</div>`;
  }

  /**
   * Get option icon class name
   *
   * @param  {object} data The single option data
   * @return {string}
   */
  _getIconClassName (data) {
    return `${data.set} ${data.set}-${data.value}`;
  }
}

export default wpApi.controlConstructor['kkcp_icon'] = api.controls.Icon = ControlIcon;
