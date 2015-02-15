<?php // @partial
/**
 * Layout Columns Control custom class
 * (a not really reusable class)
 *
 * @since  0.0.1
 */
class K6CP_Customize_Control_Layout_Columns extends K6CP_Customize_Control_Base {

	public $type = 'k6_layout_columns';

	/**
	 * Decode the value (is a JSON)
	 * and add needed params info grabbing values from `theme_mods`.
	 *
	 * @since 0.0.1
	 */
	protected function add_to_json() {
		$this->json['value'] = json_decode( $this->value() );
		$this->json['mode'] = K6CP::get_option( 'sidebar' ); // k6tobecareful name tight to control ID \\
		$this->json['columns'] = K6CP::get_option( 'grid-columns' ); // k6tobecareful name tight to control ID \\
	}

	public function js_tpl() {
		$this->js_tpl_header();
		$this->js_tpl_screen_based_sliders();
	}
}