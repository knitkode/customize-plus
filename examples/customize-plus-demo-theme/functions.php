<?php

/**
 * Customize Plus Demo Theme
 *
 * @package   Customize_Plus
 * @author    Author's name <author@mail.com>
 * @copyright 2015 Author's name
 * @license   http://www.opensource.org/licenses/bsd-license.php The BSD License
 * @version   Release: @package_version@
 * @link      http://pear.php.net/package/K6
 */
class Customize_Plus_Demo {

	/**
	 * Description for const
	 */
	const VERSION = '0.0.1';

	/**
	 * Theme prefix constant
	 */
	const PREFIX = 'CPDemo';

	/**
	 * Theme docs base url
	 */
	const DOCS_BASE_URL = 'http://pluswp.com/docs/';

	/**
	 * Settings default values
	 * @var array
	 */
	public static $settings_defaults;

	/**
	 * Constructor
	 *
	 * @since 0.0.1
	 */
	public function __construct() {
		require_once dirname( __FILE__ ) . '/vendor/tgm/plugin-activation/class-tgm-plugin-activation.php';
		add_action( 'tgmpa_register', array( __CLASS__, 'register_plugins' ) );
		add_action( 'after_setup_theme', array( __CLASS__, 'add_theme_supports' ) );
		add_action( 'PWPcp/theme/is_configured', array( __CLASS__, 'set_settings_defaults' ), 10, 1 );
		add_action( 'PWPcp/customize/register_custom_classes', array( __CLASS__, 'register_custom_classes' ), 20, 1 );
		add_action( 'customize_register', array( __CLASS__, 'remove_wp_defaults' ), 10, 1 );
		add_action( 'customize_controls_print_footer_scripts' , array( __CLASS__, 'customize_enqueue_js_admin' ) );
		add_action( 'customize_preview_init' , array( __CLASS__, 'customize_enqueue_js_preview' ) );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_manager' ) ); // just for demo purposes
	}

	/**
	 * Register the required plugins for this theme.
	 * This function is hooked into tgmpa_init, which is fired within the
	 * TGM_Plugin_Activation class constructor.
	 *
	 * @see http://tgmpluginactivation.com/configuration/
	 * @since 0.0.1
	 */
	public static function register_plugins() {
		$plugins = array(
			array(
				'name'             => 'Customize Plus',
				'slug'             => 'customize-plus',
				'version'          => '0.0.1',
				'required'         => true,
				'force_activation' => true,
			),
			array(
				'name'             => 'Customize Plus Premium',
				'slug'             => 'customize-plus-premium',
				'version'          => '0.0.1',
				'required'         => true, // @@note once released this should be false ... ? \\
				'force_activation' => true, // @@note once released this should be false ... ? \\
			),
		);

		$config = array(
			'id'           => 'tgmpa',                 // Unique ID for hashing notices for multiple instances of TGMPA.
			'default_path' => '',                      // Default absolute path to bundled plugins.
			'menu'         => 'tgmpa-install-plugins', // Menu slug.
			'message'      => '',                      // Message to output right before the plugins table.
		);
		tgmpa( $plugins, $config );
	}

	/**
	 * Add Theme Support
	 *
	 * @since 0.0.1
	 */
	public static function add_theme_supports() {

		// Customize Plus settings
		add_theme_support( 'PWPcp-customize', array(
			'prefix' => self::PREFIX,
			'customize_tree' => self::get_customize_tree(),
			'images_base_url' => get_stylesheet_directory_uri() . '/images/',
			'docs_base_url' => self::DOCS_BASE_URL,
			// *** Customize Plus Premium ***
			'styles' => array(
				array(
					'id' => self::PREFIX . '-example',
					'dependencies' => array(),
					'version' => self::VERSION,
					'path_uncompiled' => '/styles/theme.less',
				),
			)
		) );

		// *** Customize Plus Premium ***
		add_theme_support( 'PWPcp-components', array(
			'compiler' => array(
				'required' => true,
			),
			'advanced' => array(
				'required' => true,
			),
			'screenpreview' => array(
				'required' => true,
			),
			'resizer' => array(
				'activate_on_theme_switch' => true,
			),
			'search' => array(
				'activate_on_theme_switch' => true,
			),
			'import' => array(
				'activate_on_theme_switch' => true,
			),
			'export' => array(
				'activate_on_theme_switch' => true,
			),
			'editor' => array(
				'activate_on_theme_switch' => true,
			),
			'info' => array(
				'activate_on_theme_switch' => true,
			),
		) );
	}

