<?php // @partial
/**
 * Color Control custom class
 *
 * The color control uses Spectrum as a Javascript Plugin which offers more
 * features comparing to Iris, the default one used by WordPress.
 * We basically whitelist the Spectrum options that developers are allowed to
 * define setting them as class protected properties which are then put in the
 * JSON params of the control object, ready to be used in the javascript
 * implementation.
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

	/**
	 * Control type.
	 *
	 * {@inheritdoc}
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_color';

	/**
	 * Allow alpha channel modification (rgba colors)
	 *
	 * @since 0.0.1
	 * @var boolean
	 */
	protected $allowAlpha = false;

	/**
	 * Disallow transparent color
	 *
	 * @since 0.0.1
	 * @var boolean
	 */
	protected $disallowTransparent = false;

	/**
	 * Palette
	 *
	 * {@link(https://bgrins.github.io/spectrum/#options-selectionPalette, js docs)}
	 * @since 0.0.1
	 * @var boolean
	 */
	protected $palette = array();

	/**
	 * Show palette only in color control
	 *
	 * {@link(https://bgrins.github.io/spectrum/#options-showPaletteOnly, js docs)}
	 * @since 0.0.1
	 * @var boolean
	 */
	protected $showPaletteOnly = false;

	/**
	 * Toggle palette only in color control
	 *
	 * {@link(https://bgrins.github.io/spectrum/#options-togglePaletteOnly, js docs)}
	 * @since 0.0.1
	 * @var boolean
	 */
	protected $togglePaletteOnly = false;

	/**
	 * Get l10n
	 *
	 * {@inheritdoc}
	 * @since  0.0.1
	 * @override
	 */
	public function get_l10n() {
		return array(
			'cancelText' => __( 'Cancel' ),
			'chooseText' => __( 'Choose' ),
			'clearText' => __( 'Clear selection' ),
			'noColorSelectedText' => __( 'No color selected' ),
			'togglePaletteMoreText' => __( 'Show color picker' ),
			'togglePaletteLessText' => __( 'Hide color picker' ),
			'vNotInPalette' => __( 'Color not in the allowed palette.' ),
		);
	}

	/**
	 * Add to JSON
	 *
	 * {@inheritdoc}
	 * @since 0.0.1
	 * @override
	 */
	protected function add_to_json() {
		$value = $this->value();

		$this->add_booleans_params_to_json( array(
			'allowAlpha',
			'disallowTransparent',
			'showPaletteOnly',
			'togglePaletteOnly',
		) );

		if ( $this->palette ) {
			$this->json['palette'] = $this->palette;
		}

		$this->json['mode'] = 'custom';
		$this->json['valueCSS'] = $value;
	}

	/**
	 * JS template
	 *
	 * {@inheritdoc}
	 * @since 0.0.1
	 * @override
	 */
	protected function js_tpl() {
		?>
		<?php $this->js_tpl_header(); ?>
		<span class="pwpcpcolor-current pwpcpcolor-current-bg"></span>
		<span class="pwpcpcolor-current pwpcpcolor-current-overlay" style="background:{{data.valueCSS}}"></span>
		<button class="pwpcpui-toggle pwpcpcolor-toggle"><?php _e( 'Select Color' ) ?></button>
		<div class="pwpcp-expander">
			<input class="pwpcpcolor-input" type="text">
		</div>
		<?php
	}

	/**
	 * Sanitize
	 *
	 * {@inheritdoc}
	 * @since 0.0.1
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		if ( $control->showPaletteOnly &&
			! $control->togglePaletteOnly &&
			is_array( $control->palette )
		) {
			$palette_flatten = PWPcp_Sanitize::array_flatten( $control->palette, 1 );
			$palette_normalized = array_map( 'PWPcp_Sanitize::hex_to_rgb', $palette_flatten );
			$value_normalized = PWPcp_Sanitize::hex_to_rgb( $value );
			if ( PWPcp_Sanitize::in_array_r( $value_normalized, $palette_normalized ) ) {
				return $value;
			} else {
				return $setting->default;
			}
		}
		else if ( 'transparent' === $value && ! $control->disallowTransparent ) {
			return $value;
		}
		else if ( ( $output = PWPcp_Sanitize::color_rgba( $value ) ) && $control->allowAlpha ) {
			return $output;
		}
		else if ( $output = PWPcp_Sanitize::color_hex( $value ) ) {
			return $output;
		}
		else {
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
		if ( $control->showPaletteOnly &&
			! $control->togglePaletteOnly &&
			is_array( $control->palette )
		) {
			$palette_flatten = PWPcp_Sanitize::array_flatten( $control->palette, 1 );
			$palette_normalized = array_map( 'PWPcp_Sanitize::hex_to_rgb', $palette_flatten );
			$value_normalized = PWPcp_Sanitize::hex_to_rgb( $value );
			if ( ! PWPcp_Sanitize::in_array_r( $value_normalized, $palette_normalized ) ) {
				$validity->add( 'wrong_color', __( 'The color is not in the palette.' ) );
			}
		}
		if ( 'transparent' === $value && $control->disallowTransparent ) {
			$validity->add( 'wrong_color', __( 'Transparent is not allowed for this setting.' ) );
		}
		if ( ( $output = PWPcp_Sanitize::color_rgba( $value ) ) && ! $control->allowAlpha ) {
			$validity->add( 'wrong_color', __( 'RGBA color is not allowed for this setting.' ) );
		}
		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Color' );