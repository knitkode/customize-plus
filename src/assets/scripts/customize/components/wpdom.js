/**
 * WordPress DOM: reusable DOM elements;
 *
 * In case WordPress change selectors across versions
 * we can put some logic here to grab the desired elements
 *
 * @type {Object} // k6wptight-selectors \\
 * @private
 */
var WpDom = (function () {

  // @public API
  return {
    /** @type {jQuery} */
    $wpContainer: $('.wp-full-overlay'),

    /** @type {jQuery} */
    $wpControls: $('#customize-controls'),

    /** @type {jQuery} */
    $wpThemeControls: $('#customize-theme-controls'),

    /** @type {jQuery} */
    $wpPreview: $('#customize-preview'),

    /** @type {jQuery} */
    $wpHeader: $('#customize-header-actions'),

    /** @type {jQuery} */
    $wpSidebar: $('.wp-full-overlay-sidebar-content'),

    /** @type {jQuery} */
    $wpInfoTitle: $('#customize-info .accordion-section-title'),

    /** @type {jQuery} */
    $wpInfoContent: $('#customize-info .accordion-section-content'),

    /** @type {jQuery} */
    $wpCustomizeControls: $('#customize-theme-controls').find('ul').first(),

    /** @type {jQuery} */
    $wpBtnSave: $('#save')
  };
})();

// export to public api
k6cp['WpDom'] = WpDom;