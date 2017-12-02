import document from 'document';
import $ from 'jquery';
import Modernizr from 'modernizr';
import { api, wpApi, body, $readyDOM } from './globals';

/**
 * Skeleton element wrappers
 *
 * @class api.core.Skeleton
 * @requires Modernizr
 */
const Skeleton = (function () {

  /** @type {JQuery} */
  const _$deferredDom = $.Deferred(); // @@todo to check if I still need it, see $reaadyDOM \\

  /**
   * Hide loader and unbind itself
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
      this._loader = document.getElementById('kkcp-loader-preview');
      this.$loader = $(this._loader);
      this.img = document.getElementById('kkcp-loader-img');
      this.title = document.getElementById('kkcp-loader-title');
      this.text = document.getElementById('kkcp-loader-text');
      this._loaderSidebar = document.getElementById('kkcp-loader-sidebar');
      this.$loaderSidebar = $(this._loaderSidebar);

      _$deferredDom.resolve();

      // the first time the iframe preview has loaded hide the skeleton loader
      wpApi.previewer.targetWindow.bind(_hideLoaderPreview);
    },
    /**
     * Trigger loading UI state (changes based on added css class)
     */
    loading: function () {
      body.classList.add('kkcp-loading');
    },
    /**
     * Remove loading UI state
     */
    loaded: function () {
      body.classList.remove('kkcp-loading');
    },
    /**
     * Show 'full page' loader
     */
    show: function (what) {
      _$deferredDom.done(() => {
        if (!what || what === 'preview') {
          this._loader.style.display = 'block';
        }
        if (!what || what === 'sidebar') {
          this._loaderSidebar.style.display = 'block';
        }
      });
    },
    /**
     * Hide loaders overlays, use jQuery animation if the browser supports
     * WebWorkers (this is related to the Premium Compiler component)
     * @param {string} what What to hide: 'preview' or 'sidebar' (pass nothing
     *                      to hide both)
     */
    hide: function (what) {
      _$deferredDom.done(() => {
        const shouldFade = Modernizr.webworkers;
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
      });
    }
  };
})();

// Initialize
Skeleton.init();

// export to public API
export default api.core.Skeleton = Skeleton;
