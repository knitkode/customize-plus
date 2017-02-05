<?php defined( 'ABSPATH' ) or die;

/**
 * Customize custom classes for panels, sections, control and settings.
 *
 * All custom classes are collected in this file by an automated gulp task.
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     PlusWP <dev@pluswp.com> (https://pluswp.com)
 * @copyright  2017 PlusWP
 * @license    GPL-2.0+
 * @version    Release: pkgVersion
 * @link       https://pluswp.com/customize-plus
 */

/**
 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
 */
global $wp_customize;

require ( PWPCP_PLUGIN_DIR . 'includes/controls/base.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/base-input.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/base-radio.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/buttonset.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/checkbox.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/color.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/content.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/font-family.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/icon.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/multicheck.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/number.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/radio.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/radio-image.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/select.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/font-weight.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/slider.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/sortable.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/tags.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/text.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/textarea.php' );
require ( PWPCP_PLUGIN_DIR . 'includes/controls/toggle.php' );