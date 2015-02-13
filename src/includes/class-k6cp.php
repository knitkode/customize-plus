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

			// initial setup
			// require_once( __DIR__ . '/class-k6-customize.php' );
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
