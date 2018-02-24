import { api, wpApi } from '../core/globals';
import Base from './base';

/**
 * Control Content class
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_content`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Content
 *
 * @extends controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class Content extends Base {
  /**
   * Some methods are not needed here
   *
   * @override
   */
  // _validate: $.noop,
  // _manageValidityNotifications: $.noop,
  // validate: $.noop,
  // sanitize: $.noop,
  // syncUI: $.noop,
  // softenize: $.noop,
  // _extras: $.noop,

  /**
   * @override
   */
  template () {
    return `
      <# if (data.alert) { #><div class="kkcpui-alert {{ data.alert }}"><# } #>
        <# if (data.label) { #><span class="customize-control-title"><# if (marked) { #>{{{ marked(data.label) }}}<# } else { #>{{{ data.label }}}<# } #></span><# } #>
        <# if (data.description) { #><span<# if (!data.alert) { #> class="description customize-control-description"<# } #>><# if (marked) { #>{{{ marked(data.description) }}}<# } else { #>{{{ data.description }}}<# } #></span><# } #>
        <# if (marked && data.markdown) { #><div class="description kkcp-markdown">{{{ marked(data.markdown) }}}</div><# } #>
      <# if (data.alert) { #></div><# } #>
    `
  }
}

export default wpApi.controlConstructor['kkcp_content'] = api.controls.Content = Content;
