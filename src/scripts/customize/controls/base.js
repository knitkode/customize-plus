import window from 'window';
import document from 'document';
import $ from 'jquery';
import _ from 'underscore';
import sprintf from 'locutus/php/strings/sprintf';
import vsprintf from 'locutus/php/strings/vsprintf';
import { api, wpApi } from '../core/globals';
import Utils from '../core/utils';
import Validate from '../core/validate';

/**
 * Control Base class
 *
 * Expands the default Customizer Control class (through standard class syntax).
 * Render controls content on demand when their section is expanded then remove
 * the DOM when the section is collapsed (inflation/deflation).
 * Since we override some 'not-meant-to-be-overriden' methods keep an eye on
 * @link(http://git.io/vZ6Yq, WordPress source code).
 *
 * @see PHP class KKcp_Customize_Control_Base
 * @since  1.0.0
 *
 * @class api.controls.Base
 * @extends wp.customize.Control
 * @augments wp.customize.Class
 * @requires api.core.Utils
 */
class ControlBase extends wpApi.Control {
  /**
   * {@inheritDoc}
   *
   * Tweak the initialize method.
   *
   * @override
   */
  initialize (id, options) {
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

    // @note `control.params.content` is managed differently in `inflate` and
    // `deflate` methods
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

    // @note add a flag so that we are able to recognize our custom controls,
    // let's keep it short, so we need only to check `if (control.kkcp)`
    control.kkcp = 1;

    control.id = id;
    // @note all this stuff is not needed in Customize Plus Controls
    // control.selector = '#customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
    // control.templateSelector = 'customize-control-' + control.params.type + '-content';
    // if ( control.params.content ) {
    //   control.container = $( control.params.content );
    // } else {
    //   control.container = $( control.selector ); // Likely dead, per above. See #28709.
    // }
    control.container = $(container);

    // @note save a reference of the raw DOM node, we're gonna use it more
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

      // @note this way of managing controls is disabled here
      // control.linkElements();
      // @note disable here for on demand rendering/inflation
      // control.embed();
    };

    if ( 0 === deferredSettingIds.length ) {
      gatherSettings();
    } else {
      wpApi.apply( wpApi, deferredSettingIds.concat( gatherSettings ) );
    }

