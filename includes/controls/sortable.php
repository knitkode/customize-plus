<?php // @partial
/**
 * Sortable Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2018 KnitKode
 * @license    GPLv3
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Customize_Control_Sortable extends KKcp_Customize_Control_Base_Choices {

	/**
	 * @override
	 * @since 1.0.0
	 */
	public $type = 'kkcp_sortable';

	/**
	 * @override
	 * @since  1.0.0
	 */
	public function enqueue() {
		wp_enqueue_script( 'jquery-ui-sortable' );
	}

	/**
	 * {@inheritDoc}. Always dynamically set `max` equal to the number of choices.
	 *
	 * @since 1.0.0
	 */
	public function __construct( $manager, $id, $args = array() ) {
		parent::__construct( $manager, $id, $args );

		if ( is_array( $this->choices ) ) {
			$this->max = count( $this->choices );
		}
		$this->valid_choices = $this->get_valid_choices( $this->choices );
	}

	/**
	 * @override
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		$this->json['choicesOrdered'] = $this->value();
		$this->json['choices'] = $this->choices;
	}

	/**
	 * @override
	 * @since 1.0.0
	 */
	protected function js_tpl_choices_loop() {
		?>
		<# if (_.isArray(data.choicesOrdered)) {
				for (var i = 0; i < data.choicesOrdered.length; i++) {
					var val = data.choicesOrdered[i]; #>
					<?php $this->js_tpl_choice(); ?>
				<# }
			} #>
		<?php
	}

	/**
	 * @override
	 * @since 1.0.0
	 */
	protected function js_tpl_choice_ui() {
		?>
			<div class="kkcp-sortable" title="{{ val }}" data-value="{{ val }}" class="{{ classes }}" {{ attributes }}>{{ label }}</div>
		<?php
	}

	/**
	 * @override
	 * @since 1.0.0
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::multiple_choices( $value, $setting, $control, true );
	}

	/**
	 * @override
	 * @since 1.0.0
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::multiple_choices( $validity, $value, $setting, $control, true );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Sortable' );