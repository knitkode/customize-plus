<div class="error">
  <p><?php esc_html_e( K6CP_NAME ); ?> error: Your environment doesn't meet all of the system requirements listed below.</p>
  <ul class="ul-disc">
    <li>
      <strong>PHP <?php esc_html_e( K6CP_REQUIRED_PHP_VERSION ); ?>+</strong>
      <em>(You're running version <?php esc_html_e( PHP_VERSION ); ?>)</em>
    </li>
    <li>
      <strong>WordPress <?php esc_html_e( K6CP_REQUIRED_WP_VERSION ); ?>+</strong>
      <em>(You're running version <?php esc_html_e( $wp_version ); ?>)</em>
    </li>
  </ul>
  <p>If you need to upgrade your version of PHP you can ask your hosting company for assistance, and if you need help upgrading WordPress you can refer to <a href="http://codex.wordpress.org/Upgrading_WordPress">the Codex</a>.</p>
</div>