import { api, wpApi } from '../core/globals';
import ControlBaseRadio from './base-radio';

/**
 * Control Radio Image
 *
 * @class wp.customize.controlConstructor.kkcp_radio_image
 * @constructor
 * @extends api.controls.BaseRadio
 * @augments api.controls.BaseChoices
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = ControlBaseRadio;

export default wpApi.controlConstructor['kkcp_radio_image'] = api.controls.RadioImage = Control;
