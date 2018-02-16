<?php // @partial
/**
 * Font Family Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Customize_Control_Font_Family extends KKcp_Customize_Control_Base_Set {

	/**
	 * @override
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_font_family';

	/**
	 * @override
	 * @since 1.0.0
	 * @var ?int
	 */
	public $max = 10;

	/**
	 * @override
	 * @since 1.0.0
	 * @var array
	 */
	public $choices = array( 'standard' );

	/**
	 * @override
	 * @since 1.0.0
	 * @var array
	 */
	protected $supported_sets = array(
		'standard',
	);

	/**
	 * @override
	 * @since 1.0.0
	 * @var string
	 */
	protected $set_js_var = 'fontFamiliesSets';


	/**
	 * Get set by the given name
	 *
	 * @override
	 * @since  1.0.0
	 * @return array
	 */
	protected function get_set ( $name ) {
		if ( $name === 'standard' ) {
			return KKcp_Utils::get_font_families_standard();
		}

		return [];
	}

  /**
   * @override
   */
  protected function get_valid_choices ( $filtered_sets ) {
    $valid_choices = parent::get_valid_choices( $filtered_sets );

    foreach ( $valid_choices as $valid_choice ) {
      array_push( $valid_choices, KKcp_Sanitize::normalize_font_family( $valid_choice ) );
    }

    return $valid_choices;
  }

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		parent::add_to_json();
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
			<?php esc_html_e( 'Enable Google fonts' ); ?>
		</label> -->
		<input class="kkcp-selectize" type="text" required>
		<?php
	}

	/**
	 * @override
	 * @since 1.0.0
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::font_family( $value ); // KKcp_Validate::one_or_more_choices( $value, $setting, $control );
	}

	/**
	 * @override
	 * @since 1.0.0
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		$value = KKcp_Sanitize::font_family( $value );
		if ( is_string( $value ) ) {
			$value = explode( ',', $value );
		}
		return KKcp_Validate::one_or_more_choices( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Font_Family' );