<?php defined( 'ABSPATH' ) or die;

/**
 * Customize custom classes for panels, sections, control and settings.
 *
 * All custom classes are collected in this file by an automated gulp task.
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */

/**
 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
 */
global $wp_customize;


/**
 * Customize Control base class
 *
 * @override
 * @since 1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Base extends WP_Customize_Control {

	/**
	 * Whether this control is optional, that is when it is allowed to be empty.
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	public $optional = false;

	/**
	 * The control divider data, optional
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public $divider;

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
	 *
	 *
	 * @premium A Customize Plus Premium feature.
	 * @since 1.0.0
	 * @var boolean
	 */
	public $searchable = true;

	/**
	 * Change parent method adding more default data shared by all the controls
	 * (add them only if needed to save bytes on the huge `_wpCustomizeSettings`
	 * JSON on load). In the end call an abstract method to add stuff here from
	 * subclasses.
	 *
	 * @override
	 * @since 1.0.0
	 */
	public function to_json() {
		parent::to_json();

		// add setting factory value
	
		if ( is_object( $this->setting ) ) {
			if ( is_string( $this->setting->default ) ) {
				$this->json['vFactory'] = sprintf( $this->setting->default );
			} else {
				$this->json['vFactory'] = sprintf( json_encode( $this->setting->default ) );
			}
		}

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
		ob_start( 'KKcp_Utils::compress_html' );
		$this->js_tpl_divider();
		$this->js_tpl_guide();
		 // this wrapper is needed to make the Extras menu play nice when divider
		 // is there, because of the absolute positioning
		echo '<# if (data.divider) { #><div class="kkcp-control-wrap"><# } #>';
			$this->js_tpl_extras();
			$this->js_tpl();
		echo '<div class="customize-control-notifications-container"></div>';
			} else {
				return wp_kses( $value, array() );
			}
		}
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
	 * Validation callback
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

		if ( $control && ! $control->optional && KKcp_Sanitize::is_setting_value_empty( $value ) ) {
			$validity->add( 'required', esc_html__( 'You must supply a value.', 'kkcp' ) );
		} else {
			if ( method_exists( $control, 'validate' ) ) {
				return $control::validate( $validity, $value, $setting, $control );;
			}
		}
		return $validity;
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
	// public function get_l10n() {
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
	// public function get_constants() {
	// 	return array();
	// }
}

