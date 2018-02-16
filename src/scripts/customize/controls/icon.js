import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import ControlBaseSet from './base-set';

/**
 * Control Icon
 *
 * @class wp.customize.controlConstructor.kkcp_icon
 * @constructor
 * @extends api.controls.BaseSet
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = ControlBaseSet.extend({
  /**
   * @override
   */
  _renderItem: function (data, escape) {
    return '<div class="kkcp-icon-selectItem kkcpui-tooltip--top" title="' + escape(data.value) + '">' +
        '<i class="' + escape(this._getIconClassName(data)) + '"></i>' +
      '</div>';
  },
  /**
   * @override
   */
  _renderOption: function (data, escape) {
    return '<div class="kkcp-icon-selectOption kkcpui-tooltip--top" title="' + escape(data.value) + '">' +
        '<i class="' + escape(this._getIconClassName(data)) + '"></i>' +
      '</div>';
  },
  /**
   * @override
   */
  _renderGroupHeader: function (data, escape) {
    return '<div class="kkcp-icon-selectHeader">' + escape(data.label) + '</div>';
  },
  /**
   * Get option icon class name
   *
   * @param  {object} data The single option data
   * @return {string}
   */
  _getIconClassName: function (data) {
    return `${data.set} ${data.set}-${data.value}`;
  }
});

export default wpApi.controlConstructor['kkcp_icon'] = api.controls.Icon = Control;
