/**
 * @fileOverview An helper class containing helper methods. This has its PHP
 * equivalent in `class-helper.php`
 *
 * @flow
 *
 * @module Helper
 * @memberof core
 * @requires tinycolor
 */
import $ from "jquery";
import _ from "underscore";
import is_int from "locutus/php/var/is_int";
import is_float from "locutus/php/var/is_float";
import is_numeric from "locutus/php/var/is_numeric";
import { api } from "./globals";
/* global tinycolor */

declare var tinycolor: Object;

/**
 * Is setting value (`control.setting()`) empty?
 *
 * Used to check if required control's settings have instead an empty value
 *
 * @since 1.0.0
 * @memberof core.Helper
 *
 * @see php class method `KKcp_Validate::is_empty()`
 */
export function isEmpty(value: mixed): boolean {
  // first try to compare it to empty primitives
  if (value === null || value === undefined || value === "") {
    return true;
  } else {
    // if it's a jsonized value try to parse it
    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch (e) {}
    }

    // and then see if we have an empty array or an empty object
    if ((_.isArray(value) || _.isObject(value)) && _.isEmpty(value)) {
      return true;
    }

    return false;
  }
}

/**
 * Is keyword color?
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 *
 * @since  1.0.0
 * @memberof core.Helper
 */
export function isKeywordColor($value: string): boolean {
  const keywords = api.constants["colorsKeywords"] || [];
  return keywords.indexOf($value) !== -1;
}

/**
 * Is HEX color?
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 *
 * @since  1.0.0
 * @memberof core.Helper
 */
export function isHex($value: string): boolean {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test($value);
}

/**
 * Is RGB color?
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 * Inspired by formvalidation.js by Nguyen Huu Phuoc, aka @nghuuphuoc
 * and contributors {@link https://github.com/formvalidation/}.
 *
 * @since  1.0.0
 * @memberof core.Helper
 */
export function isRgb($value: string): boolean {
  const regexInteger = /^rgb\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){2}(\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*)\)$/;
  const regexPercent = /^rgb\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/;
  return regexInteger.test($value) || regexPercent.test($value);
}

/**
 * Is RGBA color?
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 * Inspired by formvalidation.js by Nguyen Huu Phuoc, aka @nghuuphuoc
 * and contributors {@link https://github.com/formvalidation/}.
 *
 * @since  1.0.0
 * @memberof core.Helper
 */
export function isRgba($value: string): boolean {
  const regexInteger = /^rgba\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
  const regexPercent = /^rgba\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
  return regexInteger.test($value) || regexPercent.test($value);
}

// hsl: return /^hsl\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/.test(value);
// hsla: return /^hsla\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/.test(value);

/**
 * Is a valid color among the color formats given?
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 *
 * @since  1.0.0
 * @memberof core.Helper
 */
export function isColor(
  $value: string,
  $allowedFormats: Array<string>
): boolean {
  for (var i = 0; i < $allowedFormats.length; i++) {
    let $format = $allowedFormats[i];

    if ($format === "keyword" && isKeywordColor($value)) {
      return true;
    } else if ($format === "hex" && isHex($value)) {
      return true;
    } else if ($format === "rgb" && isRgb($value)) {
      return true;
    } else if ($format === "rgba" && isRgba($value)) {
      return true;
    }
  }

  return false;
}

/**
 * Convert a hexa decimal color code to its RGB equivalent
 *
 * @see {@link http://php.net/manual/en/function.hexdec.php#99478}
 * @since  1.0.0
 * @memberof core.Helper
 *
 * @param  {string} $value           Hexadecimal color value
 * @param  {boolean} $returnAsString If set true, returns the value separated by
 *                                   the separator character. Otherwise returns
 *                                   an associative array.
 * @return {Array<string>|string} Depending on second parameter. Returns `false`
 *                                if invalid hex color value
 */
export function hexToRgb(
  $value: string,
  $returnAsString: boolean = true
): Array<string> | string {
  return $returnAsString
    ? tinycolor.toRgbString($value)
    : tinycolor.toRgb($value);
}

/**
 * Converts a RGBA color to a RGB, stripping the alpha channel value
 *
 * It needs a value cleaned of all whitespaces (sanitized).
 *
 * @since  1.0.0
 * @memberof core.Helper
 * @method
 */
export const rgbaToRgb = hexToRgb;

/**
 * Normalize font family.
 *
 * Be sure that a font family is wrapped in quote, good for consistency
 *
 * @since  1.0.0
 * @memberof core.Helper
 */
