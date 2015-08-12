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
	 * @param  string $value The control's setting value
	 * @return [type] [description]
	 */
	private static function get_unit_from( $control, $value ) {
		foreach ( $control->units as $unit ) {
			if ( false != strpos( $value, $unit ) ) {
				return $unit;
			}
		}
	}

	/**
	 * [get_number_from_value description]
	 * @param  string $value The control's setting value
	 * @return [type] [description]
	 */
	private static function get_number_from( $value ) {
		return preg_replace( '/[^0-9,.]/', '', $value );
	}

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['units'] = $this->units;
		$this->json['number'] = self::get_number_from( $this->value() );
		$this->json['unit'] = self::get_unit_from( $this, $this->value());
		$this->json['attrs'] = $this->input_attrs;
	}

	/**
	 * Separate the slider template to make it reusable by child classes
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_slider() {
		?>
		<div class="pwpcp-inputs-wrap">
			<input type="number" class="pwpcp-slider-number" value="{{ data.number }}" tabindex="-1" <# var p = data.attrs; for (var key in p) { if (p.hasOwnProperty(key)) { #>{{ key }}="{{ p[key] }}" <# } } #>>
			<div class="pwpcp-unit-wrap"><# for (var i = 0, l = data.units.length; i < l; i++) { #><input type="text" class="pwpcp-unit" readonly="true" tabindex="-1" value="{{ data.units[i] }}"><# } #></div>
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

	/**
	 * Sanitization callback
	 *
	 * @since 0.0.1
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @return string The sanitized value.
 	 */
	public static function sanitize_callback( $value, $setting ) {
		$control = $setting->manager->get_control( $setting->id );
		$input_attrs = $control->input_attrs;
		$number = self::get_number_from( $value );
		$unit = self::get_unit_from( $control, $value );

		if ( $input_attrs ) {
			// if doesn't respect the step given round it to the closest
			// then do the min and max checks
			if ( isset( $input_attrs['step'] ) && $number % $input_attrs['step'] != 0 ) {
				$number = round( $number / $input_attrs['step'] ) * $input_attrs['step'];
			}
			// if it's lower than the minimum return the minimum
			if ( isset( $input_attrs['min'] ) && $number < $input_attrs['min'] ) {
				return $input_attrs['min'] . $unit;
			}
			// if it's higher than the maxmimum return the maximum
			if ( isset( $input_attrs['max'] ) && $number > $input_attrs['max'] ) {
				return $input_attrs['max'] . $unit;
			}
		}
		return $number . $unit;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Slider' );