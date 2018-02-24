<div id="kkcp-loader-preview" class="wp-full-overlay-main kkcp-overlay--preview">
	<div class="kkcpui-midpoint-wrap">
		<div class="kkcpui-midpoint">
			<img id="kkcp-loader-img" src="<?php echo esc_url( plugins_url( 'assets/images/logo-white.png', KKCP_PLUGIN_FILE ) ); ?>">
			<?php if ( isset( $_GET['kkcp_import'] ) ): // input var okay ?>
				<h1 id="kkcp-loader-title" class="kkcp-text"><?php esc_html_e( 'Import done' ); ?></h1>
				<h3 id="kkcp-loader-text" class="kkcp-text"><?php esc_html_e( 'All options have been succesfully imported and saved' ); ?></h3>
			<?php else : ?>
				<h1 id="kkcp-loader-title" class="kkcp-text">Customize Plus</h1>
				<h3 id="kkcp-loader-text" class="kkcp-text"></h3>
			<?php endif; ?>
			<div class="kkcp-text">
				<span class="spinner"></span>
				<?php esc_html_e( 'Loading preview...' ); ?>
			</div>
		</div>
	</div>
</div>
<div id="kkcp-loader-sidebar" class="kkcp-overlay--sidebar" style="display:none">
	<div class="kkcpui-midpoint-wrap">
		<div class="kkcpui-midpoint">
			<div class="kkcp-text">
				<span class="spinner"></span>
				<?php esc_html_e( 'Loading ...' ); ?>
			</div>
		</div>
	</div>
</div>