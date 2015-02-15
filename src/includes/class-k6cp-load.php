<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'K6CP' ) ):

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
	class K6CP {

		/**
		 * Description for const
		 */
		const VERSION = 'pkgVersion';

		/**
		 * Description for const
		 */
		const SHORTNAME = 'pkgNameShort'; // namespace used for options related to style

		/**
		 * Description for public
		 * @var unknown
		 */
		public static $_ASSETS;

		/**
		 * Description for public
		 * @var unknown
		 */
		public static $_IMAGES;

		/**
		 * Description for public
		 * @var unknown
		 */
		public static $_LANGUAGES;

		/**
		 * Singleton
		 *
		 * @since 0.0.1
		 */
		public static function get_instance() {
			static $instances = array();
			$called_class_name = self::get_called_class();
			if ( ! isset( $instances[ $called_class_name ] ) ) {
				$instances[ $called_class_name ] = new $called_class_name();
			}
			return $instances[ $called_class_name ];
		}

		/**
		 * PHP 5.2 version support
		 * See: http://stackoverflow.com/questions/7902586/extend-a-singleton-with-php-5-2-x
		 *
		 * @since 0.0.1
		 */
		private static function get_called_class() {
			$bt = debug_backtrace();
			$lines = file( $bt[1]['file'] );
			preg_match(
				'/([a-zA-Z0-9\_]+)::'.$bt[1]['function'].'/',
				$lines[ $bt[1]['line'] -1 ],
				$matches
			);
			return $matches[1];
		}

		/**
		 * Constructor
		 *
		 * @since 0.0.1
		 */
		public function __construct() {

			// set theme constants
			self::set_constants();

			// $this->version = '2.2';
			// $this->load_deprecated = ! apply_filters( 'bp_ignore_deprecated', BP_IGNORE_DEPRECATED );
			// $this->filters = new stdClass(); // Used when adding/removing filters
			// $this->file = K6CP_PLUGIN_DIR . 'customize-plus.php';
			// $this->basename = basename( K6CP_PLUGIN_DIR ) . '/customize-plus.php';
			// $this->plugin_dir = trailingslashit( K6CP_PLUGIN_DIR );
			// $this->plugin_url = trailingslashit( K6CP_PLUGIN_URL );
			// $this->lang_dir = $this->plugin_dir . 'languages';

			// initial setup
			if ( is_admin() ) {
				require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-admin.php' );
			}
			require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-customize.php' );

			add_action( 'plugins_loaded', array( __CLASS__, 'init' ) );
			// add_action( 'init', array( __CLASS__, 'register' ) );
			// add_action( 'init', array( __CLASS__, 'update' ), 20 );
			register_activation_hook( K6CP_PLUGIN_FILE, array( __CLASS__, 'activation' ) );
			register_activation_hook( K6CP_PLUGIN_FILE, array( __CLASS__, 'deactivation' ) );
		}

		public static function init() {
			// Make plugin available for translation
			load_plugin_textdomain( 'pkgTextDomain', false, dirname( plugin_basename( K6CP_PLUGIN_FILE ) ) . '/languages/' );
		}

		public static function activation() {
			do_action( 'k6cp/activation' );
		}

		public static function deactivation() {
			do_action( 'k6cp/deactivation' );
		}

		/**
		 * Set constants
		 *
		 * Long description (if any) ...
		 *
		 * @since  0.0.1
		 */
		private static function set_constants() {
			self::$_ASSETS = plugin_dir_url( __FILE__ ) . '/assets/';
			self::$_IMAGES = plugin_dir_url( __FILE__ ) . 'assets/images/';
			self::$_LANGUAGES = plugin_dir_url( __FILE__ ) .'/languages/';
			// use this instead
			// plugins_url( 'assets/js/chart.js', SU_PLUGIN_FILE )
		}

		/**
		 * Get option
		 *
		 * @param [type]  $opt_name [description]
		 * @return [type]           [description]
		 */
		public static function get_option( $opt_name ) {
			if ( isset( get_option( K6CP_Customize::$OPTIONS_PREFIX )[ $opt_name ] ) ) {
				return get_option( K6CP_Customize::$OPTIONS_PREFIX )[ $opt_name ];
			} else {
				return K6CP_Customize::$DEFAULTS[ $opt_name ];
			}
		}

		// k6todo \\
		// public static function add_asset( ) {

		// 	$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
		// 	$settings_page_prefix = 'settings_page_k6cp-';
		// 	$settings_pages = array(
		// 		$settings_page_prefix . 'welcome',
		// 		$settings_page_prefix . 'about',
		// 		$settings_page_prefix . 'settings',
		// 		$settings_page_prefix . 'addons',
		// 	);
		// 	if ( in_array( $hook, $settings_pages  ) ) {
		// 		wp_enqueue_style( 'k6cp-admin-css', plugins_url( "assets/admin{$min}.css", K6CP_PLUGIN_FILE ), array( 'dashicons'), K6CP_PLUGIN_VERSION );
		// 		// wp_style_add_data( 'k6cp-admin-css', 'rtl', true );
		// 		if ( $min ) {
		// 			wp_style_add_data( 'k6cp-admin-css', 'suffix', $min );
		// 		}
	 //    }
		// }

		/**
		 * A simple logger
		 *
		 * @param  [type] $var  [description]
		 * @param  [type] $text [description]
		 * @return [type]       [description]
		 */
		public static function log( $var, $text ) {
			echo '<h1>Logging: ' . esc_html( $text ) . '</h1>';
			echo '<pre>';
			var_dump( $var );
			echo '</pre>';
		}
	}

	// Instantiate
	K6CP::get_instance();

endif; // End if class_exists check
