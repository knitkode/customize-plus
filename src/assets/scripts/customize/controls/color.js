/* global Color, ControlBase, Regexes, Preprocessor, Utils, Expr, Nets, Search */

/**
 * Control Color class
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires Regexes, Preprocessor, Utils, Expr, Nets, Search
 */
var ControlColor = ControlBase.extend({
  /**
   * [_setExState description]
   * update css changing data attribute value
   *
   * @private
   */
  _setExState: function (state) {
    var newState = (this.params.exState === state) ? '' : state;
    var $body = $(body);
    var _close = function () {
      this.params.exState = '';
      this.wrapper.setAttribute('data-k6-color-expanded', '');
    }.bind(this);
    // force close custom color area if it doesn't automatically
    // triggering a click on it's toggle. This is needed for instance
    // when click the 'transparent' toggle while the custom color area is open
    if (state === 'custom'
      && this.params.exState === 'custom'
      && this.$btnCustom.hasClass('wp-picker-open')) { // k6wptight-selector \\
      this.$btnCustom.trigger('click');
    }
    // system to be sure that clicks outside the current control
    // close the others currently open dynamic colors areas in the page.
    // System inspired by the WordPress one in color-picker.js#L128
    if (newState) {
      $body.trigger('click.k6.color').on('click.k6.color', _close);
      if (newState === 'dynamic') {
        $body.trigger('click.wpcolorpicker'); // k6wptight-js color-picker.js#L128 \\
      }
    } else {
      $body.off('click.k6.color', _close);
    }
    this.params.exState = newState;
    // update css thanks to this change on data attribute
    this.wrapper.setAttribute('data-k6-color-expanded', newState);
  },
  /**
   * Set Color retrievement mode
   *
   * @private
   * @param {string}  mode          'Custom' or 'Dynamic' mode
   * @param {boolean} isTransparent Whether we are setting a mode with
   *                                Transparent 'submode'. Because transparent
   *                                is actually a 'Custom' color, but in terms
   *                                of UI and UX is managed slightly different.
   */
  _setMode: function (mode, isTransparent) {
    var params = this.params;
    var isRendered = this.rendered;

    // set transparent UI mode
    if (isTransparent) {
      params.transparent = true;
      if (isRendered) {
        this.wrapper.setAttribute('data-k6-transparent', '');
      }
    // remove transparent UI mode
    } else {
      params.transparent = false;
      if (isRendered) {
        this.wrapper.removeAttribute('data-k6-transparent');
      }
    }

    // Custom mode
    if (mode === 'custom') {
      // reset var name object property
      params.varName = '';
    // Dynamic mode
    } else if (mode === 'dynamic') {
      if (isRendered) {
        // update dynamic color message text
        this.msg.innerHTML = params.varName;
        // and bind link
        this._bindInfoLink();
      }
    }

    // manage nets always
    this._manageNets();
    // set the mode property
    params.mode = mode;

    // update css thanks to this change on data attribute
    if (isRendered) {
      this.wrapper.setAttribute('data-k6-color-mode', mode);
    }
  },
  /**
   * Manage nets
   *
   * @private
   */
  _manageNets: function () {
    var thisControlID = this.id;
    var relatedControlID = this.params.varName;
    Nets.clean(thisControlID);
    if (relatedControlID) {
      Nets.populateOn(thisControlID, relatedControlID);
      Nets.populateOff(_.union(this.params.netOff, [thisControlID]), relatedControlID);
    }
  },
  /**
   * Bind the link to focus the control
   * of the dependent variable name / control id
   *
   * @private
   */
  _bindInfoLink: function () {
    var controlToFocus = api.control(this.params.varName);
    // be sure there is the control and update dynamic color message text
    if (controlToFocus) {
      this.msg.onclick = function () {
        controlToFocus.inflate(true);
        // always deactivate search, it could be that
        // we click on this link from a search result
        try {
          Search.deactivate();
        } catch (e) {}
        controlToFocus.focus(); // k6doubt focus or expand ? \\
      };
    }
  },
  /**
   * Add alpha support
   * with slider and number input
   *
   * @private
   */
  _addAlpha: function (colorOnReady) {
    Color.prototype.toString = function (ignoreAlpha) { // k6wptght-js_dep Color.js \\
      if (this._alpha < 1 && !ignoreAlpha) {
        return this.toCSS('rgba', this._alpha).replace(Regexes.whitespaces, '');
      }
      var hex = parseInt(this._color, 10).toString(16);
      if (this.error) {
        return '';
      }
      if (hex.length < 6) {
        for (var i = 6 - hex.length - 1; i >= 0; i--) {
          hex = '0' + hex;
        }
      }
      return '#' + hex;
    };
    var self = this;
    // add alpha slider template
    self.container.find('.wp-picker-container').append(
      '<div class="k6-alpha">' +
        '<div class="k6-alpha-slider"></div>' +
        '<input type="number" min="0.01" max="1" step="0.01" class="k6-alpha-input">' +
      '</div>'
    );
    var container = this._container;
    var $picker = this.$picker;
    var picker = $picker[0];
    var iris = $picker.data('a8cIris');
    var pickerToggler = container.getElementsByClassName('wp-color-result')[0];
    var pickerInputText = container.getElementsByClassName('color-picker-hex')[0];
    var alphaInput = container.getElementsByClassName('k6-alpha-input')[0];
    var alphaSlider = container.getElementsByClassName('k6-alpha-slider')[0];
    var $alphaSlider = $(alphaSlider);
    /**
     * [_getColorAlpha description]
     *
     * @param  {string} colorString A color string.
     * @return {string|number} The alpha value of the color or `1` as a fallback.
     */
    var _getColorAlpha = function (colorString) {
      var matchedAlphaValue = Regexes.colorRgbaAlpha_match.exec(colorString);
      return matchedAlphaValue ? matchedAlphaValue[1] : 1;
    };
    var _onAlphaChange = function (alpha) {
      // update iris color picker (bypass WordPress wrapper around it)
      iris._color._alpha = alpha;
      var newColor = iris._color.toString();
      // update picker style and picker input
      _updatePicker(newColor);
      // set mode and setting
      self._setMode('custom');
      self._apply(newColor, 'picker');
    };
    // set the alpha slider and alpha input values
    var _setAlpha = function (alphaValid, color) {
      var alpha = alphaValid || _getColorAlpha(color);
      $alphaSlider.slider('value', alpha);
      alphaInput.value = alpha;
    };
    // update picker toggle color and input text
    var _updatePicker = function (stringValue) {
      pickerToggler.style.backgroundColor = stringValue;
      picker.value = stringValue.replace(Regexes.whitespaces, '');
    };
    var alphaOnReady = _getColorAlpha(this.setting());

    // set bg color of slider on ready
    alphaSlider.style.backgroundColor = colorOnReady;
    alphaInput.value = alphaOnReady;

    // change some picker stuff
    $picker.wpColorPicker({
      change: function (event, ui) {
        // if the picker changes while the custom mode is expanded means that
        // the user has changed manually the color, unfortunately
        // for now we haven't found a better way to differentiate this `change`
        // callback between a manual change (user click/drag) and a programmatic
        // one through code.
        if (self.params.exState === 'custom') {
          var newColor = ui.color.toString();
          alphaSlider.style.backgroundColor = ui.color.toString(true);
          _updatePicker(newColor);
          self._setMode('custom');
          self._apply(newColor, 'picker');
        }
      }
    });

    // bind the text input of the color picker
    $(pickerInputText).on('keyup paste change', function () {
      var value = this.value;
      try {
        // try to extract and set alpha from input value only if it starts with `r`
        if (value[0] === 'r') {
          _setAlpha(null, value);
        }
      } catch (err) {}
    });

    // on input change update slider
    alphaInput.onchange = function () {
      $alphaSlider.slider('value', this.value);
      _onAlphaChange(this.value);
    };

    // init slider for alpha channel
    $alphaSlider.slider({
      slide: function(event, ui) {
        alphaInput.value = ui.value;
        _onAlphaChange(ui.value);
      },
      value: alphaOnReady,
      range: 'max',
      step: 0.01,
      min: 0.01,
      max: 1.01
    });
  },
  /**
   * Validate
   *
   * It could be good here to do some validation but we can't use the
   * function `Utils.compileTest` here because it's async, and this method
   * because of the way the WordPress API is done must be synchronous
   * instead. So we just be sure that the value is a string.
   *
   * @param {*} value The value to validate.
   * @return {?string} Null or the validated control value.
   */
  _validate: function (value) {
    return typeof value === 'string' ? value : null;
  },
  /**
   * On initialization:
   * add custom validation function overriding the empty function from WP API
   * add rgba validation if alpha is allowed
   *
   * @override
   */
  onInit: function () {
    var params = this.params;
    // first set some common defaults, this could be done through
    // the php Color Control class in the `add_to_json` method, but in
    // this way we save bytes on the huge `_wpCustomizeSettings` JSON
    params.exState = '';
    params.netOn = [];
    // in the netOff put the current control id, it can't be dynamic on itself...
    params.netOff = [this.id];

    // build nets immediately on intialization
    api.bind('ready', function () {
      // but we need to get the instance of the dependendant variable'
      // control to bind the `focus()` action on the small link:
      // 'This value depend on: @var' same for the nets, therefore we need
      // to access control instances. Let's bind on api ready then.
      if (params.mode === 'dynamic') {
        this._manageNets();
      }
    }.bind(this));

    this.setting.validate = this._validate.bind(this);

    // bind setting change to pass value on apply value
    // if we are programmatically changing the control value
    // for instance through js (during import, debugging, etc.)
    this.setting.bind(function (value) {
      if (value !== this.inputExpr.value) {
        this._apply(value, 'api'); // k6todo \\
      }
    }.bind(this));
  },
  /**
   * On deflate
   *
   * Destroy `atwho` instances if any, and `selectize` instance.
   *
   * @override
   */
  onDeflate: function () {
    if (this.params.expr) {
      $(this.inputExpr).atwho('destroy');
    }
    this.inputVar.selectize.destroy();
  },
  /**
   * On ready
   *
   * @override
   */
  ready: function () {
    var self = this;
    var params = self.params;
    var container = self._container;
    var btnDynamic = container.getElementsByClassName('k6-color-dynamic')[0];
    var btnTransparent = container.getElementsByClassName('k6-color-transparent')[0];
    var inputVar = container.getElementsByClassName('k6-color-var-select')[0];
    var inputFunction = container.getElementsByClassName('k6-color-function-select')[0];
    var inputAmount = container.getElementsByClassName('k6-color-amount-input')[0];
    var inputExpr = new Expr({
      vars: Preprocessor.varsColor,
      varsLookup: Preprocessor.varsColorLookup,
      functions: Preprocessor.functionsColor,
      value: self.setting(),
      // When the expression value change on user input read the
      // typed value and update accordingly the simple function fields.
      onChange: function (input) {
        self._updateUIsimpleDynamic(input.value);
      },
      // Bind the button to apply the current expression
      onSet: function (value) {
        self.params.expr = value;
        self._apply(value, 'expr');
      }
    }, container);


    /**
     * [_getSimplifiedExpr description]
     * @return {[type]} [description]
     */
    var _getSimplifiedExpr = function () {
      if (params.functionName && params.amount && params.varName) {
        return params.functionName + '(@' + params.varName + ', ' + params.amount + '%)';
      } else if (params.varName) {
        return '@' + params.varName;
      } else {
        return params.expr;
      }
    };

    /**
     * Prevent any clicks inside this widget from leaking
     * to the top and closing it
     *
     */
    self.container.on('click.k6.color', function (event) {
      event.stopPropagation();
    });

    /**
     * Set elements as control properties
     *
     */
    /** @type {HTMLelement} */
    self.wrapper = container.getElementsByClassName('k6-color')[0];
    /** @type {HTMLelement} */
    self.msg = container.getElementsByClassName('k6-color-message')[0];
    /** @type {jQuery} */
    self.$picker = self.container.find('.color-picker-hex');
    /** @type {HTMLelement} */
    self.inputExpr = inputExpr;
    /** @type {HTMLelement} */
    self.inputVar = inputVar;
    /** @type {HTMLelement} */
    self.inputFunction = inputFunction;
    /** @type {HTMLelement} */
    self.inputAmount = inputAmount;

    /**
     * Set mode immediately
     *
     */
    self._setMode(params.mode, params.transparent);

    /**
     * Init selectize on variable name `select`
     *
     */
    var availableColorVars = _.difference(Preprocessor.varsColor, this.params.netOff); // k6wptight-dep_js underscore \\

    $(inputVar).selectize({
      labelField: 'id',
      valueField: 'id',
      sortField: 'id',
      searchField: 'id',
      options: availableColorVars.map(function (variableID) {
        return { id: variableID };
      }),
      render: {
        option: function (item, escape) {
          var control = api.control(item.id);
          if (control) {
            return '<div class="k6-color-varoption" style="border-color:' + escape(control.params.valueCSS)+ '">' +
              escape(control.params.label || item.id) + '</div>';
          }
        }
      },
    });

    /**
     * Apply current expression value
     * to 'simple dynamic' fields.
     *
     */
    self._updateUIsimpleDynamic(_getSimplifiedExpr());

    /**
     * Bind on change of the variable select
     *
     */
    inputVar.onchange = function () {
      var varName = this.value;
      self.params.varName = varName;
      if (varName) {
        self._apply(_getSimplifiedExpr(), 'dynamic');
      // this `else` happens when `None` is selected
      } else {
        self._setMode('custom');
      }
    };

    /**
     * Bind on change of the function select
     *
     */
    inputFunction.onchange = function () {
      var functionName = this.value;
      self.params.functionName = functionName;
      self._apply(_getSimplifiedExpr(), 'dynamic');

      // // make the first functionName `<select>` `<option>`
      // // (with empty value and "None" text) look like a placeholder
      // // a bit like selectize (but they do it with DOM manipulation)
      // if (functionName) {
      //   inputFunction.style.color = '#ccc';
      // } else {
      //   inputFunction.style.color = '';
      // }
    };

    /**
     * Bind on change of the amount select
     *
     */
    var _onAmountChange = function () {
      self.params.amount = this.value;
      self._apply(_getSimplifiedExpr(), 'dynamic');
    };
    inputAmount.onchange = _onAmountChange;
    inputAmount.onkeyup = _onAmountChange;

    /**
     * Bind Color Dynamic button
     *
     */
    btnDynamic.onclick = function () {
      self._setExState('dynamic');
    };

    /**
     * Bind transparent button
     *
     */
    btnTransparent.onclick = function() {
      // always close the picker or the dynamic area
      self._setExState(self.params.exState);
      if (!self.params.transparent) {
        self._apply('transparent');
        // change mode to custom if needed
        if (self.params.mode === 'dynamic') {
          self._setMode('custom');
        }
      }
    };

    /**
     * On API ready
     *
     */
    if (apiIsReady) {
      self.onAPIready();
    } else {
      api.bind('ready', self.onAPIready.bind(self));
    }
  },
  /**
   * On API ready
   * we need to wait the api to be ready because for the following
   * functions we need to have all the controls ready,
   * we retrieve data from them
   *
   */
  onAPIready: function () {
    // on load of this control
    // we need to get the instance of the dependendant variable'
    // control to bind the `focus()` action on the small link:
    // 'This value depend on: @var' same for the nets, we need
    // to access control instances.
    if (this.params.mode === 'dynamic') {
      this._bindInfoLink();
    }

    /**
     * If we have a color expression (simple or complex doesn't matter)
     * we need to quickly calculate the color to pass it to the picker
     * for instance.
     *
     */
    if (this.params.expr) {
      Utils.compileTest(this.setting(), this._initPicker.bind(this));
    } else {
      this._initPicker(this.setting());
    }
  },
  /**
   * [_initPicker description]
   * @param  {[type]} initialColor [description]
   * @return {[type]}              [description]
   */
  _initPicker: function (initialColor) {
    var self = this;
    var params = this.params;
    var container = this._container;
    var $picker = this.$picker;

    this.params.valueCSS = initialColor;
    // set picker input value
    // and bind the picker using the wp widget
    // with the common options between a picker
    // with 'alpha' allowed and one without
    $picker.val(initialColor).wpColorPicker({
      palettes: false // k6doubt override wp native behavior or not? \\
    });

    // enable alpha control if allowed
    if (params.allowAlpha) {
      this._addAlpha(initialColor);
    } else {
      // picker has a different behavior if alpha is or is not allowed
      $picker.wpColorPicker({
        change: function (event, ui) {
          // if the picker changes while the custom mode is expanded means that
          // the user has changed manually the color, unfortunately
          // for now we haven't found a better way to differentiate this `change`
          // callback between a manual change (user click/drag) and a programmatic
          // one through code.
          if (self.params.exState === 'custom') {
            self._setMode('custom');
            self._apply(ui.color.toString(), 'picker');
          }
        }
      });
    }
    // we don't need the clear button (we have a shared system to reset to default values)
    var btnClear = container.getElementsByClassName('wp-picker-clear')[0];
    btnClear.parentNode.removeChild(btnClear);

    // on Color Custom button toggle, this code is here because we
    // need to target the button after having initialized the color picker
    // which does its own DOM manipulations and create the toggle
    var btnCustom = container.getElementsByClassName('wp-color-result')[0]; // k6wptight selector \\
    btnCustom.onclick = function () {
      self._setExState('custom');
      // if we are clicking on custom from a 'transparent' mode
      // then 'activate' the last selected color from the picker
      if (self.params.transparent) {
        self._setMode('custom');
        // it could be that color of the picker is an empty string if on ready the value
        // of the setting is transparent, so apply only if there is a selected color in the picker
        var lastColorSelected = $picker.wpColorPicker('color');
        if (lastColorSelected) {
          self._apply(lastColorSelected, 'picker');
        }
      }
    };
    // change button texts through title attribute and data attribute
    btnCustom.title = l10n['customColor'];
    btnCustom.setAttribute('data-current', l10n['customColor']);
    // set the toggle as control property, we're gonna reuse it
    /** @type {jQuery} */
    this.$btnCustom = $(btnCustom);
  },
  /**
   * [_updateUIsimpleDynamic description]
   * When the expression value change on user input
   * read the typed value and update accordingly the simple function fields.
   * All happen on keyup so it needs to be fast.
   *
   * @param  {[type]} value [description]
   */
  _updateUIsimpleDynamic: function (value) {
    if (!this.rendered) {
      return;
    }
    var matches;
    var inputFunction = this.inputFunction;
    var inputVar = this.inputVar;
    var inputAmount = this.inputAmount;
    var inputVarOption;
    var inputFunctionOption;

    // if the expression is a simple color function enable and update
    // the simple function fields according to the expression value.
    if (Regexes.colorSimpleFunction_test.test(value)) {
      matches = value.replace(Regexes.whitespaces, '').match(Regexes.colorSimpleFunction_match);

      // update function name
      inputFunction.value = matches[1];
      inputFunctionOption = inputFunction.querySelector('option[value="' + matches[1] + '"]');
      if (inputFunctionOption) {
        inputFunctionOption.selected = true;
      }

      // update var name through selectize plugin
      inputVar.selectize.setValue(matches[2], true); // k6plugintight-selectize \\

      // update amount
      inputAmount.value = matches[3];

    // if the expression is a simple variable update the variable name
    // simple field and disable all the rest.
    } else if (Regexes.simpleVariable_test.test(value)) {
      matches = value.replace(Regexes.whitespaces, '').match(Regexes.simpleVariable_match);

      // update var name through selectize plugin
      inputVar.selectize.setValue(matches[2], true); // k6plugintight-selectize \\

    // if it's not a simple color function or a simple variable (could
    // be nested functions or could be that the expression uses multiple
    // variables), disable the 'simple function' input fields
    } else {
      // reset varName select
      inputVar.selectize.setValue(false, true); // k6plugintight-selectize \\

      // reset functionName select
      inputFunction.value = false;
       // select first option `None` (has empty value)
      inputFunction.options[0].selected = true;

      // reset amount input
      inputAmount.value = false;
    }
  },
  /**
   * [_updateUIexpr description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  _updateUIexpr: function (value) {
    if (!this.rendered) {
      return;
    }
    this.inputExpr.value = value;
  },
  /**
   * Update the expression input constructing the string from
   * the new selected values (read them on `params`)when the
   * user is using the simplified dynamic color controls.`
   *
   * @param  {string|number} value     [description]
   * @param  {string}              valueType [description]
   */
  _updateExpr: function (value) {
    var params = this.params;
    var matches;
    var newExpr;
    // if it is a simple function
    if (Regexes.colorSimpleFunction_test.test(value)) {
      matches = value.replace(Regexes.whitespaces, '').match(Regexes.colorSimpleFunction_match);
      params.functionName = matches[1];
      params.varName = matches[2];
      params.amount = matches[3];
      newExpr = matches[1] + '(@' + matches[2] + ', ' + matches[3] + '%)';
    // if it is a simple variable
    } else if (Regexes.simpleVariable_test.test(value)) {
      matches = value.replace(Regexes.whitespaces, '').match(Regexes.simpleVariable_match);
      params.varName = matches[1];
      newExpr = '@' + matches[1];
    // if it's not a simple function or a simple variable
    } else {
      newExpr = value;
    }
    // set on params
    params.expr = newExpr;

    return newExpr;
  },
  /**
   * [_applyToPicker description]
   * In a try catch because not always we have the wpColorPicker
   * already initialized. // k6todo maybe htere is a better way... \\
   *
   * @param  {[type]} newColor [description]
   * @return {[type]}          [description]
   */
  _applyToPicker: function (newColor) {
    try {
      this.$picker.val(newColor).wpColorPicker('color', newColor);
    } catch (e) {}
  },
  /**
   * [_applyPropagate description]
   * propagate changes to the dependent values reading the netOn param
   *
   * @param  {[type]} newColor [description]
   * @return {[type]}          [description]
   */
  _applyPropagate: function (newColor) {
    var netOn = this.params.netOn;
    for (var i = netOn.length; i--;) {
      var relatedControl = api.control(netOn[i]);
      // we don't actually need to propagate the change
      // if the related control is not rendered, because the preview
      // is not visible
      if (relatedControl && relatedControl.rendered) {
        var relatedControlExpr = relatedControl.params.expr;
        // if there is an expression apply it and update picker color
        if (relatedControlExpr) {
          Utils.compileTest(relatedControlExpr, function (newColorProcessed) {
            relatedControl._applyToPicker(newColorProcessed);
          });
        } else {
          relatedControl._applyToPicker(newColor);
        }
      }
    }
  },
  /**
   * [_applyValue description]
   * we use callbacks instead of promises because it's faster
   * see {@link http://jsperf.com/promise-vs-callback/8, jsperf}
   *
   * @param  {string}                   value    [description]
   * @param  {function(string, string)} callback [description]
   * @param  {string}                   from
   */
  _applyValue: function (value, from, callback) {
    var self = this;
    var params = this.params;

    // transparent is a valid color
    if (value === 'transparent') {
      self._updateExpr('');
      self._updateUIexpr('transparent');
      self._updateUIsimpleDynamic();
      self._setMode('custom', true);
      callback(value, 'transparent');
    }
    // if it is a valid hex or rgba color
    else if (Regexes.colorHex_test.test(value) || (params.allowAlpha && Regexes.colorRgba_test.test(value))) {
      self._updateExpr('');
      self._updateUIexpr(value);
      self._updateUIsimpleDynamic();
      self._setMode('custom');
      callback(value, value);
    }
    // if it is a dynamic color (simple function or expression)
    else {
      var valueUpdated = self._updateExpr(value);
      if (from !== 'expr') {
        self._updateUIexpr(valueUpdated);
      }
      if (from !== 'dynamic') {
        self._updateUIsimpleDynamic(valueUpdated);
      }
      self._setMode('dynamic');
      Utils.compileTest(valueUpdated, function (color) {
        callback(valueUpdated, color);
      });
    }
  },
  /**
   * Apply, wrap the `setting.set()` function
   * doing some additional stuff.
   *
   * @private
   * @param  {string} value
   * @param  {string} from  Where the value come from (could be from the UI:
   *                        picker, dynamic fields, expr field) or from the
   *                        API (on programmatic value change).
   */
  _apply: function (value, from) {

    this._applyValue(value, from, function (newValue, newColor) {

      this.params.valueCSS = newColor;

      if (from !== 'picker' && this.rendered) {
        this._applyToPicker(newColor);
      }

      if (from !== 'api') {
        // set new value
        this.setting.set(newValue);
      }

      // propagate to dependent settings
      this._applyPropagate(newColor);

    }.bind(this));
  }
});

api.controlConstructor['k6_color'] = ControlColor;