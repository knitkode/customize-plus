import document from 'document';
import $ from 'jquery';
import _ from 'underscore';
import { api, $readyDOM } from './globals';
import WpTight from './wptight';

/**
 * Banner for free plugin
 *
 * @requires api.core.WpTight
 */
/** @type {Boolean} */
api.core._banner = true;

(function () {

  /** @type {Object} */
  var adminColors = WpTight._colorSchema;

  /** @type {string} The id of the banner container */
  var _ID = _getRandomId(18);

  /** @type {Function} CSS underscore template */
  var _inlineStyleTpl = _.template(
    // container (style on id)
    '#<%- id %> {' +
      'z-index: 11;' +
      'position: fixed;' +
      'width: 300px;' +
      'top: 123px;' +
      'bottom: 45px;' +
      'left: 0;' +
      'right: 0;' +
      'box-sizing: border-box;' +
      'padding: 12px 20px;' +
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
      'content: "\\f343";' +
    '}' +
    // button expand
    '#<%- id %>e {' +
      'position: absolute;' +
      'top: 40px;' +
      'right: 8px;' +
      'width: 25px;' +
      'height: 25px;' +
      'border-radius: 100%;' +
      'background: #23282d;' +
      adminColors._primary +
    '}' +
    '#<%- id %>e:before {' +
      'content: "\\f347";' +
      'font-size: 18px;' +
      'display: block;' +
      'margin-left: -2px;' +
    '}' +
    // links
    '.<%- id %>a {' +
      'color: #eee;' +
      adminColors._linksPrimary +
    '}' +
    '.<%- id %>a {' +
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
    '.<%- id %>i:before,' +
    '#<%- id %>ua:before {' +
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
      'padding: 0;' +
      'margin-bottom: 12px;' +
    '}' +
    // list item - upgrade link
    '#<%- id %>ua {' +
      'display: block;' +
      'padding-left: 50px;' +
      'padding: 10px 10px 10px 37px;' +
      'font-weight: bold;' +
      'font-size: 14px;' +
      'transition: all .18s ease;' +
      'background: #0073aa;' +
      'color: #fff;' +
      adminColors._highlight +
    '}' +
    '#<%- id %>ua:hover {' +
      'box-shadow: 0 6px 10px rgba(0,0,0,.3);' +
      'transform: scale(1.02);' +
      'text-decoration: underline;' +
    '}' +
    // list icon - upgrade
    '#<%- id %>ua:before {' +
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

  /** @type {Function} underscore template */
  var _tplBtn = _.template(
    '<button class="<%- id %>b" id="<%- id %>e" style="display:none"></button>'
  );

  /** @type {Function} underscore template */
  var _tpl = _.template(
    '<div id="<%- id %>" style="display:none">' +
      '<button class="<%- id %>b" id="<%- id %>c" style="display:none"></button>' +
      '<h1 class="<%- id %>h">Hello,</h1>' +
      'your WordPress Customize is using the <a class="<%- id %>a" href="https://knitkode.com/customize-plus" target="_blank">Customize Plus</a> plugin, a free software, you may consider one of the following action:' +
      '<ul>' +
        '<li class="<%- id %>i " id="<%- id %>u"><a id="<%- id %>ua" href="https://knitkode.com/customize-plus-premium?plugin=true1&banner=01" target="_blank">Upgrade to premium and add great features to this page <br>Learn more &raquo;</a></li>' + // @@todo click tracking \\
        '<li class="<%- id %>i" id="<%- id %>d"><a class="<%- id %>a" href="https://wordpress.org/" target="_blank">Donate</a></li>' +
        '<li class="<%- id %>i" id="<%- id %>r"><a class="<%- id %>a" href="https://wordpress.org/" target="_blank">Rate the plugin</a></li>' +
        '<li class="<%- id %>i" id="<%- id %>t"><a class="<%- id %>a" href="https://twitter.com/" target="_blank">Share on twitter</a></li>' +
        '<li class="<%- id %>i" id="<%- id %>f"><a class="<%- id %>a" href="https://facebook.com/" target="_blank">Share on facebook</a></li>' +
      '</ul>' +
    '</div>'
  );

  /** @type {HTMLElement} */
  var __btnExpand;

  /** @type {HTMLElement} */
  var __btnContract;

  /** @type {HTMLElement} */
  var __container;

  /** @type {JQuery} */
  var __$container;

  /**
   * Get random id
   *
   * {@link http://stackoverflow.com/a/1349426/1938970}
   * @param  {int} length The length of the id to create.
   * @return {string}     The generated random id.
   */
  function _getRandomId (length) {
    var text = '';
    var possible = 'abcdefghijklmnopqrstuvwxyz_-';
    for ( var i=0; i < length; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  /**
   * Init the banner, we can wait a little because the banner
   * should not show up immediately
   */
  function _init () {
    setTimeout(_createStyle, 1000);
    setTimeout(_createTemplate, 3000);
  }

  /**
   * Append inline style to head
   */
  function _createStyle () {
    var existingStyle = document.getElementById(_ID + 's');
    var style = existingStyle || document.createElement('style');
    style.id = _ID + 's';
    style.innerHTML = _inlineStyleTpl({ id: _ID });
    if (!existingStyle) {
      var head = document.getElementsByTagName('head')[0];
      style.appendChild(document.createTextNode(''));
      head.appendChild(style);
    }
  }

  /**
   * Append banner, then show it
   */
  function _createTemplate () {
    WpTight.el.themeControls.before(_tpl({ id: _ID }));
    WpTight.el.info.append(_tplBtn({ id: _ID }));

    __container = document.getElementById(_ID);
    __$container = $(__container);

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
    $('#' + _ID).slideUp(function () {
      __btnExpand.style.display = 'block';
      __btnContract.style.display = 'none';
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
    __btnExpand.style.display = 'none';

    $('#' + _ID).slideDown(function () {
      __btnContract.style.display = 'block';
    });
  }

  /**
   * Init on document ready
   */
  $readyDOM.then(function () {
    // mechanism to prevent banner from showing in Customize Plus Premium
    if (!api.core._banner) {
      return;
    }
    _init();
  });

})();
