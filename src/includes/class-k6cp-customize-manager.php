<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'K6CP_Customize_Manager' ) ):

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

	class K6CP_Customize_Manager {

		/**
		 *
		 * @var boolean
		 */
		public $is_plugin;

		/**
		 * Name of DB entry under which options are stored if 'type' => 'option'
		 * is used for Theme Customizer settings
		 *
		 * @since 0.0.1
		 * @var string
		 */
		public $option_prefix; // namespace used for options API

		/**
		 * [$options description]
		 * @var [type]
		 */
		public $panels;

		/**
		 * [$settings_defaults description]
		 * @var [type]
		 */
		public $settings_defaults;


		/**
		 * [$control_types description]
		 * @var array
		 */
		public static $control_types = array(
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
		);
		/**
		 * [$control_types description]
		 * @var [type]
		 */
		// public $control_types;

		/**
		 * Constructor
		 *
		 * @since  0.0.1
		 */
		/**
		 * [__construct description]
		 * @param [type] $mode          'plugin' or theme
		 * @param [type] $option_prefix [description]
		 * @param [type] $panels        [description]
		 */
		public function __construct( $mode, $option_prefix, $panels ) {

			$this->is_plugin = (bool) self::interpret_mode( $mode );
			$this->option_prefix = (string) $option_prefix;
			$this->panels = (array) $panels;
			$this->settings_defaults = (array) K6CP_Utils::get_settings_defaults_from_panels( $panels );

			add_action( 'k6cp/customize/ready', array( $this, 'on_custom_classes_ready' ) );
		}

		/**
		 * [on_custom_classes_ready description]
		 *
		 */
		public function on_custom_classes_ready() {
			do_action( 'k6cp/customize/register_custom_classes', __CLASS__ );
			$this->register_panels();
		}

		/**
		 * [register_controls description]
		 *
		 * @param  array(<$type, $class_name>) $controls The custom controls to add
		 */
		// k6todo, this all thing is a little weird... \\
		public static function register_controls( $controls ) {
			foreach ( $controls as $type => $class_name ) {
				self::$control_types[ $type ] = $class_name;
			}
		}

		/**
		 * [interpret_mode description]
		 * @param  [type] $mode [description]
		 * @return [type]       [description]
		 */
		private static function interpret_mode( $mode ) {
			if ( 'theme' === $mode ) {
				return false;
			} else {
				return true;
			}
		}

		/**
		 * Get setting value with default.
		 *
		 * @param [type]  $opt_name [description]
		 * @return [type]           [description]
		 */
		public function get_setting_with_default( $opt_name, $use_theme_mods = false ) {
			// we need a `theme_mod`
			if ( ! $this->is_plugin || $use_theme_mods ) {
				// get from theme_mods (with default)
				return get_theme_mod( $opt_name, $this->settings_defaults[ $opt_name ] );
			}
			// we need an `option`
			else {
				// get from options (WordPress API)
				if ( isset( get_option( $this->option_prefix )[ $opt_name ] ) ) {
					return get_option( $this->option_prefix )[ $opt_name ];
				}
				// or get from options defaults
				else if ( isset( $this->settings_defaults[ $opt_name ] ) ) {
					return $this->settings_defaults[ $opt_name ];
				}
				// or return false, as in the WordPress API
				else {
					return false;
				}
			}
		}

		/**
		 * [register_panels description]
		 *
		 * @since  0.0.1
		 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
		 */
		public function register_panels() {
			$this->add_panels( $this->panels, $this->option_prefix );

			do_action( 'k6cp/customize/register_panels_' . $this->option_prefix );
		}

		/**
		 * [add_panels description]
		 *
		 * @since  0.0.1
		 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
		 */
		protected function add_panels( $panels, $prefix ) {
			global $wp_customize;

			// set priority to 0
			$priority_panel = 0;

			// Loop through the array and add Customizer panel
			foreach ( $panels as $panel_key => $panel ) {

				// increment priority
				$priority_panel++;

				// dynamically get panel_id with prefix
				$panel_id = $prefix . '-' . $panel_key;

				// augment panel args array
				$panel_args = array();
				$panel_args['title'] = $panel['title'];
				if ( isset( $panel['description'] ) ) {
					$panel_args['description'] = $panel['description'];
				}
				$panel_args['priority'] = $priority_panel;
				// $panel_args['capability'] = 'edit_theme_options'; // k6tocheck \\
				// $panel_args['theme_supports'] = ''; // k6tocheck \\

				// Add panel to WordPress
				$wp_customize->add_panel( $panel_id, $panel_args );

				$this->add_sections( $panel_id, $panel['sections'], $prefix );
			}
		}

		/**
		 * [add_sections description]
		 *
		 * @since  0.0.1
		 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
		 * @param [type]  $panel_fields     [description]
		 * @param [type]  $panel_id     [description]
		 */
		protected function add_sections( $panel_id, $panel_fields, $prefix ) {
			global $wp_customize;

			// set priority to 0
			$priority_section = 0;

			// Loop through 'panel_fields' array in each panel and add sections
			foreach ( $panel_fields as $section_id => $section ) {

				// increment priority
				$priority_section++;

				// create section args array
				$section_args = array();
				$section_args['title'] = $section['title'];
				if ( isset( $section['description'] ) ) {
					$section_args['description'] = $section['description'];
				}
				$section_args['priority'] = $priority_section;
				// $section_args['capability'] = 'edit_theme_options'; // k6tocheck \\
				$section_args['panel'] = $panel_id;

				// Add section to WordPress
				$wp_customize->add_section( $section_id, $section_args );

				// Loop through 'fields' array in each section and add settings and controls
				$this->add_controls( $section_id, $section['fields'], $prefix );
			}
		}

		/**
		 * Add controls
		 *
		 * @since  0.0.1
		 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
		 * @param [type]  $section_fields [description]
		 * @param [type]  $section_id    [description]
		 */
		protected function add_controls( $section_id, $section_fields, $prefix ) {
			global $wp_customize;

			foreach ( $section_fields as $option_id => $option_args ) {

				$control_args = $option_args['control'];
				$setting_args = isset( $option_args['setting'] ) ? $option_args['setting'] : null;

				if ( $setting_args ) {

					// if it's a plugin always register settings with the `options` API
					if ( $this->is_plugin ) {

						// force option type
						$setting_args['type'] = 'option';

						// set prefixed option id
						$option_id = $prefix . '[' . $option_id . ']';
					}
					// Otherwise check if 'option' or 'theme_mod' is used to store option
					else {
						// If nothing is set, $wp_customize->add_setting method will default use 'theme_mod'
						// If 'option' is used as setting type its value will be stored in an entry in
						// {prefix}_options table.
						if ( isset( $setting_args['type'] ) && 'option' == $setting_args['type'] ) {
							$option_id = $prefix . '[' . $option_id . ']'; // k6tobecareful this is tight to customize-component-import.js \\
						}
					}

					// add default callback function, if none is defined
					if ( ! isset( $setting_args['sanitize_callback'] ) ) {
						$setting_args['sanitize_callback'] = 'k6cp_sanitize_callback';
					}
					// Add setting to WordPress
					$wp_customize->add_setting( $option_id, $setting_args );

				}
				// if no settings args are passed then use the Dummy Setting Class
				else {
					// Add dummy setting to WordPress
					$wp_customize->add_setting( new K6CP_Customize_Setting_Dummy( $wp_customize, $option_id ) );
				}

				// augment control args array with section id
				$control_args['section'] = $section_id;

				// Add control to WordPress
				$control_type = $control_args['type'];

				if ( isset ( self::$control_types[ $control_type ] ) ) {
					$control_type_class = self::$control_types[ $control_type ];

					// if the class exist use it
					if ( class_exists( $control_type_class ) ) {
						$wp_customize->add_control( new $control_type_class( $wp_customize, $option_id, $control_args ) );
					}
					// if the desired class doesn't exist just use the plain WordPress API
					else {
						$wp_customize->add_control( $option_id, $control_args );
						// k6todo error (wrong api implementation, missing class) \\
					}
				}
				// if the desired control type is not specified just use the plain WordPress API
				else {
					$wp_customize->add_control( $option_id, $control_args );
					// k6todo error (wrong api implementation, missing control type) \\
				}
			}
		}
	}

endif;
