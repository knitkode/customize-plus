<?php // @partial
/**
 * Base Radio Control custom class
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
class PWPcp_Customize_Control_Base_Radio extends PWPcp_Customize_Control_Base {

	/**
	 * Add basic parameters passed to the JavaScript via JSON
	 * nedeed by any radio control.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['id'] = $this->id;
		$this->json['choices'] = $this->choices;
		$this->json['value'] = $this->value();
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
		<# var choices = data.choices, i = 0;
			if (!_.isEmpty(choices)) { #>
				<?php $this->js_tpl_header(); ?>
				<?php $this->js_tpl_above_choices(); ?>
				<# for (var val in choices) {
						if (choices.hasOwnProperty(val)) {
							var label;
							var choice = choices[val];
							var helpClass = '';
							var helpAttrs = '';
							var id = data.id + i++;
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
							}
						#>
						<?php $this->js_tpl_choice(); ?>
						<# }
					} #>
				<?php $this->js_tpl_below_choices(); ?>
		<# } #>
		<?php
	}

	/**
	 * Hook to print a custom choice template
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice () {}

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
}