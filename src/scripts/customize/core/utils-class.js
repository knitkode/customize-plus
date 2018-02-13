import document from 'document';
import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi, body } from './globals';
import Regexes from './regexes';

/**
 * Utils
 *
 * @class api.core.Utils
 */
class Utils {

  constructor () {

    /** @type {string} */
    this._IMAGES_BASE_URL = api.constants['IMAGES_BASE_URL'];

    /** @type {string} */
    this._DOCS_BASE_URL = api.constants['DOCS_BASE_URL'];
  }

  /**
   * Is it an absolute URL?
   *
   * {@link http://stackoverflow.com/a/19709846/1938970}
   * @param  {string}  url The URL to test
   * @return {Boolean}     Whether is absolute or relative
   */
  _isAbsoluteUrl (url) {
    return Regexes._absoluteUrl.test(url);
  }
  /**
   * Clean URL from multiple slashes
   *
   * Strips possible multiple slashes caused by the string concatenation or dev errors
   *
   * @param  {string} url
   * @return {string}
   */
  _cleanUrlFromMultipleSlashes (url) {
    return url.replace(Regexes._multipleSlashes, '/');
  }

  /**
   * Get a clean URL
   *
   * If an absolute URL is passed we just strip multiple slashes,
   * if a relative URL is passed we also prepend the right base url.
   *
   * @param  {string} url
   * @param  {string} type
   * @return {string}
   */
  _getCleanUrl (url, type) {
    // return the absolute url
    var finalUrl = url;
    if (!this._isAbsoluteUrl(url)) {
      switch (type) {
        case 'img':
          finalUrl = this._IMAGES_BASE_URL + url;
          break;
        case 'docs':
          finalUrl = this._DOCS_BASE_URL + url;
          break;
        default:
          break;
      }
    }
    return this._cleanUrlFromMultipleSlashes(finalUrl);
  }

  /**
   * Get image url
   *
   * @static
   * @param  {string} url The image URL, relative or absolute
   * @return {string}     The absolute URL of the image
   */
  getImageUrl (url) {
    return this._getCleanUrl(url, 'img');
  }

  /**
   * Get docs url
   *
   * @static
   * @param  {string} url The docs URL, relative or absolute
   * @return {string}     The absolute URL of the docs
   */
  getDocsUrl (url) {
    return this._getCleanUrl(url, 'docs');
  }

  /**
   * Bind a link element or directly link to a specific control to focus
   *
   * @static
   * @param  {HTMLElement} linkEl The link DOM element `<a>`
   * @param  {string} controlId   The control id to link to
   */
  linkControl (linkEl, controlId) {
    var controlToFocus = wpApi.control(controlId);

    // be sure there is the control and update dynamic color message text
    if (controlToFocus) {
      if (linkEl) {
        linkEl.onclick = () => {
          this.focus(controlToFocus);
        };
      } else {
        this.focus(controlToFocus);
      }
    }
  }

  /**
   * Wrap WordPress control focus with some custom stuff
   *
   * @param {wp.customize.control} control
   */
  focus (control) {
    try {
      // try this so it become possible to use this function even
      // with WordPress native controls which don't have this method
      control.inflate(true);

      // always disable search, it could be that we click on this
      // link from a search result try/catch because search is not
      // always enabled
      api.components.Search.disable();
    } catch(e) {}
    control.focus();
    control.container.addClass('kkcp-control-focused');
    setTimeout(function () {
      control.container.removeClass('kkcp-control-focused');
    }, 2000);
  }

