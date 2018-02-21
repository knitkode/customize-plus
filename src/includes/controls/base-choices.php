<?php // @partial
/**
 * Base Choices Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2018 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
abstract class KKcp_Customize_Control_Base_Choices extends KKcp_Customize_Control_Base {

	/**
	 * Option to force a maximum choices selection boundary
	 *
	 * @since 1.0.0
	 * @abstract
	 * @var ?int
	 */
	public $max = 1;

	/**
	 * Option to force a minimum choices selection boundary
	 *
	 * @since 1.0.0
	 * @abstract
	 * @var ?int This should be `null` or a value higher or lower than 1. To set
	 *           a control as optional use the `$optional` class property instead
	 *           of setting `$min` to `1`.
	 */
	public $min = null;

	/**
	 * Subclasses needs to override this with a custom default array.
	 *
	 * {@inheritDoc}
	 *
	 * @since 1.0.0
	 * @override
	 * @abstract
	 * @var array
	 */
	public $choices = array();

	/**
	 * This is then populated in the construct based on the choices array and
	 * later used for validation.
	 *
	 * @since 1.0.0
	 * @abstract
	 * @var null|array
	 */
	public $valid_choices = null;

	/**
	 * Get valid choices values from choices array. Subclasses can use this
	 * in their constructor. Let' not override the constructor here too but
	 * force subclasses to override it in case they need it.
	 *
	 * @since 1.0.0
	 * @abstract
	 * @param array              $choices
	 * @return array
	 */
	protected function get_valid_choices ( $choices ) {
		if ( is_array( $choices ) ) {
			$choices_values = array();

			foreach ( $choices as $choice_key => $choice_value ) {
				array_push( $choices_values, $choice_key );
			}
			return $choices_values;
		}
		return $choices;
	}

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	public function get_l10n() {
		return array(
			'vNotArray' => esc_html__( 'It must be a list of values' ),
			'vNotAChoice' => esc_html__( '**%s** is not an allowed choice' ),
			'vNotExactLengthArray' => esc_html__( 'It must contain exactly **%s** values' ),
			'vNotMinLengthArray' => esc_html__( 'It must contain minimum **%s** values' ),
			'vNotMaxLengthArray' => esc_html__( 'It must contain maximum **%s** values' ),
		);
	}

	/**
	 * JavaScript parameters nedeed by choice based controls.
	 *
	 * {@inheritDoc}
	 *
	 * @since 1.0.0
	 * @override
	 */
	protected function add_to_json() {
		$this->json['id'] = KKcp_SanitizeJS::string( true, $this->id );
		$this->json['max'] = KKcp_SanitizeJS::int( false, $this->max );
		$this->json['min'] = KKcp_SanitizeJS::int( false, $this->min );
		$this->json['choices'] = $this->choices;
	}

	/**
	 * Js template
	 *
	 * Choice supports both a string if you only want to pass a label or an array
	 * with `label`, `sublabel`, `tooltip`, `popover_title`, `popover_txt`, etc.
	 *
	 * {@inheritDoc}
	 *
	 * @since 1.0.0
	 * @override
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
			var classes = '';
			var attributes = '';
			var tooltip = '';
			var id = data.id + idx++;
			if (!_.isUndefined(choice.label)) {
				label = choice.label;
				if (choice.popover) {
					classes += 'kkcpui-popover ';
					if (choice.popover.title) attributes += ' data-title="' + choice.popover.title + '"';
					if (choice.popover.img) attributes += ' data-img="' + choice.popover.img + '"';
					if (choice.popover.text) attributes += ' data-text="' + choice.popover.text + '"';
					if (choice.popover.video) attributes += ' data-video="' + choice.popover.video + '"';
				}
				if (choice.tooltip) {
					classes += 'kkcpui-tooltip--top ';
					attributes += ' title="' + choice.tooltip + '"';
					tooltip = choice.tooltip;
				}
			} else {
				label = choice;
			}
			if (!tooltip) {
				tooltip = label;
			}
		#>
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
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::one_or_more_choices( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::one_or_more_choices( $validity, $value, $setting, $control );
	}
}