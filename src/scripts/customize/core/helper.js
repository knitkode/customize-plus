import strpos from 'locutus/php/strings/strpos';
import is_int from 'locutus/php/var/is_int';
import is_float from 'locutus/php/var/is_float'
import ValidatorColor from './validator-color';

/**
 * Is setting value (`control.setting()`) empty?
 *
 * Used to check if required control's settings have instead an empty value
 *
 * @see php class method `KKcp_Validate::is_empty()`
 * @static
 * @param  {string}  value
 * @return {boolean}
 */
export function isEmpty (value) {
  // first try to compare it to empty primitives
  if (value === null || value === undefined || value === '') {
    return true;
  } else {
    // if it's a jsonized value try to parse it
    try {
      value = JSON.parse(value);
    } catch(e) {}

    // and then see if we have an empty array or an empty object
    if ((_.isArray(value) || _.isObject(value)) && _.isEmpty(value)) {
      return true;
    }

    return false;
  }
}

/**
 * Is HEX color
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 *
 * @since  1.0.0
 *
 * @param  string $value  The value value to check
 * @return boolean
 */
export const isHex = ValidatorColor.hex;

/**
 * Is RGB color
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 *
 * @since  1.0.0
 *
 * @param  string $value  The value value to check
 * @return boolean
 */
export const isRgb = ValidatorColor.rgb;

/**
 * Is RGBA color
 *
 * It needs a value cleaned of all whitespaces (sanitized)
 *
 * @since  1.0.0
 *
 * @param  string $value  The value value to check
 * @return boolean
 */
export const isRgba = ValidatorColor.rgba;

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
  $value = $value.replace(/'/g, '').replace(/"/g, '');
  return `'${$value.trim()}'`;
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

/**
 * Is Multiple of
 *
 * Take a look at the {@link http://stackoverflow.com/q/12429362/1938970
 * stackoverflow question} about this topic. This solution is an ok
 * compromise. We use `Math.abs` to convert negative number to positive
 * otherwise the minor comparison would always return true for negative
 * numbers.
 *
 * @unused This could be a valid alternative to the above `modulus` function.
 * Not that unlike `modulus` the return value here is a boolean.
 *
 * @param  {string}  val
 * @param  {string}  step
 * @return {boolean}
 */
export function isMultipleOf (val, step) {
  var a = Math.abs(val);
  var b = Math.abs(step);
  var result = Math.round( Math.round(a * 100000) % Math.round(b * 100000) ) / 100000;
  return result < 1e-5;
}

/**
 * To Boolean
 * '0' or '1' to boolean
 *
 * @static
 * @param  {string|number} value
 * @return {boolean}
 */
export function numberToBoolean (value) {
  return typeof value === 'boolean' ? value : !!parseInt(value, 10);
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
 * Is HTML?
 *
 * It tries to use the DOMParser object (see Browser compatibility table
 * [here](mzl.la/2kh7HEl)), otherwise it just.
 * Solution inspired by this [stackerflow answer](http://bit.ly/2k6uFLI)
 *
 * // @@unused \\
 * @param  {string}  str
 * @return {Boolean}
 */
export function isHTML (str) {
  if (window.DOMParser) {
    try {
      var doc = new window.DOMParser().parseFromString(str, 'text/html');
      return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    } catch (e) {}
  } else {
    return false;
  }
}

/**
 * Exports the `Helper` object
 */
export default {
  isEmpty,
  isHex,
  isRgb,
  isRgba,
  normalizeFontFamily,
  extractSizeUnit,
  extractNumber,
  modulus,
  // These don't have a PHP equivalent in the KKcp_Helper class:
  numberToBoolean,
  stripHTML,
  hasHTML,
}
