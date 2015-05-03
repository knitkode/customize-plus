/**
 * Utils
 *
 * @requires Regexes
 */
var Utils = (function () {

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