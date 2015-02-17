<?php // @partial
/**
 * Multicheck Control custom class
 *
 * @since  0.0.1
 */
class K6CP_Customize_Control_Multicheck extends K6CP_Customize_Control_Base_Radio {

	public $type = 'k6cp_multicheck';

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
				<input type="checkbox" name="_customize-k6cp_multicheck-{{ data.id }}" value="{{ val }}" <# if (data.value.indexOf(val) !== -1) { #>checked<# } #>>{{{ label }}}
			</label>
		<?php
	}
}