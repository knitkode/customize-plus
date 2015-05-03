<?php // @partial
/**
 * Customize Section base class, override WordPress one
 * with few variations
 *
 * @override
 * @since  0.0.1
 *
 * @package    Customize_Plus
 * @subpackage Customize\Sections
 * @author     PlusWP <dev@pluswp.com> (http://pluswp.com)
 * @copyright  2015 PlusWP (kunderi kuus)
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       http://pluswp.com/customize-plus
 */
class PWPcp_Customize_Section_Search extends PWPcp_Customize_Section_Base {

	/**
	 * Type of this section.
	 *
	 * @since 0.0.1
	 * @access public
	 * @var string
	 */
	public $type = 'pwpcp_search';
}
