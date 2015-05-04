<?php // @partial
/**
 * Customize Control base class, override WordPress one
 * with few variations
 *
 * @override
 * @since 0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     PlusWP <dev@pluswp.com> (http://pluswp.com)
 * @copyright  2015 PlusWP (kunderi kuus)
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       http://pluswp.com/customize-plus
 */
class PWPcp_Customize_Control_Base extends WP_Customize_Control {

	public $divider;

	public $guide;

	public $advanced = false;

	/**
	 * Change parent method adding more default data
	 * shared by all the controls (add them only if needed
	 * to save bytes on the huge `_wpCustomizeSettings` JSON
	 * on load):
	 * original value, divider, guide, advanced flag
	 * In the end call a method to add stuff here
	 *
	 * @override
	 * @since 0.0.1
	 */
	public function to_json() {
		parent::to_json();

		// add original setting value
		$this->json['original'] = $this->setting->default;

		// add divider if any
		if ( $this->divider ) {
			$this->json['div'] = $this->divider;
		}

		// add guide if any
		if ( $this->guide ) {
			$this->json['guide'] = $this->guide;
		}

		// add advanced flag if specified
		if ( $this->advanced ) {
			$this->json['advanced'] = true;
		}

		// remove description if not specified, save bytes...
		if ( ! $this->description ) {
			unset( $this->json['description'] );
		}

		// remove content, we rely completely on js, and declare
		// the control container in the js control base class
		unset( $this->json['content'] ); // @@tobecareful change related to overridden render() in PWPcp_Customize_Control_Base \\

		// call a function to add data to `control.params`
		$this->add_to_json();
	}

	/**
	 * Add parameters passed to the JavaScript via JSON.
	 * This free us to override the `to_json` method
	 * calling everytime the parent method.
	 *
	 * @override
	 * @since 0.0.1
	 */
	protected function add_to_json() {}

	/**
	 * Never render any wrapper content for controls from PHP.
	 * We rely completely on js, and declare the control `<li>`
	 * container in the js control base class
	 *
	 * @override
	 * @since 0.0.1
	 */
	protected function render() {} // @@tobecareful change related to overridden render() in PWPcp_Customize_Control_Base \\

	/**
	 * Never render any inner content for controls from PHP.
	 *
	 * @override
	 * @since 0.0.1
	 */
	public function render_content() {}

	/**
	 * Overrride WordPress method to minify js template
	 * rendered in the js_tpl function
	 *
	 * @override
	 * @since 0.0.1
	 */
	public function content_template() {
		ob_start( 'pwpcp_compress_html' );
		$this->js_tpl_divider();
		 // this wrapper is needed to make the Extras menu play nice when divider is there, because of the absolute positioning
		echo '<# if (data.div) { #><div class="pwpcp-control-wrap"><# } #>';
			$this->js_tpl_extras();
			$this->js_tpl();
		// see comment above
		echo '<# if (data.div) { #></div><# } #>';
		ob_end_flush();
	}

	/**
	 * Subclasses can have their own 'divider' template overriding this method
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_divider() {
		?>
			<# if (data.div) { #>
				<div class="pwpcp-control-divider">
					<# if (data.div.title) { #><span class="customize-control-title">{{{ data.div.title }}}</span><# }
						if (data.div.text) { #><span class="description customize-control-description">{{{ data.div.text }}}</span><# } #>
				</div>
			<# } #>
			<!-- <div class="pwpcp-help" data-tip="help" data-tip_title="trial" data-tip_text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque a beatae aspernatur recusandae soluta perspiciatis quam? Doloremque officiis non, fugit, placeat sunt incidunt recusandae assumenda, blanditiis ad minima nisi illo!">help</div> -->
			<!-- admin-comments -->
			<# if (data.guide) { #>
				<i class="pwpcp-guide pwpcp-control-btn dashicons dashicons-editor-help"></i>
			<# } #>
		<?php
	}

	/**
	 * Shared control header template
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_header() {
		?>
			<# if (data.label) { #>
				<span class="customize-control-title">{{{ data.label }}}</span>
			<# } if (data.description) { #>
				<span class="description customize-control-description">{{{ data.description }}}</span>
			<# } #>
		<?php
	}

	/**
	 * Subclasses can have their own 'extras' template overriding this method
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_extras() {
		?>
			<div class="pwpcp-extras">
				<i class="pwpcp-extras-btn pwpcp-control-btn dashicons dashicons-admin-generic"></i>
				<ul class="pwpcp-extras-list">
					<li class="pwpcp-extras-reset_last"><?php _e( 'Reset to initial session value', 'pkgTextdomain' ); ?></li>
					<li class="pwpcp-extras-reset"><?php _e( 'Reset to factory value', 'pkgTextdomain' ); ?></li>
					<li class="pwpcp-extras-hide"><?php _e( 'Hide this control', 'pkgTextdomain' ); ?></li>
				</ul>
			</div>
		<?php
	}

	/**
	 * To override in subclasses with js templates
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl() {}
}