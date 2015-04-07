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
			$this->settings_defaults = (array) self::get_settings_defaults_from_panels( $panels );

			add_action( 'k6cp/customize/ready', array( $this, 'register_panels' ) );

			add_action( 'customize_controls_print_styles', array( $this, 'maybe_print_css_icons' ), 999 );
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
		 * [get_settings_defaults_from_panels description]
		 *
		 * @link http://wordpress.stackexchange.com/questions/28954/how-to-set-the-default-value-of-a-option-in-a-theme
		 * @since 0.0.1
		 * @return [type]              [description]
		 */
		public static function get_settings_defaults_from_panels( $panels ) {
			$settings_defaults = array();

			foreach ( $panels as $panel_id => $panel_args ) {
				foreach ( $panel_args['sections'] as $section_id => $section_args ) {
					foreach ( $section_args['fields'] as $field_id => $field_args ) {

						if ( isset( $field_args['setting'] ) ) {

							$setting = $field_args['setting'];

							// this allow to use a different id for the setting than the default one
							// (which is the shared between the setting and its related control)
							if ( ! isset( $setting['id'] ) ) {
								$setting['id'] = $field_id;
							}

							if ( isset( $setting['default'] ) ) {
								// set default value on options defaults
								$settings_defaults[ $setting['id'] ] = $setting['default'];
							}
							else {
								// k6todo throw error here, a default is required \\
							}
						}
					}
				}
			}
			return $settings_defaults;
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
				$options_array = get_option( $this->option_prefix );
				// if it exists return that
				if ( isset( $options_array[ $opt_name ] ) ) {
					return $options_array[ $opt_name ];
				}
				// otherwise get from options defaults
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
		 */
		public function register_panels() {
			$this->add_panels( $this->panels, $this->option_prefix );
			// do_action( 'k6cp/customize/registering_panels_' . $this->option_prefix );
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

				// add panel dashicon if specified
				if ( isset( $panel['dashicon'] ) ) {
					$this->add_css_panel_dashicon( $panel_id, $panel['dashicon'] );
				}

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

				// add section dashicon if specified
				if ( isset( $section_args['dashicon'] ) ) {
					$this->add_css_section_dashicon( $section_id, $section_args['dashicon'] );
				}

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

				if ( isset( K6CP_Customize::$custom_types['controls'][ $control_type ] ) ) {
					$control_type_class = K6CP_Customize::$custom_types['controls'][ $control_type ];

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

		/**
		 * [$common_css_icons description]
		 * @var string
		 */
		private static $common_css_icons = 'position:relative;top:4px;left:-2px;opacity:.5;font-size:20px;font-weight:normal;font-family:"dashicons";';

		/**
		 * [$css_icons description]
		 * @var string
		 */
		private $css_icons = '';

		/**
		 * [add_css_panel_dashicon description]
		 * @param string $panel_id      [description]
		 * @param [type] $dashicon_code [description]
		 */
		private function add_css_panel_dashicon( $panel_id = '', $dashicon_code ) {
			// the dashicon needs to be an integer, we add the `\f`
			if ( ! absint( $dashicon_code ) ) {
				return;
			}
			$this->css_icons .= "#accordion-panel-$panel_id > h3:before,#accordion-panel-$panel_id .panel-title:before{content:'\\f$dashicon_code';" . self::$common_css_icons . '}';
		}

		/**
		 * [add_css_section_dashicon description]
		 * @param string $section_id      [description]
		 * @param [type] $dashicon_code [description]
		 */
		private function add_css_section_dashicon( $section_id = '', $dashicon_code ) {
			return; // k6disabled for now \\
			// the dashicon needs to be an integer, we add the `\f`
			if ( ! absint( $dashicon_code ) ) {
				return;
			}
			$this->css_icons .= "#accordion-section-$section_id > h3:before{content:'\\f$dashicon_code';}" . self::$common_css_icons . '}';
		}

		/**
		 * [maybe_print_css_icons description]
		 * @return [type] [description]
		 */
		public function maybe_print_css_icons() {
			if ( $this->css_icons ) {
				echo '<style id="k6cp-customize-plus-icons">' . $this->css_icons . '</style>' . "\n";
				// wp_add_inline_style( 'dashicons', $this->css_icons );
			}
		}
	}

endif;
