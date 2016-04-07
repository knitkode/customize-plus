/**
 * WordPress Tight
 *
 * We can put some logic in private functions to grab the
 * right things in case WordPress change stuff across versions
 *
 * @class api.WpTight
 */
var WpTight = (function () {

  /**
   * The id of the WordPress core css with the color schema
   *
   * @private
   * @internal
   * @type {String}
   */
  var _colorSchemaCssId = 'colors-css';

  /**
   * The WordPress color schema useful selectors
   *
   * @private
   * @internal
   * @type {Object}
   */
  var _colorSchemaSelectors = {
    _primary: '.wp-core-ui .wp-ui-primary',
    _textPrimary: '.wp-core-ui .wp-ui-text-primary',
    _linksPrimary: '#adminmenu .wp-submenu .wp-submenu-head',
    _highlight: '.wp-core-ui .wp-ui-highlight',
    _textHighlight: '.wp-core-ui .wp-ui-text-highlight',
    _linksHighlight: '#adminmenu a',
    _notificationColor: '.wp-core-ui .wp-ui-text-notification'
  };

  /**
   * Get WordPress Admin colors
   *
   * @abstract
   * @return {object}
   */
  function _getWpAdminColors () {
    var stylesheet = Utils._getStylesheetById(_colorSchemaCssId);
    var schema = _colorSchemaSelectors;
    var output = {};
    for (var key in schema) {
      if (schema.hasOwnProperty(key)) {
        var selector = schema[key];
        var rules = Utils._getRulesFromStylesheet(stylesheet, selector);
        output[key] = Utils._getCssRulesContent(rules, selector);
      }
    }
    return output;
  }

  // @access public
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
      el.close = el.header.find('.customize-controls-close');
      /** @type {jQuery} */
      el.sidebar = $('.wp-full-overlay-sidebar-content');
      /** @type {jQuery} */
      el.info = $('#customize-info');
      /** @type {jQuery} */
      el.customizeControls = $('#customize-theme-controls').find('ul').first();
    },
    /**
     * The suffix appended to the styles ids by WordPress when enqueuing them
     * through `wp_enqueue_style`
     *
     * @type {string}
     */
    cssSuffix: '-css',
    /**
     * WordPress Admin colors
     *
     * @private
     * @internal
     * @type {object}
     */
    _colorSchema: _getWpAdminColors()
  };
})();

// export to public API
api.WpTight = WpTight;
