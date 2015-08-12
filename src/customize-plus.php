<?php defined( 'ABSPATH' ) or die;

/**
 * Customize Plus
 *
 * pkgDescription
 *
 * This plugin was built on top of a mix of WordPress-Plugin-Skeleton by Ian Dunn
 * (see {@link https://github.com/iandunn/WordPress-Plugin-Skeleton here} for details)
 * and WordPress-Plugin-Boilerplate (see {@link
 * https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate/ here} for details).
 *
 * @package           Customize_Plus
 *
 * @wordpress-plugin
 * Plugin Name:       Customize Plus
 * Plugin URI:        http://pluswp.com/customize-plus
 * Description:       pkgDescription
 * Version:           pkgVersion
 * Author:            PlusWP
 * Author URI:        http://pluswp.com
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
require_once( PWPcp_PLUGIN_DIR . 'includes/class-sanitize.php' );
require_once( PWPcp_PLUGIN_DIR . 'includes/class-singleton.php' );
require_once( PWPcp_PLUGIN_DIR . 'includes/class-core.php' );
require_once( PWPcp_PLUGIN_DIR . 'includes/class-customize.php' );
require_once( PWPcp_PLUGIN_DIR . 'includes/class-theme.php' );
if ( is_admin() ) {
	require_once( PWPcp_PLUGIN_DIR . 'includes/class-admin.php' );
	require_once( PWPcp_PLUGIN_DIR . 'includes/class-admin-about.php' );
}


/**
 * Load editor through ajax call
 * // @@temp, this function is more an util than a sanitize function \\
 * @see  http://wordpress.stackexchange.com/a/130425/25398
 */
if ( ! function_exists( 'pwpcp_load_wp_editor' ) ) :
  function pwpcp_load_wp_editor() {
    $id = isset( $_POST['id'] ) ? sanitize_key( $_POST['id'] ) : 'pwpcp_tinymce_dummy';
    $load = isset( $_POST['load'] ) ? true : false;
    wp_editor( '', $id, array(
      'teeny' => true,
      'media_buttons' => false,
      'quicktags' => false,
      'textarea_rows' => 4,
      'tinymce' => array(
        'menubar' => false,
      )
    ) );
    if ( $load ) {
      _WP_Editors::enqueue_scripts();
      print_footer_scripts();
      _WP_Editors::editor_js();
    }
    die();
  }
  add_action( 'wp_ajax_pwpcp_load_wp_editor', 'pwpcp_load_wp_editor' );
endif;


// @@temp, this function is more an util than a sanitize function \\
if ( ! function_exists( 'pwpcp_compress_html' ) ) :
  /**
   * [pwpcp_compress_html description]
   * @param  [type] $buffer [description]
   * @return [type]         [description]
   */
  function pwpcp_compress_html( $buffer ) {
    return preg_replace( '/\s+/', ' ', str_replace( array( "\n", "\r", "\t" ), '', $buffer ) );
  }
endif;
