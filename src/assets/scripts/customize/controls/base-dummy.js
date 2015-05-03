/* exported: ControlBaseDummy */

/**
 * Control Base Dummy class
 *
 * It extend the WP Control class from the API
 * and simplify it for rendering pieces of DOM that are not
 * interactive, like dividers or explanations.
 *
 * Look at wp-admin/js/customize-controls.js#732
 *
 * The following code, beside the small custom part (see comments)
 * has been copy pasted from the WordPress file and just commented
 * out of the unnecessary parts. We keep the commented code here
 * 'cause it will make it easier in the future to see what is the
 * difference with WordPress original `Control.initialize` method.
 *
 * Below we also override, making them empty, some methods that
 * the dummy control don't need.
 *
 * @constructor
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
var ControlBaseDummy = api.Control.extend({
  initialize: function( id, options ) {
    var control = this;

    control.params = {};
    $.extend( control, options || {} );
    control.id = id;
    // control.selector = '#customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
    control.templateSelector = 'customize-control-' + control.params.type + '-content';
    // control.params.content ? $( control.params.content ) : $( control.selector );
    control.deferred = {
      embedded: new $.Deferred()
    };
    control.section = new api.Value();
    control.priority = new api.Value();
    control.active = new api.Value();


    /**
     * Custom code
     * let's keep it simple, keep the following code here in the initialization method
     */
    // always priority ten is just fine, no need to check
    // if we have passed it in the params
    control.priority.set(10);

    // the wrapper for this control can always be the same, we create it
    // in javascript instead of php, where we can therefore override
    // `protected function render() {}` with an empty output (see
    // PWPcp_Customize_Control_Dummy php class). This remove the unnecessary
    // presence of the <li> micro template in the _wpCustomizeSettings JSON.
    // In addition the type of control is printed as a class name.
    control.container = $('<li class="customize-control customize-control-PWPcp_dummy ' + control.params.type + '"></li>');

    // delete setting, unfortunately we need to create to make this fake control work.
    // We do it through the PWPcp_Customize_Setting_Dummy php class.
    try {
      delete api.settings.settings[this.id];
    } catch(err) {};
    /* end custom code */


    control.activeArgumentsQueue = [];

    control.active.bind( function ( active ) {
      var args = control.activeArgumentsQueue.shift();
      args = $.extend( {}, control.defaultActiveArguments, args );
      control.onChangeActive( active, args );
    } );

    control.section.set( control.params.section );
    // control.priority.set( isNaN( control.params.priority ) ? 10 : control.params.priority );
    control.active.set( control.params.active );

    control.embed();

    control.deferred.embedded.done( function () {
      control.ready();
    });
  },
  /**
   * Override the unneded dropdownInit method
   */
  dropdownInit: function() {}
});

api.controlConstructor['PWPcp_dummy'] = ControlBaseDummy;