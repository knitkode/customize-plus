<?php // @partial
/**
 * Text Control custom class
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Text extends KKcp_Customize_Control_Base_Input {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'kkcp_text';

	/**
	 * Get localized strings
	 *
	 * @override
	 * @since  0.0.1
	 * @return array
	 */
	public function get_l10n() {
		return array(
			'vTooLong' => __( 'The value is too long.' ),
			'vInvalidUrl' => __( 'Invalid url.' ),
			'vInvalidEmail' => __( 'Invalid email.' ),
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
	 * @since 0.0.1
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
	    $validity->add( 'wrong_text', __( 'Invalid URL.' ) );
		}
		// email
		if ( 'email' === $input_type && ! is_email( $value ) ) {
			$validity->add( 'wrong_text', __( 'Invalid email.' ) );
		}
		// max length
		if ( isset( $attrs['maxlength'] ) && strlen( $value ) > $attrs['maxlength'] ) {
			$validity->add( 'wrong_text', __( sprintf ( 'The text must be shorter than %s.', $attrs['maxlength'] ) ) );
		}

		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Text' );