<div id="pwpcp-loader" class="wp-full-overlay-main pwpcp-full-overlay">
	<div class="pwpcp-u-midpoint-wrap">
		<div class="pwpcp-u-midpoint">
			<img src="<?php echo esc_url( plugins_url( 'assets/images/logo-white.png', PWPcp_PLUGIN_FILE ) ); ?>">
			<?php if ( isset ( $_GET['pwpcp_import'] ) ): // input var okay ?>
				<h1 id="pwpcp-title" class="pwpcp-text"><?php _e( 'Import done', 'pkgTextdomain' ); ?></h1>
				<h3 id="pwpcp-text" class="pwpcp-text"><?php _e( 'All options have been succesfully imported and saved', 'pkgTextdomain' ); ?></h3>
			<?php else : ?>
				<h1 id="pwpcp-title" class="pwpcp-text"><?php _e( 'Customize Plus', 'pkgTextdomain' ); ?></h1>
				<h3 id="pwpcp-text" class="pwpcp-text"></h3>
			<?php endif; ?>
			<div class="pwpcp-text">
				<span class="spinner"></span>
				<?php _e( 'Loading ...', 'pkgTextdomain' ); ?>
			</div>
		</div>
	</div>
</div>