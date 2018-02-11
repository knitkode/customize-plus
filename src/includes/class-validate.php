<?php defined( 'ABSPATH' ) or die;

/**
 * Validate functions
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Validate {

	/**
	 * Validate a single choice
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	public static function single_choice( $validity, $value, $setting, $control ) {
		if ( ! isset( $control->choices[ $value ] ) ) {
			$validity->add( 'vNotAChoice', sprintf( esc_html__( 'Value %s is not an allowed choice.' ), $value ) );
		}
		return $validity;
	}

	/**
	 * Validate an array of choices
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param array 							 $value   		 The value to validate.
 	 * @param WP_Customize_Setting $setting   	 Setting instance.
 	 * @param WP_Customize_Control $control 		 Control instance.
 	 * @param boolean  						 $check_length Should match choices length? e.g. for sortable control
 	 *                                      	   where the all the defined choices should be present in
 	 *                                      	   the validated value
	 * @return $validity
 	 */
	public static function multiple_choices( $validity, $value, $setting, $control, $check_length = false ) {

		if ( ! is_array( $value ) ) {
			$validity->add( 'vNotArray', esc_html__( 'Value must be a list.' ) );
		} else {

			// maybe check that the length of the value array is correct
			if ( $check_length && count( $control->choices ) !== count( $value ) ) {
				$validity->add( 'vNotExactLengthArray', sprintf( esc_html__( 'List of values must contain exactly %s values' ), count( $control->choices ) ) );
			}

			// maybe check the minimum number of choices selectable
			if ( isset( $control->min ) && count( $value ) < $control->min ) {
				$validity->add( 'vNotMinLengthArray', sprintf( esc_html__( 'List of values must contain minimum %s values.' ), $control->min ) );
			}

			// maybe check the maxmimum number of choices selectable
			if ( isset( $control->max ) && count( $value ) < $control->max ) {
				$validity->add( 'vNotMaxLengthArray', sprintf( esc_html__( 'List of values must contain maximum %s values.' ), $control->max ) );
			}

			// now check that the selected values are allowed choices
			foreach ( $value as $key ) {
				if ( ! isset( $control->choices[ $key ] ) ) {
					$validity->add( 'vNotAChoice', sprintf( esc_html__( 'Value %s is not an allowed choice.' ), $key ) );
				}
			}
		}

		return $validity;
	}

	/**
	 * Validate one or more choices
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	public static function one_or_more_choices( $validity, $value, $setting, $control ) {
		if ( is_string( $value ) ) {
			return self::single_choice( $validity, $value, $setting, $control );
		}
		return self::multiple_choices( $validity, $value, $setting, $control );
	}

}