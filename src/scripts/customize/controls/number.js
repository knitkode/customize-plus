import { number as validate } from '../core/validate';
import { number as sanitize } from '../core/sanitize';
import BaseInput from './base-input';

/**
 * Control Number
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_number`
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
class Number extends BaseInput {
    
  static type = `number`;

  static onWpConstructor = true;

  validate = validate;
  
  sanitize = sanitize;

  /**
   * We just neet to convert the value to string for the check, for the rest
   * is the same as in the base input control
   *
   * @override
   */
  shouldComponentUpdate ($value) {
    return this.__input.value !== $value.toString();
  }
}

export default Number;
