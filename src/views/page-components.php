<div class="wrap">
	<h2 class="nav-tab-wrapper"><?php self::get_tabs_view( __( 'Components', 'pkgTextDomain' ) ); ?></h2>
	<p style="margin-top: 20px;" class="description"><?php _e( 'Check / uncheck the components you want enabled. Expand each component area to see the available options.', 'pkgTextDomain' ); ?></p>
	<form action="" method="post" id="k6cp-admin-page">
		<div class="metabox-holder">
			<div class="postbox-container">
				<?php if ( ! empty( K6CPP::get_components() ) ) : ?>
					<?php foreach ( K6CPP::get_components() as $id => $args ) : ?>
						<?php $class = isset( K6CPP::get_components( 'active' )[ $id ] ) ? 'active' : 'inactive'; ?>

						<?php add_meta_box(
							'my-custom-meta-box' . $id,
							$args['title'],
							'k6cp-components',
							'normal' );
						?>
						<?php do_meta_boxes('k6cp-components','normal',null); ?>
						<div id="post-body" class="metabox-holder columns-<?php echo 1 == get_current_screen()->get_columns() ? '1' : '2'; ?>">
							<div id="post-body-content">
							</div>
							<div id="postbox-container-1" class="postbox-container">
								<?php do_meta_boxes('my_custom_menu_page' . $id,'normal',null); ?>
							</div>
						</div>
						<!--
						<div class="postbox-container">
							<div class="postbox">
								<div class="handlediv" title="Click to toggle"><br></div><h3 class="hndle ui-sortable-handle"><span>Information</span></h3>
								<div class="inside">
								</div>
							</div>
						</div>
						-->
					<?php endforeach ?>
				<?php else : ?>
					<?php _e( 'No components found.', 'pkgTextDomain' ); ?>
				<?php endif; ?>
			</div>
		</div>

		<p class="submit clear">
			<input class="button-primary" type="submit" name="k6cp-admin-pages-submit" id="k6cp-admin-pages-submit" value="<?php esc_attr_e( 'Save Settings', 'pkgTextDomain' ) ?>"/>
		</p>
		<?php wp_nonce_field( 'k6cp-settings' ); ?>
	</form>
</div>