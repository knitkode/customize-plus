/* jshint unused: false */

(function (window, $, wp) {
  'use strict';

  var api = window.PWPcp || {};
  var wpApi = wp.customize;

  /**
   * To CSS
   * Helper to append a piece of CSS for a specific option changed
   * @param  {string} id       Option ID / Variable name
   * @param  {string} property CSS property name
   * @param  {string} value    CSS value
   * @param  {string} selector Selector to apply propert value css pair
   */
  api.toCSS = function (id, property, value, selector) {
    if (!value || !selector) {
      return;
    }
    var idFinal = 'pwpcp-style-' + id;
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

  // export public API under namespace
  window.PWPcp = api;

})(window, jQuery, wp);