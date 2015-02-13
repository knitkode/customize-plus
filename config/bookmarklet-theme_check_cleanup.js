(function() {

  var themeCheck = document.getElementById("theme-check");
  var themeCheckResults = document.getElementsByClassName("tc-result")[0];
  var nodes = themeCheckResults.querySelectorAll("li");
  var whitelisted = [
    'wp-less-oncletom/lib/vendor/',
    'vendor/oyejorge/less.php/',
    'ReduxFramework/',
    // remove `<` and `>` because they got escaped within innerHTML result
    '?php wp_footer(); ?',
    '?php wp_head(); ?',
    '?php language_attributes(); ?',
    '!DOCTYPE html PUBLIC "-//W3C//DTD XHTML'
  ];
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    var content = node.innerHTML;
    for (var j = 0, k = whitelisted.length; j < k; j++) {
      if (content.indexOf(whitelisted[j]) !== -1) {
        node.remove();
      }
    }
  }
})();