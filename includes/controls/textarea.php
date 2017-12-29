<?php // @partial
/**
 * Textarea Control custom class
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
class KKcp_Customize_Control_Textarea extends KKcp_Customize_Control_Base {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_textarea';

	/**
	 * Allow HTML inside textarea (default = `false`)
	 * @var boolean
	 */
	protected $allowHTML = false;

	/**
	 * Enable TinyMCE textarea (default = `false`)
	 * @var boolean|array
	 */
	protected $wp_editor = false;

	/**
	 * WP editor allowed options
	 *
	 * Sanitize methods must be class methods of `KKcp_Sanitize` or global
	 * functions
	 *
	 * The commented options are not allowed to be changed and some of theme
	 * are always overriden in js to the indicated default value.
	 *
	 * @see the following docs:
	 * - https://codex.wordpress.org/Function_Reference/wp_editor
	 * - https://codex.wordpress.org/Quicktags_API#Default_Quicktags
	 * - https://codex.wordpress.org/TinyMCE
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public static $wp_editor_allowed_options = array(
		'wpautop' => array( 'sanitizer' => 'js_bool' ),
		// Default: false (instead of WP core's true)

		'mediaButtons' => array( 'sanitizer' => 'js_bool' ),
		// Default: false (instead of WP core's true)

		// 'textareaName' => 'js_string',
		// Default: $editor_id

		'textareaRows' => array( 'sanitizer' => 'js_int' ),
		// Default: 5 (instead of WP core's get_option('default_post_edit_rows', 10))

		// 'tabindex' => array( 'sanitizer' => 'js_int' ),
		// Default: None

		// 'editorCss' => array( 'sanitizer' => 'js_string' ),
		// Default: None

		'editorClass' => array( 'sanitizer' => 'js_string' ),
		// Default: Empty string

		'editorHeight' => array( 'sanitizer' => 'js_int' ),
		// Default: None

		// 'teeny' => array( 'sanitizer' => 'js_bool' ),
		// Default: true (instead of WP core's false)

		// 'dfw' => array( 'sanitizer' => 'js_bool' ),
		// Default: false

		'tinymce' => array( 'sanitizer' => 'js_bool_object', 'permissive_object' => true ),
		// Default: true (we don't sanitize each option here @@todo)

		'quicktags' => array( 'sanitizer' => 'js_bool_object', 'values' => array(
			'buttons' => array( 'sanitizer' => 'js_string' )
		) ),
		// Default: true

		'dragDropUpload' => array( 'sanitizer' => 'js_bool' ),
		// Default: false
	);

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		$this->json['attrs'] = $this->input_attrs;
		if ( $this->allowHTML ) {
			$this->json['allowHTML'] = $this->allowHTML;
		}
	
		if ( $this->wp_editor && user_can_richedit() ) {
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