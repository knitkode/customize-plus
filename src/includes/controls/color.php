<?php // @partial
/**
 * Color Control custom class
 *
 * @since  0.0.1
 */
class K6CP_Customize_Control_Color extends K6CP_Customize_Control_Base {

	public $type = 'k6cp_color';

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
			// 'allowAlpha' => true // k6todo \\
			// 'disallowTransparent' => true // k6todo \\
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
		$custom_color_hex = k6cp_sanitize_hex_color( $value );
		if ( $custom_color_hex ) {
			// hex color is valid, so we have a Custom Color
			$this->json['valueCSS'] = $custom_color_hex;
			return;
		}

		// check for a rgba color string
		$custom_color_rgba = k6cp_sanitize_alpha_color( $value );
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
		<label>
			<?php $this->js_tpl_header(); ?>
		</label>
		<div class="customize-control-content k6-color" data-k6-color-mode="{{ data.mode }}" <# if (data.transparent ) { #>data-k6-transparent<# } #>>
			<input class="color-picker-hex" type="text" <# if (!data.allowAlpha ) { #>maxlength="7"<# } #> placeholder="<?php _e( 'Value', 'pkgTextdomain' ) ?>" />
			<a href="javascript:void(0)" class="k6-color-toggle k6-color-transparent"><?php _e( 'Transparent', 'pkgTextdomain' ) ?></a>
		</div>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'K6CP_Customize_Control_Color' );