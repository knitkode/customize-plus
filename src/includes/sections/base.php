<?php // @partial
/**
 * Customize Section base class, override WordPress one
 * with few variations
 *
 * @since  0.0.1
 * @override
 */
class PWPcp_Customize_Section_Base extends WP_Customize_Section {

	/**
	 *
	 *
	 * @since 0.0.1
	 *
	 * @override
	 * @return array The array to be exported to the client as JSON.
	 */
	public function json() {
		$array = wp_array_slice_assoc( (array) $this, array( 'title', 'description', 'priority', 'panel', 'type' ) );

		// remove content, we rely completely on js, and declare
		// the control container in the js control base class
		// $array['content'] = $this->get_content();
		$array['active'] = $this->active();
		$array['instanceNumber'] = $this->instance_number;
		return $array;
	}

	/**
	 * Render the section, and the controls that have been added to it.
	 *
	 * @since 3.4.0
	 */
	protected function render() {}
		/*$classes = 'accordion-section control-section control-section-' . $this->type;
		?>
		<li id="accordion-section-<?php echo esc_attr( $this->id ); ?>" class="<?php echo esc_attr( $classes ); ?>">
			Search Search Search Search Search asdas as
			<h3 class="accordion-section-title" tabindex="0">Search
				<?php esc_html_e( $this->title ); ?>
				<span class="screen-reader-text"><?php _e( 'Press return or enter to expand' ); ?></span>
			</h3>
			<ul class="accordion-section-content">
				<?php if ( ! empty( $this->description ) ) : ?>
					<li class="customize-section-description-container">
						<p class="description customize-section-description"><?php echo esc_attr( $this->description ); ?></p>
					</li>
				<?php endif; ?>
			</ul>
		</li>
		<?php
	}*/
}
