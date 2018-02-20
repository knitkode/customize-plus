import { api, wpApi } from '../core/globals';
import BaseRadio from './base-radio';

/**
 * Control Buttonset
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_buttonset`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Buttonset
 *
 * @extends controls.BaseRadio
 * @augments controls.BaseChoices
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class Buttonset extends BaseRadio {}

wpApi.controlConstructor['kkcp_buttonset'] = api.controls.Buttonset = Buttonset;
