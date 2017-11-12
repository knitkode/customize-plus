<?php defined( 'ABSPATH' ) or die;

if ( class_exists( 'KKcp_Singleton' ) ):
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
	class KKcp_Admin extends KKcp_Singleton {

		/**
		 * The menu page
		 * @since  0.0.1
		 */
		const MENU_PAGE = 'options-general.php';

		/**
		 * Parent hook
		 * @since  0.0.1
		 */
		const PARENT_HOOK = 'customize-plus';

		/**
		 * The options subpages array
		 * @since  0.0.1
		 * @var array
		 */
		private $subpages = array();

		/**
		 * The options page default tab
		 * @since  0.0.1
		 * @var string
		 */
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
		 *                         and a `view` callable function.
		 * @since  0.0.1
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
		 */
		final public function set_default_tab( $subpage_id ) {
			$this->default_tab = sanitize_key( $subpage_id );
		}

		/**
		 * Add the navigational menu elements.
		 *
		 * @since  0.0.1
		 * @uses   add_submenu_page() To add the the page submenu
		 */
		public function menu() {

			// Bail if user cannot moderate
			if ( ! current_user_can( 'manage_options' ) ) {
				return;
			}

			add_submenu_page(
				self::MENU_PAGE,
				__( 'Customize Plus' ),
				__( 'Customize Plus' ),
				'manage_options',
				self::PARENT_HOOK,
				array( $this, 'get_view' )
			);

			$hooks = array();

			foreach ( $this->subpages as $subpage_id => $subpage_args ) {
				$hooks[] = add_submenu_page(
					self::MENU_PAGE,
					$subpage_args['title'],
					__( 'Customize Plus' ),
					'manage_options',
					self::PARENT_HOOK . 'tab=' . sanitize_key( $subpage_id ),
					'__return_null'
				);
			}
		}

		/**
		 * Hide subpages from side menu removing them
		 *
		 * @since 0.0.1
		 */
		public function hide_subpages() {
			foreach ( $this->subpages as $subpage_id => $subpage_args ) {
				remove_submenu_page( self::MENU_PAGE, self::PARENT_HOOK . 'tab=' . $subpage_id );
			}
		}

		/**
		 * Add some general styling to the admin area.
		 *
		 * @since 0.0.1
		 * @param string $hook The page hook
		 */
		public function enqueue_scripts( $hook ) {
			if ( 'settings_page_' . self::PARENT_HOOK === $hook ) {
				wp_enqueue_style( 'KKcp-admin', KKcp_Utils::get_asset( 'admin', 'css', KKCP_PLUGIN_FILE ), array( 'dashicons' ), KKCP_PLUGIN_VERSION );
				// wp_style_add_data( 'KKcp-admin', 'rtl', true );
			}
		}

		/**
		 * The view that wrap each subpage tab.
		 *
		 * @since  0.0.1
		 */
		public function get_view() {
		?>
			//=include ../views/page-admin.php
		<?php
		}
	}

	// Instantiate
	KKcp_Admin::get_instance();

endif;
