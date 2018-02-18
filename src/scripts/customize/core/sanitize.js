import $ from 'jquery';
import _ from 'underscore';
import is_int from 'locutus/php/var/is_int';
import is_float from 'locutus/php/var/is_float';
import empty from 'locutus/php/var/empty';
import round from 'locutus/php/math/round';
import Helper from './helper';

/**
 * Sanitize string
 *
 * @since 1.0.0
 * @param mixed                $input   The value to sanitize.
 * @return string The sanitized value.
 */
export function string ($input) {
  if (!_.isString($input)) {
    return JSON.stringify($input);
  }
  return $input;
}

/**
 * Sanitize array
 *
 * @since 1.0.0
 * @param mixed                $input   The value to sanitize.
 * @return array The sanitized value.
 */
export function array ($input) {
  let sanitized = [];
  let inputAsArray = $input;

  // in the edge case it comes as a stringified array
  if (_.isString($input)) {
    try {
      inputAsArray = JSON.parse($input);
    } catch(e) {
      inputAsArray = $input;
    }
  }

  // coerce in any case to an array, the rest will be dealt during validation
  if (!_.isArray(inputAsArray)) {
    inputAsArray = [$input];
  }

  for (let i = 0; i < inputAsArray.length; i++) {
    sanitized.push(string(inputAsArray[i]));
  }

  return sanitized;
}

/**
 * Sanitize hex color
 * check for a hex color string like '#c1c2b4' or '#c00' or '#CCc000' or 'CCC'
 *
 * It needs a value cleaned of all whitespaces (sanitized).
 *
 * @since  1.0.0
 * @param  string $input  The input value to sanitize
 * @return string|boolean The sanitized input or `false` in case the input
 *                        value is not valid.
 */
export function hex( $input ) {
  if ( $input.match( /^([A-Fa-f0-9]{3}){1,2}$/ ) ) {
    return `#${$input}`;
  }
  return $input;
}

/**
 * Sanitize single choice
 *
 * @since 1.0.0
 * @param string               $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return string The sanitized value.
 */
export function singleChoice ($value, $setting, $control) {
  return string($value);
}

/**
 * Sanitize multiple choices
 *
 * @since 1.0.0
 * @param array                $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return array The sanitized value.
 */
export function multipleChoices($value, $setting, $control) {
  return array($value);
}

/**
 * Sanitize one or more choices
 *
 * @since 1.0.0
 * @param mixed                $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return array The sanitized value.
 */
export function oneOrMoreChoices ($value, $setting, $control) {
  if (_.isArray($value)) {
    if ($value.length === 1) {
      return $value[0];
    }
    return $value;
  }
  if (_.isString($value)) {
    return $value;
  }
  return [JSON.stringify($value)];
}

/**
 * Sanitize font family
 *
 * @since  1.0.0
 * @param string|array         $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return string The sanitized value.
 */
export function fontFamily( $value ) {
  let $sanitized = [];

  if ( _.isString( $value ) ) {
    $value = $value.split(',');
  }
  if ( _.isArray( $value ) ) {
    for (let i = 0; i < $value.length; i++) {
      $sanitized.push(Helper.normalizeFontFamily($value[i]));
    }
    $sanitized = $sanitized.join(',');
  }
  return $sanitized;
}

/**
 * Sanitize checkbox
 *
 * @since 1.0.0
 * @override
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return number
 */
export function checkbox( $value, $setting, $control ) {
  return Boolean( $value ) ? '1' : '0';
}

/**
 * Sanitize tags
 *
 * @since 1.0.0
 * @param mixed                $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return string The sanitized value.
 */
export function tags( $value, $setting, $control ) {
  if (_.isString($value )) {
    $value = $value.split(',');
  }
  if (!_.isArray($value)) {
    $value = [string($value)];
  }
  $value = _.map($value, value => { return value.trim() });
  $value = _.unique($value);

  if ( $control.params.max ) {
   let $max_items = parseInt( $control.params.max, 10 );

   if ( $value.length > $max_items ) {
     $value = $value.slice( 0, $max_items );
   }
  }
  return Helper.stripHTML($value.join(','));
}

/**
 * Sanitize text
 *
 * @since 1.0.0
 * @param mixed                $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return string The sanitized value.
 */
