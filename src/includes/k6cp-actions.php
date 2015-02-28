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

add_action( 'admin_init', 'k6cp_do_activation_redirect', 1 );


/**
 * Redirect user to BuddyPress's What's New page on activation
 *
 * @since BuddyPress (1.7)
 *
 * @internal Used internally to redirect BuddyPress to the about page on activation
 *
 * @uses get_transient() To see if transient to redirect exists
 * @uses delete_transient() To delete the transient if it exists
 * @uses is_network_admin() To bail if being network activated
 * @uses wp_safe_redirect() To redirect
 * @uses add_query_arg() To help build the URL to redirect to
 * @uses admin_url() To get the admin URL to index.php
 */
function k6cp_do_activation_redirect() {

  // Bail if no activation redirect
  if ( ! get_transient( '_k6cp_activation_redirect' ) ) {
    return;
  }

  // Delete the redirect transient
  delete_transient( '_k6cp_activation_redirect' );

  // Bail if activating from network, or bulk
  if ( isset( $_GET['activate-multi'] ) ) {
    return;
  }

  $query_args = array( 'page' => 'k6cp-welcome' );
  if ( get_transient( '_k6cp_is_new_install' ) ) {
    $query_args['is_new_install'] = '1';
    delete_transient( '_k6cp_is_new_install' );
  }

  // Redirect to BuddyPress about page
  wp_safe_redirect( add_query_arg( $query_args, admin_url( 'index.php' ) ) );
}
