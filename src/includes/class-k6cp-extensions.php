<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'K6CP_Extensions' ) ):

	/**
	 * Short description for class
	 *
	 * Long description (if any) ...
	 *
	 * @category  CategoryName
	 * @package   K6
	 * @author    Author's name <author@mail.com>
	 * @copyright 2015 Author's name
	 * @license   http://www.opensource.org/licenses/bsd-license.php The BSD License
	 * @version   Release: @package_version@
	 * @link      http://pear.php.net/package/K6
	 * @see       References to other sections (if any)...
	 */
	class K6CP_Extensions {

		/**
		 * Hide Plugins Constructor.
		 * @access public
		 */
		public function __construct() {

			// Hooks
			// add_filter( 'all_plugins', array( $this, 'filter_extensions' ) );
		}

		public function get_active_extensions() {
			return (array) array('asd');
		}

		/**
		 * Allow a class to be registered as extension
		 * @return [type] [description]
		 */
		public function register() {

		}

		/**
		 * Prepare plugins.
		 */
		public function filter_extensions( $plugins ) {

			$hidden = (array) array_unique( get_option( 'hide_plugins', array( $this->filename ) ) );
			foreach ( $hidden as $filename ) {
				if ( array_key_exists( $filename, $plugins ) ) {
					unset( $plugins[ $filename ] );
				}
			}
			return $plugins;
		}
	}
endif;

new K6CP_Extensions();
