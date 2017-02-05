<?php // @partial
/**
 * Select Control custom class
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     PlusWP <dev@pluswp.com> (https://pluswp.com)
 * @copyright  2017 PlusWP
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://pluswp.com/customize-plus
 */
class PWPcp_Customize_Control_Select extends PWPcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_select';

	/**
	 * Selectize disabled (`false`) or enabled (just `true` or array of options)
	 *
	 * @since 0.0.1
	 * @var boolean|array
	 */
	protected $selectize = false;

	/**
	 * Selectize allowed options
	 *
	 * @since 0.0.1
	 * @var array
	 */
	public static $selectize_allowed_options = array(
		'plugins' => array(
			'restore_on_backspace' => 'PWPcp_Sanitize::js_in_array_keys',
			'drag_drop' => 'PWPcp_Sanitize::js_in_array_keys',
			'remove_button' => 'PWPcp_Sanitize::js_in_array_keys'
		),
		'maxItems' => 'PWPcp_Sanitize::js_number_or_null', // number|null,
		'persist' => 'PWPcp_Sanitize::js_bool',
		'hideSelected' => 'PWPcp_Sanitize::js_bool',
		'sortField' => 'PWPcp_Sanitize::js_string',
	);

	/**
	 * Add values to JSON params
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		parent::add_to_json();

		if ( $this->selectize ) {
			if ( is_array( $this->selectize ) ) {
				$this->json['selectize'] = PWPcp_Sanitize::js_options( $this->selectize, self::$selectize_allowed_options );
			} else {
				$this->json['selectize'] = true;
			}
		}
	}

	/**
	 * Render template for choice displayment.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice_ui() {
		?>
			<option class="{{helpClass}}"{{{ helpAttrs }}} value="{{ val }}"<?php // `selected` status synced through js in `control.ready()` ?><# if (choice.sublabel) { #> data-sublabel="{{{ choice.sublabel }}}"<# } #>>
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

	/**
	 * Sanitize
	 *
	 * @since 0.0.1
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		$selectize = $control->selectize;
		if ( isset( $selectize['maxItems'] ) ) {
			$max_items = filter_var( $selectize['maxItems'], FILTER_SANITIZE_NUMBER_INT );
		} else {
			$max_items = null;
		}
		if ( is_numeric( $max_items ) && $max_items > 1 ) {
			return PWPcp_Sanitize::array_in_choices( $value, $setting, $control );
		} else {
			return PWPcp_Sanitize::string_in_choices( $value, $setting, $control );
		}
	}

	/**
	 * Validate
	 *
	 * @since 0.0.1
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		$selectize = $control->selectize;
		if ( isset( $selectize['maxItems'] ) ) {
			$max_items = filter_var( $selectize['maxItems'], FILTER_SANITIZE_NUMBER_INT );
		} else {
			$max_items = null;
		}
		if ( is_numeric( $max_items ) && $max_items > 1 ) {
			$input_decoded = json_decode( $value );
			foreach ( $input_decoded as $key ) {
				if ( ! isset( $control->choices[ $key ] ) ) {
					$validity->add( 'wrong', sprintf( __( 'The value %s is not selectable.' ), $key ) );
				}
			}
		} else {
			if ( ! isset( $control->choices[ $value ] ) ) {
				$validity->add( 'not_a_choice', __( 'The value is not an allowed selection.' ) );
			}
		}
		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Select' );