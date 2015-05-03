<?php // @partial
/**
 * Slider Control custom class
 *
 * @since  0.0.1
 */
class PWPcp_Customize_Control_Slider extends PWPcp_Customize_Control_Base {

	public $type = 'pwpcp_slider';
	public $units = array( 'px' );

	/**
	 * [enqueue description]
	 * @return [type] [description]
	 */
	public function enqueue() {
		wp_enqueue_script( 'jquery-ui-slider' );
	}

	/**
	 * [get_unit_from_value description]
	 * @return [type] [description]
	 */
	private function get_unit_from_value() {
		foreach ( $this->units as $unit ) {
			if ( false != strpos( $this->value(), $unit ) ) {
				return $unit;
			}
		}
	}

	/**
	 * [get_number_from_value description]
	 * @return [type] [description]
	 */
	private function get_number_from_value() {
		return preg_replace( '/[^0-9,.]/', '', $this->value() );
	}

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['units'] = $this->units;
		$this->json['number'] = $this->get_number_from_value();
		$this->json['unit'] = $this->get_unit_from_value();
		$this->json['attrs'] = $this->input_attrs;
	}

	/**
	 * Separate the slider template to make it reusable by child classes
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_slider() {
		?>
		<div class="k6-unit-wrap">
			<input type="number" class="k6-slider-number" value="{{ data.number }}" tabindex="-1" <# var p = data.attrs; for (var key in p) { if (p.hasOwnProperty(key)) { #>{{ key }}="{{ p[key] }}" <# } } #>>
			<div class="k6-unit-wrap"><# for (var i = 0, l = data.units.length; i < l; i++) { #><span class="k6-unit<# if ( data.units[i] === data.unit ) { #> k6-current<# } #>">{{ data.units[i] }}</span><# } #></div>
		</div>
		<div class="k6-slider-wrap">
			<div class="k6-slider"></div>
		</div>
		<?php
	}

	/**
	 * Render a JS template for the content of the slider control.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?>
			<?php $this->js_tpl_slider(); ?>
		</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Slider' );