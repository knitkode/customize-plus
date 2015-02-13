/* global Skeleton, Tools */
/* exported: Support */

/**
 * Support
 *
 * @requires Skeleton, Tools
 */
var Support = (function () {

  /**
   * Init
   *
   * Immediately render template (printed in a script tag through php)
   */
  function _init () {
    Skeleton.inflate('k6-support-tpl', Tools.menu);
  }

  // @public API
  return {
    init: _init
  };
})();