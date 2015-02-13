/* global $ */

/**
 * Temp
 *
 * Temporary js to inject at the bottom
 */
// api.bind( 'ready', function() {
//   console.log('wp API ready'); // k6debugjs \\
// });
// api.bind( 'save', function() {
//   console.log('wp API saving ...'); // k6debugjs \\
// });
// api.bind( 'saved', function() {
//   console.log('wp API saved !'); // k6debugjs \\
// });
// api.bind( 'activated', function() {
//   console.log('wp API activated ????'); // k6debugjs \\
// });

// // from: https://make.wordpress.org/core/2014/10/27/toward-a-complete-javascript-api-for-the-customizer/
// api.section.each(function ( section ) {
//   if ( ! section.panel() ) {
//     section.expand({ allowMultiple: true });
//   }
// });
//


/**
 * Tests, snippets to use in the JS Console when developing the Customize
 *
 */
// var dirtyCustomized = {};
// wp.customize.each( function ( value, key ) {
//   if ( value._dirty ) {
//     dirtyCustomized[ key ] = value();
//   }
// });
// console.log('changed (dirty) options: (' + Object.keys(dirtyCustomized).length + ') ', dirtyCustomized)

// 'total number of options: ' + _.uniq(Object.keys(wp.customize.get())).length


/**
 * Create Control on the fly
 *
 * Taken from wp/admin/js/customize-controls.js#L2042
 *
 */
// function createControl (id, data) {
//   var constructor = api.controlConstructor[data.type] || api.Control;
//   var control = new constructor(id, {
//     params: data,
//     previewer: api.previewer
//   });
//   api.control.add(id, control);
// }

// window.k6toTryID = 'control_added_onthefly';
// window.k6toTryData = {
//   "settings": {
//     "default": "control_added_onthefly"
//   },
//   "type": "k6_input",
//   "priority": 10,
//   "active": true,
//   "section": "footer",
//   "content": "<li id=\"\" class=\"customize-control customize-control\">asds<\/li>",
//   "label":"Button Primary",
//   "description":"Style of the primary buttons",
//   "instanceNumber": 60
// }
// // createControl(toTryID, toTryData);
// window.K6.createControl = createControl;
