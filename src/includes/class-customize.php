<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'PWPcp_Customize' ) && class_exists( 'PWPcp_Singleton' ) ):

	/**
	 * Contains methods for customizing the theme customization screen.
	 *
	 * @package    Customize_Plus
	 * @subpackage Customize
	 * @author     PlusWP <dev@pluswp.com> (http://pluswp.com)
	 * @copyright  2015 PlusWP (kunderi kuus)
	 * @license    GPL-2.0+
	 * @version    Release: pkgVersion
	 * @link       http://pluswp.com/customize-plus
	 */

	class PWPcp_Customize extends PWPcp_Singleton {

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
				'pwpcp_buttonset' => 'PWPcp_Customize_Control_Buttonset',
				'pwpcp_color' => 'PWPcp_Customize_Control_Color',
				'pwpcp_font_family' => 'PWPcp_Customize_Control_Font_Family',
				'pwpcp_multicheck' => 'PWPcp_Customize_Control_Multicheck',
				'pwpcp_number' => 'PWPcp_Customize_Control_Number',
				'pwpcp_radio' => 'PWPcp_Customize_Control_Radio',
				'pwpcp_radio_image' => 'PWPcp_Customize_Control_Radio_Image',
				'pwpcp_select' => 'PWPcp_Customize_Control_Select',
				'pwpcp_slider' => 'PWPcp_Customize_Control_Slider',
				'pwpcp_text' => 'PWPcp_Customize_Control_Text',
				'pwpcp_toggle' => 'PWPcp_Customize_Control_Toggle',
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
			do_action( 'PWPcp/customize/enqueue_css_admin_pre', 'PWPcp-customize' );

			wp_enqueue_style( 'PWPcp-customize', plugins_url( 'assets/customize.min.css', PWPcp_PLUGIN_FILE ), array( 'dashicons' ), PWPcp_PLUGIN_VERSION );

			do_action( 'PWPcp/customize/enqueue_css_admin_post', 'PWPcp-customize' );
		}

		/**
		 * Outputs the javascript needed
		 * in the admin page of the customize (not the iframe in it).
		 * Register and add data and localized strings to the customize.js
		 *
		 * @since  0.0.1
		 */
		public static function enqueue_js_admin() {
			do_action( 'PWPcp/customize/enqueue_js_admin_pre', 'PWPcp-customize' );

			wp_register_script( 'PWPcp-customize', plugins_url( 'assets/customize.min.js', PWPcp_PLUGIN_FILE ), array( 'json2', 'underscore', 'jquery', 'jquery-ui-slider' ), PWPcp_PLUGIN_VERSION, false );
			wp_localize_script( 'PWPcp-customize', 'PWPcp', array(
					'components' => apply_filters( 'PWPcp/customize/js_components', array() ),
					'constants' => self::get_js_constants(),
					'l10n' => self::get_js_l10n(),
					// filter to add extra stuff in the namespace, for developers
					'extra' => apply_filters( 'PWPcp/customize/js_extra', array() ),
				) );
			wp_enqueue_script( 'PWPcp-customize' );

			do_action( 'PWPcp/customize/enqueue_js_admin_post', 'PWPcp-customize' );
		}

		/**
		 * Get javascript constants
		 *
		 * @since  0.0.1
		 * @return array The required plus the additional constants, added through hook.
		 */
		public static function get_js_constants() {
			$required = array(
				'FONT_FAMILIES' => pwpcp_sanitize_font_families( self::$font_families ),
			);
			$additional = (array) apply_filters( 'PWPcp/customize/js_constants', array() );
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
			$additional = (array) apply_filters( 'PWPcp/customize/js_l10n', array() );
			return array_merge( $required, $additional );
		}

		/**
		 * This outputs the javascript needed in the iframe
		 * and manage the dequeuing / enqueuing of the stylesheets
		 *
		 * @since  0.0.1
		 */
		public static function enqueue_js_preview() {

			do_action( 'PWPcp/customize/preview_init' );

			wp_enqueue_script( 'PWPcp-customize-preview', plugins_url( 'assets/customize-preview.min.js', PWPcp_PLUGIN_FILE ), array( 'jquery', 'customize-preview' ), PWPcp_PLUGIN_VERSION, true );
		}

		/**
		 * Get view for fullscreen loader (used later on also by other components
		 * like the 'importer')
		 *
		 * @since  0.0.1
		 */
		public static function get_view_loader() { // @@wptight-layout \\
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
			// // @@wpapichange following will work from WP 4.3? \\
			// wp_enqueue_script( 'es5-shim', plugins_url( "assets/es5-shim{$min}.js", PWPcp_PLUGIN_FILE ) );
			// did_action( 'init' ) && $wp_scripts->add_data( 'es5-shim', 'conditional', 'lt IE 8' );
			// wp_style_add_data( 'es5-shim', 'conditional', 'if lt IE 9' );
			?>
			<!--[if lt IE 9]><script src="<?php echo esc_url( plugins_url( 'assets/es5-shim.min.js', PWPcp_PLUGIN_FILE ) ); ?>"></script><![endif]-->
			<?php
		}

		/**
		 * Custom settings, controls, sections, and panels, load classes and
		 * register through the WordPress API.
		 *
		 * @since  0.0.1
		 */
		public static function register_custom_classes() {
			require_once( PWPcp_PLUGIN_DIR . 'includes/customize-classes.php' );

			do_action( 'PWPcp/customize/register_custom_classes', __CLASS__ );

			do_action( 'PWPcp/customize/ready' );
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
	PWPcp_Customize::get_instance();

endif;
