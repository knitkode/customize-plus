/**
 * Validator
 *
 * Extends https://github.com/chriso/validator.js
 */
(function() {

  /**
   * Color validation utility
   *
   * Heavily inspired by formvalidation.js
   * by Nguyen Huu Phuoc, aka @nghuuphuoc and contributors
   * @link(https://github.com/formvalidation/)
   *
   * @type {Object}
   */
  var _ValidatorColor = {
    types: [ 'hex', 'rgb', 'rgba', 'hsl', 'hsla', 'keyword' ],
    // available also on `less.js` global var `less.data.colors` as Object
    keywords: [ 'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'transparent', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'
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
    return validator.matches(str, /@([a-zA-Z-_0-9]+)/g);
  });

  validator.extend('is_int',
  /**
   * Is int (php js)
   * @param  {?}  mixed_var
   * @return {boolean}
   */
  function is_int(mixed_var) {
    var number = Number(mixed_var);
    //  discuss at: http://phpjs.org/functions/is_int/
    // original by: Alex
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: WebDevHobo (http://webdevhobo.blogspot.com/)
    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
    //  revised by: Matt Bradley
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //        note: 1.0 is simplified to 1 before it can be accessed by the function, this makes
    //        note: it different from the PHP implementation. We can't fix this unfortunately.
    //   example 1: is_int(23)
    //   returns 1: true
    //   example 2: is_int('23')
    //   returns 2: false
    //   example 3: is_int(23.5)
    //   returns 3: false
    //   example 4: is_int(true)
    //   returns 4: false
    return number === +number && isFinite(number) && !(number % 1);
  });

  validator.extend('is_float',
  /**
   * Is float (php js)
   * @param  {?}  mixed_var
   * @return {boolean}
   */
  function is_float(mixed_var) {
    var number = Number(mixed_var);
    //  discuss at: http://phpjs.org/functions/is_float/
    // original by: Paulo Freitas
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // improved by: WebDevHobo (http://webdevhobo.blogspot.com/)
    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
    //        note: 1.0 is simplified to 1 before it can be accessed by the function, this makes
    //        note: it different from the PHP implementation. We can't fix this unfortunately.
    //   example 1: is_float(186.31);
    //   returns 1: true
    return +number === number && (!isFinite(number) || !!(number % 1));
  });

})();
