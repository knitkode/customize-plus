<?php defined( 'ABSPATH' ) or die;

/**
 * Customize Plus
 *
 * Enhance and extend the WordPress Customizer.
 *
 * @package           Customize_Plus
 *
 * @wordpress-plugin
 * Plugin Name:       Customize Plus
 * Plugin URI:        https://knitkode.com/products/customize-plus
 * Description:       Enhance and extend the WordPress Customizer.
 * Version:           1.0.0
 * Author:            KnitKode
 * Author URI:        https://knitkode.com
 * License:           GPLv3
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       kkcp
 * Domain Path:       /languages
 */

define( 'KKCP_PLUGIN_FILE', __FILE__ );
define( 'KKCP_PLUGIN_VERSION', '1.0.0' );
define( 'KKCP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'KKCP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once( KKCP_PLUGIN_DIR . 'includes/class-requirements.php' );
require_once( KKCP_PLUGIN_DIR . 'includes/class-data.php' );
require_once( KKCP_PLUGIN_DIR . 'includes/class-helper.php' );
require_once( KKCP_PLUGIN_DIR . 'includes/class-singleton.php' );
require_once( KKCP_PLUGIN_DIR . 'includes/class-core.php' );
require_once( KKCP_PLUGIN_DIR . 'includes/class-sanitizejs.php' );
require_once( KKCP_PLUGIN_DIR . 'includes/class-customize.php' );
require_once( KKCP_PLUGIN_DIR . 'includes/class-theme.php' );
if ( is_admin() ) {
	require_once( KKCP_PLUGIN_DIR . 'includes/class-validate.php' );
	require_once( KKCP_PLUGIN_DIR . 'includes/class-sanitize.php' );
	require_once( KKCP_PLUGIN_DIR . 'includes/class-admin.php' );
	require_once( KKCP_PLUGIN_DIR . 'includes/class-admin-about.php' );
}

do_action( 'kkcp_after_requires' );