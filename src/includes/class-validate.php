<?php defined( 'ABSPATH' ) or die;

/**
 * Validate functions
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     Knitkode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 Knitkode
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/customize-plus
 */
class PWPcp_Validate {

	/**
	 * Array in choices
	 *
	 * @since 0.0.1
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
			$validity->add( 'wrong', __( 'The value should be a list.' ) );
		} else {
			foreach ( $input_decoded as $key ) {
				if ( ! isset( $control->choices[ $key ] ) ) {
					$validity->add( 'wrong', sprintf( __( 'The value %s is not a choice.' ), $key ) );
				}
			}
		}
		return $validity;
	}

	/**
	 * String in choices
	 *
	 * @since 0.0.1
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	public static function string_in_choices( $validity, $value, $setting, $control ) {
		if ( ! isset( $control->choices[ $value ] ) ) {
			$validity->add( 'not_a_choice', __( 'The value is not an allowed choice.' ) );
		}
		return $validity;
	}

}