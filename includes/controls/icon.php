<?php // @partial
/**
 * Icon Control custom class
 *
 * @since  1.0.0
 *
 * @package    Customize_Plus
 * @subpackage Customize\Controls
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPL-2.0+
 * @version    Release: 1.0.0
 * @link       https://knitkode.com/customize-plus
 */
class KKcp_Customize_Control_Icon extends KKcp_Customize_Control_Base_Radio {

	/**
	 * Control type.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'kkcp_icon';

	/**
	 * Selectize disabled (`false`) or enabled (just `true` or array of options)
	 *
	 * @since 1.0.0
	 * @var boolean|array
	 */
	protected $selectize = array();

	/**
	 * Selectize allowed options
	 *
	 * Sanitize methods must be class methods of `KKcp_Sanitize` or global
	 * functions
	 *
	 * @since 1.0.0
	 * @var array
	 */
	public static $selectize_allowed_options = array(
		'plugins' => array( 'sanitizer' => 'js_array', 'values' => array(
			'drag_drop',
			'remove_button'
		) ),
		'maxItems' => array( 'sanitizer' => 'js_number_or_null' ),
		'persist' => array( 'sanitizer' => 'js_bool' ),
		'hideSelected' => array( 'sanitizer' => 'js_bool' ),
		'sortField' => array( 'sanitizer' => 'js_string' ),
	);

	/**
	 * Icons set
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $icons_set = array(
		'dashicons'
	);

	/**
	 * Get an array of all available dashicons.
	 *
	 * @static
	 * @access public
	 * @return array
	 */
	public static function get_dashicons() {
		return array(
			'admin_menu' => array(
				'label' => esc_html__( 'Admin Menu', 'kkcp' ),
				'icons' => array(
					'menu',
					'admin-site',
					'dashboard',
					'admin-post',
					'admin-media',
					'admin-links',
					'admin-page',
					'admin-comments',
					'admin-appearance',
					'admin-plugins',
					'admin-users',
					'admin-tools',
					'admin-settings',
					'admin-network',
					'admin-home',
					'admin-generic',
					'admin-collapse',
					'filter',
					'admin-customizer',
					'admin-multisite',
				)
			),
			'welcome_screen' => array(
				'label' => esc_html__( 'Welcome Screen', 'kkcp' ),
				'icons' => array(
					'welcome-write-blog',
					'welcome-add-page',
					'welcome-view-site',
					'welcome-widgets-menus',
					'welcome-comments',
					'welcome-learn-more',
				),
			),
			'post_formats' => array(
				'label' => esc_html__( 'Post Formats', 'kkcp' ),
				'icons' => array(
					'format-aside',
					'format-image',
					'format-gallery',
					'format-video',
					'format-status',
					'format-quote',
					'format-chat',
					'format-audio',
					'camera',
					'images-alt',
					'images-alt2',
					'video-alt',
					'video-alt2',
					'video-alt3',
				)
			),
			'media' => array(
				'label' => esc_html__( 'Media', 'kkcp' ),
				'icons' => array(
					'media-archive',
					'media-audio',
					'media-code',
					'media-default',
					'media-document',
					'media-interactive',
					'media-spreadsheet',
					'media-text',
					'media-video',
					'playlist-audio',
					'playlist-video',
					'controls-play',
					'controls-pause',
					'controls-forward',
					'controls-skipforward',
					'controls-back',
					'controls-skipback',
					'controls-repeat',
					'controls-volumeon',
					'controls-volumeoff',
				)
			),
			'image_editing' => array(
				'label' => esc_html__( 'Image Editing', 'kkcp' ),
				'icons' => array(
					'image-crop',
					'image-rotate',
					'image-rotate-left',
					'image-rotate-right',
					'image-flip-vertical',
					'image-flip-horizontal',
					'image-filter',
					'undo',
					'redo',
				)
			),
			'tinymce' => array(
				'label' => esc_html__( 'Tinymce', 'kkcp' ),
				'icons' => array(
					'editor-bold',
					'editor-italic',
					'editor-ul',
					'editor-ol',
					'editor-quote',
					'editor-alignleft',
					'editor-aligncenter',
					'editor-alignright',
					'editor-insertmore',
					'editor-spellcheck',
					'editor-expand',
					'editor-contract',
					'editor-kitchensink',
					'editor-underline',
					'editor-justify',
					'editor-textcolor',
					'editor-paste-word',
					'editor-paste-text',
					'editor-removeformatting',
					'editor-video',
					'editor-customchar',
					'editor-outdent',
					'editor-indent',
					'editor-help',
					'editor-strikethrough',
					'editor-unlink',
					'editor-rtl',
					'editor-break',
					'editor-code',
					'editor-paragraph',
					'editor-table',
				)
			),
			'posts' => array(
				'label' => esc_html__( 'Posts', 'kkcp' ),
				'icons' => array(
					'align-left',
					'align-right',
					'align-center',
					'align-none',
					'lock',
					'unlock',
					'calendar',
					'calendar-alt',
					'visibility',
					'hidden',
					'post-status',
					'edit',
					'trash',
					'sticky',
				)
			),
			'sorting' => array(
				'label' => esc_html__( 'Sorting', 'kkcp' ),
				'icons' => array(
					'external',
					'arrow-up',
					'arrow-down',
					'arrow-right',
					'arrow-left',
					'arrow-up-alt',
					'arrow-down-alt',
					'arrow-right-alt',
					'arrow-left-alt',
					'arrow-up-alt2',
					'arrow-down-alt2',
					'arrow-right-alt2',
					'arrow-left-alt2',
					'sort',
					'leftright',
					'randomize',
					'list-view',
					'exerpt-view',
					'grid-view',
				)
			),
			'social' => array(
				'label' => esc_html__( 'Social', 'kkcp' ),
				'icons' => array(
					'share',
					'share-alt',
					'share-alt2',
					'twitter',
					'rss',
					'email',
					'email-alt',
					'facebook',
					'facebook-alt',
					'googleplus',
					'networking',
				)
			),
			'wordpress_org' => array(
				'label' => esc_html__( 'Wordpress Org', 'kkcp' ),
				'icons' => array(
					'hammer',
					'art',
					'migrate',
					'performance',
					'universal-access',
					'universal-access-alt',
					'tickets',
					'nametag',
					'clipboard',
					'heart',
					'megaphone',
					'schedule',
				)
			),
			'products' => array(
				'label' => esc_html__( 'Products', 'kkcp' ),
				'icons' => array(
					'wordpress',
					'wordpress-alt',
					'pressthis',
					'update',
					'screenoptions',
					'info',
					'cart',
					'feedback',
					'cloud',
					'translation',
				)
			),
			'taxonomies' => array(
				'label' => esc_html__( 'Taxonomies', 'kkcp' ),
				'icons' => array(
					'tag',
					'category',
				)
			),
			'widgets' => array(
				'label' => esc_html__( 'Widgets', 'kkcp' ),
				'icons' => array(
					'archive',
					'tagcloud',
					'text',
				)
			),
			'notifications' => array(
				'label' => esc_html__( 'Notifications', 'kkcp' ),
				'icons' => array(
					'yes',
					'no',
					'no-alt',
					'plus',
					'plus-alt',
					'minus',
					'dismiss',
					'marker',
					'star-filled',
					'star-half',
					'star-empty',
					'flag',
					'warning',
				)
			),
			'misc' => array(
				'label' => esc_html__( 'Misc', 'kkcp' ),
				'icons' => array(
					'location',
					'location-alt',
					'vault',
					'shield',
					'shield-alt',
					'sos',
					'search',
					'slides',
					'analytics',
					'chart-pie',
					'chart-bar',
					'chart-line',
					'chart-area',
					'groups',
					'businessman',
					'id',
					'id-alt',
					'products',
					'awards',
					'forms',
					'testimonial',
					'portfolio',
					'book',
					'book-alt',
					'download',
					'upload',
					'backup',
					'clock',
					'lightbulb',
					'microphone',
					'desktop',
					'tablet',
					'smartphone',
					'phone',
					'index-card',
					'carrot',
					'building',
					'store',
					'album',
					'palmtree',
					'tickets-alt',
					'money',
					'smiley',
					'thumbs-up',
					'thumbs-down',
					'layout',
				)
			)
		);
	}

