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
		 * Description for public
		 * @var unknown
		 */
		public static $PREPROCESSOR_VARIABLES_NAMES;

		/**
		 * Description for public
		 * @var unknown
		 */
		public static $PREPROCESSOR_VARIABLES_NAMES_SIZE;

		/**
		 * Description for public
		 * @var unknown
		 */
		public static $PREPROCESSOR_VARIABLES_NAMES_COLOR;

		/**
		 * Less math functions
		 *
		 * The following functions must be supported by
		 * oth the js and the php less parsers // k6tobecareful \\
		 *
		 * @see  http://lesscss.org/functions/#math-functions
		 * @var array
		 */
		public static $LESS_MATH_FUNCTIONS = array(
			'ceil',
			'floor',
			'integer',
			'percentage',
			'round',
			'sqrt',
			'abs',
			'sin',
			'asin',
			'cos',
			'acos',
			'tan',
			'atan',
			'pi',
			'pow',
			'mod',
			'min',
			'max',
		);

		/**
		 * Preprocessor color simple functions
		 *
		 * Functions with two arguments: `color`, `amount`.
		 * Only these functions are controllable through the `dyanmic`
		 * color `friendly` interface. All the others functions are
		 * still available through the `expression` input text.
		 *
		 * @var array
		 */
		public static $PREPROCESSOR_COLOR_SIMPLE_FUNCTIONS = array(
			'saturate',
		  'desaturate',
		  'lighten',
		  'darken',
		  'fadein',
		  'fadeout',
		  'fade',
		  'spin',
		  // 'mix',
		  // 'greyscale',
		  // 'contrast',
		);

		/**
		 * Less color operation functions
		 *
		 * The following functions must be supported by
		 * oth the js and the php less parsers // k6tobecareful \\
		 *
		 * @see  http://lesscss.org/functions/#color-operation
		 * @var array
		 */
		public static $LESS_COLOR_OPERATION_FUNCTIONS = array(
			'saturate',
		  'desaturate',
		  'lighten',
		  'darken',
		  'fadein',
		  'fadeout',
		  'fade',
		  'spin',
		  'mix',
		  'greyscale',
		  'contrast',
		);

		/**
		 * Less color blending functions
		 *
		 * The following functions must be supported by
		 * both the js and the php less parsers // k6tobecareful \\
		 *
		 * @see  http://lesscss.org/functions/#color-blending
		 * @var array
		 */
		public static $LESS_COLOR_BLENDING_FUNCTIONS = [
		  'multiply',
		  'screen',
		  'overlay',
		  'softlight',
		  'hardlight',
		  'difference',
		  'exclusion',
		  'average',
		  'negation'
		];

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

			require_once( __DIR__ . '/k6-functions-sanitize.php' );
			require_once( __DIR__ . '/class-k6-preprocessor.php' );

			self::set_options_prefix();
			self::set_options();
			self::setup_preprocessor();

			add_action( 'admin_menu', array( $this, 'clean_admin_menu' ) );

			// k6tocheck add_action( 'start_previewing_theme', array( $this, 'on_start_preview' ) ); \\
			add_action( 'admin_init', array( $this, 'compile_css_after_preview' ) );
			// add_action( 'stop_previewing_theme', array( $this, 'compile_css_after_preview' ) ); // k6doubt \\

			add_filter( 'style_loader_tag', array( $this, 'allow_enqueue_less_styles' ), 5, 2 );

			add_action( 'admin_init', array( $this, 'maybe_create_default_css' ) );
			add_action( 'customize_register', array( $this, 'add_custom_classes' ) );
			// add_action( 'customize_register', array( $this, 'change_wp_defaults' ) ); TODO
			add_action( 'customize_register', array( $this, 'add_panels' ) );
			add_action( 'customize_controls_print_styles', array( $this, 'inject_css_admin' ) );
			add_action( 'customize_controls_print_styles', array( $this, 'inject_js_shims' ) );
			add_action( 'customize_controls_print_scripts', array( $this, 'print_templates' ) );
			add_action( 'customize_controls_print_footer_scripts', array( $this, 'print_template_loader' ) );
			add_action( 'customize_controls_print_footer_scripts' , array( $this, 'inject_js_admin' ) );
			add_action( 'customize_preview_init' , array( $this, 'inject_js_preview' ) );
			add_action( 'customize_save_after', array( $this, 'maybe_create_default_css' ) );
			// k6doubt add_action( 'customize_save_after', array( $this, 'compile_css' ) ); // use this or the less.js result sent through ajax \\

			add_action( 'wp_ajax_k6_save_css', array( $this, 'save_css' ) );
			add_action( 'wp_ajax_k6_export', array( $this, 'export_settings' ) );
			add_action( 'admin_post_k6_import', array( $this, 'import_settings' ) );
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
		public function compile_css() {
			global $wp_styles;
			$wp_styles = new WP_Styles();
			$wp_styles->add( K6::SHORTNAME . '-theme', K6::$_ASSETS . 'styles/theme.less' );
			$variables = K6::get_preprocessor_variables();
			if ( class_exists( 'K6CP_Preprocessor_Less' ) ) {
				K6CP_Preprocessor_Less::get_instance()->process_stylesheet( K6::SHORTNAME . '-theme', true, $variables );
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
		public function compile_css_after_preview() {
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
		private static function get_parsed_less_variables() {
			$preprocessorCustomization = array();
			$variables = self::get_preprocessor_variables();
			foreach ( $variables as $key => $value ) {
				$varName = '@' . $key;
				$preprocessorCustomization[ $varName ] = K6::get_option( $key );
			}
			return $preprocessorCustomization;
		}

		/**
		 * Outputs the custom css file
		 * in the admin page of the customize
		 *
		 * @since  0.0.1
		 */
		public function inject_css_admin() {
			wp_enqueue_style( 'k6-customize', K6::$_ASSETS . 'customize.min.css', array(), K6::VERSION ); // k6anticache \\ // k6trial wp_enqueue_script( 'k6-customize-preview', K6::$_ASSETS . 'jquery-velocity-patch.js?'.time().'='.mt_rand(), array( 'jquery' ), K6::VERSION ); // k6anticache k6temp \\
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
		public function inject_js_admin() {
			wp_register_script( 'k6-customize', K6::$_ASSETS . 'customize.min.js', array( 'json2', 'underscore', 'jquery' ), K6::VERSION, false ); // k6anticache \\
			wp_localize_script( 'k6-customize', 'K6', array(
					'constants' => array(
						'CUSTOMIZATION_ON_LOAD' => self::get_parsed_less_variables(),
						'VARS_NAMES_SIZE' => self::$PREPROCESSOR_VARIABLES_NAMES_SIZE,
						'VARS_NAMES_COLOR' => self::$PREPROCESSOR_VARIABLES_NAMES_COLOR,
						'WORKER_URL' => K6::$_ASSETS . 'customize-worker.min.js',
						'UNCOMPILED_STYLESHEET_URL' => K6::$_ASSETS . 'styles/',
						'UNCOMPILED_STYLESHEET' => self::get_uncompiled_stylesheet_content(),
						'PREPROCESSOR_URL' => K6::$_ASSETS . 'less.min.js',
						'PREPROCESSOR_WORKER_URL' => K6::$_ASSETS . 'less-worker.min.js',
						'PREPROCESSOR_MATH_FUNCTIONS' => self::$LESS_MATH_FUNCTIONS,
						'PREPROCESSOR_COLOR_SIMPLE_FUNCTIONS' => self::$PREPROCESSOR_COLOR_SIMPLE_FUNCTIONS,
						'FONT_FAMILIES' => k6_sanitize_font_families( self::$FONT_FAMILIES ),
						'BREAKPOINTS' => array(
							array( 'name' => 'xs', 'size' => 480 ), // k6todo, retrieve these from less options \\
							array( 'name' => 'sm', 'size' => 768 ),
							array( 'name' => 'md', 'size' => 992 ),
							array( 'name' => 'lg', 'size' => 1200 ),
						),
					),
					'options' => array(
						'liveCompiling' => self::is_compiling_automatic(),
						'advanced' => self::is_compiling_automatic(), // k6todo \\
						'dev' => self::is_compiling_automatic(), // k6todo \\
					),
					'l10n' => array(
						'compile' => __( 'Update CSS', 'pkgTextdomain' ),
						'compiling' => __( 'Updating CSS ...', 'pkgTextdomain' ),
						'compiled' => __( 'No CSS to update', 'pkgTextdomain' ),
						'liveCSS' => __( 'Live CSS', 'pkgTextdomain' ),
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
					)
				) );
			wp_enqueue_script( 'k6-customize' );
		}

		/**
		 * Get theme main less file content
		 *
		 * @link( http://stackoverflow.com/a/19510664/1938970, strip spaces)
		 * @link( http://stackoverflow.com/a/15123777/1938970, strip comments (customized))
		 * @return string The theme.less file as a string (we pass it to the web worker)
		 */
		public static function get_uncompiled_stylesheet_content() {
			$response = wp_remote_get( K6::$_ASSETS . 'styles/theme.less' );
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
			return (bool) apply_filters( 'k6_customize_is_compiling_automatic', K6::get_option( 'live-compiling' ) );
		}

		/**
		 * This outputs the javascript needed in the iframe
		 * and manage the dequeuing / enqueuing of the stylesheets
		 *
		 * @since  0.0.1
		 */
		public function inject_js_preview() {
			add_action( 'wp_head', array( $this, 'enqueue_less_file' ) );
			add_action( 'wp_enqueue_scripts', array( $this, 'remove_theme_css' ) );
			wp_enqueue_script( 'k6-customize-preview', K6::$_ASSETS . 'customize-preview.min.js?'.time().'='.mt_rand(), array( 'jquery', 'customize-preview' ), K6::VERSION, true ); // k6anticache \\
		}

		/**
		 * Remove the less file compiled to .css
		 * which, if loaded, would interfere with
		 * the live compiled less
		 *
		 * @since  0.0.1
		 */
		public function remove_theme_css() {
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
		public function enqueue_less_file() {
			wp_enqueue_style( 'k6-theme-less', K6::$_ASSETS . 'styles/theme.less', array(), K6::VERSION ); // k6anticache \\
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
		public function allow_enqueue_less_styles( $style_tag, $handle ) {
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
		 * [print_template_loader description]
		 *
		 * @since  0.0.1
		 * @return [type] [description]
		 */
		public static function print_template_loader() { // k6wptight-layout \\
		?>
			<div id="k6-loader" class="wp-full-overlay-main k6-full-overlay">
				<div class="k6-u-midpoint-wrap">
					<div class="k6-u-midpoint">
						<img src="<?php echo includes_url( '/images/wlw/wp-watermark.png' ) ?>">
						<?php if ( isset ( $_GET['k6_import'] ) ): // input var okay ?>
							<h1 id="k6-title" class="k6-text"><?php _e( 'Import done', 'pkgTextdomain' ); ?></h1>
							<h3 id="k6-text" class="k6-text"><?php _e( 'All options have been succesfully imported and saved', 'pkgTextdomain' ); ?></h3>
						<?php else : ?>
							<h1 id="k6-title" class="k6-text"><?php _e( 'Customize', 'pkgTextdomain' ); ?></h1>
							<h3 id="k6-text" class="k6-text"><?php _e( 'Welcome to the customize tool', 'pkgTextdomain' ); ?></h3>
						<?php endif; ?>
						<div class="k6-text">
							<span class="spinner"></span>
							<?php _e( 'Loading ...', 'pkgTextdomain' ); ?>
						</div>
					</div>
				</div>
			</div>
			<?php
		}

		/**
		 * [inject_js_shims description]
		 *
		 * @since  0.0.1
		 */
		public static function inject_js_shims() {
	?><!--[if lt IE 9]><script src="<?php echo esc_url( K6::$_ASSETS . 'es5-shim.min.js' ); ?>"></script><![endif]-->
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
			<script id="k6-export-tpl" type="text/template">
				<li id="k6-export" class="accordion-section control-section k6-tools-section">
					<h3 class="accordion-section-title">
						<i class="dashicons dashicons-download"></i> <?php _e( 'Export Settings', 'pkgTextdomain' ); ?>
					</h3>
					<ul class="accordion-section-content">
						<li class="customize-control k6-control">
							<p><?php _e( 'Export the theme settings for this site as a .json file. This allows you to easily import the configuration into another site.', 'pkgTextdomain' ); ?></p>
							<label>
								<span class="customize-control-title"><?php _e( 'Filename', 'pkgTextdomain' ); ?></span>
								<input id="k6-export-name" type="text" name="export_filename" value="<?php echo self::get_base_export_filename(); ?>">
							</label>
							<p class="description customize-section-description"><?php _e( 'You can change the filename of the exported settings (a timestamp will be appended)', 'pkgTextdomain' ); ?></p>
							<p>
								<?php submit_button( __( 'Export & Download', 'pkgTextdomain' ), 'primary', 'submit', false, array( 'id' => 'k6-export-btn' ) ); ?>
							</p>
							<p><textarea id="k6-export-textarea" class="k6-textarea" name="export_textarea" rows="5" onclick="this.focus();this.select()" readonly="readonly"></textarea></p>
							<p id="k6-export-copied"><?php _e( 'Copied', 'pkgTextdomain' ); ?></p>
						</li>
					</ul>
				</li>
			</script>
			<script id="k6-import-tpl" type="text/template">
				<li id="k6-import" class="accordion-section control-section k6-tools-section">
					<h3 class="accordion-section-title">
						<i class="dashicons dashicons-upload"></i> <?php _e( 'Import Settings', 'pkgTextdomain' ); ?>
					</h3>
					<ul class="accordion-section-content">
						<li class="customize-control k6-control">
							<p><?php _e( 'Import the theme settings from a .json file. This file can be obtained by exporting the settings on another site using the section above.', 'pkgTextdomain' ); ?></p>
							<form id="k6-import-form" action="<?php echo admin_url( 'admin-post.php' ); ?>" method="POST" enctype="multipart/form-data">
								<p><input id="k6-import-input" type="file" name="import"></p>
								<label for="k6-import-textarea"><?php _e( 'Or paste the settings here:', 'pkgTextdomain' ); ?><label>
								<p><textarea id="k6-import-textarea" class="k6-textarea" name="import_textarea" rows="5" placeholder="<?php _e( 'Paste here ...', 'pkgTextdomain' ); ?>" onclick="this.focus();this.select()"></textarea></p>
								<div class="k6-if-filereader">
									<button id="k6-import-preview" class="button button-primary "><?php _e( 'Unload preview', 'pkgTextdomain' ); ?></button>
									<span class="spinner"></span>
									<p id="k6-import-warning"><?php _e( 'To save just use the <b>Save & Publish</b> button above.', 'pkgTextdomain' ); ?> <strong><?php _e( 'Careful, it will overwrite all existing options values.', 'pkgTextdomain' ); ?></strong></p>
								</div>
								<div class="k6-if-no-filereader">
									<p><strong><?php _e( 'WARNING! This will overwrite all existing options values, please proceed with caution!', 'pkgTextdomain' ); ?></strong></p>
									<?php submit_button( __( 'Import', 'pkgTextdomain' ), 'primary', 'submit', false, array( 'id' => 'k6-import-save' ) ); ?>
									<span class="spinner k6-show-on-loading"></span>
									<?php wp_nonce_field( 'k6_import', 'k6_import_nonce' ); ?>
									<input type="hidden" name="action" value="k6_import">
								</div>
							</form>
						</li>
					</ul>
				</li>
			</script>
			<script id="k6-advanced-tpl" type="text/template">
				<li id="k6-advanced" class="customize-control k6-control k6-tools-section">
					<label>
						<span class="customize-control-title"><?php _e( 'Advanced mode', 'pkgTextdomain' ); ?></span>
						<input id="k6-advanced-input" type="checkbox" name="_customize-k6_advanced_controls" value="1" checked>
						<?php _e( 'When advanced mode is enabled you will have a more granular control on every setting of the theme', 'pkgTextdomain' ); ?>
					</label>
				</li>
			</script>
			<script id="k6-support-tpl" type="text/template">
				<?php $theme = wp_get_theme(); ?>
				<li id="k6-support" class="accordion-section control-section k6-tools-section">
					<h3 class="accordion-section-title">
						<i class="dashicons dashicons-sos"></i> <?php _e( 'Support', 'pkgTextdomain' ); ?>
					</h3>
					<ul class="accordion-section-content">
						<li class="customize-control k6-control">
							<h3><?php _e( 'About', 'pkgTextdomain' ); ?></h3>
							<p><?php _e( 'Theme', 'pkgTextdomain' ); ?>: <b><?php echo $theme->Name ?></b> | v<b><?php echo $theme->Version ?></b><br>
							<?php _e( 'Author', 'pkgTextdomain' ); ?>: <b><a href="<?php echo $theme->{'Author URI'}; ?>" title="View the author's website" target="_blank">k6</a></b><br>
							<?php _e( 'Released on', 'pkgTextdomain' ); ?>: <b>Mar 14, 2015</b></p> // k6todoTxt \\
							<h3><?php _e( 'Contact and Social', 'pkgTextdomain' ); ?></h3>
							<p><?php _e( 'Website', 'pkgTextdomain' ); ?>: <b><a href="<?php echo $theme->{'Author URI'}; ?>" target="_blank">kunderikuus.net</a></b><br>
								<?php _e( 'Mail', 'pkgTextdomain' ); ?>: <b><a href="mailto:k6@kunderikuus.net" title="Contact the author" target="_blank">info@kunderikuus.net</a></b></p>
						</li>
					</ul>
				</li>
			</script>
			<?php
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
		public function maybe_create_default_css() {
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
						self::compile_css();
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

			// Move title_tagline section and change nmae
			$section_title_tagline = $wp_customize->get_section( 'title_tagline' );
			$wp_customize->remove_section( 'title_tagline' );
			$wp_customize->get_setting( 'blogname' )->transport = 'postMessage';
			$wp_customize->get_setting( 'blogdescription' )->transport = 'postMessage';
			$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';
			$section_title_tagline->panel = K6::SHORTNAME . '-content'; // k6tobecareful \\
			$wp_customize->add_section( $section_title_tagline );

			// Move nav section and change nmae
			$section_nav = $wp_customize->get_section( 'nav' );
			$wp_customize->remove_section( 'nav' );
			$section_nav->title = __( 'Menu Navigation', 'pkgTextdomain' );
			$section_nav->panel = K6::SHORTNAME . '-layout'; // k6tobecareful \\
			$wp_customize->add_section( $section_nav );

			// Move background_image section
			$section_custom_background = $wp_customize->get_section( 'background_image' );
			$wp_customize->remove_section( 'background_image' );
			$section_custom_background->panel = K6::SHORTNAME . '-layout'; // k6tobecareful \\
			$wp_customize->add_section( $section_custom_background );

			// Move header_image section
			$section_header_image = $wp_customize->get_section( 'header_image' );
			$wp_customize->remove_section( 'header_image' );
			$section_header_image->panel = K6::SHORTNAME . '-layout'; // k6tobecareful \\
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
		 */
		public static function add_custom_classes( $wp_customize ) {

			require __DIR__ . '/customize-classes.php';

			$wp_customize->register_control_type( 'K6CP_Customize_Control_Buttonset' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Color' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Font_Family' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Layout_Columns' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Multicheck' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Number' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Radio' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Radio_Image' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Select' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Size' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Slider' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Text' );
			$wp_customize->register_control_type( 'K6CP_Customize_Control_Toggle' );

			// k6todo k6tobecareful-api is changing
			// Add search section
			// $wp_customize->add_section( new K6CP_Customize_Section_Search( $wp_customize, 'k6_search', array( 'priority' => 99999 ) ) );
			// $wp_customize->add_setting( new K6CP_Customize_Setting_Dummy( $wp_customize, 'searchable' ) );
			// $wp_customize->add_control('searchable', array( 'section' => 'k6_search' ));
			// \\
		}

		/**
		 * [add_panels description]
		 *
		 * @since  0.0.1
		 * @param {WP_Customize_Manager} $wp_customize Theme Customizer object
		 */
		public static function add_panels( $wp_customize ) {
			// Get all the fields using a helper function
			$panels = self::get_options();

			// Use a short prefix for the panels' id
			$panel_prefix = K6::SHORTNAME;

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

				self::add_sections( $panel_id, $panel['sections'], $wp_customize );
			}
		}

		/**
		 * [add_sections description]
		 *
		 * @since  0.0.1
		 * @param [type]  $panel_fields     [description]
		 * @param [type]  $panel_id     [description]
		 * @param {WP_Customize_Manager} $wp_customize Theme Customizer object
		 */
		private static function add_sections( $panel_id, $panel_fields, $wp_customize ) {
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
				self::add_controls( $section_id, $section['fields'], $wp_customize );
			}
		}

		/**
		 * Add controls
		 *
		 * @since  0.0.1
		 * @param [type]  $section_fields [description]
		 * @param [type]  $section_id    [description]
		 * @param {WP_Customize_Manager} $wp_customize   Theme Customizer object
		 */
		private static function add_controls( $section_id, $section_fields, $wp_customize ) {

			foreach ( $section_fields as $option_id => $option_args ) {

				$control_args = $option_args['c'];
				$setting_args = isset( $option_args['s'] ) ? $option_args['s'] : null;

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
						$setting_args['sanitize_callback'] = 'k6_sanitize_callback';
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
					case 'k6_buttonset':
						$wp_customize->add_control( new K6CP_Customize_Control_Buttonset( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6_color':
						$wp_customize->add_control( new K6CP_Customize_Control_Color( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6_font_family':
						$wp_customize->add_control( new K6CP_Customize_Control_Font_Family( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6_layout_columns':
						$wp_customize->add_control( new K6CP_Customize_Control_Layout_Columns( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6_multicheck':
						$wp_customize->add_control( new K6CP_Customize_Control_Multicheck( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6_number':
						$wp_customize->add_control( new K6CP_Customize_Control_Number( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6_radio':
						$wp_customize->add_control( new K6CP_Customize_Control_Radio( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6_radio_image':
						$wp_customize->add_control( new K6CP_Customize_Control_Radio_Image( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6_select':
						$wp_customize->add_control( new K6CP_Customize_Control_Select( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6_size':
						$wp_customize->add_control( new K6CP_Customize_Control_Size( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6_slider':
						$wp_customize->add_control( new K6CP_Customize_Control_Slider( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6_text':
						$wp_customize->add_control( new K6CP_Customize_Control_Text( $wp_customize, $option_id, $control_args ) );
						break;
					case 'k6_toggle':
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
		public static function get_options() {
			return include apply_filters( 'k6_customize_get_options', __DIR__ . '/customize-options.php' );
		}

		/**
		 * Name of DB entry under which options are stored if 'type' => 'option'
		 * is used for Theme Customizer settings
		 *
		 * @since 0.0.1
		 * @return [type] [description]
		 */
		public static function set_options_prefix() {
			self::$OPTIONS_PREFIX = K6::SHORTNAME; // k6doubt 'theme_mods_' . get_option( 'stylesheet' ) . '_style'; \\
		}

		/**
		 * [set_options description]
		 *
		 * @link http://wordpress.stackexchange.com/questions/28954/how-to-set-the-default-value-of-a-option-in-a-theme
		 * @since 0.0.1
		 * @return [type]              [description]
		 */
		public static function set_options() {
			$DEFAULTS = array();
			$PREPROCESSOR_VARIABLES_NAMES = array();
			$PREPROCESSOR_VARIABLES_NAMES_SIZE = array();
			$PREPROCESSOR_VARIABLES_NAMES_COLOR = array();
			$options = self::get_options();

			foreach ( $options as $panel_id => $panel_args ) {
				foreach ( $panel_args['sections'] as $section_id => $section_args ) {
					foreach ( $section_args['fields'] as $setting_id => $option_args ) {

						if ( isset ( $option_args['s'] ) ) {

							$setting_default = $option_args['s']['default'];
							$transport = $option_args['s']['transport'];
							$type = $option_args['c']['type'];

							// set default value on options defaults
							$DEFAULTS[ $setting_id ] = $setting_default;

							// if transport indicates that needs to recompile css push it on less variables names array
							if ( 'recompile' == $transport || 'recompileAndPost' == $transport || 'recompileLater' == $transport || 'recompileRefresh' == $transport ) {
								array_push( $PREPROCESSOR_VARIABLES_NAMES, $setting_id );

								// if we have a size set it on sizes variables array
								if ( 'k6_size' == $type || 'k6_slider' == $type || 'k6_number' == $type ) {
									array_push( $PREPROCESSOR_VARIABLES_NAMES_SIZE, $setting_id );
								}
								// if we have a color set it on colors variables array
								if ( 'color' == $type || 'k6_color' == $type ) {
									array_push( $PREPROCESSOR_VARIABLES_NAMES_COLOR, $setting_id );
								}
							}
						}
					}
				}
			}
			self::$DEFAULTS = $DEFAULTS;
			self::$PREPROCESSOR_VARIABLES_NAMES = $PREPROCESSOR_VARIABLES_NAMES;
			self::$PREPROCESSOR_VARIABLES_NAMES_SIZE = $PREPROCESSOR_VARIABLES_NAMES_SIZE;
			self::$PREPROCESSOR_VARIABLES_NAMES_COLOR = $PREPROCESSOR_VARIABLES_NAMES_COLOR;
		}

		/**
		 * Setup CSS preprocessor compiler.
		 * Manage integration between options and css compilation
		 *
		 * @since 0.0.1
		 */
		private static function setup_preprocessor() {
			$preprocessor = K6CP_Preprocessor_Less::get_instance();
			$preprocessor->set_upload_uri( self::get_css_path( 'uri', false ) );
			$preprocessor->set_upload_dir( self::get_css_path( 'dir', false ) );
			$preprocessor->set_variables( self::get_preprocessor_variables() );
			$preprocessor->set_variable( 'lesscompiler', 'php' );
			// $preprocessor->set_compilation_strategy( self::get_option( 'css-compilation-strategy' ) ); TODO
		}

		/**
		 * [get_preprocessor_variables description]
		 *
		 * @since 0.0.1
		 * @return [type] [description]
		 */
		public static function get_preprocessor_variables() {
			$options = wp_parse_args( array(), self::$DEFAULTS ); // get_theme_mods
			return array_intersect_key( $options, array_flip( self::$PREPROCESSOR_VARIABLES_NAMES ) );
		}
	}

	// Instantiate
	K6CP_Customize::get_instance();

endif;
