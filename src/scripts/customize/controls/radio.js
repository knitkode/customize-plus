import { api, wpApi } from '../core/globals';
import BaseRadio from './base-radio';

/**
 * Control Radio
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_radio`
 *
 * @since  1.0.0
 *
 * @memberof controls
 *
 * @extends controls.BaseRadio
 * @augments controls.BaseChoices
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class Radio extends BaseRadio {

  /**
   * @override
   */
  _tplChoiceUi() {
    return `
      <label class="{{ classes }}" {{{ attributes }}}>
        <input type="radio" value="{{ val }}" name="_customize-kkcp_radio-{{ data.id }}">
        {{ label }}
        <# if (choice.sublabel) { #><small> ({{ choice.sublabel }})</small><# } #>
      </label>
    `
  }
}

wpApi.controlConstructor['kkcp_radio'] = api.controls.Radio = Radio;
export default Radio;
