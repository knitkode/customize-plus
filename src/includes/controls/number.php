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
		$input_attrs = $control->input_attrs;

		// if it's not a number try to extract it, otherwise return default value
    if ( ! is_numeric( $value ) || ( ! is_float( $value ) && ! is_int( $value ) ) ) {
    	if ( $control->allowFloat ) {
	    	$number_extracted = filter_var( $value, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION );
    	} else {
    		$number_extracted = filter_var( $value, FILTER_SANITIZE_NUMBER_INT );
    	}
    	if ( $number_extracted ) {
    		$value = $number_extracted;
    	} else {
	      return $setting->default;
    	}
    }
    // if it's a float but it is not allowed to be it round it
    if ( is_float( $value ) && ! $control->allowFloat ) {
    	$value = round( $value );
    }
		if ( is_array( $input_attrs ) ) {
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

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Number' );