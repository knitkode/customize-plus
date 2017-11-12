<?php // @partial
/**
 * Slider Control custom class
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Slider extends KKcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'kkcp_slider';

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
		if ( is_array( $this->input_attrs ) && ! empty( $this->input_attrs ) ) {
			$this->json['attrs'] = $this->input_attrs;

			// allowFloat also if input_attrs['step'] is a float number
			if ( isset( $this->input_attrs['step'] ) && is_float( $this->input_attrs['step'] ) ) {
				$this->json['allowFloat'] = true;
			}
		}

		if ( $this->allowFloat ) {
			$this->json['allowFloat'] = true;
		}

		if ( ! empty( $this->units ) ) {
			$this->json['units'] = $this->units;
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
		<div class="kkcp-inputs-wrap">
			<input type="number" class="kkcp-slider-number" value="<?php // filled through js ?>" tabindex="-1" <# var p = data.attrs; for (var key in p) { if (p.hasOwnProperty(key)) { #>{{ key }}="{{ p[key] }}" <# } } #>>
			<div class="kkcp-unit-wrap"><# for (var i = 0, l = data.units.length; i < l; i++) { #><input type="text" class="kkcp-unit" readonly="true" tabindex="-1" value="{{ data.units[i] }}"><# } #></div>
		</div>
		<# } else { #>
		<input type="number" class="kkcp-slider-number" value="<?php // filled through js ?>" tabindex="-1" <# var p = data.attrs; for (var key in p) { if (p.hasOwnProperty(key)) { #>{{ key }}="{{ p[key] }}" <# } } #>>
		<# } #>
		<div class="kkcp-slider-wrap">
			<div class="kkcp-slider"></div>
		</div>
		<?php
	}

	/**
	 * Render a JS template for the content of the slider control.
	 *
	 * @override
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
			'vInvalidUnit' => __( 'The CSS unit is invalid.' ),
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
		$number = KKcp_Sanitize::extract_number( $value, $control );
		$unit = KKcp_Sanitize::extract_size_unit( $value, $control );

		// if it is a slider without unit
		if ( empty( $control->units ) && $number ) {
			return KKcp_Sanitize::number( $number, $control );
		}
		// if it needs a unit
		else if ( ! empty( $control->units ) && $number && $unit ) {
			return KKcp_Sanitize::number( $number, $control ) . $unit;
		} else {
			return $setting->default;
		}
	}

	/**
	 * Validate
	 *
	 * @since 0.0.1
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		$number = KKcp_Sanitize::extract_number( $value, $control );
		$unit = KKcp_Sanitize::extract_size_unit( $value, $control );

		// if it needs a unit
		if ( ! empty( $control->units ) && ! $unit ) {
			$validity->add( 'missing_unit', __( 'A unit must be specified.' ) );
		}

		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Slider' );