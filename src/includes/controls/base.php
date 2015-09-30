<?php // @partial
/**
 * Customize Control base class
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
	 * Whether this control is optional, that is when it is allowed to be empty.
	 *
	 * @since 0.0.1
	 * @var boolean
	 */
	public $optional = false;

	/**
	 * The control divider data, optional
	 *
	 * @since 0.0.1
	 * @var array
	 */
	public $divider;

	/**
	 * The control guide data, optional. It displays some help in a popover.
	 * @premium A Customize Plus Premium feature.
	 *
	 * @since 0.0.1
	 * @var array
	 */
	public $guide;

	/**
	 * Whether this control is advanced or normal, users and developers will be
	 * able to hide or show the advanced controls.
	 *
	 * @premium A Customize Plus Premium feature.
	 * @since 0.0.1
	 * @var boolean
	 */
	public $advanced = false;

	/**
	 * Change parent method adding more default data shared by all the controls
	 * (add them only if needed to save bytes on the huge `_wpCustomizeSettings`
	 * JSON on load). In the end call an abstract method to add stuff here from
	 * subclasses.
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

		// set control setting as optional
		if ( $this->optional ) {
			$this->json['optional'] = true;
		}

		// @premium A Customize Plus Premium features.
		if ( class_exists( 'PWPcpp' ) ) {
			// add guide if any
			if ( $this->guide ) {
				$this->json['guide'] = $this->guide;
			}

			// add advanced flag if specified
			if ( $this->advanced ) {
				$this->json['advanced'] = true;
			}
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
	 * Add value to JSON if truthy on this object
	 *
	 * @deprecated 0.0.1
	 * @since 0.0.1
	 * @param string $key The name of the property
	 */
	protected function add_to_json_if_set( $key = '' ) {
		if ( $this->$key ) {
			$this->json[ $key ] = $this->$key;
		}
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
	 * @param array $keys
	 */
	protected function add_booleans_params_to_json( $keys = array() ) {
		foreach ( $keys as $key ) {
			if ( $this->$key ) {
				$this->json[ $key ] = true;
			}
		}
	}

	/**
	 * Add `'attrs'` to JSON checking that the values specifies in the given
	 * options are allowed to be configured.
	 *
	 * @since 0.0.1
	 * @param array $allowed The array contianing the allowed option keys.
	 * @param array $options The associative array with the customized options.
	 */
	protected function add_attrs_allowed_to_json( $allowed = array(), $options = array() ) {
		if ( is_array( $options ) && ! empty( $options ) ) {
			$attrs = array();
			foreach ( $options as $key => $value ) {
				if ( in_array( $key, $allowed ) ) {
					$attrs[ $key ] = $value;
				}
			}
			if ( ! empty( $attrs ) ) {
				$this->json['attrs'] = $attrs;
			}
		}
	}

	/**
	 * Add `'attrs'` to JSON merging them with the given defaults.
	 * Important is that null values are removed from the attrs array,
	 * so we use the defaults array both to check that the custom options
	 * are actually configurable (check if key exist on the defaults) and
	 * also to merge required default values using a value different than
	 * `null` in the given #defaults array.
	 *
	 * @since 0.0.1
	 * @param array $defaults Associative array with the default values.
	 * @param array $options  Associative array with the custom value.
	 */
	protected function add_attrs_with_defaults_to_json( $defaults = array(), $options = array() ) {
		$attrs = (array) $defaults;
		if ( is_array( $options ) && ! empty( $options ) ) {
			$options_cleaned = array();
			foreach ( $options as $key => $value ) {
				if ( $defaults[ $key ] ) {
					$options_cleaned[ $key ] = $value;
				}
			}
			$attrs = array_merge( $defaults, $options_cleaned );
		}
		// now remove null values
		foreach( $attrs as $key => $value ) {
			if( is_null( $value ) ) {
				unset( $attrs[ $key ] );
			}
		}
		if ( ! empty( $attrs ) ) {
			$this->json['attrs'] = $attrs;
		}
	}

	/**
	 * Add parameters passed to the JavaScript via JSON. This free us to override
	 * the `to_json` method calling everytime the parent method.
	 *
	 * @override
	 * @since 0.0.1
	 */
	protected function add_to_json() {}

	/**
	 * Never render any content for controls from PHP. We rely completely on js,
	 * and declare the control `<li>` container in the js control base class.
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
	 * Compose and minify js template rendered in the `js_tpl` function.
	 *
	 * @override
	 * @since 0.0.1
	 */
	public function content_template() {
		ob_start( 'PWPcp_Utils::compress_html' ); // @@doubt does this make the page load slower? \\
		$this->js_tpl_divider();
		$this->js_tpl_guide();
		 // this wrapper is needed to make the Extras menu play nice when divider
		 // is there, because of the absolute positioning
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
				<i class="pwpcp-guide pwpcpui-control-btn dashicons dashicons-editor-help" title="<?php _e( 'Click to show some help' ); ?>"></i>
			<# } #>
		<?php
	}

	/**
	 * Subclasses can have their own 'guid' template overriding this method
	 *
	 * @premium A Customize Plus Premium feature.
	 * @since 0.0.1
	 */
	protected function js_tpl_guide() {
		if ( class_exists( 'PWPcpp' ) ) {
		?>
			<# if (data.guide) { #>
				<i class="pwpcp-guide pwpcpui-control-btn dashicons dashicons-editor-help" title="<?php _e( 'Click to show some help' ); ?>"></i>
			<# } #>
		<?php
		}
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
	 * Subclasses can have their own 'extras' template overriding this method.
	 *
	 * @since 0.0.1
	 */
	protected function js_tpl_extras() {
		?>
			<div class="pwpcp-extras">
				<i class="pwpcp-extras-btn pwpcpui-control-btn dashicons dashicons-admin-generic"></i>
				<ul class="pwpcp-extras-list">
					<li class="pwpcp-extras-reset_last"><?php _e( 'Reset to last saved value' ); ?></li>
					<li class="pwpcp-extras-reset_initial"><?php _e( 'Reset to initial session value' ); ?></li>
					<li class="pwpcp-extras-reset_factory"><?php _e( 'Reset to factory value' ); ?></li>
					<?php do_action( 'PWPcp/controls/base/js_tpl_extras/add_list_items' ); ?>
				</ul>
			</div>
		<?php
	}

	/**
	 * To override in subclasses with js templates
	 *
	 * @abstract
	 * @since 0.0.1
	 */
	protected function js_tpl() {}

	/**
	 * Sanitization base callback
	 *
	 * Used as a default callback on thirdy part controls, like the WordPress
	 * native ones
	 *
	 * @since 0.0.1
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @return string The sanitized value.
 	 */
	public static function sanitize_base_callback( $value, $setting ) {
		return wp_kses_post( $value );
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
	public static function sanitize_callback( $value, $setting ) {
		$control = $setting->manager->get_control( $setting->id );

		$value = trim( $value );

		if ( $control && ! $control->optional && PWPcp_Sanitize::is_setting_value_empty( $value ) ) {
			return $setting->default;
		} else {
			return $control::sanitize( $value, $setting, $control ); // @@doubt, $control used to be `self` \\
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

	/**
	 * Get localized strings for current controls.
	 * Allows control classes to add localized strings accessible on our main
	 * `js` object `PWPcp.l10n`.
	 * @abstract
	 * @since  0.0.1
	 * @return array
	 */
	// public function get_l10n() { // @@doubt maybe not needed on this base class \\
	// 	return array();
	// }

	/**
	 * Get js constants for current controls.
	 * Allows control classes to add its specific constants variables on our
	 * main `js` object `PWPcp.l10n`.
	 * @abstract
	 * @since  0.0.1
	 * @return array
	 */
	// public function get_constants() { // @@doubt maybe not needed on this base class \\
	// 	return array();
	// }
}