export function text( $value, $setting, $control ) {
  const $attrs = $control.params.attrs;
  const $input_type = $attrs.type || 'text';

  $value = string( $value );

  // url
  if ( 'url' === $input_type ) {
    $value = $value.trim(); // @@todo: something like: `esc_url_raw( $value );` \\
  }
  // email
  else if ( 'email' === $input_type ) {
    $value = $value.trim(); // @@todo: something like: `sanitize_email( $value );` \\
  }
  // max length
  if ( is_int( $attrs['maxlength'] ) && $value.length > $attrs['maxlength'] ) {
    $value = $value.substr( 0, $attrs['maxlength'] );
  }

  // html is not allowed at all
  if ( ! $control.params.html ) {
    $value = Helper.stripHTML($value);
  }
  // html must be escaped
  else if ( $control.params.html === 'escape' ) {
    $value = _.escape( $value );
  }
  // html is dangerously completely allowed
  else if ( $control.params.html === 'dangerous' ) {
    $value = $value;
  }
  // @@todo find some smart way to javascriptify the following html sanitization
  // html is a valid argument for wp_kses_allowed_html
  // else if ( $control.params.html ) {
  //   $value = wp_kses( $value, wp_kses_allowed_html( $control->html ) );
  // }
  // \\

  return $value;
}

/**
 * Sanitize number
 *
 * @since 1.0.0
 * @param mixed                $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return number The sanitized value.
 */
export function number( $value, $setting, $control ) {
  const $attrs = $control.params.attrs;
  const allowFloat = $control.params.allowFloat;
  let $number = Helper.extractNumber( $value, $control.params.allowFloat );

  if ( $number === null ) {
    return $setting.default;
  }

  // if it's a float but it is not allowed to be it round it
  if ( is_float( $number ) && !allowFloat ) {
    $number = round( $number );
  }
  if ( $attrs ) {
    // if doesn't respect the step given round it to the closest
    // then do the min and max checks
    if ( _.isNumber( $attrs['step'] ) && Helper.modulus($number, $attrs['step']) !== 0 ) {
      $number = round( $number / $attrs['step'] ) * $attrs['step'];
    }
    // if it's lower than the minimum return the minimum
    if ( _.isNumber( $attrs['min'] ) && $number < $attrs['min'] ) {
      return $attrs['min'];
    }
    // if it's higher than the maxmimum return the maximum
    if ( _.isNumber( $attrs['max'] ) && $number > $attrs['max'] ) {
      return $attrs['max'];
    }
  }
  return $number;
}

/**
 * Sanitize CSS size unit
 *
 * @since 1.0.0
 * @param string   $unit          The unit to sanitize
 * @param mixed    $allowed_units The allowed units
 * @return string
 */
export function sizeUnit( $unit, $allowed_units ) {
  $allowed_units = $allowed_units || [];

  // if no unit is allowed
  if ( !$allowed_units.length ) {
    return '';
  }
  // if it needs a unit and it is missing
  else if ( $allowed_units.length && ! $unit ) {
    return $allowed_units[0];
  }
  // if the unit specified is not in the allowed ones
  else if ( $allowed_units.length && $unit && $allowed_units.indexOf( $unit ) === -1 ) {
    return $allowed_units[0];
  }
  // if the unit specified is in the allowed ones
  else if ( $allowed_units.length && $unit && $allowed_units.indexOf( $unit ) !== -1 ) {
    return $unit;
  }

  return '';
}

/**
 * Sanitize slider
 *
 * @since 1.0.0
 * @param mixed                $value   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return string The sanitized value.
 */
export function slider( $value, $setting, $control ) {
  let $number = Helper.extractNumber( $value, $control.params.allowFloat );
  let $unit = Helper.extractSizeUnit( $value, $control.params.units );

  $number = number( $number, $setting, $control );
  $unit = sizeUnit( $unit, $control.params.units );

  if ( $number === null ) {
    return $setting.default;
  }

  if ( $unit ) {
    return $number + $unit;
  }

  return $number;
}

/**
 * Exports the `Sanitize` object
 */
export default {
  hex,
  singleChoice,
  oneOrMoreChoices,
  multipleChoices,
  checkbox,
  fontFamily,
  tags,
  text,
  number,
  sizeUnit,
  slider,
};
