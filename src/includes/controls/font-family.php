<?php // @partial
/**
 * Font Family Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Customize_Control_Font_Family extends KKcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_font_family';

	/**
	 * Font families
	 *
	 * @see http://www.w3schools.com/cssref/css_websafe_fonts.asp
	 * @var array
	 */
	public static $font_families = array(
		// Serif Fonts
		'Georgia',
		'"Palatino Linotype"',
		'"Book Antiqua"',
		'Palatino',
		'"Times New Roman"',
		'Times',
		'serif',
		// Sans-Serif Fonts
		'Arial',
		'Helvetica',
		'"Helvetica Neue"',
		'"Arial Black"',
		'Gadget',
		'"Comic Sans MS"',
		'cursive',
		'Impact',
		'Charcoal',
		'"Lucida Sans Unicode"',
		'"Lucida Grande"',
		'Tahoma',
		'Geneva',
		'"Trebuchet MS"',
		'Verdana',
		'sans-serif',
		// Monospace Font
		'"Courier New"',
		'Courier',
		'"Lucida Console"',
		'Monaco',
		'monospace',
		'Menlo',
		'Consolas',

		// Google font
		'"Lato"',
	);

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		$this->json['value'] = KKcp_Sanitize::font_families( $this->value() );
	}

	/**
	 * Render a JS template for the content of the control.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?>
		</label>
		<!-- <label>
			<input class="kkcp-font-google-toggle" type="checkbox" value="0">
			<?php esc_html_e( 'Enable Google fonts' ); ?>
		</label> -->
		<input class="kkcp-selectize" type="text" value="{{ data.value }}" required>
		<?php
	}

	/**
	 * Set font families array as a constant to use in javascript
	 *
	 * @override
	 * @since  1.0.0
	 * @return array
	 */
	public function get_constants() {
		return array(
			'font_families' => KKcp_Sanitize::font_families( self::$font_families ),
		);
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Font_Family' );