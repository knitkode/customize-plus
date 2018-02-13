<?php // @partial
/**
 * Checkbox Control custom class
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
class KKcp_Customize_Control_Checkbox extends KKcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_checkbox';

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		$this->json['attrs'] = $this->input_attrs;
	}

	/**
	 * Render a JS template for the content of the text control.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl() {
		?>
			<?php $this->js_tpl_header(); ?>
			<label>
				<input type="checkbox" name="_customize-kkcp_checkbox-{{ data.id }}" value="<?php // filled through js ?>" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #> <# if (data.value) { #>checked<# } #>>
				<# if (data.attrs.label) { #>{{{ data.attrs.label }}}<# } #>
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
		return KKcp_Sanitize::checkbox( $value, $setting, $control );
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
		return KKcp_Validate::checkbox( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Checkbox' );