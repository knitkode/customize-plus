import { api, wpApi } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import BaseInput from './base-input';

/**
 * Control Number
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_number`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Number
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

  constructor (id, args) {
    super(id, args);

    this.validate = Validate.number;
    this.sanitize = Sanitize.number;
  }

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

export default wpApi.controlConstructor['kkcp_number'] = api.controls.Number = Number;
