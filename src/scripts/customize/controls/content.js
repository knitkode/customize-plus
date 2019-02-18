import Base from './base';

/**
 * Control Content class
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_content`
 *
 * @since  1.0.0
 *
 * @memberof controls
 */
class Content extends Base {
    
  /**
   * @override
   */
  static type = `content`;

  /**
   * @override
   */
  static _onWpConstructor = true;

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

export default Content;
