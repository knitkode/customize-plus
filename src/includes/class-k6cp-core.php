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
		 * Constructor
		 *
		 * @since 0.0.1
		 */
		public function __construct() {
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
	}

	// Instantiate
	new K6CP;

endif; // End if class_exists check
