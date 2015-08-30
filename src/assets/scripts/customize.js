/* global WpTight, Skeleton, Tabs, Tooltips, Notices */
/* jshint unused: false, funcscope: true */

(function (window, document, $, _, wp, api, validator) {
  'use strict';

  // this is needed to don't break js while developing,
  // it gets stripped out during minification
  var DEBUG = true;

  if (DEBUG) {
    // shim for Opera
    window.performance = window.performance || { now: function() {} };
    var t = performance.now();
  }

  // Set default speed of jQuery animations
  $.fx.speeds['_default'] = 180; // whitelisted from uglify mangle regex private names \\

  /**
   * Reusable variables as globals in each included file
   *
   */
  /** @type {jQuery} */
  var $window = $(window);

  /** @type {jQuery} */
  var $document = $(document);

  /** @type {HTMLelement} */
  var body = document.getElementsByTagName('body')[0];

  /** @type {Object} */
  var wpApi = wp.customize;

  /** @type {boolean} */
  var wpApiIsReady = false;
  wpApi.bind('ready', function() {
    wpApiIsReady = true;
  });

  //= require customize/core/markdown.js
  //= require customize/core/wptight.js
  //= require customize/core/regexes.js
  //= require customize/core/validators.js
  //= require customize/core/utils.js
  //= require customize/core/skeleton.js
  //= require customize/core/notices.js
  //= require customize/core/tabs.js
  //= require customize/core/tooltips.js

  /**
   * Collect here controls prototypes
   *
   * @type {Object}
   */
  api.controls = {};

  //= require customize/controls/base.js
  //= require customize/controls/base-input.js
  //= require customize/controls/base-radio.js
  //= require customize/controls/buttonset.js
  //= require customize/controls/color.js
  //= require customize/controls/dummy.js
  //= require customize/controls/font-family.js
  //= require customize/controls/multicheck.js
  //= require customize/controls/number.js
  //= require customize/controls/radio.js
  //= require customize/controls/radio-image.js
  //= require customize/controls/select.js
  //= require customize/controls/font-weight.js
  //= require customize/controls/slider.js
  //= require customize/controls/sortable.js
  //= require customize/controls/tags.js
  //= require customize/controls/text.js
  //= require customize/controls/textarea.js
  //= require customize/controls/toggle.js

  if (DEBUG) console.log('customize.js controls initialization took ' + (performance.now() - t) + ' ms.');

  /**
   * Core initialization
   *
   */
  $document.ready(function() {
    if (DEBUG) var t = performance.now();
    WpTight.init();
    Skeleton.init();
    Tabs.init();
    Tooltips.init();
    Notices.init();
    if (DEBUG) console.log( 'customize.js core initialization took ' + (performance.now() - t) + ' ms.');
  });

  //= require customize/temp.js

})(window, document, jQuery, _, wp, PWPcp, validator);
