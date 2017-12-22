<?php // @partial
/**
 * Number Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Number extends KKcp_Customize_Control_Base_Input {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_number';

	/**
	 * Float numbers allowed
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	public $allowFloat = false;

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 1.0.0
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
	 * @since  1.0.0
	 * @return array
	 */
	public function get_l10n() {
		return array(
			'vNotAnumber' => esc_html__( 'The value is not a number.' ),
			'vNoFloat' => esc_html__( 'The value must be an integer, not a float.' ),
			'vNotAnInteger' => esc_html__( 'The value must be an integer number.' ),
			'vNumberLow' => esc_html__( 'The number must be higher than %s.' ),
			'vNumberHigh' => esc_html__( 'The number must be lower than %s.' ),
			'vNumberStep' => esc_html__( 'The value must be a multiple of %s.' ),
		);
	}

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
		$number_extracted = KKcp_Sanitize::extract_number( $value, $control );

		if ( $number_extracted ) {
			return KKcp_Sanitize::number( $number_extracted, $control );
		} else {
			return $setting->default;
		}
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
		if ( ! is_numeric( $value ) ) {
			$validity->add( 'wrong_number', esc_html__( 'The value must be a number.' ) );
		}

		if ( is_float( $value ) && ! $control->allowFloat ) {
			$validity->add( 'wrong_number', esc_html__( 'The number can not be a float.' ) );
		}

		$attrs = $control->input_attrs;

		if ( $attrs ) {
			// if doesn't respect the step given
			if ( isset( $attrs['step'] ) && $value % $attrs['step'] != 0 ) {
				$validity->add( 'wrong_number', sprintf( esc_html__( 'The number must be a multiple of %s.' ), $attrs['step'] ) );
			}
			// if it's lower than the minimum
			if ( isset( $attrs['min'] ) && $value < $attrs['min'] ) {
				$validity->add( 'wrong_number', sprintf( esc_html__( 'The number must be a higher than %s.' ), $attrs['min'] ) );
			}
			// if it's higher than the maxmimum
			if ( isset( $attrs['max'] ) && $value > $attrs['max'] ) {
				$validity->add( 'wrong_number', sprintf( esc_html__( 'The number must be a lower than %s.' ), $attrs['max'] ) );
			}
		}

		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Number' );