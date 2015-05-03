<?php // @partial
/**
 * Color Control custom class
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     PlusWP <dev@pluswp.com> (http://pluswp.com)
 * @copyright  2015 PlusWP (kunderi kuus)
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       http://pluswp.com/customize-plus
 */
class PWPcp_Customize_Control_Color extends PWPcp_Customize_Control_Base {

	public $type = 'pwpcp_color';

	/**
	 * Enqueue scripts/styles for the color picker.
	 *
	 * @since 0.0.1
	 */
	public function enqueue() {
		wp_enqueue_script( 'wp-color-picker' );
		wp_enqueue_style( 'wp-color-picker' );
	}

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 * Let's use early returns here. Not the cleanest anyway.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {

		// value in a variable
		$value = $this->value();

		// add input_attrs as data params (allowAlpha, disallowTransparent)
		foreach ( $this->input_attrs as $attr_key => $attr_value ) {
			// 'allowAlpha' => true // @@todo \\
			// 'disallowTransparent' => true // @@todo \\
			$this->json[ $attr_key ] = $attr_value;
		}

		// Custom Color
		$this->json['mode'] = 'custom';

		// check for transparent color
		if ( 'transparent' === $value ) {
			$this->json['transparent'] = true;
			$this->json['valueCSS'] = $value;
			return;
		}

		// check for a hex color string
		$custom_color_hex = pwpcp_sanitize_hex_color( $value );
		if ( $custom_color_hex ) {
			// hex color is valid, so we have a Custom Color
			$this->json['valueCSS'] = $custom_color_hex;
			return;
		}

		// check for a rgba color string
		$custom_color_rgba = pwpcp_sanitize_alpha_color( $value );
		if ( $custom_color_rgba ) {
			// hex color is valid, so we have a Custom Color
			$this->json['valueCSS'] = $custom_color_rgba;
			return;
		}
	}

	/**
	 * Render a JS template for the content of the control.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl() {
		?>
		<?php $this->js_tpl_header(); ?>
		<div class="pwpcpcolor" <# if (data.transparent ) { #>data-pwpcpcolor-transparent<# } #>>
			<input class="color-picker-hex" type="text" <# if (!data.allowAlpha ) { #>maxlength="7"<# } #> placeholder="<?php _e( 'Value', 'pkgTextdomain' ) ?>" />
			<a href="javascript:void(0)" class="pwpcpui-toggle pwpcpcolor-toggle-transparent"><?php _e( 'Transparent', 'pkgTextdomain' ) ?></a>
		</div>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Color' );