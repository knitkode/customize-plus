<?php $settings_keys = array(
  // Customize Plus controls
  'color',
  'color-no-transparent',
  'color-alpha',
  'color-palette1',
  'color-palette2',
  'color-palette3',
  'radio',
  'buttonset',
  'buttonset-three',
  'buttonset-four',
  'radio-image',
  'radio-image-custom',
  'slider',
  'slider-em',
  'slider-px-percent',
  'slider-no-units',
  'number',
  'number-float',
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
  'font-family',
  'font-weight',
  'text',
  'text-max-length',
  'text-optional',
  'text-url',
  'text-email',
  'textarea',
  'textarea-html',
  'textarea-wp_editor',
  'textarea-wp_editor-options',
  // Customize Plus Premium controls
  'color-dynamic-active',
  'color-dynamic-passive',
  'color-dynamic-hidetab-active',
  'color-dynamic-hidetab-passive',
  'size-dynamic-active',
  'size-dynamic-passive',
  'size-dynamic-hidetab-active',
  'size-dynamic-hidetab-passive',
  'knob',
  'knob-options',
  'date',
  'date-inline',
  // WordPress controls
  'wp-color',
  'wp-media',
  'wp-image',
  'wp-background',
  'wp-upload',
  'wp-cropped',
  'wp-site',
  'wp-header',
); ?>
<!doctype html>
<html>
  <head><?php wp_head(); ?></head>
  <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700' rel='stylesheet' type='text/css'>
  <body>
     <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Customize Plus demo</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">Action</a></li>
            <li><a href="#">Action</a></li>
            <li class="dropdown">
              <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" class="divider"></li>
                <li class="dropdown-header">Nav header</li>
                <li><a href="#">Separated link</a></li>
                <li><a href="#">One more separated link</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <header class="jumbotron">
      <div class="container">
        <h1>Customize Plus Demo Theme</h1>
        <p>Preview of each control and its associated setting</p>
        <a href="https://github.com/PlusWP/customize-plus" target="_blank" class="btn btn-lg btn-warning">View on Github</a>
      </div>
    </header>
    <article class="container">
      <div class="row">
      <?php
        foreach ( $settings_keys as $key ) {
          $value = Customize_Plus_Demo::get_theme_mod( $key ); ?>
          <div class="col-xs-4 col-sm-3 col-md-2 col-lg-2">
            <?php echo "<div class='setting-name' title='$key'>$key</div>"; ?>
            <?php echo "<div class='setting-preview' id='$key' title='$key'>$value</div>"; ?>
          </div>
      <?php } ?>
      </div>
    </article>
    <?php wp_footer(); ?>
  </body>
</html>