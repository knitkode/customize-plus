<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'K6CPP_Theme' ) ):

	/**
	 * Contains methods for customizing the theme customization screen.
	 *
	 * @package      pkgNamePretty
	 * @subpackage   classes
	 * @since        0.0.1
	 * @link         pkgHomepage
	 * @author       pkgAuthorName <pkgAuthorEmail> (pkgAuthorUrl)
	 * @copyright    pkgConfigStartYear - pkgConfigEndYear | pkgLicenseType
	 * @license      pkgLicenseUrl
	 */

	class K6CP_Theme {

		public static $options_prefix = '';

		/**
		 * [$settings_defaults description]
		 * @var array
		 */
		public static $settings_defaults = array();

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
		 * @since  0.0.1
		 */
		protected function __construct() {
			add_action( 'after_setup_theme', array( __CLASS__, 'configure' ), 999 );
		}

		// public static function ready() {
		// 	do_action( 'k6cp/theme/ready' );
		// 	self::configure();
		// }

		/**
		 * [configure description]
		 * @return [type] [description]
		 */
		public static function configure() {

			$settings = get_theme_support( 'k6cp-customize' );

			if ( is_array( $settings ) ) {
				// Themes should provide an array of options
				if ( isset( $settings[0] ) && is_array( $settings[0] ) ) {
					$theme_prefix = self::check_prefix( $settings[0] );
					$theme_panels = self::check_panels( $settings[0] );
					$theme_styles = self::check_styles( $settings[0] );

					// automatically create hooks for child themes or whatever
					self::init(
						apply_filters( $theme_prefix . '/k6cp/theme/prefix', $theme_prefix ),
						apply_filters( $theme_prefix . '/k6cp/theme/panels', $theme_panels ),
						apply_filters( $theme_prefix . '/k6cp/theme/styles', $theme_styles )
					);
				}
			}
		}

		/**
		 * [check_prefix description]
		 * @uses  sanitize_key The prefix get sanitized, just to be sure
		 * @return [type] [description]
		 */
		private static function check_prefix( $configuration ) {
			if ( isset( $configuration['prefix'] ) ) {
				return sanitize_key( $configuration['prefix'] );
			} else {
				wp_die( __( 'Customize Plus: no `prefix` given.', 'pkgTextdomain' ) );
			}
		}

		/**
		 * [check_panels description]
		 * @return [type] [description]
		 */
		private static function check_panels( $configuration ) {
			if ( isset( $configuration[ 'panels' ] ) ) {
				$theme_panels = $configuration[ 'panels' ];
				if ( is_array( $theme_panels ) ) {
					return $theme_panels;
				} else {
					wp_die( __( 'Customize Plus: `panels` must be an array.', 'pkgTextdomain' ) );
				}
			} else {
				wp_die( __( 'Customize Plus: no `panels` array given.', 'pkgTextdomain' ) );
			}
		}

		/**
		 * [check_styles description]
		 * @return [type] [description]
		 */
		private static function check_styles( $configuration ) {
			if ( isset( $configuration[ 'styles' ] ) ) {
				$theme_styles = $configuration[ 'styles' ];
				if ( is_array( $theme_styles ) ) {
					return $theme_styles;
				} else {
					wp_die( __( 'Customize Plus: `styles` must be an array.', 'pkgTextdomain' ) );
				}
			} else {
				wp_die( __( 'Customize Plus: no `styles` array given.', 'pkgTextdomain' ) );
			}
		}

		/**
		 * [init description]
		 * @return [type] [description]
		 */
		private static function init( $theme_prefix, $theme_panels, $theme_styles ) {

			// set the options prefix, we're going to use it in some places (e.g. import / export);
			self::$options_prefix = $theme_prefix;

			// register theme customize panels
			$theme_customize_manager = new K6CP_Customize_Manager( 'theme', $theme_prefix, $theme_panels );

			// add theme settings defaults
			self::$settings_defaults = $theme_customize_manager->settings_defaults;

			// register theme styles to compiler if enabled
			// k6todo use theme supports api here... \\
			if ( class_exists( 'K6CPP' ) ) {
				if ( $theme_styles && /*K6CPP::get_option_with_default( 'compiler' ) &&*/ class_exists( 'K6CPP_Compiler' ) ) {
					K6CPP_Compiler::register_styles( $theme_styles, $theme_prefix, $theme_customize_manager->panels );
				}
			}

			/**
			 * Pass all default settings values to the hook, so themes can use them
			 * to create a safe get_theme_mod in case they need it.
			 *
			 * @hook 'k6cp/theme/is_configured' for themes,
			 * @param array An array containing the defualt value for each setting
			 *              declared in the customize panels
			 */
			do_action( 'k6cp/theme/is_configured', self::$settings_defaults );
		}

		/**
		 * [get_theme_mod_with_default description]
		 * we'll need this safe theme_mod in one of our sanitization functions
		 * @see k6cp_get_less_test_input
		 *
		 * @param [type]  $opt_name [description]
		 * @return [type]           [description]
		 */
		public static function get_theme_mod_with_default( $opt_name ) {
			if ( isset( self::$settings_defaults[ $opt_name ] ) ) {
				return get_theme_mod( $opt_name, self::$settings_defaults[ $opt_name ] );
			} else {
				return get_theme_mod( $opt_name );
			}
		}

		/**
		 * [get_theme_mods_with_defaults description]
		 *
		 * Initially the `theme_mods` are empty, so check for it.
		 * @link(https://core.trac.wordpress.org/browser/trunk/src/wp-includes/functions.php#L3045, core.trac.wordpress)
		 * Anyway the function would be reverted:
		 * `wp_parse_args( get_theme_mods(), self::$settings_defaults )`
		 *
		 * @return array           [description]
		 */
		public static function get_theme_mods_with_defaults() {
			$theme_mods = get_theme_mods();
			if ( ! $theme_mods ) {
			 	$theme_mods = array();
			}
			return array_merge( self::$settings_defaults, $theme_mods );
		}
	}

	// Instantiate
	K6CP_Theme::get_instance();

endif;
