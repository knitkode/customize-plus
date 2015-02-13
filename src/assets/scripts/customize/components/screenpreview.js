/* global WpDom, Tabs */
/* exported: ScreenPreview */

/**
 * Screen Preview
 *
 * @requires WpDom, Tabs
 */
var ScreenPreview = (function () {

  var CLASS_PREVIEW_ACTIVE = 'k6-preview-active';
  var CLASS_PREVIEW_ROTATED = 'k6-preview-rotated';
  var CLASS_ANIM_OUT = 'k6-preview-out';
  var CLASS_ANIM_IN = 'k6-preview-in';
  var ATTRNAME_DEVICE = 'data-k6-device-size';
  var breakpoints = K6['constants']['BREAKPOINTS'];
  var sortedBreakpoints = [];
  var sizePreview;
  var sizeScreen;
  var sizeLast;
  var $k6Preview;
  var $controls;
  var $rotateControl;
  var wpBtnSave = WpDom.$wpBtnSave[0];
  var $wpControls = WpDom.$wpControls;
  var $wpPreview = WpDom.$wpPreview;
  var $tplPreviewWrapper = $(
    '<div id="k6-preview">' +
      '<div id="k6-preview-table">' +
        '<div id="k6-preview-table-cell">' +
          '<div id="k6-device">' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
  var $tplDevicePicker = $(
    '<div id="k6-device-picker">' +
      '<a class="k6-btn-icon k6-tip" title="Phone" data-screen="xs"><i class="dashicons dashicons-smartphone"></i></a>' +
      '<a class="k6-btn-icon k6-tip" title="Tablet" data-screen="sm"><i class="dashicons dashicons-tablet"></i></a>' +
      '<a class="k6-btn-icon k6-tip" title="Laptop" data-screen="md"><i class="dashicons dashicons-tablet"></i></a>' +
      '<a class="k6-btn-icon k6-tip" title="Desktop" data-screen="lg"><i class="dashicons dashicons-desktop"></i></a>' +
      '<a id="k6-rotate" class="k6-btn-icon k6-tip" title="Rotate" data-screen="rotate"><i class="dashicons imgedit-redo"></i></a>' +
    '</div>'
  );

  function _init () {
    _sortBreakpoints();
    _setScreenSize();
    _initUI();
    _bindUI();

    // initially always set the 'fullscreen' mode
    // and set the right active control
    var sizeInitial = _getScreenSize();
    _changeSize(false, sizeInitial);
    _setActiveControl(sizeInitial);

    // update everything on window resize
    $window.resize(function () {
      _setScreenSize();
      _changeSize(false);
    });
  }

  function _initUI () {
    // append footer
    $wpControls.append($tplDevicePicker);

    // wrap preview in a table like
    $wpPreview.wrap($tplPreviewWrapper);

    $controls = $tplDevicePicker.find('[data-screen]');
    $k6Preview = $('#k6-preview');
    $rotateControl = $('#k6-rotate');
  }

  function _bindUI () {
    $controls.on('click', function () {
      var $this = $(this);
      var data = $this.data('screen');
      // don't trigger again the current screen size preview
      if ($this.hasClass('k6-current')) {
        return;
      }
      if (data === 'rotate') {
        body.classList.toggle(CLASS_PREVIEW_ROTATED);
        $this.find('i').toggleClass('imgedit-redo imgedit-undo');
      } else {
        _changeSize(true, data);
      }
    });
  }

  function _setIframe (iframe) {
    $wpPreview.addClass('k6-iframe-wrap');
    iframe.id = 'k6-iframe';
    iframe.frameBorder = '0';
    iframe.allowTransparency = 'true';
  }

  function _setScreenSize () {
    sizeScreen = _getScreenSize();
    body.setAttribute('data-k6-screen-size', sizeScreen);
  }

  /**
   * [_anim description]
   * @param  {string} mode 'Set' or 'unset' device
   *                       determines a different time when to remove
   *                       the body active class.
   */
  function _animateDevice (mode, size) {
    // first hide the current device
    $k6Preview.addClass(CLASS_ANIM_OUT);

    // after the animation show the new device
    setTimeout(function() {
      if (mode === 'set') {
        body.classList.add(CLASS_PREVIEW_ACTIVE);
      }

      // set new device attr for css style
      $k6Preview.attr(ATTRNAME_DEVICE, size)
        // show new device
        .addClass(CLASS_ANIM_IN)
        // and remove classes to be ready
        // for coming animations
        .removeClass(CLASS_ANIM_OUT);

      if (mode === 'unset') {
        body.classList.remove(CLASS_PREVIEW_ACTIVE);
      }
    }, 300);

    // reset animation class
    setTimeout(function() {
      // remove classes to be ready
      // for coming animations
      $k6Preview.removeClass(CLASS_ANIM_IN);

      // k6hack, somehow scrolling with mousewheel after that the preview
      // has been animated get stuck. To solve this is enough to cause a
      // redraw/repaint in the browser, hiding and reshowing any element
      // (I use the button 'cause is small) see answer here:
      // http://stackoverflow.com/a/3485654/1938970 \\
      wpBtnSave.style.display = 'none';
      wpBtnSave.offsetHeight = wpBtnSave.offsetHeight ;
      wpBtnSave.style.display = '';
    }, 600);
  }

  function _setDevice (animate, size) {
    if (animate) {
      _animateDevice('set', size);
    } else {
      body.classList.add(CLASS_PREVIEW_ACTIVE);
      $k6Preview.attr(ATTRNAME_DEVICE, size);
    }

    // enable rotation
    if (size === 'xs' || size === 'sm') {
      $rotateControl.show();
    // disable rotation
    } else {
      $rotateControl.hide();
    }
  }

  function _unsetDevice (animate) {
    if (animate) {
      _animateDevice('unset', '');
    } else {
      body.classList.remove(CLASS_PREVIEW_ACTIVE);
      $k6Preview.attr(ATTRNAME_DEVICE, '');
    }

    // disable rotation
    $rotateControl.hide();
  }

  function _isDeviceTooBig (size) {
    return sortedBreakpoints.indexOf(size) > sortedBreakpoints.indexOf(sizeScreen);
  }

  function _changeSize (animate, givenSize) {
    // size is the one passed or the one in memory
    // when window get resized and there's need to check
    // if the desired preview fits/makes sense in the current screen
    var size = givenSize || sizePreview;

    // if is fullscreen or choosen screen
    // is bigger than current screen
    if (size === sizeScreen || _isDeviceTooBig(size)) {
      _unsetDevice(animate, size);
      sizePreview = sizeScreen;
    // is custom screen
    } else {
      _setDevice(animate, size);
      sizePreview = size;
    }
    _setActiveControl(sizePreview);

    // store last size at the end
    sizeLast = sizePreview;
  }

  function _setActiveControl (size) {
    var $controlActive = $controls.filter(function () {
      return this.getAttribute('data-screen') === size;
    });
    $controls.removeClass('k6-current');
    $controlActive.addClass('k6-current');

    // manage also screen picker tabs
    Tabs.changeSize(sizePreview);
  }

  function _sortBreakpoints () {
    for (var i = 0, l = breakpoints.length; i < l; i++) {
      sortedBreakpoints.push(breakpoints[i]['name']);
    }
  }

  function _getScreenSize () {
    var winWidth = $window.width();
    var wpSidebarWidth = $wpControls.width();
    var iframeWinWidth = (winWidth - wpSidebarWidth);
    var length = breakpoints.length;
    for (var i = 0; i < length; i++) {
      var breakpoint = breakpoints[i];
      if (iframeWinWidth < breakpoint.size) {
        return breakpoints[Math.max(i - 1, 0)]['name'];
      }
    }
    // otherwise return the last breakpoint
    return breakpoints[length - 1]['name'];
  }

  // @public API
  return {
    init: function () {
      _init();
    },
    onReady: function (iframe) {
      _setIframe(iframe);
    },
    change: function (animate, size) {
      _changeSize(animate, size);
    },
    getSize: function () {
      return sizeLast;
    }
  };
})();