	/**
	 * Set dashicons array as a constant to use in javascript
	 *
	 * @override
	 * @since  1.0.0
	 * @return array
	 */
	public function get_constants() {
		return array(
			'dashicons' => self::get_dashicons(),
		);
	}

	/**
	 * Add values to JSON params
	 *
	 * @since 1.0.0
	 */
	protected function add_to_json() {
		if ( is_string( $this->choices ) && in_array( $this->choices, $this->icons_set ) ) {
			$this->json['choices'] = $this->choices;
		}
		if ( ! empty( $this->selectize ) ) {
			$this->json['selectize'] = KKcp_Sanitize::js_options( $this->selectize, self::$selectize_allowed_options );
		}
	
	}

	/**
	 * Render a JS template for the content of the control.
	 *
	 * @since 1.0.0
	 */
	protected function js_tpl() {
		?>
		<label>
			<?php $this->js_tpl_header(); ?>
		</label>
		<select class="kkcp-selectize" value="{{ data.value }}" placeholder="Search by name..." name="icon[]" multiple><option value="">Search icon by name...</option></select>
		<!-- <div class="kkcp-icon-wrap"><?php // filled through js ?></div> -->
		<?php
	}

	/**
	 * Sanitize
	 *
	 * @since 1.0.0
	 * @override
	 * @param string               $value   The value to sanitize.
 	 * @param WP_Customize_Setting $setting Setting instance.
 	 * @param WP_Customize_Control $control Control instance.
 	 * @return string The sanitized value.
 	 */
	protected static function sanitize( $value, $setting, $control ) {
		return $value;
		// return KKcp_Sanitize::string_in_choices( $value, $setting, $control );
	}

	/**
	 * Validate
	 *
	 * @since 1.0.0
	 * @override
	 * @param WP_Error 						 $validity
	 * @param mixed 							 $value    The value to validate.
 	 * @param WP_Customize_Setting $setting  Setting instance.
 	 * @param WP_Customize_Control $control  Control instance.
	 * @return mixed
 	 */
	protected static function validate( $validity, $value, $setting, $control ) {
	
		return $validity;
	}
}

/**
 * Register on WordPress Customize global object
 */
$wp_customize->register_control_type( 'KKcp_Customize_Control_Icon' );