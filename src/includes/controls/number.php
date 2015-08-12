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
	 * Get localized strings
	 *
	 * @override
	 * @since  0.0.1
	 * @return array
	 */
	public function get_l10n() {
		return array(
			'vNotEmpty' => __( 'This field cannot be empty.', 'pkgTextdomain' ),
			'vNumberLow' => __( 'The number is too low.', 'pkgTextdomain' ),
			'vNumberHigh' => __( 'The number is too high.', 'pkgTextdomain' ),
			'vNumberStep' => __( 'The value must be a multiple of', 'pkgTextdomain' ),
		);
	}

	/**
	 * Sanitization callback
	 *
	 * @since 0.0.1
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @return string The sanitized value.
 	 */
	public static function sanitize_callback( $value, $setting ) {
		$control = $setting->manager->get_control( $setting->id );
		$input_attrs = $control->input_attrs;

		// if value is required and is empty return default
		// also be sure it's a numeric value
		if ( ( isset( $input_attrs['required'] ) && ! $value ) || ! is_numeric( $value ) ) {
			return $setting->default;
		} else {
			if ( $input_attrs ) {
				// if doesn't respect the step given round it to the closest
				// then do the min and max checks
				if ( isset( $input_attrs['step'] ) && $value % $input_attrs['step'] != 0 ) {
					$value = round( $value / $input_attrs['step'] ) * $input_attrs['step'];
				}
				// if it's lower than the minimum return the minimum
				if ( isset( $input_attrs['min'] ) && $value < $input_attrs['min'] ) {
					return $input_attrs['min'];
				}
				// if it's higher than the maxmimum return the maximum
				if ( isset( $input_attrs['max'] ) && $value > $input_attrs['max'] ) {
					return $input_attrs['max'];
				}
			}
			return $value;
		}
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Number' );