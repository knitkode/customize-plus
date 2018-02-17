import window from 'window';
import document from 'document';
import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import Skeleton from '../core/skeleton';
import Utils from '../core/utils';
import Validate from '../core/validate';

/**
 * Control Base class
 *
 * Change a bit the default Customizer Control class.
 * Render controls content on demand when their section is expanded then remove
 * the DOM when the section is collapsed. Since we override the `initialize`
 * and `renderContent` methods keep an eye on
 * @link(http://git.io/vZ6Yq, WordPress source code).
 *
 * @see PHP class KKcp_Customize_Control_Base.
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
   * @param {string} id                       - Unique identifier for the control instance.
     * @param {object} options                  - Options hash for the control instance.
     * @param {object} options.type             - Type of control (e.g. text, radio, dropdown-pages, etc.)
     * @param {string} [options.content]        - The HTML content for the control or at least its container. This should normally be left blank and instead supplying a templateId.
     * @param {string} [options.templateId]     - Template ID for control's content.
     * @param {string} [options.priority=10]    - Order of priority to show the control within the section.
     * @param {string} [options.active=true]    - Whether the control is active.
     * @param {string} options.section          - The ID of the section the control belongs to.
     * @param {mixed}  [options.setting]        - The ID of the main setting or an instance of this setting.
     * @param {mixed}  options.settings         - An object with keys (e.g. default) that maps to setting IDs or Setting/Value objects, or an array of setting IDs or Setting/Value objects.
     * @param {mixed}  options.settings.default - The ID of the setting the control relates to.
     * @param {string} options.settings.data    - @todo Is this used?
     * @param {string} options.label            - Label.
     * @param {string} options.description      - Description.
     * @param {number} [options.instanceNumber] - Order in which this instance was created in relation to other instances.
     * @param {object} [options.params]         - Deprecated wrapper for the above properties.
     * @returns {void}
     */
  initialize: function(id, options) {
    var control = this, deferredSettingIds = [], settings, gatherSettings;

    control.params = _.extend(
      {},
      control.defaults,
      control.params || {}, // In case sub-class already defines.
      options.params || options || {} // The options.params property is deprecated, but it is checked first for back-compat.
    );

    if ( ! wpApi.Control.instanceCounter ) {
      wpApi.Control.instanceCounter = 0;
    }
    wpApi.Control.instanceCounter++;
    if ( ! control.params.instanceNumber ) {
      control.params.instanceNumber = wpApi.Control.instanceCounter;
    }

    // Look up the type if one was not supplied.
    if ( ! control.params.type ) {
      _.find( wpApi.controlConstructor, function( Constructor, type ) {
        if ( Constructor === control.constructor ) {
          control.params.type = type;
          return true;
        }
        return false;
      } );
    }

    // if ( ! control.params.content ) {
    //   control.params.content = $( '<li></li>', {
    //     id: 'customize-control-' + id.replace( /]/g, '' ).replace( /\[/g, '-' ),
    //     'class': 'customize-control customize-control-' + control.params.type
    //   } );
    // }

    let container = document.createElement('li');
    container.id = 'customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
    container.className = 'customize-control kkcp-control customize-control-'
      + control.params.type;

    // add a flag so that we are able to recognize our custom controls, let's
    // keep it short, so we need only to check `if (control.kkcp)`
    control.kkcp = 1;

    control.id = id;
    // control.selector = '#customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
    // control.templateSelector = 'customize-control-' + control.params.type + '-content';
    // if ( control.params.content ) {
    //   control.container = $( control.params.content );
    // } else {
    //   control.container = $( control.selector ); // Likely dead, per above. See #28709.
    // }
    control.container = $(container);

    // save a reference of the raw DOM node, we're gonna use it more
    // than the jQuery object `container` (which we can't change, because it's
    // used by methods which we don't override)
    control._container = container;

    if ( control.params.templateId ) {
      control.templateSelector = control.params.templateId;
    } else {
      control.templateSelector = 'customize-control-' + control.params.type + '-content';
    }

    control.deferred = _.extend( control.deferred || {}, {
      embedded: new $.Deferred()
    } );
    control.section = new wpApi.Value();
    control.priority = new wpApi.Value();
    control.active = new wpApi.Value();
    control.activeArgumentsQueue = [];
    control.notifications = new wpApi.Notifications({
      alt: control.altNotice
    });

    control.elements = [];

    control.active.bind( function ( active ) {
      var args = control.activeArgumentsQueue.shift();
      args = $.extend( {}, control.defaultActiveArguments, args );
      control.onChangeActive( active, args );
    } );

    control.section.set( control.params.section );
    control.priority.set( isNaN( control.params.priority ) ? 10 : control.params.priority );
    control.active.set( control.params.active );

    wpApi.utils.bubbleChildValueChanges( control, [ 'section', 'priority', 'active' ] );

    control.settings = {};

    settings = {};
    if ( control.params.setting ) {
      settings['default'] = control.params.setting;
    }
    _.extend( settings, control.params.settings );

    // Note: Settings can be an array or an object, with values being either setting IDs or Setting (or Value) objects.
    _.each( settings, function( value, key ) {
      var setting;
      if ( _.isObject( value ) && _.isFunction( value.extended ) && value.extended( wpApi.Value ) ) {
        control.settings[ key ] = value;
      } else if ( _.isString( value ) ) {
        setting = wpApi( value );
        if ( setting ) {
          control.settings[ key ] = setting;
        } else {
          deferredSettingIds.push( value );
        }
      }
    } );

    gatherSettings = function() {

      // Fill-in all resolved settings.
      _.each( settings, function ( settingId, key ) {
        if ( ! control.settings[ key ] && _.isString( settingId ) ) {
          control.settings[ key ] = wpApi( settingId );
        }

      } );

      // Make sure settings passed as array gets associated with default.
      if ( control.settings[0] && ! control.settings['default'] ) {
        control.settings['default'] = control.settings[0];
      }

      // Identify the main setting.
      control.setting = control.settings['default'] || null;

      // control.linkElements(); // @@note this way of managing controls is disabled here \\
      // control.embed(); // @@note disable here for on demand rendering/inflation \\
    };

    if ( 0 === deferredSettingIds.length ) {
      gatherSettings();
    } else {
      wpApi.apply( wpApi, deferredSettingIds.concat( gatherSettings ) );
    }

    // we need to parse the factory value ourselves because we also encode it
    // ourselves in `base.php` control. It is enough to do this once on initialization
    if (!_.isUndefined(control.params['vFactory'])) {
      control.params['vFactory'] = JSON.parse(control.params['vFactory']);
      // These values seem to get copied on the main constructor at a certain
      // point instead of staying only on the `params` where we define them
      // (this happens since WordPress 4.9)
      // delete control['vFactory'];
      // delete control['vInitial'];
    }

    // an @abstract method to override (this needs to be called here, before than
    // the `ready` method)
    control.onInit();

    // After the control is embedded on the page, invoke the "ready" method.
    control.deferred.embedded.done( function () {
      // control.linkElements(); // @@note this way of managing controls is disabled here \\
      control.setupNotifications();
      control.ready();
    });

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

    // controls can be setting-less from 4.5
    if (control.setting) {
      // Add custom validation function overriding the empty function from WP
      // API in `customize-controls.js`, in the constructor `api.Value`
      control.setting.validate = control._beforeSet.bind(control);

      // bind setting change to control method to reflect a programmatic
      // change on the UI, only if the control is rendered
      control.setting.bind(function (value) {
        if (control.rendered) {
          control.syncUI.call(control, value);
        }
      });

      if (DEBUG) {
        control.setting.notifications.bind( 'change', () => {
          console.log(`Notification change for default setting of control '${control.id}'`);
        });
      }
    }
  },
  /**
   * Before `setting.set`, acutally `control.validate` wrap function.
   *
   * Always check that required setting (not `optional`) are not empty,
   * if it pass the check call the control specific abstract `validate` method.
   *
   * // @@doubt not sure whether this should be private or not \\
   * @access private
   * @param  {string} value
   * @return {string} The value validated or the last setting value.
   */
  _beforeSet: function (value) {
    let $validity;

    if (!this.params.optional && Validate.isEmpty(value)) {
      $validity = Validate.checkRequired([], value);

      this._manageValidityNotifications($validity);

      return this.params.loose ? value : this.setting();
    }

    $validity = this.validate(value);

    this._manageValidityNotifications($validity);

    if (!$validity.length) {
      return this.sanitize(value);
    }
    // @@doubt sanitize here despite the loose option? `this.sanitize(value)` \\
    return this.params.loose ? value : this.setting();
  },
  /**
   * Add validity notifications
   *
   * @abstract
   * @access private
   * @param  {array<object<string,string>>} error `{ msgId: msg }`
   */
  _manageValidityNotifications: function ($validity) {
    // always clear current notifications
    this._clearNotifications();

    // if no errors render and bail
    if (!$validity.length) {
      this.notifications.render();
      return;
    }
    this._currentValueHasError = true;

    for (let i = 0; i < $validity.length; i++) {
      let error = $validity[i];
      let code = _.keys(error)[0];
      let message = error[code] || api.l10n['vInvalid'];
      let notification = new wpApi.Notification(code, { type: 'error', message });
      this.notifications.add(notification);
      if (DEBUG) {
        console.log(`Notification add '${code}' for default setting of control '${this.id}'`);
      }
    }

    this.notifications.render();
  },
  /**
   * Clear notifications
   *
   * @abstract
   * @access private
   */
  _clearNotifications: function () {
    this._currentValueHasError = false;

    const notifications = this.notifications.get();
    if (!notifications.length) {
      return;
    }
    for (let i = 0; i < notifications.length; i++) {
      this.notifications.remove(notifications[i]['code']);
      if (DEBUG) {
        console.log(`Notification remove '${notifications[i]['code']}' for default setting of control '${this.id}'`);
      }
    }
    // this.notifications.render();
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
    const control = this;
    const _container = control._container;
    const templateId = control.templateSelector;
    let template;

    // Replace the container element's content with the control.
    if (document.getElementById('tmpl-' + templateId)) {
      template = wp.template(templateId);
      if (template && _container) {

        /* jshint funcscope: true */
        if (DEBUG.performances) var t = performance.now();

        // render and store it in the params
        control.template = _container.innerHTML = template(control.params).trim();

        // var frag = document.createDocumentFragment();
        // var tplNode = document.createElement('div');
        // tplNode.innerHTML = template( control.params ).trim();
        // frag.appendChild(tplNode);
        // control.template = frag;
        // _container.appendChild(frag);

        if (DEBUG.performances) console.log('%c renderContent of ' + control.params.type + '(' +
          control.id + ') took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7');
      }
    }

    this._rerenderNotifications();
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

    const container = this._container;

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
        this._rerenderNotifications();

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

    // if (DEBUG.performances) console.log('%c inflate of ' + this.params.type +
    //   ' took ' + (performance.now() - t) + ' ms.', 'background: #D2FFF1');
  },
  /**
   * Re-render notifications after content has been re-rendered.
   * This is taken as it is from the core base control class
   * (`wp.customize.Control`)in the end of the `renderContent` method
   */
  _rerenderNotifications () {
    this.notifications.container = this.getNotificationsContainerElement();
    const sectionId = this.section();
    if ( ! sectionId || ( wpApi.section.has( sectionId ) && wpApi.section( sectionId ).expanded() ) ) {
      this.notifications.render();
    }
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
    const params = this.params;
    /**
     * Reference to abstract method different in various control's subclasses
     * @type {function(*)}
     */
    const _softenize = this.softenize;
    // constants
    const CLASS_RESET_LAST = ' kkcp-extras-reset_last';
    const CLASS_RESET_INITIAL = ' kkcp-extras-reset_initial';
    const CLASS_RESET_FACTORY = 'kkcp-extras-reset_factory';
    const CLASS_DISABLED = ' kkcp-disabled';
    // DOM
    const container = this._container;
    const area = container.getElementsByClassName('kkcp-extras')[0];
    const toggle = container.getElementsByClassName('kkcp-extras-btn')[0];
    const btnResetLast = container.getElementsByClassName(CLASS_RESET_LAST)[0];
    const btnResetInitial = container.getElementsByClassName(CLASS_RESET_INITIAL)[0];
    const btnResetFactory = container.getElementsByClassName(CLASS_RESET_FACTORY)[0];
    // value variables, uses closure
    const setting = this.setting;
    const initialValue = params['vInitial'];
    const factoryValue = params['vFactory'];
    // state
    let isOpen = false;

    // handlers
    const _closeExtras = function () {
      container.classList.remove('kkcp-extras-open');
    };
    /**
     * Reset setting to the last saved value
     * It closes the `extras` dropdown.
     *
     */
    const _resetLastValue = function () {
      Utils._forceSettingSet(setting, params['vLastSaved']);
      _closeExtras();
    };
    /**
     * Reset setting to the value at the beginning of the session.
     * It closes the `extras` dropdown.
     *
     */
    const _resetInitialValue = function () {
      Utils._forceSettingSet(setting, initialValue);
      _closeExtras();
    };
    /**
     * Reset setting to the value at the factory state
     * (as defined in the theme defaults).
     * It closes the `extras` dropdown.
     *
     */
    const _resetFactoryValue = function () {
      Utils._forceSettingSet(setting, factoryValue);
      _closeExtras();
    };
    /**
     * Enable button responsible for: resetting to last saved value
     */
    const _enableBtnLast = function () {
      btnResetLast.className = CLASS_RESET_LAST;
      btnResetLast.onclick = _resetLastValue;
    };
    /**
     * Disable button responsible for: resetting to initial value
     */
    const _disableBtnLast = function () {
      btnResetLast.className = CLASS_RESET_LAST + CLASS_DISABLED;
      btnResetLast.onclick = '';
    };
    /**
     * Enable button responsible for: resetting to initial value
     */
    const _enableBtnInitial = function () {
      btnResetInitial.className = CLASS_RESET_INITIAL;
      btnResetInitial.onclick = _resetInitialValue;
    };
    /**
     * Disable button responsible for: resetting to initial value
     */
    const _disableBtnInitial = function () {
      btnResetInitial.className = CLASS_RESET_INITIAL + CLASS_DISABLED;
      btnResetInitial.onclick = '';
    };
    /**
     * Enable button responsible for: resetting to factory / theme-default value
     */
    const _enableBtnFactory = function () {
      btnResetFactory.className = CLASS_RESET_FACTORY;
      btnResetFactory.onclick = _resetFactoryValue;
    };
    /**
     * Disable button responsible for: resetting to factory / theme-default value
     */
    const _disableBtnFactory = function () {
      btnResetFactory.className = CLASS_RESET_FACTORY + CLASS_DISABLED;
      btnResetFactory.onclick = '';
    };
    /**
     * Update status (enable / disable)
     * for each control in the `extras` menu.
     */
    const _onExtrasOpen = () => {
      // if the control current value is not valid enable both reset buttons
      if (this._currentValueHasError) {
        _enableBtnInitial();
        _enableBtnFactory();
        return;
      }

      const currentValue = _softenize(setting());
      const lastSavedValue = params['vLastSaved'];

      // the last saved value is not always there like the others, we don't put
      // it in the big json through php, to save bytes, in the end. We check
      // here if the last value is `undefined`
      if (_.isUndefined(lastSavedValue) || _.isEqual(currentValue, _softenize(lastSavedValue))) {
        _disableBtnLast();
      } else {
        _enableBtnLast();
      }
      if (_.isEqual(currentValue, _softenize(initialValue))) {
        _disableBtnInitial();
      } else {
        _enableBtnInitial();
      }
      if (_.isEqual(currentValue, _softenize(factoryValue))) {
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
      toggle.onclick = () => {
        isOpen = !isOpen;
        container.classList.toggle('kkcp-extras-open', isOpen);
        if (isOpen) {
          _onExtrasOpen();
        }
        if (DEBUG) {
          console.info(`Control[${this.id}] `, this);
        }
      };
    }

    if (area) {
      area.onmouseenter = () => {
        isOpen = true;
        container.classList.add('kkcp-extras-open');
        _onExtrasOpen();
      };
      area.onmouseleave = () => {
        isOpen = false;
        // don't close immediately, wait a bit and see if the mouse is still out of the area
        setTimeout(() => {
          if (!isOpen) {
            container.classList.remove('kkcp-extras-open');
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
    const controlToFocusID = window._wpCustomizeSettings.autofocus.control;
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
      control.params['vLastSaved'] = control.setting();
    }
  });
});

export default api.controls.Base;
