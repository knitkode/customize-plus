<?php // @partial
/**
 * Select Control custom class
 *
 * @since  0.0.1
 */
class K6CP_Customize_Control_Select extends K6CP_Customize_Control_Base_Radio {

	public $type = 'k6cp_select';

	/**
	 * Render template for choice displayment.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice() {
		?>
			<option value="{{ val }}"<# if (data.value==val) { #> selected<# } #>{{{ tipAttrs }}}<# if (choice.sublabel) { #> data-sublabel="{{{ choice.sublabel }}}"<# } #>>
				{{{ label }}}
			</option>
		<?php
	}

	/**
	 * Render needed html structure for CSS toggle / switch
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_above_choices () {
		?>
			<select name="_customize-k6cp_select-{{ data.id }}">
		<?php
	}

	/**
	 * Render needed html structure for CSS toggle / switch
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_below_choices () {
		?>
			</select>
		<?php
	}
}