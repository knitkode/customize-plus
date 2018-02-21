<?php // @partial
/**
 * Slider Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2018 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Customize_Control_Slider extends KKcp_Customize_Control_Base {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_slider';

	/**
	 * @since 1.0.0
	 * @ineritDoc
	 */
	protected $allowed_input_attrs = array(
		'float' => array( 'sanitizer' => 'bool' ),
		'min' => array( 'sanitizer' => 'number' ),
		'max' => array( 'sanitizer' => 'number' ),
		'step' => array( 'sanitizer' => 'number' ),
	);

	/**
	 * Units
	 *
	 * @since  1.0.0
	 * @var array
	 */
	public $units = array( 'px' );

	/**
	 * Allowed units
	 *
	 * @since 1.0.0
	 * @var array
	 */
	protected static $allowed_units = KKcp_Data::CSS_UNITS;

	/**
	 * {@inheritDoc}. Override it here in order to implicitly allow float numbers
	 * if input_attrs['step'] is a float number. Check also that the given units
	 * are supported.
	 *
	 * @since 1.0.0
	 * @override
	 */
	public function __construct( $manager, $id, $args = array() ) {
		if ( isset( $args['step'] ) && is_float( $args['step'] ) ) {
			$args['float'] = true;
		}

		if ( isset( $args['units'] ) && ! empty( $args['units'] ) ) {
			$args['units'] = KKcp_SanitizeJS::item_in_array( false, $args['units'], self::$allowed_units );
			if ( is_string( $args['units'] ) ) {
				$args['units'] = array( $args['units'] );
			}
		}

		parent::__construct( $manager, $id, $args );
	}

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	public function get_l10n() {
		return array(
			'vSliderMissingUnit' => esc_html__( 'A CSS unit must be specified' ),
			'vSliderInvalidUnit' => esc_html__( 'CSS unit `%` is invalid' ),
			'vSliderNoUnit' => esc_html__( 'It does not accept a CSS unit' ),
		);
	}

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	public function enqueue() {
		wp_enqueue_script( 'jquery-ui-slider' );
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function add_to_json() {
		if ( ! empty( $this->units ) ) {
			$this->json['units'] = $this->units;
		}
	}

	/**
	 * {@inheritDoc}
	 *
	 * Separate the slider template to make it reusable by child classes
	 *
	 * @since 1.0.0
	 * @override
	 */
	protected function js_tpl_slider() {
		?>
		<# if (data.units) { #>
		<div class="kkcp-inputs-wrap">
			<input type="number" class="kkcp-slider-number" value="<?php // filled through js ?>" tabindex="-1"
				<# for (var key in data.attrs) { if (data.attrs.hasOwnProperty(key)) { #>{{ key }}="{{ data.attrs[key] }}" <# } } #>>
			<div class="kkcp-unit-wrap"><# for (var i = 0, l = data.units.length; i < l; i++) { #><input type="text" class="kkcp-unit" readonly="true" tabindex="-1" value="{{ data.units[i] }}"><# } #></div>
		</div>
		<# } else { #>
			<input type="number" class="kkcp-slider-number" value="<?php // filled through js ?>" tabindex="-1"
				<# for (var key in data.attrs) { if (data.attrs.hasOwnProperty(key)) { #>{{ key }}="{{ data.attrs[key] }}" <# } } #>>
			<# } #>
		<div class="kkcp-slider-wrap">
			<div class="kkcp-slider"></div>
		</div>
		<?php
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function js_tpl() {
		$this->js_tpl_header();
		$this->js_tpl_slider();
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::slider( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::slider( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Slider' );