/* global ControlBase, Preprocessor, Expr */

/**
 * Control Size class
 *
 * @constructor
 * @augments ControlBase
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires Preprocessor, Expr
 */
var ControlSize = ControlBase.extend({
  /**
   * On deflate
   *
   * Destroy `atwho` instances if any.
   *
   * @override
   */
  onDeflate: function () {
    // if (this.params.expr) {
      this.container.find('.k6-expr-input').atwho('destroy');
    // }
  },
  /**
   * @inheritDoc
   */
  ready: function (isForTheFirstTimeReady) {
    var params = this.params;
    var setting = this.setting;
    /** @type {ExprOptions} */
    var exprOptions = {
      vars: Preprocessor.varsSize,
      varsLookup: Preprocessor.varsSizeLookup,
      functions: Preprocessor.functionsSize,
      value: setting(),
      onSet: function (value) {
        params.expr = value;
        setting.set(value);
      }
    };
    var inputExpr = new Expr(exprOptions, this._container);

    // if the setting is changed programmatically (i.e. through code)
    // update input value
    if (isForTheFirstTimeReady) {
      setting.bind(function (value) {
        params.expr = value;
        inputExpr.value = value;
      });
    }
  }
});

api.controlConstructor['k6_size'] = ControlSize;
