<?php // @partial
/**
 * Color Control custom class
 *
 * @since  0.0.1
 */
class K6CP_Customize_Control_Color extends K6CP_Customize_Control_Base {

	public $type = 'k6_color';

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
		$custom_color_rgba = k6cp_sanitize_coloralpha( $value );
		if ( $custom_color_rgba ) {
			// hex color is valid, so we have a Custom Color
			$this->json['valueCSS'] = $custom_color_rgba;
			return;
		}

		// Dynamic Color
		$this->json['mode'] = 'dynamic';
		$this->json['valueCSS'] = k6cp_parse_value_with_preprocessor( $value, true );

		// check for a simple variable
		$simple_variable = k6cp_sanitize_var( $value, true );
		if ( $simple_variable ) {
			$this->json['varName'] = $simple_variable;
			$this->json['expr'] = $simple_variable;
			return;
		}

		// check for a simple function
		$simple_function = k6cp_sanitize_var_with_function( $value, true );
		if ( $simple_function ) {
			$dynamic_args = k6cp_sanitize_var_with_function( $value, true );
			$this->json['functionName'] = $simple_function[1];
			$this->json['varName'] = $simple_function[2];
			$this->json['amount'] = (float) $simple_function[3];
			$this->json['expr'] = $simple_function[1] . '(@' . $simple_function[2] . ', ' . $simple_function[3] . '%)';
			return;
		}

		// otherwise is just a complicated custom expression
		$this->json['expr'] = $value;
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
			<a href="javascript:void(0)" class="k6-color-toggle k6-color-dynamic"><?php _e( 'Dynamic', 'pkgTextdomain' ) ?></a>
			<a href="javascript:void(0)" class="k6-color-toggle k6-color-transparent"><?php _e( 'Transparent', 'pkgTextdomain' ) ?></a>
			<div class="k6-color-control">
				<label class="k6-color-var">
					<i><?php _e( 'Grab existing color from setting:', 'pkgTextdomain' ) ?></i>
					<select class="k6-color-var-select k6-select" name="varName">
						<option value="" <# if (data.varName==='') { #>selected <# } #>><?php _e( 'None', 'pkgTextdomain' ) ?></option>
					</select>
				</label>
				<label class="k6-color-function">
					<i><?php _e( 'Apply function:', 'pkgTextdomain' ) ?></i>
					<select class="k6-color-function-select" name="function">
						<option value="" <# if (data.functionName==='') { #>selected <# } #>><?php _e( 'None', 'pkgTextdomain' ) ?></option>
					</select>
				</label>
				<label class="k6-color-amount">
					<i><?php _e( 'Amount %:', 'pkgTextdomain' ) ?></i>
					<span>
						<input class="k6-color-amount-input" name="amount" type="number" min="1" max="100" placeholder="0" value="{{ data.amount }}">
					</span>
				</label>
				<label class="k6-color-expr">
					<i><?php _e( 'Or write a custom expression:', 'pkgTextdomain' ); ?></i>
					<div class="k6-input-group">
		        <input type="text" class="k6-input k6-expr-input" value="<?php // filled through js: `control.setting()` ?>">
		        <span class="k6-input-group-btn">
		          <button class="button button-small k6-btn k6-expr-btn" type="button"><?php _e( 'Apply', 'pkgtextdomain' ); ?></button>
		        </span>
		      </div>
	        <small class="k6-expr-feedback"></small>
				</label>
			</div>
			<div class="k6-color-message-wrap k6-color-text"><?php _e( 'Value dependent on:', 'pkgTextdomain' ) ?> <a class="k6-color-message" tabindex="-1" href="javascript:void(0)">{{ data.varName }}</a></div>
		</div>
		<?php
	}
}