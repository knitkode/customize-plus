<!doctype html>
<html>
  <head><?php wp_head(); ?></head>
  <body>
    <h1>Customize Plus Demo Theme</h1>
    <?php $settings_keys = array(
      'color-native',
      'color',
      'color-no-transparent',
      'color-alpha',
      'color-palette1',
      'color-palette2',
      'color-palette3',
      'slider',
      'slider-em',
      'slider-px-percent',
      'radio',
      'buttonset',
      'buttonset-three',
      'buttonset-four',
      'radio-image',
      'radio-image-custom',
      'text',
      'text-max-length',
      'text-required',
      'text-url',
      'text-email',
      'textarea',
      'number',
      'number-min',
      'number-max',
      'number-step',
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
      'textarea-html',
      'textarea-wp_editor',
      'textarea-wp_editor-options',
    );

    foreach ( $settings_keys as $key ) {
      $value = Customize_Plus_Demo::get_theme_mod( $key );
      echo "<div class='demo' id='$key' title='$key'>$value</div>";
    }
    ?>
    <?php wp_footer(); ?>
  </body>
</html>