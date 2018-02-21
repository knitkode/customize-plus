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
	 * Allowed input attributes
	 *
	 * Whitelist the input attrbutes that can be set on this type of control.
	 * Subclasses can override this with a custom array whose sanitize methods
	 * must be class methods of `KKcp_SanitizeJS` or global functions.
	 *
	 * For a list of valid HTML attributes
	 * @see  https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
	 *
	 * @abstract
	 * @since 1.0.0
	 * @var array
	 */
	protected $input_attrs_allowed = array();

	/**
	 * @since 1.0.0
	 * @override
	 */
	protected function add_to_json() {
		if ( ! empty( $this->input_attrs ) && ! empty( $this->input_attrs_allowed ) ) {
			$this->json['attrs'] = KKcp_SanitizeJS::options( $this->input_attrs, $this->input_attrs_allowed );
		}
	}

	/**
	 * {@inheritDoc}. Note that the `title` input_attr is printed in a wrapping
	 * span instead of directly on the input field.
	 *
	 * @since 1.0.0
	 * @override
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?><# var attrs = data.attrs || {}; #>
			<span class="kkcpui-tooltip--top" title="{{{ attrs.title }}}">
				<input type="{{ attrs.type || data.type.replace('kkcp_','') }}" value="<?php // filled through js ?>"
					<# for (var key in attrs) { if (attrs.hasOwnProperty(key) && key !== 'title') { #>{{ key }}="{{ attrs[key] }}" <# } } #>
				>
			</span>
		</label>
		<?php
	}
}