	/**
	 * Set settings default value on static property
	 *
	 * @since 0.0.1
	 * @param array $settings_defaults
	 */
	public static function set_settings_defaults( $settings_defaults ) {
		self::$settings_defaults = $settings_defaults;
	}

	/**
	 * Add custom controls / settings / sections / panels classes
	 * to the Customize (we extend Customize Plus, so we use its hook).
	 *
	 * @since  0.0.1
	 * @param $customize_plus {PWPcp_Customize} Customize Plus Customize instance
	 */
	public static function register_custom_classes( $customize_plus ) {
		// require_once( get_stylesheet_directory() . '/class-customize-classes.php' );
		// $customize_plus::register_custom_types( array(
		// 	'controls' => array(
		// 		'pwppbs_layout_columns' => 'PWPpbs_Customize_Control_Layout_Columns',
		// 	)
		// ) );
	}

	/**
	 * Get customize tree
	 *
	 * @since  0.0.1
	 * @return array
	 */
	public static function get_customize_tree() {
		$customize_tree_theme = (array) require( get_stylesheet_directory() . '/options-demo.php' );
		return $customize_tree_theme;
	}

	/**
	 * Remove default WordPress panel/sections
	 *
	 * check here: http://wordpress.stackexchange.com/a/161110/25398
	 *
	 * @since  0.0.1
	 * @param {WP_Customize_Manager} $wp_customize Theme Customizer object
	 */
	public static function remove_wp_defaults( $wp_customize ) {
		$wp_customize->remove_panel( 'nav_menus' );
		$wp_customize->remove_panel( 'widgets' );
		$wp_customize->remove_section( 'colors' );
		$wp_customize->remove_section( 'static_front_page' );
		$wp_customize->remove_section( 'title_tagline' );
		$wp_customize->remove_section( 'background_image' );
		$wp_customize->remove_section( 'header_image' );
		$wp_customize->remove_control( 'background_color' );
		$wp_customize->remove_control( 'header_textcolor' );
	}

	/**
	 * Enqueue js in the admin page of the customize
	 *
	 * @since  0.0.1
	 */
	public static function customize_enqueue_js_admin() {
		wp_enqueue_style( self::PREFIX . '-customize', get_template_directory_uri() . '/styles/customize.css', array( 'PWPcp-customize', 'PWPcpp-customize' ), self::VERSION, false );
		wp_enqueue_script( self::PREFIX . '-customize', get_template_directory_uri() . '/scripts/customize.js', array( 'json2', 'underscore', 'jquery', 'PWPcp-customize', 'PWPcpp-customize' ), self::VERSION, false );
	}

	/**
	 * Enqueue js in the theme preview of the customize
	 *
	 * @since  0.0.1
	 */
	public static function customize_enqueue_js_preview() {
		wp_enqueue_script( self::PREFIX . '-customize', get_template_directory_uri() . '/scripts/customize-preview.js', array( 'jquery', 'customize-preview', 'PWPcp-customize-preview' ), self::VERSION, true );
	}

	/**
	 * Safe get theme mod with default fallback
	 *
	 *
	 * @since  0.0.1
	 * @param string $opt_name
	 * @return ?
	 */
	public static function get_theme_mod( $opt_name ) {
		if ( isset( self::$settings_defaults[ $opt_name ] ) ) {
			return get_theme_mod( $opt_name, self::$settings_defaults[ $opt_name ] );
		} else {
			return get_theme_mod( $opt_name );
		}
	}

	/**
	 * Enqueue default style.css and bootstrap files requried only for this demo
	 *
	 * @since 0.0.1
	 */
	public static function enqueue_manager() {
		wp_enqueue_script( self::PREFIX . '-bootstrap', get_template_directory_uri() . '/scripts/bootstrap.js', array( 'jquery' ) );
		wp_enqueue_style( self::PREFIX . '-bootstrap', get_template_directory_uri() . '/styles/bootstrap.css' );
		wp_enqueue_style( self::PREFIX . '-theme', get_template_directory_uri() . '/style.css', array(), self::VERSION );
	}
}

new Customize_Plus_Demo;