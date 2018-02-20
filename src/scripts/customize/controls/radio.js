import { api, wpApi } from '../core/globals';
import BaseRadio from './base-radio';

/**
 * Control Radio
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_radio`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Radio
 *
 * @extends controls.BaseRadio
 * @augments controls.BaseChoices
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class Radio extends BaseRadio {}

export default wpApi.controlConstructor['kkcp_radio'] = api.controls.Radio = Radio;
