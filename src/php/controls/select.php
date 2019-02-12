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
	 * @inheritdoc
	 */
	public $type = 'kkcp_select';

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected $allowed_input_attrs = array(
		'native' => array( 'sanitizer' => 'bool' ),
		'hide_selected' => array( 'sanitizer' => 'bool' ),
		'sort' => array( 'sanitizer' => 'bool' ),
		'persist' => array( 'sanitizer' => 'bool' ),
		'removable' => array( 'sanitizer' => 'bool' ),
		'draggable' => array( 'sanitizer' => 'bool' ),
		'restore_on_backspace' => array( 'sanitizer' => 'bool' ),
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
}

// Register on WordPress Customize global object
$wp_customize->register_control_type( 'KKcp_Customize_Control_Select' );