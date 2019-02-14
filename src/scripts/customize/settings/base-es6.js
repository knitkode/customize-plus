import $ from 'jquery';
import _ from 'underscore';
import { wpApi } from '../core/globals';

/**
 * Setting Base class
 *
 * Accessible globally on `wp.customize.settingConstructor.kkcp_base`
 *
 * @see PHP class KKcp_Customize_Setting_Base
 * @since  1.0.0
 *
 * @memberof settings
 * @class Base
 *
 * @extends wp.customize.Setting
 * @augments wp.customize.Value
 * @augments wp.customize.Class
 */

// This class and the Object assignments below are needed to make Babel play
// nicely with the class implementation of `wp.customize` API
class WpSetting {}
// First we assign the `wp.customize.Value` as static methods on WpSetting,
// otherwise it would not be possible to extend controls from outside of this
// codebase.
Object.assign(WpSetting, wpApi.Class, wpApi.Value, wpApi.Setting)
// Then we assign the prototypes of both the `wp.customize.Value` and of
// `wp.customize.Control` on the prototype of our dummy WpSetting class
Object.assign(WpSetting.prototype,
  wpApi.Class.prototype,
  wpApi.Value.prototype,
  wpApi.Setting.prototype
)
// With `buble` transpilation instead of Babel we could skip all this and just
// extends `wp.customize.Setting` directly as such:

class Base extends WpSetting {
  
  constructor(id, value, options) {
    super(id, value, options)
    wpApi.Setting.prototype.initialize.call(this, id, value, options);
  }

  /**
   * The type of component without any prefix, just the nice name in snake_case
   *
   * @since 1.2.0
   *
   * @static
   * @memberof settings.Base
   */
  static type = `base`;

  /**
   * Flag to signal that a component will be exported on the WordPress customize
   * constructor. All end users components should set this to `true`, leaving
   * base components with `false` as they are hidden and not "final" controls / 
   * settings / panels etc.
   *
   * @since 1.2.0
   *
   * @static
   * @memberof settings.Base
   */
  static onWpConstructor = true;

  /**
   * {@inheritdoc}. Add the initial and lastSave values for reset value actions.
   * The `factory` value is added in the PHP Setting class constructor.
   *
   * @memberof settings.Base
   *
   * @since 1.0.0
   * @override
   */
  initialize( id, value, options ) {
    // super(id, value, options)
    wpApi.Setting.prototype.initialize.call(this, id, value, options);

    // we need to grab this manually because the json data of a setting class is
    // not passed over in its entirety to the JavaScript constructor, only
    // `transport`, `previewer` and `dirty` are given as argument when WordPress
    // create Settings in `customize-controls.js`#7836
    const data = wpApi.settings.settings[id];
    if (data) {
      this.vFactory = data['default'];
    }
    this.vInitial = this();
    this.vLastSaved = this.vInitial;
  }

  /**
   * {@inheritcoc}. Sanitize value before sending it to the preview via
   * `postMessage`.
   *
   * @memberof settings.Base
   *
   * @since 1.0.0
   * @override
   */
  preview () {
    var setting = this, transport;
    transport = setting.transport;

    if ( 'postMessage' === transport && ! wpApi.state( 'previewerAlive' ).get() ) {
      transport = 'refresh';
    }

    if ( 'postMessage' === transport ) {
      // we just add here a sanitization method
      setting.previewer.send( 'setting', [ setting.id, this.sanitize(setting()) ] );
    } else if ( 'refresh' === transport ) {
      setting.previewer.refresh();
    }
  }

  /**
   * Sanitize setting
   *
   * This is here to allow controls to define a sanitization method before then
   * the setting value is sent to the preview via `postMessage`
   * 
   * @memberof settings.Base
   * @abstract
   *
   * @param  {mixed} value
   * @return {mixed}
   */
  sanitize (value) {
    return value;
  }

  /**
   * Force `set`.
   *
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
   * The callback that should be called on reset (the `componentDidUpdate` method)
   * in this scenario doesn't get called because in the WordPress
   * `customize-base.js#187` there is a check that return the function if the
   * setting has been set with the same value as the last one, preventing so
   * to fire the callbacks binded to the setting and, with these, also our
   * `componentDidUpdatefromAPI` that would update the UI, that is our input field with
   * the resetted value. To overcome this problem we can force the setting to
   * set anyway by temporarily set the private property `_value` to a dummy
   * value and then re-setting the setting to the desired value, in this way
   * the callbacks are fired and the UI get back in sync.
   * 
   * @memberof settings.Base
   *
   * @param  {WP_Customize_Setting} setting
   * @param  {string} value
   */
  forceSet (value, dummyValue) {
    this['_value'] = dummyValue || 'dummy'; // whitelisted from uglify \\
    this.set(value);
  }
}

export default Base;
