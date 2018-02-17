<?php // @partial
/**
 * Select Control custom class
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
class KKcp_Customize_Control_Select extends KKcp_Customize_Control_Base_Choices {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_select';

	/**
	 * {@inheritDoc}. Selectize true by default for select controls
	 *
	 * @since 1.0.0
	 * @override
	 */
	public $selectize = true;

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected $selectize_allowed_options = array(
		'plugins' => array( 'sanitizer' => 'array', 'values' => array(
			'restore_on_backspace',
			'drag_drop',
			'remove_button'
		) ),
		'persist' => array( 'sanitizer' => 'bool' ),
		'hideSelected' => array( 'sanitizer' => 'bool' ),
		'sortField' => array( 'sanitizer' => 'string' ),
	);

  /**
   * {@inhertDoc}. Populate the `valid_choices` property.
   *
   * @since 1.0.0
   * @override
   */
  public function __construct( $manager, $id, $args = array() ) {
    parent::__construct( $manager, $id, $args );

    $this->valid_choices = $this->get_valid_choices( $this->choices );
  }

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function js_tpl_choice_ui() {
		?>
			<option class="{{helpClass}}"{{{ helpAttrs }}} value="{{ val }}"<?php // `selected` status synced through js in `control.ready()` ?><# if (choice.sublabel) { #> data-sublabel="{{{ choice.sublabel }}}"<# } #>>
				{{{ label }}}
			</option>
		<?php
	}

	/**
	 * {@inheritDoc}. Render needed html structure for CSS toggle / switch
	 *
	 * @since 1.0.0
	 * @override
	 */
	protected function js_tpl_above_choices () {
		?>
			<select name="_customize-kkcp_select-{{ data.id }}">
		<?php
	}

	/**
	 * {@inheritDoc}. Render needed html structure for CSS toggle / switch
	 *
	 * @since 1.0.0
	 * @override
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
$wp_customize->register_control_type( 'KKcp_Customize_Control_Select' );