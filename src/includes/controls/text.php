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
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_text';

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	public function get_l10n() {
		return array(
			'vTextType' => esc_html__( 'The value must be a string.' ),
			'vInvalidUrl' => esc_html__( 'Invalid URL.' ),
			'vInvalidEmail' => esc_html__( 'Invalid email.' ),
			'vTooLong' => esc_html__( 'The value is too long.' ),
			'vTextHtml' => esc_html__( 'HTML is not allowed. It will be stripped out on save.' ),
		);
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::text( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::text( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Text' );