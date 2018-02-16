import { api, wpApi } from '../core/globals';
import ControlBaseRadio from './base-radio';

/**
 * Control Buttonset
 *
 * @class wp.customize.controlConstructor.kkcp_buttonset
 * @constructor
 * @extends api.controls.BaseRadio
 * @augments api.controls.BaseChoices
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
wpApi.controlConstructor['kkcp_buttonset'] = ControlBaseRadio;
