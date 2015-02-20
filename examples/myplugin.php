<?php defined( 'ABSPATH' ) or die;

class MyPlugin {
	/**
	 * Retain the Customize Plus Manager instance
	 * @var [type]
	 */
	public static $customize;

	/**
	 * Constructor
	 */
	public function __construct() {
		// add_action( 'k6cp/ready/plugins', array( __CLASS__, 'add_options' ) );
		add_action( 'plugins_loaded', array( __CLASS__, 'add_options' ) );
		add_action( 'wp_head', array( __CLASS__, 'test_option' ) );
	}

	/**
	 * Get the customize panels
	 *
	 * You can use @link(http://wpkuus.com/customize-plus/builder, the builder)
	 * interface to build your option panels.
	 *
	 * @return array The customize panels
	 */
	private static function get_customize_panels() {
		return array(
			'sutrial' => array(
				'title' => __( 'Sutrial options', 'pkgTextdomain' ),
				'description' => __( 'Sutrial options settings panel', 'pkgTextdomain' ),
				'sections' => array(
					'sutrial--section' => array(
						'title' => __( 'Sutrial options section', 'pkgTextdomain' ),
						'fields' => array(
							'sutrial-value' => array(
								'setting' => array(
									'default' => 'three',
									'transport' => 'recompileRefresh',
								),
								'control' => array(
									'label' => __( 'Sutrial option control', 'pkgTextdomain' ),
									'type' => 'k6cp_radio',
									'choices' => array(
										'one' => __( 'One', 'pkgTextdomain' ),
										'two' => __( 'Two', 'pkgTextdomain' ),
										'three' => __( 'Three', 'pkgTextdomain' ),
										'four' => __( 'Four', 'pkgTextdomain' ),
										'five' => __( 'Five', 'pkgTextdomain' ),
									)
								)
							)
						)
					)
				)
			)
		);
	}

	/**
	 * Add the options to the Customize page.
	 *
	 * It instantiate a new instance of Customize Plus Manager class
	 * and set it optionally on your plugin class as a static property.
	 *
	 * If the class is not available it add an admin notice. You can also
	 * use TGM Plugin Activation here or whatever custom code you like.
	 */
	public static function add_options() {
		if ( ! class_exists( 'K6CP_Customize_Manager' ) ) {
			add_action( 'admin_notices', array( __CLASS__, 'unmet_dependencies' ) );
		} else {
			self::$customize = new K6CP_Customize_Manager( 'plugin', 'sutrial', self::get_customize_panels() );
		}
	}

	/**
	 * Just a dummy function to use to test the option with or without
	 * default value.
	 */
	public static function test_option() {
		echo '<h1>sutrial with Customize Plus API `get_option_with_default` is: ' . esc_html( self::$customize->get_option_with_default( 'sutrial-value' ) ) . '</h1>';
		echo '<h1>sutrial with WordPress api `get_option` is: ' . esc_html( get_option( 'sutrial' )[ 'sutrial-value' ] ) . '</h1>';
	}

	/**
	 * Customize Plus activation need admin notice.
	 *
	 *
	 */
	public static function unmet_dependencies() {
		echo '<div class="error"><p>' . esc_html( __( 'MyPlugin needs Customize Plus needs to be activated', 'myPluginTextDomain' ) ) . '</p></div>';
	}
}

new MyPlugin;