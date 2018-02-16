// import $ from 'jquery';
// import _ from 'underscore';
import sprintf from 'locutus/php/strings/sprintf';
// import { api, wpApi, body } from './globals';
// import Regexes from './regexes';

export function singleChoice ($validity, $value, $setting, $control) {
  if (_.isObject($value) || _.isArray($value)) {
    return JSON.stringify($value);
  }
  return $value;
}

/**
 * Sanitize one or more choices
 *
 * @since 1.0.0
 * @param mixed                $input   The value to sanitize.
 * @param WP_Customize_Setting $setting Setting instance.
 * @param WP_Customize_Control $control Control instance.
 * @return array The sanitized value.
 */
export function oneOrMoreChoices ( $value, $setting, $control ) {
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
 * Sanitize checkbox
 *
 * @since 1.0.0
 * @override
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return mixed
 */
export function checkbox( $value, $setting, $control ) {
  return Boolean( $value ) ? '1' : '0';
}

/**
 * Normalize font family.
 *
 * Be sure that a font family is wrapped in quote, good for consistency
 *
 * @since  1.0.0
 * @param  string|array $value
 * @return string
 */
export function normalizeFontFamily( $value ) {
  // remove extra quotes, add always quotes and trim
  $value = $value.replace(/'/g, '').replace(/"/g, '');
  return `'${$value.trim()}'`;
}

/**
 * Sanitize font family.
 *
 * @since  1.0.0
 * @param  string $value
 * @return string
 */
export function fontFamily( $value ) {
  let $sanitized = [];

  if ( _.isString( $value ) ) {
    $value = $value.split(',');
  }
  if ( _.isArray( $value ) ) {
    for (let i = 0; i < $value.length; i++) {
      $sanitized.push(normalizeFontFamily($value[i]));
    }
    $sanitized = $sanitized.join(',');
  }
  return $sanitized;
}

export default {
  singleChoice,
  oneOrMoreChoices,
  checkbox,
  normalizeFontFamily,
  fontFamily,
};
