<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'K6CP_Theme' ) ):

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

		/**
		 * [$framework_settings_defaults description]
		 * @var [type]
		 */
		public static $framework_settings_defaults;

		/**
		 * [$theme_settings_defaults description]
		 * @var [type]
		 */
		public static $theme_settings_defaults;

		/**
		 * [$all_settings_defaults description]
		 * @var array
		 */
		public static $all_settings_defaults = array();

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
			add_action( 'k6cp/theme/ready', array( __CLASS__, 'configure' ) );
		}

		/**
		 * [configure description]
		 * @return [type] [description]
		 */
		public static function configure() {
			$configuration = (array) apply_filters( 'k6cp/theme/configure', array() );

			if ( $configuration ) {
				$prefix = self::check_prefix( $configuration );
				$theme_customize_panels = self::check_customize_panels( $configuration );
				$framework_name = self::check_framework( $configuration );
				$theme_stylesheets = self::check_theme_stylesheets( $configuration );

				if ( is_wp_error( $prefix ) ) {
					echo $prefix->get_error_message();
				}
				if ( is_wp_error( $theme_customize_panels ) ) {
					echo $theme_customize_panels->get_error_message();
				}
				if ( is_wp_error( $framework_name ) ) {
					echo $framework_name->get_error_message();
				}
				if ( is_wp_error( $theme_stylesheets ) ) {
					echo $theme_stylesheets->get_error_message();
				}

				self::init( $prefix, $theme_customize_panels, $theme_stylesheets, $framework_name );
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
				$theme_customize_panels = $configuration[ 'customize_panels' ];
				if ( is_array( $theme_customize_panels ) ) {
					return $theme_customize_panels;
				} else {
					return new WP_Error( 'broke', __( 'Customize Plus: `customize_panels` must be an array.', 'pkgTextdomain' ) );
				}
			} else {
				return new WP_Error( 'broke', __( 'Customize Plus: no `customize_panels` array given.', 'pkgTextdomain' ) );
			}
		}

		/**
		 * [check_framework description]
		 * @return [type] [description]
		 */
		private static function check_framework( $configuration ) {
			if ( isset( $configuration[ 'framework' ] ) ) {
				$framework_name = $configuration[ 'framework' ];
				if ( ! is_string( $framework_name ) ) {
					return new WP_Error( 'broke', __( 'Customize Plus Premium: `framework` needs to be a string', 'pkgTextdomain' ) );
				}
				if ( ! class_exists( 'K6CPP_Framework' ) ) {
					return new WP_Error( 'broke', __( 'Customize Plus Premium is required to use a framework', 'pkgTextdomain' ) );
				} else {
					if ( in_array( $framework_name, K6CPP_Framework::$available_frameworks ) ) {
						return $framework_name;
					} else {
						return new WP_Error( 'broke', printf( __( 'Customize Plus Premium: %s framework does not exist.', 'pkgTextdomain' ), $framework_name ) );
					}
				}
				return $framework_name;
			}
		}

		/**
		 * [check_theme_stylesheets description]
		 * @return [type] [description]
		 */
		private static function check_theme_stylesheets( $configuration ) {
			if ( isset( $configuration[ 'stylesheets' ] ) ) {
				$theme_stylesheets = $configuration[ 'stylesheets' ];
				if ( is_array( $theme_stylesheets ) ) {
					return $theme_stylesheets;
				} else {
					return new WP_Error( 'broke', __( 'Customize Plus: `stylesheets` must be an array.', 'pkgTextdomain' ) );
				}
			} else {
				return new WP_Error( 'broke', __( 'Customize Plus: no `stylesheets` array given.', 'pkgTextdomain' ) );
			}
		}

		/**
		 * [init description]
		 * @return [type] [description]
		 */
		private static function init( $prefix, $theme_customize_panels, $theme_stylesheets, $framework_name ) {

			$framework_enabled = K6CP::get_option( 'framework' ) && class_exists( 'K6CPP_Framework' );
			$compiler_enabled = K6CP::get_option( 'compiler' ) && class_exists( 'K6CPP_Compiler' );

			// pass all default settings values to the hook, so themes can use them
			// to create a safe get_theme_mod in case they need it.
			$all_settings_defaults = array();

			// first maybe register theme framework panels and stylesheets
			if ( $framework_name && $framework_enabled ) {

				// register framework customize panels
				$framework_customize_manager = new K6CP_Customize_Manager( 'theme', $prefix, K6CPP_Framework::get_customize_panels() );

				// store framework settings defualt on instance, we use it in the framework classes
				self::$framework_settings_defaults = $framework_customize_manager->settings_defaults;

				// add framework settings defaults
				self::$all_settings_defaults = array_merge( self::$all_settings_defaults, self::$framework_settings_defaults );

				// register framework stylesheets to compiler if enabled
				if ( $compiler_enabled ) {
					foreach ( K6CPP_Framework::get_styles() as $style ) {
						K6CPP_Compiler::register_style( $style, true, $framework_customize_manager );
					}
				}
			}

			// register theme customize panels
			$theme_customize_manager = new K6CP_Customize_Manager( 'theme', $prefix, $theme_customize_panels );

			self::$theme_settings_defaults = $theme_customize_manager->settings_defaults;

			// add theme settings defaults
			self::$all_settings_defaults = array_merge( self::$all_settings_defaults, self::$theme_settings_defaults );

			// register theme stylesheets to compiler if enabled
			if ( $theme_stylesheets && $compiler_enabled ) {
				foreach ( $theme_stylesheets as $style ) {
					K6CPP_Compiler::register_style( $style, false, $theme_customize_manager );
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
			do_action( 'k6cp/theme/is_configured', self::$all_settings_defaults );
		}

		/**
		 * [get_theme_mod description]
		 * we'll need this safe theme_mod in one of our sanitization functions
		 * @see k6cp_get_less_test_input
		 *
		 * @param [type]  $opt_name [description]
		 * @return [type]           [description]
		 */
		public static function get_theme_mod( $opt_name ) {
			if ( isset( self::$all_settings_defaults[ $opt_name ] ) ) {
				return get_theme_mod( $opt_name, self::$all_settings_defaults[ $opt_name ] );
			} else {
				return get_theme_mod( $opt_name );
			}
		}
	}

	// Instantiate
	K6CP_Theme::get_instance();

endif;
