/**
 * Control Base Dummy class
 *
 * It extend the WP Control class from the API and simplify it for rendering
 * pieces of DOM that are not interactive, like dividers or explanations. The
 * following code, beside the small custom part (see comments) has been copy
 * pasted from the WordPress file and just commented out of the unnecessary
 * parts. We keep the commented code here 'cause it will make it easier in the
 * future to see what is the difference with the original `Control.initialize`
 * method.
 *
 * @see wp-admin/js/customize-controls.js#732
 *
 * @class wp.customize.controlConstructor.pwpcp_dummy
 * @alias api.controls.Dummy
 * @constructor
 * @extends wp.customize.Control
 * @augments wp.customize.Class
 */
wpApi.controlConstructor.pwpcp_dummy = api.controls.Dummy = wpApi.Control.extend({
  /**
   * @override
   */
  initialize: function (id, options) {
    var control = this;
    // var settings;

    control.params = {};
    $.extend(control, options || {});
    control.id = id;
    // control.selector = '#customize-control-' + id.replace( /\]/g, '' )
    //  .replace( /\[/g, '-' );
    control.templateSelector = 'customize-control-' + control.params.type + '-content';
    // control.params.content ? $( control.params.content ) : $( control.selector );
    control.deferred = {
      embedded: new $.Deferred()
    };
    control.section = new wpApi.Value();
    control.priority = new wpApi.Value();
    control.active = new wpApi.Value();
    control.activeArgumentsQueue = [];

    /**
     * Custom code
     * let's keep it simple, keep the following code here in the initialization method
     */

    // build a fake setting object, just to don't break normal API usage like
    // looping through all `wp.customize.controls` and bind each `control.setting`
    control.settings = control.params.settings = control.setting = {
      bind: function () {}
    };

    // always priority ten is just fine, no need to check
    // if we have passed it in the params
    control.priority.set(10);

    // the wrapper for this control can always be the same, we create it in js
    // instead of php, where we can therefore override `protected function
    // render() {}` with an empty output (see PWPcp_Customize_Control_Dummy
    // php class). This remove the unnecessary presence of the `<li>` micro
    // template in the _wpCustomizeSettings JSON.
    // In addition the type of control is printed as a class name.
    control.container = $('<li class="customize-control customize-control-pwpcp_dummy '
      + control.params.type + '"></li>');

    // delete setting, unfortunately we need to create to make this fake control work.
    // We do it through the PWPcp_Customize_Setting_Dummy php class.
    try {
      delete wpApi.settings.settings[this.id];
    } catch(e) {
      console.warn('Control->Dummy->initialize: failed to delete dummy setting', e);
    }
    /* end custom code */

    control.active.bind(function (active) {
      var args = control.activeArgumentsQueue.shift();
      args = $.extend({}, control.defaultActiveArguments, args);
      control.onChangeActive(active, args);
    } );

    control.section.set(control.params.section);
    // control.priority.set( isNaN( control.params.priority ) ? 10 : control.params.priority );
    control.active.set(control.params.active);

    wpApi.utils.bubbleChildValueChanges(control, ['section', 'priority', 'active']);

    // // Associate this control with its settings when they are created
    // settings = $.map( control.params.settings, function( value ) {
    //   return value;
    // });
    // wpApi.apply( wpApi, settings.concat( function () {
    //   var key;
    //   control.settings = {};
    //   for ( key in control.params.settings ) {
    //     control.settings[ key ] = wpApi( control.params.settings[ key ] );
    //   }
    //   control.setting = control.settings['default'] || null;
    //   control.embed();
    // }) );

    // // embed controls only when the parent section get clicked to keep the DOM light,
    // // to make this work all data can't be stored in the DOM, which is good
    // wpApi.section(control.section.get(), function (section) {
    //   section.expanded.bind(function (expanded) {
    //     if (expanded) {
    //       control.embed();
    //     }
    //   });
    // });

    control.embed();

    control.deferred.embedded.done(function () {
      control.ready();
    });
  }
});
