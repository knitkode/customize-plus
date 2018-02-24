const paths = require('./dev-lib/paths');

module.exports = function(grunt) {

  grunt.file.setBase('../');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    wp_deploy: {
      deploy: {
        options: {
          plugin_slug: '<%= pkg.config.slug %>',
          svn_user: 'knitkode',
          build_dir: paths.DIST, // relative path to your build directory
          assets_dir: paths.dist.assets // relative path to your assets directory (optional).
        },
      }
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-wp-deploy');

  // Default task(s).
  grunt.registerTask('publish', ['wp_deploy']);

};
