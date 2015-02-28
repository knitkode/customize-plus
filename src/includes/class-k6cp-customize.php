<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'K6CP_Customize' ) ):

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

	class K6CP_Customize {

		/**
		 * [$custom_types description]
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
			// The priority here is very important, when adding custom classes to the customize
			// you should use a priority in this range (11, 99)
			add_action( 'customize_register', array( __CLASS__, 'register_custom_classes' ), 10 );

			add_action( 'customize_controls_print_styles', array( __CLASS__, 'enqueue_css_admin' ) );
			add_action( 'customize_controls_print_styles', array( __CLASS__, 'enqueue_js_shim' ) );
			add_action( 'customize_controls_print_footer_scripts' , array( __CLASS__, 'enqueue_js_admin' ) );
			add_action( 'customize_controls_print_footer_scripts', array( __CLASS__, 'get_view_loader' ) );
			add_action( 'customize_preview_init' , array( __CLASS__, 'enqueue_js_preview' ) );

			// do_action( 'k6cp/customize/init' );
		}

		/**
		 * Outputs the custom css file
		 * in the admin page of the customize
		 *
		 * @since  0.0.1
		 */
		public static function enqueue_css_admin() {
			wp_enqueue_style( 'k6cp-customize', plugins_url( 'assets/customize.min.css', K6CP_PLUGIN_FILE ), array( 'dashicons' ), K6CP_PLUGIN_VERSION );
		}

		/**
		 * Outputs the javascript needed
		 * in the admin page of the customize (not the iframe in it).
		 * Register and add data and localized strings to the customize.js
		 *
		 * @since  0.0.1
		 */
		public static function enqueue_js_admin() {
			wp_register_script( 'k6cp-customize', plugins_url( 'assets/customize.min.js', K6CP_PLUGIN_FILE ), array( 'json2', 'underscore', 'jquery', 'jquery-ui-slider' ), K6CP_PLUGIN_VERSION, false );

			wp_localize_script( 'k6cp-customize', 'k6cp', array(
					'constants' => self::get_js_constants(),
					'options' => self::get_js_options(),
					'l10n' => self::get_js_l10n(),
				) );
			wp_enqueue_script( 'k6cp-customize' );
		}

		/**
		 * [get_js_constants description]
		 * @return [type] [description]
		 */
		public static function get_js_constants() {
			$required = array(
				'FONT_FAMILIES' => k6cp_sanitize_font_families( self::$font_families ),
				'BREAKPOINTS' => array(
					array( 'name' => 'xs', 'size' => 480 ), // k6todo, retrieve these from less options \\
					array( 'name' => 'sm', 'size' => 768 ),
					array( 'name' => 'md', 'size' => 992 ),
					array( 'name' => 'lg', 'size' => 1200 ),
				),
			);
			$additional = (array) apply_filters( 'k6cp/customize/js_constants', array() );
			return array_merge( $required, $additional );
		}

		/**
		 * [get_js_options description]
		 * @return [type] [description]
		 */
		public static function get_js_options() {
			$required = array(
				// nothing for now
			);
			$additional = (array) apply_filters( 'k6cp/customize/js_options', array() );
			return array_merge( $required, $additional );
		}

		/**
		 * [get_js_l10n description]
		 * @return [type] [description]
		 */
		public static function get_js_l10n() {
			$required = array(
				'back' => __( 'Back', 'pkgTextdomain' ),
				'searchPlaceholder' => __( 'Control name ...', 'pkgTextdomain' ),
				'searchResultsFor' => __( 'Search for:', 'pkgTextdomain' ),
				'tools' => __( 'Tools', 'pkgTextdomain' ),
				'introTitle' => __( 'Customize', 'pkgTextdomain' ),
				'introText' => __( 'Welcome to the customize tool', 'pkgTextdomain' ),
				'exportUnsaved' => __( 'There are unsaved settings, they won\'t be exported. Proceed?', 'pkgTextdomain' ),
				'importUnsaved' => __( 'There are unsaved settings, they will be lost. Proceed?', 'pkgTextdomain' ),
				'failedLoadFile' => __( 'Failed to load file', 'pkgTextdomain' ),
				'loadingPreview' => __( 'Loading preview ...', 'pkgTextdomain' ),
				'resettingPreview' => __( 'Resetting preview ...', 'pkgTextdomain' ),
				'resetting' => __( 'Resetting ...', 'pkgTextdomain' ),
				'importResetted' => __( 'Import resetted', 'pkgTextdomain' ),
				'importProcessing' => __( 'Processing import ...', 'pkgTextdomain' ),
				'importUndo' => __( 'Undo Import', 'pkgTextdomain' ),
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
		 * [get_view_loader description]
		 *
		 * @since  0.0.1
		 * @return [type] [description]
		 */
		public static function get_view_loader() { // k6wptight-layout \\
			?>
			//= include '../views/customize-loader.php'
			<?php
		}

		/**
		 * [enqueue_js_shim description]
		 *
		 * @since  0.0.1
		 */
		public static function enqueue_js_shim() {
			$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			// k6wpapichange following will work from WP 4.2 \\
			// wp_enqueue_style( 'es5-shim', plugins_url( "assets/es5-shim{$min}.js", K6CP_PLUGIN_FILE ) );
			// wp_style_add_data( 'es5-shim', 'conditional', 'if lt IE 9' );
			?>
			<!--[if lt IE 9]><script src="<?php echo esc_url( plugins_url( "assets/es5-shim{$min}.js", K6CP_PLUGIN_FILE ) ); ?>"></script><![endif]-->
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
		 * [register_custom_types description]
		 *
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
