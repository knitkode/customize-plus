<?php // @partial
/**
 * Tags Control custom class
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Tags extends KKcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'kkcp_tags';

	/**
	 * Selectize options
	 *
	 * @since 0.0.1
	 * @var array
	 */
	protected $selectize = array();

	/**
	 * Selectize allowed options
	 *
	 * Sanitize methods must be class methods of `KKcp_Sanitize` or global
	 * functions
	 *
	 * @since 0.0.1
	 * @var array
	 */
	public static $selectize_allowed_options = array(
		'plugins' => array( 'sanitizer' => 'js_array', 'values' => array(
			'restore_on_backspace',
			'drag_drop',
			'remove_button'
		) ),
		'maxItems' => array( 'sanitizer' => 'js_number_or_null' ),
		'persist' => array( 'sanitizer' => 'js_bool' ),
	);

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		if ( ! empty( $this->selectize ) ) {
			$this->json['selectize'] = KKcp_Sanitize::js_options( $this->selectize, self::$selectize_allowed_options );
		}
	}

	/**
	 * Render a JS template for the content of the text control.
	 *
	 * @since 0.0.1
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
	 * @since 0.0.1
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		$value = array_map( 'trim', explode( ',', $value ) );
		$value = array_unique( $value );

		if ( isset( $control->selectize['maxItems'] ) ) {
			$max_items = filter_var( $control->selectize['maxItems'], FILTER_SANITIZE_NUMBER_INT );

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