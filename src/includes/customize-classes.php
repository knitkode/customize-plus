<?php defined( 'ABSPATH' ) or die;

/**
 * Customize custom classes for panels, sections, control and settings.
 *
 * All custom classes are collected in this file by an automated gulp task.
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */

/**
 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
 */
global $wp_customize;

require ( KKCP_PLUGIN_DIR . 'includes/controls/base.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/base-input.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/base-radio.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/buttonset.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/checkbox.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/color.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/content.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/font-family.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/icon.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/multicheck.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/number.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/radio.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/radio-image.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/select.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/font-weight.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/slider.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/sortable.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/tags.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/text.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/textarea.php' );
require ( KKCP_PLUGIN_DIR . 'includes/controls/toggle.php' );