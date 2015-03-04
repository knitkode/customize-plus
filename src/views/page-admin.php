<?php
$allowed_tabs = array();
foreach ( $this->subpages as $subpage_id => $subpage_args ) {
	array_push( $allowed_tabs, $subpage_id );
}
if ( isset( $_GET['tab'] ) && in_array( sanitize_key( $_GET['tab'] ), $allowed_tabs ) ) {
	$active_tab = sanitize_key( $_GET['tab'] );
} else {
	$active_tab = $this->default_tab;
}
?>
<div id="k6cp-admin-<?php esc_attr_e( $active_tab ); ?>" class="wrap">
	<h2 class="nav-tab-wrapper">
	<?php
	foreach ( $this->subpages as $subpage_id => $subpage_args ) {
		$active_class = ( $subpage_id === $active_tab ) ? ' nav-tab-active' : '';
		?>
		<a href="<?php echo esc_url( add_query_arg( array( 'page' => self::PARENT_HOOK, 'tab' => $subpage_id ), admin_url( self::MENU_PAGE ) ) ); ?>" class="nav-tab<?php esc_attr_e( $active_class ); ?>"><?php esc_html_e( $subpage_args['title'] ); ?></a>
		<?php
	}
	?>
	</h2>
	<?php
	foreach ( $this->subpages as $subpage_id => $subpage_args ) {
		if ( $subpage_id === $active_tab ) {
			if ( is_callable( $subpage_args['view'] ) ) {
				call_user_func( $subpage_args['view'] );
			}
		}
	}
	?>
</div>