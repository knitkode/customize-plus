<?php // @partial
/**
 * Number Control custom class
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
class KKcp_Customize_Control_Number extends KKcp_Customize_Control_Base_Input {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_number';

	/**
	 * Float numbers allowed
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	public $allowFloat = false;

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function add_to_json() {
		parent::add_to_json();

		$this->json['allowFloat'] = KKcp_SanitizeJS::bool( $this->allowFloat );
	}

	/**
	 * @since  1.0.0
	 * @inerhitDoc
	 */
	public function get_l10n() {
		return array(
			'vNotAnumber' => esc_html__( 'This must be a number.' ),
			'vNoFloat' => esc_html__( 'This must be an integer, not a float.' ),
			'vNotAnInteger' => esc_html__( 'This must be an integer number.' ),
			'vNumberStep' => esc_html__( 'This must be a multiple of %s.' ),
			'vNumberLow' => esc_html__( 'This must be higher than %s.' ),
			'vNumberHigh' => esc_html__( 'This must be lower than %s.' ),
		);
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::number( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::number( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Number' );