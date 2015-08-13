/* global Modernizr, WpTight */

/**
 * Skeleton element wrappers
 *
 * @requires WpTight
 */
var Skeleton = (function () {
  var _wpSidebar;

  /**
   * Init
   */
  function _init () {
    _wpSidebar = WpTight.el.sidebar[0];
  }

  // @public API
  return {
    init: function () {
      _init();
      // set elements as properties
      this.$loader = $('#pwpcp-loader');
      this.title = document.getElementById('pwpcp-title');
      this.text = document.getElementById('pwpcp-text');
    },
    loading: function () {
      body.classList.add('pwpcp-loading');
    },
    loaded: function () {
      body.classList.remove('pwpcp-loading');
    },
    show: function () {
      this.$loader.show();
    },
    hide: function () {
      if (Modernizr.webworkers) {
        this.$loader.fadeOut();
      } else {
        this.$loader.hide();
      }
    },
    /**
     * Inflate template rendered  from php.
     * For cross browser solution see http://stackoverflow.com/a/10381402/1938970
     * @param  {string} layoutId     The id of the script template
     * @param  {HTMLelement} wrapper The element where to append the template
     */
    inflate: function (layoutId, wrapper) {
      var temp = document.createElement('div');
      var tpl = document.getElementById(layoutId);
      if (tpl) {
        temp.innerHTML = tpl.innerHTML;
        wrapper.appendChild(temp.firstElementChild || temp.firstChild);
      } else {
        // @@todo API error handling, template doesn't exist \\
      }
    },
    /**
     * Check if the WordPress sidebar has a scrollbar and toggle class on it.
     *
     * @link http://stackoverflow.com/a/4814526/1938970
     *
     * @return {boolean} [description]
     */
    hasScrollbar: function () {
      body.classList.toggle('pwpcp-has-scrollbar', _wpSidebar.scrollHeight > _wpSidebar.clientHeight);
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
