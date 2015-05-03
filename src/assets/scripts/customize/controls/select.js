/* global ControlBase */

/**
 * Control Select class
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
var ControlSelect = ControlBase.extend({
  /**
   * On ready
   *
   */
  ready: function (isForTheFirstTimeReady) {
    var params = this.params;
    var setting = this.setting;
    var select = this._container.getElementsByTagName('select')[0];
    var options = this._container.getElementsByTagName('option');
    /**
     * Sync options and maybe bind change event
     * We need to be fast here, use vanilla js.
     * We do a comparison with two equals `==`
     * because sometimes we want to compare `500` to `'500'`
     * (like in the font-weight dropdown) and return true from that.
     */
    var _syncOptions = function () {
      var value = params.value;
      for (var i = 0, l = options.length; i < l; i++) {
        var option = options[i];
        option.selected = value == option.value;
      }
    };

    // bind select on ready
    select.onchange = function () {
      var value = this.value;
      params.value = value;
      setting.set(value);
    };

    // sync selected state on options on ready
    _syncOptions();

    // if the setting is changed programmatically (i.e. through code)
    // update options status
    if (isForTheFirstTimeReady) {
      setting.bind(function (value) {
        params.value = value;
        _syncOptions();
      });
    }
  }
});

wpApi.controlConstructor['pwpcp_select'] = ControlSelect;
