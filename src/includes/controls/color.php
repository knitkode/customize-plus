<?php // @partial
/**
 * Color Control custom class
 *
 * The color control uses Spectrum as a Javascript Plugin which offers more
 * features comparing to Iris, the default one used by WordPress.
 * We abstract the Spectrum options that developers are allowed to define
 * setting them as class properties which are then put in the JSON params of the
 * control object, ready to be used in the JavaScript implementation and in the
 * backend side validation and sanitization.
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2018 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Customize_Control_Color extends KKcp_Customize_Control_Base {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_color';

	/**
	 * Allow alpha channel modification (rgba colors)
	 *
	 * - When `true` RGBA colors will be allowed and a slider for the alpha
	 *   channel will be displayed
	 * - When `false` RGBA colors will be not allowed (if given the alpha channel
	 *   value will be stripped out on save). The color picker will not display
	 *   any control for the alpha channel.
	 *
	 * @since 1.0.0
	 * @var bool
	 */
	public $alpha = true;

	/**
	 * Allow transparent colors
	 *
	 * - When `true` the css color value `transparent` is allowed.
	 * - When `false` the css color value `transparent` is not allowed to be
	 *   selected.
	 *
	 * @since 1.0.0
	 * @var bool
	 */
	public $transparent = true;

	/**
	 * Show palette only in color control
	 *
	 * - When `true` the picker will be shown
	 * - When `false` the picker will not be shown. In this case a palette array
	 *   must be defined otherwise the color controll will be useless.
	 * - When `'hidden'` the picker will be toggled, the user will need to click
	 *   a 'Show color picker' toggle button. Its use is therefore allowed but
	 *   discouraged
	 *
	 * In regards to spectrum this is an abstraction of the following options:
	 * {@link(https://bgrins.github.io/spectrum/#options-selectionPalette, docs)},
	 * {@link(https://bgrins.github.io/spectrum/#options-showPaletteOnly, docs)}
	 *
	 * @since 1.0.0
	 * @var bool|string
	 */
	public $picker = true;

	/**
	 * Palette
	 *
	 * - When `false` no palette selection is shown
	 * - When is an `array`, it needs to be an array of arrays where each array
	 *   is a row of color choices in the UI. If the `picker` property is set to
	 *   `false` only the colors defined in the palette are allowed to be picked
	 *   and will pass validation. If `picker` is set to `true` the palette will
	 *   not constrain the user choice turning the palette into a sort of design
	 *   suggestion.
	 *
	 * In regards to spectrum this is an abstraction of the following options:
	 * {@link(https://bgrins.github.io/spectrum/#options-selectionPalette, docs)},
	 * {@link(https://bgrins.github.io/spectrum/#options-showPaletteOnly, docs)}
	 *
	 * @since 1.0.0
	 * @var bool|array
	 */
	public $palette = false;

	/**
	 * Color format supported
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public static $color_formats_supported = array(
		'hex',
		'rgb',
		'rgba',
		'keyword',
		// 'hsl',
		// 'hsla',
	);

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	public function get_constants() {
		return array(
			'colorsKeywords' => KKcp_Data::COLORS_KEYWORDS,
			'colorFormatsSupported' => self::$color_formats_supported
		);
	}

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	public function get_l10n() {
		return array(
			'cancelText' => esc_html__( 'Cancel' ),
			'chooseText' => esc_html__( 'Choose' ),
			'clearText' => esc_html__( 'Clear selection' ),
			'selectColor' => esc_html__( 'Select color' ),
			'noColorSelectedText' => esc_html__( 'No color selected' ),
			'togglePaletteMoreText' => esc_html__( 'Show color picker' ),
			'togglePaletteLessText' => esc_html__( 'Hide color picker' ),
			'vColorWrongType' => esc_html__( 'Colors must be strings' ),
			'vNotInPalette' => esc_html__( 'Color not in the allowed palette' ),
			'vNoTransparent' => esc_html__( 'Transparent is not allowed' ),
			'vNoRGBA' => esc_html__( 'RGBA color is not allowed' ),
			'vColorInvalid' => esc_html__( 'Not a valid color' ),
		);
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function add_to_json() {
		$this->json['valueCSS'] = $this->value();

		if ( $this->alpha ) {
			$this->json['alpha'] = true;
		}
		if ( $this->transparent ) {
			$this->json['transparent'] = true;
		}
		if ( $this->picker ) {
			$this->json['picker'] = $this->picker;
		}
		if ( $this->palette ) {
			$this->json['palette'] = KKcp_SanitizeJS::array( false, $this->palette );
		}

		$this->json['mode'] = 'custom';
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::color( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::color( $validity, $value, $setting, $control );
	}
}

// Register on WordPress Customize global object
$wp_customize->register_control_type( 'KKcp_Customize_Control_Color' );