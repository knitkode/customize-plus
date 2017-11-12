import { api, wpApi } from '../core/globals';
import ControlSelect from './select';

/**
 * Control Font Weight
 *
 * @class wp.customize.controlConstructor.kkcp_font_weight
 * @constructor
 * @extends api.controls.Select
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = ControlSelect;

export default wpApi.controlConstructor['kkcp_font_weight'] = api.controls.FontWeight = Control;
