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
class KKcp_Customize_Control_Icon extends KKcp_Customize_Control_Base_Set {

	/**
	 * @override
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_icon';

	/**
	 * @override
	 * @since 1.0.0
	 * @var array
	 */
	public $choices = array( 'dashicons' );

	/**
	 * @override
	 * @since 1.0.0
	 * @var array
	 */
	protected $supported_sets = array(
		'dashicons'
	);

  /**
   * @override
   * @since 1.0.0
   * @var string
   */
  protected $set_js_var = 'iconSets';

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
	 * Get set by the given name
	 *
	 * @override
	 * @since  1.0.0
	 * @return array
	 */
	protected function get_set ( $name ) {
		if ( $name === 'dashicons' ) {
			return KKcp_Utils::get_dashicons();
		}

		return [];
	}

	// @@todo override validation with custom messages
	/**
	 * Get l10n
	 *
	 * {@inheritdoc}
	 * @since  1.0.0
	 * @override
	 */
	// public function get_l10n() {
	// 	return array(
	// 		'vIconMaxSingular' => esc_html__( 'You can select maximum 1 icon' ),
	// 		'vIconMaxPlural' => esc_html__( 'You can select maximum %s icons' ),
	// 	);
	// } \\

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
	// protected function add_to_json() {
	// 	$this->json['max'] = KKcp_Sanitize::js_int_or_null( $this->max );
	// 	$this->json['min'] = KKcp_Sanitize::js_int_or_null( $this->min );

	// 	if ( ! empty( $this->selectize ) ) {
	// 		$this->json['selectize'] = KKcp_Sanitize::js_options( $this->selectize, self::$selectize_allowed_options );
	// 	}
	// 	// @@doubt support multiple icon sets?
	// 	// if ( is_array( $this->icons_set ) ) {
	// 	// 	$this->json['icons_set'] = array();
	// 	// 	foreach ( $this->icons_set as $icons_set_code => $icons_set_label ) {
	// 	// 		if ( in_array( $icons_set_code, self::$supported_icons_set ) ) {
	// 	// 			array_push( $this->json['icons_set'], $icons_set_code );
	// 	// 		}
	// 	// 	}
	// 	// } \\
	// }

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
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Icon' );