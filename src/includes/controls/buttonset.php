<?php // @partial
/**
 * Buttonset Control custom class
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
class KKcp_Customize_Control_Buttonset extends KKcp_Customize_Control_Base_Radio {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_buttonset';

	/**
	 * {@inheritDoc}. Always show tooltips.
	 *
	 * @since 1.0.0
	 * @override
	 */
	protected function js_tpl_choice_ui () {
		?>
			<input id="{{ id }}" type="radio" value="{{ val }}" name="_customize-kkcp_buttonset-{{ data.id }}"<?php // `checked` status synced through js in `control.ready()` ?>>
			<label class="{{ classes }} kkcpui-tooltip--top" {{ attributes }} title="{{ tooltip }}" for="{{ id }}" onclick="">{{ label }}</label>
		<?php
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function js_tpl_above_choices () {
		?>
			<div class="switch-toggle kkcpui-switch switch-{{ _.size(choices) }}">
		<?php
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
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