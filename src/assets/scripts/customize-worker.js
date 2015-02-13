/* jshint worker: true, browser: false */

(function () {

  self.window = {};

  var uncompiledStylesheet;
  var preprocessorWorkerURL;

  var lessOptions = {
    env: 'production',
    isFileProtocol: false,
    useFileCache: true,
    compress: true, // k6doubt \\
    logLevel: 0, // k6debug \\
    // relativeUrls: true,
    // async: true,
    rootFileInfo: {
      filename: 'input',
      relativeUrls: true,
      // rootpath: 'http://localhost/WPlayground/wp-content/themes/k6/assets/styles/',
      currentDirectory: ''
      // rootFilename: 'theme.less'
    }
  };
  var customization;

  /**
   * Merge defaults with user options
   *
   * @private
   * @param {Object} defaults Default settings.
   * @param {Object} options User options.
   * @returns {Object} Merged values of defaults and options.
   */
  var extend = function ( defaults, options ) {
    var extended = {};
    var prop;
    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
        extended[prop] = defaults[prop];
      }
    }
    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        extended[prop] = options[prop];
      }
    }
    return extended;
  };

  /**
   * Load customized version of Less
   * compatible to work in a web worker.
   *
   * @param  {Object}   customization GlobalVars on load
   * @param  {Function} callback
   */
  function loadPreprocessor (customizationOnLoad, callback) {
    importScripts(preprocessorWorkerURL);
    callback();
  }

  /**
   * Parse style, it wraps less method
   *
   * @param  {Object} variables
   */
  function parseStyle (variables) {
    var preprocessorOptions = lessOptions;
    preprocessorOptions.globalVars = variables;
    // debugger; // k6debug \\
    window.less.render(uncompiledStylesheet, preprocessorOptions, function (iDontKnow, output) {
      if (output) {
        postMessage(output.css);
        // k6todo imports caching... \\
        // output.css = string of css
        // output.map = string of sourcemap
        // output.imports = array of string filenames of the imports referenced
      } else {
        postMessage(''); // k6todo error handling \\
        console.log('Less Error:', iDontKnow.message, iDontKnow);
      }
    });
  }

  /**
   * On message
   *
   */
  self.onmessage = function (e) {
    if (e.data.UNCOMPILED_STYLESHEET) {
      // give some basic info to less
      // first give the content as string of the main theme.less file
      uncompiledStylesheet = e.data.UNCOMPILED_STYLESHEET;
      // give the directory path for the @imports
      lessOptions.rootFileInfo.currentDirectory = e.data.UNCOMPILED_STYLESHEET_URL;
      // the path to load the special less version web worker compatible
      preprocessorWorkerURL = e.data.PREPROCESSOR_WORKER_URL;
      // set customization object on load
      customization = e.data.customization;
      // console.log('Message received: ', customization, e);
      loadPreprocessor(customization, function () {
        parseStyle(customization);
      });

    // if goes here means that is not the first message that worker receive
    } else {
      var modifier = e.data;
      customization = extend(customization, modifier);
      parseStyle(customization);
      // possible alternative, but doesn't change anything
      // window.less.modifyVars(modifier).done(function () {
      //   console.log('test');
      // });
    }
  };
})();