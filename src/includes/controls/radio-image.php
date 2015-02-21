<?php // @partial
/**
 * Radio Image Control custom class
 *
 * The images name needs to be named like following: '{setting-id}-{choice-value}.png'
 * and need to be in the $IMG_ADMIN path.
 *
 * @since  0.0.1
 */
class K6CP_Customize_Control_Radio_Image extends K6CP_Customize_Control_Base_Radio {

	public $type = 'k6cp_radio_image';

	/**
	 * Render template for choice displayment.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice() {
		?>
			<input id="{{ id }}" class="k6-radio-image" type="radio" value="{{ val }}" name="_customize-k6cp_radio_image-{{ data.id }}" <# if (val===data.value) { #>checked<# } #>>
			<label for="{{ id }}"{{{ tipAttrs }}}>
				<# var imgUrl = choice.img_custom ? choice.img_custom : <?php plugins_url( 'assets/images/', K6CP_PLUGIN_URL ); ?>choice.image + '.png'; #>
				<img class="k6-tip" src="{{ imgUrl }}" title="{{{ label }}}">
			</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'K6CP_Customize_Control_Radio_Image' );