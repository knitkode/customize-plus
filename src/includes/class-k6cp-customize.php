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
		 * Description for public
		 * @var string
		 */
		public static $OPTIONS_PREFIX; // namespace used for options API

		/**
		 * Description for public
		 * @var array
		 */
		public static $DEFAULTS; // these will be the 'theme_mods'

		/**
		 * Font families
		 *
		 * @see http://www.w3schools.com/cssref/css_websafe_fonts.asp
		 * @var array
		 */
		public static $FONT_FAMILIES = array(
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

			self::init();

			add_action( 'admin_menu', array( __CLASS__, 'clean_admin_menu' ) );

			// The priority here is very important, when adding custom classes to the customize
			// you should use a priority in this range (11, 99)
			add_action( 'k6cp/customize/register', array( __CLASS__, 'add_custom_classes' ), 10 );
			add_action( 'k6cp/customize/register', array( __CLASS__, 'add_panels' ), 100 );


			// add_action( 'customize_register', array( $this, 'change_wp_defaults' ) ); TODO
			add_action( 'customize_controls_print_styles', array( __CLASS__, 'inject_css_admin' ) );
			add_action( 'customize_controls_print_styles', array( __CLASS__, 'inject_js_shim' ) );
			add_action( 'customize_controls_print_scripts', array( __CLASS__, 'print_templates' ) );
			add_action( 'customize_controls_print_footer_scripts', array( __CLASS__, 'print_template_loader' ) );
			add_action( 'customize_controls_print_footer_scripts' , array( __CLASS__, 'inject_js_admin' ) );
			add_action( 'customize_preview_init' , array( $this, 'inject_js_preview' ) );
			// k6doubt add_action( 'customize_save_after', array( $this, 'compile_css' ) ); // use this or the less.js result sent through ajax \\

			add_action( 'wp_ajax_k6_save_css', array( $this, 'save_css' ) ); // this should loop through all saved stylesheets (also the one from the theme)
			add_action( 'wp_ajax_k6_export', array( $this, 'export_settings' ) );
			add_action( 'admin_post_k6_import', array( $this, 'import_settings' ) );
		}

		public static function init() {
			self::set_options_prefix();
			self::set_options();

			do_action( 'k6cp/customize/init' );
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
		 * Outputs the custom css file
		 * in the admin page of the customize
		 *
		 * @since  0.0.1
		 */
		public static function inject_css_admin() {
			wp_enqueue_style( 'k6cp-customize', plugins_url( 'assets/customize.min.css', K6CP_PLUGIN_FILE ), array( 'dashicons' ), K6CP::VERSION ); // k6anticache \\ // k6trial wp_enqueue_script( 'k6cp-customize-preview', K6CP::$_ASSETS . 'jquery-velocity-patch.js?'.time().'='.mt_rand(), array( 'jquery' ), K6CP::VERSION ); // k6anticache k6temp \\
		}

		/**
		 * Get filename of the exported settings .json file
		 * A timestamp needs to be appended
		 * @return [string] The default filename's beginning of the file with exported settings
		 */
		public static function get_base_export_filename() {
			return get_bloginfo( 'name' ) . '--theme-' . get_option( 'stylesheet' ) . '-settings';
		}

		/**
		 * Outputs the javascript needed
		 * in the admin page of the customize (not the iframe in it).
		 * Register and add data and localized strings to the customize.js
		 *
		 * @since  0.0.1
		 */
		public static function inject_js_admin() {
			wp_register_script( 'k6cp-customize', plugins_url( 'assets/customize.min.js', K6CP_PLUGIN_FILE ), array( 'json2', 'underscore', 'jquery' ), K6CP::VERSION, false ); // k6anticache \\

			wp_localize_script( 'k6cp-customize', 'K6', array(
					'constants' => self::get_js_constants(),
					'options' => self::get_js_options(),
					'l10n' => self::get_js_l10n(),
				) );
			wp_enqueue_script( 'k6cp-customize' );
		}

		public static function get_js_constants() {
			$required = array(
				'FONT_FAMILIES' => k6cp_sanitize_font_families( self::$FONT_FAMILIES ),
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

		public static function get_js_options() {
			$required = array(
				// nothing for now
			);
			$additional = (array) apply_filters( 'k6cp/customize/js_options', array() );
			return array_merge( $required, $additional );
		}

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
		 * Get theme main less file content
		 *
		 * @link( http://stackoverflow.com/a/19510664/1938970, strip spaces)
		 * @link( http://stackoverflow.com/a/15123777/1938970, strip comments (customized))
		 * @return string The theme.less file as a string (we pass it to the web worker)
		 */
		public static function get_uncompiled_stylesheet_content() {
			$response = wp_remote_get( K6CP::$_ASSETS . 'styles/theme.less' );
			$less_string = wp_remote_retrieve_body( $response ); // k6doubt, keep it or not? // $less_string = preg_replace( '/(?:(?:(?<!\:|\\\|\')\/\/.*))/', '', $less_string ); // k6doubt, keep it or not? // $less_string = preg_replace( '/[ \t]+/', ' ', preg_replace( '/\s*$^\s*/m', "\n", $less_string ) ); \\
			return $less_string;
		}

		/**
		 * This outputs the javascript needed in the iframe
		 * and manage the dequeuing / enqueuing of the stylesheets
		 *
		 * @since  0.0.1
		 */
		public function inject_js_preview() {

			do_action( 'k6cp/customize/preview_init' );

			wp_enqueue_script( 'k6cp-customize-preview', plugins_url( 'assets/customize-preview.min.js?'.time().'='.mt_rand(), K6CP_PLUGIN_FILE ), K6CP::VERSION, true ); // k6anticache \\
		}


		/**
		 * [print_template_loader description]
		 *
		 * @since  0.0.1
		 * @return [type] [description]
		 */
		public static function print_template_loader() { // k6wptight-layout \\
			?>
			//= include '../views/customize-loader.php'
			<?php
		}

		/**
		 * [inject_js_shim description]
		 *
		 * @since  0.0.1
		 */
		public static function inject_js_shim() {
			$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			// wp_enqueue_style( 'es5-shim', plugins_url( "assets/es5-shim{$min}.js", K6CP_PLUGIN_FILE ) );
			// wp_style_add_data( 'es5-shim', 'conditional', 'if lt IE 9' );
			?>
			<!--[if lt IE 9]><script src="<?php echo esc_url( plugins_url( "assets/es5-shim{$min}.js", K6CP_PLUGIN_FILE ) ); ?>"></script><![endif]-->
			<?php
		}

		/**
		 * [print_templates description]
		 *
		 * @since  0.0.1
		 * @return [type] [description]
		 */
		public static function print_templates() { // k6wptight-layout \\
			?>
			//= include '../views/customize-templates.php'
			<?php
		}

		/**
		 * Export settings callback.
		 * It gets options and returns
		 * a json response to the ajax request
		 *
		 * For a no ajax solution check this
		 * link: https://pippinsplugins.com/building-settings-import-export-feature/
		 *
		 * @since  0.0.1
		 */
		public static function export_settings() {
			$mods_to_export = array();
			$mods = get_theme_mods();

			unset( $mods['nav_menu_locations'] );

			foreach ( $mods as $key => $value ) {
				$mods_to_export[ $key ] = maybe_unserialize( $value );
			}

			wp_send_json_success(
				array(
					'mods' => $mods_to_export,
					'options' => get_option( self::$OPTIONS_PREFIX, array() )
				)
			);
			die(); // this is required to terminate immediately and return a proper response
		}

		/**
		 * Import settings callback.
		 * It stores the options and ...
		 *
		 * @since  0.0.1
		 */
		public static function import_settings() {

			if ( ! current_user_can( 'manage_options' ) ) {
				return; }

			if ( isset( $_FILES['import'] ) && check_admin_referer( 'k6_import', 'k6_import_nonce' ) ) {
				if ( $_FILES['import']['error'] > 0 ) {
					wp_die( 'An error occured.' );
				} else {
					$file = $_FILES['import']['tmp_name'];
					$name = $_FILES['import']['name'];
					$size = $_FILES['import']['size'];
					$value = explode( '.', $name );
					$extension = strtolower( array_pop( $value ) );

					if ( empty( $file ) ) {
						wp_die( __( 'Please upload a file to import', 'pkgTextdomain' ) );
					}
					else if ( 'json' != $extension ) {
						wp_die( __( 'Please upload a valid .json file', 'pkgTextdomain' ) );
					}
					else if ( $size > 500000 ) {
						wp_die( __( 'The file size is too big', 'pkgTextdomain' ) );
					}
					else {
						$settings = json_decode( file_get_contents( $file ), true );
						foreach ( $settings['mods'] as $key => $value ) {
							set_theme_mod( $key, $value );
						}
						$settings_options_prefix = self::$OPTIONS_PREFIX;

						if ( false !== get_option( $settings_options_prefix ) ) {

							// The option already exists, so we just update it.
							update_option( $settings_options_prefix, $settings['options'] );
						} else {

							// The option hasn't been added yet. We'll add it with $autoload set to 'no'.
							add_option( $settings_options_prefix, $settings['options'], null, 'no' );
						}

						do_action( 'k6cp/customize/import' );

						wp_safe_redirect( admin_url( 'customize.php?k6_import=1' ) ); exit;
					}
				}
			}
			die(); // this is required to terminate immediately and return a proper response
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
		 * Custom controls, sections, and panels,load classes and register to through
		 * WordPress API. Everything that use js templates needs to be registered
		 * this way
		 *
		 * @since  0.0.1
		 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
		 */
		public static function add_custom_classes() {
			global $wp_customize;

			require_once( K6CP_PLUGIN_DIR . 'includes/class-k6cp-customize-classes.php' );

			$wp_customize->register_control_type( 'K6CP_Customize_Control_Buttonset' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Color' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Font_Family' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Layout_Columns' ); // k6todo probably move to theme \\
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Multicheck' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Number' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Radio' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Radio_Image' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Select' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Slider' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Text' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Toggle' );

			// k6todo k6tobecareful-api is changing
			// Add search section
			// $wp_customize->add_section( new K6CP_Customize_Section_Search( $wp_customize, 'k6_search', array( 'priority' => 99999 ) ) );
			// $wp_customize->add_setting( new K6CP_Customize_Setting_Dummy( $wp_customize, 'searchable' ) );
			// $wp_customize->add_control('searchable', array( 'section' => 'k6_search' ));
			// \\
			do_action( 'k6cp/customize/custom_classes_loaded' );
		}

		/**
		 * [add_panels description]
		 *
		 * @since  0.0.1
		 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
		 */
		public static function add_panels() {
			global $wp_customize;

			// Get all the fields using a helper function
			$panels = self::get_options();

			// Use a short prefix for the panels' id
			$panel_prefix = K6CP::SHORTNAME;

			// set priority to 0
			$priority_panel = 0;

			// Loop through the array and add Customizer panel
			foreach ( $panels as $panel_key => $panel ) {

				// increment priority
				$priority_panel++;

				// dynamically get panel_id with prefix
				$panel_id = $panel_prefix . '-' . $panel_key;

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

				self::add_sections( $panel_id, $panel['sections'] );
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
		private static function add_sections( $panel_id, $panel_fields ) {
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
				self::add_controls( $section_id, $section['fields'] );
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
		private static function add_controls( $section_id, $section_fields ) {
			global $wp_customize;

			foreach ( $section_fields as $option_id => $option_args ) {

				$control_args = $option_args['control'];
				$setting_args = isset( $option_args['setting'] ) ? $option_args['setting'] : null;

				if ( $setting_args ) {

					// Check if 'option' or 'theme_mod' is used to store option
					// If nothing is set, $wp_customize->add_setting method will default use 'theme_mod'
					// If 'option' is used as setting type its value will be stored in an entry in
					// {prefix}_options table.
					if ( isset( $setting_args['type'] ) && 'option' == $setting_args['type'] ) {
						$option_id = self::$OPTIONS_PREFIX . '[' . $option_id . ']'; // k6tobecareful this is tight to customize-component-import.js \\
					}

					// add default callback function, if none is defined
					if ( ! isset( $setting_args['sanitize_callback'] ) ) {
						$setting_args['sanitize_callback'] = 'k6cp_sanitize_callback';
					}
					// Add setting to WordPress
					$wp_customize->add_setting( $option_id, $setting_args );

					// if no settings args are passed then use the Dummy Setting Class
				} else {
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
					case 'k6cp_tradio':
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

		/**
		 * Declare theme customize options
		 *
		 * @k6hook `k6_customize_get_options`
		 *
		 * @since  0.0.1
		 */
		public static function get_bootstrap_options() {
			if ( class_exists( 'K6CPP_Bootstrap' ) ) {
				$bootstrap_options = (array) K6CPP_Bootstrap::get_options();
			} else {
				$bootstrap_options = array();
			}
			return (array) apply_filters( 'k6cp/customize/get_bootstrap_options', $bootstrap_options );
		}

		/**
		 * Declare theme customize options
		 *
		 * @k6hook `k6_customize_get_options`
		 *
		 * @since  0.0.1
		 */
		public static function get_options() {
			$bootstrap_options = self::get_bootstrap_options();
			$theme_options = (array) apply_filters( 'k6cp/customize/get_theme_options', array() );
			return apply_filters( 'k6cp/customize/get_options', array_merge( $bootstrap_options, $theme_options ) );
		}

		/**
		 * Name of DB entry under which options are stored if 'type' => 'option'
		 * is used for Theme Customizer settings
		 *
		 * @since 0.0.1
		 * @return [type] [description]
		 */
		public static function set_options_prefix() {
			self::$OPTIONS_PREFIX = K6CP::SHORTNAME; // k6doubt 'theme_mods_' . get_option( 'stylesheet' ) . '_style'; \\
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

							// set default value on options defaults
							self::$DEFAULTS[ $setting['id'] ] = $setting['default'];

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
	K6CP_Customize::get_instance();

endif;
