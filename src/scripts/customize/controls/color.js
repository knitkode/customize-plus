import $ from 'jquery';
import _ from 'underscore';
import { api } from '../core/globals';
import { color as validate } from '../core/validate';
import { color as sanitize } from '../core/sanitize';
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
 *
 * @requires tinycolor
 *
 * @requires validate
 * @requires sanitize
 */
class Color extends Base {
    
  /**
   * @override
   */
  static type = `color`;

  /**
   * @override
   */
  static _onWpConstructor = true;
  
  /**
   * @override
   */
  validate = validate;
  
  /**
   * @override
   */
  sanitize = sanitize;

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
  softenize ($value) {
    const anyColor = tinycolor($value);

    if (!anyColor['_format']) { // whitelisted from uglify \\
      return $value;
    } else {
      return anyColor.toRgbString();
    }
  }

  /**
   * @override
   */
  shouldComponentUpdate ($value) {
    return this.softenize(this._getValueFromUi()) !== this.softenize($value);
  }

  /**
   * @override
   */
  componentDidUpdate ($value) {
    this._updateUI($value);
  }

  /**
   * @override
   */
  componentWillUnmount () {
    if (this.__$picker) {
      this.__$picker.spectrum('destroy');
    }
  }

  /**
   * @override
   */
  componentDidMount () {
    const container = this._container;
    const btnCustom = container.getElementsByClassName('kkcpui-toggle')[0];

    this.__preview = container.getElementsByClassName('kkcpcolor-current-overlay')[0];
    this.__$picker = $(container.getElementsByClassName('kkcpcolor-input')[0]);
    this.__$expander = $(container.getElementsByClassName('kkcp-expander')[0]).hide();

    this._updateUI(this.setting());

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
        this.setting.set(color);
      },
      change: (tinycolor) => {
        const color = tinycolor ? tinycolor.toString() : 'transparent';
        this.setting.set(color);
        if (!tinycolor) {
          $container.find('.sp-input').val('transparent');
        }
      }
    }, options || {});
  }

  /**
   * Get value from UI
   *
   * @since   1.1.0
   *
   * @access protected
   * @return {string}
   */
  _getValueFromUi () {
    return this.__preview.style.background;
  }

  /**
   * Update UI
   *
   * @since   1.1.0
   *
   * @access protected
   * @param  {string} $value
   */
  _updateUI ($value) {
    this.__preview.style.background = $value;

    if (this.__$picker && this.__$picker.spectrum) {
      this.__$picker.spectrum('set', $value);
    }
  }

  /**
   * @override
   */
  _tpl() {
    return `
      ${this._tplHeader()}
      <span class="kkcpcolor-current kkcpcolor-current-bg"></span>
      <span class="kkcpcolor-current kkcpcolor-current-overlay"></span>
      <button class="kkcpui-toggle kkcpcolor-toggle">${this._l10n('selectColor')}</button>
      <div class="kkcp-expander">
        <input class="kkcpcolor-input" type="text">
      </div>
    `
  }
}

export default Color;
