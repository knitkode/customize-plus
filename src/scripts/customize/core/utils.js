import strpos from 'locutus/php/strings/strpos';
import is_int from 'locutus/php/var/is_int';
import is_float from 'locutus/php/var/is_float'
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

/**
 * Extract number from value, returns 0 otherwise
 *
 * @since  1.0.0
 * @param  string         $value         The value from to extract from
 * @param  bool|null      $allowed_float Whether float numbers are allowed
 * @return int|float|null The extracted number or null if the value does not
 *                        contain any digit.
 */
export function extractNumber( $value, $allowed_float ) {
  let $number_extracted;

  if ( is_int( $value ) || ( is_float( $value ) && $allowed_float ) ) {
    return $value;
  }
  if ( $allowed_float ) {
    $number_extracted = parseFloat( $value ); // filter_var( $value, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION );
  } else {
    $number_extracted = parseInt( $value, 10 ); // filter_var( $value, FILTER_SANITIZE_NUMBER_INT );
  }
  if ( $number_extracted || 0 === $number_extracted ) {
    return $number_extracted;
  }
  return null;
}

/**
 * Extract unit (like `px`, `em`, `%`, etc.) from an array of allowed units
 *
 * @since  1.0.0
 * @param  string     $value          The value from to extract from
 * @param  null|array $allowed_units  An array of allowed units
 * @return string                     The first valid unit found.
 */
export function extractSizeUnit( $value, $allowed_units ) {
  if ( _.isArray( $allowed_units ) ) {
    for (let i = 0; i < $allowed_units.length; i++) {
      if ( strpos( $value, $allowed_units[i] ) ) {
        return $allowed_units[i];
      }
    }
    return $allowed_units[0] || '';
  }
  return '';
}

/**
 * Modulus
 *
 * @source https://stackoverflow.com/a/31711034
 * @param  {number} val
 * @param  {number} step
 * @return {number}
 */
export function modulus(val, step){
  let valDecCount = (val.toString().split('.')[1] || '').length;
  let stepDecCount = (step.toString().split('.')[1] || '').length;
  let decCount = valDecCount > stepDecCount? valDecCount : stepDecCount;
  let valInt = parseInt(val.toFixed(decCount).replace('.',''));
  let stepInt = parseInt(step.toFixed(decCount).replace('.',''));
  return (valInt % stepInt) / Math.pow(10, decCount);
}

export const Utils = {
  normalizeFontFamily,
  stripHTML,
  hasHTML,
  extractSizeUnit,
  extractNumber,
  modulus,
}

// export to public API
export default api.core.Utils = new UtilsClass();
