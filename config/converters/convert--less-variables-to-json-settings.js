/**
 * Convert bootswatch variables.less file
 * to a json accepted by the theme importer
 *
 */
var BOOTSWATCH_API_URL = 'http://api.bootswatch.com/3/';
var PATH_THEME_BOOTSWATCH_FOLDER = '../assets/styles/bootswatch';
var PATH_THEME_PRESETS = '../presets';

var fs = require('fs');
var path = require('path');
var request = require("request")
var args = process.argv.slice(2);


request({ url: BOOTSWATCH_API_URL, json: true }, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    console.log('Succesfully requested data from: ' + BOOTSWATCH_API_URL);
    var themes = body.themes;
    for (var i = 0, l = themes.length; i < l; i++) {
      var theme = themes[i];
      var themeName =  theme.name.toLowerCase();
      var filename = 'bootswatch-' + themeName;
      requestVariablesFile(filename, theme.lessVariables);
      downloadCustomFile(themeName, theme.less);
    }
  } else {
    console.log('Error requesting data from: ' + BOOTSWATCH_API_URL);
  }
});


function requestVariablesFile (filename, url) {
  request({ url: url, json: true }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      parseLessFile(filename, body)
    } else {
      console.log('error requesting data from: ' + url);
    }
  });
}


function downloadCustomFile (filename, url) {
  request({ url: url, json: true }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      fs.writeFile(path.resolve(PATH_THEME_BOOTSWATCH_FOLDER, filename + '.less'), body, function (err) {
        if (err) throw err;
        console.log('Saved custom less file for: ' + filename);
      });
    } else {
      console.log('error requesting data from: ' + url);
    }
  });
}


function parseLessFile (filename, data) {
  var regex = /.*@([a-zA-Z-0-9\_]+):\s*(.*);/g;
  var m;
  var json = {};
  var variables = {}

  while ((m = regex.exec(data)) != null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    if (m[1] && m[2]) {
      variables[m[1]] = m[2];
    }
  }

  json.mods = variables;

  fs.writeFile(path.resolve(PATH_THEME_PRESETS, filename + '.json'), JSON.stringify(json), function (err) {
    if (err) throw err;
    console.log('Converted lessVariables file to json for: ' + filename);
  });
}