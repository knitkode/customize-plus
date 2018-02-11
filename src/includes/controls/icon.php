<?php // @partial
/**
 * Icon Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Customize_Control_Icon extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_icon';

	/**
	 * Option to allow a maxmimum icons selection
	 *
	 * @since 1.0.0
	 * @var ?int
	 */
	protected $max = 1;

	/**
	 * Option to allow a minimum icons selection
	 *
	 * @since 1.0.0
	 * @var ?int
	 */
	protected $min = null;

	/**
	 * Selectize disabled (`false`) or enabled (just `true` or array of options)
	 *
	 * @since 1.0.0
	 * @var boolean|array
	 */
	protected $selectize = array();

	/**
	 * Selectize allowed options
	 *
	 * Sanitize methods must be class methods of `KKcp_Sanitize` or global
	 * functions
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public static $selectize_allowed_options = array(
		'plugins' => array( 'sanitizer' => 'js_array', 'values' => array(
			'drag_drop',
			'remove_button'
		) ),
		'persist' => array( 'sanitizer' => 'js_bool' ),
		'hideSelected' => array( 'sanitizer' => 'js_bool' ),
		'sortField' => array( 'sanitizer' => 'js_string' ),
	);

	/**
	 * Icons set
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $supported_icons_set = array(
		'dashicons'
	);

	/**
	 * Get an array of all available dashicons.
	 *
	 * @static
	 * @access public
	 * @return array
	 */
	public static function get_dashicons() {
		return KKcp_Utils::get_dashicons();
	}

	/**
	 * Set dashicons array as a constant to use in javascript
	 *
	 * @override
	 * @since  1.0.0
	 * @return array
	 */
	public function get_constants() {
		return array(
			'dashicons' => self::get_dashicons(),
		);
	}

	/**
	 * Get l10n
	 *
	 * {@inheritdoc}
	 * @since  1.0.0
	 * @override
	 */
	public function get_l10n() {
		return array(
			'vIconMaxSingular' => esc_html__( 'You can select maximum 1 icon' ),
			'vIconMaxPlural' => esc_html__( 'You can select maximum %s icons' ),
		);
	}

	/**
	 * Add values to JSON params
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		$this->json['max'] = KKcp_Sanitize::js_int_or_null( $this->max );
		$this->json['min'] = KKcp_Sanitize::js_int_or_null( $this->min );

		if ( ! empty( $this->selectize ) ) {
			$this->json['selectize'] = KKcp_Sanitize::js_options( $this->selectize, self::$selectize_allowed_options );
		}
		if ( isset( $this->icons_set ) && is_string( $this->icons_set ) && in_array( $this->icons_set, $this->supported_icons_set ) ) {
			$this->json['icons_set'] = KKcp_Sanitize::js_string( $this->icons_set );
		} else {
			$this->json['icons_set'] = KKcp_Sanitize::js_string( $this->supported_icons_set[0] );
		}
		// @@doubt support multiple icon sets?
		// if ( is_array( $this->icons_set ) ) {
		// 	$this->json['icons_set'] = array();
		// 	foreach ( $this->icons_set as $icons_set_code => $icons_set_label ) {
		// 		if ( in_array( $icons_set_code, $this->supported_icons_set ) ) {
		// 			array_push( $this->json['icons_set'], $icons_set_code );
		// 		}
		// 	}
		// } \\
	}

	/**
	 * Render a JS template for the content of the control.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?>
		</label>
		<select class="kkcp-selectize" value="{{ data.value }}" placeholder="Search by name..." name="icon[]" multiple><option value="">Search icon by name...</option></select>
		<!-- <div class="kkcp-icon-wrap"><?php // filled through js ?></div> -->
		<?php
	}

	/**
	 * Sanitize
	 *
	 * @since 1.0.0
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::one_or_more_choices( $value, $setting, $control );
	}

	/**
	 * Validate
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::one_or_more_choices( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Icon' );