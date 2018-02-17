<?php // @partial
/**
 * Customize Plus Setting base class
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
class KKcp_Customize_Setting_Base extends WP_Customize_Setting {


	/**
	 * {@inheritDoc}. Change default to `postMessage` for Customize Plus settings.
	 *
	 * @since 1.0.0
	 */
	public $transport = 'postMessage';

	// interesting methods to maybe override:
	// public function sanitize( $value ) {}
	// public function validate( $value ) {}
	// public function js_value() {}
	// public function json() {}


	/**
	 * {@inheritDoc}. Change type in order to use our custom JavaScript
	 * constructor without changin the `type` property, which should remain
	 * either `theme_mod` or `option` as defined in the customize tree, default to
	 * `theme_mod`. Settings are initialized in `customize-controls.js#7836`.
	 *
	 * @since 1.0.0
	 * @override
	 */
	public function json() {
		return array(
			'value'     => $this->js_value(),
			'transport' => $this->transport,
			'dirty'     => $this->dirty,
			'type'      => 'kkcp_base', // $this->type,
		);
	}
}
