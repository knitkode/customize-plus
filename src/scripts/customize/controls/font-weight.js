import Select from './select';

/**
 * Control Font Weight
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_font_weight`
 *
 * @since  1.0.0
 *
 * @memberof controls
 */
class FontWeight extends Select {
   
  /**
   * @override
   */   
  static type = `font_weight`;
}

export default FontWeight;
