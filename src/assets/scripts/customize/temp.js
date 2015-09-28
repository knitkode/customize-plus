/**
 * Temp
 *
 * Temporary js to inject
 */
// if (DEBUG) {
//   wpApi.bind('ready', function() {
//     console.log('wp API ready', this, arguments);
//   });
//   wpApi.bind('save', function() {
//     console.log('wp API saving ...', this, arguments);
//   });
//   wpApi.bind('saved', function() {
//     console.log('wp API saved !', this, arguments);
//   });
//   wpApi.bind('activated', function() {
//     console.log('wp API activated ????', this, arguments);
//   });
//   wpApi.previewer.bind('url', function () {
//     console.log("wpApi.previewer.bind('url'", this, arguments);
//   });
// }

/**
 * Get the prototype of a control
 * and call the 'super/parent' method
 */
// var ControlColor = api.controls.Color.prototype;
// ControlColor.ready.apply(this, arguments);

// // from: https://make.wordpress.org/core/2014/10/27/toward-a-complete-javascript-api-for-the-customizer/
// wpApi.section.each(function ( section ) {
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
