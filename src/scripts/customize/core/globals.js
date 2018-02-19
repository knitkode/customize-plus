import window from 'window';
import document from 'document';
import $ from 'jquery';
import _ from 'underscore';
import wp from 'wp';
import pluginApi from 'kkcp';

// Collectors for Customize Plus public API

/** @type {Object} */
pluginApi.core = pluginApi.core || {};
/** @type {Object} [description] */
pluginApi.components = pluginApi.components || {};
/** @type {Object} */
pluginApi.controls = pluginApi.controls || {};
/** @type {Object} */
pluginApi.sections = pluginApi.sections || {};
/** @type {Object} */
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

// be sure to have what we need
if (!wp) {
  throw new Error('Missing crucial object `wp`');
  $readyWP.reject();
  $readyDOM.reject();
}

// be sure to have what we need
if (!pluginApi) {
  throw new Error('Missing crucial object `kkcp`');
  $readyWP.reject();
  $readyDOM.reject();
}

// var DEBUG = true; is injected through rollup
if (DEBUG) {
  $ready.done(() => { console.log('global $ready.done()'); });

  DEBUG = {
    performances: false,
    compiler: false
  };

  // just useful aliases for debugging
  window.api = pluginApi;
  window.wpApi = wpApi;
}
