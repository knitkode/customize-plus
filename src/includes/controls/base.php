<?php // @partial
/**
 * Customize Control base class.
 *
 * {@inheritDoc}
 *
 * @since 1.0.0
 * @override
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2018 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Customize_Control_Base extends WP_Customize_Control {

	/**
	 * Optional value
	 *
	 * Whether this control is optional, in other words, when it is allowed to
	 * be empty.
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	public $optional = false;

	/**
	 * Loose (allows human error to be previewed)
	 *
	 * Whether this control allows the user to set and preview an invalid value.
	 * The value will not be saved anyway. In fact when this option (applyable
	 * on all controls) is set to `true` the user will both see the notification
	 * error sent from JavaScript in the frontend AND the one from the backend.
	 * Since notifications are the same they will not be duplicated.
	 * When this option is set to `false` the user will not be able to preview
	 * an invalid value in the customizer preview, and the last valid value will
	 * always be the one both previewed and sent to the server.
	 *
	 * @see JS: `api.controls.Base->_beforeSet()`
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	public $loose = true;

	/**
	 * HTML (allows html in the setting value)
	 *
	 * // @@todo allow a set of whitelisted html tags to be passed in an `array`,
	 * if the value is `true` all html will be allowed (dangerous). If `false`
	 * no `html` is allowed at all. \\
	 *
	 * @since 1.0.0
	 * @var boolean|array
	 */
	public $html = false;

	/**
	 * The control guide data, optional. It displays some help in a popover.
	 * @premium A Customize Plus Premium feature.
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public $guide;

	/**
	 * Whether this control is advanced or normal, users and developers will be
	 * able to hide or show the advanced controls.
	 *
	 * @premium A Customize Plus Premium feature.
	 * @since 1.0.0
	 * @var boolean
	 */
	public $advanced = false;

	/**
	 * Whether this control is searchable by the Search tool.
	 *
	 * // @@tobecareful for readibility here is 'searchable' and not
	 * 'unsearchable', but in the `params` json is reversed, so that the
	 * `control.params` object get another property only if a control is not
	 * searchable (which should happen less often than otherwise...). \\
	 *
	 * @premium A Customize Plus Premium feature.
	 * @since 1.0.0
	 * @var boolean
	 */
	public $searchable = true;

	/**
	 * {inheritDoc}
	 *
	 * Change parent method adding more default data shared by all the controls
	 * (add them only if needed to save bytes on the huge `_wpCustomizeSettings`
	 * JSON on load). In the end call an abstract method to add stuff here from
	 * subclasses.
	 *
	 * @since 1.0.0
	 * @ovrride
	 */
	public function to_json() {
		parent::to_json();

		// add setting factory value
		// @@todo remove sprintf @see track https://core.trac.wordpress.org/ticket/34290#ticket \\
		if ( is_object( $this->setting ) ) {
			$this->json['vFactory'] = sprintf( json_encode( $this->setting->default ) );
		}

		// add setting initial value
		$this->json['vInitial'] = $this->value();

		// set control setting as optional
		if ( $this->optional ) {
			$this->json['optional'] = true;
		}

		// set control as loose
		if ( $this->loose ) {
			$this->json['loose'] = true;
		}

		// set control html option
		if ( $this->html ) {
			$this->json['html'] = true;
		}

		// remove description if not specified, save bytes in printed JSON...
		if ( ! $this->description ) {
			unset( $this->json['description'] );
		}

		// remove content, we rely completely on js, and declare
		// the control container in the js control base class
		unset( $this->json['content'] );

		// @premium A Customize Plus Premium features.
		if ( class_exists( 'KKcpp' ) ) {
			// add guide if any
			if ( $this->guide ) {
				$this->json['guide'] = $this->guide;
			}

			// add advanced flag if specified
			if ( $this->advanced ) {
				$this->json['advanced'] = true;
			}

			// add unsearchable flag if specified
			if ( ! $this->searchable ) {
				$this->json['unsearchable'] = true;
			}
		}

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
	 * @since 1.0.0
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
	 * @since 1.0.0
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
	 * @since 1.0.0
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
	 * @since 1.0.0
	 */
	protected function add_to_json() {}

	/**
	 * Never render any content for controls from PHP. We rely completely on js,
	 * and declare the control `<li>` container in the js control base class.
	 *
	 * @override
	 * @since 1.0.0
	 */
	protected function render() {}

	/**
	 * Never render any inner content for controls from PHP.
	 *
	 * @override
	 * @since 1.0.0
	 */
	public function render_content() {}

	/**
	 * Compose and minify js template rendered in the `js_tpl` function.
	 *
	 * @override
	 * @since 1.0.0
	 */
	public function content_template() {
		$this->js_tpl_guide();
		$this->js_tpl_extras();
		$this->js_tpl();
		$this->js_tpl_notifications();
	}

	/**
	 * Subclasses can have their own notifications container template
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_notifications() {
		echo '<div class="customize-control-notifications-container"></div>';
	}

	/**
	 * Subclasses can have their own 'guid' template overriding this method
	 *
	 * @premium A Customize Plus Premium feature.
	 * @since 1.0.0
	 */
	protected function js_tpl_guide() {
		if ( class_exists( 'KKcpp' ) ) {
		?>
			<# if (data.guide) { #>
				<i class="kkcp-guide kkcpui-control-btn dashicons dashicons-editor-help" title="<?php esc_html_e( 'Click to show some help' ); ?>"></i>
			<# } #>
		<?php
		}
	}

	/**
	 * Shared control header template.
	 * Read the label and description as markdown if the js plugin is available.
	 *
	 * @since 1.0.0
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
	 * @since 1.0.0
	 */
	protected function js_tpl_extras() {
		?>
			<div class="kkcp-extras">
				<i class="kkcp-extras-btn kkcpui-control-btn dashicons dashicons-admin-generic"></i>
				<ul class="kkcp-extras-list">
					<li class="kkcp-extras-reset_last"><?php esc_html_e( 'Reset to last saved value' ); ?></li>
					<li class="kkcp-extras-reset_initial"><?php esc_html_e( 'Reset to initial session value' ); ?></li>
					<li class="kkcp-extras-reset_factory"><?php esc_html_e( 'Reset to factory value' ); ?></li>
					<?php do_action( 'kkcp_controls_base_js_tpl_extras_add_list_items' ); ?>
				</ul>
			</div>
		<?php
	}

	/**
	 * To override in subclasses with js templates
	 *
	 * @abstract
	 * @since 1.0.0
	 */
	protected function js_tpl() {}

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
	 * @since 1.0.0
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @return string The sanitized value.
 	 */
	public static function sanitize_callback( $value, $setting ) {
		$control = $setting->manager->get_control( $setting->id );

		// @@doubt, is this sanitization useful? Or dangerous? \\
		if ( is_string( $value ) ) {
			$value = trim( $value );
		}

		return $control::sanitize( $value, $setting, $control ); // @@doubt, $control used to be `self` \\
	}

	/**
	 * Sanitize
	 *
	 * Class specific sanitization, method to override in subclasses.
	 *
	 * @since 1.0.0
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
	 * Valide callback
	 *
	 * All control's specific validation pass from this function which
	 * always check if the value satisfy the `optional` attribute and then
	 * delegates additional and specific validation to the class that
	 * inherits from this, which needs to override the static method `validate`.
	 * The control instance is always passed to that method in addition to the
	 * value and the setting instance.
	 *
	 * @see http://bit.ly/2kzgHlm
	 *
	 * @since 1.0.0
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
	 * @return mixed
 	 */
	public static function validate_callback( $validity, $value, $setting ) {
		$control = $setting->manager->get_control( $setting->id );

		if ( $control && ! $control->optional && KKcp_Validate::is_empty( $value ) ) {
			return KKcp_Validate::check_required( $value );
		}
		return $control::validate( $validity, $value, $setting, $control );
	}

	/**
	 * Validate
	 *
	 * Class specific validation, method to override in subclasses.
	 *
	 * @since 1.0.0
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return $validity;
	}

	/**
	 * Get localized strings for current controls.
	 * Allows control classes to add localized strings accessible on our main
	 * `js` object `kkcp.l10n`.
	 * @abstract
	 * @since  1.0.0
	 * @return array
	 */
	// public function get_l10n() { // @@doubt maybe not needed on this base class \\
	// 	return array();
	// }

	/**
	 * Get js constants for current controls.
	 * Allows control classes to add its specific constants variables on our
	 * main `js` object `kkcp.l10n`.
	 * @abstract
	 * @since  1.0.0
	 * @return array
	 */
	// public function get_constants() { // @@doubt maybe not needed on this base class \\
	// 	return array();
	// }
}