/* global WpTight, Skeleton, Tabs, Tooltips, Notices */
/* jshint unused: false, funcscope: true */

(function (window, document, $, _, wp, api, validator) {
  'use strict';

  // this is needed to don't break js while developing
  var DEBUG = true;

  if (DEBUG) {
    window.performance = window.performance || { now: function(){} }; // shim for Opera
    var t = performance.now();
  }

  // Set default speed of jQuery animations
  $.fx.speeds._default = 180;

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
  var wpApi = wp['customize'];

  /** @type {boolean} */
  var wpApiIsReady = false;
  wpApi.bind('ready', function () {
    wpApiIsReady = true;
  });

  //= include customize/core/markdown.js
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
  api['sections'] = {};

  //= include customize/sections/base.js


  /**
   * Collect here controls prototypes
   *
   * @type {Object}
   */
  api['controls'] = {};

  //= include customize/controls/base.js
    // include customize/controls/base-dummy.js
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
  //= include customize/controls/font-weight.js
  //= include customize/controls/slider.js
  //= include customize/controls/sortable.js
  //= include customize/controls/tags.js
  //= include customize/controls/text.js
  //= include customize/controls/textarea.js
  //= include customize/controls/toggle.js

  console.log('customize.js controls initialization took ' + (performance.now() - t) + ' ms.');

  /**
   * Components initialization
   *
   */
  $document.ready(function() {
    if (DEBUG) var t = performance.now();
    WpTight.init();
    Skeleton.init();
    Tabs.init();
    Tooltips.init();
    Notices.init();
    console.log('customize.js core initialization took ' + (performance.now() - t) + ' ms.');
  });

  //= include customize/temp.js

})(window, document, jQuery, _, wp, PWPcp, validator);
