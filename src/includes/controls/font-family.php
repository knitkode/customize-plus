<?php // @partial
/**
 * Font Family Control custom class
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
class PWPcp_Customize_Control_Font_Family extends PWPcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_font_family';

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
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['value'] = PWPcp_Sanitize::font_families( $this->value() );
	}

	/**
	 * Render a JS template for the content of the control.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?>
		</label>
		<!-- <label>
			<input class="pwpcp-font-google-toggle" type="checkbox" value="0">
			<?php _e( 'Enable Google fonts' ); ?>
		</label> -->
		<input class="pwpcp-selectize" type="text" value="{{ data.value }}" required>
		<?php
	}

	/**
	 * Set font families array as a constant to use in javascript
	 *
	 * @override
	 * @since  0.0.1
	 * @return array
	 */
	public function get_constants() {
		return array(
			'font_families' => PWPcp_Sanitize::font_families( self::$font_families ),
		);
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Font_Family' );