<?php // @partial
/**
 * Text Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Customize_Control_Text extends KKcp_Customize_Control_Base_Input {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_text';

	/**
	 * Get localized strings
	 *
	 * @override
	 * @since  1.0.0
	 * @return array
	 */
	public function get_l10n() {
		return array(
			'vTooLong' => esc_html__( 'The value is too long.' ),
			'vInvalidUrl' => esc_html__( 'Invalid url.' ),
			'vInvalidEmail' => esc_html__( 'Invalid email.' ),
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
		$attrs = $control->input_attrs;

		$input_type = isset( $attrs['type'] ) ? $attrs['type'] : 'text';

		// url
		if ( 'url' === $input_type ) {
			$value = esc_url_raw( $value );
		}
		// email
		else if ( 'email' === $input_type ) {
			$value = sanitize_email( $value );
		}
		// text
		else {
			$value = wp_strip_all_tags( $value );
		}
		// max length
		if ( isset( $attrs['maxlength'] ) && strlen( $value ) > $attrs['maxlength'] ) {
			return $setting->default;
		}

		return $value;
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
		$attrs = $control->input_attrs;

		$input_type = isset( $attrs['type'] ) ? $attrs['type'] : 'text';

		// url
		if ( 'url' === $input_type && filter_var( $value, FILTER_VALIDATE_URL) === FALSE) {
	    $validity->add( 'wrong_text', esc_html__( 'Invalid URL.' ) );
		}
		// email
		if ( 'email' === $input_type && ! is_email( $value ) ) {
			$validity->add( 'wrong_text', esc_html__( 'Invalid email.' ) );
		}
		// max length
		if ( isset( $attrs['maxlength'] ) && strlen( $value ) > $attrs['maxlength'] ) {
			$validity->add( 'wrong_text', sprintf ( esc_html__( 'The text must be shorter than %s.' ), $attrs['maxlength'] ) );
		}

		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Text' );