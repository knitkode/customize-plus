<?php // @partial
/**
 * Base Input Control custom class
 * This is here just to be extended
 *
 * @since  0.0.1
 */
class PWPcp_Customize_Control_Base_Input extends PWPcp_Customize_Control_Base {

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
			<?php $this->js_tpl_header(); ?>
			<input type="{{ data.type.replace('k6cp_','') }}" value="{{ data.value }}" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #>>
		</label>
		<?php
	}
}