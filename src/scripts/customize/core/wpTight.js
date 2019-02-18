import $ from 'jquery';
import { $readyDOM } from './globals';
import Utils from './utils';

/**
 * WordPress Tight
 *
 * We can put some logic in private functions to grab the
 * right things in case WordPress change stuff across versions
 *
 * @since 1.0.0
 * @access private
 *
 * @requires utils
 */
class WpTight {

  constructor () {

    /**
     * WordPress UI elements
     *
     * @type {Object.<string, JQuery|HTMLElement>}
     */
    this.el = {};

    /**
     * WordPress query parameters used in the customize app url
     *
     * @private
     * @internal
     * @type {Array}
     */
    this._customizeQueryParamsKeys = [
      'changeset_uuid', // e.g. e6ba8e82-e628-4d6e-b7b4-39a480bc043c
      'customize_snapshot_uuid' // e.g. 52729bb7-9686-496e-90fa-7170405a5502
    ];

    /**
     * The suffix appended to the styles ids by WordPress when enqueuing them
     * through `wp_enqueue_style`
     *
     * @type {string}
     */
    this.cssSuffix = '-css';

    /**
     * The id of the WordPress core css with the color schema
     *
     * @private
     * @internal
     * @type {string}
     */
    this._colorSchemaCssId = 'colors-css';

    /**
     * The WordPress color schema useful selectors
     *
     * @private
     * @internal
     * @type {Object}
     */
    this._colorSchemaSelectors = {
      _primary: '.wp-core-ui .wp-ui-primary',
      _textPrimary: '.wp-core-ui .wp-ui-text-primary',
      _linksPrimary: '#adminmenu .wp-submenu .wp-submenu-head',
      _highlight: '.wp-core-ui .wp-ui-highlight',
      _textHighlight: '.wp-core-ui .wp-ui-text-highlight',
      _linksHighlight: '#adminmenu a',
      _notificationColor: '.wp-core-ui .wp-ui-text-notification'
    };

    /**
     * WordPress Admin colors
     *
     * @private
     * @internal
     * @type {Object}
     */
    this._colorSchema = this._getWpAdminColors();

    // bootstraps on DOM ready
    $readyDOM.then(this._$onReady.bind(this));
  }

  /**
   * On DOM ready
   *
   * @return {void}
   */
  _$onReady () {
    let el = this.el;

    el.container = $('.wp-full-overlay');
    el.controls = $('#customize-controls');
    el.themeControls = $('#customize-theme-controls');
    el.preview = $('#customize-preview');
    el.header = $('#customize-header-actions');
    el.footer = $('#customize-footer-actions');
    el.devices = el.footer.find('.devices');
    el.close = el.header.find('.customize-controls-close');
    el.sidebar = $('.wp-full-overlay-sidebar-content');
    el.info = $('#customize-info');
    el.customizeControls = $('#customize-theme-controls').find('ul').first();
  }

  /**
   * Get WordPress Admin colors
   *
   * @return {Object}
   */
  _getWpAdminColors () {
    const stylesheet = Utils._getStylesheetById(this._colorSchemaCssId);
    const schema = this._colorSchemaSelectors;
    let output = {};
    for (let key in schema) {
      if (schema.hasOwnProperty(key)) {
        let selector = schema[key];
        let rules = Utils._getRulesFromStylesheet(stylesheet, selector);
        output[key] = Utils._getCssRulesContent(rules, selector);
      }
    }
    return output;
  }
}

/**
 * @member {Object} wpTight
 * @memberof core
 * @description  Instance of {@linkcode WpTight}
 */
const wpTight = new WpTight();

export default wpTight
