<?php // @partial
/**
 * Text Control custom class
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
class PWPcp_Customize_Control_Text extends PWPcp_Customize_Control_Base_Input {

	public $type = 'pwpcp_text';

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
			'vTooLong' => __( 'The value is too long.', 'pkgTextdomain' ),
			'vInvalidUrl' => __( 'Invalid url.', 'pkgTextdomain' ),
			'vInvalidEmail' => __( 'Invalid email.', 'pkgTextdomain' ),
		);
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Text' );