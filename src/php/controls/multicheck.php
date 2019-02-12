<?php // @partial
/**
 * Multicheck Control custom class
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
class KKcp_Customize_Control_Multicheck extends KKcp_Customize_Control_Base_Choices {

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	public $type = 'kkcp_multicheck';

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	public $max = null;

	/**
	 * Sortable
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	public $sortable = false;

	/**
	 * {@inheritdoc}. Set `max` dynamically to the number of choices if the
	 * developer has not already set it explicitly and populate valida choices.
	 *
	 * @since 1.0.0
	 */
	public function __construct( $manager, $id, $args = array() ) {

		if ( isset( $args['choices'] ) && is_array( $args['choices'] ) && ! isset( $args['max'] ) ) {
			$args['max'] = count( $args['choices'] );
		}

		parent::__construct( $manager, $id, $args );

		$this->valid_choices = $this->get_valid_choices( $this->choices );

	}

	/**
	 * @since  1.0.0
	 * @inheritdoc
	 */
	public function enqueue() {
		if ( $this->sortable ) {
			wp_enqueue_script( 'jquery-ui-sortable' );
		}
	}

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected function add_to_json() {
		parent::add_to_json();

		$this->json['sortable'] = KKcp_SanitizeJS::bool( false, $this->sortable );
		$this->json['choicesOrdered'] = $this->value();
	}

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::multiple_choices( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::multiple_choices( $validity, $value, $setting, $control );
	}
}

// Register on WordPress Customize global object
$wp_customize->register_control_type( 'KKcp_Customize_Control_Multicheck' );