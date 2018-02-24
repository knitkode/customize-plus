import window from 'window';
import document from 'document';
import $ from 'jquery';
import _ from 'underscore';
import sprintf from 'locutus/php/strings/sprintf';
import vsprintf from 'locutus/php/strings/vsprintf';
import { api, wpApi } from '../core/globals';
import Utils from '../core/utils';
import Validate from '../core/validate';
import Notification from '../core/notification';

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
 * @memberof controls
 * @class Base
 *
 * @extends wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Utils
 * @requires Validate
 */
class Base extends wpApi.Control {

  /**
   * {@inheritDoc}
   *
   * Extends the constructor with a tweaked version of the WordPress Control
   * initialize method, a custom hook `componentInit` and a private and shared
   * initialization for Customize Plus controls.
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @override
   */
  constructor (id, options) {
    this.initialize(id, options);
    this.componentInit();
    this._customInitialize();
  }

  /**
   * {@inheritDoc}
   *
   * Tweak the initialize method.
   *
   * @since 1.0.0
   *
   * @memberof! controls.Base#
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

    // @note `control.params.content` is managed differently in `_mount` and
    // `_unmount` methods
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

    // @note this is disabled, template are defined in Javascript control classes
    // if ( control.params.templateId ) {
    //   control.templateSelector = control.params.templateId;
    // } else {
    //   control.templateSelector = 'customize-control-' + control.params.type + '-content';
    // }

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
      if (!api.constants['DYNAMIC_CONTROLS_RENDERING']) {
        control.embed();
      }
    };

    if ( 0 === deferredSettingIds.length ) {
      gatherSettings();
    } else {
      wpApi.apply( wpApi, deferredSettingIds.concat( gatherSettings ) );
    }
  }

  /**
   * Component init
   *
   * This is the methods that subclasses could override with their custom init
   * logic (no DOM is available at this point)
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access package
   * @abstract
   * @return {void}
   */
  componentInit () {
  }

