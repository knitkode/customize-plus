/**
 * Control Base Dummy class
 *
 * It extend the WP Control class from the API and simplify it for rendering
 * pieces of DOM that are not interactive, like dividers or explanations. The
 * following code, beside the small custom part (see comments) has been copy
 * pasted from the WordPress file and just commented out of the unnecessary
 * parts. We keep the commented code here 'cause it will make it easier in the
 * future to see what is the difference with the original `Control.initialize`
 * method.
 *
 * @see wp-admin/js/customize-controls.js#732
 *
 * @class wp.customize.controlConstructor.pwpcp_content
 * @alias api.controls.Dummy
 * @constructor
 * @extends wp.customize.Control
 * @augments wp.customize.Class
 */
wpApi.controlConstructor.pwpcp_content = api.controls.Content = wpApi.Control.extend({
  ready: function () {
    console.log('reaaaaaady');
  },
  /**
   *
   */
  _lazyLoad: function () {
  }
});
