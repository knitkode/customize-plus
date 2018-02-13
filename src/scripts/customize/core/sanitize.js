// import $ from 'jquery';
// import _ from 'underscore';
import sprintf from 'locutus/php/strings/sprintf';
// import { api, wpApi, body } from './globals';
// import Regexes from './regexes';

export function singleChoice ($validity, $value, $setting, $control) {
  if (_.isObject(value) || _.isArray(value)) {
    return JSON.stringify(value);
  }
  return value;
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
  if (_.isArray(value)) {
    if (value.length === 1) {
      return value[0];
    }
    return value;
  }
  if (_.isString(value)) {
    return value;
  }
  return [JSON.stringify(value)];
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

export default {
  singleChoice,
  oneOrMoreChoices,
  checkbox,
};
