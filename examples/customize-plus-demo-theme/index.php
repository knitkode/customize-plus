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
  'text',
  'text-max-length',
  'text-required',
  'text-url',
  'text-email',
  'textarea',
  'textarea-html',
  'textarea-wp_editor',
  'textarea-wp_editor-options',
); ?>
<!doctype html>
<html>
  <head><?php wp_head(); ?></head>
  <body>
    <div class="jumbotron">
      <div class="container">
        <h1>Customize Plus Demo Theme</h1>
        <p>Preview of each control and its associated setting</p>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row">
      <?php
        foreach ( $settings_keys as $key ) {
          $value = Customize_Plus_Demo::get_theme_mod( $key ); ?>
          <div class="col-xs-4 col-sm-3 col-md-2 col-lg-1">
            <?php echo "<div class='setting-name' title='$key'>$key</div>"; ?>
            <?php echo "<div class='setting-preview' id='$key' title='$key'>$value</div>"; ?>
          </div>
      <?php } ?>
      </div>
    </div>
    <?php wp_footer(); ?>
  </body>
</html>