import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import Base from './base';
/* global tinycolor */

/**
 * Control Color class
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_color`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Color
 *
 * @extends controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires tinycolor
 *
 * @requires Validate
 * @requires Sanitize
 */
class Color extends Base {

  /**
   * Use tinycolor (included in spectrum.js) to always convert colors to the
   * same format, so to have the same output result when the input is `red` or
   * `#f00` or `#ff0000` or `rgba(255, 0, 0, 1)`. If it is not an actual color
   * but an expression or a variable tinycolor won't recognize a `_format`
   * (such as hex, name, rgba, etc..), we rely on this do decide what to return
   *
   * @override
   * @requires tinycolor.toRgbString
   */
  softenize (value) {
    try {
      const anyColor = tinycolor(value);
      if (!anyColor['_format']) { // whitelisted from uglify \\
        return value;
      } else {
        return anyColor.toRgbString();
      }
    } catch(e) {
      if (DEBUG) {
        console.warn('Control->Color->softenize: tinycolor conversion failed', e);
      }
      return value;
    }
  }

  /**
   * @override
   */
  validate (value) {
    return Validate.color({}, value, this.setting, this);
  }

  /**
   * @override
   */
  sanitize (value) {
    return Sanitize.color(value, this.setting, this);
  }

  /**
   * @override
   */
  syncUI (value) {
    this._apply(value, 'API');
  }

  /**
   * Destroy `spectrum` instances if any.
   *
   * @override
   */
  onDeflate () {
    if (this.__$picker && this.rendered) {
      this.__$picker.spectrum('destroy');
    }
  }

  /**
   * @override
   */
  ready () {
    /** @type {HTMLElement} */
    const container = this._container;
    /** @type {HTMLElement} */
    const btnCustom = container.getElementsByClassName('kkcpui-toggle')[0];

    /** @type {HTMLElement} */
    this.__preview = container.getElementsByClassName('kkcpcolor-current-overlay')[0];
    /** @type {JQuery} */
    this.__$picker = $(container.getElementsByClassName('kkcpcolor-input')[0]);
    /** @type {JQuery} */
    this.__$expander = $(container.getElementsByClassName('kkcp-expander')[0]).hide();

    this._updateUIpreview(this.setting());

    let isOpen = false;
    let pickerIsInitialized = false;

    const _maybeInitializeSpectrum = () => {
      // initialize only once
      if (!pickerIsInitialized) {
        this.__$picker.spectrum(this._getSpectrumOpts());
        pickerIsInitialized = true;
      }
    };

    btnCustom.onmouseover = _maybeInitializeSpectrum;

    btnCustom.onclick = () => {
      isOpen = !isOpen;
      _maybeInitializeSpectrum();

      // and toggle
      if (isOpen) {
        this.__$expander.slideDown();
      } else {
        this.__$expander.slideUp();
      }
      return false;
    };
  }

  /**
   * Get Spectrum plugin options
   *
   * {@link https://bgrins.github.io/spectrum/ spectrum API}
   *
   * @since   1.0.0
   * @memberof! controls.Color#
   * @access protected
   *
   * @param  {?object} options Options that override the defaults (optional)
   * @return {object} The spectrum plugin options
   */
  _getSpectrumOpts (options) {
    const params = this.params;
    const $container = this.container;

    return _.extend({
      preferredFormat: 'hex',
      flat: true,
      showInput: true,
      showInitial: false,
      showButtons: false,
      // localStorageKey: 'kkcp_spectrum',
      showSelectionPalette: false,
      togglePaletteMoreText: api.l10n['togglePaletteMoreText'],
      togglePaletteLessText: api.l10n['togglePaletteLessText'],
      allowEmpty: !!params.transparent,
      showAlpha: !!params.alpha,
      showPalette: !!params.palette,
      showPaletteOnly: !!params.palette && (params.picker === 'hidden' || !params.picker),
      togglePaletteOnly: !!params.palette && (params.picker === 'hidden' || params.picker),
      palette: params.palette,
      color: this.setting(),
      show: () => {
        $container.find('.sp-input').focus();
      },
      move: (tinycolor) => {
        const color = tinycolor ? tinycolor.toString() : 'transparent';
        this._apply(color);
      },
      change: (tinycolor) => {
        if (!tinycolor) {
          $container.find('.sp-input').val('transparent');
        }
      }
    }, options || {});
  }

  /**
   * Update UI preview (the color box on the left hand side)
   *
   * @since   1.0.0
   * @memberof! controls.Color#
   * @access protected
   */
  _updateUIpreview (newValue) {
    this.__preview.style.background = newValue;
  }

  /**
   * Update UI control (the spectrum color picker)
   *
   * @since   1.0.0
   * @memberof! controls.Color#
   * @access protected
   */
  _updateUIcustomControl (newValue) {
    this.__$picker.spectrum('set', newValue);
  }

  /**
   * Apply, wrap the `setting.set()` function
   * doing some additional stuff.
   *
   * @since   1.0.0
   * @memberof! controls.Color#
   *
   * @access protected
   * @param  {string} value
   * @param  {string} from  Where the value come from (could be from the UI:
   *                        picker, dynamic fields, expr field) or from the
   *                        API (on programmatic value change).
   */
  _apply (value, from) {
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
}

export default wpApi.controlConstructor['kkcp_color'] = api.controls.Color = Color;
