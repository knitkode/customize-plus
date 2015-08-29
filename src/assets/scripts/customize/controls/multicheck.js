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
   * @override
   * @return {string|object<string,boolean>} A JSONified Array
   */
  validate: function (rawNewValue) {
    var newValue = rawNewValue;
    // in case the value come from a reset action it is a json
    // string (as it is saed in the db) so we need to parse it
    try {
      newValue = JSON.parse(rawNewValue);
    } catch(e) {}
    if(_.isArray(newValue)) {
      var validArray = [];
      for (var i = 0; i < newValue.length; i++) {
        // only if it is an allowed choice...
        if (this.params.choices.hasOwnProperty(newValue[i])) {
          validArray.push( newValue[i] );
        }
      }
      return JSON.stringify(validArray);
    } else {
      return { error: true };
    }
  },
  /**
   * @override
   */
  syncUIFromAPI: function (value) {
    if (value !== this._getValueFromUI(true)) {
      this._syncCheckboxes();

      if (this.params.sortable) {
        this._reorder();
      }
    }
  },
  /**
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
        update: function () {
          setting.set(self._getValueFromUI());
        }
      });

      this._buildItemsMap();
    }

    // sync checked state on checkboxes on ready and bind (argument `true`)
    this._syncCheckboxes(true);
  },
  /**
   * @override
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
   * @override
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
   * Get sorted value, reaading checkboxes status from the DOM
   *
   * @param {boolean} jsonize Whether to stringify the array or not
   * @return {array|JSONized array}
   */
  _getValueFromUI: function (jsonize) {
    var valueSorted = [];
    for (var i = 0, l = this.__inputs.length; i < l; i++) {
      var input = this.__inputs[i];
      if (input.checked) {
        valueSorted.push(input.value);
      }
    }
    return jsonize ? JSON.stringify(valueSorted) : valueSorted;
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
          this.setting.set(this._getValueFromUI());
        }.bind(this);
      }
    }
  }
});