export function normalizeFontFamily($value: string): string {
  $value = $value.replace(/'/g, "").replace(/"/g, "");
  return `'${$value.trim()}'`;
}

/**
 * Normalize font families
 *
 * Be sure that one or multiple font families are all trimmed and wrapped in
 * quotes, good for consistency
 *
 * @since  1.0.0
 * @memberof core.Helper
 */
export function normalizeFontFamilies(
  $value: string | Array<string>
): string | null {
  let $sanitized = [];

  if (typeof $value === "string") { // _.isString($value)) {
    $value = $value.split(",");
  }
  if (Array.isArray($value)) {
    for (var i = 0; i < $value.length; i++) {
      $sanitized.push(normalizeFontFamily($value[i]));
    }
    return $sanitized.join(",");
  }

  return null;
}

/**
 * Extract number (either integers or float)
 *
 * @see http://stackoverflow.com/a/17885985/1938970
 *
 * @since  1.0.0
 * @memberof core.Helper
 * @return {number|null} The extracted number or null if the value does not
 *                       contain any digit.
 */
export function extractNumber($value: any): number | null {
  const matches = /(\+|-)?((\d+(\.\d+)?)|(\.\d+))/.exec($value);

  if (matches && is_numeric(matches[0])) {
    return Number(matches[0]);
  }

  return null;
}

/**
 * Extract size unit
 *
 * It returns the first matched, so the units are kind of sorted by popularity.
 * @see http://www.w3schools.com/cssref/css_units.asp List of the css units
 *
 * @since  1.0.0
 * @memberof core.Helper
 * @return {string|null} The first valid unit found.
 */
export function extractSizeUnit($value: any): string | null {
  const matches = /(px|%|em|rem|vh|vw|vmin|vmax|cm|mm|in|pt|pc|ch|ex)/.exec(
    $value
  );

  if (matches && matches[0]) {
    return matches[0];
  }
  return null;
}

/**
 * Modulus
 *
 * @see {@link https://stackoverflow.com/a/31711034}
 * @since  1.0.0
 * @memberof core.Helper
 */
export function modulus(val: number, step: number): number {
  let valDecCount = (val.toString().split(".")[1] || "").length;
  let stepDecCount = (step.toString().split(".")[1] || "").length;
  let decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  let valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  let stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return (valInt % stepInt) / Math.pow(10, decCount);
}

/**
 * Is Multiple of
 *
 * Take a look at {@link http://stackoverflow.com/q/12429362/1938970}
 * about this topic. This solution is an ok compromise. We use `Math.abs` to
 * convert negative number to positive otherwise the minor comparison would
 * always return true for negative numbers.
 *
 * This could be a valid alternative to the above `modulus` function.
 * Note that unlike `modulus` the return value here is a boolean.
 *
 * @ignore
 */
export function isMultipleOf(_val: string, _step: string): boolean {
  const val: number = parseFloat(_val);
  const step: number = parseFloat(_step);
  const a = Math.abs(val);
  const b = Math.abs(step);
  const result =
    Math.round(Math.round(a * 100000) % Math.round(b * 100000)) / 100000;
  return result < 1e-5;
}

/**
 * To Boolean
 * '0' or '1' to boolean
 *
 * @since  1.0.0
 * @memberof core.Helper
 */
export function numberToBoolean(value: string | number): boolean {
  return typeof value === "boolean" ? value : !!parseInt(value, 10);
}

/**
 * Strip HTML from value
 *
 * @see {@link http://stackoverflow.com/q/5002111/1938970}
 *
 * @since  1.0.0
 * @memberof core.Helper
 */
export function stripHTML(value: string): string {
  return $(document.createElement("div"))
    .html(value)
    .text();
}

/**
 * Does string value contains HTML?
 *
 * This is just to warn the user, actual sanitization is done backend side.
 * @see https://stackoverflow.com/a/15458987
 *
 * @since  1.0.0
 * @memberof core.Helper
 */
export function hasHTML(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

/**
 * Is HTML?
 *
 * It tries to use the DOMParser object (see {@link mzl.la/2kh7HEl Browser
 * compatibility table}), otherwise it just returns false.
 * Solution inspired by this {@link http://bit.ly/2k6uFLI stackerflow answer)
 * Not currently in use.
 *
 * @since  1.0.0
 * @ignore
 */
export function isHTML(input: string): boolean {
  if (window.DOMParser) {
    try {
      var doc = new window.DOMParser().parseFromString(input, "text/html");
      return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * @alias core.Helper
 * @description  Exposed module Helper
 * @access package
 */
export default {
  isEmpty,
  isHex,
  isRgb,
  isRgba,
  isColor,
  hexToRgb,
  rgbaToRgb,
  normalizeFontFamily,
  normalizeFontFamilies,
  extractSizeUnit,
  extractNumber,
  modulus,
  // These don't have a PHP equivalent in the KKcp_Helper class:
  numberToBoolean,
  stripHTML,
  hasHTML
};
