<?php // @partial
/**
 * Base Radio Control custom class
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
abstract class KKcp_Customize_Control_Base_Radio extends KKcp_Customize_Control_Base_Choices {

	/**
	 * {@inhertDoc}. Populate the `valid_choices` property.
	 *
	 * @since 1.0.0
	 */
	public function __construct( $manager, $id, $args = array() ) {
		parent::__construct( $manager, $id, $args );

		$this->valid_choices = $this->get_valid_choices( $this->choices );
	}

	/**
	 * Override the base choices, we don't need `min`, `max` for radio based
	 * controls, but we extends it anyway to reuse its js template.
	 *
	 * {@inheritDoc}
	 *
	 * @since 1.0.0
	 * @override
	 */
	protected function add_to_json() {
		$this->json['id'] = KKcp_SanitizeJS::string( true, $this->id );
		$this->json['choices'] = $this->choices;
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::single_choice( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::single_choice( $validity, $value, $setting, $control );
	}
}