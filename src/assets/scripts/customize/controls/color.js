/* global Utils, tinycolor */

/**
 * Load spectrum only on demand
 * @link(https://github.com/bgrins/spectrum/issues/112)
 * @type {Boolean}
 */
$.fn.spectrum.load = false;

/**
 * Control Color class
 *
 * @constructor
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires Utils
 */
// export to our API and to WordPress API
api.controls.Color = wpApi.controlConstructor.pwpcp_color = api.controls.Base.extend({
  /**
   * Normalize setting for soft comparison
   *
   * Use tinycolor (included in spectrum.js) to always convert
   * colors to their rgb value, so to have the same output result when
   * the input is `red` or `#f00` or `#ff0000` or `rgba(255, 0, 0, 1)`.
   *
   * @override
   * @use tinycolor.toRgbString
   * @static
   * @param  {?} value Could be the original, the current, or the initial
   *                   session value
   * @return {string} The 'normalized' value passed as an argument.
   */
  softenize: function (value) {
    try {
      var anyColor = tinycolor(value);
      // if it is not an actual color but an expression or a variable
      // tinycolor won't recognize a `format` (such as hex, name, rgba, etc..)
      // hence we rely on this do decide what to return
      if (!anyColor['_format']) { // @@todo whitelist from uglify mangle regex private names \\
        return value;
      } else {
        return anyColor.toRgbString();
      }
    } catch(e) {
      console.warn('Control->Color->softenize: tinycolor conversion failed', e);
      return value;
    }
  },
  /**
   * Validate
   *
   * @param {*} value The value to validate.
   * @return {string|object<string,boolean>} The validated control value.
   */
  validate: function (value) {
    if (
      (!this.params.disallowTransparent && value === 'transparent') ||
      validator.isHexColor(value) ||
      (this.params.allowAlpha && validator.isRgbaColor(value))
    ) {
      return value;
    } else {
      return { error: true };
    }
  },
  /**
   * Sync UI with value coming from API, a programmatic change like a reset.
   * @override
   * @param {string} value The new setting value.
   */
  syncUIFromAPI: function (value) {
    this._apply(value, 'API');
  },
  /**
   * On deflate
   *
   * Destroy `spetrum` instances if any.
   *
   * @override
   */
  onDeflate: function () {
    if (this.__$picker && this.rendered) {
      this.__$picker.spectrum('destroy');
    }
  },
  /**
   * On ready
   *
   * @override
   */
  ready: function () {
    var self = this;
    /** @type {HTMLelement} */
    var container = this._container;
    /** @type {HTMLelement} */
    var btnCustom = container.getElementsByClassName('pwpcpui-toggle')[0];

    /** @type {HTMLelement} */
    this.__preview = container.getElementsByClassName('pwpcpcolor-current-overlay')[0];
    /** @type {jQuery} */
    this.__$picker = $(container.getElementsByClassName('pwpcpcolor-input')[0]);
    /** @type {jQuery} */
    this.__$expander = $(container.getElementsByClassName('pwpcp-expander')[0]).hide();

    self._applyOnUIpreview(self.setting());


    var isOpen = false;
    var pickerIsInitialized = false;
    var _maybeInitializeSpectrum = function () {
      // initialize only once
      if (!pickerIsInitialized) {
        self.__$picker.spectrum(Utils._getSpectrumOpts(self));
        pickerIsInitialized = true;
      }
    };

    btnCustom.onmouseover = _maybeInitializeSpectrum;

    btnCustom.onclick = function() {
      isOpen = !isOpen;
      _maybeInitializeSpectrum();

      // and toggle
      if (isOpen) {
        self.__$expander.slideDown();
      } else {
        self.__$expander.slideUp();
      }
      return false;
    };
  },
  /**
   * Apply on UI preview (the color box on the left hand side)
   * @param  {string} newValue
   */
  _applyOnUIpreview: function (newValue) {
    this.__preview.style.background = newValue;
  },
  /**
   * Apply on UI control (the spectrum color picker)
   */
  _applyOnUIcustom: function (newValue) {
    this.__$picker.spectrum('set', newValue);
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
    this.params.valueCSS = value;

    if (this.rendered) {
      this._applyOnUIpreview(value);

      if (from === 'API') {
        this._applyOnUIcustom(value);
      }
    }

    if (from !== 'API') {
      // set new value
      this.setting.set(value);
    }
  }
});