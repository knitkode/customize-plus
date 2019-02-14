/**
 * @fileOverview An helper class containing helper methods. This has its PHP
 * equivalent in `class-helper.php`
 *
 * @module utils
 * @memberof core
 */
import document from 'document';
import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi, body } from '../globals';

/**
 * Customize Plus base url
 *
 * @since  1.1.0
 * @memberof core.utils
 *
 * @type {string}
 */
export const _CP_URL = api.constants['CP_URL'];

/**
 * Customize Plus images url
 *
 * @since  1.1.0
 * @memberof core.utils
 *
 * @type {string}
 */
export const _CP_URL_IMAGES = `${_CP_URL}images/`;

/**
 * Images base url
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @type {string}
 */
export const _IMAGES_BASE_URL = api.constants['IMAGES_BASE_URL'];

/**
 * Docs base url
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @type {string}
 */
export const _DOCS_BASE_URL = api.constants['DOCS_BASE_URL'];

/**
 * Is it an absolute URL?
 *
 * @see {@link http://stackoverflow.com/a/19709846/1938970}
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param  {string}  url The URL to test
 * @return {boolean}     Whether is absolute or relative
 */
export function _isAbsoluteUrl (url) {
  return /^(?:[a-z]+:)?\/\//i._absoluteUrl.test(url);
}

/**
 * Clean URL from multiple slashes
 *
 * Strips possible multiple slashes caused by the string concatenation or dev errors
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param  {string} url
 * @return {string}
 */
export function _cleanUrlFromMultipleSlashes (url) {
  return url.replace(/[a-z-A-Z-0-9_]{1}(\/\/+)/g, '/');
}

/**
 * Get a clean URL
 *
 * If an absolute URL is passed we just strip multiple slashes,
 * if a relative URL is passed we also prepend the right base url.
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param  {string} url
 * @param  {string} type
 * @return {string}
 */
export function _getCleanUrl (url, type) {
  let finalUrl = url;

  if (!_isAbsoluteUrl(url)) {
    switch (type) {
      case 'img':
        finalUrl = _IMAGES_BASE_URL + url;
        break;
      case 'docs':
        finalUrl = _DOCS_BASE_URL + url;
        break;
      default:
        break;
    }
  }
  return _cleanUrlFromMultipleSlashes(finalUrl);
}

/**
 * Each control execute callback with control as argument
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param {function(WP_Customize_Control)} callback
 */
export function _eachControl (callback) {
  const wpApiControl = wpApi.control;

  for (var controlId in wpApi.settings.controls) {
    callback(wpApiControl(controlId));
  }
}

/**
 * Options API regex
 *
 * @since  1.1.0
 * @memberof core.utils
 *
 * @param  {string}  controlId The control id
 * @return {boolean}
 */
const _optionsApiRegex = new RegExp(api.constants['OPTIONS_PREFIX'] + '\\[.*\\]');

/**
 * Is the control's setting using the `theme_mods` API?
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param  {string}  controlId The control id
 * @return {boolean}
 */
export function _isThemeModsApi (controlId) {
  return !_optionsApiRegex.test(controlId);
}

/**
 * Is the control's setting using the `options` API?
 * Deduced by checking that the control id is structured as:
 * `themeprefix[setting-id]`
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param  {string}  controlId The control id
 * @return {boolean}
 */
export function _isOptionsApi (controlId) {
  return _optionsApiRegex.test(controlId);
}

/**
 * Get stylesheet by Node id
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param  {string} nodeId
 * @return {?HTMLElement}
 */
export function _getStylesheetById (nodeId) {
  const stylesheets = document.styleSheets;
  try {
    for (var i = 0, l = stylesheets.length; i < l; i++) {
      if (stylesheets[i].ownerNode.id === nodeId) {
        return stylesheets[i];
      }
    }
  } catch(e) {
    return null;
  }
}

/**
 * Get rules from stylesheet for the given selector
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param  {HTMLElement} stylesheet
 * @param  {string} selector
 * @return {string}
 */
