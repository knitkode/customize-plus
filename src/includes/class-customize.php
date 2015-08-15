<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'PWPcp_Customize' ) ):

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
	class PWPcp_Customize {

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
				// WordPress controls
				'text' => 'WP_Customize_Control',
				'color' => 'WP_Customize_Color_Control',
				'media' => 'WP_Customize_Media_Control',
				'image' => 'WP_Customize_Image_Control',
				'background' => 'WP_Customize_Background_Image_Control',
				'upload' => 'WP_Customize_Upload_Control',
				'cropped_image' => 'WP_Customize_Cropped_Image_Control',
				'site_icon' => 'WP_Customize_Site_Icon_Control',
				'header' => 'WP_Customize_Header_Image_Control',
				// Customize Plus controls
				'pwpcp_buttonset' => 'PWPcp_Customize_Control_Buttonset',
				'pwpcp_color' => 'PWPcp_Customize_Control_Color',
				'pwpcp_dummy' => 'PWPcp_Customize_Control_Dummy',
				'pwpcp_font_family' => 'PWPcp_Customize_Control_Font_Family',
				'pwpcp_font_weight' => 'PWPcp_Customize_Control_Font_Weight',
				'pwpcp_multicheck' => 'PWPcp_Customize_Control_Multicheck',
				'pwpcp_number' => 'PWPcp_Customize_Control_Number',
				'pwpcp_radio' => 'PWPcp_Customize_Control_Radio',
				'pwpcp_radio_image' => 'PWPcp_Customize_Control_Radio_Image',
				'pwpcp_select' => 'PWPcp_Customize_Control_Select',
				'pwpcp_slider' => 'PWPcp_Customize_Control_Slider',
				'pwpcp_sortable' => 'PWPcp_Customize_Control_Sortable',
				'pwpcp_tags' => 'PWPcp_Customize_Control_Tags',
				'pwpcp_text' => 'PWPcp_Customize_Control_Text',
				'pwpcp_textarea' => 'PWPcp_Customize_Control_Textarea',
				'pwpcp_toggle' => 'PWPcp_Customize_Control_Toggle',
			),
			'settings' => array(),
		);

		/**
		 * Temporary store for localized strings defined through control classes
		 *
		 * @var array
		 */
		private static $controls_l10n = array();

		/**
		 * Temporary store for localized strings defined through control classes
		 *
		 * @var array
		 */
		private static $controls_constants = array();

		/**
		 * CSS shared for all the icons
		 *
		 * @var string
		 */
		private static $css_icons_shared = 'position:relative;top:4px;left:-2px;line-height:0;opacity:.5;font-size:20px;font-weight:normal;font-family:"dashicons";';

		/**
		 * CSS for icons displayment
		 *
		 * @var string
		 */
		private static $css_icons = '';

		/**
		 * Whether `SCRIPT_DEBUG` is enabled
		 *
		 * @var string
		 */
		private static $min = '';

		/**
		 * Constructor
		 *
		 * @since  0.0.1
		 */
		public function __construct() {
		 	self::$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

			add_action( 'customize_register', array( __CLASS__, 'register_custom_classes' ) );
			add_action( 'customize_controls_print_styles', array( __CLASS__, 'enqueue_css_admin' ) );
			add_action( 'customize_controls_print_styles', array( __CLASS__, 'enqueue_js_shim' ) );
			add_action( 'customize_controls_print_footer_scripts' , array( __CLASS__, 'enqueue_js_admin' ) );
			add_action( 'customize_controls_print_footer_scripts', array( __CLASS__, 'get_view_loader' ) );
			add_action( 'customize_controls_enqueue_scripts', array( __CLASS__, 'add_controls_js_vars' ) );
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

			wp_enqueue_style( 'PWPcp-customize', plugins_url( 'assets/customize'.self::$min.'.css', PWPcp_PLUGIN_FILE ), array( 'dashicons' ), PWPcp_PLUGIN_VERSION );
			wp_add_inline_style( 'PWPcp-customize', self::$css_icons );

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

			wp_register_script( 'PWPcp-customize', plugins_url( 'assets/customize'.self::$min.'.js', PWPcp_PLUGIN_FILE ), array( 'json2', 'underscore', 'jquery', 'jquery-ui-slider' ), PWPcp_PLUGIN_VERSION, false );
			wp_localize_script( 'PWPcp-customize', 'PWPcp', array(
					'components' => apply_filters( 'PWPcp/customize/js_components', array() ),
					'constants' => self::get_js_constants(),
					'l10n' => self::get_js_l10n(),
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
				'THEME_URL' => get_stylesheet_directory_uri(),
				'IMAGES_BASE_URL' => PWPcp_Theme::$images_base_url,
				'DOCS_BASE_URL' => PWPcp_Theme::$docs_base_url,
			);
			$additional = (array) apply_filters( 'PWPcp/customize/js_constants', array() );
			return array_merge( $required, self::$controls_constants, $additional );
		}

		/**
		 * Get javascript localized strings
		 *
		 * @since  0.0.1
		 * @return array The required plus the additional localized strings, added through hook.
		 */
		public static function get_js_l10n() {
			$required = array(
				'introTitle' => __( 'Customize Plus', 'pkgTextdomain' ),
				'introText' => __( 'Welcome to Customize Plus', 'pkgTextdomain' ),
				'back' => __( 'Back', 'pkgTextdomain' ),
				'pluginName' => __( 'Customize Plus', 'pkgTextdomain' ),
				'tools' => __( 'Tools', 'pkgTextdomain' ),
				'vRequired' => __( 'A value is required', 'pkgTextdomain' ),
			);
			$additional = (array) apply_filters( 'PWPcp/customize/js_l10n', array() );
			return array_merge( $required, self::$controls_l10n, $additional );
		}

		/**
		 * Allows control classes to add localized strings accessible
		 * on our main `js` object `PWPcp.l10n`
		 * @since  0.0.1
		 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
		 */
		public static function add_controls_js_vars() {
			global $wp_customize;
			foreach ( $wp_customize->controls() as $control ) {
				if ( method_exists( $control, 'get_l10n' ) ) {
					self::$controls_l10n = array_merge( self::$controls_l10n, $control->get_l10n() );
				}
				if ( method_exists( $control, 'get_constants' ) ) {
					self::$controls_constants = array_merge( self::$controls_constants, $control->get_constants() );
				}
			}
		}

		/**
		 * This outputs the javascript needed in the iframe
		 * and manage the dequeuing / enqueuing of the stylesheets
		 *
		 * @since  0.0.1
		 */
		public static function enqueue_js_preview() {

			do_action( 'PWPcp/customize/preview_init' );

			wp_enqueue_script( 'PWPcp-customize-preview', plugins_url( 'assets/customize-preview'.self::$min.'.js', PWPcp_PLUGIN_FILE ), array( 'jquery', 'customize-preview' ), PWPcp_PLUGIN_VERSION, true );
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
			wp_enqueue_script( 'es5-shim', plugins_url( 'assets/es5-shim'.self::$min.'.js', PWPcp_PLUGIN_FILE ), array(), PWPcp_PLUGIN_VERSION );
			wp_script_add_data( 'es5-shim', 'conditional', 'if lt IE 9' );
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

			self::register_tree();
		}

		/**
		 * Register custom settings/controls/sections/panels types
		 *
		 * @since  0.0.1
		 * @param  array(<$type, $class_name>) $types The custom types to add
		 */
		public static function register_custom_types( $types ) {
			foreach ( $types as $type => $new_custom_types ) {
				if ( isset( self::$custom_types[ $type ] ) ) {
					self::$custom_types[ $type ] = array_merge( self::$custom_types[ $type ], $new_custom_types );
				}
			}
		}

		/**
		 * Register customize tree.
		 * On the root level we can have either panels or section so we check
		 * the `subject` of the arrays at the first level of depth of the tree.
		 *
		 * @since  0.0.1
		 */
		private static function register_tree() {
			$priority = 0;

			foreach ( PWPcp_Theme::$customize_tree as $component ) {
				$priority++;

				if ( 'panel' === $component['subject'] ) {
					self::add_panel_from_tree( $component, $priority );
				}
				else if ( 'section' === $component['subject'] ) {
					self::add_section_from_tree( null, $component, $priority );
				}
			}
		}

		/**
		 * Add panel declared in the Customizer tree.
		 *
		 * @since  0.0.1
		 * @param Array $panel    The panel array as defined by the theme developers.
		 * @param Int   $priority This incremental number is used by WordPress to calculate
		 *                        the order at which the panel are inserted in the UI.
		 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
		 */
		private static function add_panel_from_tree( $panel, $priority ) {
			global $wp_customize;

			// dynamically get panel_id with options_prefix
			$panel_id = PWPcp_Theme::$options_prefix . '-' . $panel['id'];

			// create panel args array
			$panel_args = array();
			// title (native): required
			$panel_args['title'] = $panel['title'];
			// priority (native): automated but overridable
			$panel_args['priority'] = isset( $panel['priority'] ) ? $panel['priority'] : $priority;
			// description (native): optional
			if ( isset( $panel['description'] ) ) {
				$panel_args['description'] = $panel['description'];
			}
			// active_callback (native): optional
			if ( isset( $panel['active_callback'] ) ) {
				$panel_args['active_callback'] = $panel['active_callback'];
			}
			// capability (native): optional
			if ( isset( $panel['capability'] ) ) {
				$panel_args['capability'] = $panel['capability'];
			}
			// theme_supports (native): optional
			if ( isset( $panel['theme_supports'] ) ) {
				$panel_args['theme_supports'] = $panel['theme_supports'];
			}
			// dashicon (custom): optional
			if ( isset( $panel['icon'] ) ) {
				self::add_css_panel_dashicon( $panel_id, $panel['dashicon'] );
			}
			// get type if specified
			$panel_type = isset( $panel['type'] ) ? $panel['type'] : null;

			// check if a custom type/class has been specified
			if ( $panel_type && isset( self::$custom_types['panels'][ $panel_type ] ) ) {
				// get class name
				$panel_type_class = self::$custom_types['panels'][ $panel_type ];
				// if the class exist use it
				if ( class_exists( $panel_type_class ) ) {
					$wp_customize->add_panel( new $panel_type_class( $wp_customize, $panel_id, $panel_args ) );
				// if the desired class doesn't exist just use the plain WordPress API
				} else {
					wp_die( sprintf( __( 'Customize Plus: missing class %s for panel type %s.', 'pkgTextdomain' ), '<code>' . $panel_type_class . '</code>', '<code><b>' . $panel_type . '</b></code>' ) );
				}
			// if the desired panel type is not specified just use the plain WordPress API
			} else {
				$wp_customize->add_panel( $panel_id, $panel_args );
			}

			// Add panel's sections
			if ( isset( $panel['sections'] ) ) {
				// set priority to 0
				$priority_depth1 = 0;
				// Loop through 'sections' array in each panel and add sections
				foreach ( $panel['sections'] as $section ) {
					// increment priority
					$priority_depth1++;
					self::add_section_from_tree( $panel_id, $section, $priority_depth1 );
				}
			}
		}

		/**
		 * Add section declared in the Customizer tree.
		 *
		 * @since  0.0.1
		 * @param String $panel_id The id of the parent panel when the section is nested
		 *                         inside a panel.
		 * @param Array  $section  The section array as defined by the theme developers.
		 * @param Int    $priority This incremental number is used by WordPress to calculate
		 *                         the order at which the section are inserted in the UI.
		 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
		 */
		private static function add_section_from_tree( $panel_id, $section, $priority ) {
			global $wp_customize;

			// create section args array
			$section_args = array();
			// title (native): required
			$section_args['title'] = $section['title'];
			// priority (native): automated but overridable
			$section_args['priority'] = isset( $section['priority'] ) ? $section['priority'] : $priority;
			// description (native): optional
			if ( isset( $section['description'] ) ) {
				$section_args['description'] = $section['description'];
			}
			// active_callback (native): optional
			if ( isset( $section['active_callback'] ) ) {
				$section_args['active_callback'] = $section['active_callback'];
			}
			// capability (native): optional
			if ( isset( $section['capability'] ) ) {
				$section_args['capability'] = $section['capability'];
			}
			// theme_supports (native): optional
			if ( isset( $section['theme_supports'] ) ) {
				$section_args['theme_supports'] = $section['theme_supports'];
			}
			// dashicon (custom): optional
			if ( isset( $section['dashicon'] ) ) {
				self::add_css_section_dashicon( $section['id'], $section['dashicon'] );
			}
			// panel (native): optional
			if ( $panel_id ) {
				$section_args['panel'] = $panel_id;
			}
			// get type if specified
			$section_type = isset( $section['type'] ) ? $section['type'] : null;

			// check if a custom type/class has been specified
			if ( $section_type && isset( self::$custom_types['sections'][ $section_type ] ) ) {
				// get class name
				$section_type_class = self::$custom_types['sections'][ $section_type ];
				// if the class exists use it
				if ( class_exists( $section_type_class ) ) {
					$wp_customize->add_section( new $section_type_class( $wp_customize, $section['id'], $section_args ) );
				// if the desired class doesn't exist report the error
				} else {
					wp_die( sprintf( __( 'Customize Plus: missing class %s for section type %s.', 'pkgTextdomain' ), '<code>' . $section_type_class . '</code>', '<code><b>' . $section_type . '</b></code>' ) );
				}
			// if the desired control type is not specified just use the plain WordPress API
			} else {
				$wp_customize->add_section( $section['id'], $section_args );
			}

			// add section fields
			if ( isset( $section['fields'] ) ) {
				// loop through 'fields' array in each section and add settings and controls
				foreach ( $section['fields'] as $field_id => $field_args ) {
					self::tree_add_field( $section['id'], $field_id, $field_args );
				}
			}
		}

		/**
		 * Add field (setting + control) declared in the Customizer tree.
		 *
		 * @since  0.0.1
		 * @param String $section_id The id of the parent section (required).
		 * @param Array  $field_id   The section id as defined by the theme developers.
		 * @param Array  $field_args The section array as defined by the theme developers.
		 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
		 */
		private static function tree_add_field( $section_id, $field_id, $field_args ) {
			global $wp_customize;

			$control_args = $field_args['control'];
			$setting_args = isset( $field_args['setting'] ) ? $field_args['setting'] : null;

			// augment control args array with section id
			$control_args['section'] = $section_id;

			// get type (required)
			$control_type = $control_args['type'];

			// check if a custom class is needed for this control
			if ( $control_type && isset( self::$custom_types['controls'][ $control_type ] ) ) {
				$control_type_class = self::$custom_types['controls'][ $control_type ];
			} else {
				$control_type_class = null;
			}

			if ( $setting_args ) {
				// Check if 'option' or 'theme_mod' is used to store option
				// If nothing is set, $wp_customize->add_setting method will default use 'theme_mod'
				// If 'option' is used as setting type its value will be stored in an entry in
				// {prefix}_options table.
				if ( isset( $setting_args['type'] ) && 'option' == $setting_args['type'] ) {
					$field_id = PWPcp_Theme::$options_prefix . '[' . $field_id . ']'; // @@tobecareful this is tight to customize-component-import.js \\
				}
				// add sanitize callback function from control class, if none is defined
				if ( ! isset( $setting_args['sanitize_callback'] ) ) {
					// use sanitize_callback method on control class if it exists
					if ( class_exists( $control_type_class ) && method_exists( $control_type_class, 'sanitize_callback' ) ) {
						$setting_args['sanitize_callback'] = $control_type_class . '::sanitize_callback';
					// otherwise use a default function
					} else {
						$setting_args['sanitize_callback'] = 'PWPcp_Customize_Control_Base::sanitize_callback';
					}
				}
				// add setting to WordPress
				$wp_customize->add_setting( $field_id, $setting_args );
			} else {
				// if no settings args are passed then use the Dummy Setting Class with a dummy id
				$wp_customize->add_setting( new PWPcp_Customize_Setting_Dummy( $wp_customize, 'pwpcp-dummy-setting' ) );
			}

			// check if a custom type/class has been specified
			if ( $control_type_class ) {
				// if the class exists use it
				if ( class_exists( $control_type_class ) ) {
					$wp_customize->add_control( new $control_type_class( $wp_customize, $field_id, $control_args ) );
				// if the desired class doesn't exist report the error
				} else {
					wp_die( sprintf( __( 'Customize Plus: missing class %s for control type %s.', 'pkgTextdomain' ), '<code>' . $control_type_class . '</code>', '<code><b>' . $control_type . '</b></code>' ) );
				}
			// if the desired control type is not specified use the plain WordPress API
			} else {
				$wp_customize->add_control( $field_id, $control_args );
			}
		}

		/**
		 * Add the needed css to display a dashicon for the given panel
		 *
		 * @since  0.0.1
		 * @param string $panel_id      The panel which will show the specified dashicon.
		 * @param int    $dashicon_code The dashicon code number, the `\f` is automatically
		 *                              added.
		 */
		private static function add_css_panel_dashicon( $panel_id = '', $dashicon_code ) {
			if ( ! absint( $dashicon_code ) ) {
				return;
			}
			self::$css_icons .= "#accordion-panel-$panel_id > h3:before,#accordion-panel-$panel_id .panel-title:before{content:'\\f$dashicon_code';" . self::$css_icons_shared . '}';
		}

		/**
		 * Add the needed css to display a dashicon for the given section
		 *
		 * @since  0.0.1
		 * @param string $section_id    The section which will show the specified dashicon.
		 * @param int    $dashicon_code The dashicon code number, the `\f` is automatically
		 *                              added.
		 */
		private static function add_css_section_dashicon( $section_id = '', $dashicon_code ) {
			if ( ! absint( $dashicon_code ) ) {
				return;
			}
			self::$css_icons .= "#accordion-section-$section_id > h3:before{content:'\\f$dashicon_code';" . self::$css_icons_shared . '}';
		}
	}

	// Instantiate
	new PWPcp_Customize;

endif;
