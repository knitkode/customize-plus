import { api, wpApi } from '../core/globals';
import ControlBaseRadio from './base-radio';

/**
 * Control Buttonset
 *
 * @class api.controls.Buttonset
 * @alias wp.customize.controlConstructor.kkcp_buttonset
 * @extends api.controls.BaseRadio
 * @augments api.controls.BaseChoices
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
wpApi.controlConstructor['kkcp_buttonset'] = api.controls.Buttonset = ControlBaseRadio;