export function _getRulesFromStylesheet (stylesheet, selector) {
  let output = '';

  if (stylesheet) {
    const rules = stylesheet.rules || stylesheet.cssRules;
    for (var i = 0, l = rules.length; i < l; i++) {
      if (rules[i].selectorText === selector) {
        output += (rules[i].cssText) ? ' ' + rules[i].cssText : ' ' + rules[i].style.cssText;
      }
    }
  }
  return output;
}

/**
 * Get CSS (property/value pairs) from the given rules.
 *
 * Basically it just clean the `rules` string removing the selector and
 * the brackets.
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param  {string} rules
 * @param  {string} selector
 * @return {string}
 */
export function _getCssRulesContent (rules, selector) {
  const regex = new RegExp(selector, 'g');
  let output = rules.replace(regex, '');
  output = output.replace(/({|})/g, '');
  return output.trim();
}

/**
 * Get image url
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param  {string} url The image URL, relative or absolute
 * @return {string}     The absolute URL of the image
 */
export function getImageUrl (url) {
  return _getCleanUrl(url, 'img');
}

/**
 * Get docs url
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param  {string} url The docs URL, relative or absolute
 * @return {string}     The absolute URL of the docs
 */
export function getDocsUrl (url) {
  return _getCleanUrl(url, 'docs');
}

/**
 * Bind a link element or directly link to a specific control to focus
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param  {HTMLElement} linkEl The link DOM element `<a>`
 * @param  {string} controlId   The control id to link to
 */
export function linkControl (linkEl, controlId) {
  var controlToFocus = wpApi.control(controlId);

  // be sure there is the control and update dynamic color message text
  if (controlToFocus) {
    if (linkEl) {
      linkEl.onclick = () => {
        focus(controlToFocus);
      };
    } else {
      focus(controlToFocus);
    }
  }
}

/**
 * Wrap WordPress control focus with some custom stuff
 *
 * @since  1.0.0
 * @memberof core.utils
 *
 * @param {WP_Customize_Control} control
 */
export function focus (control) {
  try {
    // try this so it become possible to use this function even
    // with WordPress native controls which don't have this method
    control._mount(true);

    // always disable search, it could be that we click on this
    // link from a search result try/catch because search is not
    // always enabled
    api.components.Search.disable();
  } catch(e) {}
  control.focus();
  control.container.addClass('kkcp-control-focused');
  setTimeout(function () {
    control.container.removeClass('kkcp-control-focused');
  }, 2000);
}

/**
 * Template
 *
 * Similar to WordPress one but using a JavaScript string directly instead of
 * a DOM id to pass the template content.
 *
 * @since  1.1.0
 * @memberof core.utils
 *
 * @param  {string} tpl  A template string
 * @return {function}    A function that lazily-compiles the template requested.
 */
export const template = _.memoize(function (tpl) {
  let compiled;

  return function ( data ) {
    compiled = compiled || _.template(tpl,  templateOptions);
    return compiled( data );
  };
})

/**
 * Template options
 *
 * Similar to WordPress one but using `{%` instead of `<#` for logic, more like
 * Jinja or Twig.
 *
 * @see  WordPress Core `wp-includes/js/wp-utils.js`.
 * @since  1.1.0
 * @memberof core.utils
 *
 * @return {Object}
 */
export const templateOptions = {
  // evaluate:    /{%([\s\S]+?)%}/g,
  evaluate:    /<#([\s\S]+?)#>/g,
  interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
  escape:      /\{\{([^\}]+?)\}\}(?!\})/g,
  variable:    'data'
}

const Utils = {
  _CP_URL,
  _CP_URL_IMAGES,
  _IMAGES_BASE_URL,
  _DOCS_BASE_URL,
  _isAbsoluteUrl,
  _cleanUrlFromMultipleSlashes,
  _getCleanUrl,
  _eachControl,
  _isThemeModsApi,
  _isOptionsApi,
  _getStylesheetById,
  _getRulesFromStylesheet,
  _getCssRulesContent,
  getImageUrl,
  getDocsUrl,
  linkControl,
  focus,
  template,
}

export default Utils
