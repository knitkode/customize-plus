/**
 * @fileOverview Lists of custom types used in Customize Plus JavaScript
 *
 */

/**
 * Shim type for PHP `array`
 * @typedef {Array} array
 */

/**
 * Shim type for PHP `bool`
 * @typedef {boolean} bool
 */

/**
 * Shim type for PHP (`int|float`)
 * @typedef {number} number
 */

/**
 * Shim type for PHP `integer`
 * @typedef {number} int
 */

/**
 * Shim type for PHP `float`
 * @typedef {number} float
 */

/**
 * Shim type for PHP `null`
 * @typedef {?} null
 */

/**
 * Shim type for PHP `mixed`
 * @typedef {(number|string|Array.<mixed>|Object.<string|number, mixed>)} mixed
 */

/**
 * A $validity notification representation
 * @typedef {Object.<string, string>} ValidityNotification
 * @property {string} code
 * @property {string} type
 * @property {string} msg
 */

/**
 * Shim type for WordPress `WP_Error`
 * @typedef {Array.<ValidityNotification>} WP_Error
 */

/**
 * Shim type for WordPress `WP_Customize_Setting`
 * @typedef {settings.Base} WP_Customize_Setting
 */

/**
 * Shim type for WordPress `WP_Customize_Control`
 * @typedef {controls.Base} WP_Customize_Control
 */
