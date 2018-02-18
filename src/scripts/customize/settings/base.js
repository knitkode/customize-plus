import $ from 'jquery';
import _ from 'underscore';
import { api, wpApi } from '../core/globals';

/**
 * Setting Base class
 *
 * @see PHP class KKcp_Customize_Setting_Base.
 * @since  1.0.0
 *
 * @class api.setting.Base
 * @extends wp.customize.Setting
 * @augments wp.customize.Value
 * @augments wp.customize.Class
 */
api.settings.Base = wpApi.Setting.extend({
	/**
	 * {@inheritDoc}. Sanitize value before sending it to the preview via
	 * `postMessage`.
	 *
	 * @since 1.0.0
	 * @override
	 */
	preview: function() {
		var setting = this, transport;
		transport = setting.transport;

		if ( 'postMessage' === transport && ! wpApi.state( 'previewerAlive' ).get() ) {
			transport = 'refresh';
		}

		if ( 'postMessage' === transport ) {
			// we just add here a sanitization method
			setting.previewer.send( 'setting', [ setting.id, this.sanitize(setting()) ] );
		} else if ( 'refresh' === transport ) {
			setting.previewer.refresh();
		}
	},
	/**
	 * Sanitize setting
	 *
	 * This is here to allow controls to define a sanitization method before then
	 * the setting value is sent to the preview via `postMessage`
	 *
	 * @abstract
	 * @param  {mixed} value
	 * @return {mixed}
	 */
	sanitize: function (value) {
		return value;
	}
});

export default wpApi.settingConstructor['kkcp_base'] = api.settings.Base;
