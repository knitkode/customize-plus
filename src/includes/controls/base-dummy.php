<?php // @partial
/**
 * Base Dummy Control custom class
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
class PWPcp_Customize_Control_Dummy extends WP_Customize_Control {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_dummy';

	/**
	 * Render
	 *
	 * The wrapper for this control can always be the same, we create it
	 * in javascript instead of php, so here we can therefore override
	 * the `render` function with an empty output This remove the unnecessary
	 * presence of the <li> micro template in the _wpCustomizeSettings JSON. // @@tobecareful let's the changes in WP API, they'll probably fix this \\
	 *
	 * @since 0.0.1
	 */
	protected function render() {}

	/**
	 * [content_template description]
	 * @return [type] [description]
	 */
	public function content_template() {
		ob_start( 'pwpcp_compress_html' ); ?>
		<# if (data.label) { #><span class="customize-control-title">{{{ data.label }}}</span><# } #>
		<# if (data.description) { #><span class="description customize-control-description">{{{ data.description }}}</span><# } #>
		<?php ob_end_flush();
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Dummy' );