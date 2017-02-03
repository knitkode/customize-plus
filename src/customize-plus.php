<?php defined( 'ABSPATH' ) or die;

/**
 * Customize Plus
 *
 * pkgDescription
 *
 * This plugin was built on top of a mix of WordPress-Plugin-Skeleton by Ian
 * Dunn (see {@link http://git.io/vZ05r here} for details) and WordPress-Plugin
 * Boilerplate (see {@link http://git.io/vZ056 here} for details).
 *
 * @package           Customize_Plus
 *
 * @wordpress-plugin
 * Plugin Name:       Customize Plus
 * Plugin URI:        httpS://pluswp.com/customize-plus
 * Description:       pkgDescription
 * Version:           pkgVersion
 * Author:            PlusWP
 * Author URI:        httpS://pluswp.com
 * License:           GPLv2 or later (license.txt)
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       pkgTextDomain
 * Domain Path:       /languages
 */

define( 'PWPCP_PLUGIN_FILE', __FILE__ );
define( 'PWPCP_PLUGIN_VERSION', '0.0.1' );
define( 'PWPCP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'PWPCP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once( PWPCP_PLUGIN_DIR . 'includes/class-requirements.php' );
require_once( PWPCP_PLUGIN_DIR . 'includes/class-utils.php' );
require_once( PWPCP_PLUGIN_DIR . 'includes/class-validate.php' );
require_once( PWPCP_PLUGIN_DIR . 'includes/class-sanitize.php' );
require_once( PWPCP_PLUGIN_DIR . 'includes/class-singleton.php' );
require_once( PWPCP_PLUGIN_DIR . 'includes/class-core.php' );
require_once( PWPCP_PLUGIN_DIR . 'includes/class-customize.php' );
require_once( PWPCP_PLUGIN_DIR . 'includes/class-theme.php' );
if ( is_admin() ) {
	require_once( PWPCP_PLUGIN_DIR . 'includes/class-admin.php' );
	require_once( PWPCP_PLUGIN_DIR . 'includes/class-admin-about.php' );
}

do_action( 'PWPcp/after_requires' );