<?php // @partial
/**
 * Sortable Control custom class
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
class PWPcp_Customize_Control_Sortable extends PWPcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_sortable';

	/**
	 * Enqueue libraries
	 *
	 * @since  0.0.1
	 */
	public function enqueue() {
		wp_enqueue_script( 'jquery-ui-sortable' );
	}

	/**
	 * Add basic parameters passed to the JavaScript via JSON
	 * nedeed by any radio control.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['lastValue'] = $this->value();
		$this->json['choices'] = $this->choices;
	}

	/**
	 * Ouput the choices template in a loop. Override this in subclasses
	 * to change behavior, for instance in sortable controls.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choices_loop() {
		?>
		<# var lastValue = JSON.parse(data.lastValue);
			if (_.isArray(lastValue)) {
				for (var i = 0; i < lastValue.length; i++) {
					var val = lastValue[i]; #>
					<?php $this->js_tpl_choice(); ?>
				<# }
			} #>
		<?php
	}

	/**
	 * Render template for choice displayment.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice_ui() {
		?>
			<div class="pwpcp-sortable" title="{{ val }}" data-value="{{ val }}" class="{{helpClass}}"{{{ helpAttrs }}}>{{{ label }}}</div>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Sortable' );