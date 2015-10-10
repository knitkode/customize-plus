
// this is needed to don't break js while developing,
// it gets stripped out during minification
var DEBUG = true;

if (DEBUG) {
  DEBUG = {
    performances: false
  };
  // shim for Opera
  window.performance = window.performance || { now: function() {} };
  var t = performance.now();

  // useful to play in the console
  window.wpApi = wp.customize;
}

// be sure to have what we need, bail otherwise
if (!wp || !api) {
  return;
}

/**
 * Reusable variables as globals in each included file
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

/**
 * Collect here controls prototypes
 *
 * @type {Object}
 */
api.controls = api.controls || {};
