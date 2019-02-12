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
	 * @inheritdoc
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
	 * {@inheritdoc}. Override it here in order to implicitly allow float numbers
	 * if input_attrs['step'] is a float number. Check also that the given units
	 * are supported and always transform is value in an array.
	 *
	 * @since 1.0.0
	 * @override
	 */
	public function __construct( $manager, $id, $args = array() ) {
		if ( isset( $args['input_attrs'] ) && isset( $args['input_attrs']['step'] ) && is_float( $args['input_attrs']['step'] ) ) {
			$args['input_attrs']['float'] = true;
		}

		if ( isset( $args['units'] ) && ! empty( $args['units'] ) ) {
			$args['units'] = KKcp_SanitizeJS::item_in_array( true, $args['units'], self::$allowed_units );
			if ( is_string( $args['units'] ) ) {
				$args['units'] = array( $args['units'] );
			}
		}

		parent::__construct( $manager, $id, $args );
	}

	/**
	 * @since  1.0.0
	 * @inheritdoc
	 */
	public function get_l10n() {
		return array(
			'vSliderMissingUnit' => esc_html__( 'A CSS unit must be specified' ),
			'vSliderUnitNotAllowed' => esc_html__( 'CSS unit **%s** is not allowed here' ),
			'vSliderNoUnit' => esc_html__( 'It does not accept a CSS unit' ),
		);
	}

	/**
	 * @since  1.0.0
	 * @inheritdoc
	 */
	public function enqueue() {
		wp_enqueue_script( 'jquery-ui-slider' );
	}

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected function add_to_json() {
		if ( ! empty( $this->units ) ) {
			$this->json['units'] = $this->units;
		}
	}

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::slider( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::slider( $validity, $value, $setting, $control );
	}
}

// Register on WordPress Customize global object
$wp_customize->register_control_type( 'KKcp_Customize_Control_Slider' );