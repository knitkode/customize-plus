import $ from 'jquery';
import _ from 'underscore';
import { api } from '../core/api';
import { wpApi } from '../core/globals';
import Skeleton from '../core/skeleton';
import Utils from '../core/utils';

/**
 * Control Base class
 *
 * Change a bit the default Customizer Control class.
 * Render controls content on demand when their section is expanded then remove
 * the DOM when the section is collapsed. Since we override the `initialize`
 * and `renderContent` methods keep an eye on
 * @link(http://git.io/vZ6Yq, WordPress source code).
 *
 * @see PHP class PWPcp_Customize_Control_Base.
 *
 * @class api.controls.Base
 * @extends wp.customize.Control
 * @augments wp.customize.Class
 * @requires api.core.Skeleton
 * @requires api.core.Utils
 */
api.controls.Base = wpApi.Control.extend({
  /**
   * Tweak the initialize methods.
   *
   * @param  {string} id      The control id
   * @param  {Object} options The control options
   */
  initialize: function(id, options) {
    var control = this;
    var settings;
    var advancedClass;

    control.params = {};
    _.extend( control, options || {} );
    control.id = id;

    // add a flag so that we are able to recognize our custom controls, let's
    // keep it short, so we need only to check `if (control.pwpcp)`
    control.pwpcp = 1;

    // control.selector = '#customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
    // control.templateSelector = 'customize-control-' + control.params.type + '-content';
    advancedClass = control.params.advanced ? ' pwpcp-control-advanced' : '';

    var container = document.createElement('li');
    container.id = 'customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
    container.className = 'customize-control pwpcp-control customize-control-'
      + control.params.type + advancedClass;

    control.container = $(container);

    // save a reference of the raw DOM node, we're gonna use it more
    // than the jquety object `container` (which we can't change, because it's
    // used by methods which we don't override)
    control._container = container;

    control.deferred = {
      embedded: new $.Deferred()
    };
    control.section = new wpApi.Value();
    control.priority = new wpApi.Value();
    control.active = new wpApi.Value();
    control.activeArgumentsQueue = [];

    control.active.bind(function (active) {
      var args = control.activeArgumentsQueue.shift();
      args = $.extend({}, control.defaultActiveArguments, args);
      control.onChangeActive(active, args);
    });

    control.section.set(control.params.section);
    control.priority.set(isNaN(control.params.priority) ? 10 : control.params.priority);
    control.active.set(control.params.active);

    wpApi.utils.bubbleChildValueChanges(control, ['section', 'priority', 'active']);

    // Associate this control with its settings when they are created
    settings = $.map(control.params.settings, function(value) {
      return value;
    });

    wpApi.apply(wpApi, settings.concat(function () {
      control.settings = {};
      for (var key in control.params.settings) {
        control.settings[key] = wpApi(control.params.settings[key]);
      }
      control.setting = control.settings['default'] || null;
    }));

    // embed controls only when the parent section get clicked to keep the DOM light,
    // to make this work all data can't be stored in the DOM, which is good
    wpApi.section(control.section()).expanded.bind(function (expanded) {
      // @@doubt \\
      // either deflate and re-inflate dom each time...
      // if (expanded) {
      //   _.defer(control.inflate.bind(control));
      // } else {
      //   control.deflate();
      // }
      // ...or just do it the first time a control is expanded
      if (expanded && !control.rendered) {
        _.defer(control.inflate.bind(control));
      }
    });

    // an @abstract method to override
    control.onInit();

    // controls can be setting-less from 4.5
    if (control.setting) {
      // Add custom validation function overriding the empty function from WP API.
      control.setting.validate = control._validateWrap.bind(control);

      // bind setting change to control method to reflect a programmatic
      // change on the UI, only if the control is rendered
      control.setting.bind(function (value) {
        if (control.rendered) {
          control.syncUI.call(control, value);
        }
      });
    }
  },
  /**
   * Validate wrap function.
   * Always check that required setting (not `optional`) are not empty,
   * if it pass the check call the control specific abstract `validate` method.
   *
   * // @@doubt not sure whether this should be private or not \\
   * @access private
   * @param  {string} newValue
   * @return {string} The newValue validated or the last setting value.
   */
  _validateWrap: function (newValue) {
    if (!this.params.optional && Utils._isSettingValueEmpty(newValue)) {
      this._onValidateError({ error: true, msg: api.l10n['vRequired'] });
      this._currentValueHasError = true;
      return this.setting();

    } else {
      newValue = this.sanitize(newValue);
      var validationResult = this.validate(newValue);

      if (validationResult.error) {
        this._onValidateError(validationResult);
        this._currentValueHasError = true;
        return this.setting();
      } else {
        this._onValidateSuccess(validationResult);
        this._currentValueHasError = false;
        return validationResult;
      }
    }
  },
  /**
   * On validation error (optionally override it in subclasses)
   * @abstract
   * @access private
   * @param  {object<string,boolean|string>} error `{ error: true, msg: string }`
   */
  _onValidateError: function (error) {
    var msg = error && error.msg ? error.msg : api.l10n['vInvalid'];
    this._container.classList.add('pwpcp-error');
    this._container.setAttribute('data-pwpcp-msg', msg);
  },
  /**
   * On validation success (optionally override it in subclasses)
   * @abstract
   * @access private
   */
  _onValidateSuccess: function () {
    this._container.classList.remove('pwpcp-error');
    this._container.removeAttribute('data-pwpcp-msg');
  },
  /**
   * Validate
   *
   * @abstract
   * @param  {string} newValue
   * @return {string} The newValue validated
   */
  validate: function (newValue) {
    return newValue;
  },
  /**
   * Sanitize
   *
   * @abstract
   * @param  {string} newValue
   * @return {string} The newValue sanitized
   */
  sanitize: function (newValue) {
    return newValue;
  },
  /**
   * Sync UI with value coming from API, a programmatic change like a reset.
   *
   * @abstract
   * @param {string} value The new setting value.
   */
  /* jshint unused: false */
  syncUI: function (value) {},
  /**
   * Triggered when the control has been initialized
   *
   * @abstract
   */
  onInit: function() {},
  /**
   * Render the control from its JS template, if it exists.
   *
   * @override
   */
  renderContent: function () {
    var template;
    var _container = this._container;
    var templateSelector = 'customize-control-' + this.params.type + '-content';

    // Replace the container element's content with the control.
    if (document.getElementById('tmpl-' + templateSelector)) {
      template = wp.template(templateSelector);
      if (template && _container) {

        /* jshint funcscope: true */
        if (DEBUG.performances) var t = performance.now();

        // render and store it in the params
        this.template = _container.innerHTML = template(this.params).trim();

        // var frag = document.createDocumentFragment();
        // var tplNode = document.createElement('div');
        // tplNode.innerHTML = template( this.params ).trim();
        // frag.appendChild(tplNode);
        // this.template = frag;
        // _container.appendChild(frag);

        if (DEBUG.performances) console.log('%c renderContent of ' + this.params.type + '(' +
          this.id + ') took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7');
      }
    }
  },
  /**
   * We don't need this method
   */
  dropdownInit: null,
  /**
   * Triggered just before the control get deflated from DOM
   *
   * @abstract
   */
  onDeflate: function () {},
  /**
   * Remove the DOM of the control.
   * In case the DOM store is empty (the first time
   * this method get called) it fills it.
   */
  deflate: function () {
    /* jshint funcscope: true */
    // if (DEBUG) var t = performance.now();

    var container = this._container;

    if (!this.template) {
      this.template = container.innerHTML.trim();
    }

    // call the abstract method
    this.onDeflate();

    // and empty the DOM from the container deferred
    // the slide out animation of the section doesn't freeze
    _.defer(function () {
      // due to the timeout we need to be sure that the section is not expanded
      if (!wpApi.section(this.section.get()).expanded.get()) {

        /* jshint funcscope: true */
        if (DEBUG.performances) var t = performance.now();

        // Super fast empty DOM element
        // {@link http://jsperf.com/jquery-html-vs-empty-vs-innerhtml/20}
        // while (container.lastChild) {
        //   container.removeChild(container.lastChild);
        // }

        // @@doubt, most of the times innerHTML seems to be faster, maybe when
        // there are many DOM elements to remove, investigate here \\
        container.innerHTML = '';

        if (DEBUG.performances) console.log('%c deflate of ' + this.params.type + '(' + this.id +
          ') took ' + (performance.now() - t) + ' ms.', 'background: #D2FFF1');

        // flag control that it's not rendered
        this.rendered = false;
      }
    }.bind(this));
  },
  /**
   * Inflate
   *
   * Render or 'inflate' the template of the control. The first time render it
   * from the js template, afterward retrieve the DOM string from the `template`
   * param store. After the template has been rendered call the `ready` method,
   * overridden in each control with their own specific logic. Also put a flag
   * `rendered` on the control instance to indicate whether the control is
   * rendered or not.
   *
   * @param  {boolean} shouldResolveEmbeddedDeferred Sometimes (i.e. for the
   *                                                 `control.focus()` method)
   *                                                 we need to resolve embed
   */
  inflate: function (shouldResolveEmbeddedDeferred) {
    /* jshint funcscope: true */
    if (DEBUG.performances) var t = performance.now();
    if (!this.template) {
      this.renderContent();
      if (DEBUG.performances) console.log('%c inflate DOM of ' + this.params.type +
        ' took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7');
    } else {
      if (!this.rendered) {
        this._container.innerHTML = this.template;
        if (DEBUG.performances) console.log('%c inflate DOM of ' + this.params.type +
          ' took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7');
      }
    }
    this.rendered = true;
    this.ready();
    if (shouldResolveEmbeddedDeferred) {
      this.deferred.embedded.resolve();
    }
    this._extras();
    // errors get resetted because on ready we fill the values in the UI with
    // the value of `this.setting()` which can never be not valid (see the
    // `_validateWrap` method above)
    this._onValidateSuccess();

    // if (DEBUG.performances) console.log('%c inflate of ' + this.params.type +
    //   ' took ' + (performance.now() - t) + ' ms.', 'background: #D2FFF1');
  },
  /**
   * Softenize
   *
   * Normalize setting for soft comparison.
   *
   * @abstract
   * @static
   * @access private
   * @param  {?} value Could be the original, the current, or the initial
   *                   session value
   * @return {string} The 'normalized' value passed as an argument.
   */
  softenize: function (value) {
    return value;
  },
  /**
   * Manage the extras dropdown menu of the control.
   *
   * @access private
   */
  _extras: function () {
    var self = this;
    var params = this.params;
    /**
     * Reference to abstract method different in various control's subclasses
     * @type {function(*)}
     */
    var _softenize = this.softenize;
    // constants
    var CLASS_RESET_LAST = ' pwpcp-extras-reset_last';
    var CLASS_RESET_INITIAL = ' pwpcp-extras-reset_initial';
    var CLASS_RESET_FACTORY = 'pwpcp-extras-reset_factory';
    var CLASS_DISABLED = ' pwpcp-disabled';
    // DOM
    var container = this._container;
    var area = container.getElementsByClassName('pwpcp-extras')[0];
    var toggle = container.getElementsByClassName('pwpcp-extras-btn')[0];
    var btnResetLast = container.getElementsByClassName(CLASS_RESET_LAST)[0];
    var btnResetInitial = container.getElementsByClassName(CLASS_RESET_INITIAL)[0];
    var btnResetFactory = container.getElementsByClassName(CLASS_RESET_FACTORY)[0];
    // value variables, uses closure
    var setting = this.setting;
    var initialValue = this.params.vInitial;
    var factoryValue = this.params.vFactory;
    // state
    var isOpen = false;

    // handlers
    var _closeExtras = function () {
      container.classList.remove('pwpcp-extras-open');
    };
    /**
     * Reset setting to the last saved value
     * It closes the `extras` dropdown.
     *
     */
    var _resetLastValue = function () {
      Utils._forceSettingSet(setting, params.vLast);
      _closeExtras();
    };
    /**
     * Reset setting to the value at the beginning of the session.
     * It closes the `extras` dropdown.
     *
     */
    var _resetInitialValue = function () {
      Utils._forceSettingSet(setting, initialValue);
      _closeExtras();
    };
    /**
     * Reset setting to the value at the factory state
     * (as defined in the theme defaults).
     * It closes the `extras` dropdown.
     *
     */
    var _resetFactoryValue = function () {
      Utils._forceSettingSet(setting, factoryValue);
      _closeExtras();
    };
    /**
     * Enable button responsible for: resetting to last saved value
     */
    var _enableBtnLast = function () {
      btnResetLast.className = CLASS_RESET_LAST;
      btnResetLast.onclick = _resetLastValue;
    };
    /**
     * Disable button responsible for: resetting to initial value
     */
    var _disableBtnLast = function () {
      btnResetLast.className = CLASS_RESET_LAST + CLASS_DISABLED;
      btnResetLast.onclick = '';
    };
    /**
     * Enable button responsible for: resetting to initial value
     */
    var _enableBtnInitial = function () {
      btnResetInitial.className = CLASS_RESET_INITIAL;
      btnResetInitial.onclick = _resetInitialValue;
    };
    /**
     * Disable button responsible for: resetting to initial value
     */
    var _disableBtnInitial = function () {
      btnResetInitial.className = CLASS_RESET_INITIAL + CLASS_DISABLED;
      btnResetInitial.onclick = '';
    };
    /**
     * Enable button responsible for: resetting to factory / theme-default value
     */
    var _enableBtnFactory = function () {
      btnResetFactory.className = CLASS_RESET_FACTORY;
      btnResetFactory.onclick = _resetFactoryValue;
    };
    /**
     * Disable button responsible for: resetting to factory / theme-default value
     */
    var _disableBtnFactory = function () {
      btnResetFactory.className = CLASS_RESET_FACTORY + CLASS_DISABLED;
      btnResetFactory.onclick = '';
    };
    /**
     * Update status (enable / disable)
     * for each control in the `extras` menu.
     */
    var _onExtrasOpen = function () {
      // if the control current value is not valid enable both reset buttons
      if (self._currentValueHasError) {
        _enableBtnInitial();
        _enableBtnFactory();
        return;
      }

      var currentValue = _softenize(setting());
      var lastValue = params.vLast;

      // the last saved value is not always there like the others, we don't put
      // it in the big json through php, to save bytes, in the end. We check
      // here if the last value is `undefined`
      if (_.isUndefined(lastValue) || currentValue === _softenize(lastValue)) {
        _disableBtnLast();
      } else {
        _enableBtnLast();
      }
      if (currentValue === _softenize(initialValue)) {
        _disableBtnInitial();
      } else {
        _enableBtnInitial();
      }
      if (currentValue === _softenize(factoryValue)) {
        _disableBtnFactory();
      } else {
        _enableBtnFactory();
      }
    };

    /**
     * When the extras dropdown is open determine which actions are
     * enabled and bind them. If the current value is the same
     * as the one the action effect would give disable the action.
     */
    if (toggle) {
      if (DEBUG) {
        toggle.title = 'Click to dump control object into console';
      }
      toggle.onclick = function () {
        isOpen = !isOpen;
        container.classList.toggle('pwpcp-extras-open', isOpen);
        if (isOpen) {
          _onExtrasOpen();
        }
        if (DEBUG) {
          console.info('Control[' + self.id + '] ', self);
        }
      };
    }

    if (area) {
      area.onmouseenter = function () {
        isOpen = true;
        container.classList.add('pwpcp-extras-open');
        _onExtrasOpen();
      };
      area.onmouseleave = function () {
        isOpen = false;
        // don't close immediately, wait a bit and see if the mouse is still out of the area
        setTimeout(function () {
          if (!isOpen) {
            container.classList.remove('pwpcp-extras-open');
          }
        }, 200);
      };
    }
  }
});

/**
 * Fix autofocus
 *
 * This is needed if autofocus is set to one of our 'post-rendered' controls
 */
wpApi.bind('ready', function () {
  try {
    var controlToFocusID = window._wpCustomizeSettings.autofocus.control;
    if (controlToFocusID) {
      Utils.linkControl(null, controlToFocusID);
    }
  } catch(e) {
    console.warn('Fix autofocus', e);
  }
});

/**
 * Save last saved value on each control instance on `saved` hook. With this in
 * the extras menu users will be able to reset the setting value to the last
 * saved value.
 */
wpApi.bind('save', function () {
  Utils._eachControl(function (control) {
    if (control.setting && control.setting['_dirty']) { // whitelisted from uglify \\
      // console.log(control.id, 'is dirty on save with value:', control.setting());
      control.params.vLast = control.setting();
    }
  });
});

export default api.controls.Base;
