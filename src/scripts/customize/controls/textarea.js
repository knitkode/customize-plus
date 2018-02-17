import window from 'window';
import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
// import ControlBase from './base';

/**
 * Control Textarea class
 *
 * @class wp.customize.controlConstructor.kkcp_textarea
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
  validate: function (value) {
    return Validate.textarea([], value, this.setting, this);
  },
  /**
   * @override
   */
  sanitize: function (value) {
    return Sanitize.textarea(value, this.setting, this);
  },
  /**
   * @override
   */
  onInit: function () {
    if (this.params.wp_editor) {
      this._wpEditorID = this._getWpEditorId();
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
        if (this._wpEditorIsActive) {
          // window.tinyMCE.remove('#' + this._wpEditorID);
          window.wp.editor.remove(this._wpEditorID);
        }
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
      // lastValue = window.wp.editor.getContent(this._wpEditorID);;
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
    if (this.params.wp_editor && !this._wpEditorIsActive) {
      this._initWpEditor();
    } else {
      this._syncAndListen();
    }
  },
  /**
   * Get textarea id, add a suffix and replace dashes with underscores
   * as suggested by WordPress Codex.
   *
   * @see https://codex.wordpress.org/Function_Reference/wp_editor -> $editor_id
   */
  _getWpEditorId: function () {
    return `${this.id.replace(/-/g, '_')}__textarea`;
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
    // dynamically set id on textarea, then use it as a target for wp_editor
    this.__textarea.id = this._wpEditorID;

    const setting = this.setting;

    // get wp_editor custom options defined by the developer through the php API
    const optionsCustom = _.isObject(this.params.wp_editor) ? this.params.wp_editor : {};

    // set default options
    const optionsDefaults = $.extend(true, {}, window.wp.editor.getDefaultSettings(), {
      teeny: true,
      mediaButtons: false,
    });

    // merge the options adding the required options (the needed element id and
    // setup callback with our bindings to the WordPRess customize API)
    // in this way we make sure the required options can't be overwritten
    // by developers when declaring wp_editor support through an array of opts
    const options = $.extend(true, optionsDefaults, optionsCustom, {
      // elements: this.__textarea.id,
      tinymce: {
        target: this.__textarea,
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
      }
    });

    window.wp.editor.initialize(this._wpEditorID, options);

    this._wpEditorIsActive = true;
  }
});

export default wpApi.controlConstructor['kkcp_textarea'] = api.controls.Textarea = Control;
