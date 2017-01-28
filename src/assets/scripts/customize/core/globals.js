import window from 'window';
import document from 'document';
import $ from 'jquery';
import _ from 'underscore';
import wp from 'wp';

// be sure to have what we need, bail otherwise
if (!wp) {
  throw new Error('Missing crucial object `wp`');
}

// var DEBUG = true; is injected through rollup
if (DEBUG) {
  DEBUG = {
    performances: false,
    compiler: false
  };
  // shim for Opera // @@todo remove these two lines \\
  window.performance = window.performance || { now: function(){} };
  // var t = performance.now();
}

/** @type {jQuery} */
export const $window = $(window);

/** @type {jQuery} */
export const $document = $(document);

/** @type {HTMLElement} */
export const body = document.getElementsByTagName('body')[0];

/** @type {Object} */
export const wpApi = wp.customize;

/** @type {jQuery.Deferred} */
export const $readyWP = $.Deferred();

/** @type {jQuery.Deferred} */
export const $readyDOM = $.Deferred();

/** @type {jQuery.Deferred} */
export const $ready = $.when($readyDOM, $readyWP);

wpApi.bind('ready', () => { $readyWP.resolve(); });

const _readyDOM = (fn) => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
_readyDOM(() => { $readyDOM.resolve(); });

if (DEBUG) {
  // it gets twice in the console 'cause this code is in all customize scripts
  $ready.done(() => { console.log('global $ready.done()'); });
}
