import { api, wpApi } from '../core/globals';
import Utils from '../core/utils';

/**
 * Notification
 *
 * @since 1.0.0
 *
 * @memberof core
 * @class Notification
 * @extends wp.customize.Notification
 * @augments wp.customize.Class
 *
 * @requires Utils
 */
class Notification extends wpApi.Notification {

  /**
   * @since 1.1.0
   *
   * @override
   * @return {jQuery} Notification container element.
   */
  render () {
    var notification = this, container, data;
    if ( ! notification.template ) {
      // @note tweak is done here, template string instead of an id
      notification.template = Utils.template( this._tpl() );
    }
    data = _.extend( {}, notification, {
      alt: notification.parent && notification.parent.alt
    } );
    container = $( notification.template( data ) );

    if ( notification.dismissible ) {
      container.find( '.notice-dismiss' ).on( 'click keydown', function( event ) {
        if ( 'keydown' === event.type && 13 !== event.which ) {
          return;
        }

        if ( notification.parent ) {
          notification.parent.remove( notification.code );
        } else {
          container.remove();
        }
      });
    }

    return container;
  }

  /**
   * Template
   *
   * For now it's the same as the WordPress default one plus markdown support
   *
   * @since 1.1.0
   *
   * @memberof! controls.Base#
   * @access package
   *
   * @return {string}
   */
  _tpl () {
    return  `
      <li class="notice notice-{{ data.type || 'info' }} {{ data.alt ? 'notice-alt' : '' }} {{ data.dismissible ? 'is-dismissible' : '' }} {{ data.containerClasses || '' }} kkcp-notification" data-code="{{ data.code }}" data-type="{{ data.type }}">
        <# if (marked) { #>{{{ marked(data.message || data.code) }}}<# } else { #><div class="notification-message">{{{ data.message || data.code }}}</div><# } #>
        <# if ( data.dismissible ) { #>
          <button type="button" class="notice-dismiss"><span class="screen-reader-text"><?php esc_html( 'Dismiss' ) ?></span></button>
        <# } #>
      </li>
    `
  }
}

export default api.core.Notification = Notification;
