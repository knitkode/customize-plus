import document from 'document';
import $ from 'jquery';
import Modernizr from 'modernizr';
import { wpApi, body, $readyDOM } from './globals';

/**
 * Skeleton
 *
 * Element wrappers for Customize Plus Skeleton DOM.
 *
 * @since 1.0.0
 * @access private
 *
 * @requires Modernizr
 */
class Skeleton {

  constructor () {
    $readyDOM.then(() => {

      // set elements as properties
      this._loader = document.getElementById('kkcp-loader-preview');
      this.$loader = $(this._loader);
      this.img = document.getElementById('kkcp-loader-img');
      this.title = document.getElementById('kkcp-loader-title');
      this.text = document.getElementById('kkcp-loader-text');
      this._loaderSidebar = document.getElementById('kkcp-loader-sidebar');
      this.$loaderSidebar = $(this._loaderSidebar);

      // the first time the iframe preview has loaded hide the skeleton loader
      wpApi.previewer.targetWindow.bind(this._hideLoaderPreview.bind(this));
    });
  }

  /**
   * Trigger loading UI state (changes based on added css class)
   *
   */
  loading () {
    body.classList.add('kkcp-loading');
  }

  /**
   * Remove loading UI state
   *
   */
  loaded () {
    body.classList.remove('kkcp-loading');
  }

  /**
   * Show 'full page' loader
   *
   */
  show (what) {
    $readyDOM.done(() => {
      if (!what || what === 'preview') {
        this._loader.style.display = 'block';
      }
      if (!what || what === 'sidebar') {
        this._loaderSidebar.style.display = 'block';
      }
    });
  }

  /**
   * Hide loaders overlays, use jQuery animation if the browser supports
   * WebWorkers (this is related to the Premium Compiler component)
   *
   * @requires Modernizr
   * @param {string} what What to hide: 'preview' or 'sidebar' (pass nothing
   *                      to hide both)
   */
  hide (what) {
    $readyDOM.done(() => {
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

  /**
   * Hide loader and unbind itself
   * (we could also take advantage of the underscore `once` utility)
   *
   * @access package
   */
  _hideLoaderPreview () {
    this.hide('preview');
    wpApi.previewer.targetWindow.unbind(this._hideLoaderPreview);
  }
}

/**
 * @member {Object} skeleton
 * @memberof core
 * @description  Instance of {@linkcode Skeleton}
 */
const skeleton = new Skeleton();

export default skeleton
