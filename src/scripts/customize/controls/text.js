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
 * @extends controls.BaseInput
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 */
class Text extends BaseInput {
    
  static type = `text`;

  static onWpConstructor = true;

  static validate = validate;

  static sanitize = sanitize;
}

export default Text;
