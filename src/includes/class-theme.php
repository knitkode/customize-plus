<?php defined( 'ABSPATH' ) or die;

if ( class_exists( 'PWPcp_Singleton' ) ):

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

	final class PWPcp_Theme extends PWPcp_Singleton {

		/**
		 * Allowed array keys for themes to use through
		 * `add_theme_support( 'PWPcp-customize' )`.
		 *
		 * @since 0.0.1
		 * @var array
		 */
		private static $theme_support_keys = array(
			'prefix',
			'customize_tree',
			'images_base_url',
			'docs_base_url',
			'styles',
		);

		/**
		 * The unique theme prefix identifier
		 *
		 * Themes are required to declare this using through
		 * `add_theme_support( 'PWPcp-customize' )`.
		 *
		 * @since 0.0.1
		 * @var string
		 */
		public static $options_prefix = '';

		/**
		 * Theme settings default values
		 *
		 * It acts like a store with the default values of theme settings (`theme_mods`)
		 * extracted from the `tree` array declared by the theme through
		 * `add_theme_support( 'PWPcp-customize' )`. The current theme or this plugin
		 * can use this array to safely retrieve options without having to write the
		 * default values to the db.
		 *
		 * @since 0.0.1
		 * @var array
		 */
		public static $settings_defaults = array();

		/**
		 * Images base url
		 *
		 * This is either defined by the theme through
		 * `add_theme_support( 'PWPcp-customize' )`, or set by default to
		 * `get_stylesheet_directory_uri`.
		 * This url will be prendeded to the images `src` used in the Customizer
		 * for stuff like 'guides', 'helpers' and 'radio_images' controls.
		 * The value always pass through the `trailingslashit` WordPress function
		 * so it's not allowed to start images paths with a slash.
		 *
		 * @since 0.0.1
		 * @var string
		 */
		public static $images_base_url = '';

		/**
		 * Docs base url
		 *
		 * This optional property is defined by the theme through
		 * `add_theme_support( 'PWPcp-customize' )`.
		 * This url will be prendeded in the Customizer to the
		 * `guides => array( 'docs' => '{url}' )` value where defined.
		 * The value always pass through the `trailingslashit` WordPress function
		 * so it's not allowed to start images paths with a slash.
		 *
		 * @since 0.0.1
		 * @var string
		 */
		public static $docs_base_url = '';

		/**
		 * Constructor
		 *
		 * @since  0.0.1
		 */
		protected function __construct() {
			add_action( 'after_setup_theme', array( __CLASS__, 'configure' ), 999 );
		}

		/**
		 * Configure theme
		 *
		 * Check the theme support declared by the current theme,
		 * validate the settings declared and bootstrap the Customize with the given settings.
		 * A filter for wach setting declared by the theme is automatically created, allowing
		 * developers to override these settings values through child themes or plugins.
		 *
		 * @since  0.0.1
		 * @return [type] [description]
		 */
		public static function configure() {

			$settings = get_theme_support( 'PWPcp-customize' );

			if ( is_array( $settings ) ) {

				// Themes should provide an array of options
				if ( isset( $settings[0] ) && is_array( $settings[0] ) ) {

					$theme_prefix = self::validate_theme_support( 'prefix', $settings[0] );
					$theme_customizer_settings = array();

					foreach ( self::$theme_support_keys as $key ) {

						// automatically create hooks for child themes or whatever
						$theme_customizer_settings[ $key ] = apply_filters(
							$theme_prefix . '/PWPcp/theme/prefix',
							self::validate_theme_support( $key, $settings[0] )
						);
					}

					self::init( $theme_customizer_settings );
				} else {
					// @@todo error report doing_it_wrong ? \\
				}
			}
		}

		/**
		 * [validate_theme_support description]
		 * @param  [type] $key           [description]
		 * @param  [type] $configuration [description]
		 * @uses  sanitize_url The url get sanitized, just to be sure
		 * @return [type]                [description]
		 */
		private static function validate_theme_support( $key, $configuration ) {
			switch ( $key ) {
				case 'prefix':
					if ( isset( $configuration['prefix'] ) ) {
						return sanitize_key( $configuration['prefix'] );
					} else {
						// @@todo use doing_it_wrong ? \\
						wp_die( __( 'Customize Plus: no `prefix` given.', 'pkgTextdomain' ) );
					}
				case 'customize_tree':
					if ( isset( $configuration[ 'customize_tree' ] ) ) {
						$theme_customize_tree = $configuration[ 'customize_tree' ];
						if ( is_array( $theme_customize_tree ) ) {
							return $theme_customize_tree;
						} else {
							// @@todo use doing_it_wrong ? \\
							wp_die( __( 'Customize Plus: `customize_tree` must be an array.', 'pkgTextdomain' ) );
						}
					} else {
						// @@todo use doing_it_wrong ? \\
						wp_die( __( 'Customize Plus: no `customize_tree` array given.', 'pkgTextdomain' ) );
					}
					break;
				case 'styles':
					if ( isset( $configuration[ 'styles' ] ) ) {
						$theme_styles = $configuration[ 'styles' ];
						if ( is_array( $theme_styles ) ) {
							return $theme_styles;
						} else {
							wp_die( __( 'Customize Plus: `styles` must be an array.', 'pkgTextdomain' ) ); // @@todo use doing_it_wrong ? \\
						}
					}
					break;
				case 'images_base_url':
					if ( isset( $configuration['images_base_url'] ) ) {
						return sanitize_url( trailingslashit( $configuration['images_base_url'] ) );
					} else {
						return trailingslashit( get_stylesheet_directory_uri() );
					}
					break;
				case 'docs_base_url':
					if ( isset( $configuration['docs_base_url'] ) ) {
						return sanitize_url( trailingslashit( $configuration['docs_base_url'] ) );
					} else {
						return '';
					}
					break;
				default:
					break;
			}
		}

		/**
		 * [init description]
		 * @return [type] [description]
		 */
		private static function init( $theme ) {

			self::$options_prefix = $theme['prefix'];
			self::$images_base_url = $theme['images_base_url'];
			self::$docs_base_url = $theme['docs_base_url'];

			// register theme customize tree
			$theme_customize_manager = new PWPcp_Customize_Manager( 'theme', $theme['prefix'], $theme['customize_tree'] );

			// add theme settings defaults
			self::$settings_defaults = $theme_customize_manager->settings_defaults;

			// register theme styles to compiler if enabled
			// @@todo use theme supports api here... \\
			if ( class_exists( 'PWPcpp' ) ) {
				if ( $theme['styles'] && /*PWPcpp::get_option_with_default( 'compiler' ) &&*/ class_exists( 'PWPcpp_Component_Compiler' ) ) {
					PWPcpp_Component_Compiler::register_styles( $theme['styles'], $theme_customize_manager->panels );
				}
			}

			/**
			 * Pass all default settings values to the hook, so themes can use them
			 * to create a safe get_theme_mod in case they need it.
			 *
			 * @hook 'PWPcp/theme/is_configured' for themes,
			 * @param array An array containing the defualt value for each setting
			 *              declared in the customize tree
			 */
			do_action( 'PWPcp/theme/is_configured', self::$settings_defaults );
		}

		/**
		 * [get_theme_mod_with_default description]
		 * we'll need this safe theme_mod in one of our sanitization functions
		 * @see pwpcp_get_less_test_input
		 *
		 * @param [type]  $opt_name [description]
		 * @return [type]           [description]
		 */
		public static function get_theme_mod_with_default( $opt_name ) {
			if ( isset( self::$settings_defaults[ $opt_name ] ) ) {
				return get_theme_mod( $opt_name, self::$settings_defaults[ $opt_name ] );
			} else {
				return get_theme_mod( $opt_name );
			}
		}

		/**
		 * [get_theme_mods_with_defaults description]
		 *
		 * Initially the `theme_mods` are empty, so check for it.
		 * @link(https://core.trac.wordpress.org/browser/trunk/src/wp-includes/functions.php#L3045, core.trac.wordpress)
		 * Anyway the function would be reverted:
		 * `wp_parse_args( get_theme_mods(), self::$settings_defaults )`
		 *
		 * @return array           [description]
		 */
		public static function get_theme_mods_with_defaults() {
			$theme_mods = get_theme_mods();
			if ( ! $theme_mods ) {
			 	$theme_mods = array();
			}
			return array_merge( self::$settings_defaults, $theme_mods );
		}
	}

	// Instantiate
	PWPcp_Theme::get_instance();

endif;
