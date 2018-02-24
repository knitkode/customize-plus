import { api, wpApi } from '../core/globals';
import Text from './text';

/**
 * Control Password class
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_password`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Password
 *
 * @extends controls.Text
 * @augments controls.BaseInput
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 */
class Password extends Text {

  /**
   * @override
   */
  syncUI (value) {
    if (value && this.__input.value !== value) {
      this.__input.value = value;
      this.__text.value = value;
    }
  }

  /**
   * @override
   */
  ready (value) {
    const self = this;
    const {setting} = this;
    const {attrs} = this.params || {};

    self.__input = self._container.getElementsByTagName('input')[0];

    if (attrs['visibility']) {

      self.__text = self._container.getElementsByTagName('input')[1];

      // bind the visibility toggle button
      self.container.find('.kkcp-password__toggle').click((event) => {
        if (event) {
          event.preventDefault();
        }
        self.__isVisible = !self.__isVisible;
        self._toggleVisibility(self.__isVisible);
      });

      // sync the text preview to the input password
      $(self.__text)
        .val(setting())
        .on('change keyup paste', function () {
          setting.set(this.value);
          self.__input.value = this.value;
        });
    }

    // sync input and listen for changes
    $(self.__input)
      .val(setting())
      .on('change keyup paste', function () {
        setting.set(this.value);
        if (self.__text) {
          self.__text.value = this.value;
        }
      });
  }

  /**
   * Toggle password visiblity
   *
   * @since   1.0.0
   * @memberof! controls.Password#
   * @access protected
   *
   * @param  {boolean} isVisible
   */
  _toggleVisibility (isVisible) {
    if (isVisible) {
      this.container.addClass('kkcp-password-visible');
      this.__text.focus();
    } else {
      this.container.removeClass('kkcp-password-visible');
      this.__input.focus();
    }
  }

  /**
   * @override
   */
  _tplInner () {
    const tplInput = this._tplInput();

    return `
      <span class="kkcp-password">
        <# if (data.attrs && data.attrs.visibility) { #>
          ${tplInput}
          <input class="kkcp-password__preview" type="text" tabindex="-1" <# for (var key in attrs) { if (attrs.hasOwnProperty(key) && key !== 'title') { #>{{ key }}="{{ attrs[key] }}" <# } } #>>
          <button class="kkcp-password__toggle">
            <span class="kkcp-password__hide" aria-label="${this._l10n('passwordHide')}"><i class="dashicons dashicons-hidden"></i></span>
            <span class="kkcp-password__show" aria-label="${this._l10n('passwordShow')}"><i class="dashicons dashicons-visibility"></i></span>
          </button>
        <# } else { #>
          ${tplInput}
        <# } #>
      </span>
    `
  }
}

export default wpApi.controlConstructor['kkcp_password'] = api.controls.Password = Password;
