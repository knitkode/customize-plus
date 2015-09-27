/* global Modernizr, WpTight */

/**
 * Skeleton element wrappers
 *
 * @class api.Skeleton
 * @requires Modernizr
 * @requires api.WpTight
 */
var Skeleton = (function () {

  /** @type {HTMLelement} */
  var _wpSidebar;

  // @access public
  return {
    /**
     * Init
     */
    init: function () {
      _wpSidebar = WpTight.el.sidebar[0];

      // set elements as properties
      this.$loader = $(document.getElementById('pwpcp-loader'));
      this.title = document.getElementById('pwpcp-title');
      this.text = document.getElementById('pwpcp-text');

      // the first time the iframe preview has loaded hide the skeleton loader,
      // take advantage of the underscore `once` utility
      wpApi.previewer.bind('newIframe', _.once(Skeleton.hide.bind(this)));
    },
    /**
     * Trigger loading UI state (changes based on added css class)
     */
    loading: function () {
      body.classList.add('pwpcp-loading');
    },
    /**
     * Remove loading UI state
     */
    loaded: function () {
      body.classList.remove('pwpcp-loading');
    },
    /**
     * Show 'full page' loader
     */
    show: function () {
      this.$loader.show();
    },
    /**
     * Hide 'full page' loader, use jQuery animation if the browser supports
     * WebWorkers (this is related to the Premium Compiler component)
     */
    hide: function () {
      if (Modernizr.webworkers) {
        this.$loader.fadeOut();
      } else {
        this.$loader.hide();
      }
    },
    /**
     * Check if the WordPress sidebar has a scrollbar and toggle class on it.
     *
     * {@link http://stackoverflow.com/a/4814526/1938970}
     */
    hasScrollbar: function () {
      body.classList.toggle('pwpcp-has-scrollbar',
        _wpSidebar.scrollHeight > _wpSidebar.clientHeight);
    }
  };
})();

// export to public API
api.Skeleton = Skeleton;
