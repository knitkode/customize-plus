<?php // @partial
/**
 * Buttonset Control custom class
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
class KKcp_Customize_Control_Buttonset extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_buttonset';

	/**
	 * Render template for choice displayment.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_choice_ui () {
		?>
			<input id="{{ id }}" type="radio" value="{{ val }}" name="_customize-kkcp_buttonset-{{ data.id }}"<?php // `checked` status synced through js in `control.ready()` ?>>
			<label class="{{helpClass}} kkcpui-tooltip--top" {{{ helpAttrs }}} for="{{ id }}" onclick="" title="{{{ label }}}">{{{ label }}}</label>
		<?php
	}

	/**
	 * Render needed html structure for CSS buttonset
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_above_choices () {
		?>
			<div class="switch-toggle kkcpui-switch switch-{{ _.size(choices) }}">
		<?php
	}

	/**
	 * Render needed html structure for CSS buttonset
	 *
	 * @since 1.0.0
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
$wp_customize->register_control_type( 'KKcp_Customize_Control_Buttonset' );