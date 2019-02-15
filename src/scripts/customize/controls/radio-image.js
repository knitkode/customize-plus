import { _IMAGES_BASE_URL, _CP_URL_IMAGES } from '../core/utils';
import BaseRadio from './base-radio';

/**
 * Control Radio Image
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_radio_image`
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
class RadioImage extends BaseRadio {
    
  static type = `radio_image`;

  static _onWpConstructor = true;

  /**
   * It shows the full image path (`img_custom`) or an image
   * bundled in the plugin when `img` has been passed, with the plugin url
   * as prepath, and always a `png` extension. Always show tooltip.
   *
   * @override
   */
  _tplChoiceUi() {
    return `
      <input id="{{ id }}" class="kkcp-radio-image" type="radio" value="{{ val }}" name="_customize-kkcp_radio_image-{{ data.id }}">
      <label for="{{ id }}" class="{{ classes }}" {{ attributes }}>
        <# var imgUrl = choice.img_custom ? '${_IMAGES_BASE_URL}' + choice.img_custom : '${_CP_URL_IMAGES}' + choice.img + '.png'; #>
        <img class="kkcpui-tooltip--top" src="{{ imgUrl }}" title="{{ tooltip }}">
      </label>
    `
  }
}

export default RadioImage;
