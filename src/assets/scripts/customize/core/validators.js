import isHexColor from 'validator/lib/isHexColor';
import matches from 'validator/lib/matches';
import { api } from './api';
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
const _validatorColor = {
  types: [ 'hex', 'rgb', 'rgba', 'hsl', 'hsla', 'keyword' ],
  // available also on `less.js` global var `less.data.colors` as Object
  keywords: {
    'aliceblue': 0,
    'antiquewhite': 0,
    'aqua': 0,
    'aquamarine': 0,
    'azure': 0,
    'beige': 0,
    'bisque': 0,
    'black': 0,
    'blanchedalmond': 0,
    'blue': 0,
    'blueviolet': 0,
    'brown': 0,
    'burlywood': 0,
    'cadetblue': 0,
    'chartreuse': 0,
    'chocolate': 0,
    'coral': 0,
    'cornflowerblue': 0,
    'cornsilk': 0,
    'crimson': 0,
    'cyan': 0,
    'darkblue': 0,
    'darkcyan': 0,
    'darkgoldenrod': 0,
    'darkgray': 0,
    'darkgreen': 0,
    'darkgrey': 0,
    'darkkhaki': 0,
    'darkmagenta': 0,
    'darkolivegreen': 0,
    'darkorange': 0,
    'darkorchid': 0,
    'darkred': 0,
    'darksalmon': 0,
    'darkseagreen': 0,
    'darkslateblue': 0,
    'darkslategray': 0,
    'darkslategrey': 0,
    'darkturquoise': 0,
    'darkviolet': 0,
    'deeppink': 0,
    'deepskyblue': 0,
    'dimgray': 0,
    'dimgrey': 0,
    'dodgerblue': 0,
    'firebrick': 0,
    'floralwhite': 0,
    'forestgreen': 0,
    'fuchsia': 0,
    'gainsboro': 0,
    'ghostwhite': 0,
    'gold': 0,
    'goldenrod': 0,
    'gray': 0,
    'green': 0,
    'greenyellow': 0,
    'grey': 0,
    'honeydew': 0,
    'hotpink': 0,
    'indianred': 0,
    'indigo': 0,
    'ivory': 0,
    'khaki': 0,
    'lavender': 0,
    'lavenderblush': 0,
    'lawngreen': 0,
    'lemonchiffon': 0,
    'lightblue': 0,
    'lightcoral': 0,
    'lightcyan': 0,
    'lightgoldenrodyellow': 0,
    'lightgray': 0,
    'lightgreen': 0,
    'lightgrey': 0,
    'lightpink': 0,
    'lightsalmon': 0,
    'lightseagreen': 0,
    'lightskyblue': 0,
    'lightslategray': 0,
    'lightslategrey': 0,
    'lightsteelblue': 0,
    'lightyellow': 0,
    'lime': 0,
    'limegreen': 0,
    'linen': 0,
    'magenta': 0,
    'maroon': 0,
    'mediumaquamarine': 0,
    'mediumblue': 0,
    'mediumorchid': 0,
    'mediumpurple': 0,
    'mediumseagreen': 0,
    'mediumslateblue': 0,
    'mediumspringgreen': 0,
    'mediumturquoise': 0,
    'mediumvioletred': 0,
    'midnightblue': 0,
    'mintcream': 0,
    'mistyrose': 0,
    'moccasin': 0,
    'navajowhite': 0,
    'navy': 0,
    'oldlace': 0,
    'olive': 0,
    'olivedrab': 0,
    'orange': 0,
    'orangered': 0,
    'orchid': 0,
    'palegoldenrod': 0,
    'palegreen': 0,
    'paleturquoise': 0,
    'palevioletred': 0,
    'papayawhip': 0,
    'peachpuff': 0,
    'peru': 0,
    'pink': 0,
    'plum': 0,
    'powderblue': 0,
    'purple': 0,
    'red': 0,
    'rosybrown': 0,
    'royalblue': 0,
    'saddlebrown': 0,
    'salmon': 0,
    'sandybrown': 0,
    'seagreen': 0,
    'seashell': 0,
    'sienna': 0,
    'silver': 0,
    'skyblue': 0,
    'slateblue': 0,
    'slategray': 0,
    'slategrey': 0,
    'snow': 0,
    'springgreen': 0,
    'steelblue': 0,
    'tan': 0,
    'teal': 0,
    'thistle': 0,
    'tomato': 0,
    'transparent': 0,
    'turquoise': 0,
    'violet': 0,
    'wheat': 0,
    'white': 0,
    'whitesmoke': 0,
    'yellow': 0,
    'yellowgreen': 0
  },
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
  var types = _validatorColor.types;
  var isValid = false;

  for (var i = 0, l = types.length; i < l; i++) {
    isValid = isValid || _validatorColor[types[i]](str);
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
export function isColorKeyword (str) {
  return _validatorColor.keyword(str);
}

/**
 * Is rgba Color
 * @param  {string} str The string to validate
 * @return {boolean}    Whether is valid or not.
 */
export function isRgbaColor (str) {
  return _validatorColor.rgba(str);
}

/**
 * Is Var
 * @param  {string} str The string to validate
 * @return {boolean}    Whether is valid or not.
 */
export function isVar (str) {
  return matches(str, Regexes._simpleVariable_match);
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

let Validators = { isHexColor, isRgbaColor };

// export to public API
export default api.core.Validators = Validators;
