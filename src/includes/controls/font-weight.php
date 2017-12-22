<?php // @partial
/**
 * Select Control custom class
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
class KKcp_Customize_Control_Font_Weight extends KKcp_Customize_Control_Select {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_font_weight';

	/**
	 * Selectize disabled (`false`) or enabled (just `true` or array of options)
	 *
	 * @since 1.0.0
	 * @var boolean|array
	 */
	public $choices = array(
		'normal' => array(
			'label' => 'Normal',
			'sublabel' => 'Defines a normal text. This is default',
		),
		'bold' => array(
			'label' => 'Bold',
			'sublabel' => 'Defines thick characters',
		),
		'bolder' => array(
			'label' => 'Bolder',
			'sublabel' => 'Defines thicker characters',
		),
		'lighter' => array(
			'label' => 'Lighter',
			'sublabel' => 'Defines lighter characters',
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
			'sublabel' => 'Sets this property to its default value',
		),
		'inherit' => array(
			'label' => 'Inherit',
			'sublabel' => 'Inherits this property from its parent element',
		),
	);
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Font_Weight' );