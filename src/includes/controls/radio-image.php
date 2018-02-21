<?php // @partial
/**
 * Radio Image Control custom class
 *
 * The images name needs to be named like following: '{setting-id}-{choice-value}.png'
 * and need to be in the $IMG_ADMIN path.
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
class KKcp_Customize_Control_Radio_Image extends KKcp_Customize_Control_Base_Radio {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_radio_image';

	/**
	 * {@inheritDoc}. It shows the full image path (`img_custom`) or an image
	 * bundled in the plugin when `img` has been passed, with the plugin url
	 * as prepath, and always a `png` extension. Always show tooltip.
	 *
	 * @since 1.0.0
	 * @override
	 */
	protected function js_tpl_choice_ui() {
		?>
			<input id="{{ id }}" class="kkcp-radio-image" type="radio" value="{{ val }}" name="_customize-kkcp_radio_image-{{ data.id }}"<?php // `checked` status synced through js in `control.ready()` ?>>
			<label class="{{ classes }}" {{ attributes }}>
				<# var imgUrl = choice.img_custom ? '<?php echo esc_url( KKcp_Theme::$images_base_url ); ?>' + choice.img_custom : '<?php echo esc_url( KKCP_PLUGIN_URL . 'assets/images/' ); ?>' + choice.img + '.png'; #>
				<img class="kkcpui-tooltip--top" src="{{ imgUrl }}" title="{{ tooltip }}">
			</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Radio_Image' );