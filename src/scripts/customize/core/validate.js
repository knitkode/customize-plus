// import $ from 'jquery';
// import _ from 'underscore';
import sprintf from 'locutus/php/strings/sprintf';
// import { api, wpApi, body } from './globals';
// import Regexes from './regexes';

export function singleChoice ($validity, $value, $setting, $control) {
  const {params} = $control;

  if ( _.isUndefined( params.choices[ $value ] ) ) {
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
    if ( _.isNumber( params.max ) && $value.length < params.max ) {
      $validity.push({ 'vNotMaxLengthArray': sprintf( api.l10n['vNotMaxLengthArray'], params.max ) });
    }

    // now check that the selected values are allowed choices
    for (let i = 0; i < $value.length; i++) {
      if ( _.isUndefined( params.choices[ $value[i] ] ) ) {
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

export default {
  singleChoice,
  multipleChoices,
  oneOrMoreChoices,
};
