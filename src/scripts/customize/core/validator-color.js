// import isHexColor from 'validator/lib/isHexColor';

/**
 * Color validation utility
 *
 * Heavily inspired by formvalidation.js
 * by Nguyen Huu Phuoc, aka @nghuuphuoc and contributors
 * {@link https://github.com/formvalidation/}
 *
 * @type {Object}
 */
export default {
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
