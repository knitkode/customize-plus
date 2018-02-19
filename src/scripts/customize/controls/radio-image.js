import { api, wpApi } from '../core/globals';
import ControlBaseRadio from './base-radio';

/**
 * Control Radio Image
 *
 * @alias api.controls.RadioImage
 * @alias wp.customize.controlConstructor.kkcp_radio_image
 * @alias api.controls.BaseRadio
 */
export default wpApi.controlConstructor['kkcp_radio_image'] = api.controls.RadioImage = ControlBaseRadio;
