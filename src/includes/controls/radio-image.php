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

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_radio_image';

	/**
	 * Render template for choice displayment.
	 *
	 * It shows the full image path (`img_custom`) or an image bundled in the plugin
	 * when `img` has been passed, with the plugin url as prepath, and always a `png`
	 * extension.
	 * @since 0.0.1
	 */
	protected function js_tpl_choice_ui() {
		?>
			<input id="{{ id }}" class="pwpcp-radio-image" type="radio" value="{{ val }}" name="_customize-pwpcp_radio_image-{{ data.id }}"<?php // `checked` status synced through js in `control.ready()` ?>>
			<label class="{{helpClass}} pwpcpui-hint--top"{{{ helpAttrs }}} for="{{ id }}" data-hint="{{{label}}}">
				<# var imgUrl = choice.img_custom ? '<?php echo esc_url( PWPcp_Theme::$images_base_url ); ?>' + choice.img_custom : '<?php echo esc_url( PWPCP_PLUGIN_URL . 'assets/images/' ); ?>' + choice.img + '.png'; #>
				<img src="{{ imgUrl }}" title="{{{label}}}">
			</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Radio_Image' );