import marked from 'marked';
import hljs from 'hljs';
import { body } from './globals';

/**
 * Markdown init (with marked.js)
 * @ignore
 */
(function () {

  // bail if marked is not available on window
  if (!marked || !hljs) {
    return;
  }

  /**
   * Custom marked renderer
   * {@link http://git.io/vZ05H source}
   * 
   * @ignore
   * @type {marked}
   */
  var markedRenderer = new marked.Renderer();

  /**
   * Add `target="_blank" to external links
   *
   * @ignore
   * @param  {string} href
   * @param  {string} title
   * @param  {string} text
   * @return {string}
   */
  markedRenderer.link = function (href, title, text) {
    var external = /^https?:\/\/.+$/.test(href);
    var newWindow = external || title === 'newWindow';
    // links are always skipped from the tab index
    var out = '<a href="' + href + '" tabindex="-1"';
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
   * @ignore
   */
  marked.setOptions({
    // anchorTargetBlank: true,
    renderer: markedRenderer,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });

  body.classList.add('kkcp-markdown-supported');

})();
