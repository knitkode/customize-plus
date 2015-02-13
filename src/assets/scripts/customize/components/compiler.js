/* global Modernizr, WpDom, Utils, Skeleton */
/* exported: Compiler */

/**
 * Compiler
 *
 * @requires WpDom, Utils, Skeleton
 */
var Compiler = (function () {

  var THEME_STYLE_MAIN_ID = 'k6-theme-css';
  var worker;
  var workerDeferred;
  var workersSupport = Modernizr['webworkers'];
  var customization = K6['constants']['CUSTOMIZATION_ON_LOAD'];
  var liveCompiling = K6['options']['liveCompiling'];
  var uncompiledChangesArePending = false;
  var lastRefreshNeedsToRecompile = false;
  var modifier = {};
  var firstLoad = true;
  var lessJsLoaded = false;
  var iframeDoc;
  var lastCompiledCSS = '';
  var $compileControl;
  var $compileButtons;
  var $compileButtonsText;

  /**
   * Init
   *
   */
  function _init () {
    Skeleton.loading();
    _extendWpAPI();
    if (workersSupport) {
      _workerManager();
    } else {
      _lessJsConfigure();
    }
    _lessJsLoad();
    _createCompileControl();
    _setMode(liveCompiling);
    _bindModeSwitch();
    _bindCompileButtons();
    _bindSave();
  }

  /**
   * Create and append compile control template
   *
   */
  function _createCompileControl () {
    $compileControl = $(
      '<div id="k6-compile-area">' +
        '<div id="k6-automanual">' +
          '<div class="switch-toggle k6-switch">' +
            '<input id="k6compilemanual" type="radio" name="k6compiletoggle" value="0">' +
            '<label for="k6compilemanual" onclick="">Manual</label>' + // k6todo \\
            '<input id="k6compileauto" type="radio" name="k6compiletoggle" value="1">' +
            '<label for="k6compileauto" onclick="">Auto</label>' +
            '<a></a>' +
          '</div>' +
        '</div>' +
        '<button id="k6-compile" class="button button-primary k6-compile k6-disabled" disabled="true">' +
          '<span class="k6-compile-text">' + l10n['compiled'] + '</span>' +
          '<i class="spinner"></i>' +
        '</button>' +
      '</div>'
    );
    $compileControl.appendTo(WpDom.$wpControls);
  }

  /**
   * Switch live compiling mode
   * @param  {boolean} mode True for 'automatic', false for 'manual'
   */
  function _setMode (automatic) {
    liveCompiling = Utils.toBoolean(automatic);
    Compiler.automatic = liveCompiling;
    var bodyAttr = liveCompiling ? 'automatic' : 'manual';
    body.setAttribute('data-k6-live-compiling', bodyAttr);
    $compileControl.toggle(!liveCompiling);
  }

  /**
   * Bind compile buttons,
   * we can have more than one, use .class
   */
  function _bindCompileButtons () {
    $compileButtons = $('.k6-compile'); // k6todo when we'll work on this remove jquery \\
    $compileButtonsText = $('.k6-compile-text');
    $compileButtons.on('click', _compile);
  }

  /**
   * Enable compile buttons
   */
  function _compileEnable () {
    uncompiledChangesArePending = true;
    $compileButtons.attr('disabled', false).removeClass('k6-disabled'); // k6ie8 \\
    $compileButtonsText.text(l10n['compile']);
  }

  /**
   * Disable compile buttons
   */
  function _compileDisable () {
    uncompiledChangesArePending = false;
    $compileButtons.attr('disabled', 'disabled').addClass('k6-disabled'); // k6ie8 \\
    $compileButtonsText.text(l10n['compiled']);
  }

  /**
   * Extend Worpdress Customize API
   * Add:
   * `recompile` transport type
   * which doesn't send messages to the iframe
   * but only to our less compiler.
   * 'none' which doesn't send the value anywhere but
   * the wp api gets notified and the value eventually saved.
   * `recompileRefresh` which both recompiles less
   * and refresh the iframe.
   *
   * @see ./wp-admin/js/customize-controls.js#L23
   * too see the extended WordPress API.
   */
  function _extendWpAPI () {
    var apiSetting = api.Setting;
    api.Setting = apiSetting.extend({
      preview: function() {
        apiSetting.prototype.preview.apply(this);

        var id, varName, varValue;

        switch (this.transport) {
          case 'none':
            // do nothing
          break;
          case 'recompile':
            // send value to less
            varName = '@' + this.id;
            varValue = this();
            _update(varName, varValue);
          break;
          case 'recompileAndPost':
            // send value to less
            id = this.id;
            varName = '@' + id;
            varValue = this();
            _update(varName, varValue);
            // and send also to the previewer to mimic the recompile more instantly
            this.previewer.send( 'setting', [ id, varValue ] );
          break;
          case 'recompileLater':
            // only update customization and modifer stores in memory, on next recompile they'll be
            // compiled
            id = this.id;
            varName = '@' + id;
            varValue = this();
            modifier[varName] = varValue;
            customization[varName] = varValue;
            lastRefreshNeedsToRecompile = true;
            uncompiledChangesArePending = true;
            // send to the previewer to mimic the recompile
            this.previewer.send( 'setting', [ id, varValue ] );
          break;
          case 'recompileRefresh':
            // k6todo, this doesn't seem to be needed actually, because we
            // recompile always on refresh (see line #409 of this file),
            // anyway, no matter if we actually need it or not, and that is
            // because of the iframe change, which forces us to reinject the
            // compiled less in the targeted document \\
            // send value to less
            varName = '@' + this.id;
            varValue = this();
            if (workersSupport) {
              _update(varName, varValue);
            }
            modifier[varName] = varValue;
            customization[varName] = varValue;
            // then refresh
            lastRefreshNeedsToRecompile = true;
            this.previewer.refresh();
          break;
          // override wp transport, we need this flag when we are
          // in manual compilation mode, otherwise on iframe refresh
          // the button always indicate a possible compilation
          // even if the changed setting doesn't need to recompile less
          case 'refresh': // k6tobecareful here we override the wordpress api transport method \\
            lastRefreshNeedsToRecompile = false;
            this.previewer.refresh();
          break;
        }
      }
    });
    api.defaultConstructor = api.Setting;
  }

  /**
   * Get Preview Iframe
   * @return {document} The document of the preview iframe
   */
  function _getIframeDoc () {
    return iframeDoc;
  }

  /**
   * Configure less.js
   */
  function _lessJsConfigure () {
    /** @type less The global less Object (see externs) */
    less = {
      env: 'production',
      isFileProtocol: false,
      useFileCache: true,
      compress: true, // k6doubt \\
      logLevel: 0, // k6debug \\
      // relativeUrls: true,
      // async: true,
      overrideCSStarget: _getIframeDoc,
      globalVars: customization,
      onReady: false,
      // callback once the compilation is done
      postProcessor: function (styles) {
        lastCompiledCSS = styles;
        return styles;
      },
      // here is less.js to be weird, it doesn't consistently
      // pass the same type of arguments to the errorReporting
      // so we need to check
      errorReporting: function (mode, pathOrEvent, rootHref) {
        if (typeof pathOrEvent === 'object') {
          _lessJsOnError({
            error: pathOrEvent,
            id: rootHref
          });
        }
      }
    };
  }

  /**
   * Load Less.js dynamically here,
   * because first we have to configure it
   * and load the iframe containing the `.less` files to compile
   */
  function _lessJsLoad () {
    var deferred = $.Deferred();

    if (lessJsLoaded) {
      deferred.resolve();
    } else {
      $.getScript(K6['constants']['PREPROCESSOR_URL'])
        .fail(function () {
          // alert('Somehow there was a problem loading less.js'); // k6todo error handling \\
          lessJsLoaded = false;
          deferred.reject();
        })
        .done(function () {
          lessJsLoaded = true;
          deferred.resolve();
        });
    }
    return deferred;
  }

  /**
   * [_lessJsOnError description]
   * @param  {Object} data Object with info about the less error.
   */
  function _lessJsOnError (data) {
    // k6todo error handling
    // alert('Error during compilation' + ' File: ' + data.error.filename + ' Info: ' + data.error.message);
    // \\
    _onUpdateDone();
  }

  /**
   * Manage the worker's work
   *
   */
  function _workerManager () {
    var constants = K6['constants'];
    worker = new Worker(constants['WORKER_URL']);
    worker.postMessage({
      'UNCOMPILED_STYLESHEET': constants['UNCOMPILED_STYLESHEET'],
      'UNCOMPILED_STYLESHEET_URL': constants['UNCOMPILED_STYLESHEET_URL'],
      'PREPROCESSOR_WORKER_URL': constants['PREPROCESSOR_WORKER_URL'],
      'customization': customization
    });
    worker.onmessage = function (e) {
      lastCompiledCSS = e.data;
      if (liveCompiling) {
        _updateCSSfromWorker(lastCompiledCSS);
      } else {
        body.classList.remove('k6-compiling');
        _compileDisable();
        _embeddedCSSremove();
        _updateCSSfromWorker(lastCompiledCSS);
      }
      if (workerDeferred) {
        workerDeferred.resolve();
      }
      _onUpdateDone();
    };
  }

  /**
   * Update CSS in the iframe
   *
   */
  function _updateCSSfromWorker (cssString) {
    // console.log('Received worker message with parsed css');
    var css = cssString || lastCompiledCSS;
    if (!css || !iframeDoc) {
      return;
    }
    var oldCSS = iframeDoc.getElementById(THEME_STYLE_MAIN_ID);
    if (oldCSS) {
      oldCSS.innerHTML = css;
    } else {
      var style = document.createElement('style');
      style.id = THEME_STYLE_MAIN_ID;
      style.innerHTML = css;
      style.appendChild(document.createTextNode(''));
      iframeDoc.head.appendChild(style);
    }
  }

  /**
   *
   * Compile CSS
   * with current modifier object
   * @return {Promise} After less has done its job
   */
  function _compile (e) {
    // it's a button in the wp form so don't submit
    if (e) {
      e.preventDefault();
    }
    var deferred = $.Deferred();
    body.classList.add('k6-compiling');
    $compileButtonsText.text(l10n['compiling']);
    if (workersSupport) {
      worker.postMessage(modifier);
      workerDeferred = null;
      workerDeferred = $.Deferred();
      return workerDeferred;
    } else {
      _lessJsLoad().done(function () {
        less.registerStylesheets().then(function () {
          body.classList.remove('k6-compiling');
          _embeddedCSSremove();
          _compileDisable();
          less.refresh(false, modifier, false);
          deferred.resolve();
        });
      });
    }
    return deferred;
  }

  /**
   * Recompile CSS
   * re-register stylesheets on transport `refresh` and refresh less
   */
  function _recompile () {
    _lessJsLoad().done(function () {
      less.registerStylesheets().then(function () {
        less.refresh(false, modifier, false).done(_onUpdateDone);
      });
    });
  }

  /**
   * Update:
   * - the modifier store object containing all the vars changed
   * to pass to less
   * - the general customization object so that we can compare
   * it to the new one when the iframe gets refreshed.
   * - less, debouncin' the function execution.
   *
   * @param  {String} key   Modifier object key (variable name)
   * @param  {String} value Modifier object value (variable value)
   */
  function _update (key, value) {
    modifier[key] = value;
    customization[key] = value;

    if (liveCompiling) {
      Skeleton.loading();
      if (workersSupport) {
        _updateFromWorkerDebounced(modifier);
      } else {
        _updateDebounced(modifier);
      }
    } else {
      _compileEnableDebounced();
    }
  }

  /**
   * Debounce less update
   * @param  {Object} modifier The key value pair with all the less
   *                           variables modified in the session
   */
  var _updateDebounced = _.debounce(function (modifier) { // k6wptight-js_dep \\
    less.modifyVars(modifier).done(_onUpdateDone);
  }, 500);

  /**
   * Debounce less update
   * @param  {Object} modifier The key value pair with all the less
   *                           variables modified in the session
   */
  var _updateFromWorkerDebounced = _.debounce(function (modifier) { // k6wptight-js_dep \\
    worker.postMessage(modifier);
  }, 500);

  /**
   * Debounce button enabler
   * Shows also the loader
   */
  var _compileEnableDebounced = _.debounce(_compileEnable, 500); // k6wptight-js_dep \\

  /**
   * On less compile callback
   * Emit event on window (we'll use it in the `Import` component)
   */
  function _onUpdateDone () {
    if (firstLoad) {
      // to avoid a flash of unstyled content...
      setTimeout(function () {
        Skeleton.hide();
      }, 600);
      firstLoad = false;
    }
    uncompiledChangesArePending = false;
    Skeleton.loaded();
    $window.trigger('k6.compiler.done');
  }

  /**
   * Remove embedded CSS
   *
   */
  function _embeddedCSSremove () {
    var oldCSS = iframeDoc.getElementById(THEME_STYLE_MAIN_ID);
    if (oldCSS) {
      oldCSS.parentNode.removeChild(oldCSS);
    }
  }

  /**
   * Update embedded CSS
   *
   * To create the `<style>` tag through CSS look
   * {@link http://davidwalsh.name/add-rules-stylesheets davidwalsh.name}.
   */
  function _embeddedCSSupdate () {
    var oldCSS = iframeDoc.getElementById(THEME_STYLE_MAIN_ID);
    // update only if CSS has been already compiled at least once
    // so that lastCompiledCSS is not null
    if (oldCSS && lastCompiledCSS) {
      var style = document.createElement('style');
      // set the same id of the old <link> style tag
      // so that _embeddedCSSremove can just look for the same id to either
      // remove the <link> tag enqueued through php or the <style> tag
      // updated here in '_embeddedCSSupdate'
      style.id = oldCSS.id;
      // set the last comiled CSS
      style.innerHTML = lastCompiledCSS;
      // append the <style> tag
      style.appendChild(document.createTextNode(''));
      iframeDoc.head.appendChild(style);
      // remove the old <link> tag
      oldCSS.parentNode.removeChild(oldCSS);
    }
  }

  /**
   * Bind Save
   * Listen on WordPress 'save' action and
   * if there are uncompiled changes to css first compile then save,
   * otherwise just save.
   */
  function _bindSave () {
    api.bind('save', function() {
      Skeleton.loading();
      if (uncompiledChangesArePending) {
        _compile().done(_save);
      } else {
        _save();
      }
    });
  }

  /**
   * Save
   * Called on WordPress 'save' action,
   * post the compiled CSS and hide loader.
   * The CSS is saved to a file.css through the ajax hook.
   * This file has to be generated only once and needs to
   * be in the wp-upload folder and needs to be specific
   * to the theme name and also to the site id in a multisite
   * installation. So for instance it should be named:
   * theme-flake-001.css
   * When we save css we should keep on rewriting this.
   *
   */
  function _save () {
    $.post(window.ajaxurl, {
      'action': 'k6_save_css',
      'style': lastCompiledCSS || 0
    }).done(Skeleton.loaded);
  }

  function _bindModeSwitch () {
    // var control = api.control('k6[live-compiling]')
    // api.bind('ready', function () {
    //   api('k6[live-compiling]').bind(function (value) { // k6tobecareful name tight to control ID \\
    //     _setMode(value);
    //   });
    // });
  };

  // @public API
  return {
    /**
     * Init
     */
    init: _init,
    /**
     * Expose the compiling mode
     * @type {Boolean}
     */
    automatic: true,
    /**
     * On iframe ready
     * Set / Update the iframe document variable.
     * If we are live compiling just recompile less because the iframe
     * has been reloaded, so the compiled css in the style block is gone
     * and a new .less file to compile is enqueued.
     * Otherwise, in 'manual' mode alway hide loaders (_onUpdateDone())
     * and if it's not the first load of the Customize screen and if we have
     * previously made some changes to css settings (`modifier` would then contain
     * something) replace the original CSS enqueued in the iframe, with the last
     * compiled one, they would be different otherwise.
     * After also enable a new compilation.
     *
     * @param  {HTMLelement} iframe The new iframe in the previewer
     */
    onReady: function (iframe) {
      iframeDoc = iframe.contentWindow.document;
      if (workersSupport) {
        if (!firstLoad) {
          _updateCSSfromWorker();
        }
        return;
      }
      if (liveCompiling) {
        _recompile();
      } else {
        if (!firstLoad && !$.isEmptyObject(modifier)) {
          _embeddedCSSupdate();
          if (lastRefreshNeedsToRecompile) {
            _compileEnable();
          }
        }
        _onUpdateDone();
      }
    },
    /**
     * Compile less
     *
     * Just expose the compile method
     * @return {Promise}
     */
    compile: _compile
  };
})();

// export to the public api
window.K6.compiler = Compiler;