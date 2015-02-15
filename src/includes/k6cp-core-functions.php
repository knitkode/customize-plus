<?php

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
