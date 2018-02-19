import { api, wpApi } from '../core/globals';
import ControlBaseRadio from './base-radio';

/**
 * Control Radio
 *
 * @alias api.controls.Radio
 * @alias wp.customize.controlConstructor.kkcp_radio
 * @alias api.controls.BaseRadio
 */
export default wpApi.controlConstructor['kkcp_radio'] = api.controls.Radio = ControlBaseRadio;
