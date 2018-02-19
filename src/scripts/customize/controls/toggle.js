import { api, wpApi } from '../core/globals';
import ControlCheckbox from './checkbox';

/**
 * Control Toggle
 *
 * @alias wp.customize.controlConstructor.kkcp_toggle
 * @alias api.controls.Toggle
 * @alias api.controls.Checkbox
 */
export default wpApi.controlConstructor['kkcp_toggle'] = api.controls.Toggle = ControlCheckbox;
