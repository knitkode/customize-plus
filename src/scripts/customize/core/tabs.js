import document from 'document';
import $ from 'jquery';
import { api, wpApi, $document, $readyDOM } from './globals';

/**
 * Tabs
 *
 * Manage tabbed content inside controls
 *
 * @since 1.0.0
 * @access private
 *
 * @requires components.Screenpreview
 */
class Tabs {

  constructor () {
    /**
     * Class name for a selected tab
     * @type {string}
     */
    this._CLASS_TAB_SELECTED = 'selected';

    /**
     * Tab selector (for jQuery)
     * @type {string}
     */
    this._SELECTOR_TAB = '.kkcp-tab';

    /**
     * Tab content selector (for jQuery)
     * @type {string}
     */
    this._SELECTOR_TAB_CONTENT = '.kkcp-tab-content';

    // bootstraps on DOM ready
    $readyDOM.then(this._$onReady.bind(this));
  }

  /**
   * On DOM ready
   *
   * Uses event delegation so we are able to bind our 'temporary'
   * DOM removed and reappended by the controls
   */
  _$onReady () {
    const self = this;

    $document.on('click', self._SELECTOR_TAB, function() {
      const area = this.parentNode.parentNode; // kkcptoimprove \\
      const tabs = area.getElementsByClassName('kkcp-tab');
      const panels = area.getElementsByClassName('kkcp-tab-content');
      const isScreenPicker = area.classList.contains('kkcp-screen-picker');
      const tabAttrName = isScreenPicker ? 'data-screen' : 'data-tab';
      const target = this.getAttribute(tabAttrName);

      // remove 'selected' class from all the other tab links
      for (let i = tabs.length - 1; i >= 0; i--) {
        tabs[i].classList.remove(self._CLASS_TAB_SELECTED);
      }
      // add the 'selected' class to the clicked tab link
      this.className += ' ' + self._CLASS_TAB_SELECTED;

      // loop through panels and show the current one
      for (let j = panels.length - 1; j >= 0; j--) {
        let panel = panels[j];
        let $panelInputs = $('input, .ui-slider-handle', panel);
        if (panel.getAttribute(tabAttrName) === target) {
          panel.classList.add(self._CLASS_TAB_SELECTED);
          // reset manual tabIndex to normal browser behavior
          $panelInputs.attr('tabIndex', '0');
        } else {
          panel.classList.remove(self._CLASS_TAB_SELECTED);
          // exclude hidden `<input>` fields from keyboard navigation
          $panelInputs.attr('tabIndex', '-1');
        }
      }

      // if this tabbed area is related to the screenpreview then notify it
      if (isScreenPicker) {
        // we might not have the Screenpreview component enabled
        try {
          api.components.Screenpreview.setDevice(target);
        } catch(e) {
          console.warn('Tabs tried to use Screenpreview, which is undefined.', e);
        }
      }
    });
  }

  /**
   * Update Screen Picker Tabs
   * @param  {int|string} size   The size to which update the tabs
   * @param  {JQuery} $container An element to use as context to look for
   *                             screen pickers UI DOM
   */
  _updateScreenPickerTabs (size, $container) {
    const self = this;
    const $screenPickers = $('.kkcp-screen-picker', $container);

    $screenPickers.each(function () {
      const $area = $(this);
      const $tabs = $area.find(self._SELECTOR_TAB);
      const $panels = $area.find(self._SELECTOR_TAB_CONTENT);
      const filter = function () {
        return this.getAttribute('data-screen') === size;
      };
      const $tabActive = $tabs.filter(filter);
      const $panelActive = $panels.filter(filter);
      $tabs.removeClass(self._CLASS_TAB_SELECTED);
      $panels.removeClass(self._CLASS_TAB_SELECTED);
      $tabActive.addClass(self._CLASS_TAB_SELECTED);
      $panelActive.addClass(self._CLASS_TAB_SELECTED);
    });
  }

  /**
   * Update statuses of all tabs on page up to given screen size.
   *
   * @param  {string} size Screenpreview size (`xs`, `sm`, `md`, `lg`)
   */
  changeSize (size) {
    this._updateScreenPickerTabs(size, document);
  }

  /**
   * Sync the tabs within the given container
   * with current Screenpreview size
   *
   * @param {JQuery} $container A container with tabbed areas (probably a
   *                            control container)
   */
  syncSize ($container) {
    // we might not have the Screenpreview component enabled
    try {
      this._updateScreenPickerTabs(api.components.Screenpreview.getSize(), $container);
    } catch(e) {
      console.warn('Tabs tried to use Screenpreview, which is undefined.', e);
    }
  }
}

/**
 * @name tabs
 * @description  Instance of {@linkcode Tabs}
 *
 * @instance
 * @memberof core
 */
export default api.core.tabs = new Tabs();
