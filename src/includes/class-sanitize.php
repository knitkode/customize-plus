<?php defined( 'ABSPATH' ) or die;


/**
 * Sanitize functions
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     PlusWP <dev@pluswp.com> (http://pluswp.com)
 * @copyright  2015 PlusWP (kunderi kuus)
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       http://pluswp.com/customize-plus
 */

class PWPcp_Sanitize {

	/**
	 * Sanitize CSS
	 *
	 * @link(https://github.com/WPTRT/code-examples/blob/master/customizer/sanitization-callbacks.php#L27, source)
	 * @param string $input CSS to sanitize.
	 * @return string Sanitized CSS.
	 */
	public static function css( $input ) {
		return wp_strip_all_tags( $input );
	}

	/**
	 * Sanitize image
	 *
	 * @link(https://github.com/WPTRT/code-examples/blob/master/customizer/sanitization-callbacks.php#L141, source)
	 * @param string               $image   Image filename.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @return string The image filename if the extension is allowed; otherwise, the setting default.
	 */
	public static function image( $image, $setting ) {
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
	 * @link(https://github.com/WPTRT/code-examples/blob/master/customizer/sanitization-callbacks.php#L120, source)
	 * @param string $html HTML to sanitize.
	 * @return string Sanitized HTML.
	 */
	public static function html( $html ) {
		return wp_filter_post_kses( $html );
	}

	/**
	 * No-HTML sanitization callback example.
	 *
	 * @link(https://github.com/WPTRT/code-examples/blob/master/customizer/sanitization-callbacks.php#L179, source)
	 * @param string $nohtml The no-HTML content to sanitize.
	 * @return string Sanitized no-HTML content.
	 */
	public static function nohtml( $nohtml ) {
		return wp_filter_nohtml_kses( $nohtml );
	}

	/**
   * Is setting value (`control.setting()`) empty?
   * Used to check if required control's settings have instead an empty value
   * @see php class method `PWPcp_Sanitize::is_setting_value_empty()`
   * @param  string  $value
   * @return Boolean
   */
	public static function is_setting_value_empty( $value ) {
		// first try to compare it to an empty string
    if ( $value === '' ) {
    	return true;
    } else {
    	// if it's a jsonized value try to parse it and
	    $value_parsed = json_decode( $value );
			if ( $value_parsed ) {
				// see if we have an empty array or an empty object
				if ( is_array( $value_parsed ) && empty( $value_parsed ) ) {
					return true;
				}
			}
      return false;
		}
	}

	/**
	 * Sanitize font families.
	 *
	 * Be sure that each font family is wrapped in quote,
	 * good for CSS consistency.
	 *
	 * @param  string $input
	 * @return string
	 */
	public static function font_families( $input ) { // @@todo to finish, check that the inputs are valid font family names \\
		$font_families_sanitized = array();

		// treat a string
		if ( is_string( $input ) ) {
			foreach ( explode( ',', $input ) as $font_family ) {
				// remove eventual quotes
				$unquoted_font_family = str_replace( "'", '', str_replace( '"', '', $font_family ) );
				array_push( $font_families_sanitized, "'" . trim( $unquoted_font_family ) . "'" );
			}
			return implode( ',', $font_families_sanitized );
		}
		// and an array
		else if ( is_array( $input ) ) {
			foreach ( $input as $font_family ) {
				// remove eventual quotes
				$unquoted_font_family = str_replace( "'", '', str_replace( '"', '', $font_family ) );
				array_push( $font_families_sanitized, "'" . trim( $unquoted_font_family ) . "'" );
			}
			return $font_families_sanitized;
		}
	}

	/**
	 * [font_weight description]
	 * @param  [type] $input [description]
	 * @return [type]        [description]
	 */
	public static function font_weight( $input ) { // @@todo \\
		return $input;
	}

	/**
	 * Sanitize hex color
	 * check for a hex color string like '#c1c2b4' or '#c00' or '#CCc000' or 'CCC'
	 *
	 * @param  [type] $input [description]
	 * @return [type]        [description]
	 */
	public static function color_hex( $input ) {
		$input = trim( $input );

		if ( preg_match( '/^#([A-Fa-f0-9]{3}){1,2}$/', $input ) ) {
			return $input;
		}
		// check for a hex color string without hash 'c1c2b4'
		else if ( preg_match( '/^([A-Fa-f0-9]{3}){1,2}$/', $input ) ) {
			// hex color is valid, add hash
			return '#' . $input;
		}
	}

	/**
	 * Sanitize RGBA color
	 * @param  [type] $input [description]
	 * @return string|false
	 */
	public static function color_rgba( $input ) {
		$input = trim( $input );
		if ( preg_match( '/^rgba\(\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0?\.[0-9]*[1-9][0-9]*|[01])\s*\)$/', $input ) ) {
			$input = str_replace( ' ', '', $input );
			sscanf( $input, 'rgba(%d,%d,%d,%f)', $red, $green, $blue, $alpha );
			return "rgba($red,$green,$blue,$alpha)";
		} else {
			return false;
		}
	}

	/**
	 * Sanitize color (transparent or hex)
	 * @param  [type] $input [description]
	 * @return [type]        [description]
	 */
	public static function color( $input ) {
		$input = trim( $input );
		// @@todo trim... \\
		// check for transparent color
		if ( 'transparent' === $input ) {
			return $input;
		}
		// check for a hex color string like '#c1c2b4' or '#c00' or '#CCc000'
		else if ( self::color_hex( $input ) ) {
			// hex color is valid, return it normalized
			return self::color_hex( $input );
		}
		// check for a rgba color string
		else if ( self::color_rgba( $input ) ) {
			// hex color is valid, return it normalized
			return self::color_rgba( $input );
		}
	}

	/**
	 * Sanitize string compared to the choices array (i.e. for radio based control)
	 *
	 * @since 0.0.1
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	public static function string_in_choices( $value, $setting, $control ) {
		// value could be a number (i.e. in font_weight control)
		if ( isset( $control->choices[ strval( $value ) ] ) ) {
			return $value;
		} else {
			return $setting->default;
		}
	}

	/**
	 * Sanitize array compared to the choices array (i.e. for radio based control)
	 *
	 * @since 0.0.1
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	public static function array_in_choices( $value, $setting, $control ) {
		$value_decoded = json_decode( $value );

		if ( is_array( $value_decoded ) ) {
			$value_sanitized = array();

			foreach ( $value_decoded as $key ) {
				if ( isset( $control->choices[ $key ] ) ) {
					array_push( $value_sanitized, $key );
				}
			}
			return json_encode( $value_sanitized );
		} else {
			return $setting->default;
		}
	}
}