<?php // @partial
/**
 * Radio Control custom class
 *
 * @since  0.0.1
 */
class K6CP_Customize_Control_Radio extends K6CP_Customize_Control_Base_Radio {

	public $type = 'k6cp_tradio';

	/**
	 * Render template for choice displayment.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice() {
		?>
			<label{{{ tipAttrs }}}>
				<input type="radio" value="{{ val }}" name="_customize-k6cp_tradio-{{ data.id }}" <# if (val===data.value) { #>checked<# } #>>
				{{{ label }}}
				<# if (choice.sublabel) { #><small> ({{{ choice.sublabel }}})</small><# } #>
			</label>
		<?php
	}
}