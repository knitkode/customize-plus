import window from 'window';
import document from 'document';
import $ from 'jquery';
import _ from 'underscore';
import wp from 'wp';
// import pluginApi from '../api'
import pluginApi from 'kkcp'

/**
 * WordPress Customize public API
 *
 * Accessible on `window.wp.customize` during production and on `window.wpApi`
 * during development.
 *
 * @since  1.0.0
 * @access package
 * @ignore
 * @type {Object}
 */
export const wpApi = wp.customize;

/**
 * Customize Plus public API
 *
 * Accessible on `window.kkcp` during production and on `window.api`
 * during development.
 *
 * @since  1.0.0
 * @access package
 * @ignore
 * @type {Object}
 */
export const api = pluginApi;

/**
 * Reuse the same jQuery wrapped `window` object
 *
 * @since  1.0.0
 * @access package
 * @ignore
 * @type {jQuery}
 */
export const $window = $(window);

/**
 * Reuse the same jQuery wrapped `document` object
 *
 * @since  1.0.0
 * @access package
 * @ignore
 * @type {jQuery}
 */
export const $document = $(document);

/**
 * Reuse the same `body` element
 *
 * @since  1.0.0
 * @access package
 * @ignore
 * @type {HTMLElement}
 */
export const body = document.getElementsByTagName('body')[0];

/**
 * Reuse the same jQuery wrapped WordPress API ready deferred object
 *
 * @since  1.0.0
 * @access package
 * @ignore
 * @type {jQuery.Deferred}
 */
export const $readyWP = $.Deferred();

/**
 * Reuse the same jQuery wrapped DOM ready deferred object
 *
 * @since  1.0.0
 * @access package
 * @ignore
 * @type {jQuery.Deferred}
 */
export const $readyDOM = $.Deferred();

/**
 * Reuse the same WordPress API and DOM ready deferred object. Resolved when
 * both of them are resolved.
 *
 * @since  1.0.0
 * @access package
 * @ignore
 * @type {jQuery.Deferred}
 */
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
  window.wpApi = wpApi;
  window.api = api
}
