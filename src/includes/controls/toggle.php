<?php // @partial
/**
 * Toggle / Switch Radio Control custom class
 *
 * @since  0.0.1
 */
class PWPcp_Customize_Control_Toggle extends PWPcp_Customize_Control_Base_Radio {

	public $type = 'pwpcp_toggle';

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['attrs'] = $this->input_attrs;
		$this->json['value'] = $this->value();
	}

	/**
	 * Render a JS template for the content of the text control.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl() {
		?>
		<label>
			<# if (data.label) { #>
				<span class="customize-control-title">{{{ data.label }}}</span>
				<input type="checkbox" name="_customize-pwpcp_toggle-{{ data.id }}" value="{{ data.value }}" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #> <# if (data.value) { #>checked<# } #>>
				<# } if (data.description) { #>{{{ data.description }}}<# } #>
		</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Toggle' );