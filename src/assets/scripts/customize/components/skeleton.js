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

    WpTight.el.header.append(
      '<span id="k6-back" class="k6-toggle">' +
        '<span class="screen-reader-text">"' + l10n['back'] + '"</span>' +
      '</span>'
    );
  }

  // @public API
  return {
    init: function () {
      _init();
      // set elements as properties
      this.$loader = $('#k6-loader');
      this.back = document.getElementById('k6-back');
      this.title = document.getElementById('k6-title');
      this.text = document.getElementById('k6-text');
    },
    loading: function () {
      body.classList.add('k6-loading');
    },
    loaded: function () {
      body.classList.remove('k6-loading');
    },
    show: function () {
      this.$loader.show();
    },
    hide: function () {
      if (Modernizr['webworkers']) {
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
      temp.innerHTML = document.getElementById(layoutId).innerHTML;
      wrapper.appendChild(temp.firstElementChild || temp.firstChild);
    },
    /**
     * Check if the WordPress sidebar has a scrollbar and toggle class on it.
     *
     * @link http://stackoverflow.com/a/4814526/1938970
     *
     * @return {boolean} [description]
     */
    hasScrollbar: function () {
      body.classList.toggle('k6-has-scrollbar', _wpSidebar.scrollHeight > _wpSidebar.clientHeight);
    }
  };
})();

// export to public api
k6cp['Skeleton'] = Skeleton;