/**
 * @fileOverview Collects all sanitization methods used by Customize Plus
 * controls. Each function has also a respective PHP version in
 * `class-sanitize.php`.
 *
 * @since 1.0.0
 * @access package
 *
 * @module Sanitize
 * @requires Helper
 * @requires Validate
 */
import _ from 'underscore';
import is_int from 'locutus/php/var/is_int';
import is_float from 'locutus/php/var/is_float';
import empty from 'locutus/php/var/empty';
import round from 'locutus/php/math/round';
import Helper from './helper';
import Validate from './validate';

/**
 * Sanitize string
 *
 * @since 1.0.0
 * @param {mixed}                $input   The value to sanitize.
 * @return {string} The sanitized value.
 */
export function string ($input) {
  if (!_.isString($input)) {
    return JSON.stringify($input);
  }
  return $input;
}

/**
 * Sanitize single choice
 *
 * @since 1.0.0
 * @param {string}               $value   The value to sanitize.
 * @param {WP_Customize_Setting} $setting Setting instance.
 * @param {WP_Customize_Control} $control Control instance.
 * @return {string|null} The sanitized value.
 */
export function singleChoice ( $value, $setting, $control ) {
  const {_validChoices} = $control;
  const choices = _validChoices && _validChoices.length ? _validChoices : $control.params.choices;

  // if it is an allowed choice return it escaped
  if ( _.isArray( choices ) && choices.indexOf( $value ) !== -1 ) {
    // return _.escape( $value );
    return Helper.stripHTML( $value );
  }

  return null;
}

/**
 * Sanitize multiple choices
 *
 * @since 1.0.0
 * @param {array}                $value   The value to sanitize.
 * @param {WP_Customize_Setting} $setting Setting instance.
 * @param {WP_Customize_Control} $control Control instance.
 * @param {bool}                 $check_length Should match choices length? e.g.
 *                                             for sortable control where the
 *                                             all the defined choices should be
 *                                             present in the sanitized value
 * @return {array|null} The sanitized value.
 */
export function multipleChoices( $value, $setting, $control, $check_length = false ) {
  const {_validChoices, params} = $control;
  const $choices = _validChoices && _validChoices.length ? _validChoices : params.choices;

  if ( !_.isArray( $value ) ) {
    $value = [ $value ];
  }

  // filter out the not alowed choices and sanitize the others
  let $valueClean = [];
  for (let i = 0; i < $value.length; i++) {
    if ( $choices.indexOf( $value[i] ) !== -1 ) {
      // $valueClean.push( _.escape( $value[i] ) );
      $valueClean.push( Helper.stripHTML( $value[i] ) );
    }
  }
  $value = $valueClean;

  // if the selection was all wrong return the default, otherwise go on and try
  // to fix it
  if ( ! $value.length ) {
    return null;
  }

  // fill the array if there are not enough values
  if ( $check_length && $choices.length !== $value.length ) {
    $value = _.uniq( _.union( $value, $choices ) );
    return $value.slice( 0, $choices.length );
  }

  // fill the array if there are not enough values
  if ( is_int( params.min ) && $value.length < params.min ) {
    const $availableChoices = _.difference( $choices, $value );
    $value = $value.concat( $availableChoices.slice( 0, $value.length - params.min ) );
  }

  // slice the array if there are too many values
  if ( is_int( params.max ) && $value.length > params.max ) {
    $value = $value.slice( 0, params.max );
  }

  return $value;
}

/**
 * Sanitize one or more choices
 *
 * @since 1.0.0
 * @param {mixed}                $value   The value to sanitize.
 * @param {WP_Customize_Setting} $setting Setting instance.
 * @param {WP_Customize_Control} $control Control instance.
 * @return {string|array|null} The sanitized value.
 */
export function oneOrMoreChoices ( $value, $setting, $control ) {
  if ( _.isString( $value ) ) {
    return singleChoice( $value, $setting, $control );
  }
  if ( _.isArray( $value ) ) {
    return multipleChoices( $value, $setting, $control );
  }
  return null;
}

/**
 * Sanitize sortable
 *
 * @since 1.1.0
 * @param {mixed}                $value   The value to sanitize.
 * @param {WP_Customize_Setting} $setting Setting instance.
 * @param {WP_Customize_Control} $control Control instance.
 * @return {array|null} The sanitized value.
 */
export function sortable ( $value, $setting, $control ) {
  return multipleChoices( $value, $setting, $control, true );
}

/**
 * Sanitize font family
 *
 * @since 1.0.0
 *
 * @param {string|array}         $value   The value to sanitize.
 * @param {WP_Customize_Setting} $setting Setting instance.
 * @param {WP_Customize_Control} $control Control instance.
 * @return {string|null} The sanitized value.
 */
export function fontFamily( $value, $setting, $control ) {
  $value = Helper.normalizeFontFamilies( $value );

  if ( _.isString( $value ) ) {
    $value = $value.split( ',' );
  }
  $value = multipleChoices( $value, $setting, $control );

  if ( _.isArray( $value ) ) {
    return $value.join( ',' );
  }

  return null;
}

/**
 * Sanitize checkbox
 *
 * @since 1.0.0
 * @param {mixed}                $value    The value to validate.
 * @param {WP_Customize_Setting} $setting  Setting instance.
 * @param {WP_Customize_Control} $control  Control instance.
 * @return {string:0|1}
 */
