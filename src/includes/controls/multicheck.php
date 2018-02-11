<?php // @partial
/**
 * Multicheck Control custom class
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
class KKcp_Customize_Control_Multicheck extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_multicheck';

	/**
	 * Option to allow a maxmimum icons selection
	 *
	 * @since 1.0.0
	 * @var ?int
	 */
	protected $max = null;

	/**
	 * Option to allow a minimum icons selection
	 *
	 * @since 1.0.0
	 * @var ?int
	 */
	protected $min = null;

	/**
	 * Sortable
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	protected $sortable = false;

	/**
	 * Enqueue libraries
	 *
	 * @since  1.0.0
	 */
	public function enqueue() {
		if ( $this->sortable ) {
			wp_enqueue_script( 'jquery-ui-sortable' );
		}
	}

	/**
	 * Add values to JSON params
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		parent::add_to_json();

		$this->json['sortable'] = KKcp_Sanitize::js_bool( $this->sortable );
		$this->json['max'] = KKcp_Sanitize::js_int_or_null( $this->max );
		$this->json['min'] = KKcp_Sanitize::js_int_or_null( $this->min );

		$this->json['choicesOrdered'] = $this->value();
	}

	/**
	 * Ouput the choices template in a loop. Override this in subclasses
	 * to change behavior, for instance in sortable controls.
	 *
	 * If the control is sortable we first show the ordered choices (the ones stored
	 * as value in the DB, gathered with `$this->value()`) and then the other choices,
	 * that's why the double loop with the `indexOf` condition.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_choices_loop() {
		?>
		<# if (data.sortable) {
			if (_.isArray(data.choicesOrdered)) {
				for (var i = 0; i < data.choicesOrdered.length; i++) {
					var val = data.choicesOrdered[i]; #>
					<?php $this->js_tpl_choice(); ?>
				<# }
				for (var val in choices) {
					if (data.choicesOrdered.indexOf(val) === -1) { #>
						<?php $this->js_tpl_choice(); ?>
					<# }
				}
			}
		} else {
			for (var val in choices) { #>
				<?php $this->js_tpl_choice(); ?>
			<# }
		} #>
		<?php
	}

	/**
	 * Render template for choice displayment.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_choice_ui() {
		?>
			<label title="{{ val }}" class="{{helpClass}}"{{{ helpAttrs }}}>
				<input type="checkbox" name="_customize-kkcp_multicheck-{{ data.id }}" value="{{ val }}"<?php // `checked` status synced through js in `control.ready()` ?>>{{{ label }}}
			</label>
		<?php
	}

	/**
	 * Sanitize
	 *
	 * @since 1.0.0
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return array The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::multiple_choices( $value, $setting, $control );
	}

	/**
	 * Validate
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return array
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::multiple_choices( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Multicheck' );