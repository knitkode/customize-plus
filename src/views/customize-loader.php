<div id="pwpcp-loader-preview" class="wp-full-overlay-main pwpcp-overlay--preview">
	<div class="pwpcpui-midpoint-wrap">
		<div class="pwpcpui-midpoint">
			<img src="<?php echo esc_url( plugins_url( 'assets/images/logo-white.png', PWPCP_PLUGIN_FILE ) ); ?>">
			<?php if ( isset ( $_GET['pwpcp_import'] ) ): // input var okay ?>
				<h1 id="pwpcp-title" class="pwpcp-text"><?php _e( 'Import done' ); ?></h1>
				<h3 id="pwpcp-text" class="pwpcp-text"><?php _e( 'All options have been succesfully imported and saved' ); ?></h3>
			<?php else : ?>
				<h1 id="pwpcp-title" class="pwpcp-text"><?php echo 'Customize Plus'; ?></h1>
				<h3 id="pwpcp-text" class="pwpcp-text"></h3>
			<?php endif; ?>
			<div class="pwpcp-text">
				<span class="spinner"></span>
				<?php _e( 'Loading preview...' ); ?>
			</div>
		</div>
	</div>
</div>
<div id="pwpcp-loader-sidebar" class="pwpcp-overlay--sidebar" style="display:none">
	<div class="pwpcpui-midpoint-wrap">
		<div class="pwpcpui-midpoint">
			<div class="pwpcp-text">
				<span class="spinner"></span>
				<?php _e( 'Loading ...' ); ?>
			</div>
		</div>
	</div>
</div>