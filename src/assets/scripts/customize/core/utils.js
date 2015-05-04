/**
 * Utils
 *
 * @requires Regexes
 */
var Utils = (function () {

  var _IMAGES_BASE_PATH = api['constants']['THEME_URI'];

  // @public API
  return {
    /**
     * To Boolean
     * '0' or '1' to boolean
     *
     * @method
     * @param  {strin|number} value
     * @return {boolean}
     */
    toBoolean: function (value) {
      return typeof value === 'boolean' ? value : !!parseInt(value, 10);
    },
    /**
     * Is an absolute URL?
     *
     * @link(http://stackoverflow.com/a/19709846/1938970)
     * @param  {String}  url The URL to test
     * @return {Boolean}     Wether is absolute or relative
     */
    isAbsoluteUrl: function (url) {
      var r = new RegExp('^(?:[a-z]+:)?//', 'i');
      return r.test(url);
    },
    /**
     * Get image url, prepending the theme url
     * (grabbed with `get_stylesheet_directory_uri`)
     * if the given url is a relative.
     *
     * @param  {String} url The image URL, relative or absolute
     * @return {String}     The absolute URL of the image
     */
    getImageUrl: function (url) {
      if ( ! this.isAbsoluteUrl(url) ) {
        url = _IMAGES_BASE_PATH + '/' + url;
      }
      // strip a possible double slash caused by the above string concatenation
      return url.replace('//', '/');
    },
    /**
     * Bind a link element or directly link to a specific control to focus
     *
     * @method
     */
    linkControl: function (linkEl, controlId) {
      var controlToFocus = wpApi.control(controlId);
      var innerLink = function () {
        controlToFocus.inflate(true);

        // always deactivate search, it could be that
        // we click on this link from a search result
        // try/catch because search is not always enabled
        try {
          api['components']['Search'].deactivate();
        } catch (e) {}

        controlToFocus.focus(); // @@doubt focus or expand ? \\
        controlToFocus.container.addClass('pwpcp-control-focused');
        setTimeout(function () {
          controlToFocus.container.removeClass('pwpcp-control-focused');
        }, 1000);
      };

      // be sure there is the control and update dynamic color message text
      if (controlToFocus) {
        if (linkEl) {
          linkEl.onclick = innerLink;
        } else {
          innerLink();
        }
      }
    },
    /**
     * Selectize render option function
     *
     * @abstract
     * @param  {Object} item     The selectize option object representation.
     * @param  {function} escape Selectize escape function.
     * @return {string}          The option template.
     */
    selectizeRenderSize: function (item, escape) {
      return '<div class="pwpcpsize-selectOption"><i>' + escape(item.valueCSS) + '</i> ' + escape(item.label) + '</div>';
    },
    /**
     * Selectize render option function
     *
     * @abstract
     * @param  {Object} item     The selectize option object representation.
     * @param  {function} escape Selectize escape function.
     * @return {string}          The option template.
     */
    selectizeRenderColor: function (item, escape) {
      return '<div class="pwpcpcolor-selectOption" style="border-color:' + escape(item.valueCSS) + '">' +
        escape(item.label) + '</div>';
    }
  };
})();

// export to public API
api['Utils'] = Utils;