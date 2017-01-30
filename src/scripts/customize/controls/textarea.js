import $ from 'jquery';
import _ from 'underscore';
import { api } from '../core/api';
import { wpApi } from '../core/globals';
// import ControlBase from './base';

/**
 * Control Textarea class
 *
 * @class wp.customize.controlConstructor.pwpcp_textarea
 * @constructor
 * @extends api.controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 * @requires tinyMCE
 */
let Control = api.controls.Base.extend({
  /**
   * @override
   */
  sanitize: function (newValue) {
    if (!this.params.allowHTML && !this.params.wp_editor) {
      return _.escape(newValue);
    } else {
      return newValue;
    }
  },
  /**
   * @override
   */
  validate: function (newValue) {
    // @@todo block here if it contains html, otherwise the textarea get crazy
    // escaping it while you type \\
    if (_.isString(newValue)) {
      return newValue;
    } else {
      return { error: true };
    }
  },
  /**
   * @override
   */
  onInit: function () {
    if (this.params.wp_editor) {
      this._setWpEditorId();
    }
  },
  /**
   * Destroy tinyMCE instance
   * @override
   */
  onDeflate: function () {
    if (this.params.wp_editor) {
      // it might be that this method is called too soon, even before tinyMCE
      // has been loaded, so try it and don't break.
      try {
        window.tinyMCE.remove('#' + this._wpEditorID);
      } catch(e) {}
    }
  },
  /**
   * @override
   */
  syncUI: function (value) {
    var lastValue;
    var wpEditorInstance;
    if (this.params.wp_editor) {
      wpEditorInstance = window.tinyMCE.get(this._wpEditorID);
      lastValue = wpEditorInstance.getContent();
    } else {
      lastValue = this.__textarea.value;
    }
    if (value && lastValue !== value) {
      // additional check to prevent the textarea content to be escaped
      // while you type if html is not allowed
      if (!this.params.allowHTML && !this.params.wp_editor
          && _.escape(lastValue) === value) {
        return;
      }
      if (this.params.wp_editor) {
        wpEditorInstance.setContent(value);
      } else {
        this.__textarea.value = value;
      }
    }
  },
  /**
   * @override
   */
  ready: function () {
    this.__textarea = this._container.getElementsByTagName('textarea')[0];

    // params.wp_editor can be either a boolean or an object with options
    if (this.params.wp_editor) {
      this._initWpEditor();
    } else {
      this._syncAndListen();
    }
  },
  /**
   * Sync textarea and listen for changes
   */
  _syncAndListen: function () {
    var self = this;
    $(self.__textarea)
      .val(self.setting())
      .on('change keyup paste', function () {
        self.setting.set(this.value);
      });
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
  _initWpEditor: function () {
    if (!api.tinyMCEload) {
      api.tinyMCEload = $.post(window.ajaxurl, {
        'action': 'PWPcp/utils/load_wp_editor',
        'load': 1
      }, function (response) {
        $('body').prepend('<div id="pwpcp_tinymce_dummy" style="display:none">' + response + '</div>');
        // remove dashicons-css added by tinymce,
        // it interferes with the already loaded dashicons style
        $('#pwpcp_tinymce_dummy').find('#dashicons-css').remove();
      });
    }
    api.tinyMCEload.then(this._onTinymceAvailable.bind(this));
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
    this.__textarea.id = id;

    if (this._wpEditorTplInjected) {
      this._initTinyMCE();
    } else {
      $.post(window.ajaxurl, {
        'action': 'PWPcp/utils/load_wp_editor',
        'id': id
      }, this._onWpEditorLoaded.bind(this));
    }
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
   * Callback executed once the wp_editor has been loaded and the editor
   * template specific to this control id is available.
   *
   * @param  {?string} template The editor template from ajax or nothing when
   *                            the template is already in memory.
   */
  _onWpEditorLoaded: function (template) {
    // bail if we have already injected the template
    if (this._wpEditorTplInjected) {
      return;
    }
    // remove inline stylesheets, we don't need them again
    var templateCleaned = template.replace(/<link.*\/>/g, '');

    $(this.__textarea).replaceWith(templateCleaned);

    this._wpEditorTplInjected = true;

    this._initTinyMCE();
  },
  /**
   * Initialize tinymce on textarea
   */
  _initTinyMCE: function () {
    var setting = this.setting;
    var id = this._wpEditorID;
    // get wp_editor custom options defined by the developer through the php API
    var optionsCustom = _.isObject(this.params.wp_editor) ? this.params.wp_editor : {};
    // default wp_editor options
    var optionsDefaults = {
      menubar: false,
      toolbar1: 'styleselect,bold,italic,strikethrough,underline,blockquote,'
       + 'bullist,numlist,alignleft,aligncenter,alignright,undo,redo',
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

    // in this way we make sure the required options can't be overwritten
    // by developers when declaring wp_editor support through an array of opts
    window.tinyMCE.init(_.extend(options, optionsRequired));
  }
});

export default wpApi.controlConstructor['pwpcp_textarea'] = api.controls.Textarea = Control;
