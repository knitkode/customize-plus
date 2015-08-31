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
	class PWPcp_Theme extends PWPcp_Singleton {

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
		 * This is also the name of the DB entry under which options are
		 * stored if `'type' => 'option'` is used for the Customizer settings.
		 *
		 * @since 0.0.1
		 * @var string
		 */
		public static $options_prefix = '';

		/**
		 * The theme customize tree array.
		 *
		 * Themes pass all their organized customizer setup through
		 * `add_theme_support( 'PWPcp-customize' )`.
		 *
		 * @since 0.0.1
		 * @var array
		 */
		public static $customize_tree = array();

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
		 */
		public static function configure() {

			$theme_support = get_theme_support( 'PWPcp-customize' );

			// Themes should provide an array of options
			if ( is_array( $theme_support ) ) {
				$theme_support = array_shift( $theme_support );
				$prefix = self::validate_theme_support( 'prefix', $theme_support );
				$customizer_settings = array();

				foreach ( self::$theme_support_keys as $key ) {

					// automatically create hooks for child themes or whatever
					$customizer_settings[ $key ] = apply_filters(
						$prefix . '/PWPcp/theme/' . $key,
						self::validate_theme_support( $key, $theme_support )
					);
				}
				self::init( $customizer_settings );
			}
		}

		/**
		 * Validate the values passed by the theme developer through
		 * `add_theme_support( 'PWPcp-customize' )`, and display error messages.
		 *
		 * @since  0.0.1
		 * @param  string $key           One of the allowed keys for the configuration array.
		 * @param  array  $configuration The `theme_support( 'PWPcp-customize' )` array.
		 * @uses   esc_url               The url get sanitized, just to be sure
		 * @uses   trailingslashit       Append always last slash to url, so it's cleaner for devs
		 *         											 when defining their customize tree.
		 * @return string|array
		 */
		private static function validate_theme_support( $key, $configuration ) {
			switch ( $key ) {
				case 'prefix':
					if ( isset( $configuration['prefix'] ) ) {
						return sanitize_key( $configuration['prefix'] );
					} else {
						wp_die( __( 'Customize Plus: no `prefix` given.' ) );
					}
				case 'customize_tree':
					if ( isset( $configuration[ 'customize_tree' ] ) ) {
						if ( is_array( $configuration[ 'customize_tree' ] ) ) {
							return $configuration[ 'customize_tree' ];
						} else {
							wp_die( __( 'Customize Plus: `customize_tree` must be an array.' ) );
						}
					} else {
						wp_die( __( 'Customize Plus: no `customize_tree` array given.' ) );
					}
					break;
				case 'styles':
					if ( isset( $configuration[ 'styles' ] ) ) {
						if ( is_array( $configuration[ 'styles' ] ) ) {
							return $configuration[ 'styles' ];
						} else {
							wp_die( __( 'Customize Plus: `styles` must be an array.' ) );
						}
					}
					break;
				case 'images_base_url':
					if ( isset( $configuration['images_base_url'] ) ) {
						return esc_url( trailingslashit( $configuration['images_base_url'] ) );
					} else {
						return trailingslashit( get_stylesheet_directory_uri() );
					}
					break;
				case 'docs_base_url':
					if ( isset( $configuration['docs_base_url'] ) ) {
						return esc_url( trailingslashit( $configuration['docs_base_url'] ) );
					} else {
						return '';
					}
					break;
				default:
					break;
			}
		}

		/**
		 * Initialize Customize Plus Theme
		 *
		 * Set some static validated properties and bootstrap the Compiler
		 * component if it exists and it's enabled.
		 *
		 * @since  0.0.1
		 * @param  Array $theme The theme_support declared by the theme.
		 */
		private static function init( $theme ) {

			self::$options_prefix = $theme['prefix'];
			self::$images_base_url = $theme['images_base_url'];
			self::$docs_base_url = $theme['docs_base_url'];
			self::$customize_tree = $theme['customize_tree'];

			// add theme settings defaults
			self::set_settings_defaults();

			// register theme styles to compiler if enabled
			// @@todo use theme supports api here... \\
			if ( class_exists( 'PWPcpp' ) ) {
				if ( $theme['styles'] && /*PWPcpp::get_option_with_default( 'compiler' ) &&*/ class_exists( 'PWPcpp_Component_Compiler' ) ) {
					PWPcpp_Component_Compiler::register_styles( $theme['styles'], self::$customize_tree );
				}
			}

			/**
			 * Pass all default settings values to the hook, so themes can use them
			 * to create a safe get_theme_mod in case they need it.
			 *
			 * @hook 'PWPcp/theme/is_configured' for themes,
			 * @param array An array containing the default value for each setting
			 *              declared in the customize tree
			 */
			do_action( 'PWPcp/theme/is_configured', self::$settings_defaults );
		}

		/**
		 * Set settings default values.
		 *
		 * Loop over the Customizer tree and store on class static property
		 * all the settings default values. Sine the root level of the tree
		 * can have both panels and sections we need to check the subject first.
		 *
		 * @link http://wordpress.stackexchange.com/q/28954/25398
		 * @since 0.0.1
		 */
		private static function set_settings_defaults() {
			foreach ( self::$customize_tree as $component ) {
				if ( isset( $component['subject'] ) ) {
					if ( 'panel' === $component['subject'] ) {
						if ( isset( $component['sections'] ) && is_array( $component['sections'] ) ) {
							foreach ( $component['sections'] as $section ) {
								self::set_settings_default_from_section( $section );
							}
						}
					}
					else if ( 'section' === $component['subject'] ) {
						self::set_settings_default_from_section( $component );
					}
				} else {
					wp_die( __( 'Customize Plus: `customize_tree` root components need a `subject` value.' ) );
				}
			}
		}

		/**
		 * Get settings default values from section.
		 *
		 * Loop through the section fields (setting + control) and store the settings
		 * default values. We don't check for the existence of theme, because a default
		 * value, with Customize Plus is always required.
		 *
		 * @since  0.0.1
		 * @param  Array $section The section array as defined by the theme developers.
		 */
		private static function set_settings_default_from_section ( $section ) {
			if ( isset( $section['fields'] ) && is_array( $section['fields'] ) ) {
				foreach ( $section['fields'] as $field_id => $field_args ) {
					if ( isset( $field_args['setting'] ) ) {
						$setting = $field_args['setting'];

						// this allow to use a different id for the setting than the default one
						// (which is the shared between the setting and its related control)
						if ( ! isset( $setting['id'] ) ) {
							$setting['id'] = $field_id;
						}

						if ( isset( $setting['default'] ) ) {
							// set default value on options defaults
							self::$settings_defaults[ $setting['id'] ] = $setting['default'];
						}
						else {
							wp_die( __( 'Customize Plus: every setting must have a `default` value.' ) ); // @@doubt \\
						}
					}
				}
			}
		}

		/**
		 * Get theme mod
		 *
		 * Get theme mod with default value as fallback, we'll need this safe
		 * theme_mod in one of our sanitization functions.
		 *
		 * @since  0.0.1
		 * @param [type]  $opt_name [description]
		 * @return [type]           [description]
		 */
		public static function get_theme_mod( $opt_name ) {
			if ( isset( self::$settings_defaults[ $opt_name ] ) ) {
				return get_theme_mod( $opt_name, self::$settings_defaults[ $opt_name ] );
			} else {
				return get_theme_mod( $opt_name );
			}
		}

		/**
		 * Get theme mods
		 *
		 * Get all theme mods with default values as fallback. Initially the
		 * `theme_mods` are empty, so check for it.
		 * {@link(https://core.trac.wordpress.org/browser/trunk/src/wp-includes/functions.php#L3045, core.trac.wordpress)}
		 * Anyway the function would be reverted:
		 * `wp_parse_args( get_theme_mods(), self::$settings_defaults )`
		 *
		 * @since  0.0.1
		 * @return array All the `theme_mods` with default values as fallback.
		 */
		public static function get_theme_mods() {
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
