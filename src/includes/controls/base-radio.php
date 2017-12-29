<?php // @partial
/**
 * Base Radio Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
abstract class KKcp_Customize_Control_Base_Radio extends KKcp_Customize_Control_Base {

	/**
	 * Add basic parameters passed to the JavaScript via JSON
	 * nedeed by any radio control.
	 *
	 * @since 1.0.0
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
	 * @since 1.0.0
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
	 * @since 1.0.0
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
	 * @since 1.0.0
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
					helpClass = 'kkcp-help';
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
	 * @since 1.0.0
	 */
	protected function js_tpl_choice_ui () {}

	/**
	 * Hook to add a part of template just before the choices loop
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_above_choices () {}

	/**
	 * Hook to add a part of template just after the choices loop.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_below_choices () {}

	/**
	 * Sanitize
	 *
	 * @since 1.0.0
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::string_in_choices( $value, $setting, $control );
	}

	/**
	 * Validate
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::string_in_choices( $validity, $value, $setting, $control );
	}
}