<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'KKcp_Helper' ) ):

	/**
	 * Helper
	 *
	 * An helper class containing helper methods.
	 *
	 * @package    Customize_Plus
	 * @subpackage Customize
	 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
	 * @copyright  2018 KnitKode
	 * @license    GPLv3
	 * @version    Release: 1.0.21
	 * @link       https://knitkode.com/products/customize-plus
	 */
	class KKcp_Helper {

		/**
		 * Is setting value (`control.setting()`) empty?
		 *
		 * Used to check if required control's settings has an empty value
		 *
		 * @since  1.0.0
		 *
		 * @param  string  $value A setting value
		 * @return bool           Whether the setting value has to be considered
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
		 * Is keyword color?
		 *
		 * It needs a value cleaned of all whitespaces (sanitized)
		 *
		 * @since  1.0.0
		 *
		 * @param  string $value  The value value to check
		 * @return bool
		 */
		public static function is_keyword_color( $value ) {
			return in_array( $value, KKcp_Data::COLORS_KEYWORDS );
		}

		/**
		 * Is HEX color?
		 *
		 * It needs a value cleaned of all whitespaces (sanitized)
		 *
		 * @since  1.0.0
		 *
		 * @param  string $value  The value value to check
		 * @return bool
		 */
		public static function is_hex( $value ) {
			return preg_match( '/^#([A-Fa-f0-9]{3}){1,2}$/', $value );
		}

		/**
		 * Is RGB color?
		 *
		 * It needs a value cleaned of all whitespaces (sanitized)
		 *
		 * @since  1.0.0
		 *
		 * @param  string $value  The value value to check
		 * @return bool
		 */
		public static function is_rgb( $value ) {
			return preg_match( '/^rgba\((0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])$/', $value );
		}

		/**
		 * Is RGBA color?
		 *
		 * It needs a value cleaned of all whitespaces (sanitized)
		 *
		 * @since  1.0.0
		 *
		 * @param  string $value  The value value to check
		 * @return bool
		 */
		public static function is_rgba( $value ) {
			return preg_match( '/^rgba\((0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5]),(0?\.[0-9]*[1-9][0-9]*|[01])\)$/', $value );
		}

		/**
		 * Is a valid color among the color formats given?
		 *
		 * It needs a value cleaned of all whitespaces (sanitized)
		 *
		 * @since  1.0.0
		 *
		 * @param  string $value           The value value to check
		 * @param  array $allowed_formats  The allowed color formats
		 * @return bool
		 */
		public static  function is_color ( $value, $allowed_formats ) {
			foreach ( $allowed_formats as $format ) {
				if ( $format === 'keyword' && self::is_keyword_color( $value ) ) {
					return true;
				}
				else if ( $format === 'hex' && self::is_hex( $value ) ) {
					return true;
				}
				else if ( $format === 'rgb' && self::is_rgb( $value ) ) {
					return true;
				}
				else if ( $format === 'rgba' && self::is_rgba( $value ) ) {
					return true;
				}
			}

			return false;
		}

		/**
		 * Convert a hexa decimal color code to its RGB equivalent
		 *
		 * @link(http://php.net/manual/en/function.hexdec.php#99478, original source)
		 * @since  1.0.0
		 * @param  string  $value            Hexadecimal color value
		 * @param  bool    $return_as_string If set true, returns the value separated
		 *                                   by the separator character. Otherwise
		 *                                   returns associative array
		 * @return array|string              Depending on second parameter. Returns
		 *                                   `false` if invalid hex color value
		 */
		public static function hex_to_rgb( $value, $return_as_string = true ) {
			$value = preg_replace( '/[^0-9A-Fa-f]/ ', '', $value ); // Gets a proper hex string
			$rgb_array = array();
			// If a proper hex code, convert using bitwise operation. No overhead... faster
			if ( strlen( $value ) == 6 ) {
				$color_val = hexdec( $value );
				$rgb_array['red'] = 0xFF & ( $color_val >> 0x10 );
				$rgb_array['green'] = 0xFF & ( $color_val >> 0x8 );
				$rgb_array['blue'] = 0xFF & $color_val;
			// if shorthand notation, need some string manipulations
			} else if ( strlen( $value ) == 3 ) {
				$rgb_array['red'] = hexdec( str_repeat( substr( $value, 0, 1 ), 2 ) );
				$rgb_array['green'] = hexdec( str_repeat( substr( $value, 1, 1 ), 2 ) );
				$rgb_array['blue'] = hexdec( str_repeat( substr( $value, 2, 1 ), 2 ) );
			} else {
				return false; //Invalid hex color code
			}
			// returns the rgb string or the associative array
			return $return_as_string ? implode( ',', $rgb_array ) : $rgb_array;
		}

		/**
		 * Converts a RGBA color to a RGB, stripping the alpha channel value
		 *
		 * It needs a value cleaned of all whitespaces (sanitized).
		 *
		 * @since  1.0.0
		 * @param  string $input
		 * @return string
		 */
		public static function rgba_to_rgb( $input ) {
			sscanf( $input, 'rgba(%d,%d,%d,%f)', $red, $green, $blue, $alpha );
			return "rgba($red,$green,$blue)";
		}

		/**
		 * Normalize font family
		 *
		 * Be sure that a font family is trimmed and wrapped in quote, good for
		 * consistency
		 *
		 * @since  1.0.0
		 * @param  string $value
		 * @return string
		 */
		public static function normalize_font_family( $value ) {
			return "'" . trim( str_replace( "'", '', str_replace( '"', '', $value ) ) ) . "'";
		}

		/**
		 * Normalize font families
		 *
		 * Be sure that one or multiple font families are all trimmed and wrapped in
		 * quotes, good for consistency
		 *
		 * @since  1.0.0
		 *
		 * @param string|array value
		 * @return string|null
		 */
		public static function normalize_font_families( $value ) {
			$sanitized = array();

			if ( is_string( $value ) ) {
				$value = explode( ',', $value );
			}
			if ( is_array( $value ) ) {
				foreach ( $value as $font_family ) {
					array_push( $sanitized, self::normalize_font_family( $font_family ) );
				}
				return implode( ',', $sanitized );
			}

			return null;
		}

		/**
		 * Extract number from value, returns 0 otherwise
		 *
		 * @since  1.0.0
		 * @param  string         $value         The value from to extract from
		 * @param  bool|null      $allowed_float Whether float numbers are allowed
		 * @return int|float|null The extracted number or null if the value does not
		 *                        contain any digit.
		 */
		public static function extract_number( $value, $allowed_float ) {
			if ( is_int( $value ) || ( is_float( $value ) && $allowed_float ) ) {
				return $value;
			}
			if ( $allowed_float ) {
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
		 * Extract unit (like `px`, `em`, `%`, etc.) from an array of allowed units
		 *
		 * @since  1.0.0
		 * @param  string     $value          The value from to extract from
		 * @param  null|array $allowed_units  An array of allowed units
		 * @return string                     The first valid unit found.
		 */
		public static function extract_size_unit( $value, $allowed_units ) {
			if ( is_array( $allowed_units ) ) {
				foreach ( $allowed_units as $unit ) {
					if ( strpos( $value, $unit ) ) {
						return $unit;
					}
				}
				return isset( $allowed_units[0] ) ? $allowed_units[0] : '';
			}
			return '';
		}

		/**
		 * Modulus
		 *
		 * @todo this is not really precise...
		 * @see http://php.net/manual/it/function.fmod.php#76125
		 * @since  1.0.0
		 * @param  number $n1
		 * @param  number $n2
		 * @return number
		 */
		public static function modulus( $n1, $n2 ) {
			$division = $n1 / $n2;

			return (int) ( $n1 - ( ( (int) ( $division ) ) * $n2 ) );
		}

		/**
		 * Is an associative array or not
		 *
		 * @link(https://stackoverflow.com/a/145348, source1)
		 * @link(https://stackoverflow.com/a/145348, source2)
		 * @since  1.0.0
		 *
		 * @param  array   $array The array to test
		 * @return bool
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
		 * In array recursive
		 *
		 * @link(http://stackoverflow.com/a/4128377/1938970, source)
		 * @since  1.0.0
		 * @param  string|number $needle
		 * @param  array         $haystack
		 * @param  bool          $strict
		 * @return bool
		 */
		public static function in_array_r( $needle, $haystack, $strict = false ) {
			foreach ( $haystack as $item ) {
				if ( ( $strict ? $item === $needle : $item == $needle ) ||
					( is_array( $item ) && self::in_array_r( $needle, $item, $strict ) )
				) {
					return true;
				}
			}
			return false;
		}

		/**
		 * Flattens a nested array
		 *
		 * @since  1.0.0
		 * @author {@link(http://ramartin.net/, Ron Martinez)}
		 * {@link(http://davidwalsh.name/flatten-nested-arrays-php#comment-64616,
		 * source)}
		 *
		 * Based on:
		 * {@link http://davidwalsh.name/flatten-nested-arrays-php#comment-56256}
		 *
		 * @param array $array     The array to flatten.
		 * @param int   $max_depth How many levels to flatten. Negative numbers
		 *                         mean flatten all levels. Defaults to -1.
		 * @param int   $_depth    The current depth level. Should be left alone.
		 */
		public static function array_flatten(array $array, $max_depth = -1, $_depth = 0) {
			$result = array();

			foreach ( $array as $key => $value ) {
				if ( is_array( $value ) && ( $max_depth < 0 || $_depth < $max_depth ) ) {
					$flat = self::array_flatten( $value, $max_depth, $_depth + 1 );
					if ( is_string( $key ) ) {
						$duplicate_keys = array_keys( array_intersect_key( $array, $flat ) );
						foreach ( $duplicate_keys as $k ) {
							$flat["$key.$k"] = $flat[ $k ];
							unset( $flat[ $k ] );
						}
					}
					$result = array_merge( $result, $flat );
				}
				else {
					if ( is_string( $key ) ) {
						$result[ $key ] = $value;
					}
					else {
						$result[] = $value;
					}
				}
			}
			return $result;
		}
	}

endif;
