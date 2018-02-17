<?php defined( 'ABSPATH' ) or die;

/**
 * Validate
 *
 * Collects all validate methods used by Customize Plus controls. Each function
 * has also a respective JavaScript version in `validate.js`.
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2018 KnitKode
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
	 *
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
	 *
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
	 *
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
	 *
	 * @param  string $value  The value value to check
	 * @return boolean
	 */
	public static function is_rgba( $value ) {
		return preg_match( '/^rgba\((0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0?\.[0-9]*[1-9][0-9]*|[01])\)$/', $value );
	}

	/**
	 * Is setting value (`control.setting()`) empty?
	 *
	 * Used to check if required control's settings have instead an empty value
	 *
	 * @since  1.0.0
	 *
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
	 * Validate a required setting value
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return WP_Error
 	 */
	public static function check_required( $validity, $value, $setting, $control ) {
		if ( self::is_empty( $value ) ) {
			$validity->add( 'vRequired', esc_html__( 'You must supply a value.' ) );
		}
		return $validity;
	}

	/**
	 * Validate a single choice
   *
	 * @since 1.0.0
	 *
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return WP_Error
 	 */
	public static function single_choice( $validity, $value, $setting, $control ) {
		if ( isset( $control->valid_choices ) && !empty( $control->valid_choices ) ) {
			$choices = $control->valid_choices;
		} else {
			$choices = $control->choices;
		}

		if ( ! in_array( $value, $choices ) ) {
			$validity->add( 'vNotAChoice', sprintf( esc_html__( 'Value %s is not an allowed choice.' ), $value ) );
		}
		return $validity;
	}

	/**
	 * Validate an array of choices
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Error 						 $validity
	 * @param array 							 $value   		 The value to validate.
 	 * @param WP_Customize_Setting $setting   	 Setting instance.
 	 * @param WP_Customize_Control $control 		 Control instance.
 	 * @param boolean  						 $check_length Should match choices length? e.g.
 	 *                                      		 for sortable control where the
 	 *                                         	 all the defined choices should be
 	 *                                           present in the validated value
	 * @return WP_Error
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
				if ( ! in_array( $value_key, $choices ) ) {
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
	 *
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return WP_Error
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
	 *
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return WP_Error
 	 */
	public static function checkbox( $validity, $value, $setting, $control ) {
		if ( $filtered != 0 && $filtered != 1 ) {
			$validity->add( 'vCheckbox', esc_html__( 'The checkbox should be either checked or unchecked.' ) );
		}
		return $validity;
	}

	/**
	 * Validate tags
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return WP_Error
 	 */
	public static function tags( $validity, $value, $setting, $control ) {
		if ( ! is_string( $value ) ) {
			$validity->add( 'vTagsType', esc_html__( 'Tags must be a string.' ) );
		} else {
			$value = explode( ',', $value );
		}

		// maybe check the minimum number of choices selectable
		if ( isset( $control->min ) && is_int( $control->min ) && count( $value ) < $control->min ) {
			$validity->add( 'vTagsMin', esc_html__( 'Minimum %s tags required.' ) );
		}
		// maybe check the maxmimum number of choices selectable
		if ( isset( $control->max ) && is_int( $control->max ) && count( $value ) > $control->max ) {
			$validity->add( 'vTagsMax', esc_html__( 'Maximum %s tags allowed.' ) );
		}

		return $validity;
	}

	/**
	 * Validate text
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return WP_Error
 	 */
	public static function text( $validity, $value, $setting, $control ) {
		$attrs = $control->input_attrs;

		$input_type = isset( $attrs['type'] ) ? $attrs['type'] : 'text';

		// type
		if ( ! is_string( $value ) ) {
			$validity->add( 'vTextType', esc_html__( 'The value must be a string.' ) );
		}
		// url
		if ( 'url' === $input_type && ! filter_var( $value, FILTER_VALIDATE_URL ) ) {
	    $validity->add( 'vInvalidUrl', esc_html__( 'Invalid URL.' ) );
		}
		// email
		else if ( 'email' === $input_type && ! is_email( $value ) ) {
			$validity->add( 'vInvalidEmail', esc_html__( 'Invalid email.' ) );
		}
		// max length
		if ( isset( $attrs['maxlength'] ) && is_int( $attrs['maxlength'] ) && strlen( $value ) > $attrs['maxlength'] ) {
			$validity->add( 'vTextTooLong', sprintf ( esc_html__( 'The text must be shorter than %s.' ), $attrs['maxlength'] ) );
		}
		// html
		if( $value != strip_tags( $value ) ) {
			$validity->add( 'vTextHtml', esc_html__( 'HTML is not allowed. It will be stripped out on save.' ) );
		}

		return $validity;
	}

	/**
	 * Validate number
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return WP_Error
 	 */
	public static function number( $validity, $value, $setting, $control ) {
		$value = ($value == (int) $value) ? (int) $value : (float) $value;

		// no number
		if ( ! is_numeric( $value ) ) {
			$validity->add( 'vNotAnumber', esc_html__( 'The value must be a number.' ) );

			return $validity;
		}
		// unallowed float
		if ( is_float( $value ) && ! $control->allowFloat ) {
			$validity->add( 'vNoFloat', esc_html__( 'The value must be an integer, not a float.' ) );
		}
		// must be an int but it is not
		else if ( ! is_int( $value ) && ! $control->allowFloat ) {
			$validity->add( 'vNotAnInteger', esc_html__( 'The value must be an integer number.' ) );
		}

		$attrs = $control->input_attrs;

		if ( $attrs ) {
			// if doesn't respect the step given
			if ( isset( $attrs['step'] ) && is_numeric( $attrs['step'] ) && KKcp_Utils::modulus( $value, $attrs['step'] ) != 0 ) {
				$validity->add( 'vNumberStep', sprintf( esc_html__( 'The number must be a multiple of %s.' ), $attrs['step'] ) );
			}
			// if it's lower than the minimum
			if ( isset( $attrs['min'] ) && is_numeric( $attrs['min'] ) && $value < $attrs['min'] ) {
				$validity->add( 'vNumberLow', sprintf( esc_html__( 'The number must be higher than %s.' ), $attrs['min'] ) );
			}
			// if it's higher than the maxmimum
			if ( isset( $attrs['max'] ) && is_numeric( $attrs['max'] ) && $value > $attrs['max'] ) {
				$validity->add( 'vNumberHigh', sprintf( esc_html__( 'The number must be lower than %s.' ), $attrs['max'] ) );
			}
		}

		return $validity;
	}

	/**
	 * Validate CSS size unit
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Error 					      $validity
	 * @param mixed    $unit    			The unit to validate.
 	 * @param mixed    $allowed_units The allowed units
	 * @return WP_Error
 	 */
	public static function size_unit( $validity, $unit, $allowed_units ) {
		// if it needs a unit and it is missing
		if ( ! empty( $allowed_units ) && ! $unit ) {
			$validity->add( 'vSliderMissingUnit', esc_html__( 'A CSS unit must be specified.' ) );
		}
		// if the unit specified is not in the allowed ones
		else if ( ! empty( $allowed_units ) && $unit && ! in_array( $unit, $allowed_units ) ) {
			$validity->add( 'vSliderInvalidUnit', esc_html__( 'The CSS unit is invalid.' ) );
		}
		// if a unit is specified but none is allowed
		else if ( empty( $allowed_units ) && $unit ) {
			$validity->add( 'vSliderNoUnit', esc_html__( 'This value does not accept a CSS unit.' ) );
		}

		return $validity;
	}

	/**
	 * Validate slider
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return WP_Error
 	 */
	public static function slider( $validity, $value, $setting, $control ) {
		$number = KKcp_Utils::extract_number( $value, $control->allowFloat );
		$unit = KKcp_Utils::extract_size_unit( $value, $control->units );

		$validity = self::number( $validity, $number, $setting, $control );
		$validity = self::size_unit( $validity, $unit, $control->units );

		return $validity;
	}

	/**
	 * Validate textarea
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return WP_Error
 	 */
	public static function textarea( $validity, $value, $setting, $control ) {
		// wrong type
		if ( is_string( $value ) ) {
			$validity->add( 'vTextType', esc_html__( 'Value must be a string.' ) );
		}
		//
		if ( $control->allowHTML || $control->wp_editor ) {

		// html
		if( $value != strip_tags( $value ) ) {
			$validity->add( 'vTextHtml', esc_html__( 'HTML is not allowed. It will be stripped out on save.' ) );
		}
			return wp_kses_post( $value );
		} else {
			return wp_strip_all_tags( $value );
		}
		return $validity;
	}
}
