/**
 * Banner for free plugin
 *
 */
api._banner = true;

(function () {

  var adminColors = WpTight._colorSchema;

  /** @type {String} The id of the banner container */
  var _ID = _getRandomId(14);

  /** @type {String} CSS underscore template */
  var _inlineStyleTpl = _.template(
    // container (style on id)
    '#<%- id %> {' +
      'z-index: 11;' +
      'position: absolute;' +
      'bottom: 45px;' +
      'left: 0;' +
      'right: 0;' +
      // 'margin-bottom: 0 !important;' + // @@totest for development purpose only \\
      'padding: 12px 20px;' +
      'box-shadow: 0 -10px 32px -10px rgba(0,0,0,.4);' +
      'border-top: 1px solid #ccc;' +
      'background: #23282d;' +
      'color: #eee;' +
      adminColors._primary +
    '}' +
    // container - decoration
    '#<%- id %>:before {' +
      'content: "\\f101";' +
      'font-family: dashicons;' +
      'font-size: 62px;' +
      'position: absolute;' +
      'bottom: 0;' +
      'padding: 0 10px 10px 0;' +
      'right: -6px;' +
      'opacity: .5;' +
      'color: #fff;' +
      adminColors._linksPrimary +
    '}' +
    // headings
    '.<%- id %>h {' +
      'font-weight: 100;' +
      'color: #fff;' +
      adminColors._linksPrimary +
    '}' +
    // button
    '.<%- id %>b {' +
      'font-size: 22px;' +
      'cursor: pointer;' +
      'border: none;' +
      'background: 0;' +
      'color: #fff;' +
      adminColors._linksPrimary +
    '}' +
    '.<%- id %>b:focus {' +
      'outline: none;' +
    '}' +
    '.<%- id %>b:before {' +
      'font-family: dashicons;' +
    '}' +
    // button contract
    '#<%- id %>c {' +
      'position: absolute;' +
      'top: 10px;' +
      'right: 2px;' +
    '}' +
    '#<%- id %>c:before {' +
      'content: "\\f347";' +
    '}' +
    // button expand
    '#<%- id %>e {' +
      'position: absolute;' +
      'top: -25px;' +
      'right: 2px;' +
      'border-radius: 50px 50px 0 0;' +
      'background: #23282d;' +
      adminColors._primary +
    '}' +
    '#<%- id %>e:before {' +
      'content: "\\f343";' +
    '}' +
    // links
    '#<%- id %> a {' +
      'color: #fff;' +
      adminColors._linksPrimary +
    '}' +
    // list items
    '.<%- id %>i {' +
      'position: relative;' +
      'padding-left: 27px;' +
      'min-height: 24px;' +
    '}' +
    // list items icons
    '.<%- id %>i:before {' +
      'position: absolute;' +
      'top: -1px;' +
      'left: 0;' +
      'font-family: dashicons;' +
      'font-size: 20px;' +
      'font-style: normal;' +
      'color: #FCE2A7;' +
      adminColors._notificationColor + //_linksHighlight +
    '}' +
    // list item - upgrade
    '#<%- id %>u {' +
      'padding-left: 50px;' +
      'padding: 10px 10px 10px 37px;' +
      'margin-bottom: 12px;' +
      'color: #fff;' +
      'background: #0073aa;' +
      adminColors._highlight +
    '}' +
    // list item - upgrade
    '#<%- id %>u a {' +
      adminColors._linksHighlight +
    '}' +
    // list icon - upgrade
    '#<%- id %>u:before {' +
      'content: "\\f313";' +
      'font-size: 44px;' +
      'top: 7px;' +
      'left: -12px;' +
      'color: #FCE2A7;' +
      adminColors._notificationColor + //_linksHighlight +
    '}' +
    // list icon - donate
    '#<%- id %>d:before {' +
      'content: "\\f487";' +
    '}' +
    // list icon - rate
    '#<%- id %>r:before {' +
      'content: "\\f155";' +
    '}' +
    // list icon - twitter
    '#<%- id %>t:before {' +
      'content: "\\f301";' + // 237, 301-302 (twitter), 304-305 (facebook)
    '}' +
    // list icon - facebook
    '#<%- id %>f:before {' +
      'content: "\\f304";' + // 237, 301-302 (twitter), 304-305 (facebook)
    '}'
  );

  /** @type {Number} Keep the count of the dismiss actions by the user */
  var _dismissActions = 0;

  /** @type {Boolean} Flag if banner is visible */
  var _isVisible = false;

  /** @type {Boolean} Flag if banner is hovered */
  var _isHovering = false;

  /** @type {HTMLelement} */
  var __btnExpand;

  /** @type {HTMLelement} */
  var __btnContract;

  /** @type {HTMLelement} */
  var __container;

  /** @type {jQuery} */
  var __$container;

  /**
   * Get random id
   *
   * {@link http://stackoverflow.com/a/1349426/1938970}
   * @param  {int} length The length of the id to create.
   * @return {String}     The generated random id.
   */
  function _getRandomId (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    for ( var i=0; i < length; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  /**
   * Init appending the banner after a certain time
   */
  function _init () {
    setTimeout(_append, 3000);
  }

  /**
   * Append banner, then show it
   */
  function _append () {
    // mechanism to prevent banner from showing in Customize Plus Premium
    if (!api._banner) {
      return;
    }
    var existingStyle = document.getElementById(_ID + 's');
    var style = existingStyle || document.createElement('style');
    style.id = _ID + 's';
    style.innerHTML = _inlineStyleTpl({ id: _ID });
    if (!existingStyle) {
      var head = document.getElementsByTagName('head')[0];
      style.appendChild(document.createTextNode(''));
      head.appendChild(style);
    }
    WpTight.el.controls.append(
      '<div id="' + _ID + '" style="margin-bottom:-400px">' +
        '<button class="' + _ID + 'b" id="' + _ID + 'c" style="display:none"></button>' +
        '<button class="' + _ID + 'b" id="' + _ID + 'e" style="display:none"></button>' +
        '<h1 class="' + _ID + 'h">Hello,</h1>' +
        'your WordPress Customize is using the <a href="http://pluswp.com/customize-plus" target="_blank">Customize Plus</a> plugin, a free software, you may consider one of the following action:' +
        '<ul>' +
          '<li class="' + _ID + 'i "id="' + _ID + 'u"><a href="http://pluswp.com/customize-plus-premium" target="_blank">Upgrade to premium</a> and add great features to this page <br><a href="http://pluswp.com/customize-plus-premium?learn_more=1" target="_blank">Learn more &raquo;</a></li>' + // @@todo click tracking \\
          '<li class="' + _ID + 'i" id="' + _ID + 'd"><a href="https://wordpress.org/" target="_blank">Donate</a></li>' +
          '<li class="' + _ID + 'i" id="' + _ID + 'r"><a href="https://wordpress.org/" target="_blank">Rate the plugin</a></li>' +
          '<li class="' + _ID + 'i" id="' + _ID + 't"><a href="https://twitter.com/" target="_blank">Share on twitter</a></li>' +
          '<li class="' + _ID + 'i" id="' + _ID + 'f"><a href="https://facebook.com/" target="_blank">Share on facebook</a></li>' +
        '</ul>' +
      '</div>'
    );

    __container = document.getElementById(_ID);
    __$container = $(__container);
    __container.onmouseover = function () {
      _isHovering = true;
    };
    __container.onmouseout = function () {
      _isHovering = false;
    };

    __btnContract = document.getElementById(_ID + 'c');
    __btnContract.onclick = _hide;
    __btnExpand = document.getElementById(_ID + 'e');
    __btnExpand.onclick = _show;
    // __btnDismiss = document.getElementById(_ID + '');
    // __btnDismiss.onclick = _dismiss;

    _show();
  }

  /**
   * Hide banner
   * @param  {?Object} event
   */
  function _hide (event, callback) {
    if (event) {
      event.preventDefault();
    }
    // if (!_isVisible) {
    //   return;
    // }
    // if (_isHovering) {
    //   setTimeout(_hide, 600);
    //   return;
    // }
    __$container.animate({
      'margin-bottom': -(__$container.outerHeight() + 45)
    }, function () { // 45 is the height of the sidebar footer
      // _isVisible = false;
      __btnExpand.style.display = 'block';
      __btnContract.style.display = 'none';
      // setTimeout(_show, 10000 * Math.max(1, _dismissActions));
      if (callback) {
        callback();
      }
    });
  }

  /**
   * Show banner
   * @param  {?Object} event
   */
  function _show (event) {
    if (event) {
      event.preventDefault();
    }
    // if (_isVisible) {
    //   return;
    // }
    __btnExpand.style.display = 'none';

    $('#' + _ID).animate({ 'margin-bottom': '0px' }, function () {
      // _isVisible = true;
      __btnContract.style.display = 'block';
      // setTimeout(_hide, 10000);
    });
  }

  /**
   * Dismiss banner
   * @param  {?Object} event
   */
  function _dismiss (event) {
    if (event) {
      event.preventDefault();
    }
    var el = document.getElementById(_ID);
    if (el) {
      _dismissActions++;
      _hide(null, function () {
        el.parentNode.removeChild(el);
      });
    }
  }

  /**
   * Init on document ready
   */
  $document.ready(_init);

})();