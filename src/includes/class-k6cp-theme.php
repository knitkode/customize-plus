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
			add_action( 'after_setup_theme', array( __CLASS__, 'configure' ) );
		}

		/**
		 * [configure description]
		 * @return [type] [description]
		 */
		public static function configure() {
			$configuration = (array) apply_filters( 'k6cp/theme/configure', array() );
			if ( $configuration ) {
				$prefix = self::check_prefix( $configuration );
				$customize_panels = self::check_customize_panels( $configuration );
				$styles = self::check_styles( $configuration );

				if ( is_wp_error( $prefix ) ) {
					// k6todo error handling, _doing_it_wrong() \\
					// echo $prefix->get_error_message();
				}
				if ( is_wp_error( $customize_panels ) ) {
					// k6todo error handling, _doing_it_wrong() \\
					// echo $customize_panels->get_error_message();
				}
				if ( is_wp_error( $styles ) ) {
					// k6todo error handling, _doing_it_wrong() \\
					// echo $styles->get_error_message();
				}

				self::init( $prefix, $customize_panels, $styles );
			}
		}

		/**
		 * [check_prefix description]
		 * @return [type] [description]
		 */
		private static function check_prefix( $configuration ) {
			if ( isset( $configuration['prefix'] ) ) {
				return $configuration['prefix'];
			} else {
				return new WP_Error( 'broke', __( 'Customize Plus: no `prefix` given.', 'pkgTextdomain' ) );
			}
		}

		/**
		 * [check_customize_panels description]
		 * @return [type] [description]
		 */
		private static function check_customize_panels( $configuration ) {
			if ( isset( $configuration[ 'customize_panels' ] ) ) {
				$customize_panels = $configuration[ 'customize_panels' ];
				if ( is_array( $customize_panels ) ) {
					return $customize_panels;
				} else {
					return new WP_Error( 'broke', __( 'Customize Plus: `customize_panels` must be an array.', 'pkgTextdomain' ) );
				}
			} else {
				return new WP_Error( 'broke', __( 'Customize Plus: no `customize_panels` array given.', 'pkgTextdomain' ) );
			}
		}

		/**
		 * [check_styles description]
		 * @return [type] [description]
		 */
		private static function check_styles( $configuration ) {
			if ( isset( $configuration[ 'styles' ] ) ) {
				$styles = $configuration[ 'styles' ];
				if ( is_array( $styles ) ) {
					return $styles;
				} else {
					return new WP_Error( 'broke', __( 'Customize Plus: `styles` must be an array.', 'pkgTextdomain' ) );
				}
			} else {
				return new WP_Error( 'broke', __( 'Customize Plus: no `styles` array given.', 'pkgTextdomain' ) );
			}
		}

		/**
		 * [init description]
		 * @return [type] [description]
		 */
		private static function init( $prefix, $customize_panels, $styles ) {

			// set the options prefix, we're going to use it in some places (e.g. import / export);
			self::$options_prefix = $prefix;

			// register theme customize panels
			$customize_manager = new K6CP_Customize_Manager( 'theme', $prefix, $customize_panels );

			// add theme settings defaults
			self::$settings_defaults = $customize_manager->settings_defaults;

			// register theme styles to compiler if enabled
			// k6todo use theme supports api here... \\
			if ( class_exists( 'K6CPP' ) ) {
				if ( $styles && /*K6CPP::get_option_with_default( 'compiler' ) &&*/ class_exists( 'K6CPP_Compiler' ) ) {
					K6CPP_Compiler::register_styles( $styles, $customize_manager );
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
