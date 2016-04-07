<?php // @partial
/**
 * Content Control custom class
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
class PWPcp_Customize_Control_Content extends PWPcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_control';

	/**
	 * Markdown.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $markdown = '';

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
		<# if (data.label) { #><span class="customize-control-title"><# if (marked) { #>{{{ marked(data.label) }}}<# } else { #>{{{ data.label }}}<# } #></span><# } #>
		<# if (data.description) { #><span class="description customize-control-description"><# if (marked) { #>{{{ marked(data.description) }}}<# } else { #>{{{ data.description }}}<# } #></span><# } #>
		<# if (marked && data.markdown) { #><div class="description customize-control-markdown">{{{ marked(data.markdown) }}}</div><# } #>
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
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Content' );