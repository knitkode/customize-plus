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
 * Plugin Name:       Customize Plus
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

define( 'K6CP_PLUGIN_FILE', __FILE__ );
define( 'K6CP_PLUGIN_VERSION', '0.0.1' );
define( 'K6CP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) ); // k6todo, we are not using this, but we should \\
define( 'K6CP_PLUGIN_URL', plugin_dir_url( __FILE__ ) ); // k6todo, we are not using this, but we should \\
require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-requirements.php' );
  require_once( K6CP_PLUGIN_DIR . 'includes/k6cp-actions.php' );
require_once( K6CP_PLUGIN_DIR . 'includes/k6cp-functions-sanitize.php' );
require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-core.php' );
require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-customize.php' );
require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-customize-manager.php' );
require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-theme.php' );
if ( is_admin() ) {
	require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-admin.php' );
}