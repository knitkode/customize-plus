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
	protected static $selectize_allowed_options = array(
		'plugins' => array( 'sanitizer' => 'js_array', 'values' => array(
			'drag_drop',
			'remove_button'
		) ),
		'persist' => array( 'sanitizer' => 'js_bool' ),
		'hideSelected' => array( 'sanitizer' => 'js_bool' ),
		'sortField' => array( 'sanitizer' => 'js_string' ),
	);

	/**
	 * Icons set supported
	 *
	 * @since 1.0.0
	 * @var array
	 */
	protected static $supported_icons_set = array(
		'dashicons'
	);

	public function __construct( $manager, $id, $args = array() ) {

		if ( isset( $args[ 'icons_set' ] ) && is_string( $args[ 'icons_set' ] ) && in_array( $args[ 'icons_set' ], self::$supported_icons_set ) ) {

			$icons_set_values = self::get_iconset( $args[ 'icons_set' ] );
			$this->choices = self::get_choices_from_icon_set( $icons_set_values );
		}

		parent::__construct( $manager, $id, $args );
	}

	/**
	 * Get icon set array
	 *
	 * @since 1.0.0
	 * @param string  $name
	 * @return array
	 */
	private static function get_iconset ( $name ) {
		if ( $name === 'dashicons' ) {
			return KKcp_Utils::get_dashicons();
		}

		return [];
	}

	/**
	 * Get choices from icon set array
	 *
	 * @since 1.0.0
	 * @param array  $icon_set
	 * @return array
	 */
	private static function get_choices_from_icon_set ( $icon_set ) {
		$choices = array();

		foreach ( $icon_set as $group_key => $group_values )  {
			$icons = $group_values['icons'];

			foreach ( $icons as $icon )  {
				array_push( $choices, $icon );
			}
		}

		return $choices;
	}

	/**
	 * Get js constants
	 *
	 * {@inheritdoc}
	 * @since  1.0.0
	 * @override
	 */
	public function get_constants() {
		$constants = array();

		foreach ( self::$supported_icons_set as $icon_set ) {
			$constants[ $icon_set ] = self::get_iconset( $icon_set );
		}

		return $constants;
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
	 * We don't print here the `choices` param in order to avoid defining it
	 * in each icon php control that would print a lot of duplicated JSON data.
	 * We just define it globally.
	 * @see `icon.js` control.
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		$this->json['max'] = KKcp_Sanitize::js_int_or_null( $this->max );
		$this->json['min'] = KKcp_Sanitize::js_int_or_null( $this->min );

		if ( ! empty( $this->selectize ) ) {
			$this->json['selectize'] = KKcp_Sanitize::js_options( $this->selectize, self::$selectize_allowed_options );
		}
		if ( isset( $this->icons_set ) && is_string( $this->icons_set ) && in_array( $this->icons_set, self::$supported_icons_set ) ) {
			$this->json['icons_set'] = KKcp_Sanitize::js_string( $this->icons_set );
		} else {
			$this->json['icons_set'] = KKcp_Sanitize::js_string( self::$supported_icons_set[0] );
		}
		// @@doubt support multiple icon sets?
		// if ( is_array( $this->icons_set ) ) {
		// 	$this->json['icons_set'] = array();
		// 	foreach ( $this->icons_set as $icons_set_code => $icons_set_label ) {
		// 		if ( in_array( $icons_set_code, self::$supported_icons_set ) ) {
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
		<select class="kkcp-selectize" value="{{ data.value }}" placeholder="<?php esc_html_e( 'Search icon by name...' ) ?>"<# if (data.max > 1) { #>  name="icon[]" multiple<# } else { #>name="icon"<# } #>><option value=""><?php esc_html_e( 'Search icon by name...' ) ?></option></select>
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