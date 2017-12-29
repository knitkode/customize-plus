<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'KKcp' ) ):

	/**
	 * Short description for class
	 *
	 * Long description (if any) ...
	 *
	 * @package    Customize_Plus
	 * @subpackage Core
	 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
	 * @copyright  2017 KnitKode
	 * @license    GPL-2.0+
	 * @version    Release: pkgVersion
	 * @link       https://knitkode.com/customize-plus
	 */
	class KKcp {

		/**
		 * Constructor
		 *
		 * @since 1.0.0
		 */
		public function __construct() {
			// translate plugin meta
			esc_html__( 'pkgDescription' );

			if ( is_admin() ) {
				// Add plugin actions links
				add_filter( 'plugin_action_links_' . plugin_basename( KKCP_PLUGIN_FILE ), array( __CLASS__, 'actions_links' ), -10 );

				// Add plugin meta links
				add_filter( 'plugin_row_meta', array( __CLASS__, 'meta_links' ), 10, 2 );
			}

			add_action( 'plugins_loaded', array( __CLASS__, 'init' ) );
			// add_action( 'init', array( __CLASS__, 'register' ) );
			// add_action( 'init', array( __CLASS__, 'update' ), 20 );
			register_activation_hook( KKCP_PLUGIN_FILE, array( __CLASS__, 'activation' ) );
			register_activation_hook( KKCP_PLUGIN_FILE, array( __CLASS__, 'deactivation' ) );
		}

		/**
		 * Init
		 * {@link(http://geertdedeckere.be/article/loading-wordpress-language-files-the-right-way, link)}
		 *
		 * @since  1.0.0
		 */
		public static function init() {
			// The "plugin_locale" filter is also used in load_plugin_textdomain()
			$locale = apply_filters( 'plugin_locale', get_locale(), 'pkgTextDomain' );

			// Make plugin available for translation
			load_textdomain( 'pkgTextDomain', WP_LANG_DIR . '/customize-plus/pkgTextDomain-' . $locale . '.mo' );
			load_plugin_textdomain( 'pkgTextDomain', false, dirname( plugin_basename( KKCP_PLUGIN_FILE ) ) . '/languages/' );
		}

		/**
		 * Add plugin actions links
		 *
		 * @since  1.0.0
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
		 * @since  1.0.0
		 * @param  array  $links Links array in which we would prepend our link.
		 * @param  string $file  Plugin file name
		 */
		public static function meta_links( $links, $file ) {
			// Check plugin
			if ( $file === plugin_basename( KKCP_PLUGIN_FILE ) ) {
				unset( $links[2] );
				$links[] = '<a href="https://knitkode.com/products/customize-plus" target="_blank">' . esc_html__( 'Project homepage' ) . '</a>';
				$links[] = '<a href="https://knitkode.com/support" target="_blank">' . esc_html__( 'Support' ) . '</a>';
				$links[] = '<a href="http://wordpress.org/extend/plugins/customize-plus/changelog/" target="_blank">' . esc_html__( 'Changelog' ) . '</a>';
			}
			return $links;
		}

		/**
		 * Activation hook
		 *
		 * @since  1.0.0
		 */
		public static function activation() {
			do_action( 'kkcp_activation' );
		}

		/**
		 * Deactivation hook
		 *
		 * @since  1.0.0
		 */
		public static function deactivation() {
			do_action( 'kkcp_deactivation' );
		}
	}

	// Instantiate
	new KKcp;

endif;
