import window from 'window';
// import isHexColor from 'validator/lib/isHexColor';
import matches from 'validator/lib/matches';
import { api } from './globals';
import Regexes from './regexes';

/**
 * Color validation utility
 *
 * Heavily inspired by formvalidation.js
 * by Nguyen Huu Phuoc, aka @nghuuphuoc and contributors
 * {@link https://github.com/formvalidation/}
 *
 * @type {Object}
 */
const colorValidator = {
  types: api['colorsFormatsSupported'],
  keywords: api['colorsKeyword'],
  hex: function(value) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
  },
  hsl: function(value) {
    return /^hsl\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/.test(value);
  },
  hsla: function(value) {
    return /^hsla\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/.test(value);
  },
  keyword: function(value) {
    return !!this.keywords[value];
  },
  rgb: function(value) {
    var regexInteger = /^rgb\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){2}(\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*)\)$/;
    var regexPercent = /^rgb\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/;
    return regexInteger.test(value) || regexPercent.test(value);
  },
  rgba: function(value) {
    var regexInteger = /^rgba\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
    var regexPercent = /^rgba\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
    return regexInteger.test(value) || regexPercent.test(value);
  }
};

/**
 * Is Color
 * @param  {string} str The string to validate
 * @return {boolean}    Whether is valid or not.
 */
export function isColor (str) {
  var types = colorValidator.types;
  var isValid = false;

  for (var i = 0, l = types.length; i < l; i++) {
    isValid = isValid || colorValidator[types[i]](str);
    if (isValid) {
      return true;
    }
  }

  return false;
}

/**
 * Is keyword Color
 * @param  {string} str The string to validate
 * @return {boolean}    Whether is valid or not.
 */
export function isKeywordColor (str) {
  return colorValidator.keyword(str);
}

/**
 * Is hex Color
 * @param  {string} str The string to validate
 * @return {boolean}    Whether is valid or not.
 */
export function isHexColor (str) {
  return colorValidator.hex(str);
}

/**
 * Is rgb Color
 * @param  {string} str The string to validate
 * @return {boolean}    Whether is valid or not.
 */
export function isRgbColor (str) {
  return colorValidator.rgb(str);
}

/**
 * Is rgba Color
 * @param  {string} str The string to validate
 * @return {boolean}    Whether is valid or not.
 */
export function isRgbaColor (str) {
  return colorValidator.rgba(str);
}

/**
 * Is Multiple of
 *
 * Take a look at the {@link http://stackoverflow.com/q/12429362/1938970
 * stackoverflow question} about this topic. This solution is an ok
 * compromise. We use `Math.abs` to convert negative number to positive
 * otherwise the minor comparison would always return true for negative
 * numbers.
 *
 * @param  {string}  number   [description]
 * @param  {string}  multiple [description]
 * @return {Boolean}          [description]
 */
export function isMultipleOf (number1, number2) {
  var a = Math.abs(number1);
  var b = Math.abs(number2);
  var result = Math.round( Math.round(a * 100000) % Math.round(b * 100000) ) / 100000;
  return result < 1e-5;
}

/**
 * Is HTML?
 *
 * It tries to use the DOMParser object (see Browser compatibility table
 * [here](mzl.la/2kh7HEl)), otherwise it just.
 * Solution inspired by this [stackerflow answer](http://bit.ly/2k6uFLI)
 *
 * // @@unused \\
 * @param  {string}  str
 * @return {Boolean}
 */
export function isHTML (str) {
  if (window.DOMParser) {
    try {
      var doc = new window.DOMParser().parseFromString(str, 'text/html');
      return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    } catch (e) {}
  } else {
    return false;
  }
}

/**
 * To Boolean
 * '0' or '1' to boolean
 *
 * @static
 * @param  {strin|number} value
 * @return {boolean}
 */
export function numberToBoolean (value) {
  return typeof value === 'boolean' ? value : !!parseInt(value, 10);
}

// export to public API
// export default api.core.Validators = Validators;
