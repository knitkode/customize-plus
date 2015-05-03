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

	// public $tip_types = array( 'help', 'guide' );
	// public $tip_content_types = array( 'tip_title', 'tip_text', 'tip_img', 'tip_iframe', 'tip_video' );

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
	 * or an object with label, sublabel, tip, tip_title, etc.
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
							var tipAttrs = '';
							var id = data.id + i++;
							if (typeof choices[val] === 'string') {
								label = choice;
							} else {
								label = choice.label;
								if (choice.tip) {
									tipAttrs = ' data-tip=' + choice.tip;
									if (choice.tip_title) tipAttrs += ' data-tip_title=' + choice.tip_title;
									if (choice.tip_img) tipAttrs += ' data-tip_img=' + choice.tip_img;
									if (choice.tip_text) tipAttrs += ' data-tip_text=' + choice.tip_text;
									if (choice.tip_video) tipAttrs += ' data-tip_video=' + choice.tip_video;
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