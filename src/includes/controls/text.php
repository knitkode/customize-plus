<?php // @partial
/**
 * Text Control custom class
 *
 * @since  0.0.1
 */
class PWPcp_Customize_Control_Text extends PWPcp_Customize_Control_Base_Input {

	public $type = 'pwpcp_text';
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Text' );