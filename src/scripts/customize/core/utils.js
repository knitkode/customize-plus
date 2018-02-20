/**
 * @fileOverview An helper class containing helper methods. This has its PHP
 * equivalent in `class-helper.php`
 *
 * @module Utils
 * @requires Regexes
 */
import document from 'document';
import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi, body } from './globals';
import Regexes from './regexes';

/**
 * Images base url
 *
 * @type {string}
 */
export const _IMAGES_BASE_URL = api.constants['IMAGES_BASE_URL'];

/**
 * Docs base url
 *
 * @type {string}
 */
export const _DOCS_BASE_URL = api.constants['DOCS_BASE_URL'];

/**
 * Is it an absolute URL?
 *
 * @see {@link http://stackoverflow.com/a/19709846/1938970}
 *
 * @param  {string}  url The URL to test
 * @return {boolean}     Whether is absolute or relative
 */
export function _isAbsoluteUrl (url) {
  return Regexes._absoluteUrl.test(url);
}

/**
 * Clean URL from multiple slashes
 *
 * Strips possible multiple slashes caused by the string concatenation or dev errors
 *
 * @param  {string} url
 * @return {string}
 */
export function _cleanUrlFromMultipleSlashes (url) {
  return url.replace(Regexes._multipleSlashes, '/');
}

/**
 * Get a clean URL
 *
 * If an absolute URL is passed we just strip multiple slashes,
 * if a relative URL is passed we also prepend the right base url.
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
 * @param {function} callback
 */
export function _eachControl (callback) {
  const wpApiControl = wpApi.control;

  for (var controlId in wpApi.settings.controls) {
    callback(wpApiControl(controlId));
  }
}

/**
 * Is the control's setting using the `theme_mods` API?
 *
 * @param  {string}  controlId The control id
 * @return {boolean}
 */
export function _isThemeModsApi (controlId) {
  return !Regexes._optionsApi.test(controlId);
}

/**
 * Is the control's setting using the `options` API?
 * Deduced by checking that the control id is structured as:
 * `themeprefix[setting-id]`
 *
 * @param  {string}  controlId The control id
 * @return {boolean}
 */
export function _isOptionsApi (controlId) {
  return Regexes._optionsApi.test(controlId);
}

/**
 * Get stylesheet by Node id
 *
 * @abstract
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
 * @abstract
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
 * @param  {string} url The image URL, relative or absolute
 * @return {string}     The absolute URL of the image
 */
export function getImageUrl (url) {
  return _getCleanUrl(url, 'img');
}

/**
 * Get docs url
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
 * @param {WP_Customize_Control} control
 */
export function focus (control) {
  try {
    // try this so it become possible to use this function even
    // with WordPress native controls which don't have this method
    control.inflate(true);

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
 * @alias core.Utils
 * @description  Exposed module <a href="module-Utils.html">Utils</a>
 * @access package
 */
export default api.core.Utils = {
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
}
