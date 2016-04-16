<?php // @partial
/**
 * Toggle Control custom class
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     PlusWP <dev@pluswp.com> (http://pluswp.com)
 * @copyright  2015 PlusWP (kunderi kuus)
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       http://pluswp.com/customize-plus
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
		<# if (data.label) { #><div class="customize-control-title">{{{ data.label }}}</div><# } #>
		<# if (data.description) { #><div class="description customize-control-description">{{{ data.description }}}</div><# } #>
		<label class="switch-light pwpcpui-switch<# if (data.attrs.label_0 || data.attrs.label_1) { #> pwpcpui-switch__labelled<# } #>" onclick="">
		  <input type="checkbox" name="_customize-pwpcp_toggle-{{ data.id }}" value="<?php // filled through js ?>" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #> <# if (data.value) { #>checked<# } #>>
		  <span>
		    <span><# if (data.attrs.label_0) { #>{{{data.attrs.label_0}}}<# } #></span>
		    <span><# if (data.attrs.label_1) { #>{{{data.attrs.label_1}}}<# } #></span>
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