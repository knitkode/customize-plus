<?php // @partial
/**
 * Base Input Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2018 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
abstract class KKcp_Customize_Control_Base_Input extends KKcp_Customize_Control_Base {

	/**
	 * {@inheritDoc}. Note that the `tooltip` input_attr is printed in a wrapping
	 * span instead of directly on the input field.
	 *
	 * @since 1.0.0
	 * @override
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?><# var attrs = data.attrs || {}; #>
			<span class="kkcpui-tooltip--top" title="{{ attrs.tooltip }}">
				<input type="{{ attrs.type || data.type.replace('kkcp_','') }}" value="<?php // filled through js ?>"
					<# for (var key in attrs) { if (attrs.hasOwnProperty(key) && key !== 'title') { #>{{ key }}="{{ attrs[key] }}" <# } } #>
				>
			</span>
		</label>
		<?php
	}
}