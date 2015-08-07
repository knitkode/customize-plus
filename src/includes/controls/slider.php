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
		<div class="pwpcp-unit-wrap">
			<input type="number" class="pwpcp-slider-number" value="{{ data.number }}" tabindex="-1" <# var p = data.attrs; for (var key in p) { if (p.hasOwnProperty(key)) { #>{{ key }}="{{ p[key] }}" <# } } #>>
			<div class="pwpcp-unit-wrap"><# for (var i = 0, l = data.units.length; i < l; i++) { #><span class="pwpcp-unit<# if ( data.units[i] === data.unit ) { #> pwpcp-current<# } #>">{{ data.units[i] }}</span><# } #></div>
		</div>
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
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Slider' );