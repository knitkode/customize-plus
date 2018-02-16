<?php defined( 'ABSPATH' ) or die;

/**
 * Sanitize functions
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Sanitize {

	/**
	 * Sanitize string
	 *
	 * @since 1.0.0
	 * @param mixed     				   $input   The value to sanitize.
	 * @return string The sanitized value.
	 */
	public static function string( $input ) {
		if ( ! is_string( $input ) ) {
			$input = (string) $input;
		}
		return sanitize_text_field( $input );
	}

	/**
	 * Sanitize array
	 *
	 * @since 1.0.0
	 * @param mixed      		   	   $input   The value to sanitize.
	 * @return array The sanitized value.
	 */
	public static function array( $input ) {
		if ( ! is_array( $input ) ) {
			$input = (array) $input;
		}

		$input_sanitized = array();

		foreach ( $input as $key ) {
			if ( is_string( $key ) ) {
				array_push( $input_sanitized, sanitize_text_field( $key ) );
			} else {
				array_push( $input_sanitized, $key );
			}
		}
		return $input_sanitized;
	}

	/**
	 * Sanitize hex color
	 * check for a hex color string like '#c1c2b4' or '#c00' or '#CCc000' or 'CCC'
	 *
	 * It needs a value cleaned of all whitespaces (sanitized).
	 *
	 * @since  1.0.0
	 * @param  string $input  The input value to sanitize
	 * @return string|boolean The sanitized input or `false` in case the input
	 *                        value is not valid.
	 */
	public static function hex( $input ) {
		if ( preg_match( '/^([A-Fa-f0-9]{3}){1,2}$/', $input ) ) {
			return '#' . $input;
		}
		return $input;
	}

	/**
	 * Sanitize single choice
	 *
	 * @since 1.0.0
	 * @param string         			 $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return string The sanitized value.
	 */
	public static function single_choice( $value, $setting, $control ) {
		return self::string( $value );
	}

	/**
	 * Sanitize multiple choices
	 *
	 * @since 1.0.0
	 * @param array         			 $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return array The sanitized value.
	 */
	public static function multiple_choices( $value, $setting, $control ) {
		return self::array( $value );
	}

	/**
	 * Sanitize one or more choices
	 *
	 * @since 1.0.0
	 * @param string|array         $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return string|array The sanitized value.
	 */
	public static function one_or_more_choices( $value, $setting, $control ) {
		if ( is_string( $value ) ) {
			return self::single_choice( $value );
		}

		return self::multiple_choices( $value );
	}

	/**
	 * Sanitize font family
	 *
	 * @since  1.0.0
	 * @param string|array         $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return string The sanitized value.
	 */
	public static function font_family( $value ) {
		$sanitized = array();

		if ( is_string( $value ) ) {
			$value = explode( ',', $value );
		}
		if ( is_array( $value ) ) {
			foreach ( $value as $font_family ) {
				array_push( $sanitized, KKcp_Utils::normalize_font_family( $font_family ) );
			}
			$sanitized = implode( ',', $sanitized );
		}
		return $sanitized;
	}

	/**
	 * Sanitize a checkbox
	 *
	 * @since 1.0.0
	 * @param mixed         			 $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return number The sanitized value.
	 */
	public static function checkbox( $value, $setting, $control ) {
		$filtered = filter_var( $value, FILTER_VALIDATE_BOOLEAN );
		return $filtered ? 1 : 0;
	}

	/**
	 * Sanitize tags
	 *
	 * @since 1.0.0
	 * @param mixed         			 $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return string The sanitized value.
	 */
	public static function tags( $value, $setting, $control ) {
		if ( is_string( $value ) ) {
			$value = explode( ',', $value );
		}
		if ( ! is_array( $value ) ) {
			$value = array( self::string( $value ) );
		}
		$value = array_map( 'trim', $value );
		$value = array_unique( $value );

		// if ( isset( $control->max ) ) {
		// 	$max_items = filter_var( $control->max, FILTER_SANITIZE_NUMBER_INT );

		// 	if ( count( $value ) > $max_items ) {
		// 		$value = array_slice( $value, $max_items );
		// 	}
		// }
		return wp_strip_all_tags( implode( ',', $value ) );
	}

	/**
	 * Sanitize text
	 *
	 * @since 1.0.0
	 * @param mixed         			 $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return string The sanitized value.
	 */
	public static function text( $value, $setting, $control ) {
		$attrs = $control->input_attrs;
		$input_type = isset( $attrs['type'] ) ? $attrs['type'] : 'text';

		$value = self::string( $value );

		// url
		if ( 'url' === $input_type ) {
			$value = filter_var( $value, FILTER_SANITIZE_URL );
		}
		// email
		else if ( 'email' === $input_type ) {
			$value = sanitize_email( $value );
		}
		// max length
		if ( isset( $attrs['maxlength'] ) && strlen( $value ) > $attrs['maxlength'] ) {
			$value = substr( $value, 0, $attrs['maxlength'] );
		}

		return wp_strip_all_tags( $value );
	}

	/**
	 * Sanitize number
	 *
	 * @since 1.0.0
	 * @param mixed         			 $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return number The sanitized value.
	 */
	public static function number( $value, $setting, $control ) {
		$number = self::extract_number( $value, $control );

		if ( is_null( $number ) ) {
			return $setting->default;
		}

		$attrs = $control->input_attrs;

		// if it's a float but it is not allowed to be it round it
		if ( is_float( $number ) && ! $control->allowFloat ) {
			$number = round( $number );
		}
		if ( $attrs ) {
			// if doesn't respect the step given round it to the closest
			// then do the min and max checks
			if ( isset( $attrs['step'] ) && $number % $attrs['step'] !== 0 ) {
				$number = round( $number / $attrs['step'] ) * $attrs['step'];
			}
			// if it's lower than the minimum return the minimum
			if ( isset( $attrs['min'] ) && $number < $attrs['min'] ) {
				return $attrs['min'];
			}
			// if it's higher than the maxmimum return the maximum
			if ( isset( $attrs['max'] ) && $number > $attrs['max'] ) {
				return $attrs['max'];
			}
		}
		return $number;
	}

	/**
	 * Extract unit (like `px`, `em`, `%`, etc.) from control->units property
	 *
	 * @since  1.0.0
	 * @param  string               $value   The control's setting value
	 * @param  WP_Customize_Control $control Control instance.
	 * @return string 				               The first valid unit found.
	 */
	public static function extract_size_unit( $value, $control ) {
		if ( is_array( $control->units ) ) {
			foreach ( $control->units as $unit ) {
				if ( strpos( $value, $unit ) ) {
					return $unit;
				}
			}
			return isset( $control->units[0] ) ? $control->units[0] : '';
		}
		return '';
	}

	/**
	 * Extract number from value, returns 0 otherwise
	 *
	 * @since  1.0.0
	 * @param  string 							$value   The value from where to extract
	 * @param  WP_Customize_Control $control Control instance.
	 * @return int|float|null       The extracted number or null if the value
	 *                              does not contain any digit.
	 */
	public static function extract_number( $value, $control ) {
		if ( is_int( $value ) || ( is_float( $value ) && $control->allowFloat ) ) {
			return $value;
		}
		if ( $control->allowFloat ) {
			$number_extracted = filter_var( $value, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION );
		} else {
			$number_extracted = filter_var( $value, FILTER_SANITIZE_NUMBER_INT );
		}
		if ( $number_extracted || 0 === $number_extracted ) {
			return $number_extracted;
		}
		return null;
	}

	/**
	 * Sanitize CSS
	 *
	 * @link(http://git.io/vZ05N, source)
	 * @param string $input CSS to sanitize.
	 * @return string Sanitized CSS.
	 */
	private static function css( $input ) {
		return wp_strip_all_tags( $input );
	}

	/**
	 * Sanitize image
	 *
	 * @link(http://git.io/vZ05p, source)
	 * @param string               $image   Image filename.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @return string The image filename if the extension is allowed; otherwise, the setting default.
	 */
	private static function image( $image, $setting ) {
		// Array of valid image file types.
		// The array includes image mime types that are included in wp_get_mime_types()
		$mimes = array(
				'jpg|jpeg|jpe' => 'image/jpeg',
				'gif'          => 'image/gif',
				'png'          => 'image/png',
				'bmp'          => 'image/bmp',
				'tif|tiff'     => 'image/tiff',
				'ico'          => 'image/x-icon'
		);
		// Return an array with file extension and mime_type.
		$file = wp_check_filetype( $image, $mimes );
		// If $image has a valid mime_type, return it; otherwise, return the default.
		return ( $file['ext'] ? $image : $setting->default );
	}

	/**
	 * HTML sanitization callback example.
	 *
	 * @link(http://git.io/vZ0dv, source)
	 * @param string $html HTML to sanitize.
	 * @return string Sanitized HTML.
	 */
	private static function html( $html ) {
		return wp_filter_post_kses( $html );
	}

	/**
	 * No-HTML sanitization callback example.
	 *
	 * @link(http://git.io/vZ0dL, source)
	 * @since  1.0.0
	 * @param string $nohtml The no-HTML content to sanitize.
	 * @return string Sanitized no-HTML content.
	 */
	private static function nohtml( $nohtml ) {
		return wp_filter_nohtml_kses( $nohtml );
	}
}
