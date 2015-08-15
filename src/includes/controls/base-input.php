<?php // @partial
/**
 * Base Input Control custom class
 * This is here just to be extended
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
abstract class PWPcp_Customize_Control_Base_Input extends PWPcp_Customize_Control_Base {

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['attrs'] = $this->input_attrs;
	}

	/**
	 * Render a JS template for the content of the text control.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?><# var a = data.attrs; #>
			<input type="{{ a.type || data.type.replace('pwpcp_','') }}" value="<?php // filled through js: `control.setting()` ?>" <# for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #>>
			<div class="pwpcp-input-feedback"></div>
		</label>
		<?php
	}
}