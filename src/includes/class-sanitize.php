<?php defined( 'ABSPATH' ) or die;

/**
 * Sanitize
 *
 * Collects all sanitize methods used by Customize Plus controls. Each function
 * has also a respective JavaScript version in `sanitize.js`.
 * A good resource about customize sanitization is @link(http://git.io/vZ0dL,
 * this series of examples)
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2018 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Sanitize {

	/**
	 * Sanitize string
	 *
	 * @since 1.0.0
	 *
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
	 *
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
	 * Sanitize single choice
	 *
	 * @since 1.0.0
	 *
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
	 *
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
	 *
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
	 *
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
				array_push( $sanitized, KKcp_Helper::normalize_font_family( $font_family ) );
			}
			$sanitized = implode( ',', $sanitized );
		}
		return $sanitized;
	}

	/**
	 * Sanitize a checkbox
	 *
	 * @since 1.0.0
	 *
	 * @param mixed         			 $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return number:0|1 The sanitized value.
	 */
	public static function checkbox( $value, $setting, $control ) {
		$filtered = filter_var( $value, FILTER_VALIDATE_BOOLEAN );
		return $filtered ? 1 : 0;
	}

	/**
	 * Sanitize tags
	 *
	 * @since 1.0.0
	 *
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

		if ( isset( $control->max ) ) {
			$max_items = filter_var( $control->max, FILTER_SANITIZE_NUMBER_INT );

			if ( count( $value ) > $max_items ) {
				$value = array_slice( $value, $max_items );
			}
		}
		return wp_strip_all_tags( implode( ',', $value ) );
	}

	/**
	 * Sanitize text
	 *
	 * @since 1.0.0
	 *
	 * @param mixed         			 $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return string The sanitized value.
	 */
	public static function text( $value, $setting, $control ) {
		$attrs = $control->input_attrs;
		$input_type = isset( $attrs['type'] ) ? $attrs['type'] : 'text';

		$value = (string) $value;

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

		// html must be escaped
		if ( $control->html === 'escape' ) {
			$value = esc_html( $value );
		}
		// html is dangerously completely allowed
		else if ( $control->html === 'dangerous' ) {
			$value = $value;
		}
		// html is not allowed at all
		else if ( ! $control->html ) {
			$value = wp_strip_all_tags( $value );
		}
    // html is a valid argument for wp_kses_allowed_html
    else if ( $control->html ) {
    	$value = wp_kses( $value, wp_kses_allowed_html( $control->html ) );
    }

		return $value;
	}

	/**
	 * Sanitize number
	 *
	 * @since 1.0.0
	 *
	 * @param mixed         			 $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return number The sanitized value.
	 */
	public static function number( $value, $setting, $control ) {
		$number = KKcp_Helper::extract_number( $value, $control );

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
			if ( isset( $attrs['step'] ) && KKcp_Helper::modulus( $number, $attrs['step'] ) != 0 ) {
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
	 * Sanitize CSS size unit
	 *
	 * @since 1.0.0
	 *
	 * @param string   $unit    			The unit to sanitize
 	 * @param mixed    $allowed_units The allowed units
	 * @return string
 	 */
	public static function size_unit( $unit, $allowed_units ) {
		// if no unit is allowed
		if ( empty( $allowed_units )) {
			return '';
		}
		// if it needs a unit and it is missing
		else if ( ! empty( $allowed_units ) && ! $unit ) {
			return $allowed_units[0];
		}
		// if the unit specified is not in the allowed ones
		else if ( ! empty( $allowed_units ) && $unit && ! in_array( $unit, $allowed_units ) ) {
			return $allowed_units[0];
		}
		// if the unit specified is in the allowed ones
		else if ( ! empty( $allowed_units ) && $unit && in_array( $unit, $allowed_units ) ) {
			return $unit;
		}

		return '';
	}

	/**
	 * Sanitize slider
	 *
	 * @since 1.0.0
	 *
	 * @param mixed         			 $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return string|number The sanitized value.
	 */
	public static function slider( $value, $setting, $control ) {
		$number = KKcp_Helper::extract_number( $value, $control->allowFloat );
		$unit = KKcp_Helper::extract_size_unit( $value, $control->units );

		$number = self::number( $number, $setting, $control );
		$unit = self::size_unit( $unit, $control->units );

		if ( is_null( $number ) ) {
			return $setting->default;
		}

		if ( $unit ) {
			return $number . $unit;
		}

		return $number;
	}

	/**
	 * Sanitize color
	 *
	 * It escapes HTML, removes spacs and strips the alpha channel if not allowed.
	 * It checks also for a hex color string like '#c1c2b4' or '#c00' or '#CCc000'
	 * or 'CCC' and fixes it. If the value is not valid it returns the setting
	 * default.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed         			 $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return string|number The sanitized value.
	 */
	public static function color( $value, $setting, $control ) {
		$value = (string) $value;
		$value = esc_html( preg_replace( '/\s+/', '', $value ) );

		// @@doubt here there might be a race condition when the developer defines
		// a palette that have rgba colors without setting `alpha` to `true`. \\
		if ( KKcp_Helper::is_rgba( $value ) && ! $control->alpha ) {
			return KKcp_Helper::rgba_to_rgb( $value );
		}
		if ( preg_match( '/^([A-Fa-f0-9]{3}){1,2}$/', $value ) ) {
			return '#' . $value;
		}
		$validity = KKcp_Validate::color( new WP_Error(), $value, $setting, $control );

		if ( ! empty( $validity->get_error_messages() ) ) {
			return $setting->default;
		}
		return $value;
	}

	/**
	 * Sanitize CSS
	 *
	 * @link(http://git.io/vZ05N, source)
	 * @since 1.0.0
	 *
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
	 * @since 1.0.0
	 *
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
	 * @since 1.0.0
	 *
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
	 * @since 1.0.0
	 *
	 * @since  1.0.0
	 * @param string $nohtml The no-HTML content to sanitize.
	 * @return string Sanitized no-HTML content.
	 */
	private static function nohtml( $nohtml ) {
		return wp_filter_nohtml_kses( $nohtml );
	}
}
