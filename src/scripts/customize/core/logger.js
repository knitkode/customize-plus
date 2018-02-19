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
 * Export logger object (methods are renamed)
 */
export default {
	error: logError,
}
