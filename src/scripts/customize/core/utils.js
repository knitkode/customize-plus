import { api } from './globals';
import UtilsClass from './utils-class';

/**
 * Normalize font family.
 *
 * Be sure that a font family is wrapped in quote, good for consistency
 *
 * @since  1.0.0
 * @param  string|array $value
 * @return string
 */
export function normalizeFontFamily( $value ) {
  // remove extra quotes, add always quotes and trim
  $value = $value.replace(/'/g, '').replace(/"/g, '');
  return `'${$value.trim()}'`;
}

/**
 * Strip HTML from value
 * {@link http://stackoverflow.com/q/5002111/1938970}
 *
 * @static
 * @param  {string} value
 * @return {string}
 */
export function stripHTML (value) {
  return $(document.createElement('div')).html(value).text();
}

/**
 * Does string value contains HTML?
 *
 * This is just to warn the user, actual sanitization is done backend side.
 *
 * @see https://stackoverflow.com/a/15458987
 * @param  {string}  value
 * @return {boolean}
 */
export function hasHTML (value) {
  return /<[a-z][\s\S]*>/i.test(value);
}

export const Utils = {
  normalizeFontFamily,
  stripHTML,
  hasHTML,
}

// export to public API
export default api.core.Utils = new UtilsClass();
