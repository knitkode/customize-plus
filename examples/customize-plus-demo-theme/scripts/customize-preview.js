(function (window, $, wp, api) {
  'use strict';

  var wpApi = wp.customize;
  var _toCSS = api.toCSS;

  var $body = $('body');
  var $toScroll = $('html, body');

  $.fn.flash = function(duration) {
    this.addClass('flash');
    setTimeout(function () {
      this.removeClass('flash');
    }.bind(this), 300);

    $toScroll.animate({
      scrollTop: this.offset().top -100
    }, 300);

    return this;
  };

  var settingsToColor = [
    // Customize Plus controls
    'color',
    'color-no-transparent',
    'color-alpha',
    'color-palette1',
    'color-palette2',
    'color-palette3'
  ];
  _.each(settingsToColor, function (setting) {
    wpApi(setting, function (value) {
      value.bind(function (to) {
        $('#' + setting).css('background', to).flash();
      });
    });
  });

  var settingsToWidth = [
    // Customize Plus controls
    'slider',
    'slider-em',
    'slider-px-percent',
  ];
  _.each(settingsToWidth, function (setting) {
    wpApi(setting, function (value) {
      value.bind(function (to) {
        $('#' + setting).css('width', to).flash();
      });
    });
  });

  var settingsToText = [
    // Customize Plus controls
    'radio',
    'buttonset',
    'buttonset-three',
    'buttonset-four',
    'radio-image',
    'radio-image-custom',
    'text',
    'text-max-length',
    'text-optional',
    'text-url',
    'text-email',
    'textarea',
    'number',
    'number-float',
    'number-min',
    'number-max',
    'number-step',
    'slider-no-units',
    'toggle',
    'multicheck',
    'multicheck-sortable',
    'select',
    'select-selectize',
    'select-selectize-options',
    'select-selectize-more-items',
    'select-selectize-tags-plugins',
    'tags',
    'tags-removable',
    'tags-sortable-removable',
    'tags-max-items',
    'sortable',
    'font-family',
    'font-weight',
    // Customize Plus Premium controls
    'knob',
    'knob-options',
    'date',
    'date-inline',
    'color-dynamic-active',
    'color-dynamic-passive',
    'color-dynamic-hidetab-active',
    'color-dynamic-hidetab-passive',
    'size-dynamic-active',
    'size-dynamic-passive',
    'size-dynamic-hidetab-active',
    'size-dynamic-hidetab-passive',
    // WordPress controls
    'wp-color',
    'wp-media',
    'wp-image',
    'wp-background',
    'wp-upload',
    'wp-cropped',
    'wp-site',
    'wp-header'
  ].concat(settingsToColor, settingsToWidth);

  _.each(settingsToText, function (setting) {
    wpApi(setting, function (value) {
      value.bind(function (to) {
        $('#' + setting).text(to).flash();
      });
    });
  });

  var settingsToHtml = [
    'textarea-html',
    'textarea-wp_editor',
    'textarea-wp_editor-options',
  ];
  _.each(settingsToHtml, function (setting) {
    wpApi(setting, function (value) {
      value.bind(function (to) {
        $('#' + setting).html(to).flash();
      });
    });
  });


})(window, jQuery, wp, PWPcp);