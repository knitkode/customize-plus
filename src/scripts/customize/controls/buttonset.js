import { api, wpApi } from '../core/globals';
import BaseRadio from './base-radio';

/**
 * Control Buttonset
 *
 * Accessible globally on `wp.customize.controlConstructor.kkcp_buttonset`
 *
 * @since  1.0.0
 *
 * @memberof controls
 * @class Buttonset
 *
 * @extends controls.BaseRadio
 * @augments controls.BaseChoices
 * @augments controls.Base
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
class Buttonset extends BaseRadio {

	/**
	 * Always show tooltips.
	 *
	 * @since 1.1.0
	 * @override
	 */
	_tplChoiceUi () {
		return `
			<input id="{{ id }}" type="radio" value="{{ val }}" name="_customize-kkcp_buttonset-{{ data.id }}">
			<label class="{{ classes }} kkcpui-tooltip--top" {{ attributes }} title="{{ tooltip }}" for="{{ id }}" onclick="">{{ label }}</label>
		`
	}

	/**
	 * @since 1.1.0
	 * @override
	 */
	_tplAboveChoices () {
		return `
			<div class="switch-toggle kkcpui-switch switch-{{ _.size(choices) }}">
		`
	}

	/**
	 * @since 1.1.0
	 * @override
	 */
	_tplBelowChoices () {
		return `
			<a></a>
			</div>
		`
	}
}

wpApi.controlConstructor['kkcp_buttonset'] = api.controls.Buttonset = Buttonset;
