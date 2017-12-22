<?php defined( 'ABSPATH' ) or die;

/**
 * Contains methods for customizing the theme customization screen.
 *
 * @package    Customize_Plus
 * @subpackage Core
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/customize-plus
 */
abstract class KKcp_Singleton {

	/**
	 * Get class instance
	 *
	 * @since 1.0.0
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
	 * Get called class
	 *
	 * PHP 5.2 version support
	 * {@link(http://stackoverflow.com/q/7902586/1938970, source)}
	 *
	 * @since 1.0.0
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
	 * @since  1.0.0
	 */
	final private function __clone() {}

	/**
	 * Constructor
	 *
	 * @since  1.0.0
	 * @abstract
	 */
	protected function __construct() {}
}
