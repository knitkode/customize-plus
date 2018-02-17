<?php // @partial
/**
 * Content Control custom class
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
class KKcp_Customize_Control_Content extends KKcp_Customize_Control_Base {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_content';

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $advanced = false;

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $searchable = false;

	/**
	 * Markdown.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $markdown = '';

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	public function to_json() {
		parent::to_json();

		if ( ! $this->description ) {
			unset( $this->json['description'] );
		}

		if ( $this->markdown ) {
			$this->json['markdown'] = $this->markdown;
		}
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public function content_template() {
		$this->js_tpl_guide();
		$this->js_tpl();
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
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
$wp_customize->register_control_type( 'KKcp_Customize_Control_Content' );