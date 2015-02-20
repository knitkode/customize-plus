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
		 * Description for public
		 * @var array
		 */
		public $options_defaults; // these will be the 'theme_mods'

		/**
		 * [$options description]
		 * @var [type]
		 */
		public $panels;

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
			$this->set_options_defaults();

			add_action( 'k6cp/customize/ready', array( $this, 'register_panels' ) );
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

		// // just trying stuff here, it's not javascript...
		// protected function options_walker( $callback ) {
		// 	foreach ( $options as $panel_id => $panel_args ) {
		// 		foreach ( $panel_args['sections'] as $section_id => $section_args ) {
		// 			foreach ( $section_args['fields'] as $option_id => $option_args ) {
		// 				// $callback( $option_id, $option_args );
		// 			}
		// 		}
		// 	}
		// }

		/**
		 * [set_options_defaults description]
		 *
		 * @link http://wordpress.stackexchange.com/questions/28954/how-to-set-the-default-value-of-a-option-in-a-theme
		 * @since 0.0.1
		 * @return [type]              [description]
		 */
		public function set_options_defaults() {
			foreach ( $this->panels as $panel_id => $panel_args ) {
				foreach ( $panel_args['sections'] as $section_id => $section_args ) {
					foreach ( $section_args['fields'] as $option_id => $option_args ) {

						if ( isset ( $option_args['setting'] ) ) {

							$setting = $option_args['setting'];

							// this allow to use a different id for the setting than the default one
							// (which is the shared between the setting and its related control)
							if ( ! isset ( $setting['id'] ) ) {
								$setting['id'] = $option_id;
							}

							// set default value on options defaults
							$this->options_defaults[ $setting['id'] ] = $setting['default'];
						}
					}
				}
			}
		}

		/**
		 * Get option
		 *
		 * @param [type]  $opt_name [description]
		 * @return [type]           [description]
		 */
		public function get_option_with_default( $opt_name, $use_theme_mods = false ) {
			// we need a `theme_mod`
			if ( ! $this->is_plugin || $use_theme_mods ) {
				// get from theme_mods (with default)
				return get_theme_mod( $opt_name, $this->options_defaults[ $opt_name ] );
			}
			// we need an `option`
			else {
				// get from options (WordPress API)
				if ( isset( get_option( $this->option_prefix )[ $opt_name ] ) ) {
					return get_option( $this->option_prefix )[ $opt_name ];
				}
				// or get from options defaults
				else if ( isset( $this->options_defaults[ $opt_name ] ) ) {
					return $this->options_defaults[ $opt_name ];
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
				switch ( $control_args['type'] ) {
					case 'color':
						$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, $option_id, $control_args ) );
						break;
					case 'image':
						$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, $option_id, $control_args ) );
						break;
					case 'upload':
						$wp_customize->add_control( new WP_Customize_Upload_Control( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_buttonset':
						$wp_customize->add_control( new K6CP_Customize_Control_Buttonset( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_color':
						$wp_customize->add_control( new K6CP_Customize_Control_Color( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_color_dynamic':
						$wp_customize->add_control( new K6CP_Customize_Control_Color_Dynamic( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_font_family':
						$wp_customize->add_control( new K6CP_Customize_Control_Font_Family( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_layout_columns':
						$wp_customize->add_control( new K6CP_Customize_Control_Layout_Columns( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_multicheck':
						$wp_customize->add_control( new K6CP_Customize_Control_Multicheck( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_number':
						$wp_customize->add_control( new K6CP_Customize_Control_Number( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_radio':
						$wp_customize->add_control( new K6CP_Customize_Control_Radio( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_radio_image':
						$wp_customize->add_control( new K6CP_Customize_Control_Radio_Image( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_select':
						$wp_customize->add_control( new K6CP_Customize_Control_Select( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_size_dynamic':
						$wp_customize->add_control( new K6CP_Customize_Control_Size_Dynamic( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_slider':
						$wp_customize->add_control( new K6CP_Customize_Control_Slider( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_text':
						$wp_customize->add_control( new K6CP_Customize_Control_Text( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6cp_toggle':
						$wp_customize->add_control( new K6CP_Customize_Control_Toggle( $wp_customize, $option_id, $control_args ) );
						break;
					default:
						$wp_customize->add_control( $option_id, $control_args );
						break;
				}
			}
		}
	}

endif;
