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
 * @requires validate
 * @requires sanitize
 */
class Text extends BaseInput {
    
  static type = `text`;

  static _onWpConstructor = true;

  validate = validate;

  sanitize = sanitize;
}

export default Text;
