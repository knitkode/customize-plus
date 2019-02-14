import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
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

  constructor (id, args) {
    super(id, args);

    this.validate = Validate.text;
    this.sanitize = Sanitize.text;
  }
}

export default Text;
