var shell = require('shelljs');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Add textdomain.
    addtextdomain: {
      options: {
        textdomain: 'redux-framework', // Project text domain.
        updateDomains: ['redux', 'redux-framework-demo', 'v'] // List of text domains to replace.
      },
      target: {
        files: {
          src: ['*.php', '**/*.php', '!node_modules/**', '!tests/**', '!sample/**']
        }
      }
    },

    // Generate POT files.
    makepot: {
      redux: {
        options: {
          type: 'wp-plugin',
          domainPath: 'ReduxCore/languages',
          potFilename: 'redux-framework.pot',
          include: [],
          exclude: [
            'sample/.*'
          ],
          potHeaders: {
            poedit: true,
            'report-msgid-bugs-to': 'https://github.com/ReduxFramework/ReduxFramework/issues',
            'language-team': 'LANGUAGE <support@reduxframework.com>'
          }
        }
      }
    },

    // Check textdomain errors.
    checktextdomain: {
      options: {
        keywords: [
          '__:1,2d',
          '_e:1,2d',
          '_x:1,2c,3d',
          'esc_html__:1,2d',
          'esc_html_e:1,2d',
          'esc_html_x:1,2c,3d',
          'esc_attr__:1,2d',
          'esc_attr_e:1,2d',
          'esc_attr_x:1,2c,3d',
          '_ex:1,2c,3d',
          '_n:1,2,4d',
          '_nx:1,2,4c,5d',
          '_n_noop:1,2,3d',
          '_nx_noop:1,2,3c,4d'
        ]
      },
      redux: {
        cwd: 'ReduxCore/',
        options: {
          text_domain: 'redux-framework',
        },
        src: ['**/*.php'],
        expand: true
      },
      sample: {
        cwd: 'sample',
        options: {
          text_domain: 'redux-framework-demo',
        },
        src: ['**/*.php'],
        expand: true
      }
    },

    // Exec shell commands.
    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      // Limited to Maintainers so
      // txpush: {
      //  command: 'tx push -s' // push the resources
      // },
      txpull: {
        command: 'tx pull -a --minimum-perc=25' // pull the .po files
      }
    },

    // Generate MO files.
    potomo: {
      dist: {
        options: {
          poDel: true
        },
        files: [{
          expand: true,
          cwd: 'ReduxCore/languages/',
          src: ['*.po'],
          dest: 'ReduxCore/languages/',
          ext: '.mo',
          nonull: true
        }]
      }
    },

    phpdocumentor: {
      options: {
        directory: 'ReduxCore/',
        target: 'docs/'
      },
      generate: {}
    }
  });

  // Load NPM tasks to be used here
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-potomo');
  grunt.loadNpmTasks('grunt-wp-i18n');
  grunt.loadNpmTasks('grunt-checktextdomain');
  grunt.loadNpmTasks('grunt-phpdocumentor');

  grunt.registerTask(
    'langUpdate', [
      'addtextdomain',
      'makepot',
      'shell:txpull',
      'potomo'
    ]
  );
  grunt.registerTask('travis', ['lintPHP']);

};