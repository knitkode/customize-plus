/* jshint undef: false, unused: false */

// ==ClosureCompiler==
// @output_file_name customize.min.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// @externs_url https://rawgit.com/google/closure-compiler/master/contrib/externs/jquery-1.9.js
// @externs_url https://rawgit.com/google/closure-compiler/master/contrib/externs/underscore-1.5.2.js
// @externs_url https://rawgit.com/google/closure-compiler/master/contrib/externs/es6.js
// @externs_url https://gist.github.com/kuus/745c40c5bf29698f4765/raw/225dc7df973e2782b11ad122241a337c9bbb0dcf/externs
// ==/ClosureCompiler==

(function (window, document, $, _, k6cp, wp) {
  'use strict';
  // var t = performance.now(); // k6debug-perf \\

  /**
   * Reusable variables as globals in each component
   *
   */
  /** @type {jQuery} */
  var $window = $(window);

  /** @type {jQuery} */
  var $document = $(document);

  /** @type {HTMLelement} */
  var body = document.getElementsByTagName('body')[0];

  /** @type {Object} */
  var l10n = k6cp['l10n'];

  /** @type {Object} */
  var api = wp['customize'];

  /** @type {boolean} */
  var apiIsReady = false;
  api.bind('ready', function () {
    apiIsReady = true;
  });

  //= include customize/components/wpdom.js
  //= include customize/components/regexes.js
  //= include customize/components/utils.js
  //= include customize/components/skeleton.js
  //= include customize/components/tabs.js
  //= include customize/components/tooltips.js

  /**
   * Collect here sections prototypes
   *
   * @type {Object}
   */
  k6cp['sections'] = {};

  //= include customize/sections/base.js


  /**
   * Collect here controls prototypes
   *
   * @type {Object}
   */
  k6cp['controls'] = {};

  //= include customize/controls/base.js
    // include customize/controls/base-dummy' )
  //= include customize/controls/base-input.js
  //= include customize/controls/base-radio.js
  //= include customize/controls/buttonset.js
  //= include customize/controls/color.js
  //= include customize/controls/font-family.js
  //= include customize/controls/multicheck.js
  //= include customize/controls/number.js
  //= include customize/controls/radio.js
  //= include customize/controls/radio-image.js
  //= include customize/controls/select.js
  //= include customize/controls/slider.js
  //= include customize/controls/text.js
  //= include customize/controls/toggle.js

  /**
   * Components initialization
   *
   * Not every component needs to wait for document ready
   * The order of intialization is important here both
   * because of dependencies among components and from a DOM
   * perspective (like in the tools menu where first we need
   * the tool menu then all the controls inside of it).
   */
  Skeleton.init();

  $document.ready(function() {
    Tabs.init();
    Tooltips.init();
    // console.log('customize.js took ' + (performance.now() - t) + ' ms.') // k6debug-perf \\
  });

  //= include customize/temp.js

})(window, document, jQuery, _, k6cp, wp);
