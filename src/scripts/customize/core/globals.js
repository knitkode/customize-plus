import $ from 'jquery';
import _ from 'underscore';
import wp from 'wp';
import pluginApi from 'PWPcp';

/** @type {Object} It collects core components */
pluginApi.core = pluginApi.core || {};

/** @type {Object} It collects additional components */
pluginApi.components = pluginApi.components || {};

/** @type {Object} It collects controls, sections and panels prototypes */
pluginApi.controls = pluginApi.controls || {};
pluginApi.sections = pluginApi.sections || {};
pluginApi.panels = pluginApi.panels || {};

// exports Customize Plus API
export var api = pluginApi;

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

// @@todo \\
// var DEBUG = true; is injected through rollup
if (DEBUG) {
  $ready.done(() => { console.log('global $ready.done()'); });

  DEBUG = {
    performances: false,
    compiler: false
  };
  // shim for Opera // @@todo remove these two lines \\
  window.performance = window.performance || { now: function(){} };
  // var t = performance.now();

  // just an alias
  window.api = pluginApi;
}

// // be sure to have what we need, bail otherwise
// if (!wp) {
//   throw new Error('Missing crucial object `wp`');

// // be sure to have what we need, bail otherwise
// if (!pluginApi) {
//   throw new Error('Missing crucial object `PWPcp`');
// }
