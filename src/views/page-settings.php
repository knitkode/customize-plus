<div class="wrap">
	<h2 class="nav-tab-wrapper"><?php self::get_tabs_view( __( 'Settings', 'pkgTextDomain' ) ); ?></h2>
	<p style="margin-top: 20px;" class="description"><?php _e( 'Check / uncheck the components you want enabled. Expand each component area to see the available options.', 'pkgTextDomain' ); ?></p>
	<form action="" method="post" id="k6cp-admin-page">
		<table class="widefat fixed plugins" cellspacing="0">
			<thead>
				<tr>
					<th scope="col" id="cb" class="manage-column column-cb check-column">&nbsp;</th>
					<th scope="col" id="name" class="manage-column column-name" style="width: 190px;">Component</th>
					<th scope="col" id="description" class="manage-column column-description">Description</th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<th scope="col" class="manage-column column-cb check-column">&nbsp;</th>
					<th scope="col" class="manage-column column-name" style="width: 190px;">Component</th>
					<th scope="col" class="manage-column column-description">Description</th>
				</tr>
			</tfoot>
			<tbody id="the-list">
				<?php // settings_fields( 'k6cp_settings' ); ?>
				<?php // do_settings_sections( 'k6cp' ); ?>
				<?php if ( ! empty( K6CPP::get_components() ) ) : ?>
					<?php foreach ( K6CPP::get_components() as $id => $args ) : ?>
						<?php $class = isset( K6CPP::get_components( 'active' )[ $id ] ) ? 'active' : 'inactive'; ?>
						<tr id="<?php echo esc_attr( $id ); ?>" class="<?php echo esc_attr( $id ) . ' ' . esc_attr( $class ); ?>">
							<th scope="row">
								<input type="checkbox" id="bp_components[<?php echo esc_attr( $id ); ?>]" name="bp_components[<?php echo esc_attr( $id ); ?>]" value="1"<?php checked( isset( K6CPP::get_components( 'active' )[ $id ] ) ); ?> />
								<label class="screen-reader-text" for="bp_components[<?php echo esc_attr( $id ); ?>]"><?php sprintf( __( 'Select %s', 'pkgTextDomain' ), esc_html( $args['title'] ) );  ?></label>
							</th>
							<td class="plugin-title" style="width: 190px;">
								<i class="dashicons dashicons-<?php echo esc_html( $args['icon'] ); ?>"></i>
								<strong><?php echo esc_html( $args['title'] ); ?></strong>
								<div class="row-actions-visible"></div>
							</td>
							<td class="column-description desc">
								<div class="plugin-description">
									<p><?php echo $args['description']; ?></p>
								</div>
								<div class="active second plugin-version-author-uri"></div>
							</td>
						</tr>
					<?php endforeach ?>
				<?php else : ?>
					<tr class="no-items">
						<td class="colspanchange" colspan="3"><?php _e( 'No components found.', 'pkgTextDomain' ); ?></td>
					</tr>
				<?php endif; ?>
			</tbody>
		</table>
		<p class="submit clear">
			<input class="button-primary" type="submit" name="k6cp-admin-pages-submit" id="k6cp-admin-pages-submit" value="<?php esc_attr_e( 'Save Settings', 'pkgTextDomain' ) ?>"/>
		</p>
		<?php wp_nonce_field( 'k6cp-settings' ); ?>
	</form>
</div>