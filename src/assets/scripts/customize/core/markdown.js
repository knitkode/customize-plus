/* global markdown */

/**
 * Markdown init
 *
 */
if (marked) {
  marked.setOptions({
    highlight: function (code, lang, callback) {
      return hljs.highlightAuto(code).value;
    }
  });
  $(body).addClass('pwpcp-markdown-supported');
}