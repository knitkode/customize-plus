<?php // @partial
/**
 * Content Control custom class
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     PlusWP <dev@pluswp.com> (https://pluswp.com)
 * @copyright  2017 PlusWP
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://pluswp.com/customize-plus
 */
class PWPcp_Customize_Control_Content extends PWPcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public $type = 'pwpcp_content';

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
		ob_start( 'PWPcp_Utils::compress_html' );
		$this->js_tpl_guide();
		$this->js_tpl();
		ob_end_flush();
	}

	/**
	 * Content control js template
	 *
	 * @since 0.0.1
	 * @override
	 */
	protected function js_tpl() {
		?>
		<# if (data.label) { #><span class="customize-control-title"><# if (marked) { #>{{{ marked(data.label) }}}<# } else { #>{{{ data.label }}}<# } #></span><# } #>
		<# if (data.description) { #><span class="description customize-control-description"><# if (marked) { #>{{{ marked(data.description) }}}<# } else { #>{{{ data.description }}}<# } #></span><# } #>
		<# if (marked && data.markdown) { #><div class="description customize-control-markdown">{{{ marked(data.markdown) }}}</div><# } #>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'PWPcp_Customize_Control_Content' );