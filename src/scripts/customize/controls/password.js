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
        self.__text.value = this.value;
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
   * @return {[type]}
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
}

export default wpApi.controlConstructor['kkcp_password'] = api.controls.Password = Password;
