/* global $, l10n, lunr, $document, body, Skeleton, Tools, WpDom */
/* exported: Search */

/**
 * Search
 *
 * Use lunr.js as a javascript search engine.
 *
 * @requires Skeleton, Tools, WpDom
 */
var Search = (function () {

  /**
   * The interval timer to lazily render search results
   * Searching for `color` gives more than 100 results,
   * inflating all the controls at the same time freeze the browser,
   * so we scatter the render process in this timer, which needs to be
   * cleared on every search change.
   *
   * @type {function()}
   */
  var intervalledRendering;
  /**
   * The interval timer to lazily unrender search results
   * Searching for `color` gives more than 100 results,
   * deflating all the controls at the same time freeze the browser,
   * so we scatter the render process in this timer, which needs to be
   * cleared on search activation / deactivation.
   *
   * @type {function()}
   */
  var intervalledUnrendering;
  /**
   * Set state
   * @type {boolean}
   */
  var searchIsActive = false;
  /**
   * Search index var, store lunr reference
   */
  var searchIndex;
  /**
   * Counter element.
   * @type {HTMLelement}
   */
  var counter;
  /**
   * Template button (the search toggle).
   *
   * @type {jQuery}
   */
  var _tplBtn = $(
    '<span id="k6-search-toggle" class="k6-toggle"><span class="screen-reader-text">"' + l10n['searchPlaceholder'] + '"</span></span>'
  );
  /**
   * Template info title (the search box).
   *
   * @type {jQuery}
   */
  var _tplInfoTitle = $( // k6wptight-layout \\
    '<span id="k6-search-info" class="preview-notice">' +
      '<b id="k6-search-count"></b>' + l10n['searchResultsFor'] +
      '<input id="k6-search-input" class="theme-name" type="search" placeholder="' + l10n['searchPlaceholder'] + '">' +
    '</span>'
  );
  /** @type {jQuery} */
  var $wpInfoTitle = WpDom.$wpInfoTitle;
  /**
   * Store the content of the info title box
   * that get replaced (only temporarily) during search.
   *
   * @type {string}
   */
  var infoHtmlTitle = $wpInfoTitle.html();
  /**
   * Init
   *
   */
  function _init () {
    WpDom.$wpHeader.append(_tplBtn);
    _buildIndex();
    _bindToggle();
    _bindKeys();
    _deeplinkSearch();
  }

  /**
   * Extract informations as text from the `choices`
   * object (which can have different structures)
   * in radio like controls
   *
   * @param  {Object} choices The choices object
   * @return {String}         The choices object as text, to pass into search  lunr index
   */
  function _getTextFromChoices (choices) {
    return JSON.stringify(choices); // k6todo, this can be a bit more sophisticated \\
  }

  /**
   * Build the search index
   * Loop through the searchable controls
   * and assign different scores for different properties.
   * We don't need any DOM manipulation here, just use the
   * javascript objects `representations` of the controls
   *
   */
  function _buildIndex () {
    searchIndex = lunr(function () {
      this.ref('id');
      this.field('label', { boost: 100 });
      this.field('description', { boost: 50 });
      this.field('type', { boost: 25 });
      this.field('choices');
      this.field('section');
    });

    for (var controlID in api.settings.controls) {
      var control = api.control(controlID);
      // be sure that is one of our custom controls
      if (control && control.k6) {
        var params = control.params;
        searchIndex.add({
          id: control.id,
          label: params.label,
          description: params.description,
          type: params.type,
          choices: _getTextFromChoices(params.choices),
          section: params.section
        });
      }
    }
  }

  /**
   * Bind search button toggle action
   *
   */
  function _bindToggle () {
    document.getElementById('k6-search-toggle').onclick = _toggle;
  }

  /**
   * Keyboard bindings
   * for more accessibility (use github like shortcuts),
   * `t` to activate search, `Esc` to deactivate it.
   */
  function _bindKeys () {
    window.onkeyup = function (event) {
      var target = event.target;
      var nodeName = target.nodeName;
      // prevent enabling search when user is typing in input fields
      if ((nodeName === 'INPUT' || nodeName === 'TEXTAREA') && target.parentNode.id !== 'k6-search-info') {
        return;
      }
      if (event.which === 27) { // Esc
        _deactivate();
        return;
      }
      if (event.which === 84) { // 't' (github like search enable)
        _activate();
        return;
      }
    };
  }

  /**
   * Listen on search input events
   *
   */
  function _bindInput () {
    $wpInfoTitle.find('input[type="search"]').focus().on('change keyup', function () {
      var value = this.value;
      // always clear the rendering queue
      clearInterval(intervalledRendering);
      if (value) {
        _filterResults(value);
      } else {
        _updateCount(0);
        _resetResults();
      }
    // prevent to trigger the accordion on click
    }).on('click', function (event) {
      event.stopPropagation();
    });
  }

  /**
   * Update result count
   *
   */
  function _updateCount (newCount) {
    if (counter) {
      counter.innerHTML = newCount;
    }
  }

  /**
   * Search toggle button click event handler
   *
   */
  function _toggle () {
    if (!searchIsActive) {
      _activate();
      return;
    }
    if (searchIsActive) {
      _deactivate();
      return;
    }
  }

  /**
   * Activate search
   *
   */
  function _activate () {
    if (searchIsActive) {
      return;
    }
    searchIsActive = true;
    Tools.deactivate();
    Skeleton.back.onclick = _deactivate;
    body.classList.add('k6-search-active');
    $wpInfoTitle.html(_tplInfoTitle);
    $wpInfoTitle.find('input[type="search"]').val('');
    counter = document.getElementById('k6-search-count');
    _updateCount(0);
    _bindInput();
    // always clear the unrendering queue
    clearInterval(intervalledUnrendering);
  }

  /**
   * Deactivate search
   *
   */
  function _deactivate () {
    if (!searchIsActive) {
      return;
    }
    searchIsActive = false;
    Skeleton.back.onclick = null;
    body.classList.remove('k6-search-active');
    $wpInfoTitle.html(infoHtmlTitle);
    _updateCount(0);
    counter = null;
    // always clear the rendering queue
    clearInterval(intervalledRendering);
    // and deflate from DOM all results
    _removeResults();
  }

  /**
   * Get object from results array
   * @param  {array} array [description]
   * @param  {string} value [description]
   * @return {Object}       The lookup object
   */
  function _getResultLookup (array, value) {
    var lookupObject = {};
    for (var i = 0, l = array.length; i < l; i++) {
      lookupObject[array[i][value]] = true;
    }
    return lookupObject;
  }

  /**
   * Show search results, inflate all of them
   * then just toggle the class that make them visible
   * when refining the search term
   *
   * @param  {string} filter Query string
   */
  function _filterResults (filter) {
    var results = searchIndex.search(filter);
    var resultsLookup = _getResultLookup(results, 'ref');
    var controlIDsAll = _.keys(api.settings.controls);
    var controlIDsToShow = _.keys(resultsLookup);

    // show results
    var i = controlIDsToShow.length - 1;
    intervalledRendering = setInterval(function (){
      var control = api.control( controlIDsToShow[i] );
      if (control && control.k6) {
        if (!control.hasBeenInflatedForSearch) {
          control.inflate();
          control.hasBeenInflatedForSearch = true;
        }
        control._container.classList.add('k6-search-result');
      }
      i--;
      if (i < 0) {
        clearInterval(intervalledRendering);
      }
    }, 50);

    // hide controls not in results
    for (var j = controlIDsAll.length - 1; j >= 0; j--) {
      var controlID = controlIDsAll[j];
      if (!resultsLookup[controlID]) {
        var control = api.control(controlID);
        if (control && control.k6) {
          control._container.classList.remove('k6-search-result');
        }
      }
    }

    // update counter
    _updateCount(results.length);
  }

  /**
   * Reset search results when the search input
   * get emptied (the user delete the search query)
   *
   */
  function _resetResults () {
    for (var controlID in api.settings.controls) {
      var control = api.control(controlID);
      if (control.k6) {
        control._container.classList.remove('k6-search-result');
      }
    }
  }

  /**
   * Remove search results on search close,
   * both remove class and deflate all controls
   *
   */
  function _removeResults () {
    // deflate from DOM all results
    var controlIDsToHide = Object.keys(api.settings.controls);
    var i = controlIDsToHide.length - 1;
    intervalledUnrendering = setInterval(function (){
      var control = api.control(controlIDsToHide[i]);
      if (control.k6) {
        var section = api.section(control.section());
        // if the control is not in an expanded (visible) section
        // we can deflate and keep a light DOM tree.
        control._container.classList.remove('k6-search-result');
        if (!section.expanded()) {
          control.deflate();
          control.hasBeenInflatedForSearch = false;
        }
      }
      i--;
      if (i < 0) {
        clearInterval(intervalledUnrendering);
      }
    }, 10);
  }

  /**
   * Make search deeplinkable
   *
   * Search in the url deeplinks that match the following
   * pattern (like WordPress does): '?autofocus[control]=k6-...rt'
   */
  function _deeplinkSearch () {
    $document.ready(function () {
      var query = window.location.search;
      if (query && query.indexOf('autofocus[search]=') !== -1) {
        var matches = query.match(/search]=(\S*?$)/); // k6todo, this regex sucks... \\
        if (matches.length) {
          _activate();
          $wpInfoTitle.find('input[type="search"]').val(matches[1]).change();
        }
      }
    });
  };

  // @public API
  return {
    init: _init,
    deactivate: _deactivate
  };
})();