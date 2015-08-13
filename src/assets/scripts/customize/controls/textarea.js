/* global tinyMCE */

/**
 * Control Textarea class
 *
 * @constructor
 * @augments api.controls.BaseInput
 * @augments api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
wpApi.controlConstructor.pwpcp_textarea = api.controls.BaseInput.extend({
  /**
   * Validate
   *
   * @param  {string} newValue
   * @return {string} The new value if it is a string
   */
  validate: function (newValue) {
    if (_.isString(newValue)) {
      if (!this.params.allowHTML && !this.params.wp_editor) {
        return validator.escape(newValue);
      } else {
        return newValue;
      }
    } else {
      return { error: true };
    }
  },
  /**
   * On initialization
   *
   * Update input value if the setting is changed programmatically.
   * Use TyinMCE API if needed.
   *
   * @override
   */
  onInit: function () {
    this._setWpEditorId();
  },
  /**
   * Sync UI with value coming from API, a programmatic change like a reset.
   * @override
   * @param {string} value The new setting value.
   */
  syncUIFromAPI: function (value) {
    // here value can be undefined if it doesn't pass the validate function
    var lastValue;
    var wpEditorInstance;
    if (this.params.wp_editor) {
      wpEditorInstance = tinyMCE.get(this._wpEditorID);
      lastValue = wpEditorInstance.getContent();
    } else {
      lastValue = this.__input.value;
    }
    if (this.rendered && value && lastValue !== value) {
      if (this.params.wp_editor) {
        wpEditorInstance.setContent(value);
      } else {
        this.__input.value = value;
      }
    }
  },
  /**
   * On ready
   *
   * @override
   */
  ready: function () {
    this.__input = this._container.getElementsByTagName('textarea')[0];
    this.__inputFeedback = this._container.getElementsByClassName('pwpcp-input-feedback')[0];

    this._syncAndListen(); // method of parent class

    this._maybeInitWpEditor();
  },
  /**
   * Get textarea id, add a suffix and replace dashes with underscores
   * as suggested by WordPress Codex.
   *
   * @see https://codex.wordpress.org/Function_Reference/wp_editor -> $editor_id
   */
  _setWpEditorId: function () {
    this._wpEditorID = this.id.replace(/-/g, '_') + '_textarea';
  },
  /**
   * Maybe init wp_editor.
   *
   * In case it's needed we load by ajax the wp_editor. We put a promise
   * on our API root object. In this way all the textareas controls that
   * implements the wp_editor can read the status of the loading scripts
   * from the same place allowing us to require the js scripts only once.
   * We pass `load`: 1 to the ajax call to infrom the php function to load
   * the script only from this call (in fact we reuse the same php function
   * later on). Once loaded the response (with the needed scripts) is
   * prepended to the body and we get rid of the doubled `dashicons-css`
   * included in the response, which creates layout problems.
   */
  _maybeInitWpEditor: function () {
    // params.wp_editor can be either a boolean or an object with options
    if (this.params.wp_editor) {

      if (!api.tinyMCEload) {
        api.tinyMCEload = $.post(window.ajaxurl, {
          'action': 'pwpcp_load_wp_editor',
          'load': 1
        }, function (response) {
          $('body').prepend('<div id="pwpcp_tinymce_dummy" style="display:none">' + response + '</div>');
          // remove dashicons-css added by tinymce,
          // it interferes with the already loaded dashicons style
          $('#pwpcp_tinymce_dummy').find('#dashicons-css').remove();
        });
      }
      api.tinyMCEload.then(this._onTinymceAvailable.bind(this));
    }
  },
  /**
   * Callback executed once the wp_edito with TinyMCE has been loaded.
   * It sets an id on this control textarea then it does an ajax call
   * to retrieve the template needed for the wp_editor. If the template
   * has already been loaded it retrieves it from memory, doing so one
   * only ajax call per control.
   */
  _onTinymceAvailable: function () {
    // dynamically set id on textarea, then use it as a target for wp_editor
    var id = this._wpEditorID;
    this.__input.id = id;

    if (this._wpEditorTpl) {
      this._onWpEditorLoaded.bind(this);
    } else {
      $.post(window.ajaxurl, {
        'action': 'pwpcp_load_wp_editor',
        'id': id
      }, this._onWpEditorLoaded.bind(this));
    }
  },
  /**
   * Callback executed once the wp_editor has been loaded and the editor
   * template specific to this control id is available.
   *
   * @param  {?string} templateFromAjax The editor template from ajax or nothing
   *                                    when the template is already in memory.
   */
  _onWpEditorLoaded: function (templateFromAjax) {
    var template = this._wpEditorTpl || templateFromAjax;

    // save template on control object
    if (!this._wpEditorTpl) {
      // remove inline stylesheets, we don't need them again
      this._wpEditorTpl = template.replace(/<link.*\/>/g, '');
    }

    var setting = this.setting;

    $(this.__input).replaceWith(this._wpEditorTpl);

    // cast it always to an object
    var id = this._wpEditorID;
    // get wp_editor custom options defined by the developer through the php API
    var optionsCustom = _.isObject(this.params.wp_editor) ? this.params.wp_editor : {};
    // default wp_editor options
    var optionsDefaults = {
      menubar: false,
      toolbar1: 'styleselect,bold,italic,strikethrough,underline,blockquote,bullist,numlist,alignleft,aligncenter,alignright,undo,redo',
    };
    // merge the options
    var options = _.extend(optionsDefaults, optionsCustom);
    // then add the required options (the needed element id and setup callback
    // with our bindings to the WordPRess customize API)
    var optionsRequired = {
      mode: 'exact',
      elements: id,
      setup: function (editor) {
        editor.on('init', function () {
          // at a certain point it seemed that somehow we needed a timeout here,
          // without it it doesn't work. Now it works, but leave the comment here
          // for possible future problems.
          // setTimeout(function () {
          editor.setContent(setting());
          // }, 1000);
        });
        editor.on('change keyup', function () {
          setting.set(editor.getContent());
        });
      }
    };

    // tinyMCE.execCommand('mceAddEditor', true, id);

    // in this way we make sure the required options can't be overwritten
    // by developers when declaring wp_editor support through an array of opts
    tinyMCE.init(_.extend(options, optionsRequired));
  }
});