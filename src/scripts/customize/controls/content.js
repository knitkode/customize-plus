import { api, wpApi } from '../core/globals';
import ControlBase from './base';

/**
 * Control Content class
 *
 * @class api.controls.Content
 * @alias wp.customize.controlConstructor.kkcp_content
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class ControlContent extends ControlBase {
  /**
   * Some methods are not needed here
   *
   * @override
   */
  // _validate: $.noop,
  // _manageValidityNotifications: $.noop,
  // validate: $.noop,
  // sanitize: $.noop,
  // syncUI: $.noop,
  // softenize: $.noop,
  // _extras: $.noop,
}

export default wpApi.controlConstructor['kkcp_content'] = api.controls.Content = ControlContent;
