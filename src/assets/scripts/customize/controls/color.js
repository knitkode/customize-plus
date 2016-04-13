/* global tinycolor */

/**
 * Load spectrum only on demand
 * {@link https://github.com/bgrins/spectrum/issues/112}
 * @type {Boolean}
 */
$.fn.spectrum.load = false;

/**
 * Control Color class
 *
 * @class wp.customize.controlConstructor.pwpcp_color
 * @alias api.controls.Color
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires tinycolor
 */
wpApi.controlConstructor.pwpcp_color = api.controls.Color = api.controls.Base.extend({
  /**
   * Use tinycolor (included in spectrum.js) to always convert colors to their
   * rgb value, so to have the same output result when the input is `red` or
   * `#f00` or `#ff0000` or `rgba(255, 0, 0, 1)`. If it is not an actual color
   * but an expression or a variable tinycolor won't recognize a `_format`
   * (such as hex, name, rgba, etc..), we rely on this do decide what to return
   *
   * @override
   * @use tinycolor.toRgbString
   */
  softenize: function (value) {
    try {
      var anyColor = tinycolor(value);
      if (!anyColor['_format']) { // whitelisted from uglify \\
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
   * @override
   */
  validate: function (value) {
    var params = this.params;
    var softenize = this.softenize;
    if (params.showPaletteOnly &&
      !params.togglePaletteOnly &&
      _.isArray(params.palette)
    ) {
      var allColorsAllowed = _.flatten(params.palette, true);
      allColorsAllowed = _.map(allColorsAllowed, function (color) {
        return softenize(color);
      });
      if (allColorsAllowed.indexOf(softenize(value)) !== -1) {
        return value;
      } else {
        return { error: true, msg: api.l10n['vNotInPalette'] };
      }
    }
    else if (
      (!params.disallowTransparent && value === 'transparent') ||
      validator.isHexColor(value) ||
      (params.allowAlpha && validator.isRgbaColor(value))
    ) {
      return value;
    } else {
      return { error: true };
    }
  },
  /**
   * @override
   */
  syncUI: function (value) {
    this._apply(value, 'API');
  },
  /**
   * Destroy `spectrum` instances if any.
   *
   * @override
   */
  onDeflate: function () {
    if (this.__$picker && this.rendered) {
      this.__$picker.spectrum('destroy');
    }
  },
  /**
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

    self._updateUIpreview(self.setting());


    var isOpen = false;
    var pickerIsInitialized = false;
    var _maybeInitializeSpectrum = function () {
      // initialize only once
      if (!pickerIsInitialized) {
        self.__$picker.spectrum(self._getSpectrumOpts(self));
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
   * Get Spectrum plugin options
   *
   * {@link https://bgrins.github.io/spectrum/ spectrum API}
   * @param  {Object} options Options that override the defaults (optional)
   * @return {Object} The spectrum plugin options
   */
  _getSpectrumOpts: function (options) {
    var self = this;
    var params = self.params;
    var $container = self.container;
    return _.extend({
      preferredFormat: 'hex',
      flat: true,
      showInput: true,
      showInitial: false,
      showButtons: false,
      // localStorageKey: 'PWPcp_spectrum',
      showSelectionPalette: false,
      togglePaletteMoreText: api.l10n['togglePaletteMoreText'],
      togglePaletteLessText: api.l10n['togglePaletteLessText'],
      allowEmpty: !params.disallowTransparent,
      showAlpha: params.allowAlpha,
      showPalette: !!params.palette,
      showPaletteOnly: params.showPaletteOnly && params.palette,
      togglePaletteOnly: params.togglePaletteOnly && params.palette,
      palette: params.palette,
      color: self.setting(),
      show: function () {
        $container.find('.sp-input').focus();
        if (params.showInitial) {
          $container.find('.sp-container').addClass('sp-show-initial');
        }
      },
      move: function (tinycolor) {
        var color = tinycolor ? tinycolor.toString() : 'transparent';
        self._apply(color);
      },
      change: function (tinycolor) {
        if (!tinycolor) {
          $container.find('.sp-input').val('transparent');
        }
      }
    }, options || {});
  },
  /**
   * Update UI preview (the color box on the left hand side)
   */
  _updateUIpreview: function (newValue) {
    this.__preview.style.background = newValue;
  },
  /**
   * Update UI control (the spectrum color picker)
   */
  _updateUIcustomControl: function (newValue) {
    this.__$picker.spectrum('set', newValue);
  },
  /**
   * Apply, wrap the `setting.set()` function
   * doing some additional stuff.
   *
   * @access private
   * @param  {string} value
   * @param  {string} from  Where the value come from (could be from the UI:
   *                        picker, dynamic fields, expr field) or from the
   *                        API (on programmatic value change).
   */
  _apply: function (value, from) {
    this.params.valueCSS = value;

    if (this.rendered) {
      this._updateUIpreview(value);

      if (from === 'API') {
        this._updateUIcustomControl(value);
      }
    }

    if (from !== 'API') {
      // set new value
      this.setting.set(value);
    }
  }
});
