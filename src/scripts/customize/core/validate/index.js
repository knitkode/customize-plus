/**
 * @fileOverview Collects all validate methods used by Customize Plus controls.
 * Each function has also a respective PHP version in `class-validate.php`.
 *
 * @flow
 *
 * @module validate
 * @memberof core
 * @requires Helper
 */
import _ from "underscore";
import is_int from "locutus/php/var/is_int";
import is_float from "locutus/php/var/is_float";
import is_numeric from "locutus/php/var/is_numeric";
import empty from "locutus/php/var/empty";
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import { api } from "../globals";
import Helper from "../helper";
/* global tinycolor */

declare var tinycolor: Object;

/**
 * Validate a required setting value
 *
 * @since 1.0.0
 * @memberof core.validate
 */
export function required(
  $validity: WP_Error,
  $value: mixed,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control
): WP_Error {
  if (!$control.params.optional) {
    if (Helper.isEmpty($value)) {
      $validity = $control._addError($validity, "vRequired");
    }
  }
  return $validity;
}

/**
 * Validate a single choice
 *
 * @since 1.0.0
 * @memberof core.validate
 */
export function singleChoice(
  $validity: WP_Error,
  $value: mixed,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control
): WP_Error {
  const { _validChoices } = $control;
  const $choices =
    _validChoices && _validChoices.length
      ? _validChoices
      : $control.params.choices;

  if (_.isArray($choices) && $choices.indexOf($value) === -1) {
    $validity = $control._addError($validity, "vNotAChoice", $value);
  }

  return $validity;
}

/**
 * Validate an array of choices
 *
 * @since 1.0.0
 * @memberof core.validate
 *
 * @param {bool} $check_length Should match choices length? e.g. for sortable
                               control where the all the defined choices should
                               be present in the validated value
 */
export function multipleChoices(
  $validity: WP_Error,
  $value: mixed,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control,
  $check_length: boolean = false
): WP_Error {
  const { _validChoices, params } = $control;
  const $choices =
    _validChoices && _validChoices.length ? _validChoices : params.choices;

  // if (!_.isArray($value)) {
  if (!Array.isArray($value)) {
    $validity = $control._addError($validity, "vNotArray");
  } else {
    // check that the length of the value array is correct
    if ($check_length && $choices.length !== $value.length) {
      $validity = $control._addError(
        $validity,
        "vNotExactLengthArray",
        $choices.length
      );
    }

    // check the minimum number of choices selectable
    if (is_int(params.min) && $value.length < params.min) {
      $validity = $control._addError(
        $validity,
        "vNotMinLengthArray",
        params.min
      );
    }

    // check the maximum number of choices selectable
    if (is_int(params.max) && $value.length > params.max) {
      $validity = $control._addError(
        $validity,
        "vNotMaxLengthArray",
        params.max
      );
    }

    // now check that the selected values are allowed choices
    for (let i = 0; i < $value.length; i++) {
      if ($choices.indexOf($value[i]) === -1) {
        $validity = $control._addError($validity, "vNotAChoice", $value[i]);
      }
    }
  }

  return $validity;
}

/**
 * Validate one or more choices
 *
 * @since 1.0.0
 * @memberof core.validate
 */
export function oneOrMoreChoices(
  $validity: WP_Error,
  $value: mixed,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control
): WP_Error {
  if (_.isString($value)) {
    return singleChoice($validity, $value, $setting, $control);
  }
  return multipleChoices($validity, $value, $setting, $control);
}

/**
 * Validate sortable
 *
 * @since 1.1.0
 * @memberof core.validate
 */
export function sortable(
  $validity: WP_Error,
  $value: mixed,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control
): WP_Error {
  return multipleChoices($validity, $value, $setting, $control, true);
}

/**
 * Validate font family
 *
 * @since 1.0.0
 * @memberof core.validate
 */
export function fontFamily(
  $validity: WP_Error,
  $value: string | Array<string>,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control
): WP_Error {
  // if (_.isString($value)) {
  if (typeof $value === "string") {
    $value = $value.split(",");
  }
  // this is enough to do in JavaScript only, there is sanitization anyway
  // if (_.isArray($value)) {
  if (Array.isArray($value)) {
    $value = $value.map(input => Helper.normalizeFontFamily(input));
  }
  return multipleChoices($validity, $value, $setting, $control);
}

