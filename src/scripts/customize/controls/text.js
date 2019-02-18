import { text as validate } from '../core/validate';
import { text as sanitize } from '../core/sanitize';
import BaseInput from './base-input';

/**
 * Control Text class
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_text`
 *
 * @since  1.0.0
 *
 * @memberof controls
 *
 * @requires validate
 * @requires sanitize
 */
class Text extends BaseInput {
    
  /**
   * @override
   */
  static type = `text`;

  /**
   * @override
   */
  static _onWpConstructor = true;

  /**
   * @override
   */
  validate = validate;

  /**
   * @override
   */
  sanitize = sanitize;
}

export default Text;
