<div id="k6-loader" class="wp-full-overlay-main k6-full-overlay">
  <div class="k6-u-midpoint-wrap">
    <div class="k6-u-midpoint">
      <img src="<?php echo includes_url( '/images/wlw/wp-watermark.png' ) ?>">
      <?php if ( isset ( $_GET['k6_import'] ) ): // input var okay ?>
        <h1 id="k6-title" class="k6-text"><?php _e( 'Import done', 'pkgTextdomain' ); ?></h1>
        <h3 id="k6-text" class="k6-text"><?php _e( 'All options have been succesfully imported and saved', 'pkgTextdomain' ); ?></h3>
      <?php else : ?>
        <h1 id="k6-title" class="k6-text"><?php _e( 'Customize Plus', 'pkgTextdomain' ); ?></h1>
        <h3 id="k6-text" class="k6-text"><?php _e( 'Welcome to the customize tool', 'pkgTextdomain' ); ?></h3>
      <?php endif; ?>
      <div class="k6-text">
        <span class="spinner"></span>
        <?php _e( 'Loading ...', 'pkgTextdomain' ); ?>
      </div>
    </div>
  </div>
</div>