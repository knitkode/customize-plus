<?php // @partial
/**
 * Icon Control custom class
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
class KKcp_Customize_Control_Icon extends KKcp_Customize_Control_Base_Set {

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	public $type = 'kkcp_icon';

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	public $choices = array( 'dashicons' );

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected $supported_sets = array(
		'dashicons'
	);

	/**
	 * @since 1.0.0
	 * @inheritdoc
	 */
	protected $set_js_var = 'iconSets';

	/**
	 * @since  1.0.0
	 * @inheritdoc
	 */
	protected function get_set ( $name ) {
		if ( $name === 'dashicons' ) {
			return KKcp_Data::get_dashicons();
		}

		return [];
	}

	/**
	 * @since  1.0.0
	 * @inheritdoc
	 */
	public function get_l10n() {
		return array(
			'iconSearchPlaceholder' => esc_html__( 'Search icon by name...' ),
		);
	}
}

// Register on WordPress Customize global object
$wp_customize->register_control_type( 'KKcp_Customize_Control_Icon' );