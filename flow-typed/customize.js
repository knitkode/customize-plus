/**
 * @file Lists of custom types used in Customize Plus JavaScript
 * 
 * @flow
 */

/**
 * Shim type for PHP `array`
 * @typedef {Array} array
 */
type array = Array<any>;

/**
 * Shim type for PHP `bool`
 * @typedef {boolean} bool
 */
//  type bool = boolean;

/**
 * Shim type for PHP (`int|float`)
 * @typedef {number} number
 */
// type number = number;

/**
 * Shim type for PHP `integer`
 * @typedef {number} int
 */
type int = number;

/**
 * Shim type for PHP `float`
 * @typedef {number} float
 */
type float = number;

/**
 * Shim type for PHP `null`
 * @typedef {?(undefined)} null
 */
// type null = ?undefined;

/**
 * Shim type for PHP `mixed`
 * @typedef {(number|string|Array<mixed>|Object<string|number, mixed>)} mixed
 */
// type mixed = number | string | Array<mixed> | Object<string|number>;

/**
 * A $validity notification representation
 * @typedef {Object<string, string>} ValidityNotification
 * @property {string} code
 * @property {string} type
 * @property {string} msg
 */
type ValidityNotification = {
  code: string,
  type: string,
  msg: string
};

/**
 * Shim type for WordPress `WP_Error`
 * @typedef {Array<ValidityNotification>} WP_Error
 */
type WP_Error = Array<ValidityNotification>;

/**
 * Shim type for WordPress `WP_Customize_Setting`
 * @typedef {settings.Base} WP_Customize_Setting
 * TODO: flow type from class
 */
type WP_Customize_Setting = {};

/**
 * Shim type for WordPress `WP_Customize_Control`
 * @typedef {controls.Base} WP_Customize_Control
 * TODO: flow type from class, this object is temporary
 */
type WP_Customize_Control = {
  params: Object,
  _validChoices: Array<string>,
  _addError: Function,
  _addWarning: Function,
  softenize: Function,
};
