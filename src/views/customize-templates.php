<script id="k6-export-tpl" type="text/template">
  <li id="k6-export" class="accordion-section control-section k6-tools-section">
    <h3 class="accordion-section-title">
      <i class="dashicons dashicons-download"></i> <?php _e( 'Export Settings', 'pkgTextdomain' ); ?>
    </h3>
    <ul class="accordion-section-content">
      <li class="customize-control k6-control">
        <p><?php _e( 'Export the theme settings for this site as a .json file. This allows you to easily import the configuration into another site.', 'pkgTextdomain' ); ?></p>
        <label>
          <span class="customize-control-title"><?php _e( 'Filename', 'pkgTextdomain' ); ?></span>
          <input id="k6-export-name" type="text" name="export_filename" value="<?php echo self::get_base_export_filename(); ?>">
        </label>
        <p class="description customize-section-description"><?php _e( 'You can change the filename of the exported settings (a timestamp will be appended)', 'pkgTextdomain' ); ?></p>
        <p>
          <?php submit_button( __( 'Export & Download', 'pkgTextdomain' ), 'primary', 'submit', false, array( 'id' => 'k6-export-btn' ) ); ?>
        </p>
        <p><textarea id="k6-export-textarea" class="k6-textarea" name="export_textarea" rows="5" onclick="this.focus();this.select()" readonly="readonly"></textarea></p>
        <p id="k6-export-copied"><?php _e( 'Copied', 'pkgTextdomain' ); ?></p>
      </li>
    </ul>
  </li>
</script>
<script id="k6-import-tpl" type="text/template">
  <li id="k6-import" class="accordion-section control-section k6-tools-section">
    <h3 class="accordion-section-title">
      <i class="dashicons dashicons-upload"></i> <?php _e( 'Import Settings', 'pkgTextdomain' ); ?>
    </h3>
    <ul class="accordion-section-content">
      <li class="customize-control k6-control">
        <p><?php _e( 'Import the theme settings from a .json file. This file can be obtained by exporting the settings on another site using the section above.', 'pkgTextdomain' ); ?></p>
        <form id="k6-import-form" action="<?php echo admin_url( 'admin-post.php' ); ?>" method="POST" enctype="multipart/form-data">
          <p><input id="k6-import-input" type="file" name="import"></p>
          <label for="k6-import-textarea"><?php _e( 'Or paste the settings here:', 'pkgTextdomain' ); ?><label>
          <p><textarea id="k6-import-textarea" class="k6-textarea" name="import_textarea" rows="5" placeholder="<?php _e( 'Paste here ...', 'pkgTextdomain' ); ?>" onclick="this.focus();this.select()"></textarea></p>
          <div class="k6-if-filereader">
            <button id="k6-import-preview" class="button button-primary "><?php _e( 'Unload preview', 'pkgTextdomain' ); ?></button>
            <span class="spinner"></span>
            <p id="k6-import-warning"><?php _e( 'To save just use the <b>Save & Publish</b> button above.', 'pkgTextdomain' ); ?> <strong><?php _e( 'Careful, it will overwrite all existing options values.', 'pkgTextdomain' ); ?></strong></p>
          </div>
          <div class="k6-if-no-filereader">
            <p><strong><?php _e( 'WARNING! This will overwrite all existing options values, please proceed with caution!', 'pkgTextdomain' ); ?></strong></p>
            <?php submit_button( __( 'Import', 'pkgTextdomain' ), 'primary', 'submit', false, array( 'id' => 'k6-import-save' ) ); ?>
            <span class="spinner k6-show-on-loading"></span>
            <?php wp_nonce_field( 'k6_import', 'k6_import_nonce' ); ?>
            <input type="hidden" name="action" value="k6_import">
          </div>
        </form>
      </li>
    </ul>
  </li>
</script>
<script id="k6-advanced-tpl" type="text/template">
  <li id="k6-advanced" class="customize-control k6-control k6-tools-section">
    <label>
      <span class="customize-control-title"><?php _e( 'Advanced mode', 'pkgTextdomain' ); ?></span>
      <input id="k6-advanced-input" type="checkbox" name="_customize-k6_advanced_controls" value="1" checked>
      <?php _e( 'When advanced mode is enabled you will have a more granular control on every setting of the theme', 'pkgTextdomain' ); ?>
    </label>
  </li>
</script>
<script id="k6-support-tpl" type="text/template">
  <?php $theme = wp_get_theme(); ?>
  <li id="k6-support" class="accordion-section control-section k6-tools-section">
    <h3 class="accordion-section-title">
      <i class="dashicons dashicons-sos"></i> <?php _e( 'Support', 'pkgTextdomain' ); ?>
    </h3>
    <ul class="accordion-section-content">
      <li class="customize-control k6-control">
        <h3><?php _e( 'About', 'pkgTextdomain' ); ?></h3>
        <p><?php _e( 'Theme', 'pkgTextdomain' ); ?>: <b><?php echo $theme->Name ?></b> | v<b><?php echo $theme->Version ?></b><br>
        <?php _e( 'Author', 'pkgTextdomain' ); ?>: <b><a href="<?php echo $theme->{'Author URI'}; ?>" title="View the author's website" target="_blank">k6</a></b><br>
        <?php _e( 'Released on', 'pkgTextdomain' ); ?>: <b>Mar 14, 2015</b></p> // k6todoTxt \\
        <h3><?php _e( 'Contact and Social', 'pkgTextdomain' ); ?></h3>
        <p><?php _e( 'Website', 'pkgTextdomain' ); ?>: <b><a href="<?php echo $theme->{'Author URI'}; ?>" target="_blank">kunderikuus.net</a></b><br>
          <?php _e( 'Mail', 'pkgTextdomain' ); ?>: <b><a href="mailto:k6@kunderikuus.net" title="Contact the author" target="_blank">info@kunderikuus.net</a></b></p>
      </li>
    </ul>
  </li>
</script>