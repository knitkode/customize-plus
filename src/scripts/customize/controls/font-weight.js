import { api, wpApi } from '../core/globals';
import Select from './select';

/**
 * Control Font Weight
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_font_weight`
 *
 * @since  1.0.0
 *
 * @memberof controls
 *
 * @extends controls.Select
 * @augments controls.BaseChoices
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class FontWeight extends Select {}

wpApi.controlConstructor['kkcp_font_weight'] = api.controls.FontWeight = FontWeight;
export default FontWeight;
