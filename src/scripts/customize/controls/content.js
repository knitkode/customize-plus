import { api, wpApi } from '../core/globals';

/**
 * Control Content class
 *
 * @class api.controls.Content
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
let Control = api.controls.Base.extend({
  /**
   * Some methods are not needed here
   *
   * @override
   */
  _validateWrap: function () {},
  _onValidateError: function () {},
  _onValidateSuccess: function () {},
  validate: function () {},
  sanitize: function () {},
  syncUI: function () {},
  softenize: function () {},
  _extras: function () {}
});

export default wpApi.controlConstructor['kkcp_content'] = api.controls.Content = Control;
