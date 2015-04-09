/* global $ */

/**
 * Temp
 *
 * Temporary js to inject at the bottom
 */
if (DEBUG) {
  api.bind( 'ready', function() {
    console.log('wp API ready');
  });
  api.bind( 'save', function() {
    console.log('wp API saving ...');
  });
  api.bind( 'saved', function() {
    console.log('wp API saved !');
  });
  api.bind( 'activated', function() {
    console.log('wp API activated ????');
  });
}

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
