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
   * @type {string}
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
       * @type {Object.<string, jQuery|HTMLElement>}
       */
      var el = this.el = {};

      /** @type {JQuery} */
      el.container = $('.wp-full-overlay');
      /** @type {JQuery} */
      el.controls = $('#customize-controls');
      /** @type {JQuery} */
      el.themeControls = $('#customize-theme-controls');
      /** @type {JQuery} */
      el.preview = $('#customize-preview');
      /** @type {JQuery} */
      el.header = $('#customize-header-actions');
      /** @type {JQuery} */
      el.footer = $('#customize-footer-actions');
      /** @type {JQuery} */
      el.devices = el.footer.find('.devices');
      /** @type {JQuery} */
      el.close = el.header.find('.customize-controls-close');
      /** @type {JQuery} */
      el.sidebar = $('.wp-full-overlay-sidebar-content');
      /** @type {JQuery} */
      el.info = $('#customize-info');
      /** @type {JQuery} */
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
    _colorSchema: _getWpAdminColors(),
    /**
     * WordPress query parameters used in the customize app url
     */
    _customizeQueryParamsKeys: [
      'changeset_uuid', // e.g. e6ba8e82-e628-4d6e-b7b4-39a480bc043c
      'customize_snapshot_uuid' // e.g. 52729bb7-9686-496e-90fa-7170405a5502
    ]
  };
})();

// export to public API
api.WpTight = WpTight;
