/* global Utils, marked */

/**
 * Tooltips
 * with additional content regarding controls
 *
 * @class api.Tooltips
 * @requires marked
 * @requires api.Utils
 */
var Tooltips = (function () {

  /**
   * Common options for both "help" and "guide" tooltips.
   *
   * @type {Object}
   */
  var _optsCommon = {
    placement: 'auto',
    constrains: 'horizontal',
    width: 300,
    // @@doubt maybe allow multiple guides opend at the same time? \\
    multi: false,
    padding: true,
    delay: {
      show: 500
    }
  };

  /**
   * Specific options for "guide" tooltips.
   *
   * @type {Object}
   */
  var _optsGuide = _.extend({
    trigger: 'click',
    closeable: true
  }, _optsCommon);

  /**
   * Specific options for "guide" tooltips.
   *
   * @type {Object}
   */
  var _optsHelper = _.extend({
    trigger: 'hover'
  }, _optsCommon);

  /**
   * Init guides tooltips
   *
   * When the user clicks outside a popover all of them are closed
   * and event is triggered on document, we listen to it and stop all
   * videos that are maybe playing inside the popovers.
   *
   * @return {void}
   */
  function _initGuides () {
    $document.on('hiddenAll.webui.popover', _stopVideos);
  }

  /**
   * Stop all videos inside iframes in the popovers.
   *
   * @return {void}
   */
  function _stopVideos () {
    var popovers = document.getElementsByClassName('webui-popover');
    for (var i = 0, l = popovers.length; i < l; i++) {
      var iframes = popovers[i].getElementsByTagName('iframe');
      if (iframes.length) {
        var iframe = iframes[0];
        // from here: http://stackoverflow.com/a/17629387/1938970
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    }
  }

  /**
   * Create helper for stuff inside a single control, for instance
   * we use it to display help on hover on some radio inputs.
   *
   * @param  {jQuery} $element
   * @return {void}
   */
  function _createHelperInsideControl ($element) {
    $element.one('mouseenter', function () {
      var data = _getPopoverData($element.data());
      var opts = _.extend(_optsHelper, data);
      $element.webuiPopover(opts)
        .on('hidden.webui.popover', function () {
          _stopVideos();
        });
    });
  }

  /**
   * Create guide tooltip popover for the given control.
   * Use jQuery `one()` to init the popover plugin only the first
   * time the user hover the control, a small optimization.
   * // @@doubt should we support this on mobile? probably not \\
   *
   * @param  {Object} control The customize control object
   * @return {void}
   */
  function _createGuideForControl (control) {
    var $container = control.container;

    $container.one('mouseenter', function () {
      var data = _getPopoverData(control.params.guide);
      var opts = _.extend(_optsGuide, data);
      $container.find('.pwpcp-guide')
        .webuiPopover(opts)
        .on('shown.webui.popover', function () {
          $container.addClass('pwpcp-guide-open');
          $document.on('hiddenAll.webui.popover', function () {
            $container.removeClass('pwpcp-guide-open');
          });
        })
        .on('hidden.webui.popover', function () {
          $container.removeClass('pwpcp-guide-open');
          $document.off('hiddenAll.webui.popover');
          _stopVideos();
        });
    });
  }

  /**
   * Destroy webuiPopover instance to free up memory,
   * We do this also because with our dynamic controls which get always removed
   * and readded to the DOM, the popover plugin would just keep creating new DOM
   * for the same control guide after this has been 'deinflated' and 'reinflated'.
   *
   * @param  {Object} control The customize control object.
   * @return {void}
   */
  function _destroyGuideOfControl (control) {
    control.container.find('.pwpcp-guide').webuiPopover('destroy');
  }

  /**
   * Get popover content from the given control data object
   * (`control.params.guide`) or the data from the DOM wit $(el).data()
   *
   * @param {Object} data     [description]
   * @return {String} The html string ready with the template for the popover
   */
  function _getPopoverData (data) {
    var content = '';
    var docs = data.docs;
    var img = data.img;
    var text = data.text;
    var video = data.video;
    if (img) {
      content += '<img class="pwpcp-popover--img" src="' + Utils.getImageUrl(img) + '">';
    }
    // use markdown if available
    if (text && marked) {
      content += '<div class="pwpcp-popover--text">' + marked(text) + '</div>';
    // otherwise use plain text
    } else if (text) {
      content += '<p class="pwpcp-popover--text">' + text + '</p>';
    }
    if (video) {
      content +=
        '<span class="spinner pwpcp-popover--spinner"></span>' +
        '<iframe class="pwpcp-popover--iframe" width="250" height="152"' +
          ' src="//www.youtube-nocookie.com/embed/' + video +
          '?rel=0&amp;showinfo=0&amp;enablejsapi=1"' +
          ' frameborder="0" allowfullscreen>' +
        '</iframe>';
    }
    if (docs) {
      content += '<div class="pwpcp-popover--footer">' +
        '<a target="_blank" href="' + Utils.getDocsUrl(docs) + '">Read more on the docs</a>' +
        ' <i class="dashicons dashicons-external"></i>' +
      '</div>';
    }
    return {
      title: data.title || null,
      content: content
    };
  }

  // @access public
  return {
    /**
     * Init
     */
    init: function () {
      _initGuides();
      // Init bootstrap tooltips
      // $('.pwpcp-tip').tooltip();
    },
    /**
     * Create helpers on each of the given HTML elements
     * @param  {array<HTMLelement>} elements The DOM elements where to add a
     *                                       helper
     */
    createHelpers: function (elements) {
      for (var i = elements.length - 1; i >= 0; i--) {
        _createHelperInsideControl($(elements[i]));
      }
    },
    /**
     * @inheritdoc
     */
    createGuide: _createGuideForControl,
    /**
     * @inheritdoc
     */
    destroyGuide: _destroyGuideOfControl
  };
})();

// export to public API
api.Tooltips = Tooltips;
