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

define( 'PWPcp_PLUGIN_FILE', __FILE__ );
define( 'PWPcp_PLUGIN_VERSION', '0.0.1' );
define( 'PWPcp_PLUGIN_DIR', plugin_dir_path( __FILE__ ) ); // @@todo, we are not using this, but we should \\
define( 'PWPcp_PLUGIN_URL', plugin_dir_url( __FILE__ ) ); // @@todo, we are not using this, but we should \\

require_once( PWPcp_PLUGIN_DIR . 'includes/class-requirements.php' );
require_once( PWPcp_PLUGIN_DIR . 'includes/functions-sanitize.php' );
require_once( PWPcp_PLUGIN_DIR . 'includes/class-singleton.php' );
require_once( PWPcp_PLUGIN_DIR . 'includes/class-core.php' );
require_once( PWPcp_PLUGIN_DIR . 'includes/class-customize.php' );
require_once( PWPcp_PLUGIN_DIR . 'includes/class-customize-manager.php' );
require_once( PWPcp_PLUGIN_DIR . 'includes/class-theme.php' );
if ( is_admin() ) {
	require_once( PWPcp_PLUGIN_DIR . 'includes/class-admin.php' );
	require_once( PWPcp_PLUGIN_DIR . 'includes/class-admin-about.php' );
}