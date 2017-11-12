<?php // @partial
/**
 * Radio Control custom class
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Radio extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'kkcp_radio';

	/**
	 * Render template for choice displayment.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice_ui() {
		?>
			<label class="{{helpClass}}"{{{ helpAttrs }}}>
				<input type="radio" value="{{ val }}" name="_customize-kkcp_radio-{{ data.id }}"<?php // `checked` status synced through js in `control.ready()` ?>>
				{{{ label }}}
				<# if (choice.sublabel) { #><small> ({{{ choice.sublabel }}})</small><# } #>
			</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Radio' );