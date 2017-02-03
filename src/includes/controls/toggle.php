<?php // @partial
/**
 * Toggle Control custom class
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     PlusWP <dev@pluswp.com> (https://pluswp.com)
 * @copyright  2017 PlusWP
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://pluswp.com/customize-plus
 */
class PWPcp_Customize_Control_Toggle extends PWPcp_Customize_Control_Checkbox {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_toggle';

	/**
	 * Render a JS template for the content of the text control.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl() {
		?>
		<# var label0 = data.attrs.label_0; label1 = data.attrs.label_1; #>
		<# if (data.label) { #><div class="customize-control-title">{{{ data.label }}}</div><# } #>
		<# if (data.description) { #><div class="description customize-control-description">{{{ data.description }}}</div><# } #>
		<label class="switch-light pwpcpui-switch<# if (label0 && label1) { var l0l = label0.length, l1l = label1.length; #><# if ((l0l && l1l) && (Math.abs(l0l - l1l) > 1) || l0l > 6 || l1l > 6) { #> pwpcpui-switch__labelsauto<# } else { #> pwpcpui-switch__labels<# } } #>" onclick="">
		  <input type="checkbox" name="_customize-pwpcp_toggle-{{ data.id }}" value="<?php // filled through js ?>" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #> <# if (data.value) { #>checked<# } #>>
		  <span<# if (!label0 && !label1) { #> aria-hidden="true"<# } #>>
		    <span><# if (label0) { #>{{{data.attrs.label_0}}}<# } #></span>
		    <span><# if (label1) { #>{{{data.attrs.label_1}}}<# } #></span>
		    <a></a>
		  </span>
		</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Toggle' );