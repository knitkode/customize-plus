/* global marked */

/**
 * Markdown init (with marked.js)
 *
 */
(function () {

  // bail fi marked is not available on window
  if (!marked) {
    return;
  }

  /**
   * Custom marked renderer
   * @link(https://github.com/chjj/marked/pull/451#issuecomment-49976076, source)
   * @type {marked}
   */
  var markedRenderer = new marked.Renderer();

  /**
   * Add `target="_blank" to external links
   * @param  {string} href
   * @param  {string} title
   * @param  {string} text
   * @return {string}
   */
  markedRenderer.link = function(href, title, text) {
    var external = /^https?:\/\/.+$/.test(href);
    var newWindow = external || title === 'newWindow';
    var out = '<a href="' + href + '"';
    if (newWindow) {
      out += ' target="_blank"';
    }
    if (title && title !== 'newWindow') {
      out += ' title="' + title + '"';
    }
    return out += '>' + text + '</a>';
  };

  /**
   * Set marked options
   */
  marked.setOptions({
    // anchorTargetBlank: true,
    renderer: markedRenderer,
    highlight: function (code, lang, callback) {
      return hljs.highlightAuto(code).value;
    }
  });
  $(body).addClass('pwpcp-markdown-supported');

})();