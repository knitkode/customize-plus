<?php // @partial
/**
 * Content Control custom class
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
class KKcp_Customize_Control_Content extends KKcp_Customize_Control_Base {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_content';

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $advanced = false;

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $searchable = false;

	/**
	 * Markdown
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $markdown = '';

	/**
	 * Alert
	 *
	 * - When false no particular style will be applied
	 * - When a string, it can be one of 'info|success|warning|danger|light',
	 *   according style will be applied.
	 *
	 * @see  self::$allowed_alerts
	 * @since 1.0.0
	 * @var string
	 */
	public $alert = false;

	/**
	 * Allowed alerts values
	 *
	 * @since 1.0.0
	 * @var array
	 */
	private static $allowed_alerts = array(
		'info', 'success', 'warning', 'danger', 'light'
	);

	/**
	 * {@inheritDoc}. Override it here in order to check the given alert value.
	 *
	 * @since 1.0.0
	 * @override
	 */
	public function __construct( $manager, $id, $args = array() ) {
		if ( isset( $args['alerts'] ) && is_string( $args['alerts'] ) ) {
			$args['alerts'] = KKcp_SanitizeJS::enum( false, $args['alerts'], self::$allowed_alerts );
		}

		parent::__construct( $manager, $id, $args );
	}

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	protected function add_to_json() {
		if ( $this->markdown ) {
			$this->json['markdown'] = $this->markdown;
		}
		if ( $this->alert ) {
			$this->json['alert'] = $this->alert;
		}
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public function content_template() {
		$this->js_tpl_info();
		$this->js_tpl();
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function js_tpl() {
		?>
		<# if (data.alert) { #><div class="kkcpui-alert {{ data.alert }}"><# } #>
			<# if (data.label) { #><span class="customize-control-title"><# if (marked) { #>{{{ marked(data.label) }}}<# } else { #>{{{ data.label }}}<# } #></span><# } #>
			<# if (data.description) { #><span<# if (!data.alert) { #> class="description customize-control-description"<# } #>><# if (marked) { #>{{{ marked(data.description) }}}<# } else { #>{{{ data.description }}}<# } #></span><# } #>
			<# if (marked && data.markdown) { #><div class="description kkcp-markdown">{{{ marked(data.markdown) }}}</div><# } #>
		<# if (data.alert) { #></div><# } #>
		<?php
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Content' );