    // @note call custom private initialization (not overridable by subclasses)
    this._initialize();
  }

  /**
   * Private Initialize
   *
   * Collect here the custom initialization additions of Customize Plus controls
   */
  _initialize () {
    // we need to parse the factory value ourselves because we also encode it
    // ourselves in `base.php` control. It is enough to do this once on
    // initialization
    if (!_.isUndefined(this.params['vFactory'])) {
      this.params['vFactory'] = JSON.parse(this.params['vFactory']);
      // These values seem to get copied on the main constructor at a certain
      // point instead of staying only on the `params` where we define them
      // (this seems to happen since WordPress 4.9)
      // delete this['vFactory'];
      // delete this['vInitial'];
    }

    // an @abstract method to override (this needs to be called here, before than
    // the `ready` method)
    this.onInit();

    // After the this is embedded on the page, invoke the "ready" method.
    this.deferred.embedded.done(() => {
      // @note this way of managing thiss is disabled
      // this.linkElements();
      this.setupNotifications();
      this.ready();
    });

    // embed control only when the parent section get clicked to keep the DOM
    // light,to make this work all data can't be stored in the DOM, which is ok
    wpApi.section(this.section()).expanded.bind((expanded) => {
      // @@doubt \\
      // either deflate and re-inflate dom each time...
      // if (expanded) {
      //   _.defer(this.inflate.bind(this));
      // } else {
      //   this.deflate();
      // }
      // ...or just do it the first time a this is expanded
      if (expanded && !this.rendered) {
        _.defer(this.inflate.bind(this));
      }
    });

    // controls can be setting-less from 4.5, so check
    if (this.setting) {

      // always add the initial setting value and the last saved value on
      // initialization without printing them to JSON via PHP `to_json`
      // this method
      this.params['vInitial'] = this.setting();
      this.params['vLastSaved'] = this.params['vInitial'];

      // Add custom validation function overriding the empty function from WP
      // API in `customize-thiss.js`, in the constructor `api.Value`
      if (!this.params['noLiveValidation']) {
        this.setting.validate = this._validate.bind(this);
      }

      // add sanitization of the value `postMessag`ed to the preview
      if (!this.params['noLiveSanitization'] && !this.params['loose']) {
        this.setting.sanitize = this.sanitize.bind(this);
      }

      // bind setting change to this method to reflect a programmatic
      // change on the UI, only if the this is rendered
      this.setting.bind((value) => {
        if (this.rendered) {
          this.syncUI.call(this, value);
        }
      });

      // this is needed to render a setting notification in its this
      this.setting.notifications.bind('add', (notification) => {
        // if (DEBUG) {
        //   console.log(`Notification add [${notification.code}] for default
        //    setting of this '${this.id}'`);
        // }
        this.notifications.add(new wpApi.Notification(notification.code,
          { message: notification.message })
        );
        this.notifications.render();
      });

      // this is needed to render a setting notification in its this
      this.setting.notifications.bind('removed', (notification) => {
        // if (DEBUG) {
        //   console.log(`Notification remove [${notification.code}] for default
        //    setting of this '${this.id}'`);
        // }
        this.notifications.remove(notification.code);
        this.notifications.render();
      });
    }
  }

  /**
   * Get localize string for current control
   *
   * Allows control classes to get a localized string by its key value. This is
   * useful during validation to define the validation messages only once both
   * for JavaScript and PHP validation.
   *
   * @see  PHP: `KKcp_Customize_Control_Base->l10n()`
   * @since  1.0.0
   * @return string
   */
  _l10n ( $key ) {
    return api.l10n[ $key ] || '';
  }

  /**
   * Private `validate` wrap, it only wraps the `setting.validate` function
   * calling each control subclass `validate` method on its default setting.
   *
   * Always check that required setting (not `optional`) are not empty,
   * if it pass the check call the control specific abstract `validate` method.
   *
   * @see  PHP KKcp_Customize_Control_Base::validate_callback
   * @access private
   * @param  {string} value
   * @return {string} The value validated or the last setting value.
   */
  _validate (value) {
    let $validity = {};

    // immediately check a required value validity
    $validity = Validate.required($validity, value, this.setting, this);

    // if a required value is not supplied only perform one validation routine
    if (!_.keys($validity).length) {

      // otherwise apply the specific control/setting validation
      $validity = this.validate(value);
    }

    this._manageValidityNotifications($validity);

    // if there are no errors return the given new value
    if (!_.keys($validity).length) {
      return value;
    }

    // otherwise choose what to return based on the "looseness" of this control
    return this.params.loose ? value : this.setting();
  }

  /**
   * Manage validity notifications
   *
   * @abstract
   * @access private
   * @param  {object<object<string,string>>} $validity
   */
  _manageValidityNotifications ($validity) {
    const notifications = this.setting.notifications.get();
    let currentNotificationCodes = [];

    // flag used somewhere else (see below)
    this._currentValueHasError = !!_.keys($validity).length;

    for (let i = 0; i < notifications.length; i++) {
      let code = notifications[i]['code'];
      currentNotificationCodes.push(code);
      // if an existing notification is now valid remove it
      if (!$validity[code]) {
        this.setting.notifications.remove(code);
      }
    }

    for (let code in $validity) {
      if ($validity.hasOwnProperty(code)) {
        // if the notification is not there already add it
        if (currentNotificationCodes.indexOf(code) === -1) {

          this.setting.notifications.add(new wpApi.Notification(
            code, { message: $validity[code] || api.l10n['vInvalid'] }
          ));
        }
      }
    }
  }

  /**
   * Add error
   *
   * Shortcut to manage the $validity object during validation
   *
   * @see  PHP: `KKcp_Customize_Control_Base->add_error()`
   * @since  1.0.0
   * @param WP_Error          $validity
   * @param string            $msg_id
   * @param mixd|array|null   $msg_arguments
   * @return WP_Error
   */
  _addError ( $validity, $msg_id, $msg_arguments ) {
    const $msg = this._l10n( $msg_id );

    // if there is an array of message arguments
    if ( _.isArray( $msg_arguments ) ) {
      $validity[$msg_id] = vsprintf( $msg, $msg_arguments );
    }
    // if there is just one message argument
    else if ( $msg_arguments ) {
      $validity[$msg_id] = sprintf( $msg, $msg_arguments );
    // if it is a simple string message
    } else {
      $validity[$msg_id] = $msg;
    }
    return $validity;
  }

  /**
   * Validate control's default setting value
   *
   * @abstract
   * @param  {string} value
   * @return {string} The value validated
   */
  validate (value) {
    return value;
  }

  /**
   * Sanitize control's default setting value
   *
   * @abstract
   * @param  {string} value
   * @return {string} The value sanitized
   */
  sanitize (value) {
    return value;
  }

  /**
   * Sync UI with value coming from API, a programmatic change like a reset.
   *
   * @abstract
   * @param {string} value The new setting value.
   */
  syncUI (value) {}

  /**
   * Triggered when the control has been initialized
   *
   * @abstract
   */
  onInit() {}

  /**
   * Render the control from its JS template, if it exists.
   *
   * @override
   */
  renderContent () {
    const {_container, templateSelector} = this;

    // replaces the container element's content with the control.
    if (document.getElementById(`tmpl-${templateSelector}`)) {
      const template = wp.template(templateSelector);
      if (template && _container) {

        /* jshint funcscope: true */
        if (DEBUG.performances) var t = performance.now();

        // render and store it in the params
        this.params.content = _container.innerHTML = template(this.params).trim();

        // var frag = document.createDocumentFragment();
        // var tplNode = document.createElement('div');
        // tplNode.innerHTML = template( this.params ).trim();
        // frag.appendChild(tplNode);
        // this.params.content = frag;
        // _container.appendChild(frag);

        if (DEBUG.performances) console.log('%c renderContent of ' + this.params.type + '(' +
          this.id + ') took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7');
      }
    }

    this._rerenderNotifications();
  }

  /**
   * Triggered just before the control get deflated from DOM
   *
   * @abstract
   */
  onDeflate () {}

  /**
   * Remove the DOM of the control.
   * In case the DOM store is empty (the first time
   * this method get called) it fills it.
   */
  deflate () {
    /* jshint funcscope: true */
    // if (DEBUG) var t = performance.now();

    const container = this._container;

    if (!this.params.content) {
      this.params.content = container.innerHTML.trim();
    }

    // call the abstract method
    this.onDeflate();

    // and empty the DOM from the container deferred
    // the slide out animation of the section doesn't freeze
    _.defer(() => {
      // due to the timeout we need to be sure that the section is not expanded
      if (!wpApi.section(this.section.get()).expanded.get()) {

        /* jshint funcscope: true */
        if (DEBUG.performances) var t = performance.now();

        // Super fast empty DOM element
        // {@link http://jsperf.com/jquery-html-vs-empty-vs-innerhtml/20}
        // while (container.lastChild) {
        //   container.removeChild(container.lastChild);
        // }

        // @@note, most of the times innerHTML seems to be faster, maybe when
        // there are many DOM elements to remove, investigate here \\
        container.innerHTML = '';

        if (DEBUG.performances) console.log('%c deflate of ' + this.params.type + '(' + this.id +
          ') took ' + (performance.now() - t) + ' ms.', 'background: #D2FFF1');

        // flag control that it's not rendered
        this.rendered = false;
      }
    });
  }

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
  inflate (shouldResolveEmbeddedDeferred) {
    /* jshint funcscope: true */
    if (DEBUG.performances) var t = performance.now();
    if (!this.params.content) {
      this.renderContent();

      if (DEBUG.performances) console.log('%c inflate DOM of ' + this.params.type +
        ' took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7');
    } else {
      if (!this.rendered) {
        this._container.innerHTML = this.params.content;
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
  }

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
  }

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
   * @return {?}       The 'normalized' value passed as an argument.
   */
  softenize (value) {
    return value;
  }

  /**
   * Manage the extras dropdown menu of the control.
   *
   * @access private
   */
  _extras () {
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

      if (_.isEqual(currentValue, _softenize(lastSavedValue))) {
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
}

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
    if (control && control.setting && control.setting['_dirty']) { // whitelisted from uglify \\
      // console.log(control.id, 'is dirty on save with value:', control.setting());
      control.params['vLastSaved'] = control.setting();
    }
  });
});

export default api.controls.Base = ControlBase;
