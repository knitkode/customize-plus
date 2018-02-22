<?php defined( 'ABSPATH' ) or die;

if ( ! class_exists( 'KKcp_Admin_About' ) ):

	/**
	 * Admin About page
	 *
	 * Manage the admin about page of Customize Plus.
	 *
	 * @package    Customize_Plus
	 * @subpackage Admin
	 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
	 * @copyright  2018 KnitKode
	 * @license    GPLv3
	 * @version    Release: 1.0.2
	 * @link       https://knitkode.com/products/customize-plus
	 */
	class KKcp_Admin_About {

		/**
		 * Constructor
		 *
		 * @since 1.0.0
		 */
		public function __construct() {

			// Add menu item to settings menu
			add_action( '_admin_menu', array( $this, 'add_menu_subpage' ) );

			// Enqueue all admin JS and CSS
			add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_scripts' ) );
		}

		/**
		 * Add subpage tab to our plugin submenu page
		 *
		 * @since  1.0.0
		 * @uses   KKcp_Admin->add_subpages To add the page tab
		 */
		public function add_menu_subpage() {
			if ( class_exists( 'KKcp_Admin' ) ) {
				KKcp_Admin::get_instance()->add_subpages( array(
					'about' => array(
						'title' => esc_html__( 'About', 'kkcp' ),
						'view' => array( $this, 'get_view' )
					) )
				);
			}
		}

		/**
		 * Add some general styling to the admin area.
		 *
		 * @since 1.0.0
		 * @param string $hook The page hook
		 */
		public static function enqueue_scripts( $hook ) {
			$settings_page_prefix = 'settings_page_kkcp-';
			$settings_pages = array(
				$settings_page_prefix . 'welcome',
				$settings_page_prefix . 'about',
			);
			if ( in_array( $hook, $settings_pages ) ) {
				wp_enqueue_style( 'kkcp-admin', KKcp::get_asset( 'admin', 'css', KKCP_PLUGIN_FILE ), array( 'dashicons' ), KKCP_PLUGIN_VERSION );
			}
		}

		/**
		 * The view for this subpage tab.
		 *
		 * @since  1.0.0
		 */
		public function get_view() {
		?>
			<div class="about-wrap">
				<div class="kkcp-logo"></div>
				<h1>Customize Plus</h1>
				<div class="about-text">
					<p class="description"><?php esc_html_e( 'Enhance and extend the WordPress Customize.', 'kkcp' ); ?></p>
					<ul class="subsubsub" style="margin: 20px 0;">
						<li><a href="https://knitkode.com/products/customize-plus"><?php esc_html_e( 'Project homepage', 'kkcp' ); ?></a> |</li>
						<li><a href="https://knitkode.com/docs"><?php esc_html_e( 'Documentation', 'kkcp' ); ?></a> |</li>
						<li><a href="https://knitkode.com/support"><?php esc_html_e( 'Support', 'kkcp' ); ?></a> |</li>
						<li><a href="https://github.com/knitkode/customize-plus/CHANGELOG.md"><?php esc_html_e( 'Changelog', 'kkcp' ); ?></a> |</li>
						<li><a href="http://github.com/knitkode/customize-plus"><?php esc_html_e( 'View on GitHub', 'kkcp' ); ?></a></li>
					</ul>
				</div>
				<div class="clear"></div>
				<!-- <div class="kkcp-video-container">
					<div class="kkcp-video">
						<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/2anLjZwQg3g?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
					</div>
				</div> -->
				<h3 class="kkcp-title"><?php esc_html_e( 'Features coming soon', 'kkcp' ); ?></h3>
				<ul class="kkcp-features">
					<li><i class="dashicons dashicons-admin-settings"></i>
						<b><?php esc_html_e( 'Controls, controls and controls', 'kkcp' ); ?></b>
						<p class="description"><?php esc_html_e( 'We\'ll keep adding controls both to the free and premium version.', 'kkcp' ); ?> <a href="https://knitkode.com/roadmap#customize-plus"><?php esc_html_e( 'Roadmap', 'kkcp' ) ?></a></p>
					</li>
					<li class="kkcp-premium"><i class="dashicons dashicons-search"></i>
						<b><?php esc_html_e( 'Instant Controls Search', 'kkcp' ); ?></b> <em class="description">(<?php esc_html_e( 'Premium', 'kkcp' ); ?>)</em>
						<p class="description"><?php esc_html_e( 'Use the javascript search engine lunr.js to instantly find the control you need.', 'kkcp' ); ?> <a href="https://knitkode.com/products/customize-plus-premium/components/search"><?php esc_html_e( 'Learn more', 'kkcp' ) ?></a></p>
					</li>
					<li class="kkcp-premium"><i class="dashicons dashicons-admin-comments"></i>
						<b><?php esc_html_e( 'Explanatory info popovers', 'kkcp' ); ?></b> <em class="description">(<?php esc_html_e( 'Premium', 'kkcp' ); ?>)</em>
						<p class="description"><?php esc_html_e( 'Show users some help or extra information for each control.', 'kkcp' ); ?></p>
					</li>
					<!-- <li class="kkcp-premium"><i class="dashicons dashicons-update"></i>
						<b><?php esc_html_e( 'Live Less Compiler', 'kkcp' ); ?></b> <em class="description">(<?php esc_html_e( 'Premium', 'kkcp' ); ?>)</em>
						<p class="description"><?php esc_html_e( 'Use the power of less.js to ', 'kkcp' ); ?> <a href="https://knitkode.com/docs/customize-plus-premium/components/compiler">Learn more</a></p>
					</li> -->
					<li><i class="dashicons dashicons-visibility"></i>
						<b><?php esc_html_e( 'Hide & Show controls', 'kkcp' ); ?></b> <em class="description">(<?php esc_html_e( 'Premium', 'kkcp' ); ?>)</em>
						<p class="description"><?php esc_html_e( 'If your product has a lot of options you will be able to hide them. And in case, to show them again.', 'kkcp' ); ?></p>
					</li>
					<li class="kkcp-premium"><i class="dashicons dashicons-desktop"></i>
						<b><?php esc_html_e( 'Responsive screen Previews', 'kkcp' ); ?></b> <em class="description">(<?php esc_html_e( 'Premium', 'kkcp' ); ?>)</em>
						<p class="description"><?php esc_html_e( 'Preview and test your website responsiveness on different screen sizes.', 'kkcp' ); ?> <a href="https://knitkode.com/docs/customize-plus-premium/components/screen-preview">Learn more</a></p>
					</li>
				</ul>
			</div>
		<?php
		}
	}

	// Instantiate
	new KKcp_Admin_About;

endif;
