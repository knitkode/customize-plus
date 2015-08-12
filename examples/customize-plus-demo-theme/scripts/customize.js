/* jshint */

(function (window, document, $, _, wp, api, validator) {
  'use strict';

  /** @type {Object} */
  var wpApi = wp['customize'];

  /**
   * Demo custom Control
   *
   * @constructor
   * @augments ControlBase
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   * @requires Tabs
   */
  var DemoCustomControl = api['controls']['Base'].extend({
    /**
     * On ready
     *
     * @override
     */
    ready: function() {
      // do something special
    }
  });

  wpApi['controlConstructor']['pwpcp_demo_custom_control'] = DemoCustomControl;

})(window, document, jQuery, _, wp, PWPcp, validator);
