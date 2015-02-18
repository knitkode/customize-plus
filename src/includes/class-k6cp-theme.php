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

			self::init();

			add_action( 'admin_menu', array( __CLASS__, 'clean_admin_menu' ) );

			// allow themes to kicks in
			add_action( 'after_setup_theme', array( __CLASS__, 'init_with_theme') );
		}

		public static function init() {

			self::set_options();
		}

		public static function init_with_theme() {
			do_action( 'k6cp/customize/init_with_theme' );
		}

		/**
		 * Tweak admin menu.
		 * In first place remove the unnecessary links
		 * from the 'Appearance' submenu which creates a bit of confusion/mess.
		 * We have to use a weird way to remove them, kind of magic numbers ... // k6tobecareful check that those numbers stays the same accros wp versions \\
		 *
		 * @link(https://github.com/WordPress/WordPress/blob/master/wp-admin/menu.php#L162, WP source)
		 * @link(https://github.com/WordPress/WordPress/blob/master/wp-admin/menu.php#L167, WP source)
		 * @return [type] [description]
		 */
		public static function clean_admin_menu() {
			global $submenu;
			unset( $submenu['themes.php'][15] );
			unset( $submenu['themes.php'][20] ); // k6note the following should be the proper way, in theory,
			// but it doesn't work
			// remove_submenu_page( 'themes.php', 'custom-header' );
			// remove_submenu_page( 'themes.php', 'custom-background' );
			// \\
		}

		/**
		 * Remove default wordpress panel/sections
		 *
		 * Move nav section to specific panel, bit hacky,
		 * check here: http://wordpress.stackexchange.com/a/161110/25398
		 *
		 * @since  0.0.1
		 * @param {WP_Customize_Manager} $wp_customize Theme Customizer object
		 */
		public static function change_wp_defaults( $wp_customize ) {
			$wp_customize->remove_section( 'static_front_page' );

			// Move title_tagline section and change name
			$section_title_tagline = $wp_customize->get_section( 'title_tagline' );
			$wp_customize->remove_section( 'title_tagline' );
			$wp_customize->get_setting( 'blogname' )->transport = 'postMessage';
			$wp_customize->get_setting( 'blogdescription' )->transport = 'postMessage';
			$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';
			$section_title_tagline->panel = K6CP::SHORTNAME . '-content'; // k6tobecareful \\
			$wp_customize->add_section( $section_title_tagline );

			// Move nav section and change nmae
			$section_nav = $wp_customize->get_section( 'nav' );
			$wp_customize->remove_section( 'nav' );
			$section_nav->title = __( 'Menu Navigation', 'pkgTextdomain' );
			$section_nav->panel = K6CP::SHORTNAME . '-layout'; // k6tobecareful \\
			$wp_customize->add_section( $section_nav );

			// Move background_image section
			$section_custom_background = $wp_customize->get_section( 'background_image' );
			$wp_customize->remove_section( 'background_image' );
			$section_custom_background->panel = K6CP::SHORTNAME . '-layout'; // k6tobecareful \\
			$wp_customize->add_section( $section_custom_background );

			// Move header_image section
			$section_header_image = $wp_customize->get_section( 'header_image' );
			$wp_customize->remove_section( 'header_image' );
			$section_header_image->panel = K6CP::SHORTNAME . '-layout'; // k6tobecareful \\
			$wp_customize->add_section( $section_header_image );

			// Remove background color control and header color
			$wp_customize->remove_control( 'background_color' );
			$wp_customize->remove_control( 'header_textcolor' );
		}

		/**
		 * Declare theme customize options
		 *
		 * @k6hook `k6_customize_get_options`
		 *
		 * @since  0.0.1
		 */
		public static function get_framework_options() {
			if ( class_exists( 'K6CPP_Framework' ) ) {
				$framework_options = (array) K6CPP_Framework::get_options();
			} else {
				$framework_options = array();
			}
			return (array) apply_filters( 'k6cp/customize/get_framework_options', $framework_options );
		}

		/**
		 * Declare theme customize options
		 *
		 * @k6hook `k6_customize_get_options`
		 *
		 * @since  0.0.1
		 */
		public static function get_theme_options() {
			return (array) apply_filters( 'k6cp/customize/get_theme_options', array() );
		}

		/**
		 * Declare theme customize options
		 *
		 * @k6hook `k6_customize_get_options`
		 *
		 * @since  0.0.1
		 */
		public static function get_options() {
			$framework_options = self::get_framework_options();
			$theme_options = self::get_theme_options();
			return apply_filters( 'k6cp/customize/get_options', array_merge( $framework_options, $theme_options ) );
		}

		/**
		 * [set_options description]
		 *
		 * @link http://wordpress.stackexchange.com/questions/28954/how-to-set-the-default-value-of-a-option-in-a-theme
		 * @since 0.0.1
		 * @return [type]              [description]
		 */
		public static function set_options() {
			$options = self::get_options();

			foreach ( $options as $panel_id => $panel_args ) {
				foreach ( $panel_args['sections'] as $section_id => $section_args ) {
					foreach ( $section_args['fields'] as $option_id => $option_args ) {

						if ( isset ( $option_args['setting'] ) ) {

							$setting = $option_args['setting'];
							$control = $option_args['control'];

							// this allow to use a different id for the setting than the default one
							// (which is the same for the setting and its related control)
							if ( ! isset ( $setting['id'] ) ) {
								$setting['id'] = $option_id;
							}
							// this allow to use a different id for the control than the default one
							// (which is the same for the setting and its related control)
							if ( ! isset ( $control['id'] ) ) {
								$control['id'] = $option_id;
							}

							if ( $setting && $control ) {
								do_action( 'k6cp/customize/each_option', $setting, $control );
							}
						}
					}
				}
			}
		}
	}

	// Instantiate
	K6CP_Theme::get_instance();

endif;
