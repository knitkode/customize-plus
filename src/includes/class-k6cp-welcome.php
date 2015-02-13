<?php defined( 'ABSPATH' ) or die;

/**
 * Welcome class
 *
 * @package      pkgNamePretty
 * @subpackage   classes
 * @since        0.0.1
 * @link         pkgHomepage
 * @author       pkgAuthorName <pkgAuthorEmail> (pkgAuthorUrl)
 * @copyright    pkgConfigStartYear - pkgConfigEndYear | pkgLicenseType
 * @license      pkgLicenseUrl
 */

class K6CP_Welcome {

	/**
	 * Constructor
	 *
	 * @since 0.0.1
	 */
	public function __construct() {
		add_action( 'admin_init', array( $this, 'init_welcome_panel' ) ); // after_switch_theme
	}

	// /**
	//  * Welcome Panel
	//  *
	//  * @since 0.0.1
	//  */
	// public function init_welcome_panel() {
	//   wp_enqueue_style( 'k6-welcome', K6CP::$_ASSETS_ADMIN . 'welcome.min.css', array(), K6CP::VERSION ); // k6anticache \\

	//   wp_register_script( 'k6-welcome', K6CP::$_ASSETS_ADMIN . 'welcome.min.js', array( 'json2', 'thickbox', 'jquery' ), K6CP::VERSION, true ); // k6anticache \\
	//   wp_localize_script( 'k6-welcome', 'K6CP', array(
	//       'L10n' => array(
	//         'welcome' => __( 'Welcome', 'pkgTextdomain' ),
	//         'nextLabel' => __( 'Next', 'pkgTextdomain' ),
	//         'prevLabel' => __( 'Prev', 'pkgTextdomain' ),
	//         'skipLabel' => __( 'Skip', 'pkgTextdomain' ),
	//         'doneLabel' => __( 'Done', 'pkgTextdomain' ),
	//       )
	//     ) );
	//   wp_enqueue_script( 'k6-welcome' );
	// }

	/**
	 * Welcome Panel
	 *
	 * @since 0.0.1
	 */
	public function init_welcome_panel() {

		add_action( 'admin_notices', array( $this, 'add_welcome_panel' ) ); // after_switch_theme

		wp_enqueue_style( 'k6-welcome', K6CP::$_ASSETS_ADMIN . 'welcome.min.css', array(), K6CP::VERSION ); // k6anticache \\
	}

	/**
	 * Welcome Panel
	 *
	 * @since 0.0.1
	 */
	public function add_welcome_panel() {
		global $current_screen;
		$template = self::get_welcome_panel();
		add_settings_error( 'k6-welcome', 'k6-welcome', $template, 'updated welcome-panel' );
		if ( 'options-general' !== $current_screen->parent_base ) {
			settings_errors( 'k6-welcome', 'pkgTextdomain' );
		}
	}

	/**
	 * Welcome Panel
	 *
	 * @since 0.0.1
	 */
	public function get_welcome_panel() {
		$tpl_customizable = '';
		if ( current_user_can( 'customize' ) ) {
			$tpl_customizable = '<h4>' . __( 'Get Started', 'pkgTextdomain' ) . '</h4>
				<a class="button button-primary button-hero load-customize hide-if-no-customize" href="' . wp_customize_url() .'">' . __( 'Customize Theme', 'pkgTextdomain' ) . '</a>';
		} // k6wptight-layout starts p and strong closing tags to get valid html, see ./wp-admin/includes/template.php#L1436 \\
		return '</strong></p>
		<div id="k6-welcome" class="welcome-panel-content" style="display:none">
			<h3>' . __( 'Welcome to pkgNamePretty!', 'pkgTextdomain' ) . '</h3>
			<p class="about-description">' . __( 'We&#8217;ve assembled some links to get you started:', 'pkgTextdomain' ) . '</p>
			<!-- <div class="k6-logo"></div> k6todo -->
			<div class="welcome-panel-column-container">
				<div class="welcome-panel-column">
					' . $tpl_customizable . '
				</div>
				<div class="welcome-panel-column">
					<h4>' . __( 'Next Steps', 'pkgTextdomain' ) . '</h4>
					<ul>
						<li>' . sprintf( '<a href="%s" class="welcome-icon welcome-view-site">' . __( 'View your site', 'pkgTextdomain' ) . '</a>', home_url( '/' ) ) . '</li>
					</ul>
				</div>
				<div class="welcome-panel-column welcome-panel-last">
					<h4>' . __( 'More Actions', 'pkgTextdomain' ) . '</h4>
					<ul>
						<li>' . sprintf( '<a href="%s" class="welcome-icon welcome-view-site">' . __( 'Import settings', 'pkgTextdomain' ) . '</a>', wp_customize_url() . '?autofocus[section]=k6-import' ) . '</li>
						<li>' . sprintf( '<a href="%s" class="welcome-icon welcome-view-site">' . __( 'Documentation', 'pkgTextdomain' ) . '</a>', home_url( '/' ) ) . '</li>
					</ul>
				</div>
			</div>
		</div>
		<script>
			jQuery(document).ready(function ($) {
				$("#k6-welcome").slideDown();
			});
		</script>
		<strong><p>'; // k6wptight-layout ends with p and strong open tags to get valid html, see ./wp-admin/includes/template.php#L1436 \\
	}
}

new K6CP_Welcome;
