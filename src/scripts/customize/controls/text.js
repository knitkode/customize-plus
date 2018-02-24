import { api, wpApi } from '../core/globals';
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
 * @class Text
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

  constructor (id, args) {
    super(id, args);

    this.validate = Validate.text;
    this.sanitize = Sanitize.text;
  }
}

export default wpApi.controlConstructor['kkcp_text'] = api.controls.Text = Text;
