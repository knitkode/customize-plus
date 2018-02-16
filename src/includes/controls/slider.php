<?php // @partial
/**
 * Slider Control custom class
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
class KKcp_Customize_Control_Slider extends KKcp_Customize_Control_Base {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_slider';

	/**
	 * Float numbers allowed
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	public $allowFloat = false;

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
	public static $allowed_units = KKcp_Utils::CSS_UNITS;

  /**
   * Constructor
   *
   * {@inheritDoc}. Override it here in order to manually populate the
   * `valid_choices` property from the 'globally' defined sets filtered with
   * the given `choices` param.
   *
   * @since 1.0.0
   * @override
   */
  public function __construct( $manager, $id, $args = array() ) {
    parent::__construct( $manager, $id, $args );

    // allowFloat also if input_attrs['step'] is a float number
		if ( isset( $this->input_attrs['step'] ) && is_float( $this->input_attrs['step'] ) ) {
			$this->allowFloat = true;
		}
  }

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	public function get_l10n() {
		return array(
			'vSliderMissingUnit' => esc_html__( 'A CSS unit must be specified.' ),
			'vSliderInvalidUnit' => esc_html__( 'The CSS unit is invalid.' ),
			'vSliderNoUnit' => esc_html__( 'This value does not accept a CSS unit.' ),
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
		if ( is_array( $this->input_attrs ) && ! empty( $this->input_attrs ) ) {
			$this->json['attrs'] = $this->input_attrs;
		}

		$this->json['allowFloat'] = KKcp_SanitizeJS::bool( $this->allowFloat );

		if ( ! empty( $this->units ) ) {
			$this->json['units'] = KKcp_SanitizeJS::in_array( $this->units, self::$allowed_units );
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
			<input type="number" class="kkcp-slider-number" value="<?php // filled through js ?>" tabindex="-1" <# var p = data.attrs; for (var key in p) { if (p.hasOwnProperty(key)) { #>{{ key }}="{{ p[key] }}" <# } } #>>
			<div class="kkcp-unit-wrap"><# for (var i = 0, l = data.units.length; i < l; i++) { #><input type="text" class="kkcp-unit" readonly="true" tabindex="-1" value="{{ data.units[i] }}"><# } #></div>
		</div>
		<# } else { #>
		<input type="number" class="kkcp-slider-number" value="<?php // filled through js ?>" tabindex="-1" <# var p = data.attrs; for (var key in p) { if (p.hasOwnProperty(key)) { #>{{ key }}="{{ p[key] }}" <# } } #>>
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