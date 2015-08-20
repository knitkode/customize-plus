<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'PWPcp_Admin_About' ) ):
	/**
	 * Short description for class
	 *
	 * Long description (if any) ...
	 *
	 * @package    Customize_Plus
	 * @subpackage Admin
	 * @author     PlusWP <dev@pluswp.com> (http://pluswp.com)
	 * @copyright  2015 PlusWP (kunderi kuus)
	 * @license    GPL-2.0+
	 * @version    Release: pkgVersion
	 * @link       http://pluswp.com/customize-plus
	 */
	class PWPcp_Admin_About {

		/**
		 * Constructor
		 *
		 * @since 0.0.1
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
		 * @since  0.0.1
		 * @uses   PWPcp_Admin->add_subpages To add the page tab
		 */
		public function add_menu_subpage() {
			if ( class_exists( 'PWPcp_Admin' ) ) {
				PWPcp_Admin::get_instance()->add_subpages( array(
					'about' => array(
						'title' => __( 'About', 'pkgTextDomain' ),
						'view' => array( $this, 'get_view' )
					) )
				);
			}
		}

		/**
		 * Add some general styling to the admin area.
		 *
		 * @since 0.0.1
		 * @param string $hook The page hook
		 */
		public static function enqueue_scripts( $hook ) {
			$settings_page_prefix = 'settings_page_PWPcp-';
			$settings_pages = array(
				$settings_page_prefix . 'welcome',
				$settings_page_prefix . 'about',
			);
			if ( in_array( $hook, $settings_pages ) ) {
				$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
				wp_enqueue_style( 'PWPcp-admin', plugins_url( "assets/admin{$min}.css", PWPcp_PLUGIN_FILE ), array( 'dashicons' ), PWPcp_PLUGIN_VERSION );
			}
		}

		/**
		 * The view for this subpage tab.
		 *
		 * @since  0.0.1
		 */
		public function get_view() {
		?>
			//= include ../views/page-about.php
		<?php
		}
	}

	// Instantiate
	new PWPcp_Admin_About;

endif;
