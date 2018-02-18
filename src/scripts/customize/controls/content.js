import { api, wpApi } from '../core/globals';

/**
 * Control Content class
 *
 * @class api.controls.Content
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = api.controls.Base.extend({
  /**
   * Some methods are not needed here
   *
   * @override
   */
  _validate: $.noop,
  _manageValidityNotifications: $.noop,
  validate: $.noop,
  sanitize: $.noop,
  syncUI: $.noop,
  softenize: $.noop,
  _extras: $.noop,
});

export default wpApi.controlConstructor['kkcp_content'] = api.controls.Content = Control;
