<div class="about-wrap">
	<div class="pwpcp-logo"></div>
	<h1>Customize Plus</h1>
	<div class="about-text">
		<p class="description"><?php _e( 'Enhance and extend the WordPress Customize.' ); ?></p>
		<ul class="subsubsub" style="margin: 20px 0;">
			<li><a href="http://pluswp.com/"><?php _e( 'Project homepage' ); ?></a> |</li>
			<li><a href="http://pluswp.com/"><?php _e( 'Documentation' ); ?></a> |</li>
			<li><a href="http://pluswp.com/"><?php _e( 'Support forum' ); ?></a> |</li>
			<li><a href="http://pluswp.com/"><?php _e( 'Changelog' ); ?></a> |</li>
			<li><a href="http://github.com/"><?php _e( 'Fork on GitHub' ); ?></a></li>
		</ul>
	</div>
	<div class="clear"></div>
	<div class="pwpcp-video-container">
		<div class="pwpcp-video">
			<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/2anLjZwQg3g?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
		</div>
	</div>
	<div class="notice">
		<?php if ( class_exists( 'PWPcp_Requirements' ) ): ?>
			<?php if ( version_compare( PWPcp_Requirements::$min_php_version, '>' ) ) : ?>
				<p><?php _e( 'Your php version is compatible' ); ?></p>
 			<?php else : ?>
				<p><?php _e( 'Your php version is too old' ); ?></p>
			<?php endif; ?>
			<?php if ( version_compare( PWPcp_Requirements::$min_wp_version, get_bloginfo( 'version' ), '>' ) ): ?>
				<p><?php _e( 'Your WordPress version is compatible' ); ?></p>
			<?php else : ?>
				<p><?php _e( 'Your WordPress version is too old' ); ?></p>
			<?php endif; ?>
			<?php if ( wp_is_writable( wp_upload_dir()['basedir'] ) ): ?>
				<p><?php _e( 'Your WordPress installation is fully compatible with all the Customize Plus Premium features' ); ?></p>
			<?php else : ?>
				<p><?php _e( 'Your WordPress installation is not fully compatible with all the Customize Plus Premium features' ); ?></p>
			<?php endif; ?>
		<?php endif; ?>
	</div>
	<h2><?php _e( 'Plugin features' ); ?></h2>
	<ul class="pwpcp-features">
		<li><i class="dashicons dashicons-wordpress"></i>
			<b><?php _e( 'Fully integrated in WordPress' ); ?></b>
			<p class="description"><?php _e( 'The code, the admin UI and the API totally looks like WordPress. As it should be.' ); ?></p>
		</li>
		<li><i class="dashicons dashicons-admin-settings"></i>
			<b><?php _e( 'Powerful Custom Controls' ); ?></b>
			<p class="description"><?php _e( 'Customize Plus extend the WordPress API to create all the controls you need leveraging the JavaScript API as you have never seen.' ); ?></p>
		</li>
		<li><i class="dashicons dashicons-undo"></i>
			<b><?php _e( 'Reset control values' ); ?></b>
			<p class="description"><?php _e( 'Users will be able to reset the control values to the initial session or factory value' ); ?></p>
		</li>
		<li><i class="dashicons dashicons-visibility"></i>
			<b><?php _e( 'Hide & Show controls' ); ?></b>
			<p class="description"><?php _e( 'If your product has a lot of options you will be able to hide them. And in case, to show them again.' ); ?></p>
		</li>
		<li class="pwpcp-premium"><i class="dashicons dashicons-update"></i>
			<b><?php _e( 'Live Less Compiler' ); ?></b> <em class="description">(<?php _e( 'Premium' ); ?>)</em>
			<p class="description"><?php _e( 'Use the power of less.js to ' ); ?> | <a href="http://pluswp.com/">Learn more</a></p>
		</li>
		<li class="PWPcp-premium"><i class="dashicons dashicons-search"></i>
			<b><?php _e( 'Instant Controls Search' ); ?></b> <em class="description">(<?php _e( 'Premium' ); ?>)</em>
			<p class="description"><?php _e( 'Use the javascript search engine lunr.js to instantly find the control you need.' ); ?> | <a href="http://pluswp.com/">Learn more</a></p>
		</li>
		<li class="PWPcp-premium"><i class="dashicons dashicons-desktop"></i>
			<b><?php _e( 'Responsive screen Previews' ); ?></b> <em class="description">(<?php _e( 'Premium' ); ?>)</em>
			<p class="description"><?php _e( 'Preview and test your website responsiveness on different screen sizes.' ); ?> | <a href="http://pluswp.com/">Learn more</a></p>
		</li>
		<li><i class="dashicons dashicons-media-code"></i>
			<b><?php _e( 'Documented API' ); ?></b>
			<p class="description"><?php _e( 'The documentation makes use of JSdocs and phpdocs.' ); ?> | <a href="http://pluswp.com/">Learn more</a></p>
		</li>
		<li><i class="dashicons dashicons-translation"></i>
			<b><?php _e( 'International' ); ?></b>
			<p class="description"><?php _e( 'If your product has a lot of options you will be able to hide them. And in case, to show them again.' ); ?> | <a href="http://pluswp.com/">Contribute</a></p>
		</li>
	</ul>
</div>