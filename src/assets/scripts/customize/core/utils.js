/**
 * Utils
 *
 * @requires Regexes
 */
var Utils = (function () {

  var _IMAGES_BASE_URL = api.constants.IMAGES_BASE_URL;
  var _DOCS_BASE_URL = api.constants.DOCS_BASE_URL;

  /**
   * Is it an absolute URL?
   *
   * @link(http://stackoverflow.com/a/19709846/1938970)
   * @param  {String}  url The URL to test
   * @return {Boolean}     Whether is absolute or relative
   */
  function _isAbsoluteUrl (url) {
    var r = new RegExp('^(?:[a-z]+:)?//', 'i'); // @@todo move to Regexes modules and create tests \\
    return r.test(url);
  }

  /**
   * Clean URL from multiple slashes
   *
   * Strips possible multiple slashes caused by the string concatenation or dev errors
   * // @@todo move to Regexes modules and create tests \\
   * @param  {String} url
   * @return {String}
   */
  function _cleanUrlFromMultipleSlashes (url) {
    return url.replace(/[a-z-A-Z-0-9_]{1}(\/\/+)/g, '/');
  }

  /**
   * Get a clean URL
   *
   * If an absolute URL is passed we just strip multiple slashes,
   * if a relative URL is passed we also prepend the right base url.
   *
   * @param  {String} url
   * @param  {String} type
   * @return {String}
   */
  function _getCleanUrl (url, type) {
    // return the absolute url
    var finalUrl = url;
    if (!_isAbsoluteUrl(url)) {
      switch (type) {
        case 'img':
          finalUrl = _IMAGES_BASE_URL + url;
          break;
        case 'docs':
          finalUrl = _DOCS_BASE_URL + url;
          break;
        default:
          break;
      }
    }
    return _cleanUrlFromMultipleSlashes(finalUrl);
  }

  // @public API
  return {
    /**
     * To Boolean
     * '0' or '1' to boolean
     *
     * @method
     * @param  {strin|number} value
     * @return {boolean}
     */
    toBoolean: function (value) {
      return typeof value === 'boolean' ? value : !!parseInt(value, 10);
    },
    /**
     * Get image url
     *
     * @param  {String} url The image URL, relative or absolute
     * @return {String}     The absolute URL of the image
     */
    getImageUrl: function (url) {
      return _getCleanUrl(url, 'img');
    },
    /**
     * Get docs url
     *
     * @param  {String} url The docs URL, relative or absolute
     * @return {String}     The absolute URL of the docs
     */
    getDocsUrl: function (url) {
      return _getCleanUrl(url, 'docs');
    },
    /**
     * Bind a link element or directly link to a specific control to focus
     *
     * @method
     */
    linkControl: function (linkEl, controlId) {
      var controlToFocus = wpApi.control(controlId);
      var innerLink = function () {
        controlToFocus.inflate(true);

        // always deactivate search, it could be that
        // we click on this link from a search result
        // try/catch because search is not always enabled
        try {
          api.components.Search.deactivate();
        } catch(e) {
          console.warn('Utils->linkControl: failed attempt to deactivate Search', e);
        }

        controlToFocus.focus();
        controlToFocus.container.addClass('pwpcp-control-focused');
        setTimeout(function () {
          controlToFocus.container.removeClass('pwpcp-control-focused');
        }, 2000);
      };

      // be sure there is the control and update dynamic color message text
      if (controlToFocus) {
        if (linkEl) {
          linkEl.onclick = innerLink;
        } else {
          innerLink();
        }
      }
    },
    /**
     * Reset control -> setting value to the value according
     * to the given mode argument
     * @param  {Control} control  The control whose setting has to be reset
     * @param  {string} resetType Either `'initial'` or `'factory'`
     * @return {boolean}          Whether the reset has succeded
     */
    resetControl: function (control, resetType) {
      if (control.params.type === 'pwpcp_dummy') {
        return true;
      }
      var value;
      if (resetType === 'initial') {
        value = control.params.vInitial;
      } else if (resetType === 'factory') {
        value = control.params.vFactory;
      }
      if (value) {
        control.setting.set(value);
        return true;
      } else {
        return false;
      }
    },
    /**
     * Check if the given type of reset is needed for a specific control
     * @param  {Control} control  The control which need to be checked
     * @param  {string} resetType Either `'initial'` or `'factory'`
     * @return {boolean}          Whether the reset has succeded
     */
    _isResetNeeded: function (control, resetType) {
      if (!control.pwpcp || control.params.type === 'pwpcp_dummy') {
        return false;
      }
      var _softenize = control.softenize;
      var value = _softenize(control.setting());
      if (resetType === 'initial') {
        return value !== _softenize(control.params.vInitial);
      } else if (resetType === 'factory') {
        return value !== _softenize(control.params.vFactory);
      }
    },
    /**
     * Selectize render option function
     *
     * @abstract
     * @param  {Object} item     The selectize option object representation.
     * @param  {function} escape Selectize escape function.
     * @return {string}          The option template.
     */
    _selectizeRenderSize: function (item, escape) {
      return '<div class="pwpcpsize-selectOption"><i>' + escape(item.valueCSS) + '</i> ' +
        escape(item.label) + '</div>';
    },
    /**
     * Selectize render option function
     *
     * @abstract
     * @param  {Object} item     The selectize option object representation.
     * @param  {function} escape Selectize escape function.
     * @return {string}          The option template.
     */
    _selectizeRenderColor: function (item, escape) {
      return '<div class="pwpcpcolor-selectOption" style="border-color:' + escape(item.valueCSS) + '">' +
        escape(item.label) + '</div>';
    },
    /**
     * Get Spectrum plugin options
     *
     * @link(https://bgrins.github.io/spectrum/, spectrum API)
     * @static
     * @param  {Object} control Customize Control object
     * @param  {Object} options Options that override the defaults (optional)
     * @return {Object} The spectrum plugin options
     */
    _getSpectrumOpts: function (control, options) {
      var params = control.params;
      var $container = control.container;
      return _.extend({
        // containerClassName: '',
        preferredFormat: 'hex',
        flat: true,
        // appendTo: $container, // @@todo doesn't work... or control.__$expander \\
        showInput: true,
        showInitial: true, // @@doubt maybe it get too messy with this shown \\
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
        color: control.setting(),
        show: function () {
          $container.find('.sp-input').focus();
        },
        move: function (tinycolor) {
          var color = tinycolor ? tinycolor.toString() : 'transparent';
          control.setting.set(color);
        },
        change: function (tinycolor) {
          var color = tinycolor ? tinycolor.toString() : 'transparent';
          if (!tinycolor) {
            $container.find('.sp-input').val('transparent');
          }
        }
      }, options || {});
    }
  };
})();

// export to public API
api.Utils = Utils;