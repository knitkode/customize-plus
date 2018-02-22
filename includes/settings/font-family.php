<?php // @partial
/**
 * Customize Plus Setting Font Family class
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
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Customize_Setting_Font_Family extends KKcp_Customize_Setting_Base {

	/**
	 * We do not override this because we do not need a special JavaScript
	 * constructor for this setting.
	 *
	 * @since 1.0.0
	 * @inheritDoc
	 */
	// protected $js_type = 'kkcp_font_family';

	/**
	 * {@inheritDoc}. Always normalize the font value
	 *
	 * @since 1.0.0
	 * @override
	 */
	public function js_value() {
		$value = parent::js_value();

		return KKcp_Helper::normalize_font_families( $value );
	}

	/**
	 * {@inheritDoc}. Always normalize the font value
	 *
	 * @since 1.0.0
	 * @override
	 */
	public function js_value_default() {
		$value = parent::js_value_default();

		return KKcp_Helper::normalize_font_families( $value );
	}

}
