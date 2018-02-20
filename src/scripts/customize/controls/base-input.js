import $ from 'jquery';
import { api } from '../core/globals';
import Base from './base';

/**
 * Control Base Input class
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class controls.BaseInput
 *
 * @extends controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class BaseInput extends Base {

  /**
   * @override
   */
  syncUI (value) {
    if (value && this.__input.value !== value) {
      this.__input.value = value;
    }
  }

  /**
   * @override
   */
  ready () {
    const self = this;
    self.__input = self._container.getElementsByTagName('input')[0];

    // sync input and listen for changes
    $(self.__input)
      .val(self.setting())
      .on('change keyup paste', function () {
        self.setting.set(this.value);
      });
  }
}

export default api.controls.BaseInput = BaseInput;
