<?php // @partial
/**
 * Dummy Setting custom class
 *
 * @since  0.0.1
 */
class PWPcp_Customize_Setting_Dummy extends WP_Customize_Setting {

	public $transport = '';

	public function preview() {}

	public function _preview_filter( $original ) {}

	public function sanitize( $value ) {}

	protected function update( $value ) {}

	protected function _update_theme_mod( $value ) {}

	protected function _update_option( $value ) {}

	public function value() {}

	public function js_value() {
		return '';
	}
}