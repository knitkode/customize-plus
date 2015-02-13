/* global Regexes, Utils */
/* exported: Expr */

/**
 * Defines an expression input field generic beahvior.
 *
 * @private
 * @constructor
 * @requires Regexes, Utils
 * @param {!ExprOptions} options
 * @param {!HTMLElement} container
 * @return {HTMLElement} The expresion `<input>` element
 */
function Expr (options, container) {
  this.availableVars = options.vars;
  this.availableVarsLookup = options.varsLookup;
  this.availableFunctions = options.functions;
  this.onChange = options.onChange;
  this.onSet = options.onSet;
  this.input = container.getElementsByClassName('k6-expr-input')[0];
  this.inputBtn = container.getElementsByClassName('k6-expr-btn')[0];
  this.inputFeedback = container.getElementsByClassName('k6-expr-feedback')[0];
  this.regexVarName = Regexes.variables_match; // k6todo \\
  this.compileTest = Utils.compileTest;

  this._init(options.value);
  return this.input;
}

/**
 * Bind input field with `atwho` jquery library
 * different triggers are used to autocomplete
 * variable names and function names
 *
 * To manage AtWho.js see the docs
 * {@link https://github.com/ichord/At.js/wiki/Base-Document#settings (Settings)}
 * {@link https://github.com/ichord/At.js/wiki/Callbacks (Callbacks)}
 */
Expr.prototype._init = function (initialValue) {

  this.input.value = initialValue;

  var $input = $(this.input);

  for (var i = this.availableFunctions.length; i--;) {
    $input.atwho( this._getAtwhoOptsForFunction( this.availableFunctions[i] ) );
  }
  $input
    .atwho({
      at: '@',
      data: this._getVarWithValues(),
      limit: 30,
      maxLen: 8,
      startWithSpace: false,
      displayTpl: '<li>${name} <small>${val}</small></li>',
      suffix: ''
      // callbacks: { // k6todo maybe do a smarter matcher for our specific use
      //  case (especially here with vars names) \\
      //   matcher: function (flag, subtext) {}
      // }
    })
    .atwho({
      at: 'fun',
      data: this.availableFunctions,
      limit: 30,
      maxLen: 4,
      startWithSpace: false,
      insertTpl: '${name}',
      displayTpl: '<li>${name} <small>function</small></li>',
      suffix: '(',
      hideWithoutSuffix: true,
      beforeReposition: function (offset) {
        offset.top += 100;
        return offset;
      }
    })
    // bind input on ready
    .on('change keyup paste', function (event) {
      var input = event.target;
      this._liveValidation(input.value);
      if (this.onChange) {
        this.onChange(input);
      }
      var keyCode = event.keyCode;
      // detect `Ctrl+Enter` key @link http://stackoverflow.com/a/9343095/1938970
      if ((keyCode === 10 || keyCode === 13) && event.ctrlKey) {
        this._maybeSetValue();
      }
    }.bind(this));

  // bind apply input btn on ready
  this.inputBtn.onclick = this._maybeSetValue.bind(this);
};

/**
 * Given a less.js function name return
 * an Object containing the needed properties
 * for `atwho.js`.
 *
 * @param  {string} functionName The name of the less.js function
 * @return {Object}              Option for `atwho.js`
 */
Expr.prototype._getAtwhoOptsForFunction = function (functionName) {
  return {
    at: functionName.charAt(0),
    data: [functionName],
    insertTpl: '${name}',
    displayTpl: '<li>${name} <small>function</small></li>',
    maxLen: 4,
    startWithSpace: false,
    suffix: '(',
    hideWithoutSuffix: true
  };
};

/**
 * Trasform an array of variable names in an object
 * grabbing the current value for each controlID / variable name.
 *
 * @return {Object} A simple object where the key is the control ID
 *                  (same as variable name) and the current setting value.
 */
Expr.prototype._getVarWithValues = function () {
  var dataVarNames = [];
  for (var i = 0, l = this.availableVars.length; i < l; i++) {
    var varName = this.availableVars[i];
    var control = api.control(varName);
    if (control) {
      dataVarNames.push({
        name: varName,
        val: control.setting()
      });
    }
  }
  return dataVarNames;
};

/**
 * If the current input value pass the `compileTest`
 * then set the value with the WordPress api `setting.set()`
 *
 */
Expr.prototype._maybeSetValue = function () {
  var self = this;
  var preprocessorInput = self.input.value.trim();
  self.compileTest(preprocessorInput, function () {
    self.onSet(preprocessorInput);
    self._liveValidationSuccess();
  }, self._liveValidationError);
};

/**
 * Show error on input.
 * Responsible both for style change and message displayment.
 *
 * @link how to use style prop: http://moduscreate.com/efficient-dom-and-css/
 * @param {string} message The error message
 */
Expr.prototype._liveValidationError = function (message) {
  this.input.style.cssText = 'border-color: #c00; background: #fff9f9; box-shadow: 0 0 4px #c00;';
  this.inputFeedback.style.color = '#c00';
  if (message) {
    this.inputFeedback.innerHTML = message;
  }
  this.inputBtn.disabled = true;
};

/**
 * Remove error style and message.
 * Do not show anything special for valid input.
 *
 */
Expr.prototype._liveValidationSuccess = function () {
  this.input.removeAttribute('style');
  this.inputFeedback.removeAttribute('style');
  this.inputFeedback.innerHTML = 'Use the button or Ctrl+Enter to apply.';
  this.inputBtn.disabled = false;
};

/**
 * Check if variable names contained in the
 * expression are among the ones available.
 *
 * @param  {string} value The input text raw value
 * @return {boolean}      Wether all the variables contained are valid (they exist)
 */
Expr.prototype._areValidVarNames = function (value) {
  var match;
  var extractedVarNames = [];
  while (match = this.regexVarName.exec(value)) {
    extractedVarNames.push(match[1]);
  }
  if (extractedVarNames.length) {
    for (var i = 0, l = extractedVarNames.length; i < l; i++) {
      if (!this.availableVarsLookup[extractedVarNames[i]]) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Execute this while the user is typing in the
 * expression input field. Does sime live validation:
 * - check that the number of brackets matches.
 * - check that variable names used are valid
 *   - if that's fine try a heavier validation with the preprocessor
 *
 * @param  {string} value The raw value of the input text
 */
Expr.prototype._liveValidation = function (value) {
  var openBrackets = value.match(/\(/g) || [];
  var closeBrackets = value.match(/\)/g) || [];
  var areValidBrackets = openBrackets.length === closeBrackets.length;
  var areValidVariables = this._areValidVarNames(value);
  if (areValidBrackets && areValidVariables) {
    this._liveValidationSuccess();
  } else {
    var errorMessages = [];
    if (!areValidBrackets) {
      errorMessages.push('Unmatching brackets.');
    }
    if (!areValidVariables) {
      errorMessages.push('Invalid variable name.');
    }
    this._liveValidationError(errorMessages.join(' '));
  }
};
