/* global ControlBase, Utils */

/**
 * Control Color class
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires Utils
 */
var ControlColor = ControlBase.extend({
  /**
   * Validate
   *
   * @param {*} value The value to validate.
   * @return {string} The validated control value.
   */
  _validate: function (value) {
    if (
      (!this.params.disallowTransparent && value === 'transparent') ||
      validator.isHexColor( value ) ||
      (this.params.allowAlpha && validator.isRgbaColor( value ))
    ) {
      return value;
    }
  },
  /**
   * On initialization:
   * add custom validation function overriding the empty function from WP API
   * add rgba validation if alpha is allowed
   *
   * @override
   */
  onInit: function () {
    this.setting.validate = this._validate.bind(this);

    // bind setting change to pass value on apply value
    // if we are programmatically changing the control value
    // for instance through js (during import, debugging, etc.)
    this.setting.bind(function (value) {
      this._apply(value, 'API'); // @@todo \\
    }.bind(this));
  },
  /**
   * On deflate
   *
   * Destroy `spetrum` instances if any.
   *
   * @override
   */
  onDeflate: function () {
    if (this.$picker && this.rendered) {
      this.$picker.spectrum('destroy');
    }
  },
  /**
   * On ready
   *
   * @override
   */
  ready: function () {
    var self = this;
    /** @type {HTMLelement} */
    var container = this._container;
    /** @type {HTMLelement} */
    var btnCustom = container.getElementsByClassName('pwpcpui-toggle')[0];

    /** @type {jQuery} */
    this.$picker = $(container.getElementsByClassName('pwpcpcolor-input')[0]);
    /** @type {HTMLelement} */
    this.preview = container.getElementsByClassName('pwpcpcolor-current-overlay')[0];
    /** @type {HTMLelement} */
    this.expander = container.getElementsByClassName('pwpcp-expander')[0];

    self._applyOnUIpreview(self.setting());


    var isOpen = false;
    var pickerIsInitialized = false;
    btnCustom.onclick = function() {
      isOpen = !isOpen;

      // initialize only once
      if (!pickerIsInitialized) {
        self.$picker.spectrum(Utils.getSpectrumOpts(self, {
          containerClassName: 'pwpcp-expandable'
        }));
        pickerIsInitialized = true;
      }

      // and toggle
      if (isOpen) {
        self.$picker.spectrum('show');
        this.classList.add('expanded');
        self.expander.classList.add('pwpcp-expanded');
      } else {
        self.expander.classList.remove('pwpcp-expanded');
        this.classList.remove('expanded');
        self.$picker.spectrum('hide');
      }
      return false;
    };
  },
  /**
   * Apply on UI preview (the color box on the left hand side)
   * @param  {string} newColor
   */
  _applyOnUIpreview: function (newColor) {
    this.preview.style.background = newColor;
  },
  /**
   * Apply on UI control (the spectrum color picker)
   */
  _applyOnUIcontrol: function (newColor) {
    this.$picker.spectrum('set', newColor);
  },
  /**
   * Apply, wrap the `setting.set()` function
   * doing some additional stuff.
   *
   * @private
   * @param  {string} value
   * @param  {string} from  Where the value come from (could be from the UI:
   *                        picker, dynamic fields, expr field) or from the
   *                        API (on programmatic value change).
   */
  _apply: function (value, from) {

    this.params.valueCSS = value;

    if (this.rendered) {
      this._applyOnUIpreview(value);

      if (from === 'API') {
        this._applyOnUIcontrol(value);
      }
    }

    if (from !== 'API') {
      // set new value
      this.setting.set(value);
    }
  }
});

// export to our API and to WordPress API
api['controls']['Color'] = wpApi['controlConstructor']['pwpcp_color'] = ControlColor;
