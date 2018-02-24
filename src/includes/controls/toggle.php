<?php // @partial
/**
 * Toggle Control custom class
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
class KKcp_Customize_Control_Toggle extends KKcp_Customize_Control_Checkbox {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_toggle';

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected $allowed_input_attrs = array(
		'label_false' => array( 'sanitizer' => 'string' ),
		'label_true' => array( 'sanitizer' => 'string' ),
	);
}

// Register on WordPress Customize global object
$wp_customize->register_control_type( 'KKcp_Customize_Control_Toggle' );