/**
 * Base Input Control custom class
 * This is here just to be extended
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
abstract class KKcp_Customize_Control_Base_Input extends KKcp_Customize_Control_Base {

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		$this->json['attrs'] = $this->input_attrs;
	}

	/**
	 * Render a JS template for the content of the text control.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?><# var a = data.attrs; #>
			<input type="{{ a.type || data.type.replace('kkcp_','') }}" value="<?php // filled through js ?>" <# for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #>>
		</label>
		<?php
	}
}

/**
 * Base Radio Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
abstract class KKcp_Customize_Control_Base_Radio extends KKcp_Customize_Control_Base {

	/**
	 * Add basic parameters passed to the JavaScript via JSON
	 * nedeed by any radio control.
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		$this->json['id'] = $this->id;
		$this->json['choices'] = $this->choices;
	}

	/**
	 * Js template
	 *
	 * Choice supports both a string if you only want to pass a label
	 * or an object with label, sublabel, help, help_title, etc.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl() {
		?>
		<# var choices = data.choices, idx = 0;
			if (!_.isEmpty(choices)) { #>
				<?php $this->js_tpl_header(); ?>
				<?php $this->js_tpl_above_choices(); ?>
				<?php $this->js_tpl_choices_loop(); ?>
				<?php $this->js_tpl_below_choices(); ?>
		<# } #>
		<?php
	}

	/**
	 * Ouput the choices template in a loop. Override this in subclasses
	 * to change behavior, for instance in sortable controls.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_choices_loop () {
		?>
		<# for (var val in choices) { #>
			<?php $this->js_tpl_choice(); ?>
		<#} #>
		<?php
	}

	/**
	 * Ouput the js to configure each choice template data and its UI
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_choice () {
		?>
		<# if (choices.hasOwnProperty(val)) {
			var label;
			var choice = choices[val];
			var helpClass = '';
			var helpAttrs = '';
			var id = data.id + idx++;
			if (typeof choices[val] === 'string') {
				label = choice;
			} else {
				label = choice.label;
				if (choice.help) {
					helpClass = 'kkcp-help';
					helpAttrs = ' data-help=' + choice.help;
					if (choice.help_title) helpAttrs += ' data-title=' + choice.help_title;
					if (choice.help_img) helpAttrs += ' data-img=' + choice.help_img;
					if (choice.help_text) helpAttrs += ' data-text=' + choice.help_text;
					if (choice.help_video) helpAttrs += ' data-video=' + choice.help_video;
				}
			} #>
			<?php $this->js_tpl_choice_ui(); ?>
		<# } #>
		<?php
	}

	/**
	 * Hook to print a custom choice template
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_choice_ui () {}

	/**
	 * Hook to add a part of template just before the choices loop
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_above_choices () {}

	/**
	 * Hook to add a part of template just after the choices loop.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_below_choices () {}

	/**
	 * Sanitize
	 *
	 * @since 1.0.0
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::string_in_choices( $value, $setting, $control );
	}

	/**
	 * Validate
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::string_in_choices( $validity, $value, $setting, $control );
	}
}

/**
 * Buttonset Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Buttonset extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_buttonset';

	/**
	 * Render template for choice displayment.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_choice_ui () {
		?>
			<input id="{{ id }}" type="radio" value="{{ val }}" name="_customize-kkcp_buttonset-{{ data.id }}"<?php // `checked` status synced through js in `control.ready()` ?>>
			<label class="{{helpClass}} kkcpui-tooltip--top" {{{ helpAttrs }}} for="{{ id }}" onclick="" title="{{{ label }}}">{{{ label }}}</label>
		<?php
	}

	/**
	 * Render needed html structure for CSS buttonset
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_above_choices () {
		?>
			<div class="switch-toggle kkcpui-switch switch-{{ _.size(choices) }}">
		<?php
	}

	/**
	 * Render needed html structure for CSS buttonset
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_below_choices () {
		?>
			<a></a>
			</div>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Buttonset' );

/**
 * Checkbox Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Checkbox extends KKcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_checkbox';

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		$this->json['attrs'] = $this->input_attrs;
	}

	/**
	 * Render a JS template for the content of the text control.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl() {
		?>
		<label>
			<# if (data.label) { #><span class="customize-control-title">{{{ data.label }}}</span><# } #>
			<input type="checkbox" name="_customize-kkcp_checkbox-{{ data.id }}" value="<?php // filled through js ?>" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #> <# if (data.value) { #>checked<# } #>>
			<# if (data.description) { #>{{{ data.description }}}<# } #>
		</label>
		<?php
	}

	/**
	 * Sanitize
	 *
	 * @since 1.0.0
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		$filtered = filter_var( $value, FILTER_VALIDATE_BOOLEAN );
		return $filtered ? 1 : 0;
	}

	/**
	 * Validate
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		$filtered = filter_var( $value, FILTER_VALIDATE_BOOLEAN );
		if ( $filtered != 0 && $filtered != 1 ) {
			$validity->add( 'wrong', esc_html__( 'The checkbox should be either checked or unchecked.', 'kkcp' ) );
		}
		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Checkbox' );

/**
 * Color Control custom class
 *
 * The color control uses Spectrum as a Javascript Plugin which offers more
 * features comparing to Iris, the default one used by WordPress.
 * We basically whitelist the Spectrum options that developers are allowed to
 * define setting them as class protected properties which are then put in the
 * JSON params of the control object, ready to be used in the javascript
 * implementation.
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Color extends KKcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * {@inheritdoc}
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_color';

	/**
	 * Allow alpha channel modification (rgba colors)
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	protected $allowAlpha = false;

	/**
	 * Disallow transparent color
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	protected $disallowTransparent = false;

	/**
	 * Palette
	 *
	 * {@link(https://bgrins.github.io/spectrum/#options-selectionPalette, js docs)}
	 * @since 1.0.0
	 * @var boolean
	 */
	protected $palette = array();

	/**
	 * Show palette only in color control
	 *
	 * {@link(https://bgrins.github.io/spectrum/#options-showPaletteOnly, js docs)}
	 * @since 1.0.0
	 * @var boolean
	 */
	protected $showPaletteOnly = false;

	/**
	 * Toggle palette only in color control
	 *
	 * {@link(https://bgrins.github.io/spectrum/#options-togglePaletteOnly, js docs)}
	 * @since 1.0.0
	 * @var boolean
	 */
	protected $togglePaletteOnly = false;

	/**
	 * Get l10n
	 *
	 * {@inheritdoc}
	 * @since  1.0.0
	 * @override
	 */
	public function get_l10n() {
		return array(
			'cancelText' => esc_html__( 'Cancel', 'kkcp' ),
			'chooseText' => esc_html__( 'Choose', 'kkcp' ),
			'clearText' => esc_html__( 'Clear selection', 'kkcp' ),
			'noColorSelectedText' => esc_html__( 'No color selected', 'kkcp' ),
			'togglePaletteMoreText' => esc_html__( 'Show color picker', 'kkcp' ),
			'togglePaletteLessText' => esc_html__( 'Hide color picker', 'kkcp' ),
			'vNotInPalette' => esc_html__( 'Color not in the allowed palette.', 'kkcp' ),
		);
	}

	/**
	 * Add to JSON
	 *
	 * {@inheritdoc}
	 * @since 1.0.0
	 * @override
	 */
	protected function add_to_json() {
		$value = $this->value();

		$this->add_booleans_params_to_json( array(
			'allowAlpha',
			'disallowTransparent',
			'showPaletteOnly',
			'togglePaletteOnly',
		) );

		if ( $this->palette ) {
			$this->json['palette'] = $this->palette;
		}

		$this->json['mode'] = 'custom';
		$this->json['valueCSS'] = $value;
	}

	/**
	 * JS template
	 *
	 * {@inheritdoc}
	 * @since 1.0.0
	 * @override
	 */
	protected function js_tpl() {
		?>
		<?php $this->js_tpl_header(); ?>
		<span class="kkcpcolor-current kkcpcolor-current-bg"></span>
		<span class="kkcpcolor-current kkcpcolor-current-overlay" style="background:{{data.valueCSS}}"></span>
		<button class="kkcpui-toggle kkcpcolor-toggle"><?php esc_html_e( 'Select Color', 'kkcp' ) ?></button>
		<div class="kkcp-expander">
			<input class="kkcpcolor-input" type="text">
		</div>
		<?php
	}

	/**
	 * Sanitize
	 *
	 * {@inheritdoc}
	 * @since 1.0.0
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		if ( $control->showPaletteOnly &&
			! $control->togglePaletteOnly &&
			is_array( $control->palette )
		) {
			$palette_flatten = KKcp_Sanitize::array_flatten( $control->palette, 1 );
			$palette_normalized = array_map( 'KKcp_Sanitize::hex_to_rgb', $palette_flatten );
			$value_normalized = KKcp_Sanitize::hex_to_rgb( $value );
			if ( KKcp_Sanitize::in_array_r( $value_normalized, $palette_normalized ) ) {
				return $value;
			} else {
				return $setting->default;
			}
		}
		else if ( 'transparent' === $value && ! $control->disallowTransparent ) {
			return $value;
		}
		else if ( ( $output = KKcp_Sanitize::color_rgba( $value ) ) && $control->allowAlpha ) {
			return $output;
		}
		else if ( $output = KKcp_Sanitize::color_hex( $value ) ) {
			return $output;
		}
		else {
			return $setting->default;
		}
	}

	/**
	 * Validate
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		if ( $control->showPaletteOnly &&
			! $control->togglePaletteOnly &&
			is_array( $control->palette )
		) {
			$palette_flatten = KKcp_Sanitize::array_flatten( $control->palette, 1 );
			$palette_normalized = array_map( 'KKcp_Sanitize::hex_to_rgb', $palette_flatten );
			$value_normalized = KKcp_Sanitize::hex_to_rgb( $value );
			if ( ! KKcp_Sanitize::in_array_r( $value_normalized, $palette_normalized ) ) {
				$validity->add( 'wrong_color', esc_html__( 'The color is not in the palette.', 'kkcp' ) );
			}
		}
		if ( 'transparent' === $value && $control->disallowTransparent ) {
			$validity->add( 'wrong_color', esc_html__( 'Transparent is not allowed for this setting.', 'kkcp' ) );
		}
		if ( ( $output = KKcp_Sanitize::color_rgba( $value ) ) && ! $control->allowAlpha ) {
			$validity->add( 'wrong_color', esc_html__( 'RGBA color is not allowed for this setting.', 'kkcp' ) );
		}
		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Color' );

/**
 * Content Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Content extends KKcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_content';

	/**
	 * Markdown.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $markdown = '';

	/**
	 * To JSON
	 *
	 * @since  1.0.0
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
	 * @since 1.0.0
	 * @override
	 */
	public function content_template() {
		ob_start( 'KKcp_Utils::compress_html' );
		$this->js_tpl_guide();
		$this->js_tpl();
		ob_end_flush();
	}

	/**
	 * Content control js template
	 *
	 * @since 1.0.0
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
$wp_customize->register_control_type( 'KKcp_Customize_Control_Content' );

/**
 * Font Family Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Font_Family extends KKcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_font_family';

	/**
	 * Font families
	 *
	 * @see http://www.w3schools.com/cssref/css_websafe_fonts.asp
	 * @var array
	 */
	public static $font_families = array(
		// Serif Fonts
		'Georgia',
		'"Palatino Linotype"',
		'"Book Antiqua"',
		'Palatino',
		'"Times New Roman"',
		'Times',
		'serif',
		// Sans-Serif Fonts
		'Arial',
		'Helvetica',
		'"Helvetica Neue"',
		'"Arial Black"',
		'Gadget',
		'"Comic Sans MS"',
		'cursive',
		'Impact',
		'Charcoal',
		'"Lucida Sans Unicode"',
		'"Lucida Grande"',
		'Tahoma',
		'Geneva',
		'"Trebuchet MS"',
		'Verdana',
		'sans-serif',
		// Monospace Font
		'"Courier New"',
		'Courier',
		'"Lucida Console"',
		'Monaco',
		'monospace',
		'Menlo',
		'Consolas',

		// Google font
		'"Lato"',
	);

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		$this->json['value'] = KKcp_Sanitize::font_families( $this->value() );
	}

	/**
	 * Render a JS template for the content of the control.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?>
		</label>
		<!-- <label>
			<input class="kkcp-font-google-toggle" type="checkbox" value="0">
			<?php esc_html_e( 'Enable Google fonts', 'kkcp' ); ?>
		</label> -->
		<input class="kkcp-selectize" type="text" value="{{ data.value }}" required>
		<?php
	}

	/**
	 * Set font families array as a constant to use in javascript
	 *
	 * @override
	 * @since  1.0.0
	 * @return array
	 */
	public function get_constants() {
		return array(
			'font_families' => KKcp_Sanitize::font_families( self::$font_families ),
		);
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Font_Family' );

/**
 * Icon Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Icon extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_icon';

	/**
	 * Selectize disabled (`false`) or enabled (just `true` or array of options)
	 *
	 * @since 1.0.0
	 * @var boolean|array
	 */
	protected $selectize = array();

	/**
	 * Selectize allowed options
	 *
	 * Sanitize methods must be class methods of `KKcp_Sanitize` or global
	 * functions
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public static $selectize_allowed_options = array(
		'plugins' => array( 'sanitizer' => 'js_array', 'values' => array(
			'drag_drop',
			'remove_button'
		) ),
		'maxItems' => array( 'sanitizer' => 'js_number_or_null' ),
		'persist' => array( 'sanitizer' => 'js_bool' ),
		'hideSelected' => array( 'sanitizer' => 'js_bool' ),
		'sortField' => array( 'sanitizer' => 'js_string' ),
	);

	/**
	 * Icons set
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $icons_set = array(
		'dashicons'
	);

	/**
	 * Get an array of all available dashicons.
	 *
	 * @static
	 * @access public
	 * @return array
	 */
	public static function get_dashicons() {
		return array(
			'admin_menu' => array(
				'label' => esc_html__( 'Admin Menu', 'kkcp' ),
				'icons' => array(
					'menu',
					'admin-site',
					'dashboard',
					'admin-post',
					'admin-media',
					'admin-links',
					'admin-page',
					'admin-comments',
					'admin-appearance',
					'admin-plugins',
					'admin-users',
					'admin-tools',
					'admin-settings',
					'admin-network',
					'admin-home',
					'admin-generic',
					'admin-collapse',
					'filter',
					'admin-customizer',
					'admin-multisite',
				)
			),
			'welcome_screen' => array(
				'label' => esc_html__( 'Welcome Screen', 'kkcp' ),
				'icons' => array(
					'welcome-write-blog',
					'welcome-add-page',
					'welcome-view-site',
					'welcome-widgets-menus',
					'welcome-comments',
					'welcome-learn-more',
				),
			),
			'post_formats' => array(
				'label' => esc_html__( 'Post Formats', 'kkcp' ),
				'icons' => array(
					'format-aside',
					'format-image',
					'format-gallery',
					'format-video',
					'format-status',
					'format-quote',
					'format-chat',
					'format-audio',
					'camera',
					'images-alt',
					'images-alt2',
					'video-alt',
					'video-alt2',
					'video-alt3',
				)
			),
			'media' => array(
				'label' => esc_html__( 'Media', 'kkcp' ),
				'icons' => array(
					'media-archive',
					'media-audio',
					'media-code',
					'media-default',
					'media-document',
					'media-interactive',
					'media-spreadsheet',
					'media-text',
					'media-video',
					'playlist-audio',
					'playlist-video',
					'controls-play',
					'controls-pause',
					'controls-forward',
					'controls-skipforward',
					'controls-back',
					'controls-skipback',
					'controls-repeat',
					'controls-volumeon',
					'controls-volumeoff',
				)
			),
			'image_editing' => array(
				'label' => esc_html__( 'Image Editing', 'kkcp' ),
				'icons' => array(
					'image-crop',
					'image-rotate',
					'image-rotate-left',
					'image-rotate-right',
					'image-flip-vertical',
					'image-flip-horizontal',
					'image-filter',
					'undo',
					'redo',
				)
			),
			'tinymce' => array(
				'label' => esc_html__( 'Tinymce', 'kkcp' ),
				'icons' => array(
					'editor-bold',
					'editor-italic',
					'editor-ul',
					'editor-ol',
					'editor-quote',
					'editor-alignleft',
					'editor-aligncenter',
					'editor-alignright',
					'editor-insertmore',
					'editor-spellcheck',
					'editor-expand',
					'editor-contract',
					'editor-kitchensink',
					'editor-underline',
					'editor-justify',
					'editor-textcolor',
					'editor-paste-word',
					'editor-paste-text',
					'editor-removeformatting',
					'editor-video',
					'editor-customchar',
					'editor-outdent',
					'editor-indent',
					'editor-help',
					'editor-strikethrough',
					'editor-unlink',
					'editor-rtl',
					'editor-break',
					'editor-code',
					'editor-paragraph',
					'editor-table',
				)
			),
			'posts' => array(
				'label' => esc_html__( 'Posts', 'kkcp' ),
				'icons' => array(
					'align-left',
					'align-right',
					'align-center',
					'align-none',
					'lock',
					'unlock',
					'calendar',
					'calendar-alt',
					'visibility',
					'hidden',
					'post-status',
					'edit',
					'trash',
					'sticky',
				)
			),
			'sorting' => array(
				'label' => esc_html__( 'Sorting', 'kkcp' ),
				'icons' => array(
					'external',
					'arrow-up',
					'arrow-down',
					'arrow-right',
					'arrow-left',
					'arrow-up-alt',
					'arrow-down-alt',
					'arrow-right-alt',
					'arrow-left-alt',
					'arrow-up-alt2',
					'arrow-down-alt2',
					'arrow-right-alt2',
					'arrow-left-alt2',
					'sort',
					'leftright',
					'randomize',
					'list-view',
					'exerpt-view',
					'grid-view',
				)
			),
			'social' => array(
				'label' => esc_html__( 'Social', 'kkcp' ),
				'icons' => array(
					'share',
					'share-alt',
					'share-alt2',
					'twitter',
					'rss',
					'email',
					'email-alt',
					'facebook',
					'facebook-alt',
					'googleplus',
					'networking',
				)
			),
			'wordpress_org' => array(
				'label' => esc_html__( 'Wordpress Org', 'kkcp' ),
				'icons' => array(
					'hammer',
					'art',
					'migrate',
					'performance',
					'universal-access',
					'universal-access-alt',
					'tickets',
					'nametag',
					'clipboard',
					'heart',
					'megaphone',
					'schedule',
				)
			),
			'products' => array(
				'label' => esc_html__( 'Products', 'kkcp' ),
				'icons' => array(
					'wordpress',
					'wordpress-alt',
					'pressthis',
					'update',
					'screenoptions',
					'info',
					'cart',
					'feedback',
					'cloud',
					'translation',
				)
			),
			'taxonomies' => array(
				'label' => esc_html__( 'Taxonomies', 'kkcp' ),
				'icons' => array(
					'tag',
					'category',
				)
			),
			'widgets' => array(
				'label' => esc_html__( 'Widgets', 'kkcp' ),
				'icons' => array(
					'archive',
					'tagcloud',
					'text',
				)
			),
			'notifications' => array(
				'label' => esc_html__( 'Notifications', 'kkcp' ),
				'icons' => array(
					'yes',
					'no',
					'no-alt',
					'plus',
					'plus-alt',
					'minus',
					'dismiss',
					'marker',
					'star-filled',
					'star-half',
					'star-empty',
					'flag',
					'warning',
				)
			),
			'misc' => array(
				'label' => esc_html__( 'Misc', 'kkcp' ),
				'icons' => array(
					'location',
					'location-alt',
					'vault',
					'shield',
					'shield-alt',
					'sos',
					'search',
					'slides',
					'analytics',
					'chart-pie',
					'chart-bar',
					'chart-line',
					'chart-area',
					'groups',
					'businessman',
					'id',
					'id-alt',
					'products',
					'awards',
					'forms',
					'testimonial',
					'portfolio',
					'book',
					'book-alt',
					'download',
					'upload',
					'backup',
					'clock',
					'lightbulb',
					'microphone',
					'desktop',
					'tablet',
					'smartphone',
					'phone',
					'index-card',
					'carrot',
					'building',
					'store',
					'album',
					'palmtree',
					'tickets-alt',
					'money',
					'smiley',
					'thumbs-up',
					'thumbs-down',
					'layout',
				)
			)
		);
	}

	/**
	 * Set dashicons array as a constant to use in javascript
	 *
	 * @override
	 * @since  1.0.0
	 * @return array
	 */
	public function get_constants() {
		return array(
			'dashicons' => self::get_dashicons(),
		);
	}

	/**
	 * Add values to JSON params
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		if ( is_string( $this->choices ) && in_array( $this->choices, $this->icons_set ) ) {
			$this->json['choices'] = $this->choices;
		}
		if ( ! empty( $this->selectize ) ) {
			$this->json['selectize'] = KKcp_Sanitize::js_options( $this->selectize, self::$selectize_allowed_options );
		}
	
	}

	/**
	 * Render a JS template for the content of the control.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?>
		</label>
		<select class="kkcp-selectize" value="{{ data.value }}" placeholder="Search by name..." name="icon[]" multiple><option value="">Search icon by name...</option></select>
		<!-- <div class="kkcp-icon-wrap"><?php // filled through js ?></div> -->
		<?php
	}

	/**
	 * Sanitize
	 *
	 * @since 1.0.0
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		return $value;
		// return KKcp_Sanitize::string_in_choices( $value, $setting, $control );
	}

	/**
	 * Validate
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
	
		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Icon' );

/**
 * Multicheck Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Multicheck extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_multicheck';

	/**
	 * Sortable
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	protected $sortable = false;

	/**
	 * Enqueue libraries
	 *
	 * @since  1.0.0
	 */
	public function enqueue() {
		if ( $this->sortable ) {
			wp_enqueue_script( 'jquery-ui-sortable' );
		}
	}

	/**
	 * Add values to JSON params
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		parent::add_to_json();

		$this->json['lastValue'] = $this->value();

		if ( $this->sortable ) {
			$this->json['sortable'] = $this->sortable;
		}
	}

	/**
	 * Ouput the choices template in a loop. Override this in subclasses
	 * to change behavior, for instance in sortable controls.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_choices_loop() {
		?>
		<# if (data.sortable) {
			var lastValue = JSON.parse(data.lastValue);
			if (_.isArray(lastValue)) {
				for (var i = 0; i < lastValue.length; i++) {
					var val = lastValue[i]; #>
					<?php $this->js_tpl_choice(); ?>
				<# }
				for (var val in choices) {
					if (lastValue.indexOf(val) === -1) { #>
						<?php $this->js_tpl_choice(); ?>
					<# }
				}
			}
		} else {
			for (var val in choices) { #>
				<?php $this->js_tpl_choice(); ?>
			<# }
		} #>
		<?php
	}

	/**
	 * Render template for choice displayment.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_choice_ui() {
		?>
			<label title="{{ val }}" class="{{helpClass}}"{{{ helpAttrs }}}>
				<input type="checkbox" name="_customize-kkcp_multicheck-{{ data.id }}" value="{{ val }}"<?php // `checked` status synced through js in `control.ready()` ?>>{{{ label }}}
			</label>
		<?php
	}

	/**
	 * Sanitize
	 *
	 * @since 1.0.0
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::array_in_choices( $value, $setting, $control );
	}

	/**
	 * Validate
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::array_in_choices( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Multicheck' );

/**
 * Number Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Number extends KKcp_Customize_Control_Base_Input {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_number';

	/**
	 * Float numbers allowed
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	public $allowFloat = false;

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		parent::add_to_json();

		if ( $this->allowFloat ) {
			$this->json['allowFloat'] = true;
		}
	}

	/**
	 * Get localized strings
	 *
	 * @override
	 * @since  1.0.0
	 * @return array
	 */
	public function get_l10n() {
		return array(
			'vNotAnumber' => esc_html__( 'The value is not a number.', 'kkcp' ),
			'vNoFloat' => esc_html__( 'The value must be an integer, not a float.', 'kkcp' ),
			'vNotAnInteger' => esc_html__( 'The value must be an integer number.', 'kkcp' ),
			'vNumberLow' => esc_html__( 'The number must be higher than %s.', 'kkcp' ),
			'vNumberHigh' => esc_html__( 'The number must be lower than %s.', 'kkcp' ),
			'vNumberStep' => esc_html__( 'The value must be a multiple of %s.', 'kkcp' ),
		);
	}

	/**
	 * Sanitize
	 *
	 * @since 1.0.0
	 * @override
	 * @param string               $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return string The sanitized value.
	 */
	protected static function sanitize( $value, $setting, $control ) {
		$number_extracted = KKcp_Sanitize::extract_number( $value, $control );

		if ( $number_extracted ) {
			return KKcp_Sanitize::number( $number_extracted, $control );
		} else {
			return $setting->default;
		}
	}

	/**
	 * Validate
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		if ( ! is_numeric( $value ) ) {
			$validity->add( 'wrong_number', esc_html__( 'The value must be a number.', 'kkcp' ) );
		}

		if ( is_float( $value ) && ! $control->allowFloat ) {
			$validity->add( 'wrong_number', esc_html__( 'The number can not be a float.', 'kkcp' ) );
		}

		$attrs = $control->input_attrs;

		if ( $attrs ) {
			// if doesn't respect the step given
			if ( isset( $attrs['step'] ) && $value % $attrs['step'] != 0 ) {
				$validity->add( 'wrong_number', sprintf( esc_html__( 'The number must be a multiple of %s.', 'kkcp' ), $attrs['step'] ) );
			}
			// if it's lower than the minimum
			if ( isset( $attrs['min'] ) && $value < $attrs['min'] ) {
				$validity->add( 'wrong_number', sprintf( esc_html__( 'The number must be a higher than %s.', 'kkcp' ), $attrs['min'] ) );
			}
			// if it's higher than the maxmimum
			if ( isset( $attrs['max'] ) && $value > $attrs['max'] ) {
				$validity->add( 'wrong_number', sprintf( esc_html__( 'The number must be a lower than %s.', 'kkcp' ), $attrs['max'] ) );
			}
		}

		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Number' );

/**
 * Radio Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Radio extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_radio';

	/**
	 * Render template for choice displayment.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_choice_ui() {
		?>
			<label class="{{helpClass}}"{{{ helpAttrs }}}>
				<input type="radio" value="{{ val }}" name="_customize-kkcp_radio-{{ data.id }}"<?php // `checked` status synced through js in `control.ready()` ?>>
				{{{ label }}}
				<# if (choice.sublabel) { #><small> ({{{ choice.sublabel }}})</small><# } #>
			</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Radio' );

/**
 * Radio Image Control custom class
 *
 * The images name needs to be named like following: '{setting-id}-{choice-value}.png'
 * and need to be in the $IMG_ADMIN path.
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Radio_Image extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_radio_image';

	/**
	 * Render template for choice displayment.
	 *
	 * It shows the full image path (`img_custom`) or an image bundled in the plugin
	 * when `img` has been passed, with the plugin url as prepath, and always a `png`
	 * extension.
	 * @since 1.0.0
	 */
	protected function js_tpl_choice_ui() {
		?>
			<input id="{{ id }}" class="kkcp-radio-image" type="radio" value="{{ val }}" name="_customize-kkcp_radio_image-{{ data.id }}"<?php // `checked` status synced through js in `control.ready()` ?>>
			<label class="{{helpClass}}" {{{ helpAttrs }}} for="{{ id }}">
				<# var imgUrl = choice.img_custom ? '<?php echo esc_url( KKcp_Theme::$images_base_url ); ?>' + choice.img_custom : '<?php echo esc_url( KKCP_PLUGIN_URL . 'assets/images/' ); ?>' + choice.img + '.png'; #>
				<img class="kkcpui-tooltip--top" src="{{ imgUrl }}" title="{{{label}}}">
			</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Radio_Image' );

/**
 * Select Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Select extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_select';

	/**
	 * Selectize disabled (`false`) or enabled (just `true` or array of options)
	 *
	 * @since 1.0.0
	 * @var boolean|array
	 */
	protected $selectize = false;

	/**
	 * Selectize allowed options
	 *
	 * Sanitize methods must be class methods of `KKcp_Sanitize` or global
	 * functions
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public static $selectize_allowed_options = array(
		'plugins' => array( 'sanitizer' => 'js_array', 'values' => array(
			'restore_on_backspace',
			'drag_drop',
			'remove_button'
		) ),
		'maxItems' => array( 'sanitizer' => 'js_number_or_null' ),
		'persist' => array( 'sanitizer' => 'js_bool' ),
		'hideSelected' => array( 'sanitizer' => 'js_bool' ),
		'sortField' => array( 'sanitizer' => 'js_string' ),
	);

	/**
	 * Add values to JSON params
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		parent::add_to_json();

		if ( $this->selectize ) {
			if ( is_array( $this->selectize ) ) {
				$this->json['selectize'] = KKcp_Sanitize::js_options( $this->selectize, self::$selectize_allowed_options );
			} else {
				$this->json['selectize'] = true;
			}
		}
	}

	/**
	 * Render template for choice displayment.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_choice_ui() {
		?>
			<option class="{{helpClass}}"{{{ helpAttrs }}} value="{{ val }}"<?php // `selected` status synced through js in `control.ready()` ?><# if (choice.sublabel) { #> data-sublabel="{{{ choice.sublabel }}}"<# } #>>
				{{{ label }}}
			</option>
		<?php
	}

	/**
	 * Render needed html structure for CSS toggle / switch
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_above_choices () {
		?>
			<select name="_customize-kkcp_select-{{ data.id }}">
		<?php
	}

	/**
	 * Render needed html structure for CSS toggle / switch
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl_below_choices () {
		?>
			</select>
		<?php
	}

	/**
	 * Sanitize
	 *
	 * @since 1.0.0
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		$selectize = $control->selectize;
		if ( isset( $selectize['maxItems'] ) ) {
			$max_items = filter_var( $selectize['maxItems'], FILTER_SANITIZE_NUMBER_INT );
		} else {
			$max_items = null;
		}
		if ( is_numeric( $max_items ) && $max_items > 1 ) {
			return KKcp_Sanitize::array_in_choices( $value, $setting, $control );
		} else {
			return KKcp_Sanitize::string_in_choices( $value, $setting, $control );
		}
	}

	/**
	 * Validate
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		$selectize = $control->selectize;
		if ( isset( $selectize['maxItems'] ) ) {
			$max_items = filter_var( $selectize['maxItems'], FILTER_SANITIZE_NUMBER_INT );
		} else {
			$max_items = null;
		}
		if ( is_numeric( $max_items ) && $max_items > 1 ) {
			if ( ! is_string( $value ) ) {
				return $validity->add( 'wrong', sprintf( esc_html__( 'The value must be a string or a JSONified string.', 'kkcp' ) ) );
		if ( $this->wp_editor && user_can_richedit()) {
			if ( is_array( $this->wp_editor ) ) {
				$this->json['wp_editor'] = KKcp_Sanitize::js_options( $this->wp_editor, self::$wp_editor_allowed_options );
			} else {
				$this->json['wp_editor'] = true;
			}
			wp_enqueue_editor();
		}
	}

	/**
	 * Render a JS template for the content of the text control.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?><# var a = data.attrs; #>
			<textarea class="kkcpui-textarea<# if (data.wp_editor && data.wp_editor.editorClass) { #> {{ data.wp_editor.editorClass }}<# } #>" <# for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #> rows="<# if (data.wp_editor && data.wp_editor.textareaRows) { #>{{ data.wp_editor.textareaRows }}<# } else if (a.rows) { #>{{ a.rows }}<# } else { #>4<# } #>"<# if (data.wp_editor && data.wp_editor.editorHeight) { #> style="height:{{ data.wp_editor.editorHeight }}px"<# } #>><?php // filled through js ?></textarea>
		</label>
		<?php
	}

	/**
	 * Sanitize
	 *
	 * @since 1.0.0
	 * @override
	 * @param string               $value   The value to sanitize.
	 * @param WP_Customize_Setting $setting Setting instance.
	 * @param WP_Customize_Control $control Control instance.
	 * @return string The sanitized value.
	 */
	protected static function sanitize( $value, $setting, $control ) {
		// always cast to string
		$value = (string) $value;

		$html_is_allowed = $control->allowHTML || $control->wp_editor;

		if ( $html_is_allowed ) {
			return wp_kses_post( $value );
		} else {
			return wp_strip_all_tags( $value );
		}
		return $value;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Textarea' );

/**
 * Toggle Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Toggle extends KKcp_Customize_Control_Checkbox {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_toggle';

	/**
	 * Render a JS template for the content of the text control.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl() {
		?>
		<# var label0 = data.attrs.label_0; label1 = data.attrs.label_1; #>
		<# if (data.label) { #><div class="customize-control-title">{{{ data.label }}}</div><# } #>
		<# if (data.description) { #><div class="description customize-control-description">{{{ data.description }}}</div><# } #>
		<label class="switch-light kkcpui-switch<# if (label0 && label1) { var l0l = label0.length, l1l = label1.length; #><# if ((l0l && l1l) && (Math.abs(l0l - l1l) > 1) || l0l > 6 || l1l > 6) { #> kkcpui-switch__labelsauto<# } else { #> kkcpui-switch__labels<# } } #>" onclick="">
		  <input type="checkbox" name="_customize-kkcp_toggle-{{ data.id }}" value="<?php // filled through js ?>" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}="{{ a[key] }}" <# } } #> <# if (data.value) { #>checked<# } #>>
		  <span<# if (!label0 && !label1) { #> aria-hidden="true"<# } #>>
		    <span><# if (label0) { #>{{{data.attrs.label_0}}}<# } #></span>
		    <span><# if (label1) { #>{{{data.attrs.label_1}}}<# } #></span>
		    <a></a>
		  </span>
		</label>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Toggle' );