// import $ from 'jquery';
// import _ from 'underscore';
import sprintf from 'locutus/php/strings/sprintf';
// import { api, wpApi, body } from './globals';
// import Regexes from './regexes';

/**
 * Is setting value (`control.setting()`) empty?
 * Used to check if required control's settings have instead an empty value
 *
 * @see php class method `KKcp_Validate::is_empty()`
 * @static
 * @param  {string}  value
 * @return {Boolean}
 */
export function isEmpty (value) {
  // first try to compare it to an empty string
  if (value === null || value === undefined || value === '') {
    return true;
  } else {
    // if it's a jsonized value try to parse it
    try {
      value = JSON.parse(value);
    } catch(e) {}

    // and then see if we have an empty array or an empty object
    if ((_.isArray(value) || _.isObject(value)) && _.isEmpty(value)) {
      return true;
    }

    return false;
  }
}

/**
 * Validate a required setting
 *
 * @since 1.0.0
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return mixed
 */
export function checkRequired ($validity, $value, $setting, $control) {
  if ( isEmpty( $value ) ) {
    $validity.push({ 'vRequired': api.l10n['vRequired'] });
  }
  return $validity;
}


export function singleChoice ($validity, $value, $setting, $control) {
  const {params} = $control;

  // @@todo doing this check with an object lookup instead of `indexOf`
  // might be faster \\
  // if ( _.isUndefined( params.choices[ $value ] ) ) {
  if ( params.choices.indexOf( $value ) === -1 ) {
    $validity.push({ 'vNotAChoice': sprintf( api.l10n['vNotAChoice'], $value ) });
  }
  return $validity;
}

/**
 * Validate an array of choices
 *
 * @since 1.0.0
 * @override
 * @param WP_Error             $validity
 * @param array                $value        The value to validate.
 * @param WP_Customize_Setting $setting      Setting instance.
 * @param WP_Customize_Control $control      Control instance.
 * @param boolean              $check_length Should match choices length? e.g. for sortable control
 *                                           where the all the defined choices should be present in
 *                                           the validated value
 * @return $validity
 */
export function multipleChoices( $validity, $value, $setting, $control, $check_length = false ) {
  const {params} = $control;

  if ( !_.isArray( $value ) ) {
    $validity.push({ 'vNotArray': api.l10n['vNotArray'] });
  } else {

    // maybe check that the length of the value array is correct
    if ( $check_length && params.choices.length !== $value.length ) {
      $validity.push({ 'vNotExactLengthArray': sprintf( api.l10n['vNotExactLengthArray'], params.choices.length ) });
    }

    // maybe check the minimum number of choices selectable
    if ( _.isNumber( params.min ) && $value.length < params.min ) {
      $validity.push({ 'vNotMinLengthArray': sprintf( api.l10n['vNotMinLengthArray'], params.min ) });
    }

    // maybe check the maxmimum number of choices selectable
    if ( _.isNumber( params.max ) && $value.length > params.max ) {
      $validity.push({ 'vNotMaxLengthArray': sprintf( api.l10n['vNotMaxLengthArray'], params.max ) });
    }

    // now check that the selected values are allowed choices
    for (let i = 0; i < $value.length; i++) {
      // @@todo doing this check with an object lookup instead of `indexOf`
      // might be faster \\
      // if ( _.isUndefined( params.choices[ $value[i] ] ) ) {
      if ( params.choices.indexOf( $value[i] ) === -1 ) {
        $validity.push({ 'vNotAChoice': sprintf( api.l10n['vNotAChoice'], $value[i] ) });
      }
    }
  }

  return $validity;
}

/**
 * Validate one or more choices
 *
 * @since 1.0.0
 * @override
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return mixed
 */
export function oneOrMoreChoices( $validity, $value, $setting, $control ) {
  if ( _.isString( $value ) ) {
    return singleChoice( $validity, $value, $setting, $control );
  }
  return multipleChoices( $validity, $value, $setting, $control );
}

/**
 * Validate checkbox
 *
 * @since 1.0.0
 * @override
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return mixed
 */
export function checkbox( $validity, $value, $setting, $control ) {
  if ( $value != 1 && $value != 0 ) {
    $validity.push({ 'vCheckbox': api.l10n['vCheckbox'] });
  }
  return $validity;
}

export default {
  isEmpty,
  checkRequired,
  singleChoice,
  multipleChoices,
  oneOrMoreChoices,
  checkbox,
};
