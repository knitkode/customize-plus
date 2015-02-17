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
	}
endif;


if ( ! function_exists( 'k6cp_sanitize_alpha_color' ) ) :
	/**
	 * [k6cp_sanitize_alpha_color description]
	 * @param  [type] $input [description]
	 * @return [type]        [description]
	 */
	function k6cp_sanitize_alpha_color( $input ) {
		// check for rgba color
		if ( preg_match( '/^rgba\(\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0?\.[0-9]*[1-9][0-9]*|[01])\s*\)$/', $input ) ) {
			return $input;
		} else {
			k6cp_sanitize_color( $input );
		}
	}
endif;
