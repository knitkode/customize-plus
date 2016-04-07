//=include customize/tpl-begin.js

  //=include customize/core/setup-globals.js

  //=require customize/core/setup-jquery.js
  //=require customize/core/setup-markdown.js

  //=require customize/core/regexes.js
  //=require customize/core/utils.js
  //=require customize/core/validators.js
  //=require customize/core/wptight.js
  //=require customize/core/banner.js
  //=require customize/core/skeleton.js
  //=require customize/core/tabs.js

  //=require customize/controls/base.js

  $document.ready(function() {
    if (DEBUG.performances) var t = performance.now();
    WpTight.init();
    Tabs.init();
    if (DEBUG.performances) console.log( 'Customize.js Base (ready start->end) took ' + (performance.now() - t) + ' ms.');
  });

  //=require customize/temp.js

//=include customize/tpl-end.js
