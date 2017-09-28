<?php defined( 'ABSPATH' ) or die;

if ( class_exists( 'PWPcp_Singleton' ) ):

	/**
	 * Contains methods for customizing the theme customization screen.
	 *
	 * @package    Customize_Plus
	 * @subpackage Customize
	 * @author     Knitkode <dev@knitkode.com> (https://knitkode.com)
	 * @copyright  2017 Knitkode
	 * @license    GPL-2.0+
	 * @version    Release: pkgVersion
	 * @link       https://knitkode.com/customize-plus
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
		 * This is also the name of the DB entry under which options are stored if
		 * `'type' => 'option'` is used for the Customizer settings.
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
		 * It acts like a store with the default values of theme settings
		 * (`theme_mods`) extracted from the `tree` array declared by the theme
		 * through `add_theme_support( 'PWPcp-customize' )`. The current theme or
		 * this plugin can use this array to safely retrieve options without having
		 * to write the default values to the db.
		 *
		 * @since 0.0.1
		 * @var array
		 */
		public static $settings_defaults = array();

		/**
		 * Store the settings which are managed by the Options API
		 *
		 * @since 0.0.1
		 * @var array
		 */
		public static $settings_options_api = array();

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
		 * validate the settings declared and bootstrap the Customize with the
		 * given settings. A filter for wach setting declared by the theme is
		 * automatically created, allowing developers to override these settings
		 * values through child themes or plugins.
		 *
		 * @since  0.0.1
		 */
		public static function configure() {

			$theme_support = get_theme_support( 'PWPcp-customize' );

			// themes should provide an array of options
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
		 * @param  string $key           One of the allowed keys for the
		 *                               configuration array.
		 * @param  array  $configuration The `theme_support( 'PWPcp-customize' )`
		 *                               array.
		 * @uses   esc_url               The url get sanitized, just to be sure
		 * @uses   trailingslashit       Append always last slash to url, so it's
		 *         											 cleaner for devs when defining their
		 *         											 customize tree.
		 * @return string|array
		 */
		private static function validate_theme_support( $key, $configuration ) {
			switch ( $key ) {
				case 'prefix':
					if ( isset( $configuration['prefix'] ) ) {
						return sanitize_key( $configuration['prefix'] );
					} else {
						/* translators: %1$s is 'Plugin_Name: ', %2$s is the subject (code) */
						wp_die( sprintf( __( '%1$s no %2$s given.' ), 'Customize Plus', '`prefix`' ) );
					}
				case 'customize_tree':
					if ( isset( $configuration[ 'customize_tree' ] ) ) {
						if ( is_array( $configuration[ 'customize_tree' ] ) ) {
							return $configuration[ 'customize_tree' ];
						} else {
							/* translators: %1$s is 'Plugin_Name: ', %2$s is the subject (code) */
							wp_die( sprintf( __( '%1$s %2$s must be an array.' ), 'Customize Plus', '`customize_tree`' ) );
						}
					} else {
						/* translators: %1$s is 'Plugin_Name: ', %2$s is the object (code) */
						wp_die( sprintf( __( '%1$s no %2$s array given.' ), 'Customize Plus', '`customize_tree`' ) );
					}
					break;
				case 'styles':
					if ( isset( $configuration[ 'styles' ] ) ) {
						if ( is_array( $configuration[ 'styles' ] ) ) {
							return $configuration[ 'styles' ];
						} else {
							/* translators: %1$s is 'Plugin_Name: ', %2$s is the subject (code) */
							wp_die( sprintf( __( '%1$s %2$s must be an array.' ), 'Customize Plus', '`styles`' ) );
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
		 * Initialize theme
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
					/* translators: %1$s is 'Plugin_Name: ', %2$s and %3$s pieces of code */
					wp_die( sprintf( __( '%1$s %2$s root components need a %3$s value.' ), 'Customize Plus', '`customize_tree`', '`subject`' ) );
				}
			}
		}

		/**
		 * Get settings default values from section.
		 *
		 * Loop through the section fields (setting + control) and store the
		 * settings default values. We don't check for the their existence them,
		 * because a default value is always required.
		 *
		 * @since  0.0.1
		 * @param  array $section The section array as defined by the theme
		 *                        developers
		 */
		private static function set_settings_default_from_section ( $section ) {
			if ( isset( $section['fields'] ) && is_array( $section['fields'] ) ) {
				foreach ( $section['fields'] as $field_id => $field_args ) {
					$setting_args = isset( $field_args['setting'] ) ? $field_args['setting'] : null;

					if ( $setting_args ) {

						$setting_id = $field_id;

						// set custom id, @see the PWPcp_Customize class
						if ( isset( $setting_args['id'] ) ) {
							$setting_id = $setting_args['id'];
						}
						// 'option' or 'theme_mod', @see the PWPcp_Customize class
						if ( isset( $setting_args['type'] ) && 'option' === $setting_args['type'] ) {
							array_push( self::$settings_options_api, $setting_id );
							$setting_id = PWPcp_Theme::$options_prefix . '[' . $setting_id . ']';
						}

						if ( isset( $setting_args['default'] ) ) {
							// set default value on options defaults
							self::$settings_defaults[ $setting_id ] = $setting_args['default'];
						}
						else {
							/* translators: %1$s is 'Plugin_Name: ', %2$s is the type of value (code) */
							wp_die( sprintf( __( '%1$s every setting must have a %2$s value.' ), 'Customize Plus', '`default`' ) );
						}
					}
				}
			}
		}

		/**
		 * Get option id
		 * Since its simplicity and possible overuse in many loops this function is
		 * not actually used, but 'inlined' in other functions, it's here just for
		 * reference.
		 * @abstract
		 * @param  string $opt_name The simple setting id (without theme prefix)
		 * @return string The real setting id (with theme prefix)
		 */
		public static function get_option_id ( $opt_name ) {
			return self::$options_prefix . '[' . ( $opt_name ) . ']';
		}

		/**
		 * Safe `get_theme_mod` with default fallback
		 *
		 * Get theme mod with default value as fallback, we'll need this safe
		 * theme_mod in one of our sanitization functions.
		 * This is the same as using the global function `pwp_get_theme_mod`
		 *
		 * @since  0.0.1
		 * @param string  $opt_name
		 * @return ?string
		 */
		public static function get_theme_mod( $opt_name ) {
			if ( isset( self::$settings_defaults[ $opt_name ] ) ) {
				return get_theme_mod( $opt_name, self::$settings_defaults[ $opt_name ] );
			} else {
				return get_theme_mod( $opt_name );
			}
		}

		/**
		 * Safe `get_option` with default fallback
		 *
		 * This is the same as using the global function `pwp_get_option`
		 *
		 * @since  0.0.1
		 * @param string $opt_name
		 * @return ?
		 */
		public static function get_option( $opt_name ) {
			$full_id = self::$options_prefix . '[' . ( $opt_name ) . ']';
			$option_array = get_option( self::$options_prefix );
			if ( $option_array && isset( $option_array[ $opt_name ] ) ) {
				return $option_array[ $opt_name ];
			} else if ( isset( self::$settings_defaults[ $full_id ] ) ) {
				return self::$settings_defaults[ $full_id ];
			} else {
				return null; // @@tocheck \\
			}
		}

		/**
		 * Safe `get_theme_mods` with default fallbacks
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

/**
 * Export useful functions to global namespace // @@doubt not sure if provide
 * these functions, and whether do it this way or with `call_user_func` \\
 * @since 0.0.1
 */

/**
 * Safe `get_theme_mod` with default fallback
 * @param  string $opt_name The setting id
 * @return ?
 */
function pwp_get_theme_mod ( $opt_name ) {
	return PWPcp_Theme::get_theme_mod( $opt_name );
}

/**
 * Safe `get_option` with default fallback
 * @param  string $opt_name The simple setting id (without theme prefix)
 * @return ?
 */
function pwp_get_option ( $opt_name ) {
	return PWPcp_Theme::get_option( $opt_name );
}

/**
 * Safe `get_theme_mods` with default fallbacks
 * @return array
 */
function pwp_get_theme_mods () {
	return PWPcp_Theme::get_theme_mods();
}

/**
 * Get option id
 * @param  string $opt_name The simple setting id (without theme prefix)
 * @return string The real setting id (with theme prefix)
 */
function pwp_get_option_id ( $opt_name ) {
	return PWPcp_Theme::$options_prefix . '[' . ( $opt_name ) . ']';
}
