<?php defined( 'ABSPATH' ) or die;

// TGM register plugins (specify Customize Plus (and in case Customize Plus Premium))
require_once dirname( __FILE__ ) . '/tgmpath.php';

if ( ! class_exists( 'MyTheme' ) ):

	class MyTheme {

		const VERSION = '0.0.1';

		public static $options_defaults;

		/**
		 * Constructor
		 */
		public function __construct() {
			// just to be sure nobody else has hooked here \\
			remove_all_filters( 'k6cp/theme/configure' );
			add_filter( 'k6cp/theme/configure', array( __CLASS__, 'configure_customize_plus' ), -1 );

			// just to be sure nobody else has hooked here \\
			remove_all_actions( 'k6cp/theme/is_configured' );
			add_action( 'k6cp/theme/is_configured', array( __CLASS__, 'set_options_defaults' ), 10, 1 );
		}

		/**
		 * Configure Customize Plus.
		 *
		 * Note that `framework` and `stylesheets` are only available
		 * with Customize Plus Premium.
		 *
		 * @return array The configuration for Customize Plus.
		 */
		public static function configure_customize_plus() {
			return apply_filters( 'k6tp/configure_customize_plus', array(
				'prefix' => 'k6tp',
				'customize_panels' => require( __DIR__ . '/mytheme-options.php' ),
				'framework' => 'bootstrap', // only with Customize Plus Premium
				'stylesheets' => array( // only with Customize Plus Premium
					array(
						'id' => 'k6tp-theme-main',
						'dependencies' => array(),
						'version' => self::VERSION,
						'uncompiled_url' => get_template_directory_uri() . '/assets/styles/theme.less',
						'uncompiled_root_url' => get_template_directory_uri() . '/assets/styles/',
						'compiled_fallback_dir' => get_template_directory() . '/assets/styles/theme-default.min.css',
					),
				),
			) );
		}

		/**
		 * Set default options values on static theme class property.
		 *
		 * If you really don't care about getting default values
		 * automatically you can forget this, the `$options_defaults`
		 * static class property and the `get_theme_mod` method.
		 *
		 * @param array $options_defaults A key value pair with all the theme mods
		 *                                default values
		 */
		public static function set_options_defaults( $options_defaults ) {
			self::$options_defaults = $options_defaults;
		}

		/**
		 * Wrap WordPress `get_theme_mod`.
		 *
		 * Use this when you want to get theme_mod automatically falling
		 * back to the default value you specified in the customize panels.
		 * If you don't care about the default value or you want to specify
		 * it manually in another way there's no need it to use this, you
		 * can just use the normal `get_theme_mod` or our custom code.
		 *
		 * @param [type]  $opt_name [description]
		 * @return [type]           [description]
		 */
		public static function get_theme_mod( $opt_name ) {
			if ( isset( self::$options_defaults[ $opt_name ] ) ) {
				return get_theme_mod( $opt_name, self::$options_defaults[ $opt_name ] );
			} else {
				return get_theme_mod( $opt_name );
			}
		}
	}

	// Instantiate
	new MyTheme;

endif; // End if class_exists check
