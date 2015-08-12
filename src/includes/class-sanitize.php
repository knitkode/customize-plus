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
	 * [alpha description]
	 * @param  [type] $value [description]
	 * @return [type]        [description]
	 */
	public static function alpha( $value ) {
		if ( is_numeric( $value ) && $value >= 0 && $value <= 1 ) {
			return $value;
		}
	}

	/**
	 * Sanitize font families.
	 *
	 * Be sure that each font family is wrapped in quote,
	 * good for CSS consistency.
	 *
	 * @param  string $value
	 * @return string
	 */
	public static function font_families( $value ) { // @@todo to finish, check that the values are valid font family names \\
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

	/**
	 * [font_weight description]
	 * @param  [type] $value [description]
	 * @return [type]        [description]
	 */
	public static function font_weight( $value ) { // @@todo \\
		return $value;
	}

	/**
	 * Sanitize hex color
	 * check for a hex color string like '#c1c2b4' or '#c00' or '#CCc000' or 'CCC'
	 *
	 * @param  [type] $input [description]
	 * @return [type]        [description]
	 */
	public static function color_hex( $input ) {
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
	 * @return [type]        [description]
	 */
	public static function color_rgba( $input ) {
		// check for rgba color
		if ( preg_match( '/^rgba\(\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0?\.[0-9]*[1-9][0-9]*|[01])\s*\)$/', $input ) ) {
			return $input;
		} else {
			self::color( $input );
		}
	}

	/**
	 * Sanitize color (transparent or hex)
	 * @param  [type] $input [description]
	 * @return [type]        [description]
	 */
	public static function color( $input ) {
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
		else if ( self::color_hex( $input ) ) {
			// hex color is valid, return it normalized
			return self::color_hex( $input );
		}
	}
}