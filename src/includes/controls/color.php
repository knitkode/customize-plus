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
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_color';

	/**
	 * Palette
	 *
	 * @since 0.0.1
	 * @var boolean
	 */
	protected $palette = array();

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
	 * Show palette only in color control
	 *
	 * @link(https://bgrins.github.io/spectrum/#options-showPaletteOnly, Javascript plugin docs)
	 * @since 0.0.1
	 * @var boolean
	 */
	protected $showPaletteOnly = false;

	/**
	 * Toggle palette only in color control
	 *
	 * @link(https://bgrins.github.io/spectrum/#options-togglePaletteOnly, Javascript plugin docs)
	 * @since 0.0.1
	 * @var boolean
	 */
	protected $togglePaletteOnly = false;

	/**
	 * Get localized strings for current controls
	 *
	 * @override
	 * @since  0.0.1
	 * @return array
	 */
	public function get_l10n() {
		return array(
			'cancelText' => __( 'Cancel', 'pkgTextdomain' ),
			'chooseText' => __( 'Choose', 'pkgTextdomain' ),
			'clearText' => __( 'Clear selection', 'pkgTextdomain' ),
			'noColorSelectedText' => __( 'No color selected', 'pkgTextdomain' ),
			'togglePaletteMoreText' => __( 'Show color picker', 'pkgTextdomain' ),
			'togglePaletteLessText' => __( 'Hide color picker', 'pkgTextdomain' ),
		);
	}

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 * Let's use early returns here. Not the cleanest anyway.
	 *
	 * @since 0.0.1
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

		// Custom Color
		$this->json['mode'] = 'custom';

		// check for transparent color
		$this->json['valueCSS'] = $value;
	}

	/**
	 * Render a JS template for the content of the control.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl() {
		?>
		<?php $this->js_tpl_header(); ?>
		<span class="pwpcpcolor-current pwpcpcolor-current-bg"></span>
		<span class="pwpcpcolor-current pwpcpcolor-current-overlay" style="background:{{data.valueCSS}}"></span>
		<a href="javascript:void(0)" class="pwpcpui-toggle pwpcpcolor-toggle"><?php _e( 'Select Color', 'pkgTextdomain' ) ?></a>
		<div class="pwpcp-expander">
			<input class="pwpcpcolor-input" type="text">
		</div>
		<?php
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
		if ( ! $control->disallowTransparent && 'transparent' === $value ) {
			return $value;
		}
		else if ( $control->allowAlpha && PWPcp_Sanitize::color_rgba( $value ) ) {
			return PWPcp_Sanitize::color_rgba( $value );
		}
		else if ( PWPcp_Sanitize::color_hex( $value ) ) {
			return PWPcp_Sanitize::color_hex( $value );
		}
		else {
			return $setting->default;
		}
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Color' );