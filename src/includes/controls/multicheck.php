<?php // @partial
/**
 * Multicheck Control custom class
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
class KKcp_Customize_Control_Multicheck extends KKcp_Customize_Control_Base_Choices {

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $type = 'kkcp_multicheck';

	/**
	 * {@inheritDoc}. Selectize is not meant for radio controls
	 *
	 * @since 1.0.0
	 * @override
	 */
	public $selectize = false;

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	public $max = null;

	/**
	 * Sortable
	 *
	 * @since 1.0.0
	 * @var boolean
	 */
	public $sortable = false;

	/**
	 * Constructor
	 *
	 * {@inheritDoc}. Set `max` dynamically to the number of choices if the
	 * developer has not already set it explicitly
	 *
	 * @since 1.0.0
	 */
	public function __construct( $manager, $id, $args = array() ) {
		parent::__construct( $manager, $id, $args );

		$this->valid_choices = $this->get_valid_choices( $this->choices );

		if ( is_array( $this->choices ) && ! is_int( $this->max ) ) {
			$this->max = count( $this->choices );
		}
	}

	/**
	 * @since  1.0.0
	 * @inheritDoc
	 */
	public function enqueue() {
		if ( $this->sortable ) {
			wp_enqueue_script( 'jquery-ui-sortable' );
		}
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function add_to_json() {
		parent::add_to_json();

		$this->json['sortable'] = KKcp_SanitizeJS::bool( $this->sortable );
		$this->json['choicesOrdered'] = $this->value();
	}

	/**
	 * If the control is sortable we first show the ordered choices (the ones stored
	 * as value in the DB, gathered with `$this->value()`) and then the other choices,
	 * that's why the double loop with the `indexOf` condition.
	 *
	 * {@inheritDoc}
	 *
	 * @since 1.0.0
	 * @override
	 */
	protected function js_tpl_choices_loop() {
		?>
		<# if (data.sortable) {
			if (_.isArray(data.choicesOrdered)) {
				for (var i = 0; i < data.choicesOrdered.length; i++) {
					var val = data.choicesOrdered[i]; #>
					<?php $this->js_tpl_choice(); ?>
				<# }
				for (var val in choices) {
					if (data.choicesOrdered.indexOf(val) === -1) { #>
						<?php $this->js_tpl_choice(); ?>
					<# }
				}
			}
		} else {
			for (var val in choices) { #>
				<?php $this->js_tpl_choice(); ?>
			<# }
		} #>
		<?php
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected function js_tpl_choice_ui() {
		?>
			<label title="{{ val }}" class="{{helpClass}}"{{{ helpAttrs }}}>
				<input type="checkbox" name="_customize-kkcp_multicheck-{{ data.id }}" value="{{ val }}"<?php // `checked` status synced through js in `control.ready()` ?>>{{{ label }}}
			</label>
		<?php
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function sanitize( $value, $setting, $control ) {
		return KKcp_Sanitize::multiple_choices( $value, $setting, $control );
	}

	/**
	 * @since 1.0.0
	 * @inheritDoc
	 */
	protected static function validate( $validity, $value, $setting, $control ) {
		return KKcp_Validate::multiple_choices( $validity, $value, $setting, $control );
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Multicheck' );