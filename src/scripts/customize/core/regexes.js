/**
 * @fileOverview A wrapper to contain all regexes used.
 * It might be that we need a regex that matches a list of words, in that case
 * we might want to define the words in an array (coming from php perhaps?).
 * So for array to regex conversion do:
 * ```
 * new RegExp(MY_VAR.join('|'), 'g')`
 * ```
 * See {@link http://stackoverflow.com/q/28280920/1938970 stackoverflow}.
 *
 * @module Regexes
 */
import { api } from './globals';

/**
 * Whitespaces global match
 *
 * To clean user input (most often when writing custom expressions)
 * so that it would later on be more easily parsable by our validation
 * regexes. Use this as follow: `string.replace(Regexes._whitespaces, '')`.
 *
 * {@link http://stackoverflow.com/a/5963202/1938970}
 *
 * @const
 * @type {RegExp}
 */
export const _whitespaces = /\s+/g;

/**
 * Extract unit, it returns the first matched, so the units are sorted by
 * popularity (approximately).
 *
 * @see http://www.w3schools.com/cssref/css_units.asp List of the css units
 * @const
 * @type {RegExp}
 */
export const _extractUnit = /(px|%|em|rem|vh|vw|vmin|vmax|cm|mm|in|pt|pc|ch|ex)/;

/**
 * Extract number from string (both integers or float)
 *
 * @see http://stackoverflow.com/a/17885985/1938970
 * @const
 * @type {RegExp}
 */
export const _extractNumber = /(\+|-)?((\d+(\.\d+)?)|(\.\d+))/;

/**
 * Detects if the shape of the string is that of a setting saved or to be
 * saved through the options API, e.g. `mytheme[a_setting_id]``
 *
 * @type {RegExp}
 */
export const _optionsApi = new RegExp(api.constants['OPTIONS_PREFIX'] + '\\[.*\\]');

/**
 * Helps to understand if a url is absolute or relative
 *
 * @const
 * @type {RegExp}
 */
export const _absoluteUrl = /^(?:[a-z]+:)?\/\//i;

/**
 * Multiple slashes
 *
 * @const
 * @type {RegExp}
 */
export const _multipleSlashes = /[a-z-A-Z-0-9_]{1}(\/\/+)/g;

/**
 * @alias core.Regexes
 * @description  Exposed module <a href="module-Regexes.html">Regexes</a>
 * @access package
 */
export default api.core.Regexes = {
  _whitespaces,
  _extractUnit,
  _extractNumber,
  _optionsApi,
  _absoluteUrl,
  _multipleSlashes,
}
