import $ from 'jquery';
import _ from 'underscore';
import sprintf from 'locutus/php/strings/sprintf';
import is_int from 'locutus/php/var/is_int';
import is_float from 'locutus/php/var/is_float';
import is_numeric from 'locutus/php/var/is_numeric';
import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';
import {Utils} from './utils';
import { api } from './globals';

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
  const choices = $control._validChoices && $control._validChoices.length ? $control._validChoices : $control.params.choices;

  if ( choices.indexOf( $value ) === -1 ) {
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
  const choices = $control._validChoices && $control._validChoices.length ? $control._validChoices : params.choices;

  if ( !_.isArray( $value ) ) {
    $validity.push({ 'vNotArray': api.l10n['vNotArray'] });
  } else {

    // maybe check that the length of the value array is correct
    if ( $check_length && choices.length !== $value.length ) {
      $validity.push({ 'vNotExactLengthArray': sprintf( api.l10n['vNotExactLengthArray'], choices.length ) });
    }

    // maybe check the minimum number of choices selectable
    if ( is_int( params.min ) && $value.length < params.min ) {
      $validity.push({ 'vNotMinLengthArray': sprintf( api.l10n['vNotMinLengthArray'], params.min ) });
    }

    // maybe check the maxmimum number of choices selectable
    if ( is_int( params.max ) && $value.length > params.max ) {
      $validity.push({ 'vNotMaxLengthArray': sprintf( api.l10n['vNotMaxLengthArray'], params.max ) });
    }

    // now check that the selected values are allowed choices
    for (let i = 0; i < $value.length; i++) {
      if ( choices.indexOf( $value[i] ) === -1 ) {
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

/**
 * Validate tags
 *
 * @since 1.0.0
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return mixed
 */
export function tags( $validity, $value, $setting, $control ) {
  const {params} = $control;

  if ( !_.isString( $value ) ) {
    $validity.push({ 'vTagsType': api.l10n['vTagsType'] });
  }
  if (!_.isArray($value)) {
    $value = $value.split(',');
  }

  // maybe check the minimum number of choices selectable
  if ( is_int( params.min ) && $value.length < params.min ) {
    $validity.push({ 'vTagsMin': sprintf( api.l10n['vTagsMin'], params.min ) });
  }
  // maybe check the maxmimum number of choices selectable
  if ( is_int( params.max ) && $value.length > params.max ) {
    $validity.push({ 'vTagsMax': sprintf( api.l10n['vTagsMax'], params.max ) });
  }

  return $validity;
}

/**
 * Validate text
 *
 * @since 1.0.0
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return mixed
 */
export function text( $validity, $value, $setting, $control ) {
  const $attrs = $control.params.attrs;
  const $input_type = $attrs.type || 'text';

  // type
  if ( ! _.isString( $value ) ) {
    $validity.push({ 'vTextType': api.l10n['vTextType'] });
  }
  // url
  // make the `isURL` function behaving like php's `filter_var( $value, FILTER_VALIDATE_URL )`
  if ( $input_type === 'url' && !isURL( $value, { require_tld: false, allow_trailing_dot: true } ) ) {
    $validity.push({ 'vInvalidUrl': api.l10n['vInvalidUrl'] });
  }
  // email
  else if ( $input_type === 'email' && !isEmail( $value ) ) {
    $validity.push({ 'vInvalidEmail': api.l10n['vInvalidEmail'] });
  }
  // max length
  if ( is_int( $attrs.maxlength ) && $value.length > $attrs.maxlength ) {
    $validity.push({ 'vTooLong': api.l10n['vTooLong'] });
  }
  // html presence
  if ( Utils.hasHTML( $value ) ) {
    $validity.push({ 'vTextHtml': api.l10n['vTextHtml'] });
  }

  return $validity;
}

/**
 * Validate number
 *
 * @since 1.0.0
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return mixed
 */
export function number( $validity, $value, $setting, $control ) {
  const $attrs = $control.params.attrs;
  const allowFloat = $control.params.allowFloat;

  // coerce to number
  $value = Number($value);

  // no number
  if ( ! is_numeric( $value ) ) {
    $validity.push({ 'vNotAnumber': api.l10n['vNotAnumber'] });
    return $validity;
  }
  // unallowed float
  if ( is_float( $value ) && !allowFloat ) {
    $validity.push({ 'vNoFloat': api.l10n['vNoFloat'] });
  }
  // must be an int but it is not
  else if ( ! is_int( $value ) && !allowFloat ) {
    $validity.push({ 'vNotAnInteger': api.l10n['vNotAnInteger'] });
  }

  if ( $attrs ) {
    // if doesn't respect the step given
    if ( is_numeric( $attrs['step'] ) && $value % $attrs['step'] !== 0 ) {
      $validity.push({ 'vNumberStep': sprintf( api.l10n['vNumberStep'], $attrs['step'] ) });
    }
    // if it's lower than the minimum
    if ( is_numeric( $attrs['min'] ) && $value < $attrs['min'] ) {
      $validity.push({ 'vNumberLow': sprintf( api.l10n['vNumberLow'], $attrs['min'] ) });
    }
    // if it's higher than the maxmimum
    if ( is_numeric( $attrs['max'] ) && $value > $attrs['max'] ) {
      $validity.push({ 'vNumberHigh': sprintf( api.l10n['vNumberHigh'], $attrs['max'] ) });
    }
  }

  return $validity;
}

/**
 * Exports the `Validate` object
 */
export default {
  isEmpty,
  checkRequired,
  singleChoice,
  multipleChoices,
  oneOrMoreChoices,
  checkbox,
  tags,
  text,
  number,
};
