<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'K6CP_Customize_Compiler' ) ):

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

	class K6CP_Customize_Compiler {

		/**
		 * Description for public
		 * @var unknown
		 */
		public static $COMPILER_VARIABLES_NAMES = array();

		/**
		 * Description for public
		 * @var unknown
		 */
		public static $COMPILER_VARIABLES_NAMES_COLOR = array();

		/**
		 * Description for public
		 * @var unknown
		 */
		public static $COMPILER_VARIABLES_NAMES_SIZE = array();

		/**
		 * Constructor
		 *
		 * @since  0.0.1
		 */
		public function __construct() {

			// require_once( __DIR__ . '/k6cp-functions-sanitize.php' );
			// require_once( __DIR__ . '/class-k6cp-preprocessor-less.php' );

			add_action( 'k6cp/customize/init', array( __CLASS__, 'init' ) );
			add_action( 'k6cp/customize/each_option', array( __CLASS__, 'use_option' ) );
			add_filter( 'k6cp/customize/js_constants', array( __CLASS__, 'add_to_js_constants' ) );
			add_filter( 'k6cp/customize/js_l10n', array( __CLASS__, 'add_to_js_l10n' ) );
			add_action( 'k6cp/customize/preview_init' , array( __CLASS__, 'inject_js_preview' ) );

			// k6tocheck add_action( 'start_previewing_theme', array( $this, 'on_start_preview' ) ); \\
			add_action( 'admin_init', array( __CLASS__, 'compile_css_after_preview' ) );
			// add_action( 'stop_previewing_theme', array( $this, 'compile_css_after_preview' ) ); // k6doubt \\

			add_filter( 'style_loader_tag', array( __CLASS__, 'allow_enqueue_less_styles' ), 5, 2 );

			add_action( 'admin_init', array( __CLASS__, 'maybe_create_default_css' ) );

			add_action( 'customize_save_after', array( __CLASS__, 'maybe_create_default_css' ) );
			// k6doubt add_action( 'customize_save_after', array( $this, 'compile_css' ) ); // use this or the less.js result sent through ajax \\

			add_action( 'k6cp/customize/import', array( __CLASS__, 'compile_css' ) );
		}

		public static function init() {
			do_action( 'k6cp/customize/compiler/init' );
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
		 * After action save on customize tool
		 * we recompile the style also with the php compiler.
		 * Since we dequeued the style to leave space to the js compilation
		 * we need to add it to the global $wp_styles manually.
		 * Pass true to force the recompilation and the new saved variables.
		 *
		 * @since  0.0.1
		 */
		public static function compile_css() {
			global $wp_styles;
			$wp_styles = new WP_Styles();
			$wp_styles->add( K6CP::SHORTNAME . '-theme', K6CP::$_ASSETS . 'styles/theme.less' );
			$variables = self::get_preprocessor_variables();
			if ( class_exists( 'K6CP_Preprocessor_Less' ) ) {
				K6CP_Preprocessor_Less::get_instance()->process_stylesheet( K6CP::SHORTNAME . '-theme', true, $variables );
			}
			// k6todo k6doubt
			// // maybe here we need to clear the cache managed by some
			// // plugins like w3totalcache (see here: http://wordpress.stackexchange.com/a/7122)
			// $w3_plugin_totalcache->flush_all();
			// // and maybe also clear the cache of twig / timber
			// $loader = new TimberLoader();
			// $loader->clear_cache_timber();
			// $loader->clear_cache_twig();
			// echo 'ciao timber cache';
			// var_dump($loader); \\
		}

		/**
		 * Compile CSS with php compiler after theme
		 * preview.
		 *
		 * @since  0.0.1
		 */ // k6doubt not sure if this needs to be done this way \\
		public static function compile_css_after_preview() {
			if ( isset( $_GET['activated'] ) && isset( $_GET['previewed'] ) ) { // input var okay
				self::compile_css();
			}
		}

		/**
		 * Returns the preprocessor configuration from the db,
		 * populate the customization object with well formed var names and values
		 *
		 * @since  0.0.1
		 */
		private static function get_parsed_variables() {
			$preprocessorCustomization = array();
			$variables = self::get_preprocessor_variables();
			foreach ( $variables as $key => $value ) {
				$varName = '@' . $key;
				$preprocessorCustomization[ $varName ] = K6CP::get_option( $key );
			}
			return $preprocessorCustomization;
		}

		/**
		 * Get filename of the exported settings .json file
		 * A timestamp needs to be appended
		 * @return [string] The default filename's beginning of the file with exported settings
		 */
		public static function get_base_export_filename() {
			return get_bloginfo( 'name' ) . '--theme-' . get_option( 'stylesheet' ) . '-settings';
		}

		public static function add_to_js_constants() {
			return array(
				'CUSTOMIZATION_ON_LOAD' => self::get_parsed_variables(),
				'WORKER_URL' => plugins_url( 'assets/customize-worker.min.js', K6CP_PLUGIN_FILE ),
				// 'UNCOMPILED_STYLESHEET_URL' => K6CP::$_ASSETS . 'styles/', // k6todo
				'UNCOMPILED_STYLESHEET' => self::get_uncompiled_stylesheet_content(),
				'COMPILER_VARIABLES_NAMES_SIZE' => self::$COMPILER_VARIABLES_NAMES_SIZE,
				'COMPILER_VARIABLES_NAMES_COLOR' => self::$COMPILER_VARIABLES_NAMES_COLOR,
				'PREPROCESSOR_URL' => plugins_url( 'assets/less.min.js', K6CP_PLUGIN_FILE ),
				'PREPROCESSOR_WORKER_URL' => plugins_url( 'assets/less-worker.min.js', K6CP_PLUGIN_FILE ),
				// 'PREPROCESSOR_MATH_FUNCTIONS' => K6CP_Customize_Preprocessor::$LESS_MATH_FUNCTIONS,
				// 'PREPROCESSOR_COLOR_SIMPLE_FUNCTIONS' => self::$PREPROCESSOR_COLOR_SIMPLE_FUNCTIONS,
			);
		}

		public static function add_to_js_l10n() {
			return array(
				'compile' => __( 'Update CSS', 'pkgTextdomain' ),
				'compiling' => __( 'Updating CSS ...', 'pkgTextdomain' ),
				'compiled' => __( 'No CSS to update', 'pkgTextdomain' ),
				'liveCSS' => __( 'Live CSS', 'pkgTextdomain' ),
			);
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
		 * Is live compiling automatic
		 *
		 * @k6hook `k6_customize_is_compiling_automatic`
		 *
		 * @since  0.0.1
		 * @return  boolean Wether live compiling is automatic (true) or manual (false)
		 */
		public static function is_compiling_automatic() {
			return (bool) apply_filters( 'k6_customize_is_compiling_automatic', K6CP::get_option( 'live-compiling' ) );
		}

		/**
		 * This outputs the javascript needed in the iframe
		 * and manage the dequeuing / enqueuing of the stylesheets
		 *
		 * @since  0.0.1
		 */
		public static function inject_js_preview() {
			add_action( 'wp_head', self::enqueue_less_file() );
			add_action( 'wp_enqueue_scripts', array( __CLASS__, 'remove_theme_css' ) );
			// wp_enqueue_script( 'k6cp-customize-preview-compiler', plugins_url( 'assets/customize-preview-compiler.min.js', K6CP_PLUGIN_FILE ), array( 'jquery', 'customize-preview', 'k6cp-customize-preview' ), K6CP::VERSION, true ); // k6anticache \\
		}

		/**
		 * Remove the less file compiled to .css
		 * which, if loaded, would interfere with
		 * the live compiled less
		 *
		 * @since  0.0.1
		 */
		public static function remove_theme_css() {
			if ( self::is_compiling_automatic() ) {
				wp_dequeue_style( 'k6-theme' );
				wp_deregister_style( 'k6-theme' );
			}
		}

		/**
		 * Enqueue the uncompiled less file
		 *
		 * @since  0.0.1
		 */
		public static function enqueue_less_file() {
			wp_enqueue_style( 'k6-theme-less', K6CP::$_ASSETS . 'styles/theme.less', array(), K6CP::VERSION ); // k6anticache \\
		}

		/**
		 * Tweak WordPress style loader to accept
		 * less files changing accordingly the attributes
		 *
		 * @link( http://wordpress.stackexchange.com/a/116768/25398, thanks to)
		 * @global $wp_styles;
		 * @param string $tag    The link tag for the enqueued style.
		 * @param string $handle The style's registered handle.
		 * @return string
		 */
		public static function allow_enqueue_less_styles( $style_tag, $handle ) {
			global $wp_styles;

			$obj = $wp_styles->query( $handle );
			if ( false === $obj ) {
				return $style_tag;
			}
			if ( ! preg_match( '/\.less$/U', $obj->src ) ) {
				return $style_tag;
			}

			// the current stylesheet is a LESS stylesheet, so make according changes
			$rel = isset( $obj->extra['alt'] ) && $obj->extra['alt'] ? 'alternate stylesheet' : 'stylesheet';
			$style_tag = str_replace( "rel='" . $rel . "'", "rel='stylesheet/less'", $style_tag );
			$style_tag = str_replace( "id='" . $handle . "-css'", "id='" . $handle . "-less'", $style_tag );
			return $style_tag;
		}

		/**
		 * Get the path of the default CSS file
		 * to enqueue on load and in case of problems // k6doubt which problems? think about it \\
		 *
		 * @since  0.0.1
		 *
		 * @return [string] The path of the default CSS file
		 */
		public static function get_css_default_path() {
			return  ''; // self::$_ASSETS . 'theme-default.min.css';
		}

		/**
		 * Create Default CSS on theme activate
		 *
		 * @since  0.0.1
		 */
		public static function maybe_create_default_css() {
			self::write_file( null, self::get_css_default_path() );
		}

		/**
		 * [get_css_path description]
		 * Regarding Multisite: wp_upload_dir() already return a site_id
		 * specific upload directory, so there's no need to make the CSS
		 * filename more specific.
		 *
		 * @since  0.0.1
		 *
		 * @param  [string] $dir_or_url  Wether to output the path as `dir` or `uri`
		 * @param  [bool] $with_filename Wether to include the filename in the output
		 * @return [string]              The path as `dir` or `uri`
		 */
		public static function get_css_path( $dir_or_url, $with_filename ) {
			$theme_name = get_option( 'stylesheet' );
			$upload = wp_upload_dir();
			$upload = $dir_or_url == 'dir' ? $upload['basedir'] : $upload['baseurl'];
			$css_folder = trailingslashit( $upload ) . 'theme-' . $theme_name;

			if ( $with_filename ) {
				return trailingslashit( $css_folder ) . 'theme.min.css';
			} else {
				return trailingslashit( $css_folder );
			}
		}

		/**
		 * Write File
		 *
		 * @link(WordPress Docs about Filesystem API, http://codex.wordpress.org/Filesystem_API)
		 * @since  0.0.1
		 *
		 * @param  [string] $content      CSS as string
		 * @param  [string] $content_path The path of the file where to extract content
		 */
		private static function write_file( $content, $content_path ) {
			$url = wp_nonce_url( 'themes.php?page=example','example-theme-options' );
			if ( false === ($creds = request_filesystem_credentials( $url, '', false, false, null ) ) ) {
				return; // stop processing here
			}
			// now we have some credentials, try to get the wp_filesystem running
			if ( ! WP_Filesystem( $creds ) ) {
				request_filesystem_credentials( $url, '', true, false, null );
				return;
			}

			global $wp_filesystem;

			// get content directly or from path
			$css_content = $content_path ? $wp_filesystem->get_contents( $content_path ) : $content;

			$css_path_complete = self::get_css_path( 'dir', true );

			// update the file
			if ( $content ) {
				// create folder and save default css if file doesn't exist yet
				if ( ! $wp_filesystem->exists( $css_path_complete ) ) {
					$wp_filesystem->mkdir( self::get_css_path( 'dir', false ) );
				}
				$wp_filesystem->put_contents( $css_path_complete, $content, FS_CHMOD_FILE );
			}
			// copy default file
			else if ( $content_path ) {
				// create folder and save default css if file doesn't exist yet
				if ( ! $wp_filesystem->exists( $css_path_complete ) ) {
					$wp_filesystem->put_contents( $css_path_complete, $wp_filesystem->get_contents( $content_path ), FS_CHMOD_FILE );
				}
			}
		}

		/**
		 * Save the CSS compiled by less.js
		 *
		 * About the problem with magic quotes and the $_POST variable
		 * see here: http://stackoverflow.com/questions/2496455/why-are-post-variables-getting-escaped-in-php
		 *
		 * @since  0.0.1
		 */
		public static function save_css() {
			if ( empty( $_POST['style'] ) ) { // input var okay
				wp_send_json_success( __( 'no CSS provided', 'pkgTextdomain' ) );
			} else {
				// $compiled_css = wp_filter_nohtml_kses( $_POST['style'] ); // k6todo think about how to do some kind of sanitization \\
				// $compiled_css = stripslashes( wp_filter_nohtml_kses( stripslashes( $_POST['style'] ) ) );
				// $compiled_css = wp_kses( stripslashes( $_POST['style'] ), array( '\\' => array(), '>' => array(), '\"' => array() ) );
				$compiled_css = stripslashes( $_POST['style'] ); // input var okay
				// $compiled_css = $_POST['style'];

				// k6todo the problem is that css save doesn't work when previewing
				// the theme and click on "save & activate"
				// maybe here we should fall back to less.php
				// try {
				//   file_put_contents( self::get_css_path( 'dir', true ), $compiled_css );
				// } catch (Exception $e) {
				//   self::write_file( $compiled_css, null );
				// } \\
				self::write_file( $compiled_css, null );

				wp_send_json_success( __( 'CSS saved', 'pkgTextdomain' ) );
			}
			die(); // this is required to terminate immediately and return a proper response
		}

		// add default arguments to don't break
		public static function use_option( $setting=array( 'id' => '', 'transport' => '' ) , $control=array( 'type' => '' ) ) {
			// if transport indicates that needs to recompile css push it on less variables names array
			if ( in_array( $setting['transport'], array( 'recompile', 'recompileAndPost', 'recompileLater', 'recompileRefresh' ) ) ) {
				array_push( self::$COMPILER_VARIABLES_NAMES, $setting['id'] );

				// if we have a size set it on sizes variables array
				if ( in_array( $control['type'], array( 'k6_size', 'k6_slider', 'k6_number' ) ) ) {
					array_push( self::$COMPILER_VARIABLES_NAMES_SIZE, $setting['id'] );
				}
				// if we have a color set it on colors variables array
				if ( in_array( $control['type'], array( 'color', 'k6_color' ) ) ) {
					array_push( self::$COMPILER_VARIABLES_NAMES_COLOR, $setting['id'] );
				}
			}
		}

		// /**
		//  * Setup CSS preprocessor compiler.
		//  * Manage integration between options and css compilation
		//  *
		//  * @since 0.0.1
		//  */
		// public static function setup_preprocessor() {
		// 	$preprocessor = K6CP_Preprocessor_Less::get_instance();
		// 	$preprocessor->set_upload_uri( self::get_css_path( 'uri', false ) );
		// 	$preprocessor->set_upload_dir( self::get_css_path( 'dir', false ) );
		// 	$preprocessor->set_variables( self::get_preprocessor_variables() );
		// 	$preprocessor->set_variable( 'lesscompiler', 'php' );
		// 	// $preprocessor->set_compilation_strategy( self::get_option( 'css-compilation-strategy' ) ); TODO
		// }

		/**
		 * [get_preprocessor_variables description]
		 *
		 * @since 0.0.1
		 * @return [type] [description]
		 */
		public static function get_preprocessor_variables() {
			$options = wp_parse_args( array(), K6CP_Customize::$DEFAULTS ); // get_theme_mods
			return array_intersect_key( $options, array_flip( self::$COMPILER_VARIABLES_NAMES ) );
		}
	}

	// Instantiate
	// K6CP_Customize_Compiler::get_instance();
	new K6CP_Customize_Compiler();

endif;
