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
      el.infoTitle = $('#customize-info .accordion-section-title');
      /** @type {jQuery} */
      el.infoContent = $('#customize-info .accordion-section-content');
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
api['WpTight'] = WpTight;
