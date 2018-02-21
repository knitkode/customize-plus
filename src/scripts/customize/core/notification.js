import { api, wpApi } from '../core/globals';

/**
 * Notification
 *
 * @since 1.0.0
 *
 * @memberof core
 * @class Notification
 * @extends wp.customize.Notification
 * @augments wp.customize.Class
 */
class Notification extends wpApi.Notification {

	constructor (code, params) {
		params.templateId = 'customize-notification-kkcp';

		super.initialize(code, params);
	}
}

export default api.core.Notification = Notification;
