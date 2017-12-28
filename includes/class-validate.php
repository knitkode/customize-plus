<?php defined( 'ABSPATH' ) or die;

/**
 * Validate functions
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Validate {

	/**
	 * Array in choices
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	public static function array_in_choices( $validity, $value, $setting, $control ) {
		$input_decoded = json_decode( $value );

		if ( ! is_array( $input_decoded ) ) {
			$validity->add( 'wrong', esc_html__( 'The value should be a list.', 'kkcp' ) );
		} else {
			foreach ( $input_decoded as $key ) {
				if ( ! isset( $control->choices[ $key ] ) ) {
					$validity->add( 'wrong', sprintf( esc_html__( 'The value %s is not a choice.', 'kkcp' ), $key ) );
				}
			}
		}
		return $validity;
	}

	/**
	 * String in choices
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	public static function string_in_choices( $validity, $value, $setting, $control ) {
		if ( ! isset( $control->choices[ $value ] ) ) {
			$validity->add( 'not_a_choice', esc_html__( 'The value is not an allowed choice.', 'kkcp' ) );
		}
		return $validity;
	}

}