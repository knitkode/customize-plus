import { api, wpApi } from '../core/globals';
import Checkbox from './checkbox';

/**
 * Control Toggle
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_toggle`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Toggle
 *
 * @extends controls.Checkbox
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class Toggle extends Checkbox {}

export default wpApi.controlConstructor['kkcp_toggle'] = api.controls.Toggle = Toggle;
