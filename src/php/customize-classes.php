<?php defined( 'ABSPATH' ) or die;

/**
 * Customize custom classes for panels, sections, control and settings.
 *
 * All custom classes are collected in this file by an automated task that
 * inlines the `require` php statements.
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2018 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */

/**
 * @global $wp_customize {WP_Customize_Manager} WordPress Customizer instance
 */
global $wp_customize;

require ( KKCP_PLUGIN_DIR . 'php/settings/base.php' );
require ( KKCP_PLUGIN_DIR . 'php/settings/font-family.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/base.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/base-choices.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/base-radio.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/base-set.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/buttonset.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/checkbox.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/color.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/content.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/font-family.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/icon.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/multicheck.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/number.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/radio.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/radio-image.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/select.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/font-weight.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/slider.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/sortable.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/tags.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/text.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/password.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/textarea.php' );
require ( KKCP_PLUGIN_DIR . 'php/controls/toggle.php' );