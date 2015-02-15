<?php defined( 'ABSPATH' ) or die;

/**
 * Preprocessor CSS class
 *
 * A simplified version of WP-LESS by fabrizim, oncletom
 * @link https://github.com/oncletom/wp-less
 *
 * @package      pkgNamePretty
 * @subpackage   classes
 * @since        0.0.1
 * @link         pkgHomepage
 * @author       pkgAuthorName <pkgAuthorEmail> (pkgAuthorUrl)
 * @copyright    pkgConfigStartYear - pkgConfigEndYear | pkgLicenseType
 * @license      pkgLicenseUrl
 */

// Load the compiler class
if ( ! class_exists( 'lessc' ) ) {
	// require_once dirname( __FILE__ ) . '/vendor/oyejorge/less.php/lessc.inc.php';
	return;
}

if ( ! class_exists( 'K6CP_Preprocessor_Less' ) && class_exists( 'lessc' ) ):

	class K6CP_Preprocessor_Less extends lessc {

		protected $stylesheet,
		$configuration,
		$is_new = true,
		$signature,
		$source_path,
		$source_timestamp,
		$target_path,
		$target_uri;

		public static $upload_dir,
		$upload_uri,
		$formatter = 'compressed';

		/**
		 * Available compilation strategies
		 *
		 * @since 0.0.1
		 * @var array
		 */
		protected $compilation_strategies = array( 'legacy', 'always', 'deep' );

		/**
		 * Current compilation strategy
		 *
		 * @since 0.0.1
		 * @protected
		 * @var string
		 */
		protected $compilation_strategy = 'deep';

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
		 * @since 0.0.1
		 */
		public function __construct() {

			$this->register_hooks();

			// @parent class method
			$this->setFormatter( self::$formatter );
		}

		/**
		 * Method to register hooks (and do it only once)
		 *
		 * @k6hook do_actions within and without admin area
		 * @since 0.0.1
		 */
		protected function register_hooks() {
			is_admin() ? do_action( 'k6-preprocessor-css_init_admin', $this ) : do_action( 'k6-preprocessor-css-init', $this );
			add_action( 'wp_enqueue_scripts', array( $this, 'process_stylesheets' ), 999, 0 );
		}

		/**
		 * Configure paths for the stylesheet
		 * Since this moment, everything is configured to be usable
		 *
		 * @since 0.0.1
		 */
		protected function set_paths() {
			$target_file = $this->compute_target_path();

			$this->source_path = WP_CONTENT_DIR . preg_replace( '#^'.content_url().'#U', '', $this->stylesheet->src );
			$this->target_path = trailingslashit( self::$upload_dir ) . basename( $target_file );
			$this->target_uri = trailingslashit( self::$upload_uri ) . basename( $target_file );

			$this->set_source_timestamp( filemtime( $this->source_path ) );
		}

		/**
		 * Sets the source timestamp of the file
		 * Mostly used to generate a proper cache busting URI
		 *
		 * @since 0.0.1
		 * @param integer $timestamp
		 */
		public function set_source_timestamp( $timestamp ) {
			$this->source_timestamp = $timestamp;
		}

		/**
		 * Registers a set of functions
		 *
		 * @param array   $functions
		 */
		public function register_functions( array $functions = array() ) {
			foreach ( $functions as $name => $args ) {
				// @parent class method
				$this->registerFunction( $name, $args['callback'] );
			}
		}

		/**
		 * Returns available variables
		 *
		 * @since 0.0.1
		 * @return array Already defined variables
		 */
		public function get_variables() {
			return $this->registeredVars;
		}

		/**
		 * Just wrap the @parent class method
		 * @param [type] $variables [description]
		 */
		public function set_variable( $name, $value ) {
			$this->setVariable( $name, $value );
		}

		/**
		 * Just wrap the @parent class method
		 * @param [type] $variables [description]
		 */
		public function set_variables( $variables ) {
			$this->setVariables( $variables );
		}

		/**
		 * Smart caching and retrieval of a tree of @import LESS stylesheets
		 *
		 * @since 0.0.1
		 * @param WPLessStylesheet $stylesheet
		 * @param bool    $force
		 */
		public function cache_stylesheet( $stylesheet, $force = false ) {
			$cache_name = get_option( 'stylesheet' ) . '_k6_less_'.md5( $this->source_path );
			$compiled_cache = get_transient( $cache_name );

			if ( ! $force && ! file_exists( $this->get_target_path() ) ) { $force = true; }

			// @parent class method
			$compiled_cache = $this->cachedCompile( $compiled_cache ? $compiled_cache : $this->source_path, $force );

			// saving compiled stuff
			if ( isset( $compiled_cache['compiled'] ) && $compiled_cache['compiled'] ) {
				$this->set_source_timestamp( $compiled_cache['updated'] );
				$this->save_stylesheet( $stylesheet, $compiled_cache['compiled'] );

				$compiled_cache['compiled'] = null;
				set_transient( $cache_name, $compiled_cache );
			}
		}

		/**
		 * Save the stylesheet
		 *
		 * @since 0.0.1
		 * @param null    $css
		 */
		public function save_stylesheet( $css = null ) {

			wp_mkdir_p( dirname( $this->get_target_path() ) );

			try {
				// do_action('wp-less_stylesheet_save_pre', $this->stylesheet, $this->get_variables());

				if ( $css === null ) {
					// @parent class method
					$css = $this->compileFile( $this->source_path );
				}

				file_put_contents( $this->get_target_path(), $css );
				// chmod($this->get_target_path(), 0666);

				$this->is_new = false;
				// do_action('wp-less_stylesheet_save_post', $this->stylesheet);
			}
			catch( Exception $e ) {
				wp_die( $e->getMessage() );
			}
		}

		/**
		 * Find any style to process
		 *
		 * @since 0.0.1
		 * @return array styles to process
		 */
		protected function get_queued_styles_to_process() {
			$wp_styles = $this->get_styles();
			$to_process = array();

			foreach ( (array) $wp_styles->queue as $style_id ) {
				if ( preg_match( '/\.less$/U', $wp_styles->registered[ $style_id ]->src ) ) {
					$to_process[] = $style_id;
				}
			}

			return apply_filters( 'wp-less_get_queued_styles_to_process', $to_process );
		}

		/**
		 * Returns WordPress Styles manager
		 *
		 * @uses WP_Styles
		 * @since 0.0.1
		 * @return WP_Styles styles instance
		 */
		public function get_styles() {
			global $wp_styles;

			//because if someone never registers through `wp_(enqueue|register)_stylesheet`,
			//$wp_styles is never initialized, and thus, equals NULL
			return null === $wp_styles || ! $wp_styles instanceof WP_Styles ? new WP_Styles() : $wp_styles;
		}

		/**
		 * Returns the upload dir for this configuration class (common to all instances)
		 *
		 * @since 0.0.1
		 * @return string
		 */
		public function get_upload_dir() {
			return self::$upload_dir;
		}

		/**
		 * Returns the upload URI
		 *
		 * @since 0.0.1
		 * @return string
		 */
		public function get_upload_uri() {
			return self::$upload_uri;
		}

		/**
		 * Defines an upload directory
		 *
		 * @since 0.0.1
		 * @param String  $upload_dir
		 */
		public function set_upload_dir( $upload_dir ) {
			return self::$upload_dir = $upload_dir;
		}

		/**
		 * Defines an upload URI
		 *
		 * @since 0.0.1
		 * @param String  $upload_uri
		 */
		public function set_upload_uri( $upload_uri ) {
			return self::$upload_uri = $upload_uri;
		}

		/**
		 * Set compilation strategy
		 *
		 * @api
		 * @since 0.0.1
		 * @param unknown $strategy string Actual compilation "strategy"
		 */
		public function set_compilation_strategy( $strategy ) {
			if ( in_array( $strategy, $this->compilation_strategies ) ) {
				$this->compilation_strategy = $strategy;
			} else {
				$this->compilation_strategy;
				// throw new WPLessException('Unknown compile strategy: ['.$strategy.'] provided.');
			}
		}

		/**
		 * Configures the file signature
		 *
		 * It corresponds to a unique hash taking care of file timestamp and variables.
		 * It should be called each time stylesheet variables are updated.
		 *
		 * @param array   $variables List of variables used for signature
		 * @since 0.0.1
		 */
		protected function set_signature( array $variables = array() ) {
			$this->signature = substr( sha1( serialize( $variables ) . $this->source_timestamp ), 0, 10 );
		}

		/**
		 * Returns source content (CSS to parse)
		 *
		 * @since 0.0.1
		 * @return string
		 */
		public function get_source_content() {
			return apply_filters( 'wp-less_stylesheet_source_content', file_get_contents( $this->source_path ) );
		}

		/**
		 * Returns target path
		 *
		 * @since 0.0.1
		 * @return string
		 */
		public function get_target_path() {
			return sprintf( $this->target_path, $this->signature );
		}

		/**
		 * Returns the computed path for a given dependency
		 *
		 * @since 0.0.1
		 * @return string
		 */
		public function compute_target_path() {
			$target_path = preg_replace( '#^' . get_theme_root_uri() . '#U', '', $this->stylesheet->src );
			$target_path = preg_replace( '/.less$/U', '', $target_path );

			$target_path .= '.min.css';

			return apply_filters( 'wp-less_stylesheet_compute_target_path', $target_path );
		}

		/**
		 *
		 *
		 * @since 0.0.1
		 */
		public function get_stylesheet( $stylesheet, $variables ) {
			$this->stylesheet = $stylesheet;
			$this->stylesheet->ver = K6CP::VERSION; // k6todo, do this in a nicer way \\
			$this->set_paths();
			$this->set_signature( $variables );

			if ( file_exists( $this->get_target_path() ) ) {
				$this->is_new = false;
			}
		}

		/**
		 * Process a single stylesheet
		 *
		 * @since 0.0.1
		 * @param string  $handle
		 * @param unknown $force  boolean If set to true, rebuild all stylesheets, without considering they are updated or not
		 */
		public function process_stylesheet( $handle, $force = false, $variables = null ) {
			$force = ! ! $force ? $force : $this->compilation_strategy === 'always';
			$variables = isset( $variables ) ? $variables : $this->get_variables();
			$wp_styles = $this->get_styles();
			$stylesheet = $this->get_stylesheet( $wp_styles->registered[ $handle ], $variables );

			// if we pass the variables set them on compiler
			if ( isset( $variables ) ) {
				$this->set_variables( $variables );
			}
			if ( 'legacy' == $this->compilation_strategy && $this->is_new ) {
				$this->save_stylesheet( $stylesheet );
			} elseif ( 'legacy' != $this->compilation_strategy ) {
				$this->cache_stylesheet( $stylesheet, $force );
			}
			$wp_styles->registered[ $handle ]->src = $this->target_uri;
		}

		/**
		 * Process all stylesheets to compile just in time
		 *
		 * @since 0.0.1
		 * @param unknown $force boolean If set to true, rebuild all stylesheets, without considering they are updated or not
		 */
		public function process_stylesheets( $force = false ) {
			$styles = isset( $stylesheets ) ? $stylesheets : $this->get_queued_styles_to_process();
			$force = is_bool( $force ) && $force ? ! ! $force : false;
			self::$upload_dir = $this->get_upload_dir();
			self::$upload_uri = $this->get_upload_uri();

			if ( empty( $styles ) ) {
				return;
			}

			if ( ! wp_mkdir_p( self::$upload_dir ) ) {
				// throw new WPLessException(sprintf('The upload dir folder (`%s`) is not writable from %s.', WPLessStylesheet::$upload_dir, get_class($this)));
			}

			foreach ( $styles as $style_id ) {
				$this->process_stylesheet( $style_id, $force );
			}

			do_action( 'k6_process_stylesheets', $styles );
		}
	}

	// Instantiate
	K6CP_Preprocessor_Less::get_instance();

endif;
