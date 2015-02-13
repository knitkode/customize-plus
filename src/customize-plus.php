<?php defined( 'ABSPATH' ) or die;

/**
 * pkgNamePretty
 *
 * pkgDescription
 *
 * This plugin was built on top of a mix of WordPress-Plugin-Skeleton by Ian Dunn
 * (see {@link https://github.com/iandunn/WordPress-Plugin-Skeleton here} for details)
 * and WordPress-Plugin-Boilerplate (see {@link
 * https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate/ here} for details).
 *
 * @link              pkgHomepage
 * @since             0.0.1
 * @package           pkgName
 *
 * @wordpress-plugin
 * Plugin Name:       pkgNamePretty
 * Plugin URI:        pkgHomepage
 * Description:       pkgDescription
 * Version:           pkgVersion
 * Author:            pkgAuthorName
 * Author URI:        http://example.com/
 * License:           GPLv2 or later (license.txt)
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       pkgTextdomain
 * Domain Path:       /languages
 */

define( 'K6CP_NAME', 'pkgNamePretty' );
define( 'K6CP_REQUIRED_PHP_VERSION', '5.2.4' );
define( 'K6CP_REQUIRED_WP_VERSION', '4.1' );

/**
 * Checks if the system requirements are met
 *
 * @since  0.0.1
 * @global string $wp_version
 * @return bool True if system requirements are met, false if not
 */
function k6cp_requirements_met() {
	global $wp_version;

	if ( version_compare( PHP_VERSION, K6CP_REQUIRED_PHP_VERSION, '<' ) ) {
		return false;
	}

	if ( version_compare( $wp_version, K6CP_REQUIRED_WP_VERSION, '<' ) ) {
		return false;
	}

	return true;
}

/**
 * Prints an error that the system requirements weren't met.
 *
 * @since  0.0.1
 * @global string $wp_version
 */
function k6cp_requirements_error() {
	global $wp_version;

	require_once( plugin_dir_path( __FILE__ ) . 'views/requirements-error.php' );
}

/**
 * Check requirements and load main class
 * The main program needs to be in a separate file that only gets loaded if
 * the plugin requirements are met. Otherwise older PHP installations could
 * crash when trying to parse it.
 *
 * @since  0.0.1
 */
if ( k6cp_requirements_met() ) {
	require_once( plugin_dir_path( __FILE__ ) . 'includes/class-k6cp.php' );

	if ( class_exists( 'K6CP' ) ) {
		$GLOBALS['k6cp'] = K6CP::get_instance();
		register_activation_hook( __FILE__, array( $GLOBALS['k6cp'], 'activate' ) );
		register_deactivation_hook( __FILE__, array( $GLOBALS['k6cp'], 'deactivate' ) );
	}
} else {
	add_action( 'admin_notices', 'k6cp_requirements_error' );
}
