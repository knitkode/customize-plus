<?php // @partial
/**
 * Slider Control custom class
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
class PWPcp_Customize_Control_Slider extends PWPcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_slider';

	/**
	 * Float numbers allowed
	 *
	 * @since 0.0.1
	 * @var boolean
	 */
	public $allowFloat = false;

	/**
	 * Units
	 *
	 * @since  0.0.1
	 * @var array
	 */
	public $units = array( 'px' );

	/**
	 * Enqueue libraries
	 *
	 * @since  0.0.1
	 */
	public function enqueue() {
		wp_enqueue_script( 'jquery-ui-slider' );
	}

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['number'] = PWPcp_Sanitize::extract_number( $this->value(), $this );

		if ( is_array( $this->input_attrs ) && ! empty( $this->input_attrs ) ) {
			$this->json['attrs'] = $this->input_attrs;
		}

		if ( ! empty( $this->units ) ) {
			$this->json['units'] = $this->units;
			$this->json['unit'] = PWPcp_Sanitize::extract_size_unit( $this->value(), $this );
		}

		// allowFloat also if input_attrs['step'] is a float number
		if ( $this->allowFloat ||
			( is_array( $this->input_attrs ) &&
				isset(  $this->input_attrs['step'] ) &&
				is_float( $this->input_attrs['step'] ) )
		) {
			$this->json['allowFloat'] = true;
		}
	}

	/**
	 * Separate the slider template to make it reusable by child classes
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_slider() {
		?>
		<# if (data.units) { #>
		<div class="pwpcp-inputs-wrap">
			<input type="number" class="pwpcp-slider-number" value="{{ data.number }}" tabindex="-1" <# var p = data.attrs; for (var key in p) { if (p.hasOwnProperty(key)) { #>{{ key }}="{{ p[key] }}" <# } } #>>
			<div class="pwpcp-unit-wrap"><# for (var i = 0, l = data.units.length; i < l; i++) { #><input type="text" class="pwpcp-unit" readonly="true" tabindex="-1" value="{{ data.units[i] }}"><# } #></div>
		</div>
		<# } else { #>
		<input type="number" class="pwpcp-slider-number" value="{{ data.number }}" tabindex="-1" <# var p = data.attrs; for (var key in p) { if (p.hasOwnProperty(key)) { #>{{ key }}="{{ p[key] }}" <# } } #>>
		<# } #>
		<div class="pwpcp-slider-wrap">
			<div class="pwpcp-slider"></div>
		</div>
		<?php
	}

	/**
	 * Render a JS template for the content of the slider control.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl() {
		$this->js_tpl_header();
		$this->js_tpl_slider();
	}

	/**
	 * Get localized strings
	 *
	 * @override
	 * @since  0.0.1
	 * @return array
	 */
	public function get_l10n() {
		return array(
			'vInvalidUnit' => __( 'The CSS unit is invalid.', 'pkgTextdomain' ),
		);
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
		$number = PWPcp_Sanitize::extract_number( $value, $control );

		if ( $number ) {
			// unit can also be an empty string, useful for sliders without units
			$unit = PWPcp_Sanitize::extract_size_unit( $value, $control );
			return PWPcp_Sanitize::number( $number, $control ) . $unit;
		} else {
			return $setting->default;
		}
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Slider' );