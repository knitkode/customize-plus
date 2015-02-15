<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'K6CP_Customize_Preprocessor' ) ):

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

	class K6CP_Customize_Preprocessor {

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
		 * Constructor
		 *
		 * @since  0.0.1
		 */
		protected function __construct() {

			add_action( 'k6cp/customize/compiler/init', array( $this, 'setup_preprocessor' ) );
			// add_filter( 'style_loader_tag', array( $this, 'allow_enqueue_less_styles' ), 5, 2 );
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
			$options = wp_parse_args( array(), K6CP_Customize::$DEFAULTS ); // get_theme_mods
			return array_intersect_key( $options, array_flip( K6CP_Compiler::$COMPILER_VARIABLES_NAMES ) );
		}
	}

	// Instantiate
	// K6CP_Customize_Preprocessor::get_instance();
	new K6CP_Customize_Preprocessor();

endif;
