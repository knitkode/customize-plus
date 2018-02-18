<?php // @partial
/**
 * Tags Control custom class
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
class KKcp_Customize_Control_Tags extends KKcp_Customize_Control_Base {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_tags';

	/**
	 * Option to allow a maximum selection boundary.
	 *
	 * There is no maximum by default for this control.
	 *
	 * @since 1.0.0
	 * @var ?int
	 */
	public $max = null;

	/**
	 * Option to allow a minimum selection boundary
	 *
	 * @since 1.0.0
	 * @var ?int To set a control as optional use the `$optional` class property
	 *      		 instead of setting `$min` to `1`.
	 */
	public $min = null;

	/**
	 * Selectize options
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public $selectize = array();

	/**
	 * Selectize allowed options
	 *
	 * Sanitize methods must be class methods of `KKcp_SanitizeJS` or global
	 * functions
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public static $selectize_allowed_options = array(
		'plugins' => array( 'sanitizer' => 'array', 'values' => array(
			'restore_on_backspace',
			'drag_drop',
			'remove_button'
		) ),
		'persist' => array( 'sanitizer' => 'bool' ),
	);

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	public function get_l10n() {
		return array(
			'vTagsMin' => esc_html__( 'Minimum %s tags required' ),
			'vTagsMax' => esc_html__( 'Maximum %s tags allowed' ),
			'vTagsType' => esc_html__( 'Tags must be a string' ),
		);
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function add_to_json() {
		$this->json['max'] = KKcp_SanitizeJS::int_or_null( $this->max );
		$this->json['min'] = KKcp_SanitizeJS::int_or_null( $this->min );

		if ( ! empty( $this->selectize ) ) {
			$this->json['selectize'] = KKcp_SanitizeJS::options( $this->selectize, self::$selectize_allowed_options );
		}
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?>
			<input type="text" value="<?php // filled through js ?>">
		</label>
		<?php
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::tags( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::tags( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Tags' );