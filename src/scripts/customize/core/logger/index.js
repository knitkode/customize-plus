/**
 * @fileOverview A simple logger utility.
 *
 * @module logger
 * @memberof core
 */

/**
 * Log error
 *
 * @since 1.0.0
 * @memberof core.logger
 *
 * @param  {string} context
 * @param  {string} msg
 * @return {void}
 */
export function logError (context, msg) {
  console.error(context, msg);
}

export default {
  error: logError,
}
