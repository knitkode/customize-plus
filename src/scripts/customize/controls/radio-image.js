import { api, wpApi } from '../core/globals';
import BaseRadio from './base-radio';

/**
 * Control Radio Image
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_radio_image`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class RadioImage
 *
 * @extends controls.BaseRadio
 * @augments controls.BaseChoices
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class RadioImage extends BaseRadio {}

export default wpApi.controlConstructor['kkcp_radio_image'] = api.controls.RadioImage = RadioImage;
