// import './types';
import wp from 'wp';
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
 * @access public
 * @name kkcp
 * @alias api
 * @ignore
 * @type {Object}
 */

/**
 * @member {Object} core
 * @?memberof api
 * @description  Core API
 */
api.core = api.core || core

/**
 * @member {Object} components
 * @?memberof api
 * @access package
 * @ignore
 * @description  Components collection (besides settings/controls/sections/panels)
 */
// api.components = api.components || {}

/**
 * @member {Object} settings
 * @?memberof api
 * @description  Public collection of  all `settings` classes
 */
api.settings = api.settings || settings

/**
 * @member {Object} controls
 * @?memberof api
 * @description  Public collection of  all `controls` classes
 */
api.controls = api.controls || controls

/**
 * @member {Object} sections
 * @?memberof api
 * @description  Public collection of  all `sections` classes
 */
api.sections = api.sections || {}

/**
 * @member {Object} panels
 * @?memberof api
 * @description  Public collection of  all `panels` classes
 */
api.panels = api.panels || {}

/**
 * @member {Object} l10n
 * @?memberof api
 * @see PHP KKcp_Customize->get_l10n()
 * @readonly
 */
api.l10n = api.l10n || {}

/**
 * @member {Object} constants
 * @?memberof api
 * @see PHP KKcp_Customize->get_constants()
 * @readonly
 */
api.constants = api.constants || {}

// Add components constructors on `wp.customize` API
addComponentsOnWordPressAPI(NAMESPACE, controls, 'controlConstructor')
// addComponentsOnWordPressAPI(NAMESPACE, settings, 'settingConstructor')
wp.customize.Notification = core.Notification
