import { api } from './globals';
/* jshint maxlen: 1000 */

/**
 * Regexes
 *
 * @class api.core.Regexes
 *
 * It might be that we need a regex that match of available words,
 * in that case it might be that we want to define the words in an
 * array (maybe coming from php?). So for array to regex conversion
 * do: `new RegExp(MY_VAR.join('|'), 'g')`. See {@link
 * http://stackoverflow.com/q/28280920/1938970 stackoverflow}.
 */
const Regexes = {
  /**
   * Whitespaces global match
   *
   * To clean user input (most often when writing custom expressions)
   * so that it would later on be more easily parsable by our validation
   * regexes. Use this as follow: `string.replace(Regexes.whitespaces, '')`.
   *
   * {@link http://stackoverflow.com/a/5963202/1938970}
   *
   * @const
   * @type {RegExp}
   */
  _whitespaces: /\s+/g,
  /**
   * Extract unit, it returns the first matched, so the units are sorted by
   * popularity (approximately).
   *
   * @see http://www.w3schools.com/cssref/css_units.asp List of the css units
   * @const
   * @type {RegExp}
   */
  _extractUnit: /(px|%|em|rem|vh|vw|vmin|vmax|cm|mm|in|pt|pc|ch|ex)/,
  /**
   * Extract number from string (both integers or float)
   *
   * @see http://stackoverflow.com/a/17885985/1938970
   * @const
   * @type {RegExp}
   */
  _extractNumber: /(\+|-)?((\d+(\.\d+)?)|(\.\d+))/,
  /**
   * Detects if the shape of the string is that of a setting saved or to be
   * saved through the options API, e.g. `mytheme[a_setting_id]``
   *
   * @type {RegExp}
   */
  _optionsApi: new RegExp(api.constants['OPTIONS_PREFIX'] + '\\[.*\\]'),
  /**
   * Helps to understand if a url is absolute or relative
   *
   * @@todo test
   * @const
   * @type {RegExp}
   */
  _absoluteUrl: /^(?:[a-z]+:)?\/\//i,
  /**
   * Multiple slashes
   *
   * @@todo test
   * @const
   * @type {RegExp}
   */
  _multipleSlashes: /[a-z-A-Z-0-9_]{1}(\/\/+)/g
};

// export to public API
export default api.core.Regexes = Regexes;
