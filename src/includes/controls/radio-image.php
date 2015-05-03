<?php // @partial
/**
 * Radio Image Control custom class
 *
 * The images name needs to be named like following: '{setting-id}-{choice-value}.png'
 * and need to be in the $IMG_ADMIN path.
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
class PWPcp_Customize_Control_Radio_Image extends PWPcp_Customize_Control_Base_Radio {

	public $type = 'pwpcp_radio_image';

	/**
	 * Render template for choice displayment.
	 *
	 * It shows the full image path (`img_custom`) or an image bundled in the plugin
	 * when `img` has been passed, with the plugin url as prepath, and always a `png`
	 * extension.
	 * @since 0.0.1
	 */
	protected function js_tpl_choice() {
		?>
			<input id="{{ id }}" class="pwpcp-radio-image" type="radio" value="{{ val }}" name="_customize-pwpcp_radio_image-{{ data.id }}" <# if (val===data.value) { #>checked<# } #>>
			<label for="{{ id }}"{{{ tipAttrs }}}>
				<# var imgUrl = choice.img_custom ? choice.img_custom : '<?php echo esc_url( PWPcp_PLUGIN_URL . 'assets/images/' ); ?>' + choice.img + '.png'; #>
				<img class="pwpcp-tip" src="{{ imgUrl }}" title="{{{ label }}}">
			</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Radio_Image' );