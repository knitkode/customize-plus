/* global Regexes */

/**
 * Validator
 *
 * Extends {@link https://github.com/chriso/validator.js}
 * @requires api.Regexes
 */
(function() {

  /**
   * Color validation utility
   *
   * Heavily inspired by formvalidation.js
   * by Nguyen Huu Phuoc, aka @nghuuphuoc and contributors
   * {@link https://github.com/formvalidation/}
   *
   * @type {Object}
   */
  var _ValidatorColor = {
    types: [ 'hex', 'rgb', 'rgba', 'hsl', 'hsla', 'keyword' ],
    // available also on `less.js` global var `less.data.colors` as Object
    keywords: [ 'aliceblue',
      'antiquewhite',
      'aqua',
      'aquamarine',
      'azure',
      'beige',
      'bisque',
      'black',
      'blanchedalmond',
      'blue',
      'blueviolet',
      'brown',
      'burlywood',
      'cadetblue',
      'chartreuse',
      'chocolate',
      'coral',
      'cornflowerblue',
      'cornsilk',
      'crimson',
      'cyan',
      'darkblue',
      'darkcyan',
      'darkgoldenrod',
      'darkgray',
      'darkgreen',
      'darkgrey',
      'darkkhaki',
      'darkmagenta',
      'darkolivegreen',
      'darkorange',
      'darkorchid',
      'darkred',
      'darksalmon',
      'darkseagreen',
      'darkslateblue',
      'darkslategray',
      'darkslategrey',
      'darkturquoise',
      'darkviolet',
      'deeppink',
      'deepskyblue',
      'dimgray',
      'dimgrey',
      'dodgerblue',
      'firebrick',
      'floralwhite',
      'forestgreen',
      'fuchsia',
      'gainsboro',
      'ghostwhite',
      'gold',
      'goldenrod',
      'gray',
      'green',
      'greenyellow',
      'grey',
      'honeydew',
      'hotpink',
      'indianred',
      'indigo',
      'ivory',
      'khaki',
      'lavender',
      'lavenderblush',
      'lawngreen',
      'lemonchiffon',
      'lightblue',
      'lightcoral',
      'lightcyan',
      'lightgoldenrodyellow',
      'lightgray',
      'lightgreen',
      'lightgrey',
      'lightpink',
      'lightsalmon',
      'lightseagreen',
      'lightskyblue',
      'lightslategray',
      'lightslategrey',
      'lightsteelblue',
      'lightyellow',
      'lime',
      'limegreen',
      'linen',
      'magenta',
      'maroon',
      'mediumaquamarine',
      'mediumblue',
      'mediumorchid',
      'mediumpurple',
      'mediumseagreen',
      'mediumslateblue',
      'mediumspringgreen',
      'mediumturquoise',
      'mediumvioletred',
      'midnightblue',
      'mintcream',
      'mistyrose',
      'moccasin',
      'navajowhite',
      'navy',
      'oldlace',
      'olive',
      'olivedrab',
      'orange',
      'orangered',
      'orchid',
      'palegoldenrod',
      'palegreen',
      'paleturquoise',
      'palevioletred',
      'papayawhip',
      'peachpuff',
      'peru',
      'pink',
      'plum',
      'powderblue',
      'purple',
      'red',
      'rosybrown',
      'royalblue',
      'saddlebrown',
      'salmon',
      'sandybrown',
      'seagreen',
      'seashell',
      'sienna',
      'silver',
      'skyblue',
      'slateblue',
      'slategray',
      'slategrey',
      'snow',
      'springgreen',
      'steelblue',
      'tan',
      'teal',
      'thistle',
      'tomato',
      'transparent',
      'turquoise',
      'violet',
      'wheat',
      'white',
      'whitesmoke',
      'yellow',
      'yellowgreen'
    ],
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
      return this.keywords.indexOf(value) !== -1;
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

  validator.extend('isColor',
  /**
   * Is Color
   * @param  {string} str The string to validate
   * @return {boolean}    Whether is valid or not.
   */
  function (str) {
    var types = _ValidatorColor.types;
    var isValid = false;

    for (var i = 0, l = types.length; i < l; i++) {
      isValid = isValid || _ValidatorColor[types[i]](str);
      if (isValid) {
        return true;
      }
    }

    return false;
  });

  validator.extend('isRgbaColor',
  /**
   * Is rgba Color
   * @param  {string} str The string to validate
   * @return {boolean}    Whether is valid or not.
   */
  function (str) {
    return _ValidatorColor.rgba(str);
  });

  validator.extend('isVar',
  /**
   * Is Var
   * @param  {string} str The string to validate
   * @return {boolean}    Whether is valid or not.
   */
  function (str) {
    return validator.matches(str, Regexes._simpleVariable_match);
  });

  validator.extend('isMultipleOf',
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
  function isMultipleOf(number1, number2) {
    var a = Math.abs(number1);
    var b = Math.abs(number2);
    var result = Math.round( Math.round(a * 100000) % Math.round(b * 100000) ) / 100000;
    return result < 1e-5;
  });

  validator.extend('is_int',
  /**
   * Is int (php js)
   * @see http://phpjs.org/functions/is_int/
   * @param  {?}  mixed_var
   * @return {boolean}
   */
  function is_int(mixed_var) {
    var number = Number(mixed_var);
    return number === +number && isFinite(number) && number % 1 === 0;
  });

  validator.extend('is_float',
  /**
   * Is float (php js)
   * @see http://phpjs.org/functions/is_float/
   * @param  {?}  mixed_var
   * @return {boolean}
   */
  function is_float(mixed_var) {
    var number = Number(mixed_var);
    return +number === number && (!isFinite(number) || number % 1 !== 0);
  });

})();
