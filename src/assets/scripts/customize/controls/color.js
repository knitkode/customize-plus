/* global Color, ControlBase, Regexes */

/**
 * Control Color class
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires Regexes
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

    // // Custom mode
    // if (mode === 'custom') {
    //   // reset var name object property
    //   params.varName = '';
    // // Dynamic mode
    // } else if (mode === 'dynamic') {
    //   if (isRendered) {
    //     // update dynamic color message text
    //     this.msg.innerHTML = params.varName;
    //     // and bind link
    //     this._bindInfoLink();
    //   }
    // }
    // set the mode property
    params.mode = mode;

    // update css thanks to this change on data attribute
    if (isRendered) {
      this.wrapper.setAttribute('data-k6-color-mode', mode);
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
   * @param {*} value The value to validate.
   * @return {string} The validated control value.
   */
  _validate: function (value) {
    if ( validator.isHexColor( value ) || ( params.allowAlpha && validator.isRgbaColor( value ) ) ) {
      return value;
    }
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
   * On ready
   *
   * @override
   */
  ready: function () {
    var self = this;
    var params = self.params;
    var container = self._container;
    var btnTransparent = container.getElementsByClassName('k6-color-transparent')[0];


    /**
     * Set elements as control properties
     *
     */
    /** @type {HTMLelement} */
    self.wrapper = container.getElementsByClassName('k6-color')[0];
    /** @type {jQuery} */
    self.$picker = self.container.find('.color-picker-hex');

    /**
     * Set mode immediately
     *
     */
    self._setMode(params.mode, params.transparent);

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

    self._initPicker(self.setting());
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
    btnCustom.title = k6cp['l10n']['customColor'];
    btnCustom.setAttribute('data-current', k6cp['l10n']['customColor']);
    // set the toggle as control property, we're gonna reuse it
    /** @type {jQuery} */
    this.$btnCustom = $(btnCustom);
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

    // could be a transparent color
    if (value === 'transparent') {
      self._setMode('custom', true);
      callback(value, 'transparent');
    }
    // otherwise is a custom color
    else {
      self._setMode('custom');
      callback(value, value);
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

    }.bind(this));
  }
});

api.controlConstructor['k6cp_color'] = ControlColor;