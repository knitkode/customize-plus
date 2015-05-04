/* global Utils */

/**
 * Tooltips
 * with additional content regarding controls
 *
 * @requires Utils
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
  var _optsGuide = _.extend(_optsCommon, {
    trigger: 'click',
    closeable: true
  });

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
    // stop videos also on hiddenAll event
    $document.on('hiddenAll.webui.popover', _stopVideos);
  }

  function _initHelpers () {
    var $tipHelpers = $('[data-tip="help"]');
    var opts = $.extend(_optsCommon, {
      trigger: 'hover'
    });
    $tipHelpers.webuiPopover(opts)
      .each(function (idx, element) {
        _setContent(element);
      });
  }

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

  function _setContent (element) {
    var $el = $(element);
    var content = '';
    var title = $el.data('tip_title');
    var text = $el.data('tip_text');
    var img = $el.data('tip_img');
    var video = $el.data('tip_video');
    if (title) {
      content += '<h4>' + title + '</h4>';
    }
    if (img) {
      content += '<img src="' + Utils.getImageUrl(img) + '">';
    }
    if (text) {
      content += '<p>' + text + '</p>';
    }
    if (video) {
      content +=
        '<span class="spinner"></span>' +
        '<iframe width="250" height="152"' +
          ' src="//www.youtube-nocookie.com/embed/' + video +
          '?rel=0&amp;showinfo=0&amp;enablejsapi=1"' +
          ' frameborder="0" allowfullscreen>' +
        '</iframe>';
    }
    $el.attr('data-content', content);
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
      var opts = _.extend(_optsGuide, {
        content: _getContentFromData(control.params.guide)
      });
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

  // @@todo
  function _destroyGuideOfControl (control) {
    control.container.find('.pwpcp-guide').webuiPopover('destroy');
  }

  /**
   * Get popover content from the given control data object
   * (`control.params.guide`)
   *
   * @param {Object} data     [description]
   * @return {String} The html string ready with the template for the popover
   */
  function _getContentFromData (data) {
    var content = '';
    var title = data.title;
    var img = data.img;
    var text = data.text;
    var video = data.video;
    if (title) {
      content += '<h4>' + title + '</h4>';
    }
    if (img) {
      content += '<img src="' + Utils.getImageUrl(img) + '">';
    }
    if (text) {
      content += '<p>' + text + '</p>';
    }
    if (video) {
      content +=
        '<span class="spinner"></span>' +
        '<iframe width="250" height="152"' +
          ' src="//www.youtube-nocookie.com/embed/' + video +
          '?rel=0&amp;showinfo=0&amp;enablejsapi=1"' +
          ' frameborder="0" allowfullscreen>' +
        '</iframe>';
    }
    return content;
  }

  // @public API
  return {
    init: function () {
      _initGuides();
      // _initHelpers();
      // Init bootstrap tooltips
      // $('.pwpcp-tip').tooltip();
    },
    createHelper: function ($element, data) {
      var opts = _.extend(_optsCommon, {
        trigger: 'hover'
      });
      $element.webuiPopover(opts);
      _setContent($element);
    },
    createGuide: _createGuideForControl,
    destroyGuide: _destroyGuideOfControl
  };
})();

// export to public API
api['Tooltips'] = Tooltips;