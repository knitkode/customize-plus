/* global WpTight */

/**
 * Notices
 *
 * @class api.Notices
 * @requires api.WpTight
 */
var Notices = (function () {

  var _$tpl = $(
    '<div class="pwpcp-notices"></div>'
  );

  function _create() {
    // WpTight.el.controls.append(_$tpl);
  }

  function _setText(text) {
    _$tpl.text(text);
    // return _$tpl;
  }

  // @access public
  return {
    init: function () {
      _create();
    },
    // init: _init,
    add: function () {

    },
    set: _setText
  };
})();

// export to public API
api.Notices = Notices;
