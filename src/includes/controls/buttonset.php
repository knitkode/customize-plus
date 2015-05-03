<?php // @partial
/**
 * Buttonset Control custom class
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
class PWPcp_Customize_Control_Buttonset extends PWPcp_Customize_Control_Base_Radio {

	public $type = 'pwpcp_buttonset';

	/**
	 * Render template for choice displayment.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice () {
		?>
			<input id="{{ id }}" type="radio" value="{{ val }}" name="_customize-pwpcp_buttonset-{{ data.id }}" <# if (val===data.value) { #>checked<# } #>>
			<label for="{{ id }}" onclick=""{{{ tipAttrs }}}>{{{ label }}}</label>
		<?php
	}

	/**
	 * Render needed html structure for CSS buttonset
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_above_choices () {
		?>
			<div class="switch-toggle pwpcp-switch switch-{{ _.size(choices) }}">
		<?php
	}

	/**
	 * Render needed html structure for CSS buttonset
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_below_choices () {
		?>
			<a></a>
			</div>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Buttonset' );