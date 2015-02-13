<?php // @partial
/**
 * Customize Control base class, override WordPress one
 * with few variations
 *
 * @override
 * @since 0.0.1
 */
class K6CP_Customize_Control_Base extends WP_Customize_Control {

	public $divider;

	public $advanced = false;

	/**
	 * Change parent method adding more default data
	 * shared by all the controls (add them only if needed
	 * to save bytes on the huge `_wpCustomizeSettings` JSON
	 * on load):
	 * original value, divider info, advanced flag
	 * In the end call a method to add stuff here
	 *
	 * @override
	 * @since 0.0.1
	 */
	public function to_json() {
		parent::to_json();

		// add original setting value
		$this->json['original'] = $this->setting->default;

		// add divider info if any
		if ( $this->divider ) {
			$this->json['div'] = $this->divider;
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
		unset( $this->json['content'] ); // k6tobecareful change related to overridden render() in K6CP_Customize_Control_Base \\

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
	protected function render() {} // k6tobecareful change related to overridden render() in K6CP_Customize_Control_Base \\

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
		ob_start( 'k6_compress_html' );
		$this->js_tpl_divider();
		 // this wrapper is needed to make the Extras menu play nice when divider is there, because of the absolute positioning
		echo '<# if (data.div) { #><div class="k6-control-wrap"><# } #>';
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
				<div class="k6-control-divider">
					<# if (data.div.title) { #><span class="customize-control-title">{{{ data.div.title }}}</span><# }
						if (data.div.text) { #><span class="description customize-control-description">{{{ data.div.text }}}</span><# } #>
				</div>
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
			<div class="k6-extras">
				<i class="k6-extras-btn dashicons dashicons-admin-generic"></i>
				<ul class="k6-extras-list">
					<li class="k6-extras-reset_last"><?php _e( 'Reset to initial session value', 'pkgTextdomain' ); ?></li>
					<li class="k6-extras-reset"><?php _e( 'Reset to factory value', 'pkgTextdomain' ); ?></li>
					<li class="k6-extras-hide"><?php _e( 'Hide this control', 'pkgTextdomain' ); ?></li>
				</ul>
			</div>
		<?php
	}

	/**
	 * A reusable template partial to display a tabbed area with screen size based sliders.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_screen_based_sliders() {
		?>
			<div class="k6-tabbed k6-screen-picker">
				<ul>
					<li data-screen="xs" class="k6-tab" tabindex="0" title="<?php _e( 'Extra small screen / phone', 'pkgTextdomain' ); ?>"><i class="dashicons dashicons-smartphone"></i></li>
					<li data-screen="sm" class="k6-tab" tabindex="0" title="<?php _e( 'Small screen / tablet', 'pkgTextdomain' ); ?>"><i class="dashicons dashicons-tablet"></i></li>
					<li data-screen="md" class="k6-tab" tabindex="0" title="<?php _e( 'Medium screen / desktop', 'pkgTextdomain' ); ?>"><i class="dashicons dashicons-tablet"></i></li>
					<li data-screen="lg" class="k6-tab selected" tabindex="0" title="<?php _e( 'Large screen / wide desktop', 'pkgTextdomain' ); ?>"><i class="dashicons dashicons-desktop"></i></li>
				</ul>
				<div class="k6-tab-content" data-screen="xs">
					<span class="k6-hint"><span class="k6-subhint"><?php _e( 'Control appearance on', 'pkgTextdomain' ) ?></span> <?php _e( 'extra small screen / phone:', 'pkgTextdomain' ); ?></span>
					<div class="k6-slider" data-screen="xs"></div>
				</div>
				<div class="k6-tab-content" data-screen="sm">
					<span class="k6-hint"><span class="k6-subhint"><?php _e( 'Control appearance on', 'pkgTextdomain' ) ?></span> <?php _e( 'small screen / tablet:', 'pkgTextdomain' ); ?></span>
					<div class="k6-slider" data-screen="sm"></div>
				</div>
				<div class="k6-tab-content" data-screen="md">
					<span class="k6-hint"><span class="k6-subhint"><?php _e( 'Control appearance on', 'pkgTextdomain' ) ?></span> <?php _e( 'medium screen / desktop:', 'pkgTextdomain' ); ?></span>
					<div class="k6-slider" data-screen="md"></div>
				</div>
				<div class="k6-tab-content selected" data-screen="lg">
					<span class="k6-hint"><span class="k6-subhint"><?php _e( 'Control appearance on', 'pkgTextdomain' ) ?></span> <?php _e( 'large screen / wide desktop:', 'pkgTextdomain' ); ?></span>
					<div class="k6-slider" data-screen="lg"></div>
				</div>
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