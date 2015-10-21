/**
 * Banner for free plugin
 *
 */
(function () {
  /** @type {String} The id of the banner container */
  var _id = _getRandomId(14);

  /** @type {String} The id of the css style */
  var _idStyle= _id + 's';

  /** @type {String} The id of the dismiss button */
  var _idBtn = _id + 'b';

  /** @type {String} CSS underscore template */
  var _inlineStyleTpl = _.template(
    // container
    '#<%- id %> {' +
      'z-index: 1;' +
      'position: absolute;' +
      'bottom: 45px;' +
      'left: 0;' +
      'right: 0;' +
      // 'margin-bottom: 0 !important;' + // @@totest for development purpose only \\
      'padding: 12px 20px;' +
      'background: #0073aa;' + // skin2: #fff
      'color: #fff;' + // skin2: none
      'border-top: 1px solid #ccc;' +
      'box-shadow: 0 -10px 32px -10px rgba(0,0,0,.4);' +
    '}' +
    // container - decoration
    '#<%- id %>:before {' +
      'content: "\\f101";' +
      'font-family: dashicons;' +
      'font-size: 62px;' +
      'position: absolute;' +
      'bottom: 0;' +
      'color: #fff;' + // skin2: brown
      'padding: 0 10px 10px 0;' +
      'right: -6px;' +
      'opacity: .5;' + // skin2: none
    '}' +
    // headings
    '.<%- id %>h {' +
      'font-weight: 100;' +
      'color: #fff;' + // skin2: none
    '}' +
    // button
    '.<%- id %>b {' +
      'background: 0;' +
      'border: none;' +
      'font-size: 22px;' +
      'color: #cfffff;' + // skin2: #999
      'cursor: pointer' +
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
      'background: #0073aa;' +
      'border-radius: 50px 50px 0 0;' +
    '}' +
    '#<%- id %>e:before {' +
      'content: "\\f343";' +
    '}' +
    // links
    '#<%- id %> a {' +
      'color: #afffff;' + // skin2: none
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
      'color: #acc;' + // skin2: #999
    '}' +
    // list item - upgrade
    '#<%- id %>u {' +
      'padding-left: 50px;' +
      'padding: 10px 10px 10px 37px;' +
      'background: lightseagreen;' +
      'margin-bottom: 12px;' +
    '}' +
    // list icon - upgrade
    '#<%- id %>u:before {' +
      'content: "\\f313";' +
      'color: #FCE2A7;' +
      'font-size: 44px;' +
      'top: 7px;' +
      'left: -12px;' +
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
  var _btnExpand;

  /** @type {HTMLelement} */
  var _btnContract;

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
    var existingStyle = document.getElementById(_idStyle);
    var style = existingStyle || document.createElement('style');
    style.id = _idStyle;
    style.innerHTML = _inlineStyleTpl({ id: _id });
    if (!existingStyle) {
      var head = document.getElementsByTagName('head')[0];
      style.appendChild(document.createTextNode(''));
      head.appendChild(style);
    }

    $('#customize-controls').append(
      '<div id="' + _id + '" style="margin-bottom:-400px">' +
        '<button class="' + _id + 'b" id="' + _id + 'c" style="display:none"></button>' +
        '<button class="' + _id + 'b" id="' + _id + 'e" style="display:none"></button>' +
        '<h1 class="' + _id + 'h">Hello,</h1>' +
        'your WordPress Customize is using the <a href="http://pluswp.com/customize-plus" target="_blank">Customize Plus</a> plugin, a free software, you may consider one of the following action:' +
        '<ul>' +
          '<li class="' + _id + 'i" id="' + _id + 'u"><a href="http://pluswp.com/customize-plus-premium" target="_blank">Upgrade to premium</a> and add great features to this page <a href="http://pluswp.com/customize-plus-premium?learn_more=1" target="_blank">Learn more</a></li>' + // @@todo click tracking \\
          '<li class="' + _id + 'i" id="' + _id + 'd"><a href="https://wordpress.org/" target="_blank">Donate</a></li>' +
          '<li class="' + _id + 'i" id="' + _id + 'r"><a href="https://wordpress.org/" target="_blank">Rate the plugin</a></li>' +
          '<li class="' + _id + 'i" id="' + _id + 't"><a href="https://twitter.com/" target="_blank">Share on twitter</a></li>' +
          '<li class="' + _id + 'i" id="' + _id + 'f"><a href="https://facebook.com/" target="_blank">Share on facebook</a></li>' +
        '</ul>' +
      '</div>'
    );

    var container = document.getElementById(_id);
    container.onmouseover = function () {
      _isHovering = true;
    };
    container.onmouseout = function () {
      _isHovering = false;
    };

    _btnContract = document.getElementById(_id + 'c');
    _btnContract.onclick = _hide;
    _btnExpand = document.getElementById(_id + 'e');
    _btnExpand.onclick = _show;
    // _btnDismiss = document.getElementById(_id + '');
    // btnDismiss.onclick = _dismiss;

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
    var $container = $('#' + _id);
    $container.animate({
      'margin-bottom': -($container.outerHeight() + 45)
    }, function () { // 45 is the height of the sidebar footer
      // _isVisible = false;
      _btnExpand.style.display = 'block';
      _btnContract.style.display = 'none';
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
    _btnExpand.style.display = 'none';

    $('#' + _id).animate({ 'margin-bottom': '0px' }, function () {
      // _isVisible = true;
      _btnContract.style.display = 'block';
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
    var el = document.getElementById(_id);
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