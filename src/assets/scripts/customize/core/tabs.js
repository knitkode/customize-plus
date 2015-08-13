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
          console.warn('Tabs tried to use Screenpreview, which is undefined.', e)
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