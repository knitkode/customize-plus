<?php // @partial
/**
 * Textarea Control custom class
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     PlusWP <dev@pluswp.com> (https://pluswp.com)
 * @copyright  2017 PlusWP
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://pluswp.com/customize-plus
 */
class PWPcp_Customize_Control_Textarea extends PWPcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_textarea';

	/**
	 * Allow HTML inside textarea (default = `false`)
	 * @var boolean
	 */
	protected $allowHTML = false;

	/**
	 * Enable TinyMCE textarea (default = `false`)
	 * @var boolean|array
	 */
	protected $wp_editor = false;

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['attrs'] = $this->input_attrs;
		if ( $this->allowHTML ) {
			$this->json['allowHTML'] = $this->allowHTML;
		}
		if ( $this->wp_editor ) {
			$this->json['wp_editor'] = $this->wp_editor;
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
			<?php $this->js_tpl_header(); ?><# var a = data.attrs; #>
			<textarea class="pwpcpui-textarea" <# for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #> rows="4"><?php // filled through js ?></textarea>
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
		// always cast to string
		$value = (string) $value;

		$html_is_allowed = $control->allowHTML || $control->wp_editor;

		if ( $html_is_allowed ) {
			return wp_kses_post( $value );
		} else {
			return wp_strip_all_tags( $value );
		}
		return $value;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Textarea' );