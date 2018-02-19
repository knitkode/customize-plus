import { api, wpApi } from '../core/globals';
import ControlSelect from './select';

/**
 * Control Font Weight
 *
 * @alias api.controls.FontWeight
 * @alias wp.customize.controlConstructor.kkcp_font_weight
 * @alias api.controls.Select
 */
export default wpApi.controlConstructor['kkcp_font_weight'] = api.controls.FontWeight = ControlSelect;
