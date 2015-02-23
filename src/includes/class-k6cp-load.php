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
		 * Namespace used for options stored in the database
		 */
		const PREFIX = 'k6cp-customize_plus';

		/**
		 * Plugin settings with default values
		 *
		 * @var array
		 */
		private static $settings = array(
			'framework' => 'bootstrap',
			'compiler' => true,
			// 'live-compiling' => true,
			'bootstrap-version' => '3.3.0',
			'preprocessor' => 'less',
		);

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
			if ( is_admin() ) {
				require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-admin.php' );
			}
			require_once( K6CP_PLUGIN_DIR . 'includes/k6cp-functions-sanitize.php' );
			require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-utils.php' );
			require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-customize-manager.php' );
			require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-customize.php' );
			require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-theme.php' );

			add_action( 'plugins_loaded', array( __CLASS__, 'init' ) );
			// add_action( 'init', array( __CLASS__, 'register' ) );
			// add_action( 'init', array( __CLASS__, 'update' ), 20 );
			register_activation_hook( K6CP_PLUGIN_FILE, array( __CLASS__, 'activation' ) );
			register_activation_hook( K6CP_PLUGIN_FILE, array( __CLASS__, 'deactivation' ) );
		}

		/**
		 * [init description]
		 * @link(http://geertdedeckere.be/article/loading-wordpress-language-files-the-right-way, link)
		 * @return [type] [description]
		 */
		public static function init() {
			// The "plugin_locale" filter is also used in load_plugin_textdomain()
			$locale = apply_filters( 'plugin_locale', get_locale(), 'pkgTextDomain' );

			// Make plugin available for translation
			load_textdomain( 'pkgTextDomain',  WP_LANG_DIR . '/customize-plus/pkgTextDomain-' . $locale . '.mo' );
			load_plugin_textdomain( 'pkgTextDomain', false, dirname( plugin_basename( K6CP_PLUGIN_FILE ) ) . '/languages/' );
		}

		/**
		 * [activation description]
		 * @return [type] [description]
		 */
		public static function activation() {
			do_action( 'k6cp/activation' );
		}

		/**
		 * [deactivation description]
		 * @return [type] [description]
		 */
		public static function deactivation() {
			do_action( 'k6cp/deactivation' );
		}

		/**
		 * Get option
		 *
		 * @param [type]  $opt_name [description]
		 * @return [type]           [description]
		 */
		public static function get_option( $setting_name ) {
			return K6CP_Utils::get_option_with_default( self::PREFIX, $setting_name, self::$settings );
		}
	}

	// Instantiate
	K6CP::get_instance();

endif; // End if class_exists check
