import { api, wpApi } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import ControlBaseInput from './base-input';

/**
 * Control Text class
 *
 * @class api.controls.Text
 * @alias wp.customize.controlConstructor.kkcp_text
 * @extends api.controls.BaseInput
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Classnds
 */
class ControlText extends ControlBaseInput {

  /**
   * @override
   */
  validate (value) {
    return Validate.text({}, value, this.setting, this);
  }

  /**
   * @override
   */
  sanitize (value) {
    return Sanitize.text(value, this.setting, this);
  }
}

export default wpApi.controlConstructor['kkcp_text'] = api.controls.Text = ControlText;
