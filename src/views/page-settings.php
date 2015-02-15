<div class="wrap">
  <h2 class="nav-tab-wrapper"><?php self::get_tabs_view( __( 'Settings', 'pkgTextDomain' ) ); ?></h2>
  <h1>ciao settings</h1>
  <form action="" method="post" id="k6cp-admin-page">
    <p class="submit clear">
      <input class="button-primary" type="submit" name="k6cp-admin-pages-submit" id="k6cp-admin-pages-submit" value="<?php esc_attr_e( 'Save Settings', 'buddypress' ) ?>"/>
    </p>
    <?php wp_nonce_field( 'k6cp-settings' ); ?>
  </form>
</div>