<?php // @partial
/**
 * Customize Plus Setting base class
 *
 * {@inheritdoc}
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
class KKcp_Customize_Setting_Base extends WP_Customize_Setting {

	/**
	 * Setting type just for JavaScript, to instantiate the right constructor
	 *
	 * @since 1.0.0
	 * @see  $this->json
	 * @var string
	 */
	protected $js_type = 'kkcp_base';

	/**
	 * {@inheritdoc}. Change default to `postMessage` for Customize Plus settings.
	 *
	 * @since 1.0.0
	 */
	public $transport = 'postMessage';

	/**
	 * Sanitize the setting's default factory value for use in JavaScript.
	 *
	 * @see  PHP WP_Customize_Setting->js_value
	 * @since 1.0.0
	 *
	 * @return mixed The requested escaped value.
	 */
	public function js_value_default() {
		if ( is_string( $this->default ) )
			return html_entity_decode( $this->default, ENT_QUOTES, 'UTF-8');

		return $this->default;
	}

	/**
	 * {@inheritdoc}. Change type in order to use our custom JavaScript
	 * constructor without changing the `type` property, which should remain
	 * either `theme_mod` or `option` as defined in the customize tree, default to
	 * `theme_mod`. Settings are initialized in `customize-controls.js#7836`.
	 * Finally add the factory value of the setting (its default as defined by the
	 * theme developer).
	 *
	 * @since 1.0.0
	 * @override
	 */
	public function json() {
		return array(
			'value'     => $this->js_value(),
			'transport' => $this->transport,
			'dirty'     => $this->dirty,
			'type'      => $this->js_type, // $this->type,
			'default'  => $this->js_value_default(),
		);
	}

	// interesting methods to maybe override:
	// public function sanitize( $value ) {}
	// public function validate( $value ) {}
	// public function js_value() {}
}
