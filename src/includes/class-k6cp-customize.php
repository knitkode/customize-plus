<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'K6CP_Customize' ) && class_exists( 'K6CPP_Singleton' ) ):

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

	class K6CP_Customize extends K6CPP_Singleton {

		/**
		 * WordPress customize custom types for panels,
		 * sections controls and settings.
		 * Each type must be declared with its shortname and name
		 * of its php class.
		 *
		 * @var array
		 */
		public static $custom_types = array(
			'panels' => array(),
			'sections' => array(),
			'controls' => array(
				'color' => 'WP_Customize_Color_Control',
				'image' => 'WP_Customize_Image_Control',
				'upload' => 'WP_Customize_Upload_Control',
				'k6cp_buttonset' => 'K6CP_Customize_Control_Buttonset',
				'k6cp_color' => 'K6CP_Customize_Control_Color',
				'k6cp_font_family' => 'K6CP_Customize_Control_Font_Family',
				'k6cp_multicheck' => 'K6CP_Customize_Control_Multicheck',
				'k6cp_number' => 'K6CP_Customize_Control_Number',
				'k6cp_radio' => 'K6CP_Customize_Control_Radio',
				'k6cp_radio_image' => 'K6CP_Customize_Control_Radio_Image',
				'k6cp_select' => 'K6CP_Customize_Control_Select',
				'k6cp_slider' => 'K6CP_Customize_Control_Slider',
				'k6cp_text' => 'K6CP_Customize_Control_Text',
				'k6cp_toggle' => 'K6CP_Customize_Control_Toggle',
			),
			'settings' => array(),
		);

		/**
		 * Font families
		 *
		 * @see http://www.w3schools.com/cssref/css_websafe_fonts.asp
		 * @var array
		 */
		public static $font_families = array(
		  // Serif Fonts
		  'Georgia',
		  '"Palatino Linotype"',
		  '"Book Antiqua"',
		  'Palatino',
		  '"Times New Roman"',
		  'Times',
		  'serif',
		  // Sans-Serif Fonts
		  'Arial',
		  'Helvetica',
		  '"Helvetica Neue"',
		  '"Arial Black"',
		  'Gadget',
		  '"Comic Sans MS"',
		  'cursive',
		  'Impact',
		  'Charcoal',
		  '"Lucida Sans Unicode"',
		  '"Lucida Grande"',
		  'Tahoma',
		  'Geneva',
		  '"Trebuchet MS"',
		  'Verdana',
		  'sans-serif',
		  // Monospace Font
		  '"Courier New"',
		  'Courier',
		  '"Lucida Console"',
		  'Monaco',
		  'monospace',
		  'Menlo',
		  'Consolas',

		  // Google font
		  '"Lato"',
		);

		/**
		 * Constructor
		 *
		 * @since  0.0.1
		 */
		protected function __construct() {
			add_action( 'customize_register', array( __CLASS__, 'register_custom_classes' ) );
			add_action( 'customize_controls_print_styles', array( __CLASS__, 'enqueue_css_admin' ) );
			add_action( 'customize_controls_print_styles', array( __CLASS__, 'enqueue_js_shim' ) );
			add_action( 'customize_controls_print_footer_scripts' , array( __CLASS__, 'enqueue_js_admin' ) );
			add_action( 'customize_controls_print_footer_scripts', array( __CLASS__, 'get_view_loader' ) );
			add_action( 'customize_preview_init' , array( __CLASS__, 'enqueue_js_preview' ) );
		}

		/**
		 * Outputs the custom css file
		 * in the admin page of the customize
		 *
		 * @since  0.0.1
		 */
		public static function enqueue_css_admin() {
			do_action( 'k6cp/customize/enqueue_css_admin_pre', 'k6cp-customize' );

			wp_enqueue_style( 'k6cp-customize', plugins_url( 'assets/customize.min.css', K6CP_PLUGIN_FILE ), array( 'dashicons' ), K6CP_PLUGIN_VERSION );

			do_action( 'k6cp/customize/enqueue_css_admin_post', 'k6cp-customize' );
		}

		/**
		 * Outputs the javascript needed
		 * in the admin page of the customize (not the iframe in it).
		 * Register and add data and localized strings to the customize.js
		 *
		 * @since  0.0.1
		 */
		public static function enqueue_js_admin() {
			do_action( 'k6cp/customize/enqueue_js_admin_pre', 'k6cp-customize' );

			wp_register_script( 'k6cp-customize', plugins_url( 'assets/customize.min.js', K6CP_PLUGIN_FILE ), array( 'json2', 'underscore', 'jquery', 'jquery-ui-slider' ), K6CP_PLUGIN_VERSION, false );
			wp_localize_script( 'k6cp-customize', 'k6cp', array(
					'components' => apply_filters( 'k6cp/customize/js_components', array() ),
					'constants' => self::get_js_constants(),
					'l10n' => self::get_js_l10n(),
					// filter to add extra stuff in the namespace, for developers
					'extra' => apply_filters( 'k6cp/customize/js_extra', array() ),
				) );
			wp_enqueue_script( 'k6cp-customize' );

			do_action( 'k6cp/customize/enqueue_js_admin_post', 'k6cp-customize' );
		}

		/**
		 * Get javascript constants
		 *
		 * @since  0.0.1
		 * @return array The required plus the additional constants, added through hook.
		 */
		public static function get_js_constants() {
			$required = array(
				'FONT_FAMILIES' => k6cp_sanitize_font_families( self::$font_families ),
			);
			$additional = (array) apply_filters( 'k6cp/customize/js_constants', array() );
			return array_merge( $required, $additional );
		}

		/**
		 * Get javascript localized strings
		 *
		 * @since  0.0.1
		 * @return array The required plus the additional localized strings, added through hook.
		 */
		public static function get_js_l10n() {
			$required = array(
				'back' => __( 'Back', 'pkgTextdomain' ),
				'tools' => __( 'Tools', 'pkgTextdomain' ),
				'introTitle' => __( 'Customize Plus', 'pkgTextdomain' ),
				'introText' => __( 'Welcome to Customize Plus', 'pkgTextdomain' ),
				'customColor' => __( 'Custom', 'pkgTextdomain' ),
			);
			$additional = (array) apply_filters( 'k6cp/customize/js_l10n', array() );
			return array_merge( $required, $additional );
		}

		/**
		 * This outputs the javascript needed in the iframe
		 * and manage the dequeuing / enqueuing of the stylesheets
		 *
		 * @since  0.0.1
		 */
		public static function enqueue_js_preview() {

			do_action( 'k6cp/customize/preview_init' );

			wp_enqueue_script( 'k6cp-customize-preview', plugins_url( 'assets/customize-preview.min.js', K6CP_PLUGIN_FILE ), array( 'jquery', 'customize-preview' ), K6CP_PLUGIN_VERSION, true );
		}

		/**
		 * Get view for fullscreen loader (used later on also by other components
		 * like the 'importer')
		 *
		 * @since  0.0.1
		 */
		public static function get_view_loader() { // k6wptight-layout \\
			?>
			//= include '../views/customize-loader.php'
			<?php
		}

		/**
		 * Enqueue ECMA script 5 shim for old browsers
		 *
		 * @since  0.0.1
		 */
		public static function enqueue_js_shim() {
			// global $wp_scripts;
			// $min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			// // k6wpapichange following will work from WP 4.2 \\
			// wp_enqueue_script( 'es5-shim', plugins_url( "assets/es5-shim{$min}.js", K6CP_PLUGIN_FILE ) );
			// did_action( 'init' ) && $wp_scripts->add_data( 'es5-shim', 'conditional', 'lt IE 8' );
			// wp_style_add_data( 'es5-shim', 'conditional', 'if lt IE 9' );
			?>
			<!--[if lt IE 9]><script src="<?php echo esc_url( plugins_url( 'assets/es5-shim.min.js', K6CP_PLUGIN_FILE ) ); ?>"></script><![endif]-->
			<?php
		}

		/**
		 * Custom settings, controls, sections, and panels, load classes and
		 * register through the WordPress API.
		 *
		 * @since  0.0.1
		 */
		public static function register_custom_classes() {
			require_once( K6CP_PLUGIN_DIR . 'includes/k6cp-customize-classes.php' );

			do_action( 'k6cp/customize/register_custom_classes', __CLASS__ );

			do_action( 'k6cp/customize/ready' );
		}

		/**
		 * Register custom types
		 *
		 * @since  0.0.1
		 * @param  array(<$type, $class_name>) $panels The custom panels to add
		 */
		public static function register_custom_types( $components ) {
			foreach ( $components as $component => $new_custom_types ) {
				if ( self::$custom_types[ $component ] ) {
					self::$custom_types[ $component ] = array_merge( self::$custom_types[ $component ], $new_custom_types );
				}
			}
		}
	}

	// Instantiate
	K6CP_Customize::get_instance();

endif;
