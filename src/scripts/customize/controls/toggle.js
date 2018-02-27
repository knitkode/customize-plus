import { api, wpApi } from '../core/globals';
import Checkbox from './checkbox';

/**
 * Control Toggle
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_toggle`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Toggle
 *
 * @extends controls.Checkbox
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class Toggle extends Checkbox {

  /**
   * @override
   */
  _tpl() {
    return `
      ${this._tplHeader()}
      <# var labelFalse = data.attrs ? data.attrs.label_false : ''; labelTrue = data.attrs ? data.attrs.label_true : ''; #>
      <label class="switch-light kkcpui-switch<# if (labelFalse && labelTrue) { var l0l = labelFalse.length, l1l = labelTrue.length; #><# if ((l0l && l1l) && (Math.abs(l0l - l1l) > 1) || l0l > 6 || l1l > 6) { #> kkcpui-switch__labelsauto<# } else { #> kkcpui-switch__labels<# } } #>" onclick="">
        <input type="checkbox" name="_customize-kkcp_toggle-{{ data.id }}" value="" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #><# if (data.value) { #> checked<# } #>>
        <span<# if (!labelFalse && !labelTrue) { #> aria-hidden="true"<# } #>>
          <span><# if (labelFalse) { #>{{ labelFalse }}<# } #></span>
          <span><# if (labelTrue) { #>{{ labelTrue }}<# } #></span>
          <a></a>
        </span>
      </label>
    `;
  }
}

export default wpApi.controlConstructor['kkcp_toggle'] = api.controls.Toggle = Toggle;
