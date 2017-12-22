<?php defined( 'ABSPATH' ) or die;

/**
 * Short description for class
 *
 * Long description (if any) ...
 *
 * @package    Customize_Plus
 * @subpackage Admin
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Admin_About {

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {

		// Add menu item to settings menu
		add_action( '_admin_menu', array( $this, 'add_menu_subpage' ) );

		// Enqueue all admin JS and CSS
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_scripts' ) );
	}

	/**
	 * Add subpage tab to our plugin submenu page
	 *
	 * @since  1.0.0
	 * @uses   KKcp_Admin->add_subpages To add the page tab
	 */
	public function add_menu_subpage() {
		if ( class_exists( 'KKcp_Admin' ) ) {
			KKcp_Admin::get_instance()->add_subpages( array(
				'about' => array(
					'title' => esc_html__( 'About' ),
					'view' => array( $this, 'get_view' )
				) )
			);
		}
	}

	/**
	 * Add some general styling to the admin area.
	 *
	 * @since 1.0.0
	 * @param string $hook The page hook
	 */
	public static function enqueue_scripts( $hook ) {
		$settings_page_prefix = 'settings_page_KKcp-';
		$settings_pages = array(
			$settings_page_prefix . 'welcome',
			$settings_page_prefix . 'about',
		);
		if ( in_array( $hook, $settings_pages ) ) {
			wp_enqueue_style( 'KKcp-admin', KKcp_Utils::get_asset( 'admin', 'css', KKCP_PLUGIN_FILE ), array( 'dashicons' ), KKCP_PLUGIN_VERSION );
		}
	}

	/**
	 * The view for this subpage tab.
	 *
	 * @since  1.0.0
	 */
	public function get_view() {
	?>
		//=include ../views/page-about.php
	<?php
	}
}

// Instantiate
new KKcp_Admin_About;
