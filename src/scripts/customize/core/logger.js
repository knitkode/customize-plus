/**
 * @fileOverview A simple logger utility.
 *
 * @module Logger
 */

/**
 * Log error
 *
 * @param  {string} context
 * @param  {string} msg
 * @return {void}
 */
export function logError (context, msg) {
  console.error(context, msg);
}

/**
 * @alias core.Logger
 * @description  Exposed module <a href="module-Logger.html">Logger</a>
 * @access package
 */
export default {
  error: logError,
}
