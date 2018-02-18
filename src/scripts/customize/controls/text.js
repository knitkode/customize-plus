import { api, wpApi } from '../core/globals';
import ControlBaseInput from './base-input';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';

/**
 * Control Text class
 *
 * @class wp.customize.controlConstructor.kkcp_text
 * @constructor
 * @extends api.controls.BaseInput
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Classnds
 */
let Control = ControlBaseInput.extend({
  /**
   * @override
   */
  validate: function (value) {
    return Validate.text({}, value, this.setting, this);
  },
  /**
   * @override
   */
  sanitize: function (value) {
    return Sanitize.text(value, this.setting, this);
  },
});

export default wpApi.controlConstructor['kkcp_text'] = api.controls.Text = Control;
