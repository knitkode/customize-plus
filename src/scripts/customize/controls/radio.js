import BaseRadio from './base-radio';

/**
 * Control Radio
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_radio`
 *
 * @since  1.0.0
 *
 * @memberof controls
 */
class Radio extends BaseRadio {
    
  /**
   * @override
   */
  static type = `radio`;

  /**
   * @override
   */
  static _onWpConstructor = true;

  /**
   * @override
   */
  _tplChoiceUi() {
    return `
      <label class="{{ classes }}" {{{ attributes }}}>
        <input type="radio" value="{{ val }}" name="_customize-kkcp_radio-{{ data.id }}">
        {{ label }}
        <# if (choice.sublabel) { #><small> ({{ choice.sublabel }})</small><# } #>
      </label>
    `
  }
}

export default Radio;