export function checkbox( $value, $setting, $control ) {
  return Boolean( $value ) ? '1' : '0';
}

/**
 * Sanitize tags
 *
 * @since 1.0.0
 * @param {mixed}                $value   The value to sanitize.
 * @param {WP_Customize_Setting} $setting Setting instance.
 * @param {WP_Customize_Control} $control Control instance.
 * @return {string} The sanitized value.
 */
export function tags( $value, $setting, $control ) {
  const {params} = $control;

  if ( _.isString( $value ) ) {
    $value = $value.split(',');
  }
  if ( ! _.isArray( $value ) ) {
    $value = [ string( $value ) ];
  }
  $value = _.map( $value, value => { return value.trim() });

  if ( is_int( params.max ) && $value.length > params.max ) {
    $value = $value.slice( 0, params.max );
  }

  // return _.escape( $value.join(',') );
  return Helper.stripHTML( $value.join(',') );
}

/**
 * Sanitize text
 *
 * @since 1.0.0
 * @param {mixed}                $value   The value to sanitize.
 * @param {WP_Customize_Setting} $setting Setting instance.
 * @param {WP_Customize_Control} $control Control instance.
 * @return {string} The sanitized value.
 */
export function text( $value, $setting, $control ) {
  const $attrs = $control.params['attrs'] || {};;
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
  // min length
  if ( is_int( $attrs['minlength'] ) && $value.length < $attrs['minlength'] ) {
    return null;
  }
  // pattern
  if ( _.isString( $attrs['pattern'] ) && ! $value.match( new RegExp( $attrs['pattern'] ) ) ) {
    return null;
  }
  // html must be escaped
  if ( $control.params.html === 'escape' ) {
    $value = _.escape( $value );
  }
  // html is dangerously completely allowed
  else if ( $control.params.html === 'dangerous' ) {
    $value = $value;
  }
  // html is not allowed at all
  else if ( ! $control.params.html ) {
    $value = Helper.stripHTML($value);
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
 * @param {mixed}                $value   The value to sanitize.
 * @param {WP_Customize_Setting} $setting Setting instance.
 * @param {WP_Customize_Control} $control Control instance.
 * @return {number|null} The sanitized value.
 */
export function number( $value, $setting, $control ) {
  const $attrs = $control.params['attrs'] || {};
  let $number = Helper.extractNumber( $value, $attrs['float'] );

  if ( $number === null ) {
    return null;
  }

  // if it's a float but it is not allowed to be it round it
  if ( is_float( $number ) && !$attrs['float'] ) {
    $number = round( $number );
  }
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

  return $number;
}

/**
 * Sanitize CSS size unit
 *
 * @since 1.0.0
 * @param {string}   $unit          The unit to sanitize
 * @param {mixed}    $allowed_units The allowed units
 * @return {string}
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
 * @param {mixed}                $value   The value to sanitize.
 * @param {WP_Customize_Setting} $setting Setting instance.
 * @param {WP_Customize_Control} $control Control instance.
 * @return {string|number|null} The sanitized value.
 */
export function slider( $value, $setting, $control ) {
  const {params} = $control;
  const $attrs = params.attrs || {};

  let $number = Helper.extractNumber( $value, !!$attrs['float'] );
  let $unit = Helper.extractSizeUnit( $value, params['units'] );

  $number = number( $number, $setting, $control );
  $unit = sizeUnit( $unit, params['units'] );

  if ( $number === null ) {
    return null;
  }

  if ( $unit ) {
    return $number + $unit;
  }

  return $number;
}

/**
 * Sanitize color

 * It escapes HTML, removes spacs and strips the alpha channel if not allowed.
 * It checks also for a hex color string like '#c1c2b4' or '#c00' or '#CCc000'
 * or 'CCC' and fixes it. If the value is not valid it returns the setting
 * default.
 *
 * @since 1.0.0
 *
 * @param {mixed}                $value   The value to sanitize.
 * @param {WP_Customize_Setting} $setting Setting instance.
 * @param {WP_Customize_Control} $control Control instance.
 * @return {string|number} The sanitized value.
 */
export function color( $value, $setting, $control ) {
  if (!_.isString($value)) {
    return JSON.stringify($value);
  }
  $value = _.escape( $value.replace(/\s/g, '') );

  // @@doubt here there might be a race condition when the developer defines
  // a palette that have rgba colors without setting `alpha` to `true`. \\
  if ( Helper.isRgba( $value ) && ! $control.params.alpha ) {
    return Helper.rgbaToRgb( $value );
  }
  if ( $value.match( /^([A-Fa-f0-9]{3}){1,2}$/ ) ) {
    return `#${$value}`;
  }
  const $validity = Validate.color( {}, $value, $setting, $control );

  if ( _.keys( $validity ).length ) {
    return null;
  }
  return $value;
}

/**
 * @alias core.Sanitize
 * @description  Exposed module <a href="module-Sanitize.html">Sanitize</a>
 * @access package
 */
export default {
  singleChoice,
  multipleChoices,
  oneOrMoreChoices,
  sortable,
  fontFamily,
  checkbox,
  tags,
  text,
  number,
  sizeUnit,
  slider,
  color,
};
