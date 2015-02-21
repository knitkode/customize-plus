<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'K6CP_Utils' ) ):

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

	class K6CP_Utils {

		/**
		 * Constructor
		 *
		 * @since  0.0.1
		 */
		public function __construct() {
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
		 * [get_settings_defaults_from_panels description]
		 *
		 * @link http://wordpress.stackexchange.com/questions/28954/how-to-set-the-default-value-of-a-option-in-a-theme
		 * @since 0.0.1
		 * @return [type]              [description]
		 */
		public static function get_settings_defaults_from_panels( $panels ) {
			$settings_defaults = array();

			foreach ( $panels as $panel_id => $panel_args ) {
				foreach ( $panel_args['sections'] as $section_id => $section_args ) {
					foreach ( $section_args['fields'] as $option_id => $option_args ) {

						if ( isset( $option_args['setting'] ) ) {

							$setting = $option_args['setting'];

							// this allow to use a different id for the setting than the default one
							// (which is the shared between the setting and its related control)
							if ( ! isset( $setting['id'] ) ) {
								$setting['id'] = $option_id;
							}

							if ( isset( $setting['default'] ) ) {
								// set default value on options defaults
								$settings_defaults[ $setting['id'] ] = $setting['default'];
							}
							else {
								// k6todo throw error here, a default is required \\
							}
						}
					}
				}
			}
			return $settings_defaults;
		}

		/**
		 * Get an option with default value from array of options
		 * stored in the database under a single prefix.
		 *
		 * @param  string $prefix 	Required, the name of the option array in the
		 *                          db, should be unique.
		 * @param  string $opt_name Required, the option name / id.
		 * @param  array  $defaults Optional, an array of defaults where to look
		 *                          in case that the value is not in database.
		 * @param  string $default  Optional, a default value to return if
		 *                          everything else return false.
		 * @return mixed(?|boolean)
		 */
		public static function get_option_with_default( $prefix = '', $opt_name = '', $defaults = array(), $default = '' ) {
			// get from options (WordPress API)
			$option_array = get_option( $prefix );

			// if the option array is already in the database get it from there
			if ( $option_array ) {
				if ( isset( $option_array[ $opt_name ] ) ) {
					return $option_array[ $opt_name ];
				}
				// if it's not there
				else {
					// try to get from options defaults
					if ( isset( $defaults[ $opt_name ] ) ) {
						return $defaults[ $opt_name ];
					}
					else {
						// otherwise return either the default argument or false, as in the WordPress API
						return $default || false;
					}
				}
				return get_option( $prefix )[ $opt_name ];
			}
			// if it's not in the database and an array of defaults is passed look there
			else if ( isset( $defaults[ $opt_name ] ) ) {
				return $defaults[ $opt_name ];
			}
			// otherwise return either the default argument or false, as in the WordPress API
			else {
				// k6todo error handling
				return $default || false;
			}
		}

		/**
		 * Get Theme mod with default
		 *
		 * @param  string $opt_name [description]
		 * @param  string $default  [description]
		 * @param  array  $defaults [description]
		 * @return [type]           [description]
		 */
		public static function get_theme_mod_with_default( $opt_name = '', $defaults = array(), $default = '' ) {
			if ( $default ) {
				return get_theme_mod( $opt_name, $default );
			}
			else if ( isset( $defaults[ $opt_name ] ) ) {
				return get_theme_mod( $opt_name, $defaults[ $opt_name ] );
			}
			else {
				return get_theme_mod( $opt_name );
			}
		}
	}

endif;
