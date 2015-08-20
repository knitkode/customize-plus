<?php // @partial
/**
 * Number Control custom class
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
class PWPcp_Customize_Control_Number extends PWPcp_Customize_Control_Base_Input {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_number';

	/**
	 * Float numbers allowed
	 *
	 * @since 0.0.1
	 * @var boolean
	 */
	public $allowFloat = false;

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		parent::add_to_json();

		if ( $this->allowFloat ) {
			$this->json['allowFloat'] = true;
		}
	}

	/**
	 * Get localized strings
	 *
	 * @override
	 * @since  0.0.1
	 * @return array
	 */
	public function get_l10n() {
		return array(
			'vNotNumber' => __( 'The value is not a number.', 'pkgTextdomain' ),
			'vNoFloat' => __( 'The value must be an integer.', 'pkgTextdomain' ),
			'vNumberLow' => __( 'The number is too low.', 'pkgTextdomain' ),
			'vNumberHigh' => __( 'The number is too high.', 'pkgTextdomain' ),
			'vNumberStep' => __( 'The value must be a multiple of', 'pkgTextdomain' ),
		);
	}

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
    $number_extracted = PWPcp_Sanitize::extract_number( $value, $control );

    if ( $number_extracted ) {
  		return PWPcp_Sanitize::number( $number_extracted, $control );
  	} else {
      return $setting->default;
  	}
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Number' );