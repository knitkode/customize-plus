<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'PWPcp' ) ):

	/**
	 * Short description for class
	 *
	 * Long description (if any) ...
	 *
	 * @package    Customize_Plus
	 * @subpackage Core
	 * @author     PlusWP <dev@pluswp.com> (https://pluswp.com)
	 * @copyright  2015 PlusWP (kunderi kuus)
	 * @license    GPL-2.0+
	 * @version    Release: pkgVersion
	 * @link       https://pluswp.com/customize-plus
	 */
	class PWPcp {

		/**
		 * Constructor
		 *
		 * @since 0.0.1
		 */
		public function __construct() {
			// translate plugin meta
			__( 'pkgDescription' );

			if ( is_admin() ) {
				// Add plugin actions links
				add_filter( 'plugin_action_links_' . plugin_basename( PWPCP_PLUGIN_FILE ), array( __CLASS__, 'actions_links' ), -10 );

				// Add plugin meta links
				add_filter( 'plugin_row_meta', array( __CLASS__, 'meta_links' ), 10, 2 );
			}

			add_action( 'plugins_loaded', array( __CLASS__, 'init' ) );
			// add_action( 'init', array( __CLASS__, 'register' ) );
			// add_action( 'init', array( __CLASS__, 'update' ), 20 );
			register_activation_hook( PWPCP_PLUGIN_FILE, array( __CLASS__, 'activation' ) );
			register_activation_hook( PWPCP_PLUGIN_FILE, array( __CLASS__, 'deactivation' ) );
		}

		/**
		 * Init
		 * {@link(http://geertdedeckere.be/article/loading-wordpress-language-files-the-right-way, link)}
		 *
		 * @since  0.0.1
		 */
		public static function init() {
			// The "plugin_locale" filter is also used in load_plugin_textdomain()
			$locale = apply_filters( 'plugin_locale', get_locale(), 'pkgTextDomain' );

			// Make plugin available for translation
			load_textdomain( 'pkgTextDomain', WP_LANG_DIR . '/customize-plus/pkgTextDomain-' . $locale . '.mo' );
			load_plugin_textdomain( 'pkgTextDomain', false, dirname( plugin_basename( PWPCP_PLUGIN_FILE ) ) . '/languages/' );
		}

		/**
		 * Add plugin actions links
		 *
		 * @since  0.0.1
		 * @param  array $links Links array in which we would prepend our link.
		 * @return array Processed links.
		 */
		public static function actions_links( $links ) {
			$links[] = '<a href="' . add_query_arg( array( 'page' => 'customize-plus', 'tab' => 'about' ), admin_url( 'options-general.php' ) ) . '">' . esc_html__( 'About' ) . '</a>';
			return $links;
		}

		/**
		 * Add plugin meta links
		 *
		 * @since  0.0.1
		 * @param  array  $links Links array in which we would prepend our link.
		 * @param  string $file  Plugin file name
		 */
		public static function meta_links( $links, $file ) {
			// Check plugin
			if ( $file === plugin_basename( PWPCP_PLUGIN_FILE ) ) {
				unset( $links[2] );
				$links[] = '<a href="http://gndev.info/shortcodes-ultimate/" target="_blank">' . __( 'Project homepage', 'su' ) . '</a>';
				$links[] = '<a href="http://wordpress.org/support/plugin/shortcodes-ultimate/" target="_blank">' . __( 'Support forum', 'su' ) . '</a>';
				$links[] = '<a href="http://wordpress.org/extend/plugins/shortcodes-ultimate/changelog/" target="_blank">' . __( 'Changelog', 'su' ) . '</a>';
			}
			return $links;
		}

		/**
		 * Activation hook
		 *
		 * @since  0.0.1
		 */
		public static function activation() {
			do_action( 'PWPcp/activation' );
		}

		/**
		 * Deactivation hook
		 *
		 * @since  0.0.1
		 */
		public static function deactivation() {
			do_action( 'PWPcp/deactivation' );
		}
	}

	// Instantiate
	new PWPcp;

endif;
