/* global Modernizr, Skeleton, Compiler, Tools */
/* exported: Import */

/**
 * Import
 *
 * @requires Skeleton, Compiler and Tools
 */
var Import = (function () {

  var prePreviewState = {};
  var apiControl = api.control;
  var $input;
  var $form;
  var $warning;
  var $btnImport;
  var $btnPreview;

  /**
   * Init
   *
   * Immediately render template (printed in a script tag through php)
   */
  function _init () {
    Skeleton.inflate('k6-import-tpl', Tools.menu);

    $input = $('#k6-import-input');
    $form = $('#k6-import-form');
    $warning = $('#k6-import-warning');
    $btnImport = $('#k6-import-save');
    $btnPreview = $('#k6-import-preview');
    // on load hide btnPreview and warning
    $btnPreview.hide();
    $warning.hide();
    _bindFormBtn();
    _bindFormInput();
    if(Modernizr.filereader) {
      _bindPreviewBtn();
      _bindFormChange();
    }
  }

  function _bindFormInput () {
    $input.change(function () {
      if ($input.val().length === 0) {
        $btnImport.attr('disabled', true);
      } else {
        $btnImport.attr('disabled', false);
      }
    });
  }

  function _bindFormBtn () {
    $btnImport
      .attr('disabled', true)
      .on('click', function (event) {
        event.stopPropagation();
        // if all changes are saved import
        if (api.state('saved')()) {
          $form.submit();
        // otherwise prompt the user
        } else {
          if (confirm(l10n['importUnsaved'])) {
            $form.submit();
          }
        }
      });
  }

  function _bindFormChange () {
    $form.on('change', function(event) {
      var uploadedFile = event.target.files[0];
      if (uploadedFile) {
        var readFile = new FileReader();
        readFile.onload = function (e) {
          var contents = e.target.result;
          var json = JSON.parse(contents);
          _preview(json);
        };
        readFile.readAsText(uploadedFile);
        $btnPreview.attr('disabled', true).text(l10n['loadingPreview']).show();
        _showSpinner();
      } else {
        alert(l10n['failedLoadFile']); // k6todo error handling \\
      }
    });
  }

  function _bindPreviewBtn () {
    $btnPreview.on('click', function (e) {
      e.preventDefault();
      _showSpinner();
      $btnPreview.attr('disabled', true).text(l10n['resettingPreview']);
      _restorePrePreviewState();
      _hideSpinner();
    });
  }

  function _showSpinner () {
    $form.addClass('k6-import-process');
  }

  function _hideSpinner () {
    $form.removeClass('k6-import-process');
  }

  function _savePrePreviewSettings () {
    _.each(api.settings.controls, function (value, key) { // k6wptight-js_dep \\
      var control = apiControl.instance(key);
      // be sure that is one of our custom controls
      if (control && control.k6) {
        prePreviewState[key] = control.setting.get();
      }
    });
  }

  function _restoreSettings () {
    _.each(prePreviewState, function (value, key) { // k6wptight-js_dep \\
      var control = apiControl.instance(key);
      if (control) {
        control.setting.set(value);
      }
    });
  }

  function _restorePrePreviewState () {
    _showSpinner();
    Skeleton.title.textContent = l10n['resetting'];
    Skeleton.show();
    $btnPreview.text(l10n['resetting']);
    _restoreSettings();
    _waitCompiler(_onRestoreDone);
  }

  function _onRestoreDone () {
    prePreviewState = {};
    $btnPreview.attr('disabled', true).text(l10n['importResetted']);
    _hideSpinner();
    $warning.hide();
    Skeleton.hide();
    $window.off('k6.compiler.done');
  }

  /**
   * Get Option key
   * // k6tobecareful this is tight to class-customize.php
   * $setting_control_id = K6CP::$OPTIONS_PREFIX . '[' . $field_key . ']'; \\
   *
   * @param  {string} key The key/option name.
   * @return {string} The full option key.
   */
  function _getOptionKey (key) {
    return 'k6[' + key + ']';
  }

  /**
   * Since from WordPress 4.1 we export only the changed values (_dirty)
   * on import we need to reset to default (`control.original`) value
   * all the settings not included in the export file.
   * see @link https://core.trac.wordpress.org/ticket/28580#comment:4
   *
   * @param {Object} newSettings The imported settings
   * @param {boolean} areOptions If the list of settings are `option` instead of `theme_mods`
   *                             we need to prefix the key with `_getOptionKey`
   */
  function _setNewSettings (newSettings, areOptions) {
    _.each(api.settings.controls, function (value, key) { // k6wptight-js_dep \\
      var keyFinal = areOptions ? _getOptionKey(key) : key;
      var settingNew = newSettings[keyFinal];
      var control = apiControl.instance(keyFinal);
      if (!control) {
        return;
      }
      if (settingNew) {
        control.setting.set(settingNew);
      } else {
        var settingOriginal = value.original;
        if (settingOriginal) {
          control.setting.set(settingOriginal);
        }
      }
    });
  }

  /**
   * Wait Compiler to be done and execute callback.
   * Use the promise in case we are 'manually' recompiling.
   * Use instead the event listener (which needs to be turned off in the callback)
   * if we are always 'automatically' recompiling.
   * To don't call the callback too early let's be sure that the
   * compiler.done event is actually the last and less is really done compiling.
   * Unfortunately there's no cleaner way to get from less the exact moment when
   * everything is done. Because of the way we are triggering settings change
   * through the WordPress API (which is the correct way) but it send a lot of signals
   * to less which will fire several time the 'compile done' event even if we debounce
   * less recompile function.
   *
   * @link http://stackoverflow.com/a/5926068/1938970
   *
   * @param  {Function} callback [description]
   */
  function _waitCompiler (callback) {
    if (!Compiler.automatic) {
      Compiler.compile().done(callback);
    } else {
      var rtime = new Date();
      var timeout = false;
      var delta = 1000;
      $window.on('k6.compiler.done', function() {
        rtime = new Date();
        if (timeout === false) {
          timeout = true;
          setTimeout(compilerDone, delta);
        }
      });
      var compilerDone = function () {
        if (new Date() - rtime < delta) {
          setTimeout(compilerDone, delta);
        } else {
          timeout = false;
          callback();
        }
      };
    }
  }

  /**
   * Preview selected settings
   *
   * @param  {Object} json The objec containing all the theme settings to
   *                       preview (both `mods` and `options`).
   */
  function _preview (json) {
    var mods = json.mods;
    var options = json.options;

    if ($.isEmptyObject(prePreviewState)) {
      _savePrePreviewSettings();
    }
    // enable unload preview button
    _showSpinner();
    Skeleton.title.textContent = l10n['importProcessing'];
    Skeleton.text.textContent = '';
    Skeleton.show();
    $btnPreview.text(l10n['importProcessing']);
    // pass the imported mods and options to the controls
    // through the wp api
    if (mods) {
      _setNewSettings(mods);
    }
    if (options) {
      _setNewSettings(options, true);
    }
    _waitCompiler(_onPreviewReady);
  }

  function _onPreviewReady () {
    $btnPreview.attr('disabled', false).text(l10n['importUndo']);
    _hideSpinner();
    $warning.show();
    Skeleton.hide();
    // $window.off('k6.compiler.done');
  };

  // @public API
  return {
    init: _init,
    preview: function (json) {
      _preview(json);
    }
  };
})();
