<div class="wrap about-wrap">
	<div class="k6cp-badge"><?php printf( esc_html__( 'Version %s', 'pkgTextDomain' ), self::display_version() ); ?></div>
	<h1><?php printf( esc_html__( 'Welcome to Customize Plus %s', 'pkgTextDomain' ), self::display_version() ); ?></h1>
	<div class="about-text">
		<?php if ( self::is_new_install() ) : ?>
			<?php printf( __( 'Thank you for installing Customize Plus! Customize Plus %s do this and that.', 'pkgTextDomain' ), self::display_version() ); ?>
		<?php else : ?>
			<?php printf( __( 'Customize Plus %s comes with a bunch of great improvements we think you&#8217;re really going to like.', 'pkgTextDomain' ), self::display_version() ); ?>
		<?php endif; ?>
	</div>
	<h2 class="nav-tab-wrapper"><?php self::get_tabs_view( '' ); ?></h2>
	<div id="welcome-panel" class="welcome-panel">
		<div class="welcome-panel-content">
			<h3 style="margin:0"><?php _e( 'Getting Started with Customize Plus', 'pkgTextDomain' ); ?></h3>
			<div class="welcome-panel-column-container">
				<div class="welcome-panel-column">
					<h4><?php _e( 'Configure Customize Plus', 'pkgTextDomain' ); ?></h4>
					<ul>
						<li><?php printf( '<a href="%s" class="welcome-icon welcome-edit-page">' . __( 'Set Up Components', 'pkgTextDomain' ) . '</a>', admin_url( add_query_arg( array( 'page' => 'k6cp-components' ), 'admin.php' ) ) ); ?></li>
						<li><?php printf( '<a href="%s" class="welcome-icon welcome-edit-page">' . __( 'Customize Settings', 'pkgTextDomain' ) . '</a>', admin_url( add_query_arg( array( 'page' => 'k6cp-settings' ), 'admin.php' ) ) ); ?></li>
					</ul>
					<a class="button button-primary button-hero hide-if-no-customize" style="margin-bottom:20px;margin-top:0;" href="<?php echo esc_url( wp_customize_url() ); ?>"><?php _e( 'Start Customizing', 'pkgTextDomain' ); ?></a>
				</div>
				<div class="welcome-panel-column">
					<h4><?php _e( 'Administration Tools', 'pkgTextDomain' ); ?></h4>
					<ul>
						// k6todo something
						if active component/addon bootstrap then ...
						if active component/addon builder then ...
						etc..
					</ul>
				</div>
				<div class="welcome-panel-column welcome-panel-last">
					<h4><?php _e( 'Community and Support', 'pkgTextDomain' ); ?></h4>
					<p class="welcome-icon welcome-learn-more" style="margin-right:10px"><?php _e( 'Looking for help? The <a href="http://codex.pkgTextDomain.org/">BuddyPress Codex</a> has you covered.', 'pkgTextDomain' ) ?></p>
					<p class="welcome-icon welcome-learn-more" style="margin-right:10px"><?php _e( 'Can&#8217;t find what you need? Stop by <a href="http://pkgTextDomain.org/support/">our support forums</a>, where active BuddyPress users and developers are waiting to share tips and more.', 'pkgTextDomain' ) ?></p>
				</div>
			</div>
		</div>
	</div>
</div>
