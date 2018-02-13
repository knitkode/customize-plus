<?php // @partial
/**
 * Toggle Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Customize_Control_Toggle extends KKcp_Customize_Control_Checkbox {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_toggle';

	/**
	 * Render a JS template for the content of the text control.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl() {
		?>
		<?php $this->js_tpl_header(); ?>
		<# var labelFalse = data.attrs.label_false; labelTrue = data.attrs.label_true; #>
		<label class="switch-light kkcpui-switch<# if (labelFalse && labelTrue) { var l0l = labelFalse.length, l1l = labelTrue.length; #><# if ((l0l && l1l) && (Math.abs(l0l - l1l) > 1) || l0l > 6 || l1l > 6) { #> kkcpui-switch__labelsauto<# } else { #> kkcpui-switch__labels<# } } #>" onclick="">
		  <input type="checkbox" name="_customize-kkcp_toggle-{{ data.id }}" value="<?php // filled through js ?>" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #><# if (data.value) { #> checked<# } #>>
		  <span<# if (!labelFalse && !labelTrue) { #> aria-hidden="true"<# } #>>
		    <span><# if (labelFalse) { #>{{{data.attrs.label_false}}}<# } #></span>
		    <span><# if (labelTrue) { #>{{{data.attrs.label_true}}}<# } #></span>
		    <a></a>
		  </span>
		</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Toggle' );