/* global Skeleton, Utils, Tooltips */

/**
 * Control Base class
 *
 * Change a bit the default Customizer Control class.
 * Render controls content on demand when their section is expanded
 * then remove the DOM when the section is collapsed
 *
 * @see PHP class PWPcp_Customize_Control_Base.
 * @class
 * @augments wp.customize.Control
 */
// export to our API
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

    // add default params object
    control.params = {};

    _.extend(control, options || {});

    control.id = id;

    // add a flag so that we are able to recognize our
    // custom controls, let's keep it short, so we need
    // only to check `if (control.pwpcp)`
    control.pwpcp = 1;

    // control.selector = '#customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
    // control.templateSelector = 'customize-control-' + control.params.type + '-content';
    advancedClass = control.params.advanced ? ' pwpcp-control-advanced' : '';

    var container = document.createElement('li');
    container.id = 'customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
    container.className = 'customize-control pwpcp-control customize-control-'
      + control.params.type + advancedClass;

    control.container = $(container); // @@tobecareful check render() in PWPcp_Customize_Control_Base \\

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

    control.active.bind( function ( active ) {
      var args = control.activeArgumentsQueue.shift();
      args = $.extend( {}, control.defaultActiveArguments, args );
      control.onChangeActive( active, args );
    } );

    control.section.set( control.params.section );
    control.priority.set( isNaN( control.params.priority ) ? 10 : control.params.priority );
    control.active.set( control.params.active );

    wpApi.utils.bubbleChildValueChanges( control, [ 'section', 'priority', 'active' ] );

    // Associate this control with its settings when they are created
    settings = $.map( control.params.settings, function( value ) {
      return value;
    });

    wpApi.apply( wpApi, settings.concat( function () {
      control.settings = {};
      for ( var key in control.params.settings ) {
        control.settings[ key ] = wpApi( control.params.settings[ key ] );
      }

      control.setting = control.settings['default'] || null;

      // embed controls only when the parent section get clicked to keep the DOM light,
      // to make this work all data can't be stored in the DOM, which is good
      wpApi.section( control.section.get(), function ( section ) {
        section.expanded.bind(function (expanded) {
          if (expanded) {
            control.inflate();
          } else {
            control.deflate();
          }
        });
      });
    }) );

    // an @abstract method to override
    control.onInit();

    // Add custom validation function overriding the empty function from WP API.
    this.setting.validate = this._validateWrap.bind(this);

    // bind setting change to control method to reflect a programmatic
    // change on the UI, only if the control is rendered
    this.setting.bind(function (value) {
      if (this.rendered) {
        this.syncUIFromAPI.call(this, value);
      }
    }.bind(this));
  },
  /**
   * Validate wrap function.
   * Always check that required setting (not `optional`) are not empty,
   * if it pass the check call the control specific abstract `validate` method.
   *
   * // @@doubt not sure whether this should be private or not \\
   * @param  {string} newValue
   * @return {string} The newValue validated or the last setting value.
   */
  _validateWrap: function (newValue) {
    if ( !this.params.optional && Utils._isSettingValueEmpty(newValue)) {
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
   * @param  {object<string,boolean|string>} errorObject `{ error: true, msg: string }`
   */
  _onValidateError: function (errorObject) {
    var msg = errorObject.msg || api.l10n['vInvalid'];
    this._container.classList.add('pwpcp-error');
    this._container.setAttribute('data-pwpcp-msg', msg);
  },
  /**
   * On validation success (optionally override it in subclasses)
   * @abstract
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
  syncUIFromAPI: function (value) {},
  /**
   * Triggered when the control has been initialized
   *
   * @abstract
   */
  onInit: function() {},
  /**
   * Render the control from its JS template, if it exists.
   *
   */
  renderContent: function () {
    var template;
    var _container = this._container;
    var templateSelector = 'customize-control-' + this.params.type + '-content';

    // Replace the container element's content with the control.
    if ( document.getElementById( 'tmpl-' + templateSelector ) ) {
      template = wp.template( templateSelector );
      if ( template && _container ) {

        /* jshint funcscope: true */
        if (DEBUG) var t = performance.now();

        // render and store it in the params
        this.params.template = _container.innerHTML = template( this.params ).trim();

        // var frag = document.createDocumentFragment();
        // var tplNode = document.createElement('div');
        // tplNode.innerHTML = template( this.params ).trim();
        // frag.appendChild(tplNode);
        // this.params.template = frag;
        // _container.appendChild(frag);

        console.log('%c renderContent of ' + this.params.type + '(' + this.id +
         ') took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7');
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
    if (DEBUG) var t = performance.now();

    var container = this._container;

    if (!this.params.template) {
      this.params.template = container.innerHTML.trim();
    }

    // call the abstract method
    this.onDeflate();

    // destroy guides to free up DOM
    this._destroyGuide(this);

    // and empty the DOM from the container deferred
    // the slide out animation of the section doesn't freeze
    _.defer(function () { // @@todo it breaks with search? \\
      // due to the timeout we need to be sure that the section is not expanded
      if (!wpApi.section(this.section.get()).expanded.get()) {

        /* jshint funcscope: true */
        // if (DEBUG) var t = performance.now();

        // Super fast empty DOM element
        // @link(http://jsperf.com/jquery-html-vs-empty-vs-innerhtml/20)
        // while (container.lastChild) {
        //   container.removeChild(container.lastChild);
        // }

        // @@doubt, most of the times innerHTML seems to be faster, maybe when
        // there are many DOM elements to remove, investigate here \\
        container.innerHTML = '';

        console.log('%c deflate of ' + this.params.type + '(' + this.id + ') took '
         + (performance.now() - t) + ' ms.', 'background: #D2FFF1');

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
   * @param  {boolean} shouldWeResolveEmbeddedDeferred Sometimes (i.e. for the
   *                                                   `control.focus()` method)
   *                                                   we need to resolve embed
   */
  inflate: function (shouldWeResolveEmbeddedDeferred) {
    /* jshint funcscope: true */
    if (DEBUG) var t = performance.now();
    if (!this.params.template) {
      this.renderContent();
      // console.log('%c inflate DOM of ' + this.params.type + ' took ' +
      //   (performance.now() - t) + ' ms.', 'background: #EF9CD7');
      this.rendered = true;
      this.ready();
    } else {
      if (!this.rendered) {
        this._container.innerHTML = this.params.template;
        // console.log('%c inflate DOM of ' + this.params.type + ' took ' +
        //   (performance.now() - t) + ' ms.', 'background: #EF9CD7');
      }
      this.rendered = true;
      this.ready();
    }
    if (shouldWeResolveEmbeddedDeferred) {
      this.deferred.embedded.resolve();
    }
    this._guide();
    this._help();
    this._extras();
    // errors get resetted because on ready we fill the values in the UI with
    // the value of `this.setting()` which can never be not valid (see the
    // `_validateWrap` method above)
    this._onValidateSuccess();

    console.log('%c inflate of ' + this.params.type + ' took ' +
      (performance.now() - t) + ' ms.', 'background: #D2FFF1');
  },
  /**
   * Softenize
   *
   * Normalize setting for soft comparison.
   *
   * @abstract
   * @static
   * @private
   * @param  {?} value Could be the original, the current, or the initial
   *                   session value
   * @return {string} The 'normalized' value passed as an argument.
   */
  softenize: function (value) {
    return value;
  },
  /**
   * Guide
   *
   * Manage the initialization of control guides.
   *
   * @use Tooltips
   * @return {void}
   */
  _guide: function () {
    if (this.params.guide && Tooltips) {
      Tooltips.createGuide(this);
    }
  },
  /**
   * Destroy guides on control deflate
   *
   * @use Tooltips
   * @return {void}
   */
  _destroyGuide: function () {
    if (this.params.guide && Tooltips) {
      Tooltips.destroyGuide(this);
    }
  },
  /**
   * Manage the initialization of control helpers
   *
   * @use Tooltips
   * @return {void}
   */
  _help: function () {
    if (!Tooltips) {
      return;
    }
    var helpers = this._container.getElementsByClassName('pwpcp-help');
    if (helpers) {
      Tooltips.createHelpers(helpers);
    }
  },
  /**
   * Manage the extras dropdown menu of the control.
   *
   */
  _extras: function () {
    var self = this;
    /**
     * Reference to abstract method different in various control's subclasses
     * @type {function(*)}
     */
    var _maybeSoftenizeValue = this.softenize;
    // constants
    var CLASS_RESET_FACTORY = 'pwpcp-extras-reset';
    var CLASS_RESET_LAST = ' pwpcp-extras-reset_last';
    var CLASS_DISABLED = ' pwpcp-disabled';
    // DOM
    var container = this._container;
    var area = container.getElementsByClassName('pwpcp-extras')[0];
    var toggle = container.getElementsByClassName('pwpcp-extras-btn')[0];
    var btnResetLast = container.getElementsByClassName('pwpcp-extras-reset_last')[0];
    var btnResetFactory = container.getElementsByClassName('pwpcp-extras-reset')[0];
    var btnHide = container.getElementsByClassName('pwpcp-extras-hide')[0];
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
     * Reset setting to the value at the beginning of the session.
     * It closes the `extras` dropdown.
     *
     */
    var _resetLastValue = function () {
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
     * Enable button responsible for: resetting to initial value
     */
    var _enableBtnInitial = function () {
      btnResetLast.className = CLASS_RESET_LAST;
      btnResetLast.onclick = _resetLastValue;
    };
    /**
     * Disable button responsible for: resetting to initial value
     */
    var _disableBtnInitial = function () {
      btnResetLast.className = CLASS_RESET_LAST + CLASS_DISABLED;
      btnResetLast.onclick = '';
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
      Skeleton.hasScrollbar(); // on open check if we have a scrollbar

      // if the control current value is not valid enable both reset buttons
      if (self._currentValueHasError) {
        _enableBtnInitial();
        _enableBtnFactory();
        return;
      }

      var currentValue = _maybeSoftenizeValue( setting.get() );

      if (currentValue === _maybeSoftenizeValue( initialValue )) {
        _disableBtnInitial();
      } else {
        _enableBtnInitial();
      }
      if (currentValue === _maybeSoftenizeValue( factoryValue )) {
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
          // console.log('%c Control[' + self.id + '] ' + self, 'background: #78DFFF;');
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

    /**
     * Set on the hide_controls control a duplicate free
     * array with the current control id merged in.
     *
     * // @@todo, maybe don't use union here but use it in the `_validate`
     * method of the hide_controls control. \\
     */
    if (btnHide) {
      // var self = this;
      btnHide.onclick = function () {
        // @@tobecareful this is tight to class-customize.php $setting_control_id =
        // PWPcp::$OPTIONToHideS_PREFIX . '[' . $field_key . ']'; \\
        var controlToHide = wpApi.control('pwpcp[hide-controls]');
        if (controlToHide) {
          controlToHide.setting.set(_.union(controlToHide.setting(), [self.id]));
          var secondsTimeout = 5;
          container.innerHTML =
            '<a class="pwpcp-hide-undo">' +
              'Undo hide control <span class="pwpcp-timer">' + secondsTimeout + 's</span>' +
            '</a>';
          var btnHideUndo = container.getElementsByClassName('pwpcp-hide-undo')[0];
          var secondsEl = container.getElementsByClassName('pwpcp-timer')[0];
          var timerHideUndo = setInterval(function () {
            secondsTimeout--;
            secondsEl.innerHTML = secondsTimeout + 's'; // @@ie8-textContent would be enough \\
            if (secondsTimeout === 0) {
              btnHideUndo.parentNode.removeChild(btnHideUndo);
              clearInterval(timerHideUndo);
            }
          }, 1000);
          // Undo hide control handler
          btnHideUndo.onclick = function () {
            clearInterval(timerHideUndo);
            btnHideUndo.parentNode.removeChild(btnHideUndo);
            self.inflate();
            _closeExtras();
            controlToHide.setting.set(_.without(controlToHide.setting(), [self.id]));
          };
        }
      };
    }
  }
});

/**
 * Fix autofocus
 *
 * This is needed if autofocus is set to one
 * of our 'post-rendered' custom controls
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