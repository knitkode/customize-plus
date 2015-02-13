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

  /**
   * Content customizes
   *
   * No need to recompile less for these.
   */
  api('footer-text', function (value) {
    var $footerText = $('.footer-text');
    value.bind(function (to) {
      $footerText.text(to);
    });
  });

  var $siteTitle = $('.site-title');
  api('blogname', function (value) { // k6wptight-default title_tagline section \\
    value.bind(function (to) {
      $siteTitle.text(to);
    });
  });

  var $siteTagline = $('.site-tagline');
  api('blogdescription', function (value) { // k6wptight-default title_tagline section \\
    value.bind(function (to) {
      $siteTagline.text(to);
    });
  });

  api('header_textcolor', function (value) { // k6wptight-default title_tagline section \\
    value.bind(function (to) {
      $siteTitle.toggle(to);
      $siteTagline.toggle(to);
    });
  });

  /**
   * Recompile later section
   * Mimic the effect that the recompilation would have
   * postponing the actual recompilation to the next
   * time  is actually needed or on save.
   * The setting id (`api('SETTING_ID')`) needs to be
   * the real one (without `@`).
   */
  var
    selectorHeadings =
      'h1, h2, h3, h4, h5, h6,' +
      '.h1, .h2, .h3, .h4, .h5, .h6';


  api('headings-font-weight', function (value) {
    value.bind(function (to) {
      _toCSS('headings-font-weight', 'font-weight', to, selectorHeadings);
    });
  });

  api('headings-line-height', function (value) {
    value.bind(function (to) {
      _toCSS('headings-line-height', 'line-height', to, selectorHeadings);
    });
  });

  api('body-bg', function (value) {
    value.bind(function (to) {
      _toCSS('body-bg', 'background-color', to, 'body, .table');
    });
  });

  // api('font-family-base', function (value) {
  //   value.bind(function (to) {
  //     _toCSS('font-family-base', 'font-family', to, 'body');
  //   });
  // });

})(window, jQuery, wp);