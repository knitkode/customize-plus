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
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Number' );