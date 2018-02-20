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
	 * @inheritDoc
	 */
	public $type = 'kkcp_icon';

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $choices = array( 'dashicons' );

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected $supported_sets = array(
		'dashicons'
	);

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected $set_js_var = 'iconSets';

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	protected function get_set ( $name ) {
		if ( $name === 'dashicons' ) {
			return KKcp_Data::get_dashicons();
		}

		return [];
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?>
		</label>
		<select class="kkcp-selectize" placeholder="<?php esc_html_e( 'Search icon by name...' ) ?>"<# if (data.max > 1) { #>  name="icon[]" multiple<# } else { #>name="icon"<# } #>><option value=""><?php esc_html_e( 'Search icon by name...' ) ?></option></select>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Icon' );