  /**
   * Reset control -> setting value to the value according
   * to the given mode argument
   *
   * @static
   * @param  {Control} control  The control whose setting has to be reset
   * @param  {string} resetType Either `'initial'` or `'factory'`
   * @return {boolean}          Whether the reset has succeded
   */
  resetControl (control, resetType) {
    const params = {control};
    if (!control.setting) {
      return true;
    }
    var value;
    if (resetType === 'last' && !_.isUndefined(params['vLastSaved'])) {
      value = params['vLastSaved'];
    } else if (resetType === 'initial') {
      value = params['vInitial'];
    } else if (resetType === 'factory') {
      value = params['vFactory'];
    }
    if (value) {
      control.setting.set(value);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Check if the given type of reset is needed for a specific control
   *
   * @static
   * @param  {Control} control  The control which need to be checked
   * @param  {string} resetType Either `'initial'` or `'factory'`
   * @return {boolean}          Whether the reset has succeded
   */
  _isResetNeeded (control, resetType) {
    var params = control.params;
    if (!control.kkcp || !control.setting) {
      return false;
    }
    var _softenize = control.softenize;
    var value = _softenize(control.setting());
    if (resetType === 'last' && !_.isUndefined(params['vLastSaved'])) {
      return value !== _softenize(params['vLastSaved']);
    } else if (resetType === 'initial') {
      return value !== _softenize(params['vInitial']);
    } else if (resetType === 'factory') {
      return value !== _softenize(params['vFactory']);
    }
  }

  /**
   * Force `setting.set`.
   * Use case:
   * When a required text control content gets deleted by the user,
   * the extras dropdown shows the reset buttons enabled but clicking on any
   * of them doesn't give any effect in the UI. Why? Because when the input
   * field gets emptied the validate function set the setting to the last
   * value using `return this.setting()`, this returning value it is likely
   * to be the same as the initial session or the factory value, therefore
   * before and after the user has clicked the reset button the value of the
   * setting could stay the same. Despite this make sense, the input field
   * gets out of sync, it becomes empty, while the setting value remains the
   * latest valid value).
   * The callback that should be called on reset (the `syncUIfromAPI` method)
   * in this scenario doesn't get called because in the WordPress
   * `customize-base.js#187` there is a check that return the function if the
   * setting has been set with the same value as the last one, preventing so
   * to fire the callbacks binded to the setting and, with these, also our
   * `syncUIfromAPI` that would update the UI, that is our input field with
   * the resetted value. To overcome this problem we can force the setting to
   * set anyway by temporarily set the private property `_value` to a dummy
   * value and then re-setting the setting to the desired value, in this way
   * the callbacks are fired and the UI get back in sync.
   *
   * @static
   * @param  {wp.customize.Setting} setting
   * @param  {string} value
   */
  _forceSettingSet (setting, value, dummyValue) {
    setting['_value'] = dummyValue || 'dummy'; // whitelisted from uglify \\
    setting.set(value);
  }

  /**
   * Each control execute callback with control as argument
   *
   * @static
   * @param {function} callback
   */
  _eachControl (callback) {
    var wpApiControl = wpApi.control;
    for (var controlId in wpApi.settings.controls) {
      var control = wpApiControl(controlId);
      // @@doubt, probably unneeded check \\
      if (control && control.setting) {
        callback(control);
      }
    }
  }

  /**
   * Is the control's setting using the `theme_mods` API?
   *
   * @static
   * @param  {string}  controlId The control id
   * @return {Boolean}
   */
  _isThemeModsApi (controlId) {
    return !Regexes._optionsApi.test(controlId);
  }

  /**
   * Is the control's setting using the `options` API?
   * Deduced by checking that the control id is structured as:
   * `themeprefix[setting-id]`
   *
   * @static
   * @param  {string}  controlId The control id
   * @return {Boolean}
   */
  _isOptionsApi (controlId) {
    return Regexes._optionsApi.test(controlId);
  }

  /**
   * Strip HTML from input
   * {@link http://stackoverflow.com/q/5002111/1938970}
   *
   * @static
   * @param  {string} input
   * @return {string}
   */
  _stripHTML (input) {
    return $(document.createElement('div')).html(input).text();
  }

  /**
   * Selectize render option function
   *
   * @abstract
   * @static
   * @param  {Object} data     The selectize option object representation.
   * @param  {function} escape Selectize escape function.
   * @return {string}          The option template.
   */
  _selectizeRenderOptionSize (data, escape) {
    return '<div class="kkcpsize-selectOption">' +
        '<i>' + escape(data.valueCSS) + '</i> ' + escape(data.label) +
      '</div>';
  }

  /**
   * Selectize render option function
   *
   * @abstract
   * @static
   * @param  {Object} data     The selectize option object representation.
   * @param  {function} escape Selectize escape function.
   * @return {string}          The option template.
   */
  _selectizeRenderOptionColor (data, escape) {
    return '<div class="kkcpcolor-selectOption" style="border-color:' +
      escape(data.valueCSS) + '">' + escape(data.label) + '</div>';
  }

  /**
   * Get stylesheet by Node id
   *
   * @abstract
   * @static
   * @param  {string} nodeId
   * @return {?HTMLElement}
   */
  _getStylesheetById (nodeId) {
    var stylesheets = document.styleSheets;
    try {
      for (var i = 0, l = stylesheets.length; i < l; i++) {
        if (stylesheets[i].ownerNode.id === nodeId) {
          return stylesheets[i];
        }
      }
    } catch(e) {
      return null;
    }
  }

  /**
   * Get rules from stylesheet for the given selector
   *
   * @abstract
   * @static
   * @param  {HTMLElement} stylesheet
   * @param  {string} selector
   * @return {string}
   */
  _getRulesFromStylesheet (stylesheet, selector) {
    var output = '';
    if (stylesheet) {
      var rules = stylesheet.rules || stylesheet.cssRules;
      for (var i = 0, l = rules.length; i < l; i++) {
        if (rules[i].selectorText === selector) {
          output += (rules[i].cssText) ? ' ' + rules[i].cssText : ' ' + rules[i].style.cssText;
        }
      }
    }
    return output;
  }

  /**
   * Get CSS (property/value pairs) from the given rules.
   *
   * Basically it just clean the `rules` string removing the selector and
   * the brackets.
   *
   * @param  {string} rules
   * @param  {string} selector
   * @return {string}
   */
  _getCssRulesContent (rules, selector) {
    var regex = new RegExp(selector, 'g');
    var output = rules.replace(regex, '');
    output = output.replace(/({|})/g, '');
    return output.trim();
  }
}


// export to public API
export default Utils;
