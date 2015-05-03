/**
 * Tooltips
 * with additional content regarding controls
 *
 */
var Tooltips = (function () {

  var $tipGuidesTriggers;
  var commonOpts = {
    placement: 'auto',
    constrains: 'horizontal',
    width: 300,
    multi: true,
    // content: _showContent,
    padding: true,
    delay: {
      show: 500
    }
  };

  function _initHelpers () {
    var $tipHelpers = $('[data-tip="help"]');
    var opts = $.extend(commonOpts, {
      trigger: 'hover'
    });
    $tipHelpers.webuiPopover(opts)
      .each(function (idx, element) {
        _setContent(element);
      });
  }

  function _initGuides () {
    var opts = $.extend(commonOpts, {
      trigger: 'click',
      closeable: true
    });
    $tipGuidesTriggers.webuiPopover(opts)
      .on('hidden.webui.popover', _stopVideos)
      .each(function (idx, element) {
        _setContent(element);
      });

    // stop videos also on hiddenAll event
    $document.on('hiddenAll.webui.popover', _stopVideos);
  }

  function _createGuideIcons () {
    var $tipGuides = $('[data-tip="guide"]');
    $tipGuides.each(function() {
      var $this = $(this);
      var dataAttrs = $this.data();
      var $icon = $('<i class="pwpcp-tip-guide-trigger dashicons dashicons-editor-help"></i>');
      $icon.data(dataAttrs);
      $this.before($icon).parents('label').addClass('pwpcp-has-tip-guide');
    });
    $tipGuidesTriggers = $('.pwpcp-tip-guide-trigger');
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
      content += '<img src="' + img + '">';
    }
    if (text) {
      content += '<p>' + text + '</p>';
    }
    if (video) {
      content +=
        '<span class="spinner"></span>' +
        '<iframe width="270" height="152"' +
          ' src="//www.youtube-nocookie.com/embed/' + video +
          '?rel=0&amp;showinfo=0&amp;enablejsapi=1"' +
          ' frameborder="0" allowfullscreen>' +
        '</iframe>';
    }
    $el.attr('data-content', content);
  }

  // @public API
  return {
    init: function () {
      _createGuideIcons();
      _initGuides();
      _initHelpers();
      // Init bootstrap tooltips
      // $('.pwpcp-tip').tooltip();
    }
  };
})();

// export to public API
api['Tooltips'] = Tooltips;