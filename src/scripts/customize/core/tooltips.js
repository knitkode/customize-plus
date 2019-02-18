import $ from 'jquery';
import _ from 'underscore';
import { $document, body, $readyDOM } from './globals';

/**
 * Tooltips
 *
 * Manage tooltips using jQuery UI Tooltip
 *
 * @since 1.0.0
 * @access private
 *
 * @requires jQueryUI.Tooltip
 */
class Tooltips {

  constructor () {

    /**
     * @type {string}
     */
    this._BASE_CLASS = '.kkcpui-tooltip';

    /**
     * @type {Array<Object<string, string>>}
     */
    this._ALLOWED_POSITIONS = [{
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
     * @type {Object<string,boolean|string>}
     */
    this._DEFAULT_OPTIONS = {
      show: false,
      hide: false
    };

    // bootstraps on DOM ready
    $readyDOM.then(this._$onReady.bind(this));
  }

  /**
   * On DOM ready
   *
   * Init tooltips for each allowed position
   */
  _$onReady () {
    for (let i = this._ALLOWED_POSITIONS.length - 1; i >= 0; i--) {
      let custom = this._ALLOWED_POSITIONS[i];
      let options = _.defaults({
        items: `${this._BASE_CLASS}--${custom._name}`,
        classes: {
          'ui-tooltip': custom._name,
        },
        // @@tomonitor this option is deprecated since jQuery UI 1.12 and
        // replaced by the above option `classes`. WordPress has not updated
        // yet, @see http://api.jqueryui.com/tooltip/#option-classes \\
        tooltipClass: custom._name,
        position: custom._position
      }, this._DEFAULT_OPTIONS);

      // this should stay the same
      options.position.collision = 'flipfit';

      // init tooltip (it uses event delegation)
      // to have different tooltips positioning we need a different container
      // for each initialisation otherwise each overlap each other.
      custom._container.tooltip(options);
    }
  }
}

/**
 * @member {Object} tooltips
 * @memberof core
 * @description  Instance of {@linkcode Tooltips}
 */
const tooltips = new Tooltips();

export default tooltips
