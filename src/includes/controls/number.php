<?php // @partial
/**
 * Number Control custom class
 *
 * @since  0.0.1
 */
class K6CP_Customize_Control_Number extends K6CP_Customize_Control_Base_Input {

	public $type = 'k6cp_number';
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'K6CP_Customize_Control_Number' );