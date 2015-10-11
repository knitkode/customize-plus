<?php // @partial
/**
 * Dummy Setting custom class
 *
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Settings
 * @author     PlusWP <dev@pluswp.com> (http://pluswp.com)
 * @copyright  2015 PlusWP (kunderi kuus)
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       http://pluswp.com/customize-plus
 */
class PWPcp_Customize_Setting_Dummy extends WP_Customize_Setting {

	public $transport = '';

	public $dirty = '';

	public function preview() {}

	public function _preview_filter( $original ) {}

	public function sanitize( $value ) {}

	protected function update( $value ) {}

	public function value() {}

	public function js_value() {
		return '';
	}
}