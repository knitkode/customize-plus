/* global WpTight, Skeleton, Tabs, Tooltips, Notices */
/* jshint unused: false, funcscope: true */

(function (window, document, $, _, wp, api, validator) {
  'use strict';

  // this is needed to don't break js while developing,
  // it gets stripped out during minification
  var DEBUG = api.DEBUG || false;

  if (DEBUG) {
    // shim for Opera
    window.performance = window.performance || { now: function(){} };
    var t = performance.now();
  }

  // Set default speed of jQuery animations
  $.fx.speeds['_default'] = 180; // whitelisted from uglify mangle regex private names \\

  /**
   * Reusable variables as globals in each included file
   *
   */
  /** @type {jQuery} */
  var $window = $(window);

  /** @type {jQuery} */
  var $document = $(document);

  /** @type {HTMLelement} */
  var body = document.getElementsByTagName('body')[0];

  /** @type {Object} */
  var wpApi = wp.customize;

  /** @type {boolean} */
  var wpApiIsReady = false;
  wpApi.bind('ready', function () {
    wpApiIsReady = true;
  });
  /* global marked, hljs */

  /**
   * Markdown init (with marked.js)
   *
   */
  (function () {

    // bail fi marked is not available on window
    if (!marked) {
      return;
    }

    /**
     * Custom marked renderer
     * @link(https://github.com/chjj/marked/pull/451#issuecomment-49976076, source)
     * @type {marked}
     */
    var markedRenderer = new marked.Renderer();

    /**
     * Add `target="_blank" to external links
     * @param  {string} href
     * @param  {string} title
     * @param  {string} text
     * @return {string}
     */
    markedRenderer.link = function(href, title, text) {
      var external = /^https?:\/\/.+$/.test(href);
      var newWindow = external || title === 'newWindow';
      var out = '<a href="' + href + '"';
      if (newWindow) {
        out += ' target="_blank"';
      }
      if (title && title !== 'newWindow') {
        out += ' title="' + title + '"';
      }
      return out += '>' + text + '</a>';
    };

    /**
     * Set marked options
     */
    marked.setOptions({
      // anchorTargetBlank: true,
      renderer: markedRenderer,
      highlight: function (code, lang, callback) {
        return hljs.highlightAuto(code).value;
      }
    });
    $(body).addClass('pwpcp-markdown-supported');

  })();

  /**
   * WordPress Tight
   *
   * We can put some logic in private functions to grab the
   * right things in case WordPress change stuff across versions
   *
   * @type {Object}
   */
  var WpTight = (function () {

    // @public API
    return {
      /**
       * Init
       *
       * @return {void}
       */
      init: function () {
        /**
         * WordPress UI elements
         *
         * @type {Object.<string, jQuery|HTMLelement>}
         */
        var el = this.el = {};

        /** @type {jQuery} */
        el.container = $('.wp-full-overlay');
        /** @type {jQuery} */
        el.controls = $('#customize-controls');
        /** @type {jQuery} */
        el.themeControls = $('#customize-theme-controls');
        /** @type {jQuery} */
        el.preview = $('#customize-preview');
        /** @type {jQuery} */
        el.header = $('#customize-header-actions');
        /** @type {jQuery} */
        el.sidebar = $('.wp-full-overlay-sidebar-content');
        /** @type {jQuery} */
        el.info = $('#customize-info');
        /** @type {jQuery} */
        el.customizeControls = $('#customize-theme-controls').find('ul').first();
        // /** @type {jQuery} */
        // el.btnSave = $('#save');
      },
      /**
       * The suffix appended to the styles ids by WordPress when enqueuing them
       * through `wp_enqueue_style`
       *
       * @type {string}
       */
      cssSuffix: '-css'
    };
  })();

  // export to public API
  api.WpTight = WpTight;


  /* exported: Regexes */
  /* jshint maxlen: 1000 */

  /**
   * Regexes
   *
   * It might be that we need a regex that match of available words,
   * in that case it might be that we want to define the words in an
   * array (maybe coming from php?). So for array to regex conversion
   * do: `new RegExp(MY_VAR.join('|'), 'g')`. See {@link
   * http://stackoverflow.com/q/28280920/1938970 stackoverflow}.
   */
  var Regexes = {
    /**
     * Whitespaces global match
     *
     * To clean user input (most often when writing custom expressions)
     * so that it would later on be more easily parsable by our validation
     * regexes. Use this as follow: `string.replace(Regexes.whitespaces, '')`.
     *
     * @link http://stackoverflow.com/a/5963202/1938970
     *
     * @const
     * @type {RegExp}
     */
    _whitespaces: /\s+/g,
    /**
     * Grab all variables (sanitized user input)
     *
     * It capture a group from each `@variable-name` found
     *
     * @const
     * @type {RegExp}
     */
    _variables_match: /@([a-zA-Z-_0-9]+)/g,
    /**
     * Simple color function (raw user input)
     *
     * This just checks if the user input looks like a valid simple function
     * expression, so it's gentle with whitespace. It capture the number
     * (`amount`) but not to use it.
     *
     * @link http://regex101.com/r/wC5aO9/3
     *
     * @const
     * @type {RegExp}
     */
    _colorSimpleFunction_test: /^\s*[a-z]+\(\s*@[a-zA-Z-_0-9]+\,\s*(0\.[0-9]*[1-9][0-9]*|100|[1-9]\d?|[1-9]\d?\.[0-9]+)%?\s*\)\s*$/,
    /**
     * Simple color function (sanitized user input)
     *
     * This works only after having stripped all whitespaces,
     * it capture three groups: 'functionName', varName', 'amount'
     *
     * @link http://regex101.com/r/nC7iA2/2
     *
     * @const
     * @type {RegExp}
     */
    _colorSimpleFunction_match: /^([a-z]+)\(@([a-zA-Z-_0-9]+)\,(0\.[0-9]*[1-9][0-9]*|100|[1-9]\d?|[1-9]\d?\.[0-9]+)%?\)$/,
    /**
     * Simple variable (raw user input)
     *
     * This just checks if the user input looks like a single variable,
     * so it's gentle with whitespace.
     *
     * @link https://regex101.com/r/aP9mJ1/1
     *
     * @const
     * @type {RegExp}
     */
    _simpleVariable_test: /^\s*@[a-zA-Z-_0-9]+\s*$/,
    /**
     * Simple variable (sanitized user input)
     *
     * This works only after having stripped all whitespaces,
     * it capture one group: the `varName'
     *
     * @link https://regex101.com/r/aO6fI9/2
     *
     * @const
     * @type {RegExp}
     */
    _simpleVariable_match: /^@([a-zA-Z-_0-9]+)$/,
    /**
     * Variable (just grab a variable wherever it is)
     *
     * it capture one group: the `varName'
     *
     * @const
     * @type {RegExp}
     */
    _variable_match: /@([a-zA-Z-_0-9]+)/,
    /**
     * Extract unit, it returns the first matched, so the units are sorted by
     * popularity (approximately).
     *
     * @see http://www.w3schools.com/cssref/css_units.asp List of the css units
     * @const
     * @type {RegExp}
     */
    _extractUnit: /(px|%|em|rem|vh|vw|vmin|vmax|cm|mm|in|pt|pc|ch|ex)/,
    /**
     * Extract number from string (both integers or float)
     *
     * @see http://stackoverflow.com/a/17885985/1938970
     * @const
     * @type {RegExp}
     */
    _extractNumber: /(\+|-)?((\d+(\.\d+)?)|(\.\d+))/
  };

  // export to public API
  api.Regexes = Regexes;

  /* global Regexes */

  /**
   * Validator
   *
   * Extends https://github.com/chriso/validator.js
   */
  (function() {

    /**
     * Color validation utility
     *
     * Heavily inspired by formvalidation.js
     * by Nguyen Huu Phuoc, aka @nghuuphuoc and contributors
     * @link(https://github.com/formvalidation/)
     *
     * @type {Object}
     */
    var _ValidatorColor = {
      types: [ 'hex', 'rgb', 'rgba', 'hsl', 'hsla', 'keyword' ],
      // available also on `less.js` global var `less.data.colors` as Object
      keywords: [ 'aliceblue',
        'antiquewhite',
        'aqua',
        'aquamarine',
        'azure',
        'beige',
        'bisque',
        'black',
        'blanchedalmond',
        'blue',
        'blueviolet',
        'brown',
        'burlywood',
        'cadetblue',
        'chartreuse',
        'chocolate',
        'coral',
        'cornflowerblue',
        'cornsilk',
        'crimson',
        'cyan',
        'darkblue',
        'darkcyan',
        'darkgoldenrod',
        'darkgray',
        'darkgreen',
        'darkgrey',
        'darkkhaki',
        'darkmagenta',
        'darkolivegreen',
        'darkorange',
        'darkorchid',
        'darkred',
        'darksalmon',
        'darkseagreen',
        'darkslateblue',
        'darkslategray',
        'darkslategrey',
        'darkturquoise',
        'darkviolet',
        'deeppink',
        'deepskyblue',
        'dimgray',
        'dimgrey',
        'dodgerblue',
        'firebrick',
        'floralwhite',
        'forestgreen',
        'fuchsia',
        'gainsboro',
        'ghostwhite',
        'gold',
        'goldenrod',
        'gray',
        'green',
        'greenyellow',
        'grey',
        'honeydew',
        'hotpink',
        'indianred',
        'indigo',
        'ivory',
        'khaki',
        'lavender',
        'lavenderblush',
        'lawngreen',
        'lemonchiffon',
        'lightblue',
        'lightcoral',
        'lightcyan',
        'lightgoldenrodyellow',
        'lightgray',
        'lightgreen',
        'lightgrey',
        'lightpink',
        'lightsalmon',
        'lightseagreen',
        'lightskyblue',
        'lightslategray',
        'lightslategrey',
        'lightsteelblue',
        'lightyellow',
        'lime',
        'limegreen',
        'linen',
        'magenta',
        'maroon',
        'mediumaquamarine',
        'mediumblue',
        'mediumorchid',
        'mediumpurple',
        'mediumseagreen',
        'mediumslateblue',
        'mediumspringgreen',
        'mediumturquoise',
        'mediumvioletred',
        'midnightblue',
        'mintcream',
        'mistyrose',
        'moccasin',
        'navajowhite',
        'navy',
        'oldlace',
        'olive',
        'olivedrab',
        'orange',
        'orangered',
        'orchid',
        'palegoldenrod',
        'palegreen',
        'paleturquoise',
        'palevioletred',
        'papayawhip',
        'peachpuff',
        'peru',
        'pink',
        'plum',
        'powderblue',
        'purple',
        'red',
        'rosybrown',
        'royalblue',
        'saddlebrown',
        'salmon',
        'sandybrown',
        'seagreen',
        'seashell',
        'sienna',
        'silver',
        'skyblue',
        'slateblue',
        'slategray',
        'slategrey',
        'snow',
        'springgreen',
        'steelblue',
        'tan',
        'teal',
        'thistle',
        'tomato',
        'transparent',
        'turquoise',
        'violet',
        'wheat',
        'white',
        'whitesmoke',
        'yellow',
        'yellowgreen'
      ],
      hex: function(value) {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
      },
      hsl: function(value) {
        return /^hsl\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/.test(value);
      },
      hsla: function(value) {
        return /^hsla\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/.test(value);
      },
      keyword: function(value) {
        return this.keywords.indexOf(value) !== -1;
      },
      rgb: function(value) {
        var regexInteger = /^rgb\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){2}(\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*)\)$/;
        var regexPercent = /^rgb\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/;
        return regexInteger.test(value) || regexPercent.test(value);
      },
      rgba: function(value) {
        var regexInteger = /^rgba\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
        var regexPercent = /^rgba\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
        return regexInteger.test(value) || regexPercent.test(value);
      }
    };

    validator.extend('isColor',
    /**
     * Is Color
     * @param  {string} str The string to validate
     * @return {boolean}    Whether is valid or not.
     */
    function (str) {
      var types = _ValidatorColor.types;
      var isValid = false;

      for (var i = 0, l = types.length; i < l; i++) {
        isValid = isValid || _ValidatorColor[types[i]](str);
        if (isValid) {
          return true;
        }
      }

      return false;
    });

    validator.extend('isRgbaColor',
    /**
     * Is rgba Color
     * @param  {string} str The string to validate
     * @return {boolean}    Whether is valid or not.
     */
    function (str) {
      return _ValidatorColor.rgba(str);
    });

    validator.extend('isVar',
    /**
     * Is Var
     * @param  {string} str The string to validate
     * @return {boolean}    Whether is valid or not.
     */
    function (str) {
      return validator.matches(str, Regexes._simpleVariable_match);
    });

    validator.extend('isMultipleOf',
    /**
     * Is Multiple of
     *
     * Take a look at the @link(http://stackoverflow.com/q/12429362/1938970,
     * stackoverflow question) about this topic. This solution is an ok
     * compromise. We use `Math.abs` to convert negative number to positive
     * otherwise the minor comparison would always return true for negative
     * numbers.
     *
     * @param  {string}  number   [description]
     * @param  {string}  multiple [description]
     * @return {Boolean}          [description]
     */
    function isMultipleOf(number1, number2) {
      var a = Math.abs(number1);
      var b = Math.abs(number2);
      var result = Math.round( Math.round(a * 100000) % Math.round(b * 100000) ) / 100000;
      return result < 1e-5;
    });

    validator.extend('is_int',
    /**
     * Is int (php js)
     * @see http://phpjs.org/functions/is_int/
     * @param  {?}  mixed_var
     * @return {boolean}
     */
    function is_int(mixed_var) {
      var number = Number(mixed_var);
      return number === +number && isFinite(number) && number % 1 === 0;
    });

    validator.extend('is_float',
    /**
     * Is float (php js)
     * @see http://phpjs.org/functions/is_float/
     * @param  {?}  mixed_var
     * @return {boolean}
     */
    function is_float(mixed_var) {
      var number = Number(mixed_var);
      return +number === number && (!isFinite(number) || number % 1 !== 0);
    });

  })();


  /**
   * Utils
   *
   * @requires Regexes
   */
  var Utils = (function () {

    var _IMAGES_BASE_URL = api.constants['IMAGES_BASE_URL'];
    var _DOCS_BASE_URL = api.constants['DOCS_BASE_URL'];

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
      _toBoolean: function (value) {
        return typeof value === 'boolean' ? value : !!parseInt(value, 10);
      },
      /**
       * Strip HTML from input
       * @link(http://stackoverflow.com/q/5002111/1938970)
       * @param  {string} input
       * @return {string}
       */
      stripHTML: function (input) {
        return $(document.createElement('div')).html(input).text();
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
          try {
            // try this so it become possible to use this function even
            // with WordPress native controls which don't have this method
            controlToFocus.inflate(true);

            // always deactivate search, it could be that we click on this
            // link from a search result try/catch because search is not
            // always enabled
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
       * Force `setting.set`.
       * Use case:
       * When a required text control content gets deleted by the user,
       * the extras dropdown shows the reset buttons enabled but clicking on any
       * of them doesn't give any effect in the UI. Why? Because when the input
       * field gets emptied the validate function set the setting to the last
       * value using `return this.setting()`, this returning value it is likely
       * to be the same as the initial session or the factory value, therefore
       * before and after the user has clicked the reset button the value of the
       * setting cold stay the same. Despite this make sense, the input field
       * gets out of sync since once it become empty (while the setting value
       * remains the latest valid value).
       * The callback that should be called on reset (the `syncUIfromAPI` method)
       * in this scenario doesn't get called because in the WordPress
       * `customize-base.js#187` there is a check that return the function if the
       * setting has been set with the same value as the last one, preventing so
       * to fire the callbacks binded to the setting and, with these, also our
       * `syncUIfromAPI` that would update the UI, our input field with the
       * resetted value. To overcome this problem we can force the setting to set
       * anyway by temprarily set the private property `_value` to a dummy value
       * and then re-setting the setting to the desired value, in this way the
       * callbacks are fired and the UI get back in sync.
       *
       * @param  {wp.customize.Setting} setting
       * @param  {string} value
       */
      _forceSettingSet: function (setting, value, dummyValue) {
        setting['_value'] = dummyValue || 'dummy'; // whitelisted from uglify mangle regex private names \\
        setting.set(value);
      },
      /**
       * Is setting value (`control.setting()`) empty?
       * Used to check if required control's settings have instead an empty value
       * @see php class method `PWPcp_Sanitize::is_setting_value_empty()`
       * @param  {string}  value
       * @return {Boolean}
       */
      _isSettingValueEmpty: function (value) {
        // first try to compare it to an empty string
        if (value === '') {
          return true;
        } else {
          // if it's a jsonized value try to parse it and
          try {
            // if it-s a jsonized value try to parse it
            value = JSON.parse(value);
          } catch(e) {}

          // see if we have an empty array or an empty object
          if ((_.isArray(value) || _.isObject(value)) && _.isEmpty(value)) {
            return true;
          }

          return false;
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
      }
    };
  })();

  // export to public API
  api.Utils = Utils;

  /* global Modernizr, WpTight */

  /**
   * Skeleton element wrappers
   *
   * @requires WpTight
   */
  var Skeleton = (function () {
    var _wpSidebar;

    /**
     * Init
     */
    function _init () {
      _wpSidebar = WpTight.el.sidebar[0];
    }

    // @public API
    return {
      init: function () {
        _init();
        // set elements as properties
        this.$loader = $('#pwpcp-loader');
        this.title = document.getElementById('pwpcp-title');
        this.text = document.getElementById('pwpcp-text');
      },
      loading: function () {
        body.classList.add('pwpcp-loading');
      },
      loaded: function () {
        body.classList.remove('pwpcp-loading');
      },
      show: function () {
        this.$loader.show();
      },
      hide: function () {
        if (Modernizr.webworkers) {
          this.$loader.fadeOut();
        } else {
          this.$loader.hide();
        }
      },
      /**
       * Check if the WordPress sidebar has a scrollbar and toggle class on it.
       *
       * @link http://stackoverflow.com/a/4814526/1938970
       *
       * @return {boolean} [description]
       */
      hasScrollbar: function () {
        body.classList.toggle('pwpcp-has-scrollbar', _wpSidebar.scrollHeight > _wpSidebar.clientHeight);
      }
    };
  })();

  // @@todo ............................................................................. \\
  // export to public API
  api.Skeleton = Skeleton;

  var previewer = wpApi.Previewer;

  var customizeFirstLoad = true;

  wpApi.Previewer = previewer.extend({
    refresh: function() {
      // call the 'parent' method
      previewer.prototype.refresh.apply(this);

      // on iframe loaded
      this.loading.done(function () {

        // the first load is handled in the Compiler already
        // where we wait for the less callback on compile done
        if (customizeFirstLoad) {
          Skeleton.hide();
        } else {
          customizeFirstLoad = false;
        }
      });
    }
  });


  /* global WpTight */

  /**
   * Notices
   *
   * @requires WpTight
   */
  var Notices = (function () {

    var _$tpl = $(
      '<div class="pwpcp-notices"></div>'
    );

    function _create() {
      // WpTight.el.controls.append(_$tpl);
    }

    function _setText(text) {
      _$tpl.text(text);
      // return _$tpl;
    }

    // @public API
    return {
      init: function () {
        _create();
      },
      // init: _init,
      add: function () {

      },
      set: _setText
    };
  })();

  // export to public API
  api.Notices = Notices;

  /* global Screenpreview */

  /**
   * Tabs
   *
   * Manage tabbed content inside controls
   *
   * @requires Screenpreview
   */
  var Tabs = (function () {

    var CLASS_TAB_SELECTED = 'selected';
    var SELECTOR_TAB = '.pwpcp-tab';
    var SELECTOR_TAB_CONTENT = '.pwpcp-tab-content';

    /**
     * Uses event delegation so we are able to bind our 'temporary'
     * DOM removed and reappended by the controls
     */
    function _init () {
      $document.on('click', SELECTOR_TAB, function() {
        var area = this.parentNode.parentNode; // pwpcptoimprove \\
        var tabs = area.getElementsByClassName('pwpcp-tab');
        var panels = area.getElementsByClassName('pwpcp-tab-content');
        var isScreenPicker = area.classList.contains('pwpcp-screen-picker');
        var tabAttrName = isScreenPicker ? 'data-screen' : 'data-tab';
        var target = this.getAttribute(tabAttrName);

        // remove 'selected' class from all the other tab links
        for (var i = tabs.length - 1; i >= 0; i--) {
          tabs[i].classList.remove(CLASS_TAB_SELECTED);
        }
        // add the 'selected' class to the clicked tab link
        this.className += ' ' + CLASS_TAB_SELECTED;

        // loop through panels and show the current one
        for (var j = panels.length - 1; j >= 0; j--) {
          var panel = panels[j];
          var $panelInputs = $('input, .ui-slider-handle', panel);
          if (panel.getAttribute(tabAttrName) === target) {
            panel.classList.add(CLASS_TAB_SELECTED);
            // reset manual tabindex to normal browser behavior
            $panelInputs.attr('tabindex', '0');
          } else {
            panel.classList.remove(CLASS_TAB_SELECTED);
            // exclude hidden `<input>` fields from keyboard navigation
            $panelInputs.attr('tabindex', '-1');
          }
        }

        // if this tabbed area is related to the screenpreview then notify it
        if (isScreenPicker) {
          try {
            api.components.Screenpreview.change(true, target);
          } catch(e) {
            console.warn('Tabs tried to use screenpreview, which is undefined.', e);
          }
        }
      });
    }

    function _updateScreenPickerTabs (size, $container) {
      var $screenPickers = $('.pwpcp-screen-picker', $container);
      $screenPickers.each(function () {
        var $area = $(this);
        var $tabs = $area.find(SELECTOR_TAB);
        var $panels = $area.find(SELECTOR_TAB_CONTENT);
        var filter = function () {
          return this.getAttribute('data-screen') === size;
        };
        var $tabActive = $tabs.filter(filter);
        var $panelActive = $panels.filter(filter);
        $tabs.removeClass(CLASS_TAB_SELECTED);
        $panels.removeClass(CLASS_TAB_SELECTED);
        $tabActive.addClass(CLASS_TAB_SELECTED);
        $panelActive.addClass(CLASS_TAB_SELECTED);
      });
    }

    // @public API
    return {
      init: _init,
      /**
       * Update statuses of all tabs on page up to given screen size.
       *
       * @param  {string} size Screenpreview size (`xs`, `sm`, `md`, `lg`)
       */
      changeSize: function (size) {
        _updateScreenPickerTabs(size, document);
      },
      /**
       * Sync the tabs within the given container
       * with current Screenpreview size
       *
       * @param {jQuery} $container A container with tabbed areas (probably a control container)
       */
      syncSize: function ($container) {
        _updateScreenPickerTabs(Screenpreview.getSize(), $container);
      }
    };
  })();

  // export to public API
  api.Tabs = Tabs;

  /* global Utils */

  /**
   * Tooltips
   * with additional content regarding controls
   *
   * @requires Utils
   */
  var Tooltips = (function () {

    /**
     * Hold reference to marked js plugin,
     * it might be not here.
     * @type {function()}
     */
    var marked = window.marked;

    /**
     * Common options for both "help" and "guide" tooltips.
     *
     * @type {Object}
     */
    var _optsCommon = {
      placement: 'auto',
      constrains: 'horizontal',
      width: 300,
      // @@doubt maybe allow multiple guides opend at the same time? \\
      multi: false,
      padding: true,
      delay: {
        show: 500
      }
    };

    /**
     * Specific options for "guide" tooltips.
     *
     * @type {Object}
     */
    var _optsGuide = _.extend({
      trigger: 'click',
      closeable: true
    }, _optsCommon);

    /**
     * Specific options for "guide" tooltips.
     *
     * @type {Object}
     */
    var _optsHelper = _.extend({
      trigger: 'hover'
    }, _optsCommon);

    /**
     * Init guides tooltips
     *
     * When the user clicks outside a popover all of them are closed
     * and event is triggered on document, we listen to it and stop all
     * videos that are maybe playing inside the popovers.
     *
     * @return {void}
     */
    function _initGuides () {
      $document.on('hiddenAll.webui.popover', _stopVideos);
    }

    /**
     * Stop all videos inside iframes in the popovers.
     *
     * @return {void}
     */
    function _stopVideos () {
      var popovers = document.getElementsByClassName('webui-popover');
      for (var i = 0, l = popovers.length; i < l; i++) {
        var iframes = popovers[i].getElementsByTagName('iframe');
        if (iframes.length) {
          var iframe = iframes[0];
          // from here: http://stackoverflow.com/a/17629387/1938970
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      }
    }

    /**
     * Create helper for stuff inside a single control, for instance
     * we use it to display help on hover on some radio inputs.
     *
     * @param  {jQuery} $element
     * @return {void}
     */
    function _createHelperInsideControl ($element) {
      $element.one('mouseenter', function () {
        var data = _getPopoverData($element.data());
        var opts = _.extend(_optsHelper, data);
        $element.webuiPopover(opts)
          .on('hidden.webui.popover', function () {
            _stopVideos();
          });
      });
    }

    /**
     * Create guide tooltip popover for the given control.
     * Use jQuery `one()` to init the popover plugin only the first
     * time the user hover the control, a small optimization.
     * // @@doubt should we support this on mobile? probably not \\
     *
     * @param  {Object} control The customize control object
     * @return {void}
     */
    function _createGuideForControl (control) {
      var $container = control.container;

      $container.one('mouseenter', function () {
        var data = _getPopoverData(control.params.guide);
        var opts = _.extend(_optsGuide, data);
        $container.find('.pwpcp-guide')
          .webuiPopover(opts)
          .on('shown.webui.popover', function () {
            $container.addClass('pwpcp-guide-open');
            $document.on('hiddenAll.webui.popover', function () {
              $container.removeClass('pwpcp-guide-open');
            });
          })
          .on('hidden.webui.popover', function () {
            $container.removeClass('pwpcp-guide-open');
            $document.off('hiddenAll.webui.popover');
            _stopVideos();
          });
      });
    }

    /**
     * Destroy webuiPopover instance to free up memory,
     * We do this also because with our dynamic controls which get always removed
     * and readded to the DOM, the popover plugin would just keep creating new DOM
     * for the same control guide after this has been 'deinflated' and 'reinflated'.
     *
     * @param  {Object} control The customize control object.
     * @return {void}
     */
    function _destroyGuideOfControl (control) {
      control.container.find('.pwpcp-guide').webuiPopover('destroy');
    }

    /**
     * Get popover content from the given control data object
     * (`control.params.guide`) or the data from the DOM wit $(el).data()
     *
     * @param {Object} data     [description]
     * @return {String} The html string ready with the template for the popover
     */
    function _getPopoverData (data) {
      var content = '';
      var docs = data.docs;
      var img = data.img;
      var text = data.text;
      var video = data.video;
      if (img) {
        content += '<img class="pwpcp-popover--img" src="' + Utils.getImageUrl(img) + '">';
      }
      // use markdown if available
      if (text && marked) {
        content += '<div class="pwpcp-popover--text">' + marked(text) + '</div>';
      // otherwise use plain text
      } else if (text) {
        content += '<p class="pwpcp-popover--text">' + text + '</p>';
      }
      if (video) {
        content +=
          '<span class="spinner pwpcp-popover--spinner"></span>' +
          '<iframe class="pwpcp-popover--iframe" width="250" height="152"' +
            ' src="//www.youtube-nocookie.com/embed/' + video +
            '?rel=0&amp;showinfo=0&amp;enablejsapi=1"' +
            ' frameborder="0" allowfullscreen>' +
          '</iframe>';
      }
      if (docs) {
        content += '<div class="pwpcp-popover--footer">' +
          '<a target="_blank" href="' + Utils.getDocsUrl(docs) + '">Read more on the docs</a>' +
          ' <i class="dashicons dashicons-external"></i>' +
        '</div>';
      }
      return {
        title: data.title || null,
        content: content
      };
    }

    // @public API
    return {
      init: function () {
        _initGuides();
        // Init bootstrap tooltips
        // $('.pwpcp-tip').tooltip();
      },
      createHelpers: function (elements) {
        for (var i = elements.length - 1; i >= 0; i--) {
          _createHelperInsideControl($(elements[i]));
        }
      },
      createGuide: _createGuideForControl,
      destroyGuide: _destroyGuideOfControl
    };
  })();

  // export to public API
  api.Tooltips = Tooltips;


  /**
   * Collect here controls prototypes
   *
   * @type {Object}
   */
  api.controls = {};
  /* global Skeleton, Utils, Tooltips */

  /**
   * Control Base class
   *
   * Change a bit the default Customizer Control class.
   * Render controls content on demand when their section is expanded
   * then remove the DOM when the section is collapsed
   *
   * @see PHP class PWPcp_Customize_Control_Base.
   * @class
   * @augments wp.customize.Control
   */
  // export to our API
  api.controls.Base = wpApi.Control.extend({
    /**
     * Tweak the initialize methods.
     *
     * @param  {string} id      The control id
     * @param  {Object} options The control options
     */
    initialize: function(id, options) {
      var control = this;
      var settings;
      var advancedClass;

      // add default params object
      control.params = {};

      _.extend(control, options || {});

      control.id = id;

      // add a flag so that we are able to recognize our
      // custom controls, let's keep it short, so we need
      // only to check `if (control.pwpcp)`
      control.pwpcp = 1;

      // control.selector = '#customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
      // control.templateSelector = 'customize-control-' + control.params.type + '-content';
      advancedClass = control.params.advanced ? ' pwpcp-control-advanced' : '';

      var container = document.createElement('li');
      container.id = 'customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
      container.className = 'customize-control pwpcp-control customize-control-'
        + control.params.type + advancedClass;

      control.container = $(container); // @@tobecareful check render() in PWPcp_Customize_Control_Base \\

      // save a reference of the raw DOM node, we're gonna use it more
      // than the jquety object `container` (which we can't change, because it's
      // used by methods which we don't override)
      control._container = container;

      control.deferred = {
        embedded: new $.Deferred()
      };
      control.section = new wpApi.Value();
      control.priority = new wpApi.Value();
      control.active = new wpApi.Value();
      control.activeArgumentsQueue = [];

      control.active.bind( function ( active ) {
        var args = control.activeArgumentsQueue.shift();
        args = $.extend( {}, control.defaultActiveArguments, args );
        control.onChangeActive( active, args );
      } );

      control.section.set( control.params.section );
      control.priority.set( isNaN( control.params.priority ) ? 10 : control.params.priority );
      control.active.set( control.params.active );

      wpApi.utils.bubbleChildValueChanges( control, [ 'section', 'priority', 'active' ] );

      // Associate this control with its settings when they are created
      settings = $.map( control.params.settings, function( value ) {
        return value;
      });

      wpApi.apply( wpApi, settings.concat( function () {
        control.settings = {};
        for ( var key in control.params.settings ) {
          control.settings[ key ] = wpApi( control.params.settings[ key ] );
        }

        control.setting = control.settings['default'] || null;

        // embed controls only when the parent section get clicked to keep the DOM light,
        // to make this work all data can't be stored in the DOM, which is good
        wpApi.section( control.section.get(), function ( section ) {
          section.expanded.bind(function (expanded) {
            if (expanded) {
              control.inflate();
            } else {
              control.deflate();
            }
          });
        });
      }) );

      // an @abstract method to override
      control.onInit();

      // Add custom validation function overriding the empty function from WP API.
      this.setting.validate = this._validateWrap.bind(this);

      // bind setting change to control method to reflect a programmatic
      // change on the UI, only if the control is rendered
      this.setting.bind(function (value) {
        if (this.rendered) {
          this.syncUIFromAPI.call(this, value);
        }
      }.bind(this));
    },
    /**
     * Validate wrap function.
     * Always check that required setting (not `optional`) are not empty,
     * if it pass the check call the control specific abstract `validate` method.
     *
     * // @@doubt not sure whether this should be private or not \\
     * @param  {string} newValue
     * @return {string} The newValue validated or the last setting value.
     */
    _validateWrap: function (newValue) {
      if ( !this.params.optional && Utils._isSettingValueEmpty(newValue)) {
        this._onValidateError({ error: true, msg: api.l10n['vRequired'] });
        this._currentValueHasError = true;
        return this.setting();

      } else {
        newValue = this.sanitize(newValue);
        var validationResult = this.validate(newValue);

        if (validationResult.error) {
          this._onValidateError(validationResult);
          this._currentValueHasError = true;
          return this.setting();
        } else {
          this._onValidateSuccess(validationResult);
          this._currentValueHasError = false;
          return validationResult;
        }
      }
    },
    /**
     * On validation error (optionally override it in subclasses)
     * @abstract
     * @param  {object<string,boolean|string>} error `{ error: true, msg: string }`
     */
    _onValidateError: function (error) {
      var msg = error && error.msg ? error.msg : api.l10n['vInvalid'];
      this._container.classList.add('pwpcp-error');
      this._container.setAttribute('data-pwpcp-msg', msg);
    },
    /**
     * On validation success (optionally override it in subclasses)
     * @abstract
     */
    _onValidateSuccess: function () {
      this._container.classList.remove('pwpcp-error');
      this._container.removeAttribute('data-pwpcp-msg');
    },
    /**
     * Validate
     *
     * @abstract
     * @param  {string} newValue
     * @return {string} The newValue validated
     */
    validate: function (newValue) {
      return newValue;
    },
    /**
     * Sanitize
     *
     * @abstract
     * @param  {string} newValue
     * @return {string} The newValue sanitized
     */
    sanitize: function (newValue) {
      return newValue;
    },
    /**
     * Sync UI with value coming from API, a programmatic change like a reset.
     *
     * @abstract
     * @param {string} value The new setting value.
     */
    /* jshint unused: false */
    syncUIFromAPI: function (value) {},
    /**
     * Triggered when the control has been initialized
     *
     * @abstract
     */
    onInit: function() {},
    /**
     * Render the control from its JS template, if it exists.
     *
     */
    renderContent: function () {
      var template;
      var _container = this._container;
      var templateSelector = 'customize-control-' + this.params.type + '-content';

      // Replace the container element's content with the control.
      if ( document.getElementById( 'tmpl-' + templateSelector ) ) {
        template = wp.template( templateSelector );
        if ( template && _container ) {

          /* jshint funcscope: true */
          if (DEBUG) var t = performance.now();

          // render and store it in the params
          this.params.template = _container.innerHTML = template( this.params ).trim();

          // var frag = document.createDocumentFragment();
          // var tplNode = document.createElement('div');
          // tplNode.innerHTML = template( this.params ).trim();
          // frag.appendChild(tplNode);
          // this.params.template = frag;
          // _container.appendChild(frag);

          console.log('%c renderContent of ' + this.params.type + '(' + this.id +
           ') took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7');
        }
      }
    },
    /**
     * We don't need this method
     */
    dropdownInit: null,
    /**
     * Triggered just before the control get deflated from DOM
     *
     * @abstract
     */
    onDeflate: function () {},
    /**
     * Remove the DOM of the control.
     * In case the DOM store is empty (the first time
     * this method get called) it fills it.
     */
    deflate: function () {
      /* jshint funcscope: true */
      if (DEBUG) var t = performance.now();

      var container = this._container;

      if (!this.params.template) {
        this.params.template = container.innerHTML.trim();
      }

      // call the abstract method
      this.onDeflate();

      // destroy guides to free up DOM
      this._destroyGuide(this);

      // and empty the DOM from the container deferred
      // the slide out animation of the section doesn't freeze
      _.defer(function () {
        // due to the timeout we need to be sure that the section is not expanded
        if (!wpApi.section(this.section.get()).expanded.get()) {

          /* jshint funcscope: true */
          // if (DEBUG) var t = performance.now();

          // Super fast empty DOM element
          // @link(http://jsperf.com/jquery-html-vs-empty-vs-innerhtml/20)
          // while (container.lastChild) {
          //   container.removeChild(container.lastChild);
          // }

          // @@doubt, most of the times innerHTML seems to be faster, maybe when
          // there are many DOM elements to remove, investigate here \\
          container.innerHTML = '';

          console.log('%c deflate of ' + this.params.type + '(' + this.id + ') took '
           + (performance.now() - t) + ' ms.', 'background: #D2FFF1');

          // flag control that it's not rendered
          this.rendered = false;
        }
      }.bind(this));

    },
    /**
     * Inflate
     *
     * Render or 'inflate' the template of the control. The first time render it
     * from the js template, afterward retrieve the DOM string from the `template`
     * param store. After the template has been rendered call the `ready` method,
     * overridden in each control with their own specific logic. Also put a flag
     * `rendered` on the control instance to indicate whether the control is
     * rendered or not.
     *
     * @param  {boolean} shouldWeResolveEmbeddedDeferred Sometimes (i.e. for the
     *                                                   `control.focus()` method)
     *                                                   we need to resolve embed
     */
    inflate: function (shouldWeResolveEmbeddedDeferred) {
      /* jshint funcscope: true */
      if (DEBUG) var t = performance.now();
      if (!this.params.template) {
        this.renderContent();
        // console.log('%c inflate DOM of ' + this.params.type + ' took ' +
        //   (performance.now() - t) + ' ms.', 'background: #EF9CD7');
        this.rendered = true;
        this.ready();
      } else {
        if (!this.rendered) {
          this._container.innerHTML = this.params.template;
          // console.log('%c inflate DOM of ' + this.params.type + ' took ' +
          //   (performance.now() - t) + ' ms.', 'background: #EF9CD7');
        }
        this.rendered = true;
        this.ready();
      }
      if (shouldWeResolveEmbeddedDeferred) {
        this.deferred.embedded.resolve();
      }
      this._guide();
      this._help();
      this._extras();
      // errors get resetted because on ready we fill the values in the UI with
      // the value of `this.setting()` which can never be not valid (see the
      // `_validateWrap` method above)
      this._onValidateSuccess();

      console.log('%c inflate of ' + this.params.type + ' took ' +
        (performance.now() - t) + ' ms.', 'background: #D2FFF1');
    },
    /**
     * Softenize
     *
     * Normalize setting for soft comparison.
     *
     * @abstract
     * @static
     * @private
     * @param  {?} value Could be the original, the current, or the initial
     *                   session value
     * @return {string} The 'normalized' value passed as an argument.
     */
    softenize: function (value) {
      return value;
    },
    /**
     * Guide
     *
     * Manage the initialization of control guides.
     *
     * @use Tooltips
     * @return {void}
     */
    _guide: function () {
      if (this.params.guide && Tooltips) {
        Tooltips.createGuide(this);
      }
    },
    /**
     * Destroy guides on control deflate
     *
     * @use Tooltips
     * @return {void}
     */
    _destroyGuide: function () {
      if (this.params.guide && Tooltips) {
        Tooltips.destroyGuide(this);
      }
    },
    /**
     * Manage the initialization of control helpers
     *
     * @use Tooltips
     * @return {void}
     */
    _help: function () {
      if (!Tooltips) {
        return;
      }
      var helpers = this._container.getElementsByClassName('pwpcp-help');
      if (helpers) {
        Tooltips.createHelpers(helpers);
      }
    },
    /**
     * Manage the extras dropdown menu of the control.
     *
     */
    _extras: function () {
      var self = this;
      /**
       * Reference to abstract method different in various control's subclasses
       * @type {function(*)}
       */
      var _maybeSoftenizeValue = this.softenize;
      // constants
      var CLASS_RESET_FACTORY = 'pwpcp-extras-reset';
      var CLASS_RESET_LAST = ' pwpcp-extras-reset_last';
      var CLASS_DISABLED = ' pwpcp-disabled';
      // DOM
      var container = this._container;
      var area = container.getElementsByClassName('pwpcp-extras')[0];
      var toggle = container.getElementsByClassName('pwpcp-extras-btn')[0];
      var btnResetLast = container.getElementsByClassName('pwpcp-extras-reset_last')[0];
      var btnResetFactory = container.getElementsByClassName('pwpcp-extras-reset')[0];
      var btnHide = container.getElementsByClassName('pwpcp-extras-hide')[0];
      // value variables, uses closure
      var setting = this.setting;
      var initialValue = this.params.vInitial;
      var factoryValue = this.params.vFactory;
      // state
      var isOpen = false;

      // handlers
      var _closeExtras = function () {
        container.classList.remove('pwpcp-extras-open');
      };
      /**
       * Reset setting to the value at the beginning of the session.
       * It closes the `extras` dropdown.
       *
       */
      var _resetLastValue = function () {
        Utils._forceSettingSet(setting, initialValue);
        _closeExtras();
      };
      /**
       * Reset setting to the value at the factory state
       * (as defined in the theme defaults).
       * It closes the `extras` dropdown.
       *
       */
      var _resetFactoryValue = function () {
        Utils._forceSettingSet(setting, factoryValue);
        _closeExtras();
      };
      /**
       * Enable button responsible for: resetting to initial value
       */
      var _enableBtnInitial = function () {
        btnResetLast.className = CLASS_RESET_LAST;
        btnResetLast.onclick = _resetLastValue;
      };
      /**
       * Disable button responsible for: resetting to initial value
       */
      var _disableBtnInitial = function () {
        btnResetLast.className = CLASS_RESET_LAST + CLASS_DISABLED;
        btnResetLast.onclick = '';
      };
      /**
       * Enable button responsible for: resetting to factory / theme-default value
       */
      var _enableBtnFactory = function () {
        btnResetFactory.className = CLASS_RESET_FACTORY;
        btnResetFactory.onclick = _resetFactoryValue;
      };
      /**
       * Disable button responsible for: resetting to factory / theme-default value
       */
      var _disableBtnFactory = function () {
        btnResetFactory.className = CLASS_RESET_FACTORY + CLASS_DISABLED;
        btnResetFactory.onclick = '';
      };
      /**
       * Update status (enable / disable)
       * for each control in the `extras` menu.
       */
      var _onExtrasOpen = function () {
        Skeleton.hasScrollbar(); // on open check if we have a scrollbar

        // if the control current value is not valid enable both reset buttons
        if (self._currentValueHasError) {
          _enableBtnInitial();
          _enableBtnFactory();
          return;
        }

        var currentValue = _maybeSoftenizeValue( setting.get() );

        if (currentValue === _maybeSoftenizeValue( initialValue )) {
          _disableBtnInitial();
        } else {
          _enableBtnInitial();
        }
        if (currentValue === _maybeSoftenizeValue( factoryValue )) {
          _disableBtnFactory();
        } else {
          _enableBtnFactory();
        }
      };

      /**
       * When the extras dropdown is open determine which actions are
       * enabled and bind them. If the current value is the same
       * as the one the action effect would give disable the action.
       */
      if (toggle) {
        if (DEBUG) {
          toggle.title = 'Click to dump control object into console';
        }
        toggle.onclick = function () {
          isOpen = !isOpen;
          container.classList.toggle('pwpcp-extras-open', isOpen);
          if (isOpen) {
            _onExtrasOpen();
          }
          if (DEBUG) {
            // console.log('%c Control[' + self.id + '] ' + self, 'background: #78DFFF;');
            console.info('Control[' + self.id + '] ', self);
          }
        };
      }

      if (area) {
        area.onmouseenter = function () {
          isOpen = true;
          container.classList.add('pwpcp-extras-open');
          _onExtrasOpen();
        };
        area.onmouseleave = function () {
          isOpen = false;
          // don't close immediately, wait a bit and see if the mouse is still out of the area
          setTimeout(function () {
            if (!isOpen) {
              container.classList.remove('pwpcp-extras-open');
            }
          }, 200);
        };
      }

      /**
       * Set on the hide_controls control a duplicate free
       * array with the current control id merged in.
       *
       * // @@todo, maybe don't use union here but use it in the `_validate`
       * method of the hide_controls control. \\
       */
      if (btnHide) {
        // var self = this;
        btnHide.onclick = function () {
          // @@tobecareful this is tight to class-customize.php $setting_control_id =
          // PWPcp::$OPTIONToHideS_PREFIX . '[' . $field_key . ']'; \\
          var controlToHide = wpApi.control('pwpcp[hide-controls]');
          if (controlToHide) {
            controlToHide.setting.set(_.union(controlToHide.setting(), [self.id]));
            var secondsTimeout = 5;
            container.innerHTML =
              '<a class="pwpcp-hide-undo">' +
                'Undo hide control <span class="pwpcp-timer">' + secondsTimeout + 's</span>' +
              '</a>';
            var btnHideUndo = container.getElementsByClassName('pwpcp-hide-undo')[0];
            var secondsEl = container.getElementsByClassName('pwpcp-timer')[0];
            var timerHideUndo = setInterval(function () {
              secondsTimeout--;
              secondsEl.innerHTML = secondsTimeout + 's'; // @@ie8-textContent would be enough \\
              if (secondsTimeout === 0) {
                btnHideUndo.parentNode.removeChild(btnHideUndo);
                clearInterval(timerHideUndo);
              }
            }, 1000);
            // Undo hide control handler
            btnHideUndo.onclick = function () {
              clearInterval(timerHideUndo);
              btnHideUndo.parentNode.removeChild(btnHideUndo);
              self.inflate();
              _closeExtras();
              controlToHide.setting.set(_.without(controlToHide.setting(), [self.id]));
            };
          }
        };
      }
    }
  });

  /**
   * Fix autofocus
   *
   * This is needed if autofocus is set to one
   * of our 'post-rendered' custom controls
   */
  wpApi.bind('ready', function () {
    try {
      var controlToFocusID = window._wpCustomizeSettings.autofocus.control;
      if (controlToFocusID) {
        Utils.linkControl(null, controlToFocusID);
      }
    } catch(e) {
      console.warn('Fix autofocus', e);
    }
  });

  /**
   * Control Base Input class
   *
   * @constructor
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  // export to our API
  api.controls.BaseInput = api.controls.Base.extend({
    /**
     * Sync UI with value coming from API, a programmatic change like a reset.
     * @override
     * @param {string} value The new setting value.
     */
    syncUIFromAPI: function (value) {
      // here value can be undefined if it doesn't pass the validate function
      if (value && this.__input.value !== value) {
        this.__input.value = value;
      }
    },
    /**
     * @override
     */
    ready: function () {
      var self = this;
      self.__input = self._container.getElementsByTagName('input')[0];

      // sync input and listen for changes
      $(self.__input)
        .val(self.setting())
        .on('change keyup paste', function () {
          self.setting.set(this.value);
        });
    }
  });

  /**
   * Control Base Radio class
   *
   * @constructor
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  api.controls.BaseRadio = api.controls.Base.extend({
    /**
     * @override
     */
    validate: function (newValue) {
      // validate value as a string
      if (_.isString(newValue) && this.params.choices.hasOwnProperty(newValue)) {
        return newValue;
      }
      // otherwise return last value
      else {
        return { error: true };
      }
    },
    /**
     * @override
     */
    syncUIFromAPI: function () {
      this._syncRadios();
    },
    /**
     * @override
     */
    ready: function () {
      this.__inputs = this._container.getElementsByTagName('input');
      // sync checked state on radios on ready and bind (argument `true`)
      this._syncRadios(true);
    },
    /**
     * Sync radios and maybe bind change event
     * We need to be fast here, use vanilla js.
     *
     * @param  {boolean} bindAsWell Bind on change?
     */
    _syncRadios: function (bindAsWell) {
      var value = this.setting();
      for (var i = 0, l = this.__inputs.length; i < l; i++) {
        var input = this.__inputs[i];
        input.checked = value === input.value;
        if (bindAsWell) {
          input.onchange = function (event) {
            this.setting.set(event.target.value);
          }.bind(this);
        }
      }
    }
  });

  /**
   * Control Buttonset
   *
   * @constructor
   * @augments api.controls.BaseRadio
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  wpApi.controlConstructor.pwpcp_buttonset = api.controls.BaseRadio;

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
        if (!anyColor['_format']) { // whitelisted from uglify mangle regex private names \\
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
    syncUIFromAPI: function (value) {
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
     * @link(https://bgrins.github.io/spectrum/, spectrum API)
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
     * @private
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

  /**
   * Control Base Dummy class
   *
   * It extend the WP Control class from the API and simplify it for rendering
   * pieces of DOM that are not interactive, like dividers or explanations. The
   * following code, beside the small custom part (see comments) has been copy
   * pasted from the WordPress file and just commented out of the unnecessary
   * parts. We keep the commented code here 'cause it will make it easier in the
   * future to see what is the difference with the original `Control.initialize`
   * method.
   *
   * @see wp-admin/js/customize-controls.js#732
   * @constructor
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  api.controls.Dummy = wpApi.controlConstructor.pwpcp_dummy = wpApi.Control.extend({
    initialize: function( id, options ) {
      var control = this;
      // var settings;

      control.params = {};
      $.extend( control, options || {} );
      control.id = id;
      // control.selector = '#customize-control-' + id.replace( /\]/g, '' )
      //  .replace( /\[/g, '-' );
      control.templateSelector = 'customize-control-' + control.params.type + '-content';
      // control.params.content ? $( control.params.content ) : $( control.selector );
      control.deferred = {
        embedded: new $.Deferred()
      };
      control.section = new wpApi.Value();
      control.priority = new wpApi.Value();
      control.active = new wpApi.Value();
      control.activeArgumentsQueue = [];

      /**
       * Custom code
       * let's keep it simple, keep the following code here in the initialization method
       */

      // // build a fake setting object, just to don't break normal API usage like
      // // looping through all `wp.customize.controls` and bind each `control.setting`
      control.settings = control.params.settings = control.setting = {
        bind: function () {}
      };

      // // always priority ten is just fine, no need to check
      // // if we have passed it in the params
      control.priority.set(10);

      // the wrapper for this control can always be the same, we create it in js
      // instead of php, where we can therefore override `protected function
      // render() {}` with an empty output (see PWPcp_Customize_Control_Dummy
      // php class). This remove the unnecessary presence of the `<li>` micro
      // template in the _wpCustomizeSettings JSON.
      // In addition the type of control is printed as a class name.
      control.container = $('<li class="customize-control customize-control-pwpcp_dummy '
        + control.params.type + '"></li>');

      // delete setting, unfortunately we need to create to make this fake control work.
      // We do it through the PWPcp_Customize_Setting_Dummy php class.
      try {
        delete wpApi.settings.settings[this.id];
      } catch(e) {
        console.warn('Control->Dummy->initialize: failed to delete dummy setting', e);
      }
      /* end custom code */

      control.active.bind( function ( active ) {
        var args = control.activeArgumentsQueue.shift();
        args = $.extend( {}, control.defaultActiveArguments, args );
        control.onChangeActive( active, args );
      } );

      control.section.set( control.params.section );
      // control.priority.set( isNaN( control.params.priority ) ? 10 : control.params.priority );
      control.active.set( control.params.active );

      wpApi.utils.bubbleChildValueChanges( control, [ 'section', 'priority', 'active' ] );

      // // Associate this control with its settings when they are created
      // settings = $.map( control.params.settings, function( value ) {
      //   return value;
      // });
      // wpApi.apply( wpApi, settings.concat( function () {
      //   var key;

      //   control.settings = {};
      //   for ( key in control.params.settings ) {
      //     control.settings[ key ] = wpApi( control.params.settings[ key ] );
      //   }

      //   control.setting = control.settings['default'] || null;

      //   control.embed();
      // }) );

      control.embed();

      control.deferred.embedded.done( function () {
        control.ready();
      });
    }
  });


  /**
   * Font Family Control
   *
   * @constructor
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  wpApi.controlConstructor.pwpcp_font_family = api.controls.Base.extend({
    /**
     * @override
     * @see php `PWPcp_Sanitize::font_families`
     * @param  {string|array} value [description]
     * @return {string}       [description]
     */
    validate: function (value) {
      // treat value only if it's a string (unlike the php function)
      // because here we always have to get a string.
      if (typeof value === 'string') {
        return value;
      } else {
        return { error: true };
      }
    },
    /**
     * @override
     */
    sanitize: function (value) {
      var fontFamiliesSanitized = [];
      var fontFamilies = value.split(',');
      for (var i = 0, l = fontFamilies.length; i < l; i++) {
        var _fontFamilyUnquoted = fontFamilies[i].replace(/'/g, '').replace(/"/g, '');
        fontFamiliesSanitized.push('\'' + _fontFamilyUnquoted.trim() + '\'');
      }
      return fontFamiliesSanitized.join(',');
    },
    /**
     * @override
     */
    syncUIFromAPI: function (value) {
      if (value !== this.input.value) {
        this._updateUI(value);
      }
    },
    /**
     * Destroy `selectize` instance.
     *
     * @override
     */
    onDeflate: function () {
      if (this.input  && this.input.selectize) {
        this.input.selectize.destroy();
      }
    },
    /**
     * @override
     */
    ready: function () {
      this.input = this._container.getElementsByClassName('pwpcp-selectize')[0];
      this.fontFamilies = api.constants['font_families'].map(function (fontFamilyName) {
        return { item: fontFamilyName };
      });
      this._updateUI();
    },
    /**
     * Update UI
     *
     * @param  {string} value
     */
    _updateUI: function (value) {
      var setting = this.setting;

      // if there is an instance of selectize destroy it
      if (this.input.selectize) {
        this.input.selectize.destroy();
      }

      if (value) {
        this.input.value = value || setting();
      }

      // init selectize plugin
      $(this.input).selectize({
        plugins: ['drag_drop','remove_button'],
        delimiter: ',',
        maxItems: 10,
        persist: false,
        hideSelected: true,
        options: this.fontFamilies,
        labelField: 'item',
        valueField: 'item',
        sortField: 'item',
        searchField: 'item',
        create: function (input) {
          return {
            value: input,
            text: input.replace(/'/g, '') // remove quotes from UI only
          };
        }
      })
      .on('change', function () {
        setting.set(this.value);
      })
      .on('item_remove', function (e,b) {
        console.log(this, e, b);
      });
    }
  });

  /* global Utils */

  /**
   * Control Multicheck
   *
   * @constructor
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  wpApi.controlConstructor.pwpcp_multicheck = api.controls.Base.extend({
    /**
     * @override
     * @return {string|object<string,boolean>} A JSONified Array
     */
    validate: function (rawNewValue) {
      var newValue = rawNewValue;
      // in case the value come from a reset action it is a json
      // string (as it is saed in the db) so we need to parse it
      try {
        newValue = JSON.parse(rawNewValue);
      } catch(e) {}
      if(_.isArray(newValue)) {
        var validArray = [];
        for (var i = 0; i < newValue.length; i++) {
          // only if it is an allowed choice...
          if (this.params.choices.hasOwnProperty(newValue[i])) {
            validArray.push( newValue[i] );
          }
        }
        return JSON.stringify(validArray);
      } else {
        return { error: true };
      }
    },
    /**
     * @override
     */
    syncUIFromAPI: function (value) {
      if (value !== this._getValueFromUI(true)) {
        this._syncCheckboxes();

        if (this.params.sortable) {
          this._reorder();
        }
      }
    },
    /**
     * @override
     */
    ready: function () {
      this.__inputs = this._container.getElementsByTagName('input');

      // special stuff for sortable multicheck controls
      if (this.params.sortable) {
        var self = this;
        var setting = self.setting;

        this.container.sortable({
          items: '> label',
          cursor: 'move',
          update: function () {
            setting.set(self._getValueFromUI());
          }
        });

        this._buildItemsMap();
      }

      // sync checked state on checkboxes on ready and bind (argument `true`)
      this._syncCheckboxes(true);
    },
    /**
     * @override
     */
    _buildItemsMap: function () {
      var items = this._container.getElementsByTagName('label');
      this.__itemsMap = {};

      for (var i = 0, l = items.length; i < l; i++) {
        this.__itemsMap[items[i].title] = {
          _sortable: items[i],
          _input: items[i].getElementsByTagName('input')[0]
        };
      }
    },
    /**
     * @override
     */
    _reorder: function () {
      // sort first the checked ones
      api.controls['Sortable'].prototype._reorder.apply(this);

      // then sort the unchecked ones
      var valueAsArray = JSON.parse(this.setting());
      for (var key in this.params.choices) {
        if (valueAsArray.indexOf(key) === -1) {
          var itemDOM = this.__itemsMap[key]._sortable;
          itemDOM.parentNode.removeChild(itemDOM);
          this._container.appendChild(itemDOM);
        }
      }
    },
    /**
     * Get sorted value, reaading checkboxes status from the DOM
     *
     * @param {boolean} jsonize Whether to stringify the array or not
     * @return {array|JSONized array}
     */
    _getValueFromUI: function (jsonize) {
      var valueSorted = [];
      for (var i = 0, l = this.__inputs.length; i < l; i++) {
        var input = this.__inputs[i];
        if (input.checked) {
          valueSorted.push(input.value);
        }
      }
      return jsonize ? JSON.stringify(valueSorted) : valueSorted;
    },
    /**
     * Sync checkboxes and maybe bind change event
     * We need to be fast here, use vanilla js.
     *
     * @param  {boolean} bindAsWell Bind on change?
     */
    _syncCheckboxes: function (bindAsWell) {
      var valueAsArray = JSON.parse(this.setting());
      for (var i = 0, l = this.__inputs.length; i < l; i++) {
        var input = this.__inputs[i];
        input.checked = valueAsArray.indexOf(input.value) !== -1;
        if (bindAsWell) {
          input.onchange = function (event) {
            this.setting.set(this._getValueFromUI());
          }.bind(this);
        }
      }
    }
  });

  /**
   * Control Number
   *
   * @constructor
   * @augments api.controls.BaseInput
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  // export to our API and to WordPress API
  api.controls.Number = wpApi.controlConstructor.pwpcp_number = api.controls.BaseInput.extend({
    /**
     * @override
     */
    sanitize: function (value) {
      return Number(value);
    },
    /**
     * @override
     */
    validate: function (value) {
      var params = this.params;
      var attrs = params.attrs;
      var errorMsg = '';

      if (isNaN(value)) {
        errorMsg += api.l10n['vNotNumber'];
      }
      else if (!params.allowFloat && validator.is_float(value)) {
        errorMsg += api.l10n['vNoFloat'] + ' ';
      }
      else {
        if (attrs) {
          if (attrs.min && value < attrs.min) {
            errorMsg += api.l10n['vNumberLow'] + ' ';
          }
          if (attrs.max && value > attrs.max) {
            errorMsg += api.l10n['vNumberHigh'] + ' ';
          }
          if (attrs.step && !validator.isMultipleOf(value, attrs.step)) {
            errorMsg += api.l10n['vNumberStep'] + ' ' + attrs.step;
          }
        }
      }

      // if there is an error return it
      if (errorMsg) {
        return {
          error: true,
          msg: errorMsg
        };
      // otherwise return the valid value
      } else {
        return value;
      }
    }
  });

  /**
   * Control Radio
   *
   * @constructor
   * @augments api.controls.BaseRadio
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  wpApi.controlConstructor.pwpcp_radio = api.controls.BaseRadio;

  /**
   * Control Radio Image
   *
   * @constructor
   * @augments api.controls.BaseRadio
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  wpApi.controlConstructor.pwpcp_radio_image = api.controls.BaseRadio;

  /**
   * Control Select class
   *
   * @constructor
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  // export to our API and to WordPress API
  api.controls.Select = wpApi.controlConstructor.pwpcp_select = api.controls.Base.extend({
    /**
     * override
     */
    validate: function (rawNewValue) {
      var choices = this.params.choices;
      var newValue;
      // it could come as a stringified array through a programmatic change
      // of the setting (i.e. from a a reset action)
      try {
        newValue = JSON.parse(rawNewValue);
      } catch(e) {
        newValue = rawNewValue;
      }
      // validate array of values
      if (_.isArray(newValue) && this.params.selectize) {
        var validatedArray = [];
        for (var i = 0, l = newValue.length; i < l; i++) {
          var item = newValue[i];
          if (choices.hasOwnProperty(item)) {
            validatedArray.push(item);
          }
        }
        return JSON.stringify(validatedArray);
      }
      // validate string value
      if (choices.hasOwnProperty(newValue)) {
        return newValue;
      }
      // otherwise return error
      return { error: true };
    },
    /**
     * Destroy `selectize` instance if any.
     *
     * @override
     */
    onDeflate: function () {
      if (this.__select && this.__select.selectize) {
        this.__select.selectize.destroy();
      }
    },
    /**
     * @override
     */
    syncUIFromAPI: function () {
      this._syncOptions();
    },
    /**
     * @override
     */
    ready: function () {
      var selectize = this.params.selectize || false;
      var setting = this.setting;

      this.__select = this._container.getElementsByTagName('select')[0];
      this.__options = this._container.getElementsByTagName('option');

      // use selectize
      if (selectize) {
        var options = _.extend({
          onChange: function (value) {
            setting.set(value);
          }
        }, selectize);
        $(this.__select).selectize(options);
      // or use normal DOM API
      } else {
        this.__select.onchange = function () {
          setting.set(this.value);
        };
      }

      // sync selected state on options on ready
      this._syncOptions();
    },
    /**
     * Sync options and maybe bind change event
     * We need to be fast here, use vanilla js.
     * We do a comparison with two equals `==`
     * because sometimes we want to compare `500` to `'500'`
     * (like in the font-weight dropdown) and return true from that.
     */
    _syncOptions: function () {
      var value = this.setting();

      // use selectize
      if (this.params.selectize) {
        // it could be a json array or a simple string
        try {
          this.__select.selectize.setValue(JSON.parse(value));
        } catch(e) {
          this.__select.selectize.setValue(value);
        }
      }
      // or use normal DOM API
      else {
        for (var i = 0, l = this.__options.length; i < l; i++) {
          var option = this.__options[i];
          option.selected = (value == option.value);
        }
      }
    }
  });

  /**
   * Control Font Weight
   *
   * @constructor
   * @augments api.controls.Select
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  wpApi.controlConstructor.pwpcp_font_weight = api.controls.Select;

  /* global Regexes */

  /**
   * Control Slider
   *
   * @constructor
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   * @requires Regexes
   */
  // export to our API and to WordPress API
  api.controls.Slider = wpApi.controlConstructor.pwpcp_slider = api.controls.Base.extend({
    /**
     * Let's consider '44' to be equal to 44.
     * @override
     */
    softenize: function (value) {
      return value.toString();
    },
    /**
     * @override
     */
    validate: function (newValue) {
      var params = this.params;
      var errorMsg = '';
      var unit = '';
      var number = '';

      if (params.units) {
        unit = this._extractFirstUnit(newValue);
        if (!unit || params.units.indexOf(unit) === -1) {
          errorMsg = api.l10n['vInvalidUnit'];
        }
      }

      // validate number with the api.controls.Number method
      number = api.controls.Number.prototype.validate.call(this,
        this._extractFirstNumber(newValue));

      if (number.error) {
        errorMsg += ' ' + number.msg;
      }

      if (errorMsg) {
        return {
          error: true,
          msg: errorMsg
        };
      } else {
        return number.toString() + unit;
      }
    },
    /**
     * @override
     */
    syncUIFromAPI: function (value) {
      if (value !== this._getValueFromUI()) {
        this._setPartialValue(value, 'API');
      }
    },
    /**
     * This function is divided in subfunction to make it easy to reuse part of
     * this control in other controls that extend this, such as `size_dynamic`.
     * @override
     */
    ready: function () {
      this._setDOMelements();
      this._initSliderAndBindInputs();
      // update UI with current values (wait for the slider to be initialized)
      this._updateUIcustomControl(this.setting());
    },
    /**
     * Set DOM element as control properties
     */
    _setDOMelements: function () {
      var container = this._container;
      /** @type {HTMLelement} */
      this.__inputNumber = container.getElementsByClassName('pwpcp-slider-number')[0];
      /** @type {jQuery} */
      this.__$inputUnits = $(container.getElementsByClassName('pwpcp-unit'));
      /** @type {jQuery} */
      this.__$inputSlider = $(container.getElementsByClassName('pwpcp-slider')[0]);
    },
    /**
     * Init slider and bind input UI.
     */
    _initSliderAndBindInputs: function () {
      var self = this;
      var params = self.params;
      var inputNumber = self.__inputNumber;
      var $inputSlider = self.__$inputSlider;

      // Bind click action to unit picker
      // (only if there is more than one unit allowed)
      if (params.units && params.units.length > 1) {
        var $inputUnits = self.__$inputUnits;
        $inputUnits.on('click', function () {
          $inputUnits.removeClass('pwpcp-current');
          this.className += ' pwpcp-current';
          self._setPartialValue({ _unit: this.value });
        });
      }

      // Bind number input
      inputNumber.onchange = function () {
        var value = this.value;
        $inputSlider.slider('value', value);
        self._setPartialValue({ _number: value });
      };

      // Init Slider
      var sliderOptions = params.attrs || {};
      $inputSlider.slider(_.extend(sliderOptions, {
        value: self._extractFirstNumber(),
        slide: function(event, ui) {
          inputNumber.value = ui.value;
          self._setPartialValue({ _number: ui.value });
        },
        change: function(event, ui) {
          // trigger change effect only on user input, @see
          // https://forum.jquery.com/topic/setting-a-sliders-value-without-triggering-the-change-event
          if (event.originalEvent) {
            self._setPartialValue({ _number: ui.value });
          }
        }
      }));
    },
    /**
     * Extract first found unit from value
     * @param  {?string} value [description]
     * @return {?string}       [description]
     */
    _extractFirstUnit: function (value) {
      var valueOrigin = value || this.setting();
      var matchesUnit = Regexes._extractUnit.exec(valueOrigin);
      if (matchesUnit && matchesUnit[1]) {
        return matchesUnit[1];
      }
      return null;
    },
    /**
     * Extract first number found in value
     * @param  {?string|number} value [description]
     * @return {?string}              [description]
     */
    _extractFirstNumber: function (value) {
      var valueOrigin = value || this.setting();
      var matchesNumber = Regexes._extractNumber.exec(valueOrigin);
      if (matchesNumber && matchesNumber[0]) {
        return matchesNumber[0];
      }
      return null;
    },
    /**
     * Get current `setting` value from DOM or from given arg
     * @param  {Object<string,string>} value An optional value formed as
     *                                       `{ number: ?, unit: ? }`
     * @return {string}
     */
    _getValueFromUI: function (value) {
      var output;
      if (value && value._number) {
        output = value._number.toString();
      } else {
        output = this.__inputNumber.value;
      }
      if (this.params.units) {
        if (value && value._unit) {
          output += value._unit;
        } else {
          output += this.__$inputUnits.filter('.pwpcp-current').val();
        }
      }
      return output;
    },
    /**
     * Update UI control
     *
     * Reflect a programmatic setting change on the UI.
     * @param {?string} value Optional, the value from where to extract number and unit,
     *                        uses `this.setting()` if a `null` value is passed.
     */
    _updateUIcustomControl: function (value) {
      var params = this.params;
      var number = this._extractFirstNumber(value);
      var unit = this._extractFirstUnit(value);

      // update number input
      this.__inputNumber.value = number;
      // update number slider
      this.__$inputSlider.slider('value', number);
      // update unit picker
      if (params.units) {
        this.__$inputUnits.removeClass('pwpcp-current').filter(function () {
          return this.value === unit;
        }).addClass('pwpcp-current');
      }
    },
    /**
     * Set partial value
     *
     * Wrap the `setting.set()` function doing some additional stuff.
     *
     * @private
     * @param  {string} value
     * @param  {string} from  Where the value come from (could be from the UI:
     *                        picker, dynamic fields, expr field) or from the
     *                        API (on programmatic value change).
     */
    _setPartialValue: function (value, from) {
      if (from === 'API') {
        this._updateUIcustomControl(value);
      } else {
        this.setting.set(this._getValueFromUI(value));
      }
    }
  });

  /**
   * Control Sortable
   *
   * @constructor
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  // export to our API and to WordPress API
  api.controls.Sortable = wpApi.controlConstructor.pwpcp_sortable = api.controls.Base.extend({
    /**
     * @override
     */
    validate: function (rawNewValue) {
      var choices = this.params.choices;
      var newValue;
      // it could come as a stringified array through a programmatic change
      // of the setting (i.e. from a a reset action)
      try {
        newValue = JSON.parse(rawNewValue);
      } catch(e) {
        newValue = rawNewValue;
      }
      // validate array of values
      if (_.isArray(newValue)) {
        var validatedArray = [];
        for (var i = 0, l = newValue.length; i < l; i++) {
          var item = newValue[i];
          if (choices.hasOwnProperty(item)) {
            validatedArray.push(item);
          }
        }
        return JSON.stringify(validatedArray);
      }
      else {
        return { error: true };
      }
    },
    /**
     * @override
     */
    syncUIFromAPI: function (value) {
      if (value !== this.params.lastValue) {
        this._reorder();
        this.params.lastValue = value;
      }
    },
    /**
     * @override
     */
    ready: function () {
      var setting = this.setting;
      var container = this.container;

      this._buildItemsMap();

      this.params.lastValue = this.setting();

      container.sortable({
        items: '.pwpcp-sortable',
        cursor: 'move',
        update: function () {
          setting.set(container.sortable('toArray', { attribute: 'title' }));
        }
      });
    },
    /**
     * Build sortable items map, a key (grabbed from the `title` attrbiute)
     * with the corresponding DOM element
     */
    _buildItemsMap: function () {
      var items = this._container.getElementsByClassName('pwpcp-sortable');
      this.__itemsMap = {};

      for (var i = 0, l = items.length; i < l; i++) {
        this.__itemsMap[items[i].title] = {
          _sortable: items[i]
        };
      }
    },
    /**
     * Manually reorder the sortable list, needed when a programmatic change
     * is triggered. Unfortunately jQuery UI sortable does not have a method
     * to keep in sync the order of an array and its corresponding DOM.
     */
    _reorder: function () {
      var valueAsArray = JSON.parse(this.setting());

      for (var i = 0, l = valueAsArray.length; i < l; i++) {
        var itemValue = valueAsArray[i];
        var itemDOM = this.__itemsMap[itemValue]._sortable;
        itemDOM.parentNode.removeChild(itemDOM);
        this._container.appendChild(itemDOM);
      }

      this.container.sortable('refresh');
    }
  });

  /* global Utils */

  /**
   * Control Tags class
   *
   * @constructor
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  wpApi.controlConstructor.pwpcp_tags = api.controls.Base.extend({
    /**
     * @override
     */
    validate: function (rawNewValue) {
      if (_.isString(rawNewValue)) {
        var newValue = rawNewValue;
        newValue = _.map(newValue.split(','), function (string) {
          return string.trim();
        });
        newValue = _.uniq(newValue);
        var maxItems = this.params.selectize.maxItems;
        if (maxItems && _.isNumber(maxItems)) {
          if (newValue.length > maxItems) {
            newValue = newValue.slice(0, maxItems);
          }
        }
        return Utils.stripHTML(newValue.join(','));
      }
      return { error: true };
    },
    /**
     * Destroy `selectize` instance if any.
     *
     * @override
     */
    onDeflate: function () {
      if (this.__input && this.__input.selectize) {
        this.__input.selectize.destroy();
      }
    },
    /**
     * @override
     */
    syncUIFromAPI: function (value) {
      var selectize = this.__input.selectize;
      if (selectize && selectize.getValue() !== value) {
        this.__input.value = value;
        // this is due to a bug, we should use:
        // selectize.setValue(value, true);
        // but @see https://github.com/brianreavis/selectize.js/issues/568
        // so first we have to destroy thene to reinitialize, this happens
        // only through a programmatic change such as a reset action
        selectize.destroy();
        this._initSelectize();
      }
    },
    /**
     * @override
     */
    ready: function () {
      this.__input = this._container.getElementsByTagName('input')[0];

      // fill input before to initialize selectize
      // so it grabs the value directly from the DOM
      this.__input.value = this.setting();

      this._initSelectize();
    },
    /**
     * Init selectize on text input
     */
    _initSelectize: function () {
      var setting = this.setting;
      var selectize = this.params.selectize || {};
      var options = _.extend({
        persist: false,
        create: function (input) {
          return {
            value: input,
            text: input
          };
        },
        onChange: function (value) {
          setting.set(value);
        }
      }, selectize);

      $(this.__input).selectize(options);
    }
  });

  /**
   * Control Text class
   *
   * @constructor
   * @augments api.controls.BaseInput
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  wpApi.controlConstructor.pwpcp_text = api.controls.BaseInput.extend({
    /**
     * @override
     */
    validate: function (value) {
      var attrs = this.params.attrs;
      var inputType = attrs.type || 'text';
      var errorMsg = '';

      // max length
      if (attrs.maxlength && value.length > attrs.maxlength) {
        errorMsg += api.l10n['vTooLong'];
      }
      // url
      if (inputType === 'url' && !validator.isURL(value)) {
        errorMsg += api.l10n['vInvalidUrl'];
      }
      // email
      else if (inputType === 'email' && !validator.isEmail(value)) {
        errorMsg += api.l10n['vInvalidEmail'];
      }
      // text
      else {
        // always strip HTML
        value = Utils.stripHTML(value);
      }

      if (errorMsg) {
        return {
          error: true,
          msg: errorMsg
        };
      } else {
        return value;
      }
    }
  });

  /* global tinyMCE */

  /**
   * Control Textarea class
   *
   * @constructor
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  wpApi.controlConstructor.pwpcp_textarea = api.controls.Base.extend({
    /**
     * @override
     */
    sanitize: function (newValue) {
      if (!this.params.allowHTML && !this.params.wp_editor) {
        return _.escape(newValue);
      } else {
        return newValue;
      }
    },
    /**
     * @override
     */
    validate: function (newValue) {
      if (_.isString(newValue)) {
        return newValue;
      } else {
        return { error: true };
      }
    },
    /**
     * @override
     */
    onInit: function () {
      if (this.params.wp_editor) {
        this._setWpEditorId();
      }
    },
    /**
     * Destroy tinyMCE instance
     * @override
     */
    onDeflate: function () {
      if (this.params.wp_editor) {
        // it might be that this method is called too soon, even before tinyMCE
        // has been loaded, so try it and don't break.
        try {
          tinyMCE.remove('#' + this._wpEditorID);
        } catch(e) {}
      }
    },
    /**
     * @override
     */
    syncUIFromAPI: function (value) {
      var lastValue;
      var wpEditorInstance;
      if (this.params.wp_editor) {
        wpEditorInstance = tinyMCE.get(this._wpEditorID);
        lastValue = wpEditorInstance.getContent();
      } else {
        lastValue = this.__textarea.value;
      }
      if (value && lastValue !== value) {
        if (this.params.wp_editor) {
          wpEditorInstance.setContent(value);
        } else {
          this.__textarea.value = value;
        }
      }
    },
    /**
     * @override
     */
    ready: function () {
      this.__textarea = this._container.getElementsByTagName('textarea')[0];

      // params.wp_editor can be either a boolean or an object with options
      if (this.params.wp_editor) {
        this._initWpEditor();
      } else {
        this._syncAndListen();
      }
    },
    /**
     * Sync textarea and listen for changes
     */
    _syncAndListen: function () {
      var self = this;
      $(self.__textarea)
        .val(self.setting())
        .on('change keyup paste', function () {
          self.setting.set(this.value);
        });
    },
    /**
     * Maybe init wp_editor.
     *
     * In case it's needed we load by ajax the wp_editor. We put a promise
     * on our API root object. In this way all the textareas controls that
     * implements the wp_editor can read the status of the loading scripts
     * from the same place allowing us to require the js scripts only once.
     * We pass `load`: 1 to the ajax call to infrom the php function to load
     * the script only from this call (in fact we reuse the same php function
     * later on). Once loaded the response (with the needed scripts) is
     * prepended to the body and we get rid of the doubled `dashicons-css`
     * included in the response, which creates layout problems.
     */
    _initWpEditor: function () {
      if (!api.tinyMCEload) {
        api.tinyMCEload = $.post(window.ajaxurl, {
          'action': 'pwpcp_load_wp_editor',
          'load': 1
        }, function (response) {
          $('body').prepend('<div id="pwpcp_tinymce_dummy" style="display:none">' + response + '</div>');
          // remove dashicons-css added by tinymce,
          // it interferes with the already loaded dashicons style
          $('#pwpcp_tinymce_dummy').find('#dashicons-css').remove();
        });
      }
      api.tinyMCEload.then(this._onTinymceAvailable.bind(this));
    },
    /**
     * Callback executed once the wp_edito with TinyMCE has been loaded.
     * It sets an id on this control textarea then it does an ajax call
     * to retrieve the template needed for the wp_editor. If the template
     * has already been loaded it retrieves it from memory, doing so one
     * only ajax call per control.
     */
    _onTinymceAvailable: function () {
      // dynamically set id on textarea, then use it as a target for wp_editor
      var id = this._wpEditorID;
      this.__textarea.id = id;

      if (this._wpEditorTplInjected) {
        this._initTinyMCE();
      } else {
        $.post(window.ajaxurl, {
          'action': 'pwpcp_load_wp_editor',
          'id': id
        }, this._onWpEditorLoaded.bind(this));
      }
    },
    /**
     * Get textarea id, add a suffix and replace dashes with underscores
     * as suggested by WordPress Codex.
     *
     * @see https://codex.wordpress.org/Function_Reference/wp_editor -> $editor_id
     */
    _setWpEditorId: function () {
      this._wpEditorID = this.id.replace(/-/g, '_') + '_textarea';
    },
    /**
     * Callback executed once the wp_editor has been loaded and the editor
     * template specific to this control id is available.
     *
     * @param  {?string} template The editor template from ajax or nothing when
     *                            the template is already in memory.
     */
    _onWpEditorLoaded: function (template) {
      // bail if we have already injected the template
      if (this._wpEditorTplInjected) {
        return;
      }
      // remove inline stylesheets, we don't need them again
      var templateCleaned = template.replace(/<link.*\/>/g, '');

      $(this.__textarea).replaceWith(templateCleaned);

      this._wpEditorTplInjected = true;

      this._initTinyMCE();
    },
    /**
     * Initialize tinymce on textarea
     */
    _initTinyMCE: function () {
      var setting = this.setting;
      var id = this._wpEditorID;
      // get wp_editor custom options defined by the developer through the php API
      var optionsCustom = _.isObject(this.params.wp_editor) ? this.params.wp_editor : {};
      // default wp_editor options
      var optionsDefaults = {
        menubar: false,
        toolbar1: 'styleselect,bold,italic,strikethrough,underline,blockquote,'
         + 'bullist,numlist,alignleft,aligncenter,alignright,undo,redo',
      };
      // merge the options
      var options = _.extend(optionsDefaults, optionsCustom);
      // then add the required options (the needed element id and setup callback
      // with our bindings to the WordPRess customize API)
      var optionsRequired = {
        mode: 'exact',
        elements: id,
        setup: function (editor) {
          editor.on('init', function () {
            // at a certain point it seemed that somehow we needed a timeout here,
            // without it it doesn't work. Now it works, but leave the comment here
            // for possible future problems.
            // setTimeout(function () {
            editor.setContent(setting());
            // }, 1000);
          });
          editor.on('change keyup', function () {
            setting.set(editor.getContent());
          });
        }
      };

      // in this way we make sure the required options can't be overwritten
      // by developers when declaring wp_editor support through an array of opts
      tinyMCE.init(_.extend(options, optionsRequired));
    }
  });

  /* global Utils */

  /**
   * Control Toggle
   *
   * @constructor
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   * @requires Utils
   */
  wpApi.controlConstructor.pwpcp_toggle = api.controls.Base.extend({
    /**
     * Normalize setting for soft comparison
     *
     * We need this to fix situations like: `'1' === 1` returning false,
     * due to the fact that we can't use a real soft comparison (`==`).
     *
     * @override
     * @static
     * @param  {?} value Could be the factory, the initial, or the current
     *                   session value
     * @return {string} The 'normalized' value passed as an argument.
     */
    softenize: function (value) {
      return (value === 0 || value === 1) ? value.toString() : value;
    },
    /**
     * @override
     */
    validate: function (newValue) {
      return Utils._toBoolean(newValue) ? 1 : 0;
    },
    /**
     * @override
     */
    syncUIFromAPI: function (value) {
      var valueClean = Utils._toBoolean(value);
      var inputStatus = Utils._toBoolean(this.__input.checked);
      if (inputStatus !== valueClean) {
        this.__input.checked = valueClean;
      }
    },
    /**
     * @override
     */
    ready: function () {
      this.__input = this._container.getElementsByTagName('input')[0];

      // sync input value on ready
      this.__input.checked = Utils._toBoolean(this.setting());

      // bind input on ready
      this.__input.onchange = function (event) {
        event.preventDefault();
        var value = event.target.checked ? 1 : 0;
        this.setting.set(value);
      }.bind(this);
    }
  });



  console.log('customize.js controls initialization took ' + (performance.now() - t) + ' ms.');

  /**
   * Core initialization
   *
   */
  $document.ready(function() {
    if (DEBUG) var t = performance.now();
    WpTight.init();
    Skeleton.init();
    Tabs.init();
    Tooltips.init();
    Notices.init();
    console.log('customize.js core initialization took ' + (performance.now() - t) + ' ms.');
  });
  /* global $ */

  /**
   * Temp
   *
   * Temporary js to inject at the bottom
   */
  if (DEBUG) {
    wpApi.bind( 'ready', function() {
      console.log('wp API ready');
    });
    wpApi.bind( 'save', function() {
      console.log('wp API saving ...');
    });
    wpApi.bind( 'saved', function() {
      console.log('wp API saved !');
    });
    wpApi.bind( 'activated', function() {
      console.log('wp API activated ????');
    });
  }

  /**
   * Get the prototype of a control
   * and call the 'super/parent' method
   */
  // var ControlColor = api.controls.Color.prototype;
  // ControlColor.ready.apply(this, arguments);

  // // from: https://make.wordpress.org/core/2014/10/27/toward-a-complete-javascript-api-for-the-customizer/
  // wpApi.section.each(function ( section ) {
  //   if ( ! section.panel() ) {
  //     section.expand({ allowMultiple: true });
  //   }
  // });
  //


  /**
   * Tests, snippets to use in the JS Console when developing the Customize
   *
   */
  // var dirtyCustomized = {};
  // wp.customize.each( function ( value, key ) {
  //   if ( value._dirty ) {
  //     dirtyCustomized[ key ] = value();
  //   }
  // });
  // console.log('changed (dirty) options: (' + Object.keys(dirtyCustomized).length + ') ', dirtyCustomized)

  // 'total number of options: ' + _.uniq(Object.keys(wp.customize.get())).length



})(window, document, jQuery, _, wp, PWPcp, validator);
