/* exported: SectionBase */

/**
 * Section Base class
 *
 * Change a bit the default Customizer Section class.
 * Render controls content on demand when their section is expanded
 * then remove the DOM when the section is collapsed
 *
 * @see PHP class PWPcp_Customize_Section_Base.
 * @class
 * @augments wp.customize.Section
 */
var SectionBase = api.Section.extend({
  /**
   * @since 4.1.0
   *
   * @param {String} id
   * @param {Array}  options
   */
  initialize: function ( id, options ) {
    var section = this;
    api.Section.prototype.initialize.call( section, id, options );

    var tplDescription = section.description ?
      '<li class="customize-section-description-container">' +
        '<p class="description customize-section-description">' + section.description + '</p>' +
      '</li>' : '';

    section.container = $(
      '<li id="accordion-section-' + id + '" class="accordion-section control-section k6-section">' +
      '<h3 class="accordion-section-title" tabindex="0">' + section.title +
        '<span class="screen-reader-text">Press return or enter to expand</span>' +
      '</h3>' +
      '<ul class="accordion-section-content">' + tplDescription + '</ul>' +
    '</li>'
    );

    section.attachEvents();

    section.id = id;
    section.panel = new api.Value();
    section.panel.bind( function ( id ) {
      $( section.container ).toggleClass( 'control-subsection', !! id );
    });
    section.panel.set( section.params.panel || '' );
    api.utils.bubbleChildValueChanges( section, [ 'panel' ] );

    section.embed();
    section.deferred.embedded.done( function () {
      section.ready();
    });
  }
});

// api.sectionConstructor['PWPcp_search'] = SectionBase;