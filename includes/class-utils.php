<?php defined( 'ABSPATH' ) or die;

/**
 * Utils functions
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Utils {

	/**
	 * Compress HTML
	 * @param  string $buffer The php->HTML buffer
	 * @return string         The compressed HTML (stripped whitespaces)
	 * @since  1.0.0
	 */
	public static function compress_html( $buffer ) {
		return preg_replace( '/\s+/', ' ', str_replace( array( "\n", "\r", "\t" ), '', $buffer ) );
	}

	/**
	 * Get asset file, minified or unminified
	 *
	 * @param  string $filename
	 * @param  string $type
	 * @param  string $base_url
	 * @param  string $ext
	 * @return string
	 */
	public static function get_asset( $filename, $type, $base_url, $ext = '' ) {
		if ( ! $ext ) {
			$ext = $type;
		}
		$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		return plugins_url( "assets/$type/$filename$min.$ext", $base_url );
	}
}

// add ajax action
add_action( 'wp_ajax_KKcp_utils_load_wp_editor', 'KKcp_Utils::load_wp_editor' );