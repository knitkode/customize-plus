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

	/**
	 * The control divider data, optional
	 * @var array
	 */
	public $divider;

	/**
	 * The control guide data, optional. It display some help
	 * in a popover for this control.
	 * @var array
	 */
	public $guide;

	/**
	 * Whether this control is optional, hence it is allowed to be empty.
	 *
	 * @var boolean
	 */
	public $optional = false;

	/**
	 * Whether this control is advanced or normal,
	 * users and developers will be able to hide or show
	 * the advanced controls.
	 *
	 * @var boolean
	 */
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

		// add setting factory value
		$this->json['vFactory'] = $this->setting->default;

		// add setting initial value
		$this->json['vInitial'] = $this->value();

		// add divider if any
		if ( $this->divider ) {
			$this->json['div'] = $this->divider;
		}

		// add guide if any
		if ( $this->guide ) {
			$this->json['guide'] = $this->guide;
		}

		// set control setting as optional
		if ( $this->optional ) {
			$this->json['optional'] = $this->optional;
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
		unset( $this->json['content'] );

		// call a function to add data to `control.params`
		$this->add_to_json();
	}

	/**
	 * Add booleans parameters to JSON
	 *
	 * Utility method to easily add truthy values to the control JSON data,
	 * without adding useless false values in the json params of the controls,
	 * where checking `if (control.params.param) {}` returns false anyway if
	 * the key is not set on the object. We save few bytes this way on the
	 * maybe huge customize JSON data.
	 *
	 * @since 0.0.1
	 * @param array $keys [description]
	 */
	protected function add_booleans_params_to_json( $keys = array() ) {
		foreach ( $keys as $key ) {
			if ( $this->$key ) {
				$this->json[ $key ] = true;
			}
		}
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
	protected function render() {}

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
		ob_start( 'pwpcp_compress_html' ); // @@doubt does this make the page load considerably slower? \\
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
			<# if (data.guide) { #>
				<i class="pwpcp-guide pwpcp-control-btn dashicons dashicons-editor-help" title="<?php _e( 'Click to show some help', 'pkgTextdomain' ); ?>"></i>
			<# } #>
		<?php
	}

	/**
	 * Shared control header template.
	 * Read the label and description as markdown if the js plugin is available.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_header() {
		?>
			<# if (data.label) { #>
				<div class="customize-control-title"><# if (marked) { #>{{{ marked(data.label) }}}<# } else { #>{{{ data.label }}}<# } #></div>
			<# } if (data.description) { #>
				<div class="description customize-control-description"><# if (marked) { #>{{{ marked(data.description) }}}<# } else { #>{{{ data.description }}}<# } #></div>
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

	/**
	 * Get localized strings for current controls.
	 * Allows control classes to add localized strings accessible
	 * on our main `js` object `PWPcp.l10n`.
	 * @abstract
	 * @since  0.0.1
	 * @return array
	 */
	public function get_l10n() {
		return array();
	}

	/**
	 * Sanitization callback
	 *
	 * All control's specific sanitizations pass from this function which
	 * always check if the value satisfy the `optional` attribute and then
	 * delegates additional and specific sanitization to the class that
	 * inherits from this, which need to override the static method `sanitize`.
	 * The control instance is always passed to that method in addition to the
	 * value and the setting instance.
	 *
	 * @since 0.0.1
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @return string The sanitized value.
 	 */
	final public static function sanitize_callback( $value, $setting ) {
		$control = $setting->manager->get_control( $setting->id );

		if ( $control && !$control->optional && is_null( $value ) ) { // @@todo tocheck if is_null is fine \\
			return $setting->default;
		} else {
			return self::sanitize( $value, $setting, $control );
		}
	}

	/**
	 * Sanitize
	 *
	 * Class specific sanitization, method to override in subclasses.
	 *
	 * @since 0.0.1
	 * @abstract
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		return wp_kses_post( $value );
	}
}