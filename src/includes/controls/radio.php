<?php // @partial
/**
 * Radio Control custom class
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
class KKcp_Customize_Control_Radio extends KKcp_Customize_Control_Base_Radio {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_radio';
}

// Register on WordPress Customize global object
$wp_customize->register_control_type( 'KKcp_Customize_Control_Radio' );