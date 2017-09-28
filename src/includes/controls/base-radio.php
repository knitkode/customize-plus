<?php // @partial
/**
 * Base Radio Control custom class
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     Knitkode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 Knitkode
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/customize-plus
 */
abstract class PWPcp_Customize_Control_Base_Radio extends PWPcp_Customize_Control_Base {

	/**
	 * Add basic parameters passed to the JavaScript via JSON
	 * nedeed by any radio control.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['id'] = $this->id;
		$this->json['choices'] = $this->choices;
	}

	/**
	 * Js template
	 *
	 * Choice supports both a string if you only want to pass a label
	 * or an object with label, sublabel, help, help_title, etc.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl() {
		?>
		<# var choices = data.choices, idx = 0;
			if (!_.isEmpty(choices)) { #>
				<?php $this->js_tpl_header(); ?>
				<?php $this->js_tpl_above_choices(); ?>
				<?php $this->js_tpl_choices_loop(); ?>
				<?php $this->js_tpl_below_choices(); ?>
		<# } #>
		<?php
	}

	/**
	 * Ouput the choices template in a loop. Override this in subclasses
	 * to change behavior, for instance in sortable controls.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choices_loop () {
		?>
		<# for (var val in choices) { #>
			<?php $this->js_tpl_choice(); ?>
		<#} #>
		<?php
	}

	/**
	 * Ouput the js to configure each choice template data and its UI
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice () {
		?>
		<# if (choices.hasOwnProperty(val)) {
			var label;
			var choice = choices[val];
			var helpClass = '';
			var helpAttrs = '';
			var id = data.id + idx++;
			if (typeof choices[val] === 'string') {
				label = choice;
			} else {
				label = choice.label;
				if (choice.help) {
					helpClass = 'pwpcp-help';
					helpAttrs = ' data-help=' + choice.help;
					if (choice.help_title) helpAttrs += ' data-title=' + choice.help_title;
					if (choice.help_img) helpAttrs += ' data-img=' + choice.help_img;
					if (choice.help_text) helpAttrs += ' data-text=' + choice.help_text;
					if (choice.help_video) helpAttrs += ' data-video=' + choice.help_video;
				}
			} #>
			<?php $this->js_tpl_choice_ui(); ?>
		<# } #>
		<?php
	}

	/**
	 * Hook to print a custom choice template
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice_ui () {}

	/**
	 * Hook to add a part of template just before the choices loop
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_above_choices () {}

	/**
	 * Hook to add a part of template just after the choices loop.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_below_choices () {}

	/**
	 * Sanitize
	 *
	 * @since 0.0.1
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		return PWPcp_Sanitize::string_in_choices( $value, $setting, $control );
	}

	/**
	 * Validate
	 *
	 * @since 0.0.1
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return PWPcp_Validate::string_in_choices( $validity, $value, $setting, $control );
	}
}