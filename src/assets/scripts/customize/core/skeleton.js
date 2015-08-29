/* global Modernizr, WpTight */

/**
 * Skeleton element wrappers
 *
 * @libraries Modernizr
 * @requires WpTight
 */
var Skeleton = (function () {

  /**
   * @type {HTMLelement}
   */
  var _wpSidebar;

  // @public API
  return {
    /**
     * Init
     */
    init: function () {
      _wpSidebar = WpTight.el.sidebar[0];
      // set elements as properties
      this.$loader = $('#pwpcp-loader');
      this.title = document.getElementById('pwpcp-title');
      this.text = document.getElementById('pwpcp-text');
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
     * @link http://stackoverflow.com/a/4814526/1938970
     */
    hasScrollbar: function () {
      body.classList.toggle('pwpcp-has-scrollbar',
        _wpSidebar.scrollHeight > _wpSidebar.clientHeight);
    }
  };
})();

// @@todo ............................................................................. \\
// export to public API
api.Skeleton = Skeleton;

var previewer = wpApi.Previewer;

var customizeFirstLoad = true;

wpApi.Previewer = previewer.extend({
  refresh: function() {
    // call the 'parent' method
    previewer.prototype.refresh.apply(this);

    // on iframe loaded
    this.loading.done(function () {

      // the first load is handled in the Compiler already
      // where we wait for the less callback on compile done
      if (customizeFirstLoad) {
        Skeleton.hide();
      } else {
        customizeFirstLoad = false;
      }
    });
  }
});
