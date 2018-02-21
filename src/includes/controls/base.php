<?php // @partial
/**
 * Customize Plus Control base class
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
	 * Whether this control setting value is optional, in other words, when its
	 * setting is allowed to be empty.
	 *
	 * @since 1.0.0
	 * @var bool
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
	 * @see JS kkcp.controls.Base->_validate
	 * @see JS kkcp.controls.Base->sanitize
	 *
	 * @since 1.0.0
	 * @var bool
	 */
	public $loose = false;

	/**
	 * Enable live validation of control's default setting value
	 *
	 * For readibility this property is 'positively' put. But in the JSON `params`
	 * it is reversed in its negative form, so that the `control.params` object
	 * get another property only in the less frequent case and prints a slightly
	 * smaller JSON. In `to_json` this becomes `noLiveValidation`.
	 *
	 * @see JS kkcp.controls.Base->initialize
	 *
	 * @since 1.0.0
	 * @var bool
	 */
	public $live_validation = true;

	/**
	 * Enable live sanitization of control's default setting value
	 *
	 * For readibility this property is 'positively' put. But in the JSON `params`
	 * it is reversed in its negative form, so that the `control.params` object
	 * get another property only in the less frequent case and prints a slightly
	 * smaller JSON. In `to_json` this becomes `noLiveSanitization`.
	 *
	 * @see JS kkcp.controls.Base->initialize
	 *
	 * @since 1.0.0
	 * @var bool
	 */
	public $live_sanitization = true;

	/**
	 * Info
	 *
	 * The control info data, optional. It displays the given content in a popover.
	 *
	 * @premium A Customize Plus Premium feature.
	 * @since 1.0.0
	 * @var array
	 */
	public $info;

	/**
	 * Advanced
	 *
	 * Whether this control is advanced or normal, users and developers will be
	 * able to hide or show the advanced controls.
	 *
	 * @premium A Customize Plus Premium feature.
	 * @since 1.0.0
	 * @var bool
	 */
	public $advanced = false;

	/**
	 * Whether this control is searchable by the Search tool.
	 *
	 * For readibility this property is 'positively' put. But in the JSON `params`
	 * it is reversed in its negative form, so that the `control.params` object
	 * get another property only in the less frequent case and prints a slightly
	 * smaller JSON. In `to_json` this becomes `unsearchable`.
	 *
	 * @premium A Customize Plus Premium feature.
	 * @since 1.0.0
	 * @var bool
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

		if ( $this->optional ) {
			$this->json['optional'] = true;
		}
		if ( $this->loose ) {
			$this->json['loose'] = true;
		}
		if ( ! $this->live_validation ) {
			$this->json['noLiveValidation'] = true;
		}
		if ( ! $this->live_sanitization ) {
			$this->json['noLiveSanitization'] = true;
		}

		// remove description if not specified
		if ( ! $this->description ) {
			unset( $this->json['description'] );
		}

		// remove content, we rely completely on js, and declare the control
		// container in the js control base class
		unset( $this->json['content'] );

		// @premium A Customize Plus Premium features.
		if ( class_exists( 'KKcpp' ) ) {
			// add info data if any
			if ( $this->info ) {
				$this->json['info'] = $this->info;
			}

			// add advanced data if specified
			if ( $this->advanced ) {
				$this->json['advanced'] = $this->advanced;
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
		?>
		<div class="customize-control-notifications-container"></div>
		<?php
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
	 * To override in subclasses with a js template
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

		return $control::sanitize( $value, $setting, $control );
	}

	/**
	 * Sanitize
	 *
	 * Class specific sanitization, method to override in subclasses.
	 *
	 * @since 1.0.0
	 * @see  JS `kkcp.controls.Base.sanitize`
	 *
	 * @abstract
	 * @param string               $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return string The sanitized value.
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return esc_html( $value );
		// return wp_kses_post( $value );
	}

	/**
	 * Validate callback
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
	 * @see  JS `kkcp.controls.Base._validate`
	 *
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
	 * @param WP_Customize_Setting $setting  Setting instance.
	 * @return mixed
	 */
	public static function validate_callback( $validity, $value, $setting ) {
		$control = $setting->manager->get_control( $setting->id );

		// immediately check a required value validity
		$validity = KKcp_Validate::required( $validity, $value, $setting, $control );

		// if a required value is not supplied only perform one validation routine
		if ( ! empty( $validity->get_error_messages() ) ) {
			return $validity;
		}

		// otherwise apply the specific control/setting validation
		return $control::validate( $validity, $value, $setting, $control );
	}

	/**
	 * Validate
	 *
	 * Class specific validation, method to override in subclasses.
	 *
	 * @since 1.0.0
	 * @see  JS `kkcp.controls.Base.validate`
	 *
	 * @abstract
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
	 *
	 * Allows control classes to add localized strings accessible on our main
	 * `js` object `kkcp.l10n`.
	 *
	 * @since  1.0.0
	 * @abstract
	 * @return array
	 */
	public function get_l10n() {
		return array();
	}

	/**
	 * Get localize string for current control
	 *
	 * Allows control classes to get a localized string by its key value. This is
	 * useful during validation to define the validation messages only once both
	 * for JavaScript and PHP validation.
	 *
	 * @see  JS `kkcp.controls.Base.l10n`
	 * @since  1.0.0
	 * @return string
	 */
	public function l10n( $key ) {
		$strings = $this->get_l10n();
		if ( isset( $strings[ $key ] ) ) {
			return $strings[ $key ];
		}
		if ( class_exists( 'KKcp_Customize' ) ) {
			$strings = KKcp_Customize::get_js_l10n();
			if ( isset( $strings[ $key ] ) ) {
				return $strings[ $key ];
			}
		}
		return '';
	}

	/**
	 * Get js constants for current controls.
	 *
	 * Allows control classes to add its specific constants variables on our
	 * main `js` object `kkcp.l10n`.
	 *
	 * @since  1.0.0
	 * @abstract
	 * @return array
	 */
	public function get_constants() {
		return array();
	}

	/**
	 * Add error
	 *
	 * Shortcut to manage the $validity object during validation
	 *
	 * @see  JS kkcp.controls.Base.addError
	 * @since  1.0.0
	 * @param WP_Error					$validity
	 * @param string						$msg_id
	 * @param mixd|array|null 	$msg_arguments
	 * @return WP_Error
	 */
	public function add_error( $validity, $msg_id, $msg_arguments ) {
		$msg = $this->l10n( $msg_id );

		// if there is an array of message arguments
		if ( is_array( $msg_arguments ) ) {
			$validity->add( $msg_id, vsprintf( $msg, $msg_arguments ) );
		}
		// if there is just one message argument
		else if ( ! empty( $msg_arguments ) ) {
			$validity->add( $msg_id, sprintf( $msg, $msg_arguments ) );
		// if it is a simple string message
		} else {
			$validity->add( $msg_id, $msg );
		}
		return $validity;
	}
}