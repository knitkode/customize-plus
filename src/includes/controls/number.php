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
			'vNotNumber' => __( 'The value is not a number.' ),
			'vNoFloat' => __( 'The value must be an integer.' ),
			'vNumberLow' => __( 'The number must be higher than %s.' ),
			'vNumberHigh' => __( 'The number must be lower than %s.' ),
			'vNumberStep' => __( 'The value must be a multiple of %s.' ),
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
		// value comes as a string, this is a generic way to coerce it to a number
		// either int or float, @see http://bit.ly/2kh6mx9
		$value = $value + 0;

		if ( ! is_int( $value ) && ! is_float( $value ) ) {
			$validity->add( 'wrong_number', __( 'The value must be a number.' ) );
		}

		if ( is_float( $value ) && ! $control->allowFloat ) {
			$validity->add( 'wrong_number', __( 'The number can not be a float.' ) );
		}

		$attrs = $control->input_attrs;

		if ( $attrs ) {
			// if doesn't respect the step given
			if ( isset( $attrs['step'] ) && $value % $attrs['step'] != 0 ) {
				$validity->add( 'wrong_number', sprintf( __( 'The number must be a multiple of %s.' ), $attrs['step'] ) );
			}
			// if it's lower than the minimum
			if ( isset( $attrs['min'] ) && $value < $attrs['min'] ) {
				$validity->add( 'wrong_number', sprintf( __( 'The number must be a higher than %s.' ), $attrs['min'] ) );
			}
			// if it's higher than the maxmimum
			if ( isset( $attrs['max'] ) && $value > $attrs['max'] ) {
				$validity->add( 'wrong_number', sprintf( __( 'The number must be a lower than %s.' ), $attrs['max'] ) );
			}
		}

		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Number' );