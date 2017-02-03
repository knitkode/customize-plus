<?php defined( 'ABSPATH' ) or die;

/**
 * Utils functions
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     PlusWP <dev@pluswp.com> (httpS://pluswp.com)
 * @copyright  2015 PlusWP (kunderi kuus)
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       httpS://pluswp.com/customize-plus
 */
class PWPcp_Utils {

	/**
	 * Load editor through ajax call
	 * @see  http://wordpress.stackexchange.com/a/130425/25398
	 * @since  0.0.1
	 */
	public static function load_wp_editor() {
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

	/**
	 * Compress HTML
	 * @param  string $buffer The php->HTML buffer
	 * @return string         The compressed HTML (stripped whitespaces)
	 * @since  0.0.1
	 */
	public static function compress_html( $buffer ) {
		return preg_replace( '/\s+/', ' ', str_replace( array( "\n", "\r", "\t" ), '', $buffer ) );
	}
}

// add ajax action
add_action( 'wp_ajax_PWPcp/utils/load_wp_editor', 'PWPcp_Utils::load_wp_editor' );