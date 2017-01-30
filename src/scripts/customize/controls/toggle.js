import { api, wpApi } from '../core/globals';
import ControlCheckbox from './checkbox';

/**
 * Control Toggle
 *
 * @class wp.customize.controlConstructor.pwpcp_toggle
 * @constructor
 * @extends api.controls.Checkbox
 * @augments wp.customize.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = ControlCheckbox;

export default wpApi.controlConstructor['pwpcp_toggle'] = api.controls.Toggle = Control;
