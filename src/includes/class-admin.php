<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'PWPcp_Admin' ) && class_exists( 'PWPcp_Singleton' ) ):
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
	class PWPcp_Admin extends PWPcp_Singleton {

		const MENU_PAGE = 'options-general.php';
		const PARENT_HOOK = 'customize-plus';

		private $subpages = array();

		private $default_tab = 'about';

		/**
		 * Constructor
		 *
		 * @since 0.0.1
		 */
		protected function __construct() {

			// Add menu item to settings menu
			add_action( 'admin_menu', array( $this, 'menu' ), 15 );

			// Remove subpages from side menu
			add_action( 'admin_head', array( $this, 'hide_subpages' ), 999 );

			// Enqueue all admin JS and CSS
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		}

		/**
		 * Public method to add subpages to Customize Plus
		 *
		 * @param  array $subpages An array of subpages array, each one needs a `title`
		 *                        and a `view` callable function.
		 * @since  0.0.1
		 * @return void
		 */
		final public function add_subpages( $subpages ) {
			if ( is_array( $subpages ) ) {
				foreach ( $subpages as $id => $subpage ) {
					if ( is_array( $subpage ) ) {
						$this->subpages[ sanitize_key( $id ) ] = $subpage;
					}
				}
			}
		}

		/**
		 * Set default tab, the one visible when no query param is added to the url
		 *
		 * @param  string $subpage_id  The subpage / tab id to set as default.
		 * @since  0.0.1
		 * @return void
		 */
		final public function set_default_tab( $subpage_id ) {
			$this->default_tab = sanitize_key( $subpage_id );
		}

		/**
		 * Add the navigational menu elements.
		 *
		 * @since  0.0.1
		 * @uses   add_submenu_page() To add the the page submenu
		 * @return void
		 */
		public function menu() {

			// Bail if user cannot moderate
			if ( ! current_user_can( 'manage_options' ) ) {
				return;
			}

			add_submenu_page(
				self::MENU_PAGE,
				__( 'Customize Plus', 'pkgTextDomain' ),
				__( 'Customize Plus', 'pkgTextDomain' ),
				'manage_options',
				self::PARENT_HOOK,
				array( $this, 'get_view' )
			);

			$hooks = array();

			foreach ( $this->subpages as $subpage_id => $subpage_args ) {
				$hooks[] = add_submenu_page(
					self::MENU_PAGE,
					$subpage_args['title'],
					__( 'Customize Plus', 'pkgTextDomain' ),
					'manage_options',
					self::PARENT_HOOK . 'tab=' . sanitize_key( $subpage_id ),
					'__return_null'
				);
			}
		}

		/**
		 * Hide subpages from side menu removing them
		 *
		 * @since BuddyPress (1.6.0)
		 */
		public function hide_subpages() {
			foreach ( $this->subpages as $subpage_id => $subpage_args ) {
				remove_submenu_page( self::MENU_PAGE, self::PARENT_HOOK . 'tab=' . $subpage_id );
			}
		}

		/**
		 * Add some general styling to the admin area.
		 *
		 * @since BuddyPress (1.6.0)
		 */
		public function enqueue_scripts( $hook ) {
			$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

			if ( 'settings_page_' . self::PARENT_HOOK === $hook ) {
				wp_enqueue_style( 'k6cp-admin', plugins_url( "assets/admin{$min}.css", PWPcp_PLUGIN_FILE ), array( 'dashicons' ), PWPcp_PLUGIN_VERSION );
				// wp_style_add_data( 'k6cp-admin', 'rtl', true );
				if ( $min ) {
					wp_style_add_data( 'k6cp-admin', 'suffix', $min );
				}
			}
		}

		/**
		 * The view that wrap each subpage tab.
		 *
		 * @since  0.0.1
		 * @return void
		 */
		public function get_view() {
		?>
			//= include ../views/page-admin.php
		<?php
		}
	}

	// Instantiate
	PWPcp_Admin::get_instance();

endif;
