<div class="wrap">
	<h2 class="nav-tab-wrapper"><?php self::get_tabs_view( __( 'Settings', 'pkgTextDomain' ) ); ?></h2>
	<p style="margin-top: 20px;" class="description"><?php _e( 'Generic settings.', 'pkgTextDomain' ); ?></p>
	<form action="" method="post" id="k6cp-admin-page">
		<?php settings_fields( 'k6cp_settings' ); ?>
		<?php do_settings_sections( 'k6cp_settings' ); ?>
		<p class="submit clear">
			<input class="button-primary" type="submit" name="k6cp-admin-pages-submit" id="k6cp-admin-pages-submit" value="<?php esc_attr_e( 'Save Settings', 'pkgTextDomain' ) ?>"/>
		</p>
		<?php wp_nonce_field( 'k6cp-settings' ); ?>
	</form>
</div>