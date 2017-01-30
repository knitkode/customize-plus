import $ from 'jquery';
import Modernizr from 'modernizr';
import { api, wpApi, body, $readyDOM } from './globals';

/**
 * Skeleton element wrappers
 *
 * @class api.core.Skeleton
 * @requires Modernizr
 */
var Skeleton = (function () {

  /** @type {JQuery} */
  var _$deferredDom = $.Deferred(); // @@todo to check if I still need it, see $reaadyDOM \\

  /**
   * Hide loader and ubnid itself
   * (we could also take advantage of the underscore `once` utility)
   */
  function _hideLoaderPreview () {
    Skeleton.hide('preview');
    wpApi.previewer.targetWindow.unbind(_hideLoaderPreview);
  }

  // @access public
  return {
    /**
     * Init
     */
    init: function () {
      $readyDOM.then(this._initOnDomReady.bind(this));
    },
    /**
     * Init on DOM ready
     */
    _initOnDomReady: function () {

      // set elements as properties
      this._loader = document.getElementById('pwpcp-loader-preview');
      this.$loader = $(this._loader);
      this.img = document.getElementById('pwpcp-loader-img');
      this.title = document.getElementById('pwpcp-loader-title');
      this.text = document.getElementById('pwpcp-loader-text');
      this._loaderSidebar = document.getElementById('pwpcp-loader-sidebar');
      this.$loaderSidebar = $(this._loaderSidebar);

      _$deferredDom.resolve();

      // the first time the iframe preview has loaded hide the skeleton loader
      wpApi.previewer.targetWindow.bind(_hideLoaderPreview);
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
    show: function (what) {
      _$deferredDom.done(function () {
        if (!what || what === 'preview') {
          this._loader.style.display = 'block';
        }
        if (!what || what === 'sidebar') {
          this._loaderSidebar.style.display = 'block';
        }
      }.bind(this));
    },
    /**
     * Hide loaders overlays, use jQuery animation if the browser supports
     * WebWorkers (this is related to the Premium Compiler component)
     * @param {string} what What to hide: 'preview' or 'sidebar' (pass nothing
     *                      to hide both)
     */
    hide: function (what) {
      _$deferredDom.done(function () {
        var shouldFade = Modernizr.webworkers;
        if (!what || what === 'preview') {
          if (shouldFade) {
            this.$loader.fadeOut();
          } else {
            this._loader.style.display = 'none';
          }
        }
        if (!what || what === 'sidebar') {
          if (shouldFade) {
            this.$loaderSidebar.fadeOut();
          } else {
            this._loaderSidebar.style.display = 'none';
          }
        }
      }.bind(this));
    }
  };
})();

// Initialize
Skeleton.init();

// export to public API
export default api.core.Skeleton = Skeleton;
