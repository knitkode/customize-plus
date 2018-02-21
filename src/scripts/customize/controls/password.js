import { api, wpApi } from '../core/globals';
import Text from './text';

/**
 * Control Password class
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_password`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Password
 *
 * @extends controls.Text
 * @augments controls.BaseInput
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 */
class Password extends Text {

  /**
   * @override
   */
  // ready (value) {
  // }
}

export default wpApi.controlConstructor['kkcp_password'] = api.controls.Password = Password;
