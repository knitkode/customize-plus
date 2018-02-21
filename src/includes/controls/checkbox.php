<?php // @partial
/**
 * Checkbox Control custom class
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
class KKcp_Customize_Control_Checkbox extends KKcp_Customize_Control_Base {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_checkbox';

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected $allowed_input_attrs = array(
		'label' => array( 'sanitizer' => 'string' ),
	);

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	public function get_l10n() {
		return array(
			'vCheckbox' => esc_html__( 'It must be either checked or unchecked' ),
		);
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function js_tpl() {
		?>
			<?php $this->js_tpl_header(); ?>
			<label>
				<input type="checkbox" name="_customize-kkcp_checkbox-{{ data.id }}" value="<?php // filled through js ?>" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #> <# if (data.value) { #>checked<# } #>>
				<# if (data.attrs && data.attrs.label) { #>{{{ data.attrs.label }}}<# } #>
			</label>
		<?php
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::checkbox( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::checkbox( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Checkbox' );