/**
 * Control Multicheck
 *
 * @constructor
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
wpApi.controlConstructor.pwpcp_multicheck = api.controls.Base.extend({
  /**
   * Validate
   *
   * @param  {string|array} rawNewValue Value of the checkbox clicked or sent
   *                                    through js API
   * @return {string|object<string,boolean>} A JSONified Array
   */
  validate: function (rawNewValue) {
    var newValue;
    try {
      newValue = JSON.parse(rawNewValue);
    } catch(e) {
      newValue = rawNewValue;
      // console.warn('Control->Multicheck: Failed to parse a supposed-to-be JSON value', rawNewValue, e);
    }
    var params = this.params;
    var lastValueAsArray = JSON.parse(this.setting());
    /**
     * Validate string
     * @return {string}
     */
    var _validateString = function () {
      var index = lastValueAsArray.indexOf(newValue);

      // if the checkbox ticked was in the last value array remove it
      if (index !== -1) {
        lastValueAsArray.splice(index, 1);
      // otherwise push it
      } else {
        // only if it is an allowed choice...
        if (params.choices.hasOwnProperty(newValue)) {
          lastValueAsArray.push(newValue);
          // always sort it
          lastValueAsArray = this._getSortedValue(lastValueAsArray);
        }
      }
      return JSON.stringify(lastValueAsArray);
    }.bind(this);
    /**
     * Validate array
     * @return {string}
     */
    var _validateArray = function () {
      var validArray = [];
      for (var i = 0; i < newValue.length; i++) {
        // only if it is an allowed choice...
        if (params.choices.hasOwnProperty(newValue[i])) {
          validArray.push( newValue[i] );
        }
      }
      return JSON.stringify(validArray);
    };
    // check type and do appropriate validation
    if (_.isString(newValue)) {
      return _validateString();
    } else if(_.isArray(newValue)){
      return _validateArray();
    } else {
      return { error: true };
    }
  },
  /**
   * Sync UI with value coming from API, a programmatic change like a reset.
   * @override
   * @param {string} value The new setting value.
   */
  syncUIFromAPI: function (value) {
    if (this.rendered && value !== this._getValueFromUI()) {
      this._syncCheckboxes();

      if (this.params.sortable) {
        this._reorder();
      }
    }
  },
  /**
   * On ready
   *
   * @override
   */
  ready: function () {
    this.__inputs = this._container.getElementsByTagName('input');

    // special stuff for sortable multicheck controls
    if (this.params.sortable) {
      var self = this;
      var setting = self.setting;

      this.container.sortable({
        items: '> label',
        cursor: 'move',
        update: function (event, ui) {
          setting.set(self._getSortedValue(setting()));
        }
      });

      this._buildItemsMap();
    }

    // sync checked state on checkboxes on ready and bind (argument `true`)
    this._syncCheckboxes(true);
  },
  /**
   * Get current `setting` value from DOM
   * @return {string} JSONified array
   */
  _getValueFromUI: function () {
    var value = [];
    // read sortable jQuery UI data
    if (this.params.sortable) {
      var allSorted = this.container.sortable('toArray', { attribute: 'title' });
      for (var i = 0, l = allSorted.length; i < l; i++) {
        var key = allSorted[i];
        var input = this.__itemsMap[key]._input;
        if (input.checked) {
          value.push(key);
        }
      }
    // follow the order of the DOM
    } else {
      for (var i = 0, l = this.__inputs.length; i < l; i++) {
        var input = this.__inputs[i];
        if (input.checked) {
          value.push(input.value);
        }
      }
    }
    return JSON.stringify(value);
  },
  /**
   * Get sorted value
   * @return {array}
   */
  _getSortedValue: function (value) {
    var valueSorted = [];

    // read sortable jQuery UI data
    if (this.params.sortable) {
      var valueAsArray = _.isArray(value) ? value : JSON.parse(value);
      var sortedItems = this.container.sortable('toArray', { attribute: 'title' });
      for (var i = 0; i < sortedItems.length; i++) {
        if (valueAsArray.indexOf(sortedItems[i]) !== -1) {
          valueSorted.push(sortedItems[i]);
        }
      }
    // follow the order of the DOM
    } else {
      for (var i = 0, l = this.__inputs.length; i < l; i++) {
        var input = this.__inputs[i];
        if (input.checked) {
          valueSorted.push(input.value);
        }
      }
    }
    return valueSorted;
  },
  /**
   * @inherit
   */
  _buildItemsMap: function () {
    var items = this._container.getElementsByTagName('label');
    this.__itemsMap = {};

    for (var i = 0, l = items.length; i < l; i++) {
      this.__itemsMap[items[i].title] = {
        _sortable: items[i],
        _input: items[i].getElementsByTagName('input')[0]
      };
    }
  },
  /**
   * @inherit
   */
  _reorder: function () {
    // sort first the checked ones
    api.controls['Sortable'].prototype._reorder.apply(this);

    // then sort the unchecked ones
    var valueAsArray = JSON.parse(this.setting());
    for (var key in this.params.choices) {
      if (valueAsArray.indexOf(key) === -1) {
        var itemDOM = this.__itemsMap[key]._sortable;
        itemDOM.parentNode.removeChild(itemDOM);
        this._container.appendChild(itemDOM);
      }
    }
  },
  /**
   * Sync checkboxes and maybe bind change event
   * We need to be fast here, use vanilla js.
   *
   * @param  {boolean} bindAsWell Bind on change?
   */
  _syncCheckboxes: function (bindAsWell) {
    var valueAsArray = JSON.parse(this.setting());
    for (var i = 0, l = this.__inputs.length; i < l; i++) {
      var input = this.__inputs[i];
      input.checked = valueAsArray.indexOf(input.value) !== -1;
      if (bindAsWell) {
        input.onchange = function (event) {
          this.setting.set(event.target.value);
        }.bind(this);
      }
    }
  }
});