/**
 * Validate checkbox
 *
 * @since 1.0.0
 * @memberof core.validate
 */
export function checkbox(
  $validity: WP_Error,
  $value: mixed,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control
): WP_Error {
  if ($value != 1 && $value != 0) {
    $validity = $control._addError($validity, "vCheckbox");
  }
  return $validity;
}

/**
 * Validate tags
 *
 * @since 1.0.0
 * @memberof core.validate
 */
export function tags(
  $validity: WP_Error,
  $value: string | Array<string>,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control
): WP_Error {
  const { params } = $control;

  if (typeof $value !== "string") {
    $validity = $control._addError($validity, "vTagsType");
  }
  if (!Array.isArray($value)) {
    $value = $value.split(",");
  }

  // maybe check the minimum number of choices selectable
  if (is_int(params.min) && $value.length < params.min) {
    $validity = $control._addError($validity, "vTagsMin", params.min);
  }
  // maybe check the maxmimum number of choices selectable
  if (is_int(params.max) && $value.length > params.max) {
    $validity = $control._addError($validity, "vTagsMax", params.max);
  }

  return $validity;
}

/**
 * Validate text
 *
 * @since 1.0.0
 * @memberof core.validate
 */
export function text(
  $validity: WP_Error,
  $value: mixed,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control
): WP_Error {
  const $attrs = $control.params["attrs"] || {};
  const $type = $attrs.type || "text";

  // type
  if (typeof $value !== "string") {
    $validity = $control._addError($validity, "vTextType");
    return $validity;
  }
  // url
  // make the `isURL` function behaving like php's `filter_var( $value, FILTER_VALIDATE_URL )`
  if (
    $type === "url" &&
    !isURL($value, { require_tld: false, allow_trailing_dot: true })
  ) {
    $validity = $control._addError($validity, "vInvalidUrl");
  }
  // email
  else if ($type === "email" && !isEmail($value)) {
    $validity = $control._addError($validity, "vInvalidEmail");
  }
  // max length
  if (is_int($attrs["maxlength"]) && $value.length > $attrs["maxlength"]) {
    $validity = $control._addError(
      $validity,
      "vTextTooLong",
      $attrs["maxlength"]
    );
  }
  // min length
  if (is_int($attrs["minlength"]) && $value.length < $attrs["minlength"]) {
    $validity = $control._addError(
      $validity,
      "vTextTooShort",
      $attrs["minlength"]
    );
  }
  // pattern
  if (
    _.isString($attrs["pattern"]) &&
    !$value.match(new RegExp($attrs["pattern"]))
  ) {
    $validity = $control._addError(
      $validity,
      "vTextPatternMismatch",
      $attrs["pattern"]
    );
  }

  // html must be escaped
  if ($control.params.html === "escape") {
    if (Helper.hasHTML($value)) {
      $validity = $control._addWarning($validity, "vTextEscaped"); // @@todo \\
    }
  }
  // html is dangerously completely allowed
  else if ($control.params.html === "dangerous") {
    $validity = $control._addWarning($validity, "vTextDangerousHtml"); // @@todo \\
  }
  // html is not allowed at all
  else if (!$control.params.html) {
    if (Helper.hasHTML($value)) {
      $validity = $control._addError($validity, "vTextHtml");
    }
  }
  // @@todo find some smart way to javascriptify the following html validation
  // html is a valid argument for wp_kses_allowed_html
  // else if ( $control->html ) {
  //   if ( $value != wp_kses( $value, wp_kses_allowed_html( $control->html ) ) ) {
  //     $validity = $control->add_error( $validity, 'vTextInvalidHtml' );
  //   }
  // }
  // or show a warning/info to indicate that the live preview might differ from
  // what is actually stored in the database
  // $validity = $control._addWarning( $validity, '' );
  // \\

  return $validity;
}

