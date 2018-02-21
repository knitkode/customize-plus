<?php // @partial
/**
 * Password Control custom class
 *
 * @todo  The default setting of this control get hashed with `wp_hash_password`
 * before getting saved to the database. This does not happen in the frontend
 * preview for obvious reasons.
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
class KKcp_Customize_Control_Password extends KKcp_Customize_Control_Text {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_password';

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected $allowed_input_attrs = array(
		'autocomplete' => array( 'sanitizer' => 'string' ),
		'maxlength' => array( 'sanitizer' => 'int' ),
		'minlength' => array( 'sanitizer' => 'int' ),
		'pattern' => array( 'sanitizer' => 'string' ),
		'placeholder' => array( 'sanitizer' => 'string' ),
		'visibility' => array( 'sanitizer' => 'bool' ),
	);

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function js_tpl_inner () {
		?>
		<span class="kkcp-password">
			<# if (data.attrs && data.attrs.visibility) { #>
				<?php $this->js_tpl_input() ?>
				<input class="kkcp-password__preview" type="text" tabindex="-1" <# for (var key in attrs) { if (attrs.hasOwnProperty(key) && key !== 'title') { #>{{ key }}="{{ attrs[key] }}" <# } } #>>
				<button class="kkcp-password__toggle">
					<span class="kkcp-password__hide" aria-label="<?php esc_attr_e( 'Hide password' ); ?>"><i class="dashicons dashicons-hidden"></i></span>
					<span class="kkcp-password__show" aria-label="<?php esc_attr_e( 'Show password' ); ?>"><i class="dashicons dashicons-visibility"></i></span>
				</button>
			<# } else { #>
				<?php $this->js_tpl_input() ?>
			<# } #>
		</span>
		<?php
	}

	/**
	 * Simple sanitization that hashes the password.
	 *
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		if ( is_string( $value ) ) {
			return wp_hash_password( $value );
		}
		return null;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Password' );