/*!
 * Customize Plus v1.0.22 (https://knitkode.com/products/customize-plus)
 * Enhance and extend the WordPress Customize in your themes.
 * Copyright (c) 2014-2018 KnitKode <dev@knitkode.com> (https://knitkode.com/)
 * @license SEE LICENSE IN license.txt (Last change on: 22-1-2018)
 *//* jshint unused: false */

(function (window, document, $, wp, api) {
  'use strict';

  // be sure to have what we need, bail otherwise
  if (!wp || !api) {
    return;
  }
  var wpApi = wp.customize;

  /**
   * Customize Plus API constants
   * @type {Object}
   */
  var constants = api.constants;

  /**
   * To CSS
   * Helper to append a piece of CSS for a specific option changed
   * @param  {string} id       Setting ID / Variable name
   * @param  {string} property CSS property name
   * @param  {string} value    CSS value
   * @param  {string} selector Selector to apply propert value css pair
   */
  api.toCSS = function (id, property, value, selector) {
    if (!value || !selector) {
      return;
    }
    var idFinal = 'kkcp-style-' + id;
    var css = selector + '{' + property + ':' + value + '};';
    var oldCSS = document.getElementById(idFinal);
    if (oldCSS) {
      oldCSS.innerHTML = css;
    } else {
      var style = document.createElement('style');
      style.id = idFinal;
      style.innerHTML = css;
      style.appendChild(document.createTextNode(''));
      document.head.appendChild(style);
    }
  };

  /**
   * Get option id
   * Since its simplicity and possible overuse in many loops this function is
   * not actually used, but 'inlined' in other functions, it's here just for
   * reference.
   *
   * @since  1.0.0
   *
   * @see  PHP: `KKcp_Theme::get_option_id()`
   * @param  {string} optName The simple setting id (without theme prefix)
   * @return {string} The real setting id (with theme prefix)
   */
  api.getOptionId = function (optName) {
    return constants.OPTIONS_PREFIX + '[' + optName + ']';
  };

  /**
   * Get option id attribute
   *
   * Same as `get_option_id` but return a valid HTML attribute name (square
   * brackets are not allowed in HTML ids or class names).
   *
   * @since  1.0.0
   *
   * @see  PHP: `KKcp_Theme::get_option_id_attr()`
   * @param  {string} optName The simple setting id (without theme prefix)
   * @return {string} The real setting id (with theme prefix) HTML ready
   */
  api.getOptionIdAttr = function (optName) {
    return constants.OPTIONS_PREFIX + '__' + optName;
  };

})(window, document, jQuery, wp, kkcp);
