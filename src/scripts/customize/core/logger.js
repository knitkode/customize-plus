/**
 * @fileOverview A simple logger utility.
 *
 * @module Logger
 * @memberof core
 */

/**
 * Log error
 *
 * @since 1.0.0
 * @memberof core.Logger
 *
 * @param  {string} context
 * @param  {string} msg
 * @return {void}
 */
export function logError (context, msg) {
  console.error(context, msg);
}

/**
 * @description  Exposed module <a href="module-Logger.html">Logger</a>
 * @access package
 */
export default {
  error: logError,
}
