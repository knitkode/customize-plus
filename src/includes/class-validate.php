<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'KKcp_Validate' ) ):

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
		public static function required( $validity, $value, $setting, $control ) {
			if ( ! $control->optional ) {
				if ( KKcp_Helper::is_empty( $value ) ) {
					// $validity->add( 'vRequired', esc_html__( 'You must supply a value.' ) );
					$validity = $control->add_error( $validity, 'vRequired' );
				}
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
			if ( isset( $control->valid_choices ) && ! empty( $control->valid_choices ) ) {
				$choices = $control->valid_choices;
			} else {
				$choices = $control->choices;
			}

			if ( is_array( $choices ) && ! in_array( $value, $choices ) ) {
				$validity = $control->add_error( $validity, 'vNotAChoice', $value );
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
			if ( isset( $control->valid_choices ) && ! empty( $control->valid_choices ) ) {
				$choices = $control->valid_choices;
			} else {
				$choices = $control->choices;
			}

			if ( ! is_array( $value ) ) {
				$validity = $control->add_error( $validity, 'vNotArray' );
			} else {

				// check that the length of the value array is correct
				if ( $check_length && count( $choices ) !== count( $value ) ) {
					$validity = $control->add_error( $validity, 'vNotExactLengthArray', count( $choices ) );
				}

				// check the minimum number of choices selectable
				if ( isset( $control->min ) && is_int( $control->min ) && count( $value ) < $control->min ) {
					$validity = $control->add_error( $validity, 'vNotMinLengthArray', $control->min );
				}

				// check the maxmimum number of choices selectable
				if ( isset( $control->max ) && is_int( $control->max ) && count( $value ) > $control->max ) {
					$validity = $control->add_error( $validity, 'vNotMaxLengthArray', $control->max );
				}

				// check that the selected values are allowed choices
				foreach ( $value as $value_key ) {
					if ( ! in_array( $value_key, $choices ) ) {
						$validity = $control->add_error( $validity, 'vNotAChoice', $value_key );
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
		 * Validate sortable
		 *
		 * @since 1.1.0
		 *
		 * @param WP_Error 						 $validity
		 * @param mixed 							 $value    The value to validate.
		 * @param WP_Customize_Setting $setting  Setting instance.
		 * @param WP_Customize_Control $control  Control instance.
		 * @return WP_Error
		 */
		public static function sortable( $validity, $value, $setting, $control ) {
			return self::multiple_choices( $validity, $value, $setting, $control, true );
		}

		/**
		 * Validate font family
		 *
		 * @since 1.0.0
		 *
		 * @param WP_Error 						 $validity
		 * @param mixed 							 $value    The value to validate.
		 * @param WP_Customize_Setting $setting  Setting instance.
		 * @param WP_Customize_Control $control  Control instance.
		 * @return WP_Error
		 */
		public static function font_family( $validity, $value, $setting, $control ) {
			if ( is_string( $value ) ) {
				$value = explode( ',', $value );
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
				$validity = $control->add_error( $validity, 'vCheckbox' );
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
				$validity = $control->add_error( $validity, 'vTagsType' );
			} else {
				$value = explode( ',', $value );
			}

			// maybe check the minimum number of tags allowed
			if ( isset( $control->min ) && is_int( $control->min ) && count( $value ) < $control->min ) {
				$validity = $control->add_error( $validity, 'vTagsMin', $control->min );
			}
			// maybe check the maximum number of tags allowed
			if ( isset( $control->max ) && is_int( $control->max ) && count( $value ) > $control->max ) {
				$validity = $control->add_error( $validity, 'vTagsMax', $control->max );
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
			$type = isset( $attrs['type'] ) ? $attrs['type'] : 'text';

			// type
			if ( ! is_string( $value ) ) {
				$validity = $control->add_error( $validity, 'vTextType' );
			}
			// url
			if ( 'url' === $type && ! filter_var( $value, FILTER_VALIDATE_URL ) ) {
				$validity = $control->add_error( $validity, 'vInvalidUrl' );
			}
			// email
			else if ( 'email' === $type && ! is_email( $value ) ) {
				$validity = $control->add_error( $validity, 'vInvalidEmail' );
			}
			// max length
			if ( isset( $attrs['maxlength'] ) && is_int( $attrs['maxlength'] ) && strlen( $value ) > $attrs['maxlength'] ) {
				$validity = $control->add_error( $validity, 'vTextTooLong', $attrs['maxlength'] );
			}
			// min length
			if ( isset( $attrs['minlength'] ) && is_int( $attrs['minlength'] ) && strlen( $value ) < $attrs['minlength'] ) {
				$validity = $control->add_error( $validity, 'vTextTooShort', $attrs['minlength'] );
			}
			// pattern
			if ( isset( $attrs['pattern'] ) && is_string( $attrs['pattern'] ) && ! preg_match( '/'.$attrs['pattern'].'/', $value ) ) {
				$validity = $control->add_error( $validity, 'vTextPatternMismatch', $attrs['pattern'] );
			}

			// html must be escaped
			if ( $control->html === 'escape' ) {
			}
			// html is dangerously completely allowed
			else if ( $control->html === 'dangerous' ) {
			}
			// html is not allowed at all
			else if ( ! $control->html ) {
				if ( $value != strip_tags( $value ) ) {
					$validity = $control->add_error( $validity, 'vTextHtml' );
				}
			}
			// html is a valid argument for wp_kses_allowed_html
			else if ( $control->html ) {
				if ( $value != wp_kses( $value, wp_kses_allowed_html( $control->html ) ) ) {
					$validity = $control->add_error( $validity, 'vTextInvalidHtml' );
				}
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
				$validity = $control->add_error( $validity, 'vNotAnumber' );

				return $validity;
			}
			// unallowed float
			if ( is_float( $value ) && ! isset( $control->input_attrs['float'] ) ) {
				$validity = $control->add_error( $validity, 'vNoFloat' );
			}
			// must be an int but it is not
			else if ( ! is_int( $value ) && ! isset( $control->input_attrs['float'] ) ) {
				$validity = $control->add_error( $validity, 'vNotAnInteger' );
			}

			$attrs = $control->input_attrs;

			if ( $attrs ) {
				// if doesn't respect the step given
				if ( isset( $attrs['step'] ) && is_numeric( $attrs['step'] ) && KKcp_Helper::modulus( $value, $attrs['step'] ) != 0 ) {
					$validity = $control->add_error( $validity, 'vNumberStep', $attrs['step'] );
				}
				// if it's lower than the minimum
				if ( isset( $attrs['min'] ) && is_numeric( $attrs['min'] ) && $value < $attrs['min'] ) {
					$validity = $control->add_error( $validity, 'vNumberLow', $attrs['min'] );
				}
				// if it's higher than the maxmimum
				if ( isset( $attrs['max'] ) && is_numeric( $attrs['max'] ) && $value > $attrs['max'] ) {
					$validity = $control->add_error( $validity, 'vNumberHigh', $attrs['max'] );
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
				$validity = $control->add_error( $validity, 'vSliderMissingUnit' );
			}
			// if the unit specified is not in the allowed ones
			else if ( ! empty( $allowed_units ) && $unit && ! in_array( $unit, $allowed_units ) ) {
				$validity = $control->add_error( $validity, 'vSliderInvalidUnit', $unit );
			}
			// if a unit is specified but none is allowed
			else if ( empty( $allowed_units ) && $unit ) {
				$validity = $control->add_error( $validity, 'vSliderNoUnit' );
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
			$number = KKcp_Helper::extract_number( $value, isset( $control->input_attrs['float'] ) );
			$unit = KKcp_Helper::extract_size_unit( $value, $control->units );

			$validity = self::number( $validity, $number, $setting, $control );
			$validity = self::size_unit( $validity, $unit, $control->units );

			return $validity;
		}

		/**
		 * Validate color
		 *
		 * @since 1.0.0
		 *
		 * @param WP_Error 						 $validity
		 * @param mixed 							 $value    The value to validate.
		 * @param WP_Customize_Setting $setting  Setting instance.
		 * @param WP_Customize_Control $control  Control instance.
		 * @return WP_Error
		 */
		public static function color( $validity, $value, $setting, $control ) {
			if ( ! is_string( $value ) ) {
				return $control->add_error( $validity, 'vColorWrongType' );
			}
			$value = preg_replace( '/\s+/', '', $value );

			if ( 'transparent' === $value && ! $control->transparent ) {
				$validity = $control->add_error( $validity, 'vNoTransparent' );
			}
			else if ( KKcp_Helper::is_rgba( $value ) && ! $control->alpha ) {
				$validity = $control->add_error( $validity, 'vNoRGBA' );
			}
			else if ( ! $control->picker && is_array( $control->palette ) ) {
				$value_normalized = KKcp_Helper::hex_to_rgb( $value );
				$palette_normalized = KKcp_Helper::array_flatten( $control->palette, 1 );
				$palette_normalized = array_map( 'KKcp_Helper::hex_to_rgb', $palette_normalized );
				if ( ! KKcp_Helper::in_array_r( $value_normalized, $palette_normalized ) ) {
					$validity = $control->add_error( $validity, 'vNotInPalette' );
				}
			}
			else if ( ! KKcp_Helper::is_color( $value, $control::$color_formats_supported ) ) {
				$validity = $control->add_error( $validity, 'vColorInvalid' );
			}

			return $validity;
		}
	}

endif;
