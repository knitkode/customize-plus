/* global Skeleton, Tools */
/* exported: Export */

/**
 * Export
 *
 * @requires Skeleton and Tools
 */
var Export = (function () {

  var COOKIE_NAME__FILENAME = 'k6-export_filename';
  var exportFilename;
  var $btnExport;
  var $textarea;
  var $textareaCopied;
  var $name;

  /**
   * Init
   *
   * Immediately render template (printed in a script tag through php)
  */
  function _init () {
    Skeleton.inflate('k6-export-tpl', Tools.menu);

    $btnExport = $('#k6-export-btn');
    $textarea = $('#k6-export-textarea');
    $textareaCopied = $('#k6-export-copied');
    $name = $('#k6-export-name');

    _setBaseFilename();

    // initially hide textarea message and input field
    $textareaCopied.hide();
    $textarea.hide().bind('copy', function() {
      $(this).slideUp();
      $textareaCopied.slideDown().delay(1500).slideUp();
    });

    // bind export button
    $btnExport.on('click', function (event) {
      // k6todo this element should be a form with js error callback \\
      event.preventDefault();
      // if all changes are saved export
      if (api.state('saved')()) {
        _export();
      // otherwise prompt the user
      } else {
        if (confirm(l10n['exportUnsaved'])) {
          _export();
        }
      }
      return false;
    });
  }

  function _setBaseFilename () {
    var cookieValue = $.cookie(COOKIE_NAME__FILENAME);
    var inputValue = $name.val();
    if (cookieValue) {
      exportFilename = cookieValue;
      $name.val(exportFilename);
    } else {
      exportFilename = inputValue;
    }
  }

  /**
   * [_export description]
   * since 2.8 ajaxurl is always defined in the
   * admin header and points to admin-ajax.php
   *
   */
  function _export () {
    Skeleton.loading();
    $.post(window.ajaxurl, {
      'action': 'k6_export'
    }).done(function (response) {
      _download(response.data);
      _fillTextarea(response.data);
      Skeleton.loaded();
    });
  }

  /**
   * Get current date as (y)(m)(d)-(h)(m)(s)
   * {@link http://stackoverflow.com/a/12550320/1938970 stackoverflow}
   *
   * @return {String} The current date, very specific, in the format I like.
   */
  function _now () {
    var d = new Date();
    var pad = function (n) { return n < 10 ? '0' + n : n.toString(); };
    return d.getFullYear() +
      pad(d.getMonth() + 1 ) +
      pad(d.getDate()) + '-' +
      pad(d.getHours()) +
      pad(d.getMinutes()) +
      pad(d.getSeconds());
  }

  function _getFilename () {
    var inputValue = $name.val();
    var cookieValue = $.cookie(COOKIE_NAME__FILENAME);
    if (inputValue !== cookieValue) {
      exportFilename = inputValue;
      $.cookie(COOKIE_NAME__FILENAME, inputValue);
    } else {
      exportFilename = cookieValue;
    }
    return exportFilename + '--' + _now();
  }

  function _download (options) {
    var link = document.getElementById('k6-download-export');
    var filename = _getFilename();
    if (!link) {
      link = $('<a id="k6-download-export"></a>').appendTo(body)[0];
    }
    link.setAttribute('download', filename + '.json');
    link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(options));
    link.click();
  }

  function _fillTextarea (options) {
    $textarea
      .val(JSON.stringify(options))
      .slideDown()
      .focus()
      .select();
  };

  // @public API
  return {
    init: _init,
    doit: _export
  };
})();