  /**
   * Custom initialization
   *
   * Collect here the custom initialization additions of Customize Plus controls
   *
   * @since 1.0.0
   *
   * @memberof! controls.Base#
   * @access private
   * @return {void}
   */
  _customInitialize () {
    // alias for ready method React like
    this.ready = this.componentDidMount;

    // After the control is embedded on the page, invoke the "ready" method.
    this.deferred.embedded.done(() => {
      // @note this way of managing controls is disabled
      // this.linkElements();
      this.setupNotifications();

      // this.ready(); // @note ready is called within `_mount` called here below
      if (!api.constants['DYNAMIC_CONTROLS_RENDERING']) {
        this._mount();
      }
    });

    if (api.constants['DYNAMIC_CONTROLS_RENDERING']) {
      // embed control only when the parent section get clicked to keep the DOM
      // light,to make this work no data must be stored in the DOM
      wpApi.section(this.section()).expanded.bind((expanded) => {
        // @@doubt \\
        // either unmount and mount dom each time...
        if (expanded) {
          _.defer(this._mount.bind(this));
        } else {
          this._unmount();
        }
        // ...or just do it the first time a control is expanded
        // if (expanded && !this.rendered) {
        //   _.defer(this._mount.bind(this));
        // }
      });
    }

    // controls can be setting-less from 4.5, so check
    if (this.setting) {

      // add custom validation function overriding the empty function from WP
      // API in `customize-thiss.js`, in the constructor `api.Value`
      if (!this.params['noLiveValidation']) {
        this.setting.validate = this._validate.bind(this);
      }

      // add sanitization of the value `postMessage`d to the preview
      if (!this.params['noLiveSanitization'] && !this.params['loose']) {
        this.setting.sanitize = (value) => {
          return this.sanitize(value, this.setting, this);
        };
      }

      // bind setting change to this method to reflect a programmatic
      // change on the UI, only if the control is rendered
      this.setting.bind((value) => {
        // @@todo maybe do this section expanded check as well
        // \\
        const sectionId = this.section();
        if ( ! sectionId || ( wpApi.section.has( sectionId ) && wpApi.section( sectionId ).expanded() ) ) {
          if (this.rendered && this.shouldComponentUpdate(value)) {
            this.componentDidUpdate(value);
          }
        }
      });

      if (api.constants['DYNAMIC_CONTROLS_RENDERING']) {
        // this is needed to render a setting notification in its this
        this.setting.notifications.bind('add', (notification) => {
          // if (DEBUG) {
          //   console.log(`Notification add [${notification.code}] for default
          //    setting of this '${this.id}'`);
          // }
          this.notifications.add(new Notification(notification.code,
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
  }

  /**
   * Get localize string for current control
   *
   * Allows control classes to get a localized string by its key value. This is
   * useful during validation to define the validation messages only once both
   * for JavaScript and PHP validation.
   *
   * @see  PHP KKcp_Customize_Control_Base->l10n()
   * @since 1.0.0
   *
   * @memberof! controls.Base#
   * @access package
   * @param {string} $key
   * @return {string}
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
   * @since 1.0.0
   *
   * @memberof! controls.Base#
   * @access package
   * @param  {string} value
   * @return {string} The value validated or the last setting value.
   */
  _validate (value) {
    let $validity = [];

    // immediately check a required value validity
    $validity = Validate.required($validity, value, this.setting, this);

    // if a required value is not supplied only perform one validation routine
    if (!_.keys($validity).length) {

      // otherwise apply the specific control/setting validation
      $validity = this.validate($validity, value, this.setting, this);
    }

    this._manageValidityNotifications($validity);

    // if there are no errors return the given new value
    if (!$validity.length) {
      return value;
    }

    // otherwise choose what to return based on the "looseness" of this control
    return this.params.loose ? value : this.setting();
  }

  /**
   * Manage validity notifications
   *
   * @since 1.0.0
   *
   * @memberof! controls.Base#
   * @access package
   * @abstract
   * @param  {WP_Error} $validity
   */
  _manageValidityNotifications ($validity) {
    const notifications = this.setting.notifications.get();
    const newCodes = _.pluck($validity, 'code');
    let currentCodes = [];

    // flag used somewhere else (see below)
    this._currentValueHasError = !!$validity.length;

    for (let i = 0; i < notifications.length; i++) {
      let code = notifications[i]['code'];
      currentCodes.push(code);
      // if an existing notification is now valid remove it
      if (newCodes.indexOf(code) === -1) {
        this.setting.notifications.remove(code);
      }
    }

    for (let j = 0; j < $validity.length; j++) {
      let {code, type, msg} = $validity[j];

      // if the notification is not there already add it
      if (currentCodes.indexOf(code) === -1) {
        this.setting.notifications.add(
          new Notification(code, {
            type: type,
            message: msg || api.l10n['vInvalid'],
          }
        ));
      }
    }
  }

  /**
   * Add validity notitification
   *
   * @see  PHP KKcp_Customize_Control_Base->add_error()
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access package
   * @param {string}            $type
   * @param {WP_Error}          $validity
   * @param {string}            $msg_id
   * @param {mixed|array|null}  $msg_arguments
   * @return {WP_Error}
   */
  _addValidityNotification ( $type, $validity, $msg_id, $msg_arguments ) {
    let $msg = this._l10n( $msg_id );

    // if there is an array of message arguments
    if ( _.isArray( $msg_arguments ) ) {
      $msg = vsprintf( $msg, $msg_arguments );
    }
    // if there is just one message argument
    else if ( $msg_arguments ) {
      $msg = sprintf( $msg, $msg_arguments );
    }
    // if it is a simple string message leave it as it is

    $validity.push({
      code: $msg_id,
      type: $type,
      msg: $msg
    });

    return $validity;
  }

  /**
   * Add error
   *
   * Shortcut to manage $validity during validation
   *
   * @see  PHP KKcp_Customize_Control_Base->add_error()
   * @since 1.0.0
   *
   * @memberof! controls.Base#
   * @access package
   * @param {WP_Error}          $validity
   * @param {string}            $msg_id
   * @param {mixed|array|null}  $msg_arguments
   * @return {WP_Error}
   */
  _addError ( $validity, $msg_id, $msg_arguments ) {
    return this._addValidityNotification( 'error', $validity, $msg_id, $msg_arguments );
  }

  /**
   * Add warning
   *
   * Shortcut to manage $validity during validation
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access package
   * @param {WP_Error}          $validity
   * @param {string}            $msg_id
   * @param {mixed|array|null}  $msg_arguments
   * @return {WP_Error}
   */
  _addWarning ( $validity, $msg_id, $msg_arguments ) {
    return this._addValidityNotification( 'warning', $validity, $msg_id, $msg_arguments );
  }

  /**
   * Add info
   *
   * Shortcut to manage $validity during validation
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access package
   * @param {WP_Error}          $validity
   * @param {string}            $msg_id
   * @param {mixed|array|null}  $msg_arguments
   * @return {WP_Error}
   */
  _addInfo ( $validity, $msg_id, $msg_arguments ) {
    return this._addValidityNotification( 'info', $validity, $msg_id, $msg_arguments );
  }

  /**
   * Validate control's default setting value
   *
   * @since 1.0.0
   *
   * @memberof! controls.Base#
   * @access public
   * @abstract
   * @param {WP_Error}             $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  validate ( $validity=[], $value, $setting, $control ) {
    return $validity;
  }

  /**
   * Sanitize control's default setting value
   *
   * @since 1.0.0
   *
   * @memberof! controls.Base#
   * @access public
   * @abstract
   *
   * @param {string}               $value   The value to sanitize.
   * @param {WP_Customize_Setting} $setting Setting instance.
   * @param {WP_Customize_Control} $control Control instance.
   * @return {string|null} The sanitized value.
   */
  sanitize ( $value, $setting, $control ) {
    return $value;
  }

  /**
   * Template
   *
   * Returns the control's complete template, either a simple string or a more
   * complex and composed method. This method is publicly accessible and should
   * be overrided by controls that extend but are outside Customize Plus.
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access public
   * @abstract
   *
   * @return {string}
   */
  template () {
    let tpl = '';
    tpl += this._tplExtras();
    tpl += this._tpl();
    tpl += this._tplNotifications();

    return tpl;
  }

  /**
   * Template
   *
   *
   * Subclasses within Customize Plus must have their own '_tpl' template
   * overriding this method. This cannot be ovverided through public API, that
   * is why the method is underscore prefixed and mangled during minification.
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access package
   * @abstract
   */
  _tpl () {
    return ``;
  }

  /**
   * Control's specific header template
   *
   * Subclasses should call this method themselves in the appropriate template
   * position, according to their specific needs. By default (if not overriden)
   * this template partial prints the label and description as markdown if the
   * markdown js plugin is available. This cannot be called or ovverided through
   * public API, that is why the method is underscore prefixed and mangled
   * during minification.
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access package
   * @abstract
   *
   * @return {string}
   */
  _tplHeader () {
    return`
      <# if (data.label) { #>
        <div class="customize-control-title">
          <# if (marked) { #>{{{ marked(data.label) }}}<# } else { #>{{{ data.label }}}<# } #>
        </div>
      <# } if (data.description) { #>
        <div class="description customize-control-description">
          <# if (marked) { #>{{{ marked(data.description) }}}
          <# } else { #>{{{ data.description }}}<# } #>
        </div>
      <# } #>
    `;
  }

  /**
   * Control's specific notification template
   *
   * Subclasses within Customize Plus can have their own 'notification' template
   * overriding this method. This cannot be ovverided through public API, that
   * is why the method is underscore prefixed and mangled during minification.
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access package
   * @abstract
   *
   * @return {string}
   */
  _tplNotifications () {
    return '<div class="customize-control-notifications-container"></div>';
  }

  /**
   * Control's extras menu template
   *
   * Subclasses within Customize Plus can have their own 'extras' template
   * overriding this method. This cannot be ovverided through public API, that
   * is why the method is underscore prefixed and mangled during minification.
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access package
   * @abstract
   *
   * @return {string}
   */
  _tplExtras () {
    return `
      <div class="kkcp-extras">
        <i class="kkcp-extras-btn kkcpui-control-btn dashicons dashicons-admin-generic"></i>
        <ul class="kkcp-extras-list">
          <li class="kkcp-extras-reset_last">${api.l10n['resetLastSaved']}</li>
          <li class="kkcp-extras-reset_initial">${api.l10n['resetInitial']}</li>
          <li class="kkcp-extras-reset_factory">${api.l10n['resetFactory']}</li>
        </ul>
      </div>
    `;
  }

  /**
   * Render the control from its JS template, uses custom template utility.
   *
   * @since 1.0.0
   *
   * @memberof! controls.Base#
   * @access protected
   * @override
   */
  renderContent () {
    const {_container, templateSelector} = this;

    // replaces the container element's content with the control.
    const template = Utils.template(this.template());
    if (template && _container) {

      /* jshint funcscope: true */
      if (DEBUG.performances) var t = performance.now();

      // render and store it in the params
      this.params.content = _container.innerHTML = template(this.params);

      if (DEBUG.performances) console.log('%c renderContent of ' + this.params.type + '(' +
        this.id + ') took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7');
    }

    this._rerenderNotifications();
  }

  /**
   * Destroy
   *
   * Unmounts the component and remove also the `<li>` container.
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @alias controls.Base._unmount
   * @access public
   */
  destroy () {
    this._unmount(true);
    this._container.parentNode.removeChild(this._container);
  }

  /**
   * Should component update (React like)
   *
   * @see https://reactjs.org/docs/react-component.html#shouldcomponentupdate
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access protected
   * @abstract
   * @param {mixed} $value The new setting value
   * @return {boolean}
   */
  shouldComponentUpdate ($value) {
    return true;
  }

  /**
   * Component did update (React like)
   *
   * This is usually called by a programmatic change like a reset of the control
   * default setting value.
   *
   * @see https://reactjs.org/docs/react-component.html#componentdidupdate
   * @since 1.0.0
   *
   * @memberof! controls.Base#
   * @access protected
   * @abstract
   * @param {mixed} $value The new setting value
   */
  componentDidUpdate ($value) {}

  /**
   * Component did mount (React like)
   *
   * @see  https://reactjs.org/docs/react-component.html#componentdidunmount
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access protected
   * @abstract
   */
  componentDidMount () {}

  /**
   * Component will unmount (React like)
   *
   * @see  https://reactjs.org/docs/react-component.html#componentwillunmount
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access protected
   * @abstract
   */
  componentWillUnmount () {}

  /**
   * Unmount (React current substitute)
   *
   * Removes the DOM of the control. In case the DOM store is empty (the first
   * time this method get called) it fills it. This could removed once React is
   * implemented
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access package
   *
   * @param {boolean} force
   */
  _unmount (force) {
    /* jshint funcscope: true */
    // if (DEBUG) var t = performance.now();

    const container = this._container;

    if (!this.params.content) {
      this.params.content = container.innerHTML.trim();
    }

    // call the abstract method
    if (this.rendered) {
      this.componentWillUnmount();
    }

    // and empty the DOM from the container deferred
    // the slide out animation of the section doesn't freeze
    _.defer(() => {
      // due to the timeout we need to be sure that the section is not expanded
      if (force || !wpApi.section(this.section.get()).expanded.get()) {

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

        if (DEBUG.performances) console.log('%c unmount of ' + this.params.type + '(' + this.id +
          ') took ' + (performance.now() - t) + ' ms.', 'background: #D2FFF1');

        // flag control that it's not rendered
        this.rendered = false;
      }
    });
  }

  /**
   * Mount (React current substitute)
   *
   * The first time renders from the js template, afterward retrieve the DOM
   * string from the `template` param store. After the template has been
   * rendered call the `componentDidMount` method, overridden in each control
   * with their own specific DOM initialization. Also put a flag `rendered` on
   * the control instance to indicate whether the control is rendered or not.
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access package
   *
   * @param  {boolean} resolveEmbeddedDeferred Sometimes (i.e. for the
   *                                           `control.focus()` method) we need
   *                                           to resolve the deffered embed.
   */
  _mount (resolveEmbeddedDeferred) {
    /* jshint funcscope: true */
    if (DEBUG.performances) var t = performance.now();
    if (!this.params.content) {
      this.renderContent();

      if (DEBUG.performances) console.log('%c mount DOM of ' + this.params.type +
        ' took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7');
    } else {
      if (!this.rendered) {
        this._container.innerHTML = this.params.content;
        this._rerenderNotifications();

        if (DEBUG.performances) console.log('%c mount DOM of ' + this.params.type +
          ' took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7');
      }
    }
    this.rendered = true;
    this.componentDidMount();
    if (resolveEmbeddedDeferred) {
      this.deferred.embedded.resolve();
    }
    this._extras();

    // if (DEBUG.performances) console.log('%c mount of ' + this.params.type +
    //   ' took ' + (performance.now() - t) + ' ms.', 'background: #D2FFF1');
  }

  /**
   * Re-render notifications after content has been re-rendered.
   *
   * This is taken as it is from the core base control class
   * (`wp.customize.Control`)in the end of the `renderContent` method.
   * We extract it in a method to reuse on component DOM recreation.
   *
   * @since 1.0.0
   *
   * @memberof! controls.Base#
   * @access package
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
   * @since 1.0.0
   *
   * @memberof! controls.Base#
   * @access public
   * @abstract
   * @static
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
   * @since 1.0.0
   *
   * @memberof! controls.Base#
   * @access package
   */
  _extras () {
    // constants
    const CLASS_OPEN = 'kkcp-extras-open';
    const CLASS_RESET_LAST = 'kkcp-extras-reset_last';
    const CLASS_RESET_INITIAL = 'kkcp-extras-reset_initial';
    const CLASS_RESET_FACTORY = 'kkcp-extras-reset_factory';
    const CLASS_DISABLED = 'kkcp-disabled';
    // DOM
    const container = this._container;
    const area = container.getElementsByClassName('kkcp-extras')[0];
    const toggle = container.getElementsByClassName('kkcp-extras-btn')[0];
    const btnResetLast = container.getElementsByClassName(CLASS_RESET_LAST)[0];
    const btnResetInitial = container.getElementsByClassName(CLASS_RESET_INITIAL)[0];
    const btnResetFactory = container.getElementsByClassName(CLASS_RESET_FACTORY)[0];
    // setting, uses closure
    const setting = this.setting;
    // state
    let isOpen = false;

    // handlers
    const _closeExtras = function () {
      container.classList.remove(CLASS_OPEN);
    };
    // reset setting to the last saved value and closes the `extras` dropdown.
    const _resetLastValue = function () {
      setting.forceSet(setting['vLastSaved']);
      _closeExtras();
    };
    // reset setting to the value at the beginning of the session. and closes
    // the `extras` dropdown.
    const _resetInitialValue = function () {
      setting.forceSet(setting['vInitial']);
      _closeExtras();
    };
    // reset setting to the value at the factory state (as defined in the theme
    // defaults) and closes the `extras` dropdown.
    const _resetFactoryValue = function () {
      setting.forceSet(setting['vFactory']);
      _closeExtras();
    };
    // enable button responsible for: resetting to last saved value
    const _enableBtnLast = function () {
      btnResetLast.className = CLASS_RESET_LAST;
      btnResetLast.onclick = _resetLastValue;
    };
    // disable button responsible for: resetting to initial value
    const _disableBtnLast = function () {
      btnResetLast.className = `${CLASS_RESET_LAST} ${CLASS_DISABLED}`;
      btnResetLast.onclick = '';
    };
    // enable button responsible for: resetting to initial value
    const _enableBtnInitial = function () {
      btnResetInitial.className = CLASS_RESET_INITIAL;
      btnResetInitial.onclick = _resetInitialValue;
    };
    // disable button responsible for: resetting to initial value
    const _disableBtnInitial = function () {
      btnResetInitial.className = `${CLASS_RESET_INITIAL} ${CLASS_DISABLED}`;
      btnResetInitial.onclick = '';
    };
    // enable button responsible for: resetting to factory / theme-default value
    const _enableBtnFactory = function () {
      btnResetFactory.className = CLASS_RESET_FACTORY;
      btnResetFactory.onclick = _resetFactoryValue;
    };
    // disable button responsible for: resetting to factory / theme-default value
    const _disableBtnFactory = function () {
      btnResetFactory.className = `${CLASS_RESET_FACTORY} ${CLASS_DISABLED}`;
      btnResetFactory.onclick = '';
    };

    // update status (enable / disable) for each control in the `extras` menu.
    // when the extras dropdown is open determine which actions are enabled and
    // bind them. If the current value is the same as the one the action effect
    // would give disable the action.
    const _onExtrasOpen = () => {
      // if the control current value is not valid enable both reset buttons
      if (this._currentValueHasError) {
        _enableBtnInitial();
        _enableBtnFactory();
        return;
      }

      const currentValue = this.softenize(setting());

      if (_.isEqual(currentValue, this.softenize(setting['vLastSaved']))) {
        _disableBtnLast();
      } else {
        _enableBtnLast();
      }
      if (_.isEqual(currentValue, this.softenize(setting['vInitial']))) {
        _disableBtnInitial();
      } else {
        _enableBtnInitial();
      }
      if (_.isEqual(currentValue, this.softenize(setting['vFactory']))) {
        _disableBtnFactory();
      } else {
        _enableBtnFactory();
      }
    };

    if (toggle) {
      if (DEBUG) {
        toggle.title = 'Click to dump control object into console';
      }
      toggle.onclick = () => {
        isOpen = !isOpen;
        container.classList.toggle(CLASS_OPEN, isOpen);
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
        container.classList.add(CLASS_OPEN);
        _onExtrasOpen();
      };
      area.onmouseleave = () => {
        isOpen = false;
        // don't close immediately, wait a bit and see if the mouse is still out
        // of the area
        setTimeout(() => {
          if (!isOpen) {
            container.classList.remove(CLASS_OPEN);
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
      control.setting['vLastSaved'] = control.setting();
    }
  });
});

export default api.controls.Base = Base;
