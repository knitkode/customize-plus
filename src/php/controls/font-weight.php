<?php // @partial
/**
 * Select Control custom class
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
class KKcp_Customize_Control_Font_Weight extends KKcp_Customize_Control_Select {

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	public $type = 'kkcp_font_weight';

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	public $choices = array(
		'normal' => array(
			'label' => 'Normal',
			'tooltip' => 'Defines a normal text. This is default',
		),
		'bold' => array(
			'label' => 'Bold',
			'tooltip' => 'Defines thick characters',
		),
		'bolder' => array(
			'label' => 'Bolder',
			'tooltip' => 'Defines thicker characters',
		),
		'lighter' => array(
			'label' => 'Lighter',
			'tooltip' => 'Defines lighter characters',
		),
		'100' => '100',
		'200' => '200',
		'300' => '300',
		'400' => '400 (Same as normal)',
		'500' => '500',
		'600' => '600',
		'700' => '700 (Same as bold)',
		'800' => '800',
		'900' => '900',
		'initial' => array(
			'label' => 'Initial',
			'tooltip' => 'Sets this property to its default value',
		),
		'inherit' => array(
			'label' => 'Inherit',
			'tooltip' => 'Inherits this property from its parent element',
		),
	);
}

// Register on WordPress Customize global object
$wp_customize->register_control_type( 'KKcp_Customize_Control_Font_Weight' );