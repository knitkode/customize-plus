/* global Skeleton, Tools */
/* exported: Advanced */

/**
 * Advanced manager
 *
 * @requires Skeleton, Tools
 */
var Advanced = (function () {

  /**
   * Init
   *
   * Immediately render template (printed in a script tag through php)
   */
  function _init () {
    Skeleton.inflate('k6-advanced-tpl', Tools.menu);
    var inputAdvanced = document.getElementById('k6-advanced-input');

    if (inputAdvanced) {
      // set status immediately
      _setAdvancedMode(inputAdvanced.checked);

      // bind input change
      inputAdvanced.onchange = function () {
        _setAdvancedMode(this.checked);
      };
    }
  }

  /**
   * Set advanced mode
   * toggling class on body
   * @param {boolean} value
   */
  function _setAdvancedMode (value) {
    body.classList.toggle('k6-advanced-enabled', value);
  }

  return {
    init: _init
  };
})();