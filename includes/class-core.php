<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'KKcp' ) ):

	/**
	 * Core
	 *
	 * Simple core class for this plugin.
	 *
	 * @package    Customize_Plus
	 * @subpackage Core
	 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
	 * @copyright  2018 KnitKode
	 * @license    GPLv3
	 * @version    Release: 1.0.0
	 * @link       https://knitkode.com/products/customize-plus
	 */
	class KKcp {

		/**
		 * Constructor
		 *
		 * @since 1.0.0
		 */
		public function __construct() {
			// translate plugin meta
			esc_html__( 'Enhance and extend the WordPress Customizer.', 'kkcp' );

			if ( is_admin() ) {
				// Add plugin actions links
				add_filter( 'plugin_action_links_' . plugin_basename( KKCP_PLUGIN_FILE ), array( __CLASS__, 'actions_links' ), -10 );
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
			$locale = apply_filters( 'plugin_locale', get_locale(), 'kkcp' );

			// Make plugin available for translation
			load_textdomain( 'kkcp', WP_LANG_DIR . '/customize-plus/kkcp-' . $locale . '.mo' );
			load_plugin_textdomain( 'kkcp', false, dirname( plugin_basename( KKCP_PLUGIN_FILE ) ) . '/languages/' );
		}

		/**
		 * Add plugin actions links
		 *
		 * @since  1.0.0
		 * @param  array $links Links array in which we would prepend our link.
		 * @return array Processed links.
		 */
		public static function actions_links( $links ) {
			$links[] = '<a href="' . add_query_arg( array( 'page' => 'customize-plus', 'tab' => 'about' ), admin_url( 'options-general.php' ) ) . '">' . esc_html__( 'About', 'kkcp' ) . '</a>';
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

		/**
		 * Get asset file, minified or unminified
		 *
		 * @since  1.0.0
		 * @param  string $filename
		 * @param  string $type
		 * @param  string $base_url
		 * @param  string $ext
		 * @return string
		 */
		public static function get_asset( $filename, $type, $base_url, $ext = '' ) {
			if ( ! $ext ) {
				$ext = $type;
			}
			$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

			return plugins_url( "assets/$type/$filename$min.$ext", $base_url );
		}
	}

	// Instantiate
	new KKcp;

endif;
