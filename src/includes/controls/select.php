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

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_select';

	/**
	 * Multiple
	 *
	 * @since 0.0.1
	 * @var boolean
	 */
	protected $multiple = false;

	/**
	 * Selectize
	 *
	 * @since 0.0.1
	 * @var boolean|array
	 */
	protected $selectize = false;

	/**
	 * Override here beacause we need to decode the value (is a JSON)
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		parent::add_to_json();
		$this->json['multiple'] = $this->multiple;
		if ( $this->selectize ) {
			$this->json['selectize'] = $this->selectize;
		}
	}

	/**
	 * Render template for choice displayment.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_choice() {
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
			<select name="_customize-pwpcp_select-{{ data.id }}"<# if (data.multiple) { #> multiple="true"<# } #>>
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