<?php // @partial
/**
 * Select Control custom class
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
class PWPcp_Customize_Control_Select extends PWPcp_Customize_Control_Base_Radio {

	public $type = 'pwpcp_select';

	/**
	 * Render template for choice displayment.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice() {
		?>
			<option value="{{ val }}"<# if (data.value==val) { #> selected<# } #>{{{ tipAttrs }}}<# if (choice.sublabel) { #> data-sublabel="{{{ choice.sublabel }}}"<# } #>>
				{{{ label }}}
			</option>
		<?php
	}

	/**
	 * Render needed html structure for CSS toggle / switch
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_above_choices () {
		?>
			<select name="_customize-pwpcp_select-{{ data.id }}">
		<?php
	}

	/**
	 * Render needed html structure for CSS toggle / switch
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_below_choices () {
		?>
			</select>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Select' );