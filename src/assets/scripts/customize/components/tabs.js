/* global ScreenPreview */

/**
 * Tabs
 *
 * Manage tabbed content inside controls
 *
 * @requires ScreenPreview
 */
var Tabs = (function () {

  var CLASS_TAB_SELECTED = 'selected';
  var SELECTOR_TAB = '.k6-tab';
  var SELECTOR_TAB_CONTENT = '.k6-tab-content';

  /**
   * Uses event delegation so we are able to bind our 'temporary'
   * DOM removed and reappended by the controls
   */
  function _init () {
    $document.on('click', SELECTOR_TAB, function() {
      var $area = $(this.parentNode.parentNode); // k6toimprove nasty jquery to get the `div .k6-tabbed` \\
      var $tabs = $area.find(SELECTOR_TAB);
      var $panels = $area.find(SELECTOR_TAB_CONTENT);
      var isScreenPicker = $area.hasClass('k6-screen-picker');
      var tabAttrName = isScreenPicker ? 'data-screen' : 'data-tab';
      var target = this.getAttribute(tabAttrName);

      $tabs.removeClass(CLASS_TAB_SELECTED);
      this.className += ' ' + CLASS_TAB_SELECTED;

      $panels.each(function () {
        var $panel = $(this);
        if (this.getAttribute(tabAttrName) === target) {
          $panel.addClass(CLASS_TAB_SELECTED);
        } else {
          $panel.removeClass(CLASS_TAB_SELECTED);
        }
      });

      if (isScreenPicker) {
        ScreenPreview.change(true, target);
      }
    });
  }

  function _updateScreenPickerTabs (size, $container) {
    var $screenPickers = $('.k6-screen-picker', $container);
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
     * @param  {string} size ScreenPreview size (`xs`, `sm`, `md`, `lg`)
     */
    changeSize: function (size) {
      _updateScreenPickerTabs(size, document);
    },
    /**
     * Sync the tabs within the given container
     * with current ScreenPreview size
     *
     * @param {jQuery} $container A container with tabbed areas (probably a control container)
     */
    syncSize: function ($container) {
      _updateScreenPickerTabs(ScreenPreview.getSize(), $container);
    }
  };
})();

// export to public api
K6['Tabs'] = Tabs;