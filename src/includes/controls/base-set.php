<?php // @partial
/**
 * Base Set Control custom class
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
abstract class KKcp_Customize_Control_Base_Set extends KKcp_Customize_Control_Base {

  /**
   * Option to force a maximum selection boundary
   *
   * @since 1.0.0
   * @var ?int
   */
  public $max = 1;

  /**
   * Option to force a minimum selection boundary
   *
   * @since 1.0.0
   * @var ?int This should be `null` or a value higher or lower than 1. To set
   *           a control as optional use the `$optional` class property instead
   *           of setting `$min` to `1`.
   */
  public $min = null;

  /**
   * This is then populated in the construct based on the choices array and
   * later used for validation.
   *
   * @since 1.0.0
   * @var array
   */
  public $valid_choices = array();

  /**
   * Subclasses needs to override this with a custom default array.
   *
   * @abstract
   * @since 1.0.0
   * @var array
   */
  public $choices = array(
    'standard',
  );

  /**
   * Subclasses needs to override this with a custom array
   *
   * @since 1.0.0
   * @var array
   */
  protected $supported_sets = array(
    'standard',
  );

  /**
   * Subclasses needs to override this with a custom string
   *
   * @abstract
   * @since 1.0.0
   * @var string
   */
  protected $set_js_var = 'mySet';

  /**
   * Constructor
   *
   * Override it here in order to manually populate the `valid_choices` property from
   * the 'globally' defined sets filtered with the given `choices` param
   *
   * @since 1.0.0
   * @param WP_Customize_Manager $manager
   * @param string               $id
   * @param array                $args
   */
  public function __construct( $manager, $id, $args = array() ) {
    parent::__construct( $manager, $id, $args );

    $filtered_sets = $this->get_filtered_sets( $this->choices );
    $this->valid_choices = $this->get_valid_choices( $filtered_sets );
  }

  /**
   * Get set by the given name, subclasses must override this with their data
   *
   * e.g.:
   * ```
   * if ( $name === 'standard' ) {
   *     return array();
   * }
   * ```
   *
   * @abstract
   * @since  1.0.0
   * @return array
   */
  protected function get_set ( $name ) {
    return [];
  }

  /**
   * Get flatten set values
   *
   * @since  1.0.0
   * @param  array $set
   * @return array
   */
  public static function get_flatten_set_values ( $set ) {
    $values = array();

    foreach ( $set as $set_group_key => $set_group_values ) {
      if ( isset( $set_group_values['values'] ) && is_array( $set_group_values['values'] ) ) {
        foreach ( $set_group_values['values'] as $value ) {
          array_push( $values, $value );
        }
      } else {
        wp_die( 'cp_api', sprintf( esc_html__( 'Customize Plus | API error: set %s must follow the `set` strucure with values in `values` array.' ), $set ) );
      }
    }

    return $values;
  }

  /**
   * Get filtered sets
   *
   * @since 1.0.0
   * @param array   $choices
   * @return array
   */
  private function get_filtered_sets ( $choices ) {
    $filtered_sets = [];

    foreach ( $this->supported_sets as $set_name ) {
      $filtered_sets[ $set_name ] = $this->get_filtered_set( $set_name, $choices );
    }

    return $filtered_sets;
  }

  /**
   * Get filtered set
   *
   * @since 1.0.0
   * @param string  name
   * @param array   $filter
   * @return array
   */
  private function get_filtered_set ( $name, $filter ) {
    $set = $this->get_set( $name );
    $filtered_set = [];

    // choices filter is a single set name
    if ( is_string( $filter ) && $name === $filter ) {
      $filtered_set = $set;
    }
    // choices filter is an array of set names
    else if ( is_array( $filter ) && in_array( $name, $filter ) ) {
      $filtered_set = $set;
    }
    // choices filter is a more complex filter that filters per set
    else if ( is_array( $filter ) ) {
      foreach ( $filter as $filter_group_key => $filter_groups ) {
        # code...
        // whitelist based on a filter string
        if ( is_string( $filter_groups ) ) {
          // whitelist simply a group by its name
          if ( isset( $set[ $filter_groups ] ) ) {
            $filtered_set[ $filter_groups ] = $set[ $filter_groups ];
          } else {
            // whitelist with a quickChoices filter, which filter by values
            // on all the set groups regardless of the set group names.
            $quick_choices = explode( ',', $filter_groups );
            $filtered_set = array_intersect( self::get_flatten_set_values( $set ), $quick_choices );
            // we can break here, indeed, this is a quick filter...
            break;
          }
        }
        // whitelist specific values per each group of the set
        else if ( KKcp_Validate::is_assoc( $filter_groups ) ) {
          foreach ( $filter_groups as $filter_group_key => $filter_group_values ) {
            $filtered_set[ $filter_group_key ] = array_intersect($set[ $filter_group_key ]['values'], $filter_group_values );
          }
        }
        // whitelist multiple groups of a set
        else if ( is_array( $filter_groups ) ) {
          foreach ( $filter_groups as $filter_group_key ) {
            $filtered_set[ $filter_group_key ] = $set[ $filter_group_key ];
          }
        }
      }
    }
    // choices filter is not present, just use all the set
    else {
      $filtered_set = $set;
    }

    return $filtered_set;
  }

  /**
   * Get choices from set array
   *
   * @since 1.0.0
   * @param array              $valid_choices
   * @param string             $set_name
   * @param null|string|arary  $filter
   * @return array
   */
  protected function get_valid_choices ( $filtered_sets ) {
    $valid_choices = array();

    foreach ( $filtered_sets as $set_name => $set_values ) {

      // set can be a multidimensional array divided by groups
      if ( KKcp_Validate::is_assoc( $set_values ) ) {
        foreach ( $set_values as $group_key => $group_values ) {
          if ( isset( $group_values['values'] ) && is_array( $group_values['values'] ) ) {
            $valid_choices = array_merge( $valid_choices, $group_values['values'] );
          }
        }
      }
      // set can be a flat array ... (e.g. when is filtered by a quickChoices)
      else if ( is_array( $set_values ) ) {
        $valid_choices = array_merge( $valid_choices, $set_values );
      }
    }

    return $valid_choices;
  }

  /**
   * Set set arrays as constants to use in JavaScript
   *
   * @override
   * @since  1.0.0
   * @return array
   */
  public function get_constants() {
    $sets = array();

    foreach ( $this->supported_sets as $set ) {
      $sets[ $set ] = $this->get_set( $set );
    }

    return array(
      $this->set_js_var => $sets
    );
  }

  /**
   * Refresh the parameters passed to the JavaScript via JSON
   *
   * @override
   * @since 1.0.0
   */
  protected function add_to_json() {
    $this->json['max'] = KKcp_Sanitize::js_int_or_null( $this->max );
    $this->json['min'] = KKcp_Sanitize::js_int_or_null( $this->min );
    $this->json['setVar'] = KKcp_Sanitize::js_string( $this->set_js_var );
    $this->json['supportedSets'] = KKcp_Sanitize::js_array( $this->supported_sets );
    $this->json['choices'] = $this->choices;
  }

  /**
   * Sanitize
   *
   * @since 1.0.0
   * @override
   * @param string               $value   The value to sanitize.
   * @param WP_Customize_Setting $setting Setting instance.
   * @param WP_Customize_Control $control Control instance.
   * @return string The sanitized value.
   */
  protected static function sanitize( $value, $setting, $control ) {
    return KKcp_Sanitize::one_or_more_choices( $value, $setting, $control );
  }

  /**
   * Validate
   *
   * @since 1.0.0
   * @override
   * @param WP_Error             $validity
   * @param mixed                $value    The value to validate.
   * @param WP_Customize_Setting $setting  Setting instance.
   * @param WP_Customize_Control $control  Control instance.
   * @return mixed
   */
  protected static function validate( $validity, $value, $setting, $control ) {
    return KKcp_Validate::one_or_more_choices( $validity, $value, $setting, $control );
  }
}
