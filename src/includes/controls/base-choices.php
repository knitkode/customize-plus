<?php // @partial
/**
 * Base Choices Control custom class
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
abstract class KKcp_Customize_Control_Base_Choices extends KKcp_Customize_Control_Base {

  /**
   * Option to force a maximum selection boundary
   *
   * @since 1.0.0
   * @abstract
   * @var ?int
   */
  public $max = 1;

  /**
   * Option to force a minimum selection boundary
   *
   * @since 1.0.0
   * @abstract
   * @var ?int This should be `null` or a value higher or lower than 1. To set
   *           a control as optional use the `$optional` class property instead
   *           of setting `$min` to `1`.
   */
  public $min = null;

  /**
   * Subclasses needs to override this with a custom default array.
   *
   * {@inheritDoc}
   *
   * @since 1.0.0
   * @override
   * @abstract
   * @var array
   */
  public $choices = array();

  /**
   * This is then populated in the construct based on the choices array and
   * later used for validation.
   *
   * @since 1.0.0
   * @abstract
   * @var null|array
   */
  public $valid_choices = null;

  /**
   * Selectize disabled (`false`) or enabled (just `true` or array of options)
   *
   * @since 1.0.0
   * @abstract
   * @var boolean|array
   */
  public $selectize = false;

  /**
   * Selectize allowed options
   *
   * Subclasses should override this with a custom default array.
   *
   * @since 1.0.0
   * @abstract
   * @var array
   */
  protected $selectize_allowed_options = array();

  /**
   * Get valid choices values from choices array. Subclasses can use this
   * in their constructor. Let' not override the constructor here too but
   * force subclasses to override it in case they need it.
   *
   * @since 1.0.0
   * @abstract
   * @param array              $choices
   * @return array
   */
  protected function get_valid_choices ( $choices ) {
    if ( is_array( $choices ) ) {
      $choices_values = array();

      foreach ( $choices as $choice_key => $choice_value ) {
        array_push( $choices_values, $choice_key );
      }
      return $choices_values;
    }
    return $choices;
  }

  /**
   * @since  1.0.0
   * @inheritDoc
   */
  public function get_l10n() {
    return array(
      'vNotArray' => esc_html__( 'Value must be a list.' ),
      'vNotAChoice' => esc_html__( 'Value %s is not an allowed choice.' ),
      'vNotExactLengthArray' => esc_html__( 'List of values must contain exactly %s values' ),
      'vNotMinLengthArray' => esc_html__( 'List of values must contain minimum %s values.' ),
      'vNotMaxLengthArray' => esc_html__( 'List of values must contain maximum %s values.' ),
    );
  }

  /**
   * JavaScript parameters nedeed by choice based controls.
   *
   * {@inheritDoc}
   *
   * @since 1.0.0
   * @override
   */
  protected function add_to_json() {
    $this->json['id'] = KKcp_SanitizeJS::string( $this->id );
    $this->json['max'] = KKcp_SanitizeJS::int_or_null( $this->max );
    $this->json['min'] = KKcp_SanitizeJS::int_or_null( $this->min );
    $this->json['choices'] = $this->choices;

    if ( is_array( $this->selectize ) ) {
      $this->json['selectize'] = KKcp_SanitizeJS::options( $this->selectize, $this->selectize_allowed_options );
    } else {
      $this->json['selectize'] = KKcp_SanitizeJS::bool( $this->selectize );
    }
  }

  /**
   * Js template
   *
   * Choice supports both a string if you only want to pass a label
   * or an object with label, sublabel, help, help_title, etc.
   * {@inheritDoc}
   *
   * @since 1.0.0
   * @override
   */
  protected function js_tpl() {
    ?>
    <# var choices = data.choices, idx = 0;
      if (!_.isEmpty(choices)) { #>
        <?php $this->js_tpl_header(); ?>
        <?php $this->js_tpl_above_choices(); ?>
        <?php $this->js_tpl_choices_loop(); ?>
        <?php $this->js_tpl_below_choices(); ?>
    <# } #>
    <?php
  }

  /**
   * Ouput the choices template in a loop. Override this in subclasses
   * to change behavior, for instance in sortable controls.
   *
   * @since 1.0.0
   */
  protected function js_tpl_choices_loop () {
    ?>
    <# for (var val in choices) { #>
      <?php $this->js_tpl_choice(); ?>
    <#} #>
    <?php
  }

  /**
   * Ouput the js to configure each choice template data and its UI
   *
   * @since 1.0.0
   */
  protected function js_tpl_choice () {
    ?>
    <# if (choices.hasOwnProperty(val)) {
      var label;
      var choice = choices[val];
      var helpClass = '';
      var helpAttrs = '';
      var id = data.id + idx++;
      if (!_.isUndefined(choice.label)) {
        label = choice.label;
        if (choice.help) {
          helpClass = 'kkcp-help';
          helpAttrs = ' data-help=' + choice.help;
          if (choice.help_title) helpAttrs += ' data-title=' + choice.help_title;
          if (choice.help_img) helpAttrs += ' data-img=' + choice.help_img;
          if (choice.help_text) helpAttrs += ' data-text=' + choice.help_text;
          if (choice.help_video) helpAttrs += ' data-video=' + choice.help_video;
        }
      } else {
        label = choice;
      } #>
      <?php $this->js_tpl_choice_ui(); ?>
    <# } #>
    <?php
  }

  /**
   * Hook to print a custom choice template
   *
   * @since 1.0.0
   */
  protected function js_tpl_choice_ui () {}

  /**
   * Hook to add a part of template just before the choices loop
   *
   * @since 1.0.0
   */
  protected function js_tpl_above_choices () {}

  /**
   * Hook to add a part of template just after the choices loop.
   *
   * @since 1.0.0
   */
  protected function js_tpl_below_choices () {}

  /**
   * @since 1.0.0
   * @inheritDoc
   */
  protected static function sanitize( $value, $setting, $control ) {
    return KKcp_Sanitize::one_or_more_choices( $value, $setting, $control );
  }

  /**
   * @since 1.0.0
   * @inheritDoc
   */
  protected static function validate( $validity, $value, $setting, $control ) {
    return KKcp_Validate::one_or_more_choices( $validity, $value, $setting, $control );
  }
}