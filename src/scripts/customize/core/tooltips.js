import $ from 'jquery';
import _ from 'underscore';
import { api, $document, body, $readyDOM } from './globals';

/**
 * Tooltips
 *
 * Manage tooltips using jQuery UI Tooltip
 *
 * @class api.core.Tooltips
 * @requires jQueryUI.Tooltip
 */
var Tooltips = (function () {

  /**
   * @const
   * @type {string}
   */
  var BASE_CLASS = '.kkcpui-tooltip';

  /**
   * @const
   * @type {Array<Object<string, string>>}
   */
  var ALLOWED_POSITIONS = [{
    _name: 'top',
    _container: $document,
    _position: {
      my: 'center bottom-2',
      at: 'center top-5'
    }
  }, {
    _name: 'bottom',
    _container: $(body),
    _position: {
      my: 'center top+2',
      at: 'center bottom+5'
    }
  }];

  /**
   * @const
   * @type {Object<string,boolean|string>}
   */
  var DEFAULT_OPTIONS = {
    show: false,
    hide: false
  };

  /**
   * Init tooltips for each allowed position
   */
  function _init () {
    for (var i = ALLOWED_POSITIONS.length - 1; i >= 0; i--) {
      var custom = ALLOWED_POSITIONS[i];
      var options = _.defaults({
        items: BASE_CLASS + '--' + custom._name,
        classes: {
          'ui-tooltip': custom._name,
        },
        // @@tomonitor this option is deprecated since jQuery UI 1.12 and
        // replaced by the above option `classes`. WordPress has not updated
        // yet, @see http://api.jqueryui.com/tooltip/#option-classes \\
        tooltipClass: custom._name,
        position: custom._position
      }, DEFAULT_OPTIONS);

      // this should stay the same
      options.position.collision = 'flipfit';

      // init tooltip (it uses event delegation)
      // to have different tooltips positining we need a different container
      // for each initialisation otherwise each overlap each other.
      custom._container.tooltip(options);
    }
  }

  // @access public
  return {
    init: _init
  };
})();

$readyDOM.then(Tooltips.init.bind(Tooltips));

// export to public API
export default api.core.Tooltips = Tooltips;
