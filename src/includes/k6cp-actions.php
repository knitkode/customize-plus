<?php

/**
 * BuddyPress Admin Actions
 *
 * This file contains the actions that are used through-out BuddyPress Admin. They
 * are consolidated here to make searching for them easier, and to help developers
 * understand at a glance the order in which things occur.
 *
 * There are a few common places that additional actions can currently be found
 *
 *  - BuddyPress: In {@link BuddyPress::setup_actions()} in BuddyPress.php
 *  - Admin: More in {@link bp_Admin::setup_actions()} in admin.php
 *
 * @package BuddyPress
 * @subpackage Admin
 * @see bp-core-actions.php
 * @see bp-core-filters.php
 */

// Exit if accessed directly
defined( 'ABSPATH' ) || exit;

/**
 * Attach BuddyPress to WordPress
 *
 * BuddyPress uses its own internal actions to help aid in third-party plugin
 * development, and to limit the amount of potential future code changes when
 * updates to WordPress core occur.
 *
 * These actions exist to create the concept of 'plugin dependencies'. They
 * provide a safe way for plugins to execute code *only* when BuddyPress is
 * installed and activated, without needing to do complicated guesswork.
 *
 * For more information on how this works, see the 'Plugin Dependency' section
 * near the bottom of this file.
 *
 *           v--WordPress Actions       v--BuddyPress Sub-actions
 */
add_action( 'admin_menu', 'k6cp_admin_menu' );
add_action( 'admin_init', 'k6cp_admin_init' );
add_action( 'admin_head', 'k6cp_admin_head' );
// add_action( 'admin_notices', 'k6cp_admin_notices' );
add_action( 'admin_enqueue_scripts', 'k6cp_admin_enqueue_scripts' );
// add_action( 'network_admin_menu', 'k6cp_admin_menu' );
// add_action( 'wpmu_new_blog', 'bp_new_site', 10, 6 );

// // Hook on to admin_init
// add_action( 'k6cp_admin_init', 'bp_setup_updater', 1000 );
// add_action( 'k6cp_admin_init', 'bp_core_activation_notice', 1010 );
// add_action( 'k6cp_admin_init', 'kcp_register_importers'           );
add_action( 'k6cp_admin_init', 'k6cp_register_admin_style' );
add_action( 'k6cp_admin_init', 'k6cp_do_activation_redirect', 1 );


/** Sub-Actions ***************************************************************/

/**
 * Piggy back admin_init action
 *
 * @since BuddyPress (1.7)
 * @uses do_action() Calls 'k6cp_admin_init'
 */
function k6cp_admin_init() {
	do_action( 'k6cp/admin/init' );
}

/**
 * Piggy back admin_menu action
 *
 * @since BuddyPress (1.7)
 * @uses do_action() Calls 'k6cp_admin_menu'
 */
function k6cp_admin_menu() {
	do_action( 'k6cp/admin/menu' );
}

/**
 * Piggy back admin_head action
 *
 * @since BuddyPress (1.7)
 * @uses do_action() Calls 'k6cp_admin_head'
 */
function k6cp_admin_head() {
	do_action( 'k6cp/admin/head' );
}

/**
 * Piggy back admin_notices action
 *
 * @since BuddyPress (1.7)
 * @uses do_action() Calls 'k6cp_admin_notices'
 */
function k6cp_admin_notices() {
	do_action( 'k6cp/admin/notices' );
}

/**
 * Piggy back admin_enqueue_scripts action.
 *
 * @since BuddyPress (1.7.0)
 *
 * @uses do_action() Calls 'k6cp/admin/enqueue_scripts''.
 *
 * @param string $hook_suffix The current admin page, passed to
 *        'admin_enqueue_scripts'.
 */
function k6cp_admin_enqueue_scripts( $hook_suffix = '' ) {
	do_action( 'k6cp/admin/enqueue_scripts', $hook_suffix );
}

/**
 * Dedicated action to register BuddyPress importers
 *
 * @since BuddyPress (1.7)
 * @uses do_action() Calls 'k6cp_admin_notices'
 */
// function kcp_register_importers() {
// 	do_action( 'kcp_register_importers' );
// }

/**
 * Dedicated action to register admin styles
 *
 * @since BuddyPress (1.7)
 * @uses do_action() Calls 'k6cp_admin_notices'
 */
function k6cp_register_admin_style() {
	do_action( 'k6cp_register_admin_style' );
}
