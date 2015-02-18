(function (window, $, wp) {
  'use strict';

  var api = wp.customize;

  /**
   * To CSS
   * Helper to append a piece of CSS for a specific option changed
   * @param  {string} id       Option ID / Variable name
   * @param  {string} property CSS property name
   * @param  {string} value    CSS value
   * @param  {string} selector Selector to apply propert value css pair
   */
  function _toCSS (id, property, value, selector) {
    if (!value || !selector) {
      return;
    }
    var idFinal = 'k6-style-' + id;
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
  }

  // export public API
  window.k6cp = {};
  window.k6cp['toCSS'] = _toCSS;

})(window, jQuery, wp);