/**
 * Validate number
 *
 * @since 1.0.0
 * @memberof core.validate
 */
export function number(
  $validity: WP_Error,
  $value: mixed,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control
): WP_Error {
  const $attrs = $control.params.attrs || {};

  // coerce to number
  $value = Number($value);

  // no number
  if (!is_numeric($value)) {
    $validity = $control._addError($validity, "vNotAnumber");
    return $validity;
  }
  // unallowed float
  if (is_float($value) && !$attrs["float"]) {
    $validity = $control._addError($validity, "vNoFloat");
  }
  // must be an int but it is not
  else if (!is_int($value) && !$attrs["float"]) {
    $validity = $control._addError($validity, "vNotAnInteger");
  }

  if ($attrs) {
    // if doesn't respect the step given
    if (
      is_numeric($attrs["step"]) &&
      Helper.modulus($value, $attrs["step"]) !== 0
    ) {
      $validity = $control._addError($validity, "vNumberStep", $attrs["step"]);
    }
    // if it's lower than the minimum
    if (is_numeric($attrs["min"]) && $value < $attrs["min"]) {
      $validity = $control._addError($validity, "vNumberLow", $attrs["min"]);
    }
    // if it's higher than the maxmimum
    if (is_numeric($attrs["max"]) && $value > $attrs["max"]) {
      $validity = $control._addError($validity, "vNumberHigh", $attrs["max"]);
    }
  }

  return $validity;
}

/**
 * Validate css unit
 *
 * @since 1.0.0
 * @memberof core.validate
 */
export function sizeUnit(
  $validity: WP_Error,
  $unit: mixed,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control
): WP_Error {
  const { params } = $control;

  // if it needs a unit and it is missing
  if (!empty(params["units"]) && !$unit) {
    $validity = $control._addError($validity, "vSliderMissingUnit");
  }
  // if the unit specified is not in the allowed ones
  else if (
    !empty(params["units"]) &&
    $unit &&
    params["units"].indexOf($unit) === -1
  ) {
    $validity = $control._addError($validity, "vSliderUnitNotAllowed", $unit);
  }
  // if a unit is specified but none is allowed
  else if (empty(params["units"]) && $unit) {
    $validity = $control._addError($validity, "vSliderNoUnit");
  }

  return $validity;
}

/**
 * Validate slider
 *
 * @since 1.0.0
 * @memberof core.validate
 */
export function slider(
  $validity: WP_Error,
  $value: mixed,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control
): WP_Error {
  const $number = Helper.extractNumber($value);
  const $unit = Helper.extractSizeUnit($value);

  $validity = number($validity, $number, $setting, $control);
  $validity = sizeUnit($validity, $unit, $setting, $control);

  return $validity;
}

/**
 * Validate color
 *
 * @since 1.0.0
 * @memberof core.validate
 * @requires tinycolor
 */
export function color(
  $validity: WP_Error,
  $value: mixed,
  $setting: WP_Customize_Setting,
  $control: WP_Customize_Control
): WP_Error {
  const params = $control.params;

  if (typeof $value !== "string") {
    // if (!_.isString($value)) {
    return $control._addError($validity, "vColorWrongType");
  }
  $value = $value.replace(/\s/g, "");

  if (!params.transparent && tinycolor($value).toName() === "transparent") {
    $validity = $control._addError($validity, "vNoTransparent");
  } else if (!params.alpha && Helper.isRgba($value)) {
    $validity = $control._addError($validity, "vNoRGBA");
  } else if (!params.picker && _.isArray(params.palette)) {
    const valueNormalized = $control.softenize($value);
    let paletteNormalized = _.flatten(params.palette);
    paletteNormalized = _.map(paletteNormalized, color => {
      return $control.softenize(color);
    });
    if (paletteNormalized.indexOf(valueNormalized) === -1) {
      $validity = $control._addError($validity, "vNotInPalette");
    }
  } else if (!Helper.isColor($value, api.constants["colorFormatsSupported"])) {
    $validity = $control._addError($validity, "vColorInvalid");
  }

  return $validity;
}

const Validate = {
  required,
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

export default Validate;
