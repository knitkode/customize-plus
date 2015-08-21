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
	 * Markdown.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $markdown = '';

	/**
	 * Render
	 *
	 * The wrapper for this control can always be the same, we create it
	 * in javascript instead of php, so here we can therefore override
	 * the `render` function with an empty output This remove the unnecessary
	 * presence of the <li> micro template in the _wpCustomizeSettings JSON. // @@tobecareful let's the changes in WP API, they'll probably fix this \\
	 *
	 * @since 0.0.1
	 * @override
	 */
	protected function render() {}

	/**
	 * To JSON
	 *
	 * @since  0.0.1
	 */
	public function to_json() {
		parent::to_json();

		if ( ! $this->description ) {
			unset( $this->json['description'] );
		}
		unset( $this->json['content'] );

		if ( $this->markdown ) {
			$this->json['markdown'] = $this->markdown;
		}
	}

	/**
	 * Content template
	 *
	 * @since 0.0.1
	 * @override
	 */
	public function content_template() {
		ob_start( 'PWPcp_Utils::compress_html' ); ?>
		<# if (data.label) { #><span class="customize-control-title">{{{ marked(data.label) }}}</span><# } #>
		<# if (data.description) { #><span class="description customize-control-description">{{{ marked(data.description) }}}</span><# } #>
		<# if (data.markdown) { #><div class="description customize-control-markdown">{{{ marked(data.markdown) }}}</div><# } #>
		<?php ob_end_flush();
	}

	/**
	 * Sanitization callback
	 *
	 * @since 0.0.1
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @return string The sanitized value.
 	 */
	public static function sanitize_callback( $value, $setting ) {
		return null;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Dummy' );