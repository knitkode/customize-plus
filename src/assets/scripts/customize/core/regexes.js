/* jshint maxlen: 1000 */

/**
 * Regexes
 *
 * It might be that we need a regex that match of available words,
 * in that case it might be that we want to define the words in an
 * array (maybe coming from php?). So for array to regex conversion
 * do: `new RegExp(MY_VAR.join('|'), 'g')`. See {@link
 * http://stackoverflow.com/q/28280920/1938970 stackoverflow}.
 *
 */
var Regexes = {
  /**
   * Whitespaces global match
   *
   * To clean user input (most often when writing custom expressions)
   * so that it would later on be more easily parsable by our validation
   * regexes. Use this as follow: `string.replace(Regexes.whitespaces, '')`.
   *
   * @link http://stackoverflow.com/a/5963202/1938970
   *
   * @const
   * @type {RegExp}
   */
  whitespaces: /\s+/g,

  /**
   * Grab all variables (sanitized user input)
   *
   * It capture a group from each `@variable-name` found
   *
   * @const
   * @type {RegExp}
   */
  variables_match: /@([a-zA-Z-_0-9]+)/g,

  /**
   * Simple color function (raw user input)
   *
   * This just checks if the user input looks like a valid simple function
   * expression, so it's gentle with whitespace. It capture the number
   * (`amount`) but not to use it.
   *
   * @link http://regex101.com/r/wC5aO9/3
   *
   * @const
   * @type {RegExp}
   */
  colorSimpleFunction_test: /^\s*[a-z]+\(\s*@[a-zA-Z-_0-9]+\,\s*(0\.[0-9]*[1-9][0-9]*|100|[1-9]\d?|[1-9]\d?\.[0-9]+)%?\s*\)\s*$/,

  /**
   * Simple color function (sanitized user input)
   *
   * This works only after having stripped all whitespaces,
   * it capture three groups: 'functionName', varName', 'amount'
   *
   * @link http://regex101.com/r/nC7iA2/2
   *
   * @const
   * @type {RegExp}
   */
  colorSimpleFunction_match: /^([a-z]+)\(@([a-zA-Z-_0-9]+)\,(0\.[0-9]*[1-9][0-9]*|100|[1-9]\d?|[1-9]\d?\.[0-9]+)%?\)$/,

  /**
   * Simple variable (raw user input)
   *
   * This just checks if the user input looks like a single variable,
   * so it's gentle with whitespace.
   *
   * @link https://regex101.com/r/aP9mJ1/1
   *
   * @const
   * @type {RegExp}
   */
  simpleVariable_test: /^\s*@[a-zA-Z-_0-9]+\s*$/,

  /**
   * Simple variable (sanitized user input)
   *
   * This works only after having stripped all whitespaces,
   * it capture one group: the `varName'
   *
   * @link https://regex101.com/r/aO6fI9/2
   *
   * @const
   * @type {RegExp}
   */
  simpleVariable_match: /^@([a-zA-Z-_0-9]+)$/,

  /**
   * Variable (just grab a variable wherever it is)
   *
   * it capture one group: the `varName'
   *
   * @const
   * @type {RegExp}
   */
  variable_match: /@([a-zA-Z-_0-9]+)/,

  /**
   * Variable (just grab a variable wherever it is)
   *
   * it capture two groups: the `number` and the `unit` values
   *
   * @const
   * @type {RegExp}
   */
  // k6todo allow floats? \\
  sizeWithUnit: /^(\d+)(px|%|em|rem)$/,



  // k6todo unit tests on regex101.com...
  colorHex_test: /^#[0-9A-F]{6}$|^#[0-9A-F]{3}$/i,
  colorRgbaAlpha_match: /^rgba\(\d+,\d+,\d+,(0?\.[0-9]*[1-9][0-9]*|[01])\)$/,
  colorRgba_test: /^rgba\(\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(0?\.[0-9]*[1-9][0-9]*|[01])\s*\)$/
};

// export to public api
k6cp['Regexes'] = Regexes;