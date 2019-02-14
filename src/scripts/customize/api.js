import { NAMESPACE } from './config'
import api from 'kkcp';
import wp from 'wp';

import * as core from './core'
import * as controls from './controls'
import * as settings from './settings'

/**
 * Accessible on `window.kkcp.core`
 *
 * @since  1.0.0
 * @namespace core
 * @type {Object}
 */
api.core = core;

/**
 * Accessible on `window.kkcp.components`
 *
 * @since  1.0.0
 * @namespace components
 * @type {Object}
 */
api.components = api.components || {};

/**
 * Accessible on `window.kkcp.settings`
 *
 * @since  1.0.0
 * @namespace settings
 * @type {Object}
 */
api.settings = api.settings || settings;

/**
 * Accessible on `window.kkcp.controls`
 *
 * @since  1.0.0
 * @namespace controls
 * @type {Object}
 */
api.controls = api.controls || controls;

/**
 * Accessible on `window.kkcp.sections`
 *
 * @since  1.0.0
 * @namespace sections
 * @type {Object}
 */
api.sections = api.sections || {};

/**
 * Accessible on `window.kkcp.panels`
 *
 * @since  1.0.0
 * @namespace panels
 * @type {Object}
 */
api.panels = api.panels || {};

/**
 * Accessible on `window.kkcp.l10n`, populated by PHP via JSON
 *
 * @see PHP KKcp_Customize->get_l10n()
 * @since  1.0.0
 * @namespace l10n
 * @readonly
 * @type {Object}
 */
api.l10n = api.l10n || {};

/**
 * Accessible on `window.kkcp.constants`, populated by PHP via JSON
 *
 * @see PHP KKcp_Customize->get_constants()
 * @since  1.0.0
 * @namespace constants
 * @readonly
 * @type {Object}
 */
api.constants = api.constants || {};

/**
 * Customize Plus public API
 *
 * Accessible on `window.kkcp` during production and on `window.api`
 * during development.
 *
 * @since  1.0.0
 * @access package
 * @private
 * @type {Object}
 */
export default api;

const addComponentsOnWordPressAPI = (components, constructorName) => {
  for (const name in components) {
    if (components.hasOwnProperty(name)) {
      const component = components[name];
      if (component.onWpConstructor) {
        const fullType = `${NAMESPACE}_${component.type}`
        wp.customize[constructorName][fullType] = component
      }
    }
  }
}

addComponentsOnWordPressAPI(controls, 'controlConstructor')
addComponentsOnWordPressAPI(settings, 'settingConstructor')
