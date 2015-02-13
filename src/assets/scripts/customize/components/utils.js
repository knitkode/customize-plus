/* global less, Regexes */
/* exported: Utils */

/**
 * Utils
 *
 * @requires Regexes
 */
var Utils = (function () {

  /**
   * [getLessTestInput description]
   * @see  php k6_get_less_test_input (same implementation) // k6todo but this in js doesn't work!... \\
   * @param  {[type]} value             [description]
   * @param  {[type]} preprocessorInput [description]
   * @return {[type]}                   [description]
   */
  function getLessTestInput( value, preprocessorInput ) {
    var match;
    var extractedVarNames = [];
    while (match = Regexes.variables_match.exec(controlValue)) {
      extractedVarNames.push(match[1]);
    }
    if (extractedVarNames.length) {
      for (var i = 0, l = extractedVarNames.length; i < l; i++) {
        var varName = extractedVarNames[i];
        var varValue = api(varName);
        if (varValue) {
          preprocessorInput += '@' + varName + ':' + varValue + ';';
          _varNamesWalker(varValue);
        }
        return getLessTestInput( value, preprocessorInput );
      }
    } else {
      return preprocessorInput + '@v:' + value + ';.v{v:@v}';
    }
  }

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
    },
    /**
     * Check if an input get correctly parsed by less.js
     * It uses recursivity to gets all matched variable
     * names `@var-name` in the given input string (a control setting value),
     * and for each of them append the variable `name: value` pair to the less
     * string which will be parsed by the compiler to test the validity of
     * the user input.
     *
     * for less uncompressed output, use: `/.v[\s\S]+\sv:(.+);/`
     * ```.v {
     *  v: #b3b3b3;
     * }```
     *
     * for compressed output, use: `/.v{v:(.+);/`
     * ```
     * .v{v:#b3b3b3;}
     * ```
     *
     * @param  {string}  input [description]
     * @return {Boolean}       [description]
     */
    compileTest: function (input, callbackSuccess, callbackFail) {
      // be sure to have less available
      if (!less) {
        return;
      }
      // var t0 = performance.now(); // k6debug-perf \\
      var preprocessorInput = '';
      /**
       * Get all matched variable names `@var-name`
       * in the input string, and for each of them
       * call the `_getControlValue` with the
       * var name / control ID as argument.
       *
       * @link http://stackoverflow.com/a/13554264/1938970
       * @param  {String} input
       */
      var _varNamesWalker = function (controlValue) {
        var match;
        var extractedVarNames = [];
        while (match = Regexes.variables_match.exec(controlValue)) {
          extractedVarNames.push(match[1]);
        }
        if (extractedVarNames.length) {
          for (var i = 0, l = extractedVarNames.length; i < l; i++) {
            _getControlValue(extractedVarNames[i]);
          }
        }
      };
      var _getControlValue = function (controlID) {
        var control = api.control(controlID);
        if (control) {
          var controlValue = control.setting();
          preprocessorInput += '@' + controlID + ':' + controlValue + ';';
          _varNamesWalker(controlValue);
        }
      };

      _varNamesWalker(input);

      preprocessorInput += '@v:' + input + ';.v{v:@v}';
      // console.log('Less test:', input, preprocessorInput); // k6debug \\

      // we use callbacks instead of promises because it's faster
      // see {@link http://jsperf.com/promise-vs-callback/8, jsperf}
      less.render(preprocessorInput, function (info, output) {
        if (output) {
          var CSSvalue = output.css.match(/.v[\s\S]+\sv:\s*(.+);/)[1]; // k6todo extract this regex in the right js file, maybe improve it \\
          callbackSuccess(CSSvalue);
          // console.log('Less test Success:', input, CSSvalue, preprocessorInput); // k6debug \\
          // console.log('Call to compileTest took ' + (performance.now() - t0) + ' ms.') // k6debug-perf \\
        } else {
          if (callbackFail) {
            callbackFail(info.message); // k6todo error handling \\
          }
          // console.log('Less test Error:', info.message, info); // k6debug \\
          // console.log('Call to compileTest took ' + (performance.now() - t0) + ' ms.') // k6debug-perf \\
        }
      });
    }
  };
})();