<?php defined( 'ABSPATH' ) or die;

/**
 * Contains methods for customizing the theme customization screen.
 *
 * @package    Customize_Plus
 * @subpackage Core
 * @author     PlusWP <dev@pluswp.com> (http://pluswp.com)
 * @copyright  2015 PlusWP (kunderi kuus)
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       http://pluswp.com/customize-plus
 */

abstract class PWPcp_Singleton {

	/**
	 * Get class instance
	 *
	 * @since 0.0.1
	 */
	final public static function get_instance() {
		static $instances = array();
		// WordPress support php 5.2.4, let's try to support it as well
		if ( version_compare( PHP_VERSION, '5.3.0' ) >= 0 ) {
			$called_class_name = get_called_class();
		} else {
			$called_class_name = self::get_called_class();
		}
		if ( ! isset( $instances[ $called_class_name ] ) ) {
			$instances[ $called_class_name ] = new $called_class_name();
		}
		return $instances[ $called_class_name ];
	}

	/**
	 * PHP 5.2 version support
	 *
	 * @link( http://stackoverflow.com/q/7902586/1938970 )
	 * @since 0.0.1
	 */
	private static function get_called_class() {
		$bt = debug_backtrace();
		$lines = file( $bt[1]['file'] );
		preg_match(
			'/([a-zA-Z0-9\_]+)::'.$bt[1]['function'].'/',
			$lines[ $bt[1]['line'] -1 ],
			$matches
		);
		return $matches[1];
	}

	/**
	 * Clone
	 *
	 * @since  0.0.1
	 */
	final private function __clone() {}

	/**
	 * Constructor
	 *
	 * @since  0.0.1
	 * @abstract
	 */
	protected function __construct() {}
}
