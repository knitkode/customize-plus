<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'KKcp_SanitizeJS' ) ):

	/**
	 * Sanitize JavaScript
	 *
	 * Contains methods to sanitize values defined in PHP before to be passed to
	 * JavaScript through JSON.
	 *
	 * @package    Customize_Plus
	 * @subpackage Customize
	 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
	 * @copyright  2018 KnitKode
	 * @license    GPLv3
	 * @version    Release: 1.0.22
	 * @link       https://knitkode.com/products/customize-plus
	 */
	class KKcp_SanitizeJS {

		/**
		 * Sanitize options for a js plugin
		 *
		 * @param  array $options
		 * @param  array $allowed_options
		 * @param  array $sanitized_options For 'recursion'
		 * @return array|null
		 */
		public static function options( $options, $allowed_options, $sanitized_options = array() ) {
			if ( ! is_array( $options) ) {
				return null;
			}

			foreach ( $options as $key => $value ) {
				$sanitized_options = self::option( $key, $value, $allowed_options, $sanitized_options );
			}

			return $sanitized_options;
		}

		/**
		 * Sanitization for a single js option
		 *
		 * @since 1.0.0
		 * @param  string $opt_key
		 * @param  mixed $opt_value
		 * @param  array $allowed
		 * @param  array $sanitized
		 * @return array
		 */
		private static function option( $opt_key, $opt_value, $allowed, $sanitized ) {
			$sanitizer = null;
			$sanitizer_function = null;

			if ( ! isset( $allowed[ $opt_key ] ) || ! isset( $allowed[ $opt_key ]['sanitizer'] ) ) {
			
				return $sanitized;
			}

			$sanitizer = $allowed[ $opt_key ]['sanitizer'];
			$strict = isset( $allowed[ $opt_key ]['strict'] );

			// first check on this class methods
			if ( method_exists( 'KKcp_SanitizeJS', $sanitizer ) ) {
				$sanitizer_function = 'KKcp_SanitizeJS::' . $sanitizer;
			}

			// otherwise see if a global functions has been indicated
			if ( function_exists( $sanitizer ) ) {
				$sanitizer_function = $sanitizer;
			}

			// if we don't have nested sanitization to do just call the sanitize method
			if ( ! isset( $allowed[ $opt_key ]['values'] ) ) {
				if ( $sanitizer_function ) {
					$sanitized[ $opt_key ] = call_user_func_array( $sanitizer_function, array( $strict, $opt_value ) );
				} else {
					wp_die( 'cp_api', sprintf( esc_html__( 'Customize Plus | API error: a sanitizer function must be specified for %s', 'kkcp' ), $opt_key ) );
				}

			// if we have nested sanitization
			} else {
				// if we want one string among a predefined set
				if ( $sanitizer === 'enum' ) {
					$sanitized[ $opt_key ] = self::enum( $strict, $opt_value, $allowed[ $opt_key ]['values'] );
				}
				// if we want to have a normal JavaScript Array (that is a flatten php array)
				else if ( $sanitizer === 'array' ) {
					$sanitized[ $opt_key ] = array();

					// either loop through the given options and check if they are allowed
					if ( is_array( $opt_value ) ) {
						foreach ( $opt_value as $opt_value_item ) {
							if ( self::item_in_array( $strict, $opt_value_item, $allowed[ $opt_key ]['values'] ) ) {
								array_push( $sanitized[ $opt_key ], $opt_value_item );
							}
						}
					}
					// or let the user define a string only instead of a single array element
					else if ( is_string( $opt_value ) ) {
						if ( self::item_in_array( $strict, $opt_value, $allowed[ $opt_key ]['values'] ) ) {
							// but the output in js is always an array
							array_push( $sanitized[ $opt_key ], $opt_value );
						}
					}

				// if we want to have either a JavaScript Object (that is a php associative
				// array)
				} else if ( $sanitizer === 'object' || $sanitizer === 'bool_object' ) {

					// if the option value is a boolean in this case is fine, WordPress
					// often allows arguments to be either a boolean or an associative
					// array (that is an object in JavaScript), but the sanitizer should
					// specify it explicitly that it allows booleans
					if ( is_bool( $opt_value ) && $sanitizer === 'bool_object' ) {
						$sanitized[ $opt_key ] = $opt_value;
					}

					// if the option value is an array (associative in theory)
					if ( is_array( $opt_value ) ) {

						// either allow a control to be permissive about it
						if ( isset( $allowed[ $opt_key ]['permissive_object'] ) ) {
							$sanitized[ $opt_key ] = $opt_value;
						// or go recursive
						} else {
							foreach ( $opt_value as $opt_value_subkey => $opt_value_subvalue ) {
								if ( isset( $allowed[ $opt_key ]['values'][ $opt_value_subkey ] ) ) {
									$sanitized[ $opt_key ] = self::option(
										$opt_value_subkey,
										$opt_value_subvalue,
										$allowed[ $opt_key ]['values'],
										array()
									);
								}
							}
						}
					}
				}
			}

			return $sanitized;
		}

		/**
		 * Sanitization for js value: number
		 *
		 * The input might comes as a string so let's use a generic way to coerce it
		 * to a number either int or float, @see http://bit.ly/2kh6mx9
		 *
		 * @since 1.0.0
		 * @param  bool  $strict If true it returns `null` and no API error
		 * @param  mixed $input
		 * @return number|null
		 */
		public static function number( $strict, $input ) {
			$input = $input + 0;

			if ( is_numeric( $input ) ) {
				return $input;
			}
			if ( ! $strict ) {
				return null;
			}
			wp_die( 'cp_api', sprintf( esc_html__( 'Customize Plus | API error: value %s must be a number.', 'kkcp' ), $input ) );
		}

		/**
		 * Sanitization for js value: integer
		 *
		 * The input might comes as a string so let's use a generic way to coerce it
		 * to a number either int or float, @see http://bit.ly/2kh6mx9
		 *
		 * @since 1.0.0
		 * @param  bool  $strict If true it returns `null` and no API error
		 * @param  mixed $input
		 * @return int|null
		 */
		public static function int( $strict, $input ) {
			$input = $input + 0;

			if ( is_int( $input ) ) {
				return $input;
			}
			if ( ! $strict ) {
				return null;
			}
			wp_die( 'cp_api', sprintf( esc_html__( 'Customize Plus | API error: value %s must be a integer.', 'kkcp' ), $input ) );
		}

		/**
		 * Sanitization for js value: int or null
		 *
		 * @since 1.0.0
		 * @param  bool  $strict If true it returns `null` and no API error
		 * @param  mixed $input
		 * @return int|null
		 */
		public static function int_or_null( $strict, $input ) {
			if ( is_null( $input ) ) {
				return null;
			}
			return self::int( $strict, $input );
		}

		/**
		 * Sanitization for js value: item in array
		 *
		 * @since 1.0.0
		 * @param  bool  $strict If true it returns `null` and no API error
		 * @param  mixed $input
		 * @param  array $list
		 * @return mixed|null
		 */
		public static function item_in_array ( $strict, $input, $list = array() ) {
			if ( is_string( $input ) ) {
				if ( in_array( $input, $list ) ) {
					return $input;
				}
				if ( ! $strict ) {
					return null;
				}
				wp_die( 'cp_api', sprintf( esc_html__( 'Customize Plus | API error: value %1$s must be one of %2$s.', 'kkcp' ), $input, implode( ', ', $list ) ) );
			} else if ( is_array( $input ) ) {
				foreach ( $input as $input_value ) {
					if ( ! in_array( $input_value, $list ) ) {
						if ( ! $strict ) {
							return null;
						}
						wp_die( 'cp_api', sprintf( esc_html__( 'Customize Plus | API error: value %1$s must be one of %2$s.', 'kkcp' ), $input_value, implode( ', ', $list ) ) );
					} else {
						return $input;
					}
				}
			}
		}

		/**
		 * Sanitization for js value: array
		 *
		 * @note we might want to force a flat array check with
		 * ! KKcp_Helper::is_assoc( $input )
		 *
		 * @since 1.0.0
		 * @param  bool  $strict If true it returns `null` and no API error
		 * @param  mixed $input
		 * @return array|null
		 */
		public static function array ( $strict, $input ) {
			if ( is_array( $input ) ) {
				return $input;
			}
			if ( ! $strict ) {
				return null;
			}
			wp_die( 'cp_api', sprintf( esc_html__( 'Customize Plus | API error: value %s must be an array.', 'kkcp' ), $input ) );
		}

		/**
		 * Sanitization for js value: boolean
		 *
		 * @since 1.0.0
		 * @param  bool  $strict If true it returns `null` and no API error
		 * @param  mixed $input
		 * @return bool|null
		 */
		public static function bool ( $strict, $input ) {
			if ( is_bool( $input ) ) {
				return $input;
			}
			if ( ! $strict ) {
				return null;
			}
			wp_die( 'cp_api', sprintf( esc_html__( 'Customize Plus | API error: value %s must be a boolean.', 'kkcp' ), $input ) );
		}

		/**
		 * Sanitization for js value: string
		 *
		 * @since 1.0.0
		 * @param  bool  $strict If true it returns `null` and no API error
		 * @param  mixed $input
		 * @return string|null
		 */
		public static function string ( $strict, $input ) {
			if ( is_string( $input ) ) {
				return $input;
			}
			if ( ! $strict ) {
				return null;
			}
			wp_die( 'cp_api', sprintf( esc_html__( 'Customize Plus | API error: value %s must be a string.', 'kkcp' ), $input ) );
		}

		/**
		 * Sanitization for js value: enum
		 *
		 * @since 1.0.0
		 * @param  bool  $strict If true it returns `null` and no API error
		 * @param  array $input
		 * @param  array $list
		 * @return string
		 */
		public static function enum ( $strict, $input, $list ) {
			if ( is_string( $input ) && in_array( $input, $list ) ) {
				return $input;
			}
			if ( ! $strict ) {
				return $list[0];
			}
			wp_die( 'cp_api', sprintf( esc_html__( 'Customize Plus | API error: value must be one of: %s', 'kkcp' ), implode( $list, ', ' ) ) );
		}
	}

endif;
