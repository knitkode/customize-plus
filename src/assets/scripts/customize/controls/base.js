/* global Skeleton, Utils, Tooltips */
/* exported: ControlBase */

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
var ControlBase = wpApi.Control.extend({
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
    control.container = $('<li id="customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' ) +
      '" class="customize-control pwpcp-control customize-control-' + control.params.type
      + advancedClass + '"></li>'); // @@tobecareful check render() in PWPcp_Customize_Control_Base \\

    // save a reference of the raw DOM node, we're gonna use it more
    // than the jquety object `container` (which we can't change, because it's
    // used by methods which we don't override)
    control._container = control.container[0];

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
      var key;

      control.settings = {};
      for ( key in control.params.settings ) {
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

    /**
     * Bind setting change // @@todo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! \\
     *
     * propably it s better to extend setting class and add a memory store with a maximum queu (maybe 25)
     * and go back in the history there. we need also redo then...complicate.
     */
    var lastValue = control.setting;
    var changeId = 0;
    var changeMemory = [];
    control.setting.bind(function (value) {
      changeId++;
      changeMemory.push(value);
      control.params.lastValue = value;
    });
  },
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
        // render and store it in the params
        this.params.template = _container.innerHTML = template( this.params ).trim();
      }
    }
  },
  /**
   * We don't need this method
   *
   * @private
   */
  dropdownInit: null,
  /**
   * Super fast empty DOM element
   * see @link http://jsperf.com/jquery-html-vs-empty-vs-innerhtml/20
   *
   * faster then: this.wrap[0].innerHTML = '';
   */
  empty: function (element) {
    /* jshint funcscope: true */
    if (DEBUG) var t = performance.now();
    while (element.lastChild) {
      element.removeChild(element.lastChild);
    }
    // @@doubt, somethimes innerHTML seems to be faster, maybe when
    // there are many DOM elements to remove, investigate here \\
    // element.innerHTML = '';
    console.log('deflate (empty()) of ' + this.params.type + ' took ' + (performance.now() - t) + ' ms.');
  },
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
    var container = this._container;
    if (!this.params.template) {
      this.params.template = container.innerHTML.trim();
    }

    // call the abstract method
    this.onDeflate();

    // destroy guides to free up DOM
    this.destroyGuide(this);

    // and empty the DOM from the container in a timeout so
    // the slide out animation of the section doesn't freeze
    var self = this;
    setTimeout(function () { // @@todo it breaks with search? \\
      self.empty(container);
    self.rendered = false;
    }, 100);

    // flag control that it's not rendered
  },
  /**
   * Render or 'inflate' the template of the control
   * The first time render it from the js template,
   * afterward retrieve the DOM string from the DOM store.
   * After the template has been rendered call the `ready`
   * method, overridden in each control wit its own logic.
   *
   * @param  {boolean} shouldWeResolveEmbeddedDeferred Sometimes (i.e. for the `control.focus()` method)
   *                                                   we need to resolve the embed
   */
  inflate: function (shouldWeResolveEmbeddedDeferred) {
    /* jshint funcscope: true */
    if (DEBUG) var t = performance.now();
    if (!this.params.template) {
      this.renderContent();
      // flag control that it's rendered
      this.rendered = true;
      // pass true for isForTheFirstTimeReady argument, so that we bind the setting only once
      this.ready(true);
    } else {
      this._container.innerHTML = this.params.template;
      // flag control that it's rendered
      this.rendered = true;

      this.ready();
    }
    if (shouldWeResolveEmbeddedDeferred) {
      this.deferred.embedded.resolve();
    }
    this.initGuide();
    this.initHelp();
    this.extras();
    console.log('inflate of ' + this.params.type + ' took ' + (performance.now() - t) + ' ms.');
  },
  /**
   * Manage the initialization of control guides
   *
   * @use Tooltips
   * @return {void}
   */
  initGuide: function () {
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
  destroyGuide: function () {
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
  initHelp: function () {
    if (!Tooltips) {
      return;
    }
    var helpers = this._container.getElementsByClassName('pwpcp-help');
    if (helpers) {
      Tooltips.createHelpers(helpers);
    }
  },
  /**
   * Manage the `extras` dropdown menu
   * of the control.
   *
   */
  extras: function () {
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
    var defaultValue = this.settings['default'](); // @@todo-uglycode \\
    var factoryValue = this.params.original;
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
      setting.set(defaultValue);
      _closeExtras();
    };
    /**
     * Reset setting to the value at the factory state
     * (as defined in the theme defaults).
     * It closes the `extras` dropdown.
     *
     */
    var _resetFactoryValue = function () {
      setting.set(factoryValue);
      _closeExtras();
    };
    /**
     * Enable button responsible for: resetting to last value
     */
    var _enableBtnLast = function () {
      btnResetLast.className = CLASS_RESET_LAST;
      btnResetLast.onclick = _resetLastValue;
    };
    /**
     * Disable button responsible for: resetting to last value
     */
    var _disableBtnLast = function () {
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

      // we need this to fix situations like: `'1' === 1` returning false,
      // but we can't use a soft comparison here, we'll manage the other issues
      // in the specific controls (like in the 'toggle' one)
      var _maybeNormalizeValue = function (value) {
        return (value === 0 || value === 1) ? value.toString() : value;
      };

      var currentValue = _maybeNormalizeValue( setting.get() );

      if (currentValue === _maybeNormalizeValue( defaultValue )) {
        _disableBtnLast();
      } else {
        _enableBtnLast();
      }
      if (currentValue === _maybeNormalizeValue( factoryValue )) {
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
      toggle.onclick = function () {
        isOpen = !isOpen;
        container.classList.toggle('pwpcp-extras-open', isOpen);
        if (isOpen) {
          _onExtrasOpen();
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
        }, 300);
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
      var self = this;
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

// export to public API
api['controls']['Base'] = ControlBase;

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
  } catch (err) {}
});
