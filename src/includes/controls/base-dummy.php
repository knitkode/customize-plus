<?php // @partial
/**
 * Base Dummy Control custom class
 *
 * @since  0.0.1
 */
class K6CP_Customize_Control_Dummy extends K6CP_Customize_Control_Base {

	public $type = 'k6_dummy';

	/**
	 * Render
	 *
	 * The wrapper for this control can always be the same, we create it
	 * in javascript instead of php, so here we can therefore override
	 * the `render` function with an empty output This remove the unnecessary
	 * presence of the <li> micro template in the _wpCustomizeSettings JSON. // k6tobecareful let's the changes in WP API, they'll probably fix this \\
	 *
	 * @since 0.0.1
	 */
	protected function render() {}

	/**
	 * Render a JS template for the content of the control.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl() {
		?>
		<# if (data.label) { #><span class="customize-control-title">{{{ data.label }}}</span><# } #>
		<# if (data.description) { #><span class="description customize-control-description">{{{ data.description }}}</span><# } #>
		<?php
	}
}