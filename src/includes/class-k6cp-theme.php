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

		public static $prefix;
		public static $customize_panels;
		public static $framework_name;
		public static $theme_stylesheets;

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
			// add_action( 'admin_menu', array( __CLASS__, 'clean_admin_menu' ) ); TODO
			// add_action( 'customize_register', array( $this, 'change_wp_defaults' ) ); TODO

			add_action( 'k6cp/theme/ready', array( __CLASS__, 'configure' ) );
		}

		public static function configure() {
			$configuration = (array) apply_filters( 'k6cp/theme/configure', array() );

			if ( $configuration ) {
				$prefix = self::check_prefix( $configuration );
				$customize_panels = self::check_customize_panels( $configuration );
				$framework_name = self::check_framework( $configuration );
				$theme_stylesheets = self::check_theme_stylesheets( $configuration );

				if ( is_wp_error( $prefix ) ) {
					echo $prefix->get_error_message();
				}
				if ( is_wp_error( $customize_panels ) ) {
					echo $customize_panels->get_error_message();
				}
				if ( is_wp_error( $framework_name ) ) {
					echo $framework_name->get_error_message();
				}
				if ( is_wp_error( $theme_stylesheets ) ) {
					echo $theme_stylesheets->get_error_message();
				}

				self::$prefix = $prefix;
				self::$customize_panels = $customize_panels;
				self::$framework_name = $framework_name;
				self::$theme_stylesheets = $theme_stylesheets;
				self::init();
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
		public static function init() {

			// first register theme framework panels and stylesheets if it's asked and if it's premium
			if ( self::$framework_name && class_exists( 'K6CPP_Framework' ) ) {
				$customize_manager = new K6CP_Customize_Manager( 'theme', self::$prefix, K6CPP_Framework::get_customize_panels() );

				if ( class_exists( 'K6CPP_Compiler' ) ) {
					$framework_styles = K6CPP_Framework::get_styles();
					foreach ( $framework_styles as $style ) {
						K6CPP_Compiler::register_style( $style, $customize_manager );
					}
				}
			}

			// register theme panels
			$customize_manager = new K6CP_Customize_Manager( 'theme', self::$prefix, self::$customize_panels );

			// register theme stylesheets to compiler if it is premium
			if ( self::$theme_stylesheets && class_exists( 'K6CPP_Compiler' ) ) {
				foreach ( self::$theme_stylesheets as $style ) {
					K6CPP_Compiler::register_style( $style, $customize_manager );
				}
			}

			/**
			 * @hook 'k6cp/theme/is_configured' for themes,
			 * @param array An array containing the defualt value for each option
			 *              declared in the customize panels
			 */
			do_action( 'k6cp/theme/is_configured', $customize_manager->options_defaults );
		}
	}

	// Instantiate
	K6CP_Theme::get_instance();

endif;
