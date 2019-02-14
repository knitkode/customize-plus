import api from 'kkcp';
import { NAMESPACE } from './config'
import { addComponentsOnWordPressAPI } from './core/utils/wp'
import * as core from './core'
import * as controls from './controls'
import * as settings from './settings'

/**
 * Customize Plus public API
 *
 * Accessible on `window.kkcp` during production and on `window.api`
 * during development. Allow everything to be overriden on the public API
 *
 * @since  1.0.0
 * @access package
 * @private
 * @type {Object}
 */
api.core = api.core || core,
api.components = api.components || {},
api.settings = api.settings || settings,
api.controls = api.controls || controls,
api.sections = api.sections || {},
api.panels = api.panels || {},
/**
* @see PHP KKcp_Customize->get_l10n()
* @readonly
*/
api.l10n = api.l10n || {},
/**
* @see PHP KKcp_Customize->get_constants()
* @readonly
*/
api.constants = api.constants || {},

// Add components constructors on `wp.customize` API
addComponentsOnWordPressAPI(NAMESPACE, controls, 'controlConstructor')
// addComponentsOnWordPressAPI(NAMESPACE, settings, 'settingConstructor')
