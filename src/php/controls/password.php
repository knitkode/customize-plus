<?php // @partial
/**
 * Password Control custom class
 *
 * @todo  The default setting of this control get hashed with `wp_hash_password`
 * before getting saved to the database. This does not happen in the frontend
 * preview for obvious reasons.
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
class KKcp_Customize_Control_Password extends KKcp_Customize_Control_Text {

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	public $type = 'kkcp_password';

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected $allowed_input_attrs = array(
		'autocomplete' => array( 'sanitizer' => 'string' ),
		'maxlength' => array( 'sanitizer' => 'int' ),
		'minlength' => array( 'sanitizer' => 'int' ),
		'pattern' => array( 'sanitizer' => 'string' ),
		'placeholder' => array( 'sanitizer' => 'string' ),
		'visibility' => array( 'sanitizer' => 'bool' ),
	);

	/**
	 * @since  1.0.0
	 * @inerhitDoc
	 */
	public function get_l10n() {
		return array(
			'passwordShow' => esc_html__( 'Show password' ),
			'passwordHide' => esc_html__( 'Hide password' ),
		);
	}

	/**
	 * Simple sanitization that hashes the password.
	 *
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		if ( is_string( $value ) ) {
			return wp_hash_password( $value );
		}
		return null;
	}
}

// Register on WordPress Customize global object
$wp_customize->register_control_type( 'KKcp_Customize_Control_Password' );