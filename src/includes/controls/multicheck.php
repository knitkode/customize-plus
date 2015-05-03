<?php // @partial
/**
 * Multicheck Control custom class
 *
 * @since  0.0.1
 */
class PWPcp_Customize_Control_Multicheck extends PWPcp_Customize_Control_Base_Radio {

	public $type = 'pwpcp_multicheck';

	/**
	 * Override here beacause we need to decode the value (is a JSON)
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['id'] = $this->id;
		$this->json['choices'] = $this->choices;
		$this->json['value'] = json_decode( $this->value() );
	}

	/**
	 * Render template for choice displayment.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice() {
		?>
			<label{{{ tipAttrs }}}>
				<input type="checkbox" name="_customize-pwpcp_multicheck-{{ data.id }}" value="{{ val }}" <# if (data.value.indexOf(val) !== -1) { #>checked<# } #>>{{{ label }}}
			</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Multicheck' );