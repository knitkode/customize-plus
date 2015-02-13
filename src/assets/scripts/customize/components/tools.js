/* global WpDom, Skeleton, Search */
/* exported: Tools */

/**
 * Customize Tools
 *
 * @requires WpDom, Skeleton, Search
 */
var Tools = (function () {

  var ID_MENU = 'k6-tools-menu';
  var CLASS_ACTIVE = 'k6-tools-active';
  var isActive = false;
  var $tplMenu = $(
    '<ul id="' + ID_MENU + '" class="accordion-container"></ul>'
  );
  var $tplToggle = $(
    '<span id="k6-tools-toggle" class="k6-toggle"><span class="screen-reader-text">"' + l10n['tools'] + '"</span></span>'
  );
  var $wpCustomizeControls = WpDom.$wpCustomizeControls;

  function _init () {
    WpDom.$wpHeader.append($tplToggle);
    $wpCustomizeControls.after($tplMenu);
    $tplToggle.on('click', _toggle);
    _replicateAccordionBehavior();
    _deeplinkControls();
  }

  function _toggle () {
    if (isActive) {
      _deactivate();
    } else {
      _activate();
    }
  }

  function _activate () {
    if (isActive) {
      return;
    }
    Search.deactivate();
    Skeleton.back.onclick = _deactivate;
    body.classList.add(CLASS_ACTIVE);
    $tplMenu.show();
    $wpCustomizeControls.hide();
    isActive = true;
  }

  function _deactivate () {
    if (!isActive) {
      return;
    }
    Skeleton.back.onclick = null;
    body.classList.remove(CLASS_ACTIVE);
    $tplMenu.hide();
    $wpCustomizeControls.show();
    isActive = false;
  }

  /**
   * Replicate accordion behavior like the default WordPress one
   * We need to do this because we create the DOM after the native
   * WordPress accordion has been executed. So the bindings are not tight
   * to our new DOM for the Tools menu.
   *
   * The function is taken almost exactly as in ./wp-admin/js/accordion.js
   * (it's just condensed and the action function is inlined).
   */
  function _replicateAccordionBehavior () {
    $('#' + ID_MENU).on('click keydown', '.accordion-section-title', function (e) {
      if ( e.type === 'keydown' && 13 !== e.which ) { // "return" key
        return;
      }
      e.preventDefault(); // Keep this AFTER the key filter above
      var section = $(this).closest('.accordion-section'),
        siblings = section.closest('.accordion-container').find('.open'),
        content = section.find('.accordion-section-content');
      // This section has no content and cannot be expanded.
      if (section.hasClass('cannot-expand')) {
        return;
      }
      if (section.hasClass('open')) {
        section.toggleClass('open');
        content.toggle(true).slideToggle(150);
      } else {
        siblings.removeClass('open');
        siblings.find('.accordion-section-content').show().slideUp(150);
        content.toggle(false).slideToggle(150);
        section.toggleClass('open');
      }
    });
  }

  /**
   * [_deeplinkControls description]
   *
   * Search in the url deeplinks that match the following
   * pattern (like WordPress does): '?autofocus[control]=k6-...rt'
   */
  function _deeplinkControls () {
    $document.ready(function () {
      var query = window.location.search;
      if (query && query.indexOf('autofocus[section]=k6') !== -1) {
        var matches = query.match(/k6-\S*?rt/g); // k6todo, this regex sucks... \\
        if (matches.length) {
          var $controlLi = $('#' + matches[0]);
          if ($controlLi.length && $controlLi.parent().attr('id') === ID_MENU) {
            _activate();
            $controlLi.children().first().trigger('click');
          }
        }
      }
    });
  }

  // @public API
  return {
    init: function () {
      _init();
      this.menu = document.getElementById(ID_MENU);
    },
    activate: _activate,
    deactivate: _deactivate
  };
})();

// export to the public api
window.K6.tools = Tools;