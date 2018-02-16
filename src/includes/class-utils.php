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

  /**
   * Browser's native css units
   *
   * @since  1.0.0
   * @var array
   */
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

  /**
   * Browser's native css color keywords
   *
   * @since  1.0.0
   * @var array
   */
	const COLORS_KEYWORDS = array(
    'aliceblue',
    'antiquewhite',
    'aqua',
    'aquamarine',
    'azure',
    'beige',
    'bisque',
    'black',
    'blanchedalmond',
    'blue',
    'blueviolet',
    'brown',
    'burlywood',
    'cadetblue',
    'chartreuse',
    'chocolate',
    'coral',
    'cornflowerblue',
    'cornsilk',
    'crimson',
    'cyan',
    'darkblue',
    'darkcyan',
    'darkgoldenrod',
    'darkgray',
    'darkgreen',
    'darkgrey',
    'darkkhaki',
    'darkmagenta',
    'darkolivegreen',
    'darkorange',
    'darkorchid',
    'darkred',
    'darksalmon',
    'darkseagreen',
    'darkslateblue',
    'darkslategray',
    'darkslategrey',
    'darkturquoise',
    'darkviolet',
    'deeppink',
    'deepskyblue',
    'dimgray',
    'dimgrey',
    'dodgerblue',
    'firebrick',
    'floralwhite',
    'forestgreen',
    'fuchsia',
    'gainsboro',
    'ghostwhite',
    'gold',
    'goldenrod',
    'gray',
    'green',
    'greenyellow',
    'grey',
    'honeydew',
    'hotpink',
    'indianred',
    'indigo',
    'ivory',
    'khaki',
    'lavender',
    'lavenderblush',
    'lawngreen',
    'lemonchiffon',
    'lightblue',
    'lightcoral',
    'lightcyan',
    'lightgoldenrodyellow',
    'lightgray',
    'lightgreen',
    'lightgrey',
    'lightpink',
    'lightsalmon',
    'lightseagreen',
    'lightskyblue',
    'lightslategray',
    'lightslategrey',
    'lightsteelblue',
    'lightyellow',
    'lime',
    'limegreen',
    'linen',
    'magenta',
    'maroon',
    'mediumaquamarine',
    'mediumblue',
    'mediumorchid',
    'mediumpurple',
    'mediumseagreen',
    'mediumslateblue',
    'mediumspringgreen',
    'mediumturquoise',
    'mediumvioletred',
    'midnightblue',
    'mintcream',
    'mistyrose',
    'moccasin',
    'navajowhite',
    'navy',
    'oldlace',
    'olive',
    'olivedrab',
    'orange',
    'orangered',
    'orchid',
    'palegoldenrod',
    'palegreen',
    'paleturquoise',
    'palevioletred',
    'papayawhip',
    'peachpuff',
    'peru',
    'pink',
    'plum',
    'powderblue',
    'purple',
    'red',
    'rosybrown',
    'royalblue',
    'saddlebrown',
    'salmon',
    'sandybrown',
    'seagreen',
    'seashell',
    'sienna',
    'silver',
    'skyblue',
    'slateblue',
    'slategray',
    'slategrey',
    'snow',
    'springgreen',
    'steelblue',
    'tan',
    'teal',
    'thistle',
    'tomato',
    'transparent',
    'turquoise',
    'violet',
    'wheat',
    'white',
    'whitesmoke',
    'yellow',
    'yellowgreen',
	);

  /**
   * Browser's native css font families divided in groups
   *
   * @see http://www.w3schools.com/cssref/css_websafe_fonts.asp
   * @since  1.0.0
   * @var array
   */
  public static function get_font_families_standard () {
    return array(
      'serif' => array(
        'label' => 'Serif Fonts',
        'values' => array(
          'Georgia',
          '"Palatino Linotype"',
          '"Book Antiqua"',
          'Palatino',
          '"Times New Roman"',
          'Times',
          'serif',
        ),
      ),
      'sans-serif' => array(
        'label' => 'Sans-Serif Fonts',
        'values' => array(
          'Arial',
          'Helvetica',
          '"Helvetica Neue"',
          '"Arial Black"',
          'Gadget',
          '"Comic Sans MS"',
          'cursive',
          'Impact',
          'Charcoal',
          '"Lucida Sans Unicode"',
          '"Lucida Grande"',
          'Tahoma',
          'Geneva',
          '"Trebuchet MS"',
          'Verdana',
          'sans-serif',
        ),
      ),
      'monospace' => array(
        'label' => 'Monospace Fonts',
        'values' => array(
          '"Courier New"',
          'Courier',
          '"Lucida Console"',
          'Monaco',
          'monospace',
          'Menlo',
          'Consolas',
        ),
      ),
    );
  }

	/**
	 * Get an array of all available dashicons.
   *
   * @see https://github.com/knitkode/dashicons/blob/master/groups.json
   * @since  1.0.0
	 * @static
	 * @access public
	 * @return array
	 */
	public static function get_dashicons() {
		return array(
			'admin_menu' => array(
				'label' => esc_html__( 'Admin Menu' ),
				'values' => array(
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
				'values' => array(
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
				'values' => array(
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
				'values' => array(
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
				'values' => array(
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
				'values' => array(
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
				'values' => array(
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
				'values' => array(
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
				'values' => array(
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
				'values' => array(
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
				'values' => array(
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
				'values' => array(
					'tag',
					'category',
				)
			),
			'widgets' => array(
				'label' => esc_html__( 'Widgets' ),
				'values' => array(
					'archive',
					'tagcloud',
					'text',
				)
			),
			'notifications' => array(
				'label' => esc_html__( 'Notifications' ),
				'values' => array(
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
				'values' => array(
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
	 * Get asset file, minified or unminified
	 *
   *@since  1.0.0
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
   * In array recursive
   *
   * @link(http://stackoverflow.com/a/4128377/1938970, source)
   * @since  1.0.0
   * @param  string|number $needle
   * @param  array         $haystack
   * @param  boolean       $strict
   * @return boolean
   */
  public static function in_array_r( $needle, $haystack, $strict = false ) {
    foreach ( $haystack as $item ) {
      if ( ( $strict ? $item === $needle : $item == $needle ) ||
        ( is_array( $item ) && self::in_array_r( $needle, $item, $strict ) )
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Flattens a nested array
   *
   * @since  1.0.0
   * @author {@link(http://ramartin.net/, Ron Martinez)}
   * {@link(http://davidwalsh.name/flatten-nested-arrays-php#comment-64616,
   * source)}
   *
   * Based on:
   * {@link http://davidwalsh.name/flatten-nested-arrays-php#comment-56256}
   *
   * @param array $array     The array to flatten.
   * @param int   $max_depth How many levels to flatten. Negative numbers
   *                         mean flatten all levels. Defaults to -1.
   * @param int   $_depth    The current depth level. Should be left alone.
   */
  public static function array_flatten(array $array, $max_depth = -1, $_depth = 0) {
    $result = array();

    foreach ( $array as $key => $value ) {
      if ( is_array( $value ) && ( $max_depth < 0 || $_depth < $max_depth ) ) {
        $flat = self::array_flatten( $value, $max_depth, $_depth + 1 );
        if ( is_string( $key ) ) {
          $duplicate_keys = array_keys( array_intersect_key( $array, $flat ) );
          foreach ( $duplicate_keys as $k ) {
            $flat["$key.$k"] = $flat[ $k ];
            unset( $flat[ $k ] );
          }
        }
        $result = array_merge( $result, $flat );
      }
      else {
        if ( is_string( $key ) ) {
          $result[ $key ] = $value;
        }
        else {
          $result[] = $value;
        }
      }
    }
    return $result;
  }

  /**
   * Normalize font family
   *
   * Be sure that a font family is trimmed and wrapped in quote, good for
   * consistency
   *
   * @since  1.0.0
   * @param  string|array $value
   * @return string
   */
  public static function normalize_font_family( $value ) {
    return "'" . trim( str_replace( "'", '', str_replace( '"', '', $value ) ) ) . "'";
  }

  /**
   * Convert a hexa decimal color code to its RGB equivalent
   *
   * @link(http://php.net/manual/en/function.hexdec.php#99478, original source)
   * @since  1.0.0
   * @param  string  $hex_str          Hexadecimal color value
   * @param  boolean $return_as_string If set true, returns the value separated
   *                                   by the separator character. Otherwise
   *                                   returns associative array
   * @return array|string              Depending on second parameter. Returns
   *                                   `false` if invalid hex color value
   */
  public static function hex_to_rgb( $hex_str, $return_as_string = true ) {
    $hex_str = preg_replace( '/[^0-9A-Fa-f]/ ', '', $hex_str ); // Gets a proper hex string
    $rgb_array = array();
    // If a proper hex code, convert using bitwise operation. No overhead... faster
    if ( strlen( $hex_str ) == 6 ) {
      $color_val = hexdec( $hex_str );
      $rgb_array['red'] = 0xFF & ( $color_val >> 0x10 );
      $rgb_array['green'] = 0xFF & ( $color_val >> 0x8 );
      $rgb_array['blue'] = 0xFF & $color_val;
    // if shorthand notation, need some string manipulations
    } else if ( strlen( $hex_str ) == 3 ) {
      $rgb_array['red'] = hexdec( str_repeat( substr( $hex_str, 0, 1 ), 2 ) );
      $rgb_array['green'] = hexdec( str_repeat( substr( $hex_str, 1, 1 ), 2 ) );
      $rgb_array['blue'] = hexdec( str_repeat( substr( $hex_str, 2, 1 ), 2 ) );
    } else {
      return false; //Invalid hex color code
    }
    // returns the rgb string or the associative array
    return $return_as_string ? implode( ',', $rgb_array ) : $rgb_array;
  }

  /**
   * Converts a RGBA color to a RGB, stripping the alpha channel value
   *
   * It needs a value cleaned of all whitespaces (sanitized).
   *
   * @since  1.0.0
   * @param  string $input
   * @return string
   */
  public static function rgba_to_rgb( $input ) {
    sscanf( $input, 'rgba(%d,%d,%d,%f)', $red, $green, $blue, $alpha );
    return "rgba($red,$green,$blue)";
  }

  /**
   * Extract number from value, returns 0 otherwise
   *
   * @since  1.0.0
   * @param  string         $value         The value from to extract from
   * @param  bool|null      $allowed_float Whether float numbers are allowed
   * @return int|float|null The extracted number or null if the value does not
   *                        contain any digit.
   */
  public static function extract_number( $value, $allowed_float ) {
    if ( is_int( $value ) || ( is_float( $value ) && $allowed_float ) ) {
      return $value;
    }
    if ( $allowed_float ) {
      $number_extracted = filter_var( $value, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION );
    } else {
      $number_extracted = filter_var( $value, FILTER_SANITIZE_NUMBER_INT );
    }
    if ( $number_extracted || 0 === $number_extracted ) {
      return $number_extracted;
    }
    return null;
  }

  /**
   * Extract unit (like `px`, `em`, `%`, etc.) from an array of allowed units
   *
   * @since  1.0.0
   * @param  string     $value          The value from to extract from
   * @param  null|array $allowed_units  An array of allowed units
   * @return string                     The first valid unit found.
   */
  public static function extract_size_unit( $value, $allowed_units ) {
    if ( is_array( $allowed_units ) ) {
      foreach ( $allowed_units as $unit ) {
        if ( strpos( $value, $unit ) ) {
          return $unit;
        }
      }
      return isset( $allowed_units[0] ) ? $allowed_units[0] : '';
    }
    return '';
  }

  /**
   * Modulus
   *
   * // @@todo this is not really precise \\
   * @see http://php.net/manual/it/function.fmod.php#76125
   * @since  1.0.0
   * @param  number $n1
   * @param  number $n2
   * @return number
   */
  public static function modulus( $n1, $n2 ) {
    $division = $n1 / $n2;

    return (int) ( $n1 - ( ( (int) ( $division ) ) * $n2 ) );
  }
}
