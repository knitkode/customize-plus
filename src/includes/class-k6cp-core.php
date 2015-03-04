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
			// Translate plugin meta
			__( 'pkgNamePretty', 'pkgTextDomain' );
			__( 'pkgAuthorName', 'pkgTextDomain' );
			__( 'pkgDescription', 'pkgTextDomain' );

			if ( is_admin() ) {
				// Add plugin actions links
				add_filter( 'plugin_action_links_' . plugin_basename( K6CP_PLUGIN_FILE ), array( __CLASS__, 'actions_links' ), -10 );

				// Add plugin meta links
				add_filter( 'plugin_row_meta', array( __CLASS__, 'meta_links' ), 10, 2 );
			}

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
		 * Add plugin actions links
		 * @param array $links Links array in which we would prepend our link.
		 * @return array Processed links.
		 */
		public static function actions_links( $links ) {
			$links[] = '<a href="' . add_query_arg( array( 'page' => 'k6cp-settings' ), admin_url( 'options-general.php' ) ) . '">' . esc_html__( 'Settings', 'pkgTextDomain' ) . '</a>';
			$links[] = '<a href="' . add_query_arg( array( 'page' => 'k6cp-about' ), admin_url( 'options-general.php' ) ) . '">' . esc_html__( 'About', 'pkgTextDomain' ) . '</a>';
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

endif;
