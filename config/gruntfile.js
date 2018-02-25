const paths = require('./dev-lib/paths');

module.exports = function(grunt) {

  grunt.file.setBase('../');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    wp_deploy: {
      deploy: {
        options: {
          plugin_slug: '<%= pkg.config.slug %>',
          svn_user: 'knitkode',
          build_dir: paths.DIST,
          assets_dir: paths.dist.assets
        },
      }
    },
  });

  grunt.loadNpmTasks('grunt-wp-deploy');

  grunt.registerTask('publish', ['wp_deploy']);
};
