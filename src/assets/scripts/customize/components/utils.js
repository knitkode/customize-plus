/**
 * Utils
 *
 * @requires Regexes
 */
var Utils = (function () {

  // @public API
  return {
    /**
     * To Boolean
     * '0' or '1' to boolean
     *
     * @param  {strin|number} value
     * @return {boolean}
     */
    toBoolean: function (value) {
      return typeof value === 'boolean' ? value : !!parseInt(value, 10);
    }
  };
})();

// export to public api
K6['Utils'] = Utils;