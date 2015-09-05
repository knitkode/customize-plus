/* jshint node: true */
'use strict';

/**
 * Config informations
 * @type {Object}
 */
module.exports = {
  credits: [
    '/*!',
    ' * <%= pkg.config.namePretty %> v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * <%= pkg.description %>',
    ' * Copyright (c) <%= pkg.config.startYear %><% if (new Date().getFullYear() > pkg.config.startYear) { %>-<%= new Date().getFullYear() %><% } %> <%= pkg.author.name %> <<%= pkg.author.email %>> (<%= pkg.author.url %>)',
    ' * <%= pkg.license.type %> (<%= pkg.license.url %>)',
    ' */'
  ].join('\n'),
  argv: require('minimist')(process.argv.slice(2)),
  isDist: !!require('minimist')(process.argv.slice(2)).dist // read --dist arg (i.e. `gulp build --dist`)
};
