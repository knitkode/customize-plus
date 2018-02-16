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
	 * Is an associative array or not
	 *
	 * @link(https://stackoverflow.com/a/145348, source1)
	 * @link(https://stackoverflow.com/a/145348, source2)
	 * @since  1.0.0
	 * @param  array   $array The array to test
	 * @return boolean
	 */
	public static function is_assoc( $array ) {
		if ( ! is_array( $array ) ) {
			return false;
		}

		// source1:
    foreach ( $array as $a ) {
      if ( is_array( $a ) ) return true;
    }
    return false;

    // source2:
		// // Keys of the array
		// $keys = array_keys( $array );

		// // If the array keys of the keys match the keys, then the array must
		// // not be associative (e.g. the keys array looked like {0:0, 1:1...}).
		// return array_keys( $keys ) !== $keys;
	}

	/**
	 * Is HEX color
	 *
	 * It needs a value cleaned of all whitespaces (sanitized)
	 *
	 * @since  1.0.0
	 * @param  string $value  The value value to check
	 * @return boolean
	 */
	public static function is_hex( $value ) {
		return preg_match( '/^#([A-Fa-f0-9]{3}){1,2}$/', $value );
	}

	/**
	 * Is RGB color
	 *
	 * It needs a value cleaned of all whitespaces (sanitized)
	 *
	 * @since  1.0.0
	 * @param  string $value  The value value to check
	 * @return boolean
	 */
	public static function is_rgb( $value ) {
		return preg_match( '/^rgba\((0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])$/', $value );
	}

	/**
	 * Is RGBA color
	 *
	 * It needs a value cleaned of all whitespaces (sanitized)
	 *
	 * @since  1.0.0
	 * @param  string $value  The value value to check
	 * @return boolean
	 */
	public static function is_rgba( $value ) {
		return preg_match( '/^rgba\((0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0?\.[0-9]*[1-9][0-9]*|[01])\)$/', $value );
	}

	/**
	 * Is setting value (`control.setting()`) empty?
	 * Used to check if required control's settings have instead an empty value
	 *
	 * @since  1.0.0
	 * @see php class method `KKcp_Sanitize::is_empty()`
	 * @param  string  $value A setting value
	 * @return boolean 				Whether the setting value has to be considered
	 *                        empty, or not set.
	 */
	public static function is_empty( $value ) {
		// first try to compare it to an empty string and to null
		if ( $value === '' || $value === null ) {
			return true;
		}

		// if it's a jsonized value try to parse it and...
		if ( is_string( $value ) ) {
			$value_parsed = json_decode( $value );
			if ( $value_parsed ) {
				// ...see if we have an empty array or an empty object
				if ( is_array( $value_parsed ) && empty( $value_parsed ) ) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Validate a required setting
	 *
	 * @since 1.0.0
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	public static function check_required( $validity, $value, $setting, $control ) {
		if ( self::is_empty( $value ) ) {
			$validity->add( 'vRequired', esc_html__( 'You must supply a value.' ) );
		}
		return $validity;
	}

	/**
	 * Is value in choices?
	 *
	 * @since  1.0.0
	 * @return boolean
	 */
	public static function is_value_in_choices ( $value, $choices ) {
		if ( self::is_assoc( $choices ) ) {
			return isset( $choices[ $value ] );
		}
		return in_array( $value, $choices );
	}

	/**
	 * Validate a single choice

	 * @since 1.0.0
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	public static function single_choice( $validity, $value, $setting, $control ) {
		if ( isset( $control->valid_choices ) && !empty( $control->valid_choices ) ) {
			$choices = $control->valid_choices;
		} else {
			$choices = $control->choices;
		}

		if ( ! self::is_value_in_choices( $value, $choices ) ) {
			$validity->add( 'vNotAChoice', sprintf( esc_html__( 'Value %s is not an allowed choice.' ), $value ) );
		}
		return $validity;
	}

	/**
	 * Validate an array of choices
	 *
	 * @since 1.0.0
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
		if ( isset( $control->valid_choices ) && !empty( $control->valid_choices ) ) {
			$choices = $control->valid_choices;
		} else {
			$choices = $control->choices;
		}

		if ( ! is_array( $value ) ) {
			$validity->add( 'vNotArray', esc_html__( 'Value must be a list.' ) );
		} else {

			// maybe check that the length of the value array is correct
			if ( $check_length && count( $choices ) !== count( $value ) ) {
				$validity->add( 'vNotExactLengthArray', sprintf( esc_html__( 'List of values must contain exactly %s values' ), count( $choices ) ) );
			}

			// maybe check the minimum number of choices selectable
			if ( isset( $control->min ) && is_int( $control->min ) && count( $value ) < $control->min ) {
				$validity->add( 'vNotMinLengthArray', sprintf( esc_html__( 'List of values must contain minimum %s values.' ), $control->min ) );
			}


			// maybe check the maxmimum number of choices selectable
			if ( isset( $control->max ) && is_int( $control->max ) && count( $value ) > $control->max ) {
				$validity->add( 'vNotMaxLengthArray', sprintf( esc_html__( 'List of values must contain maximum %s values.' ), $control->max ) );
			}

			// now check that the selected values are allowed choices
			foreach ( $value as $value_key ) {
				if ( ! self::is_value_in_choices( $value_key, $choices ) ) {
					$validity->add( 'vNotAChoice', sprintf( esc_html__( 'Value %s is not an allowed choice.' ), $value_key ) );
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

	/**
	 * Validate checkbox
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	public static function checkbox( $validity, $value, $setting, $control ) {
		if ( $filtered != 0 && $filtered != 1 ) {
			$validity->add( 'vCheckbox', esc_html__( 'The checkbox should be either checked or unchecked.' ) );
		}
		return $validity;
	}
}