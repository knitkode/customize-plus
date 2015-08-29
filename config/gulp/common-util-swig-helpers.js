/**
 * SWIG filter: phpArray
 * Transform a javascript array
 * in a simple php array with the right syntax and the WordPress coding standard
 *
 * @param  {Array} input
 * @return {String}
 */
module.exports.phpArray = function (input) {
  if (!input instanceof Array) {
    return input;
  }
  return JSON.stringify(input)
    .replace(/"/g, '\'') // replace double quotes with single quotes
    .replace(/,/g, ', ') // put a space after the comma
    .replace('[', 'array( ') // replace the brackets with the php array syntax (open)
    .replace(']', ' )'); // replace the brackets with the php array syntax (close)
};


/**
 * SWIG filter: phpQuotes
 * I normalize the quotes pf the values coming from the options' jsons
 * Also add the WordPress i18n syntax for certain `type` of `input`.
 *
 * @param  {mixed} input
 * @param  {String} type  The type of input
 * @return {String}       The 'php ready' input
 */
module.exports.phpQuotes = function (input, type) {
  var toTranslate = [
    'label',
    'sublabel',
    'description',
    'title',
    'text',
    'data-tip_title',
    'tip_title',
    'data-tip_text',
    'tip_text'
  ];
  var translatable = (typeof type != 'undefined') ? toTranslate.indexOf(type.toString()) !== -1 : false;

  // if it is a number and it's not a label or so
  var isNumeric = /^[-+]?[0-9]+$/;
  if (isNumeric.test(input) && !translatable) {
    return input; // return number without quotes

  // if it is a string
  } else if (typeof input === 'string') {

    // return i18n string for WordPress
    if (translatable) {
      return '__( \'' + input + '\', \'pkgTextdomain\' )';
    }

    // return unquoted php flagged string
    if (input.substring(0, 5) === '@php ') {
      return input.replace('@php ', '');

    // return double quoted "'value'"
    } else if (input.indexOf("'") !== -1) {
      return '"' + input + '"';

    // return single quoted 'value'
    } else {
      return '\'' + input + '\'';
    }

  // otherwise just return the input
  } else {
    return input;
  }
};
