<?php

/**
 * Sanitize functions
 *
 * @package      pkgNamePretty
 * @subpackage   sanitize
 * @since        0.0.1
 * @link         pkgHomepage
 * @author       pkgAuthorName <pkgAuthorEmail> (pkgAuthorUrl)
 * @copyright    pkgConfigStartYear - pkgConfigEndYear | pkgLicenseType
 * @license      pkgLicenseUrl
 */

// k6cptemp, this function is more an util than a sanitize function \\
if ( ! function_exists( 'k6cp_compress_html' ) ) :
	/**
	 * [k6cp_compress_html description]
	 * @param  [type] $buffer [description]
	 * @return [type]         [description]
	 */
	function k6cp_compress_html( $buffer ) {
		return preg_replace( '/\s+/', ' ', str_replace( array( "\n", "\r", "\t" ), '', $buffer ) );
	}
endif;


/**
 * Sanitization functions
 * (can't be wrapped in a class)
 *
 * @since 0.0.1
 */

if ( ! function_exists( 'k6cp_sanitize_callback' ) ) :
	/**
	 * Theme Customizer sanitization callback function
	 */
	function k6cp_sanitize_callback( $input ) {
		return wp_kses_post( $input );
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_alpha' ) ) :
	/**
	 * [k6cp_sanitize_alpha description]
	 * @param  [type] $value [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_alpha( $value ) {
		if ( is_numeric( $value ) && $value >= 0 && $value <= 1 ) {
			return $value;
		}
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_font_families' ) ) :
	/**
	 * Sanitize font families.
	 *
	 * Be sure that each font family is wrapped in quote,
	 * good for CSS consistency.
	 *
	 * @param  string $value
	 * @return string
	 */
	function k6cp_sanitize_font_families( $value ) { // k6cptofinish, check that the values are valid font family names \\
		$font_families_sanitized = array();

		// treat a string
		if ( is_string( $value ) ) {
			foreach ( explode( ',', $value ) as $font_family ) {
				// remove eventual quotes
				$unquoted_font_family = str_replace( "'", '', str_replace( '"', '', $font_family ) );
				array_push( $font_families_sanitized, "'" . trim( $unquoted_font_family ) . "'" );
			}
			return implode( ',', $font_families_sanitized );
		}
		// and an array
		else if ( is_array( $value ) ) {
			foreach ( $value as $font_family ) {
				// remove eventual quotes
				$unquoted_font_family = str_replace( "'", '', str_replace( '"', '', $font_family ) );
				array_push( $font_families_sanitized, "'" . trim( $unquoted_font_family ) . "'" );
			}
			return $font_families_sanitized;
		}
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_font_weight' ) ) :
	/**
	 * [k6cp_sanitize_font_weight description]
	 * @param  [type] $value [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_font_weight( $value ) { // k6todo \\
		return $value;
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_number' ) ) :
	/**
	 * [k6cp_sanitize_number description]
	 * @param  [type] $value [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_number( $value ) {
		if ( is_numeric( $value ) && $value >= 0 ) {
			return $value;
		}
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_unit' ) ) :
	/**
	 * [k6cp_sanitize_unit description]
	 * @param  [type] $value [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_unit( $value ) { // k6todo \\
		// $units_allowed = array( 'px', 'em', '%', 'rem' );
		// if ( ! in_array( $extracted_unit, $units_allowed ) ) {
		// 	$extracted_unit = 'px';
		// }
		// if ( strpos( $value, 'are' ) !== false ) { // k6todo what is this?? \\
		// 	echo 'true';
		// }
		return $value;
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_unit_px' ) ) :
	/**
	 * [k6cp_sanitize_unit_px description]
	 * @param  [type] $value [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_unit_px( $value ) { // k6todo \\
		// if ( is_int( $value ) ) {
		// 	echo '<h1>' . strval( $value ) . 'px</h1>';
		// 	return strval( $value ) . 'px';
		// }
		return $value;
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_unit_percent' ) ) :
	/**
	 * [k6cp_sanitize_unit_percent description]
	 * @param  [type] $value [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_unit_percent( $value ) { // k6todo \\
		// if ( is_int( $value ) ) {
		// 	echo '<h1>' . strval( $value ) . 'px</h1>';
		// 	return strval( $value ) . 'px';
		// }
		return $value;
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_unit_px_percent' ) ) :
	/**
	 * [k6cp_sanitize_unit_px_percent description]
	 * @param  [type] $value [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_unit_px_percent( $value ) { // k6todo \\
		// if ( is_int( $value ) ) {
		// 	echo '<h1>' . strval( $value ) . 'px</h1>';
		// 	return strval( $value ) . 'px';
		// }
		return $value;
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_var_with_function' ) ) :
	/**
	 * [k6cp_sanitize_var_with_function description]
	 * @return [type] [description]
	 */
	function k6cp_sanitize_var_with_function ( $input, $return_args = false ) {
		$containing_array_functions = array();
		$containing_array_variables = array();
		// $containing_array_functions = K6CP_Preprocessor::$PREPROCESSOR_COLOR_SIMPLE_FUNCTIONS; // k6todo \\
		// $containing_array_variables = K6CP_Preprocessor::$COMPILER_VARIABLES_NAMES; // k6todo \\
		$input_stripped = preg_replace( '/\s+/', '', $input );
		// the following regex grab three groups from this kind of string: `darken(@link-color,10%)`
		// see https://regex101.com/r/nZ2eB5/1 for tests
		// allows any float or integer number, later we check if it is in the positive range 0 - 100
		preg_match( '/^([a-z]+)\(@([a-zA-Z-_0-9]+)\,\s?(0\.[0-9]*[1-9][0-9]*|100|[1-9]\d?|[1-9]\d?\.[0-9]+)%?\)$/', $input_stripped, $dynamic_args );
		if (
			$dynamic_args &&
			// be sure that function name is allowed
			in_array( $dynamic_args[1], $containing_array_functions ) &&
			// be sure that the variable name exists
			in_array( $dynamic_args[2], $containing_array_variables ) &&
			// be sure that the amount is a number between 1 and 100
			$dynamic_args[3] > 0 && $dynamic_args[3] < 101
		) {
			return $return_args ? $dynamic_args : $input_stripped;
		}
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_var' ) ) :
	/**
	 * [k6cp_sanitize_var description]
	 * @param  [string] $input       [description]
	 * @param  [boolean] $return_arg [description]
	 * @return [string]              The variable name with or without the leading `@`
	 */
	function k6cp_sanitize_var( $input, $return_arg = false ) {
		$input_stripped = preg_replace( '/\s+/', '', $input );
		$containing_array = array();
		// $containing_array = K6CP_Preprocessor::$COMPILER_VARIABLES_NAMES; // k6todo \\
		// the following regex grab one group from this kind of string: `@link-color`
		preg_match( '/^@([a-zA-Z-_0-9]+)$/', $input_stripped, $dynamic_args );
		if (
			$dynamic_args &&
			// be sure that the variable name exists
			in_array( $dynamic_args[1], $containing_array )
		) {
			return $return_arg ? $dynamic_args[1] : $input_stripped;
		}
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_hex_color' ) ) :
	/**
	 * [k6cp_sanitize_hex_color description]
	 * check for a hex color string like '#c1c2b4' or '#c00' or '#CCc000' or 'CCC'
	 *
	 * @param  [type] $input [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_hex_color( $input ) {
		if ( preg_match( '/^#([A-Fa-f0-9]{3}){1,2}$/', $input ) ) {
			return $input;
		}
		// check for a hex color string without hash 'c1c2b4'
		else if ( preg_match( '/^([A-Fa-f0-9]{3}){1,2}$/', $input ) ) {
			// hex color is valid, add hash
			return '#' . $input;
		}
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_color' ) ) :
	/**
	 * [k6cp_sanitize_color description]
	 * @param  [type] $input [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_color( $input ) {
		// k6todo trim... \\
		// check for transparent color
		if ( 'transparent' === $input ) {
			return $input;
		}
		// check for a hex color string like '#c1c2b4' or '#c00' or '#CCc000'
		else if ( k6cp_sanitize_hex_color( $input ) ) {
			// hex color is valid, return it normalized
			return k6cp_sanitize_hex_color( $input );
		}
		// if it's a simple color function or a simple variable
		else if ( k6cp_sanitize_var( $input ) || k6cp_sanitize_var_with_function( $input ) ) {
			return $input;
		}
		// otherwise just try to parse the value with CSS preprocessor Parser
		else {
			return k6cp_sanitize_preprocessor_value( $input );
		}
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_coloralpha' ) ) :
	/**
	 * [k6cp_sanitize_coloralpha description]
	 * @param  [type] $input [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_coloralpha( $input ) {
		// check for rgba color
		if ( preg_match( '/^rgba\(\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0?\.[0-9]*[1-9][0-9]*|[01])\s*\)$/', $input ) ) {
			return $input;
		} else {
			k6cp_sanitize_color( $input );
		}
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_size' ) ) :
	/**
	 * [k6cp_sanitize_size description]
	 *
	 * @see `utils.isValidForLess` js function
	 * @param  [type] $value [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_size( $value ) { // k6todo, see below \\
		// K6CB::log( $less_to_test, 'ciao pre' );
		return $value;
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_preprocessor_value' ) ) :
	/**
	 * [k6cp_sanitize_preprocessor_value description]
	 *
	 * @param  [type] $value [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_preprocessor_value( $value ) {
		return k6cp_parse_value_with_preprocessor( $value );
	}
endif;








if ( ! function_exists( 'k6cp_parse_value_with_preprocessor' ) ) :
	/**
	 * [k6cp_parse_value_with_preprocessor description]
	 *
	 * @see `utils.isValidForLess` js function
	 * @param  [type] $value [description]
	 * @param  [boolean] $return_arg [description]
	 * @return [type]        [description]
	 */
	function k6cp_parse_value_with_preprocessor( $value, $return_arg = false ) {
		if ( class_exists( 'Less_Parser' ) ) {
			try {
				$parser = new Less_Parser();

				$less_input = k6cp_get_less_test_input( $value, $value, '' );
				// K6CB::log( $less_input, 'k6cp_parse_value_with_preprocessor->$less_input' ); // k6debug \\

				$parser->parse( $less_input );
				$css_value_full = $parser->getCss();

				// grab the value from the compiled css (we have a predictable result,
				// so it's safe to use the following regex).
				preg_match( '/.v[\s\S]+\sv:\s*(.+);/', $css_value_full, $matches );
				$css_value = $matches[1];
				// K6CB::log( $css_value, 'k6cp_parse_value_with_preprocessor->$css_value' ); // k6debug \\

				return $return_arg ? $css_value : $value;
			} catch ( Exception $e ) {
				$error_message = $e->getMessage();
				return; // k6todo a default value in case of error? \\
			}
		} else {
			return;
		}
	}
endif;


if ( ! function_exists( 'k6cp_get_less_test_input' ) ) :
	/**
	 * [k6cp_get_less_test_input description]
	 * @param  string $value_to_get [description]
	 * @param  string $value      	[description]
	 * @param  string $less_input   [description]
	 * @return string               [description]
	 */
	function k6cp_get_less_test_input( $value_to_get, $value, $less_input ) {
		preg_match_all( '/@([a-zA-Z-_0-9]+)/', $value, $matches );
		$count_matches = count( $matches[0] );
		if ( $count_matches ) {
			for ( $i = 0; $i < $count_matches; $i++ ) {
				$var_name = $matches[1][ $i ];
				$var_value = K6CB::get_option( $var_name );
				if ( $var_value ) {
					$less_input .= '@' . $var_name . ':' . $var_value . ';';
				}
				return k6cp_get_less_test_input( $value_to_get, $var_value, $less_input );
			}
		} else {
			return $less_input . '@v:' . $value_to_get . ';.v{v:@v}';
		}
	}
endif;
