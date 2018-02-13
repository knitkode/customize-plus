<?php defined( 'ABSPATH' ) or die;

/**
 * Utils functions
 *
 * @package    Customize_Plus
 * @subpackage Customize
 * @author     KnitKode <dev@knitkode.com> (https://knitkode.com)
 * @copyright  2017 KnitKode
 * @license    GPLv3
 * @version    Release: pkgVersion
 * @link       https://knitkode.com/products/customize-plus
 */
class KKcp_Utils {

	const CSS_UNITS = array(
		'em',
		'ex',
		'%',
		'px',
		'cm',
		'mm',
		'in',
		'pt',
		'pc',
		'ch',
		'rem',
		'vh',
		'vw',
		'vmin',
		'vmax',
	);

	const COLORS_KEYWORDS = array(
    'aliceblue' => 1,
    'antiquewhite' => 1,
    'aqua' => 1,
    'aquamarine' => 1,
    'azure' => 1,
    'beige' => 1,
    'bisque' => 1,
    'black' => 1,
    'blanchedalmond' => 1,
    'blue' => 1,
    'blueviolet' => 1,
    'brown' => 1,
    'burlywood' => 1,
    'cadetblue' => 1,
    'chartreuse' => 1,
    'chocolate' => 1,
    'coral' => 1,
    'cornflowerblue' => 1,
    'cornsilk' => 1,
    'crimson' => 1,
    'cyan' => 1,
    'darkblue' => 1,
    'darkcyan' => 1,
    'darkgoldenrod' => 1,
    'darkgray' => 1,
    'darkgreen' => 1,
    'darkgrey' => 1,
    'darkkhaki' => 1,
    'darkmagenta' => 1,
    'darkolivegreen' => 1,
    'darkorange' => 1,
    'darkorchid' => 1,
    'darkred' => 1,
    'darksalmon' => 1,
    'darkseagreen' => 1,
    'darkslateblue' => 1,
    'darkslategray' => 1,
    'darkslategrey' => 1,
    'darkturquoise' => 1,
    'darkviolet' => 1,
    'deeppink' => 1,
    'deepskyblue' => 1,
    'dimgray' => 1,
    'dimgrey' => 1,
    'dodgerblue' => 1,
    'firebrick' => 1,
    'floralwhite' => 1,
    'forestgreen' => 1,
    'fuchsia' => 1,
    'gainsboro' => 1,
    'ghostwhite' => 1,
    'gold' => 1,
    'goldenrod' => 1,
    'gray' => 1,
    'green' => 1,
    'greenyellow' => 1,
    'grey' => 1,
    'honeydew' => 1,
    'hotpink' => 1,
    'indianred' => 1,
    'indigo' => 1,
    'ivory' => 1,
    'khaki' => 1,
    'lavender' => 1,
    'lavenderblush' => 1,
    'lawngreen' => 1,
    'lemonchiffon' => 1,
    'lightblue' => 1,
    'lightcoral' => 1,
    'lightcyan' => 1,
    'lightgoldenrodyellow' => 1,
    'lightgray' => 1,
    'lightgreen' => 1,
    'lightgrey' => 1,
    'lightpink' => 1,
    'lightsalmon' => 1,
    'lightseagreen' => 1,
    'lightskyblue' => 1,
    'lightslategray' => 1,
    'lightslategrey' => 1,
    'lightsteelblue' => 1,
    'lightyellow' => 1,
    'lime' => 1,
    'limegreen' => 1,
    'linen' => 1,
    'magenta' => 1,
    'maroon' => 1,
    'mediumaquamarine' => 1,
    'mediumblue' => 1,
    'mediumorchid' => 1,
    'mediumpurple' => 1,
    'mediumseagreen' => 1,
    'mediumslateblue' => 1,
    'mediumspringgreen' => 1,
    'mediumturquoise' => 1,
    'mediumvioletred' => 1,
    'midnightblue' => 1,
    'mintcream' => 1,
    'mistyrose' => 1,
    'moccasin' => 1,
    'navajowhite' => 1,
    'navy' => 1,
    'oldlace' => 1,
    'olive' => 1,
    'olivedrab' => 1,
    'orange' => 1,
    'orangered' => 1,
    'orchid' => 1,
    'palegoldenrod' => 1,
    'palegreen' => 1,
    'paleturquoise' => 1,
    'palevioletred' => 1,
    'papayawhip' => 1,
    'peachpuff' => 1,
    'peru' => 1,
    'pink' => 1,
    'plum' => 1,
    'powderblue' => 1,
    'purple' => 1,
    'red' => 1,
    'rosybrown' => 1,
    'royalblue' => 1,
    'saddlebrown' => 1,
    'salmon' => 1,
    'sandybrown' => 1,
    'seagreen' => 1,
    'seashell' => 1,
    'sienna' => 1,
    'silver' => 1,
    'skyblue' => 1,
    'slateblue' => 1,
    'slategray' => 1,
    'slategrey' => 1,
    'snow' => 1,
    'springgreen' => 1,
    'steelblue' => 1,
    'tan' => 1,
    'teal' => 1,
    'thistle' => 1,
    'tomato' => 1,
    'transparent' => 1,
    'turquoise' => 1,
    'violet' => 1,
    'wheat' => 1,
    'white' => 1,
    'whitesmoke' => 1,
    'yellow' => 1,
    'yellowgreen' => 1,
	);

	/**
	 * Compress HTML
	 * @param  string $buffer The php->HTML buffer
	 * @return string         The compressed HTML (stripped whitespaces)
	 * @since  1.0.0
	 */
	public static function compress_html( $buffer ) {
		return preg_replace( '/\s+/', ' ', str_replace( array( "\n", "\r", "\t" ), '', $buffer ) );
	}

	/**
	 * Get asset file, minified or unminified
	 *
	 * @param  string $filename
	 * @param  string $type
	 * @param  string $base_url
	 * @param  string $ext
	 * @return string
	 */
	public static function get_asset( $filename, $type, $base_url, $ext = '' ) {
		if ( ! $ext ) {
			$ext = $type;
		}
		$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		return plugins_url( "assets/$type/$filename$min.$ext", $base_url );
	}

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
				'label' => esc_html__( 'Admin Menu' ),
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
				'label' => esc_html__( 'Welcome Screen' ),
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
				'label' => esc_html__( 'Post Formats' ),
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
				'label' => esc_html__( 'Media' ),
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
				'label' => esc_html__( 'Image Editing' ),
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
				'label' => esc_html__( 'Tinymce' ),
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
				'label' => esc_html__( 'Posts' ),
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
				'label' => esc_html__( 'Sorting' ),
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
				'label' => esc_html__( 'Social' ),
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
				'label' => esc_html__( 'Wordpress Org' ),
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
				'label' => esc_html__( 'Products' ),
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
				'label' => esc_html__( 'Taxonomies' ),
				'icons' => array(
					'tag',
					'category',
				)
			),
			'widgets' => array(
				'label' => esc_html__( 'Widgets' ),
				'icons' => array(
					'archive',
					'tagcloud',
					'text',
				)
			),
			'notifications' => array(
				'label' => esc_html__( 'Notifications' ),
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
				'label' => esc_html__( 'Misc' ),
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
}

// add ajax action
add_action( 'wp_ajax_KKcp_utils_load_wp_editor', 'KKcp_Utils::load_wp_editor' );