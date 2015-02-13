/* global ControlBase, Tabs */

/**
 * Control Layout Columns
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires Tabs
 */
var ControlLayoutColumns = ControlBase.extend({
  /**
   * Set sidebar mode ('less', 'left', 'right', 'both').
   *
   * @param {string} newMode The `'sideb ar' theme_mod` value
   */
  _setMode: function (newMode) {
    this.params.mode = newMode;
    if (this.rendered) {
      this._reinitSliders();
      // hide control if is fullwidth (a `sidebars less` layout)
      if (newMode === 'less') { // k6tobecareful name tight to specific control value \\
        this.container.slideUp();
      } else {
        this.container.slideDown();
      }
    }
  },
  /**
   * Set columns
   *
   * Set the number of columns in the grid system
   * and take the last value and update it proportionally
   * based on the new number of columns changed through
   * the other control.
   * @param {number} newColumns The `'grid-columns' theme_mod` value
   */
  _setColumns: function (newColumns) {
    var newValue = this._getValueWithNewColumns(this.params.value, newColumns);
    this.params.columns = newColumns;
    // wp api method
    this.setting.set(newValue);
    if (this.rendered) {
      this._reinitSliders();
    }
  },
  /**
   * Get new value passing the old one and the new or current number of columns
   *
   * @param  {Object} oldValue   The last control value object
   * @param  {number} newColumns Number of columns of the grid system
   * @return {Object}            The new control value
   */
  _getValueWithNewColumns: function (oldValue, newColumns) {
    var value = {};
    // at first level loop through sidebar's modes ('less', 'left', 'right', 'both')
    for (var sidebarMode in oldValue) {
      var perModeSizes = oldValue[sidebarMode];
      value[sidebarMode] = {};
      // per each sidebar mode loop through screen sizes and build new array
      for (var screenSize in perModeSizes) {
        var columnsSizes = perModeSizes[screenSize];
        var newColumnsSizes = [];
        var oldColumns = 0;
        // first count the amount of columns previously active
        for (var i = 0, l = columnsSizes.length; i < l; i++) {
          oldColumns = oldColumns + columnsSizes[i];
        }
        // then loop again and proportionally recalculate each column size
        for (var j = 0, k = columnsSizes.length; j < k; j++) {
          newColumnsSizes.push( Math.round((columnsSizes[j] * newColumns) / oldColumns) );
        }
        value[sidebarMode][screenSize] = newColumnsSizes;
      }
    }
    return value;
  },
  /**
   * Create slider
   *
   * Set some common options and merge them with each 'screen size based' slider
   * additional options. Then initialize sliders with jQuery UI and Pips plugin.
   *
   * @param  {HTMLelement} element The slider element
   */
  _createSlider: function (element) {
    var self = this;
    var params = this.params;
    var screenName = element.getAttribute('data-screen');
    /**
     * Get and parse the new control value from the slider input.
     *
     * The slider value on `slide` event need to be calculated
     * up to the current number of columns and the according to each
     * sidebar mode.
     *
     * @param  {jQuery} slider     The slider `ui` object // k6todo (type
     *                                  here should be jQueryUI slide)
     * @param  {string} screenName The screen name (`xs`, `sm`, `md`, `lg`)
     * @return {Object}            The recalculated slider value
     */
    var _getValueFromSlider = function (slider) {
      var sliderValue = slider.value;
      var columns = params.columns;
      var mode = params.mode;
      var value = params.value;
      var screenValue = value[mode][screenName];

      if (mode === 'left') {
        screenValue[0] = sliderValue;
        screenValue[1] = columns - sliderValue;
      } else if (mode === 'right') {
        screenValue[1] = sliderValue;
        screenValue[2] = columns - sliderValue;
      } else if (mode === 'both') {
        var sliderValues = slider.values;
        screenValue[0] = sliderValues[0];
        screenValue[1] = sliderValues[1] - sliderValues[0];
        screenValue[2] = columns - sliderValues[0] - (sliderValues[1] - sliderValues[0]);
      }
      value[mode][screenName] = screenValue;
      return value;
    };
    /**
     * Get slider additional options.
     *
     * Get `range` and `value` options for each 'screen size based'
     * slider based on which sidebar mode is active.
     *
     * @param  {string} screenName The screen name (`xs`, `sm`, `md`, `lg`)
     * @return {Object}            Slider additional Options
     */
    var _getSliderOpts = function () {
      var options = {};
      var mode = params.mode;
      var screenValue = params.value[mode][screenName];
      if (mode === 'left') {
        options.range = 'min';
        options.value = screenValue[0];
      } else if (mode === 'right') {
        options.range = 'max';
        options.value = screenValue[1];
      } else if (mode === 'both') {
        options.values = [screenValue[0], (screenValue[0] + screenValue[1])];
        options.range = true;
      }
      return options;
    };
    /**
     * Common (shared) slider options
     *
     * @type {Object}
     */
    var commonOpts = {
      min: 0,
      max: params.columns,
      step: 1,
      slide: function(event, ui) {
        // wp api method
        self.setting.set(_getValueFromSlider(ui));
      }
    };
    var options = $.extend(commonOpts, _getSliderOpts());
    $(element).slider(options).slider('pips');// .slider('float');
  },
  /**
   * Reinitialize all sliders.
   *
   */
  _reinitSliders: function () {
    var sliders = this.sliders;
    for (var i = 0, l = sliders.length; i < l; i++) {
      var sliderEl = sliders[i];
      var $sliderEl = $(sliderEl);
      // if there is already a jquery ui slider instance first destroy it
      if ($sliderEl.slider('instance')) {
        $sliderEl.slider('destroy');
      }
      this._createSlider(sliderEl);
    }
  },
  /**
   * Validate
   *
   * @param  {string} newValue Value of the checkbox clicked
   * @return {string} A JSONified Array
   */
  _validate: function (newValue) { // k6todo should we do some sort of validation? \\
    var value;
    // in case of reset what gets here is an object,
    // which is based on the default number of `grid-columns`,
    // but since this may have been changed meanwhile we need to
    // check that the amount of column's sizes per screen size is
    // equal to the current number of `grid-columns`
    if (typeof newValue === 'string') {
      value = {};
      var newValueParsed = JSON.parse(newValue);
      if (!newValueParsed) {
        return;
      }
      value = this._getValueWithNewColumns(newValueParsed, this.params.columns);
    } else {
      value = newValue;
    }
    this.params.value = value;
    return JSON.stringify(value);
  },
  /**
   * On initialization
   *
   * add custom validation function overriding the empty function from WP API
   * and bind dependent control values (we need to wait the WP API to be ready for that)
   *
   */
  onInit: function () {
    var self = this;

    this.setting.validate = this._validate.bind(this);

    api.bind('ready', function () {
      // listen to 'sidebar mode' changes
      api('sidebar').bind(function (value) { // k6tobecareful name tight to specific control ID \\
        self._setMode(value);
      });

      // listen to 'columns number' changes
      api('grid-columns').bind(function (value) { // k6tobecareful name tight to control ID \\
        self._setColumns(value);
      });
    });
  },
  /**
   * On ready
   *
   */
  ready: function() {
    var sliders = this._container.getElementsByClassName('k6-slider');
    this.sliders = sliders;

    // sync screen picker tabs size on ready
    Tabs.syncSize(this.container);

    // on ready we hide the container immediately instead of sliding up
    // if we have a 'sidebar less' layout
    if (this.params.mode === 'less') {
      this._container.style.display = 'none';
    }

    // init the sliders
    for (var i = 0, l = sliders.length; i < l; i++) {
      this._createSlider(sliders[i]);
    }
  }
});

api.controlConstructor['k6_layout_columns'] = ControlLayoutColumns;