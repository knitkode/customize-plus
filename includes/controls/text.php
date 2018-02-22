<?php // @partial
/**
 * Text Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2018 KnitKode
 * @license    GPLv3
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Customize_Control_Text extends KKcp_Customize_Control_Base_Input {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_text';

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected $allowed_input_attrs = array(
		'tooltip' => array( 'sanitizer' => 'string' ),
		'type' => array( 'sanitizer' => 'enum', 'values' => array( 'text', 'tel', 'url', 'email', ) ),
		'autocomplete' => array( 'sanitizer' => 'string' ),
		'maxlength' => array( 'sanitizer' => 'int' ),
		'minlength' => array( 'sanitizer' => 'int' ),
		'pattern' => array( 'sanitizer' => 'string' ),
		'placeholder' => array( 'sanitizer' => 'string' ),
		'spellcheck' => array( 'sanitizer' => 'bool' ),
	);


	/**
	 * HTML (allows html in the setting value)
	 *
	 * Note: When this property is truthy sanitization is done as with all the
	 * other controls while validation is a bit 'loose', so the input of the user
	 * might slightly differs from the actual value stored in the database.
	 * Setting this property to `true` can be dangerous instead, only do it if you
	 * know its implications.
	 *
	 * - When `false` (default) no `html` is allowed at all.
	 * - When `'escape'` `html` tags will be escaped.
	 * - When `'dangerous'` all html will be allowed (dangerous).
	 * - In all other cases value will be treated as the `$context` argument passed
	 * to `wp_kses_allowed_html` which will then be passed to `wp_kses`
	 * @see https://codex.wordpress.org/Function_Reference/wp_kses_allowed_html
	 * @see https://codex.wordpress.org/Function_Reference/wp_kses
	 * e.g.
	 * ```
	 * $html => array(
	 *   'kses' => array(
	 *     'b' => array(),
	 *     'e' => array(),
	 *   ),
	 * ),
	 * // or
	 * $html => 'post',
	 * ```
	 *
	 * @since 1.0.0
	 * @var bool|string|array
	 */
	public $html = false;

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	public function get_l10n() {
		return array(
			'vTextType' => esc_html__( 'It must be a string', 'kkcp' ),
			'vInvalidUrl' => esc_html__( 'Invalid URL', 'kkcp' ),
			'vInvalidEmail' => esc_html__( 'Invalid email', 'kkcp' ),
			'vTextTooLong' => esc_html__( 'It must be shorter than **%s** chars', 'kkcp' ),
			'vTextTooShort' => esc_html__( 'It must be longer than **%s** chars', 'kkcp' ),
			'vTextPatternMismatch' => esc_html__( 'It must follow this pattern **%s**', 'kkcp' ),
			'vTextHtml' => esc_html__( 'HTML is not allowed. It will be stripped out on save', 'kkcp' ),
			'vTextInvalidHtml' => esc_html__( 'This text contains some unallowed HTML. It will be stripped out on save', 'kkcp' ),
			'vTextHtmlTags' => esc_html__( 'The following HTML tags are not allowed: **%s**. They will be stripped out on save', 'kkcp' ),
			'vTextEscaped' => esc_html__( 'HTML code will be escaped on save', 'kkcp' ),
			'vTextDangerousHtml' => esc_html__( 'HTML code is dangerously allowed here', 'kkcp' ),
		);
	}

	/**
	 * @since 1.0.0
	 * @ovrride
	 */
	protected function add_to_json() {
		parent::add_to_json();

		if ( $this->html ) {
			$this->json['html'] = $this->html;
		}
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::text( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::text( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Text' );