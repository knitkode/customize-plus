/* jshint unused: false */

(function (window, document, $, _, wp, k6cp, validator) {
  'use strict';

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
  var api = wp['customize'];

  /** @type {boolean} */
  var apiIsReady = false;
  api.bind('ready', function () {
    apiIsReady = true;
  });

  //= include customize/core/wptight.js
  //= include customize/core/regexes.js
  //= include customize/core/validators.js
  //= include customize/core/utils.js
  //= include customize/core/skeleton.js
  //= include customize/core/notices.js
  //= include customize/core/tabs.js
  //= include customize/core/tooltips.js

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
  // var t = performance.now(); // k6debug-perf \\

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

  // console.log('customize.js controls initialization took ' + (performance.now() - t) + ' ms.') // k6debug-perf \\

  /**
   * Components initialization
   *
   */
  $document.ready(function() {
    // var t = performance.now(); // k6debug-perf \\
    WpTight.init();
    Skeleton.init();
    Tabs.init();
    Tooltips.init();
    Notices.init();
    // console.log('customize.js core initialization took ' + (performance.now() - t) + ' ms.') // k6debug-perf \\
  });

  //= include customize/temp.js

})(window, document, jQuery, _, wp, k6cp, validator);
