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
		// var localization = $.spectrum.localization["it"] = { // @@todo
		// 	cancelText: "annulla",
		// 	chooseText: "scegli",
		// 	clearText: "Annulla selezione colore",
		// 	noColorSelectedText: "Nessun colore selezionato" // \\
		// };
		return array(
			'cancelText' => __( 'annulla', 'pkgTextdomain' ),
			'chooseText' => __( 'scegli', 'pkgTextdomain' ),
			'clearText' => __( 'Annulla selezione colore', 'pkgTextdomain' ),
			'noColorSelectedText' => __( 'Nessun colore selezionato', 'pkgTextdomain' ),
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
		if ( 'transparent' === $value ) {
			$this->json['valueCSS'] = $value;
			return;
		}

		// check for a hex color string
		$custom_color_hex = PWPcp_Sanitize::color_hex( $value );
		if ( $custom_color_hex ) {
			// hex color is valid, so we have a Custom Color
			$this->json['valueCSS'] = $custom_color_hex;
			return;
		}

		// check for a rgba color string
		$custom_color_rgba = PWPcp_Sanitize::color_rgba( $value );
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
	 * Sanitization callback
	 *
	 * @since 0.0.1
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @return string The sanitized value.
 	 */
	public static function sanitize_callback( $value, $setting ) {
		PWPcp_Sanitize::color();
		return wp_kses_post( $value );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Color' );