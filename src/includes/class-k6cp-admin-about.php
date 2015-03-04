<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'K6CP_Admin_About' ) ):
	/**
	 * Short description for class
	 *
	 * Long description (if any) ...
	 *
	 * @category  CategoryName
	 * @package   K6
	 * @author    Author's name <author@mail.com>
	 * @copyright 2015 Author's name
	 * @license   http://www.opensource.org/licenses/bsd-license.php The BSD License
	 * @version   Release: @package_version@
	 * @link      http://pear.php.net/package/K6
	 * @see       References to other sections (if any)...
	 */
	class K6CP_Admin_About {

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
		 * @uses   K6CP_Admin->add_subpages To add the page tab
		 * @return void
		 */
		public function add_menu_subpage() {
			if ( class_exists( 'K6CP_Admin' ) ) {
				K6CP_Admin::get_instance()->add_subpages( array(
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
		 * @since BuddyPress (1.6.0)
		 */
		public static function enqueue_scripts( $hook ) {
			$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			$settings_page_prefix = 'settings_page_k6cp-';
			$settings_pages = array(
				$settings_page_prefix . 'welcome',
				$settings_page_prefix . 'about',
			);
			if ( in_array( $hook, $settings_pages ) ) {
				wp_enqueue_style( 'k6cp-admin', plugins_url( "assets/admin{$min}.css", K6CP_PLUGIN_FILE ), array( 'dashicons' ), K6CP_PLUGIN_VERSION );
				// wp_style_add_data( 'k6cp-admin', 'rtl', true );
				if ( $min ) {
					wp_style_add_data( 'k6cp-admin', 'suffix', $min );
				}
			}
		}

		/**
		 * The view for this subpage tab.
		 *
		 * @since  0.0.1
		 * @return void
		 */
		public function get_view() {
		?>
			//= include ../views/page-about.php
		<?php
		}
	}

	// Instantiate
	new K6CP_Admin_About;

endif;
