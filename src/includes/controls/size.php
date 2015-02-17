<?php // @partial
/**
 * Size Control custom class
 *
 * @since  0.0.1
 */
class K6CP_Customize_Control_Size extends K6CP_Customize_Control_Base {

	public $type = 'k6cp_size';

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['id'] = $this->id;
		$this->json['attrs'] = $this->input_attrs;
		$this->json['expr'] = $this->is_value_an_expression() ? $this->value() : '';
	}

	/**
	 * Check if the current value is an expression
	 * or a simple unit based value ('px', 'em', '%', etc.)
	 *
	 * @since 0.0.1
	 * @return boolean
	 */
	private function is_value_an_expression () { // k6todo \\
		if ( preg_match( '/@[a-z-0-9\_]+/i', $this->value() ) ) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Render a JS template for the content of the slider control.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl() {
			/*<div class="switch-toggle k6-switch switch-2">
				<input id="k6cp_size-choice_{{ data.id }}" type="radio" value="custom" name="_customize-k6cp_size-custom-{{ data.id }}" <# if (data.value===data.isExpr) { #>checked<# } #>>
				<label for="k6cp_size-custom-{{ data.id }}" onclick=""><?php _e( 'Custom', 'pkgtextdomain' ); ?></label>
				<input id="k6cp_size-choice_{{ data.id }}" type="radio" value="expr" name="_customize-k6cp_size-expr-{{ data.id }}" <# if (data.value!==data.isExpr) { #>checked<# } #>>
				<label for="k6cp_size-expression-{{ data.id }}" onclick=""><?php _e( 'Expression', 'pkgtextdomain' ); ?></label>
				<a></a>
			</div>*/
		?>
		<label>
			<?php $this->js_tpl_header(); ?>
			<div class="k6-input-group">
        <input type="text" class="k6-input k6-expr-input" value="<?php // filled through js: `control.setting()` ?>" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #>>
        <span class="k6-input-group-btn">
          <button class="button button-small k6-btn k6-expr-btn" type="button"><?php _e( 'Apply', 'pkgtextdomain' ); ?></button>
        </span>
      </div>
			<small class="k6-expr-feedback"></small>
		</label>
		<?php
	}
}