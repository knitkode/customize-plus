<?php // @partial
/**
 * Select Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Select extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_select';

	/**
	 * Selectize disabled (`false`) or enabled (just `true` or array of options)
	 *
	 * @since 1.0.0
	 * @var boolean|array
	 */
	protected $selectize = false;

	/**
	 * Selectize allowed options
	 *
	 * Sanitize methods must be class methods of `KKcp_Sanitize` or global
	 * functions
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public static $selectize_allowed_options = array(
		'plugins' => array( 'sanitizer' => 'js_array', 'values' => array(
			'restore_on_backspace',
			'drag_drop',
			'remove_button'
		) ),
		'maxItems' => array( 'sanitizer' => 'js_number_or_null' ),
		'persist' => array( 'sanitizer' => 'js_bool' ),
		'hideSelected' => array( 'sanitizer' => 'js_bool' ),
		'sortField' => array( 'sanitizer' => 'js_string' ),
	);

	/**
	 * Add values to JSON params
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		parent::add_to_json();

		if ( $this->selectize ) {
			if ( is_array( $this->selectize ) ) {
				$this->json['selectize'] = KKcp_Sanitize::js_options( $this->selectize, self::$selectize_allowed_options );
			} else {
				$this->json['selectize'] = true;
			}
		}
	}

	/**
	 * Render template for choice displayment.
	 *
	 * @since 1.0.0
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
	 * @since 1.0.0
	 */
	protected function js_tpl_above_choices () {
		?>
			<select name="_customize-kkcp_select-{{ data.id }}">
		<?php
	}

	/**
	 * Render needed html structure for CSS toggle / switch
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_below_choices () {
		?>
			</select>
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
			return KKcp_Sanitize::array_in_choices( $value, $setting, $control );
		} else {
			return KKcp_Sanitize::string_in_choices( $value, $setting, $control );
		}
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
			if ( ! is_string( $value ) ) {
				return $validity->add( 'wrong', sprintf( esc_html__( 'The value must be a string or a JSONified string.' ) ) ); // @@tocheck, wrong error message
			} else {
				$input_decoded = json_decode( $value );
			}

			if ( is_array( $input_decoded ) ) {
				foreach ( $input_decoded as $key ) {
					if ( ! isset( $control->choices[ $key ] ) ) {
						$validity->add( 'wrong', sprintf( esc_html__( 'The value %s is not selectable.' ), $key ) );
					}
				}
			} else {
				$validity->add( 'wrong', sprintf( esc_html__( 'The value %s must be a well formed array.' ), $value ) );
			}
		} else {
			if ( ! isset( $control->choices[ $value ] ) ) {
				$validity->add( 'not_a_choice', sprintf( esc_html__( 'The value %s is not an allowed selection.' ), $value ) );
			}
		}
		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Select' );