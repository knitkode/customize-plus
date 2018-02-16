<?php // @partial
/**
 * Tags Control custom class
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
class KKcp_Customize_Control_Tags extends KKcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_tags';

	/**
	 * Option to allow a maximum selection boundary
	 *
	 * @since 1.0.0
	 * @var ?int
	 */
	protected $max = null;

	/**
	 * Option to allow a minimum selection boundary
	 *
	 * @since 1.0.0
	 * @var ?int This should be `null` or a value equal or higher than 2. To set
	 *      		 a control as optional use the `$optional` class property instead
	 *      		 of setting `$min` to `1`.
	 */
	protected $min = 2;

	/**
	 * Selectize options
	 *
	 * @since 1.0.0
	 * @var array
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
			'restore_on_backspace',
			'drag_drop',
			'remove_button'
		) ),
		'persist' => array( 'sanitizer' => 'js_bool' ),
	);

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {

		$this->json['max'] = KKcp_Sanitize::js_int_or_null( $this->max );
		$this->json['min'] = KKcp_Sanitize::js_int_or_null( $this->min );

		if ( ! empty( $this->selectize ) ) {
			$this->json['selectize'] = KKcp_Sanitize::js_options( $this->selectize, self::$selectize_allowed_options );
		}
	}

	/**
	 * Render a JS template for the content of the text control.
	 *
	 * @since 1.0.0
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
		$value = array_map( 'trim', explode( ',', $value ) );
		$value = array_unique( $value );

		if ( isset( $control->max ) ) {
			$max_items = filter_var( $control->max, FILTER_SANITIZE_NUMBER_INT );

			if ( count( $value ) > $max_items ) {
				$value = array_slice( $value, $max_items );
			}
		}
		return wp_strip_all_tags( implode( ',', $value ) );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Tags' );