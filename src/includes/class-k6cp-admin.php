<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'K6CP_Admin' ) ):
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
	class K6CP_Admin {

		/**
		 * Constructor
		 *
		 * @since 0.0.1
		 */
		public function __construct() {
			// Translate plugin meta
			__( 'pkgNamePretty', 'pkgTextDomain' );
			__( 'pkgAuthorName', 'pkgTextDomain' );
			__( 'pkgDescription', 'pkgTextDomain' );

			// Add plugin actions links
			add_filter( 'plugin_action_links_' . plugin_basename( K6CP_PLUGIN_FILE ), array( __CLASS__, 'actions_links' ), -10 );

			// Add plugin meta links
			add_filter( 'plugin_row_meta', array( __CLASS__, 'meta_links' ), 10, 2 );

			// Add contextual help
			add_action( 'contextual_help', array( __CLASS__, 'contextual_help' ) );

			// Add some page specific output to the <head>
			add_action( 'admin_head', array( __CLASS__, 'head' ), 999 );

			// Add menu item to settings menu
			add_action( 'admin_menu', array( $this, 'menu' ), 15 );

			// Enqueue all admin JS and CSS
			add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_scripts' ) );

			// Customize Plus Admin is ready
			do_action( 'k6cp/admin/init' );
		}

		/**
		 * Add the navigational menu elements.
		 *
		 * @since BuddyPress (1.6)
		 *
		 * @uses add_management_page() To add the Recount page in Tools section.
		 * @uses add_options_page() To add the Forums settings page in Settings
		 *       section.
		 */
		public function menu() {

			// Bail if user cannot moderate
			if ( ! current_user_can( 'manage_options' ) ) {
				return;
			}

			$hooks = array();

			$hooks[] = add_submenu_page(
				'options-general.php',
				__( 'Welcome to Customize Plus',  'pkgTextDomain' ),
				__( 'Welcome to Customize Plus',  'pkgTextDomain' ),
				'manage_options',
				'k6cp-welcome',
				array( $this, 'get_view_welcome' )
			);

			$hooks[] = add_submenu_page(
				'options-general.php',
				__( 'Customize Plus About', 'pkgTextDomain' ),
				__( 'Customize Plus About', 'pkgTextDomain' ),
				'manage_options',
				'k6cp-about',
				array( $this, 'get_view_about' )
			);

			$hooks[] = add_submenu_page(
				'options-general.php',
				__( 'Customize Plus Settings', 'pkgTextDomain' ),
				__( 'Customize Plus', 'pkgTextDomain' ),
				'manage_options',
				'k6cp-settings',
				array( $this, 'get_view_settings' )
			);

			$hooks[] = add_submenu_page(
				'options-general.php',
				__( 'Customize Plus Components', 'pkgTextDomain' ),
				__( 'Customize Plus Components', 'pkgTextDomain' ),
				'manage_options',
				'k6cp-components',
				array( $this, 'get_view_components' )
			);

			// Fudge the highlighted subnav item when on a Customize Plus admin page
			foreach ( $hooks as $hook ) {
				add_action( 'admin_head-' . $hook, array( __CLASS__, 'modify_menu_highlight' ) );
			}
		}

		/**
		 * This tells WP to highlight the Settings > BuddyPress menu item,
		 * regardless of which actual BuddyPress admin screen we are on.
		 *
		 * The conditional prevents the behaviour when the user is viewing the
		 * backpat "Help" page, the Activity page, or any third-party plugins.
		 *
		 * @global string $plugin_page
		 * @global array $submenu
		 * @since BuddyPress (1.6)
		 */
		public static function modify_menu_highlight() {
			global $plugin_page, $submenu_file;

			// This tweaks the Settings subnav menu to highlight the only visible menu item
			if ( in_array( $plugin_page, array( 'k6cp-welcome', 'k6cp-about', 'k6cp-settings', 'k6cp-components' ) ) ) {
				$submenu_file = 'k6cp-settings';
			}
		}

		/**
		 * Add plugin actions links
		 * @param array $links Links array in which we would prepend our link.
		 * @return array Processed links.
		 */
		public static function actions_links( $links ) {
			$links[] = '<a href="' . add_query_arg( array( 'page' => 'k6cp-settings' ), admin_url( 'options-general.php' ) ) . '">' . esc_html__( 'Settings', 'pkgTextDomain' ) . '</a>';
			$links[] = '<a href="' . add_query_arg( array( 'page' => 'k6cp-about' ), admin_url( 'index.php' ) ) . '">' . esc_html__( 'About', 'pkgTextDomain' ) . '</a>';
			return $links;
		}

		/**
		 * Add plugin meta links
		 * @param array $links Links array in which we would prepend our link.
		 */
		public static function meta_links( $links, $file ) {
			// Check plugin
			if ( $file === plugin_basename( K6CP_PLUGIN_FILE ) ) {
				unset( $links[2] );
				$links[] = '<a href="http://gndev.info/shortcodes-ultimate/" target="_blank">' . __( 'Project homepage', 'su' ) . '</a>';
				$links[] = '<a href="http://wordpress.org/support/plugin/shortcodes-ultimate/" target="_blank">' . __( 'Support forum', 'su' ) . '</a>';
				$links[] = '<a href="http://wordpress.org/extend/plugins/shortcodes-ultimate/changelog/" target="_blank">' . __( 'Changelog', 'su' ) . '</a>';
			}
			return $links;
		}

		/**
		 * Add some general styling to the admin area.
		 *
		 * @since BuddyPress (1.6.0)
		 */
		public static function head() {
			remove_submenu_page( 'options-general.php', 'k6cp-welcome' );
			remove_submenu_page( 'options-general.php', 'k6cp-about' );
			remove_submenu_page( 'options-general.php', 'k6cp-components' );
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
				$settings_page_prefix . 'settings',
				$settings_page_prefix . 'components',
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
		 * Get the data for the tabs in the admin area.
		 *
		 * @since BuddyPress (2.2.0)
		 */
		public static function get_tabs() {
			$tabs = array(
				'0' => array(
					'href' => admin_url( add_query_arg( array( 'page' => 'k6cp-about' ), 'admin.php' ) ),
					'name' => __( 'About', 'pkgTextDomain' )
				),
				'1' => array(
					'href' => admin_url( add_query_arg( array( 'page' => 'k6cp-settings' ), 'admin.php' ) ),
					'name' => __( 'Settings', 'pkgTextDomain' )
				),
				'2' => array(
					'href' => admin_url( add_query_arg( array( 'page' => 'k6cp-components' ), 'admin.php' ) ),
					'name' => __( 'Components', 'pkgTextDomain' )
				),
			);

			/**
			 * Filters the tab data used in our wp-admin screens.
			 *
			 * @param array $tabs Tab data.
			 * @since BuddyPress (2.2.0)
			 */
			return apply_filters( 'k6cp/admin/get_tabs', $tabs );
		}

		/**
		 * Output the tabs in the admin area
		 *
		 * @since BuddyPress (1.5)
		 * @param string $active_tab Name of the tab that is active. Optional.
		 */
		public static function get_tabs_view( $active_tab = '' ) {
			$tabs_html = '';
			$idle_class = 'nav-tab';
			$active_class = 'nav-tab nav-tab-active';
			$tabs = self::get_tabs();

			if ( ! is_array( $tabs ) ) {
				return;
			}
			// Loop through tabs and build navigation
			foreach ( array_values( $tabs ) as $tab_data ) {
				$is_current = (bool) ( $tab_data['name'] == $active_tab );
				$tab_class = $is_current ? $active_class : $idle_class;
				$tabs_html .= '<a href="' . esc_url( $tab_data['href'] ) . '" class="' . esc_attr( $tab_class ) . '">' . esc_html( $tab_data['name'] ) . '</a>';
			}

			echo $tabs_html;
			do_action( 'k6cp/admin/get_tabs_view' );
		}

		public function get_view_welcome() {
		?>
			//= include ../views/page-welcome.php
		<?php
		}

		public function get_view_about() {
		?>
			//= include ../views/page-about.php
		<?php
		}

		public function get_view_settings() {
		?>
			//= include ../views/page-settings.php
		<?php
		}

		public function get_view_components() {
		?>
			//= include ../views/page-components.php
		<?php
		}

		/**
		 * Return true/false based on whether a query argument is set
		 *
		 * @see bp_do_activation_redirect()
		 *
		 * @since BuddyPress (2.2.0)
		 * @return bool
		 */
		public static function is_new_install() {
			return (bool) isset( $_GET['is_new_install'] );
		}

		/**
		 * Return a user-friendly version-number string, for use in translations
		 *
		 * @since BuddyPress (2.2.0)
		 * @return string
		 */
		public static function display_version() {

			// Use static variable to prevent recalculations
			static $display = '';

			// Only calculate on first run
			if ( '' === $display ) {

				// Get current version
				$version = K6CP_PLUGIN_VERSION;

				// Check for prerelease hyphen
				$pre = strpos( $version, '-' );

				// Strip prerelease suffix
				$display = ( false !== $pre ) ? substr( $version, 0, $pre ) : $version;
			}

			// Done!
			return $display;
		}

		/**
		 * adds contextual help to BuddyPress admin pages
		 *
		 * @since BuddyPress (1.7)
		 * @todo Make this part of the BP_Component class and split into each component
		 */
		public static function contextual_help( $screen = '' ) {

			$screen = get_current_screen();

			switch ( $screen->id ) {

				// Settings page
				case 'settings_page_k6cp-settings' :

					// Settings tabs
					$screen->add_help_tab( array(
						'id' => 'k6cp-settings-overview',
						'title' => __( 'Overview', 'pkgTextDomain' ),
						'content' => '<p>' . __( 'Extra configuration settings are provided and activated. You can selectively enable or disable any setting by using the form on this screen.', 'buddypress' ) . '</p>',
					) );

					// Help panel - sidebar links
					$screen->set_help_sidebar(
						'<p><strong>' . __( 'For more information:', 'buddypress' ) . '</strong></p>' .
						'<p>' . __( '<a href="http://codex.buddypress.org/getting-started/configure-buddypress-components/#settings-buddypress-pages">Managing Pages</a>', 'buddypress' ) . '</p>' .
						'<p>' . __( '<a href="http://buddypress.org/support/">Support Forums</a>', 'buddypress' ) . '</p>'
					);
					break;

				// Addons page
				case 'settings_page_k6cp-components' :

					// Components tabs
					$screen->add_help_tab( array(
						'id'      => 'k6cp-components-overview',
						'title'   => __( 'Overview', 'buddypress' ),
						'content' => '<p>' . __( 'By default, all but four of the BuddyPress components are enabled. You can selectively enable or disable any of the components by using the form below. Your BuddyPress installation will continue to function. However, the features of the disabled components will no longer be accessible to anyone using the site.', 'buddypress' ) . '</p>',
					) );

					// help panel - sidebar links
					$screen->set_help_sidebar(
						'<p><strong>' . __( 'For more information:', 'buddypress' ) . '</strong></p>' .
						'<p>' . __( '<a href="http://codex.buddypress.org/getting-started/configure-buddypress-components/#settings-buddypress-components">Managing Components</a>', 'buddypress' ) . '</p>' .
						'<p>' . __( '<a href="http://buddypress.org/support/">Support Forums</a>', 'buddypress' ) . '</p>'
					);
					break;
			}
		}
	}

	// Instantiate
	new K6CP_Admin;

endif;
