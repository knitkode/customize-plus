import window from 'window';
import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';
import Validate from '../core/validate';
import Sanitize from '../core/sanitize';
import Text from './text';

/**
 * Control Textarea class
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_textarea`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Textarea
 *
 * @extends controls.Text
 * @augments controls.BaseInput
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 *
 * @requires Validate
 * @requires Sanitize
 * @requires tinyMCE
 */
class Textarea extends Text {

  /**
   * @override
   */
  componentInit () {
    if (this.params['wp_editor']) {
      this._wpEditorID = this._getWpEditorId();
    }
  }

  /**
   * @override
   */
  componentWillUnmount () {
    if (this.params['wp_editor']) {
      // it might be that this method is called too soon, even before tinyMCE
      // has been loaded, so try it and don't break.
      try {
        if (this._wpEditorIsActive) {
          // window.tinyMCE.remove('#' + this._wpEditorID);
          window.wp.editor.remove(this._wpEditorID);
        }
      } catch(e) {}
    }
  }

  /**
   * @override
   */
  shouldComponentUpdate ($value) {
    return $value !== this._getValueFromUI();
  }

  /**
   * @override
   */
  componentDidUpdate ($value) {
    this._updateUI($value);
  }

  /**
   * @override
   */
  componentDidMount () {
    this.__textarea = this._container.getElementsByTagName('textarea')[0];

    // params.wp_editor can be either a boolean or an object with options
    if (this.params['wp_editor'] && !this._wpEditorIsActive) {
      this._initWpEditor();
    } else {
      const self = this;

      this._updateUI(self.setting());

      $(self.__textarea).on('change keyup paste', function () {
        self.setting.set(this.value);
      });
    }
  }

  /**
   * Get value from UI
   *
   * @since   1.1.0
   * @memberof! controls.Textarea#
   * @access protected
   */
  _getValueFromUI () {
    if (this.params['wp_editor']) {
      const wpEditorInstance = window.tinyMCE.get(this._wpEditorID);
      return wpEditorInstance.getContent();
      // returnwindow.wp.editor.getContent(this._wpEditorID);;
    } else {
      return this.__textarea.value;
    }
  }

  /**
   * Update UI
   *
   * @since   1.1.0
   * @memberof! controls.Textarea#
   * @access protected
   *
   * @param {$value}
   */
  _updateUI ($value) {
    if (this.params['wp_editor']) {
      const wpEditorInstance = window.tinyMCE.get(this._wpEditorID);
      wpEditorInstance.setContent($value);
    } else {
      this.__textarea.value = $value;
    }
  }

  /**
   * Get textarea id, add a suffix and replace dashes with underscores
   * as suggested by WordPress Codex.
   *
   * @see https://codex.wordpress.org/Function_Reference/wp_editor -> $editor_id
   *
   * @since   1.0.0
   * @memberof! controls.Textarea#
   * @access protected
   */
  _getWpEditorId () {
    return `${this.id.replace(/-/g, '_')}__textarea`;
  }

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
   *
   * @since   1.0.0
   * @memberof! controls.Textarea#
   * @access protected
   */
  _initWpEditor () {
    // dynamically set id on textarea, then use it as a target for wp_editor
    this.__textarea.id = this._wpEditorID;

    const setting = this.setting;

    // get wp_editor custom options defined by the developer through the php API
    const optionsCustom = _.isObject(this.params['wp_editor']) ? this.params['wp_editor'] : {};

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

  /**
   * @override
   */
  _tpl() {
    return `
      <label>
        ${this._tplHeader()}<# var attrs = data.attrs; #>
        <textarea class="kkcpui-textarea<# if (data.wp_editor && data.wp_editor.editorClass) { #> {{ data.wp_editor.editorClass }}<# } #>"
          <# for (var key in attrs) { if (attrs.hasOwnProperty(key)) { #>{{ key }}="{{ attrs[key] }}" <# } } #>
          rows="<# if (data.wp_editor && data.wp_editor.textareaRows) { #>{{ data.wp_editor.textareaRows }}<# } else if (attrs && attrs.rows) { #>{{ attrs.rows }}<# } else { #>4<# } #>"
          <# if (data.wp_editor && data.wp_editor.editorHeight) { #> style="height:{{ data.wp_editor.editorHeight }}px"
        <# } #>>
        </textarea>
      </label>
    `
  }
}

export default wpApi.controlConstructor['kkcp_textarea'] = api.controls.Textarea = Textarea;
