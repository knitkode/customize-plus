/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.2.20171210
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

// Full polyfill for browsers with no classList support
// Including IE < Edge missing SVGElement.classList
if (
	   !("classList" in document.createElement("_")) 
	|| document.createElementNS
	&& !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))
) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "The token must not be empty."
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "The token must not contain space characters."
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	return ~checkTokenAndGetIndex(this, token + "");
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (!~checkTokenAndGetIndex(this, token)) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (~index) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.replace = function (token, replacement_token) {
	var index = checkTokenAndGetIndex(token + "");
	if (~index) {
		this.splice(index, 1, replacement_token);
		this._updateClassName();
	}
}
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
		// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
		if (ex.number === undefined || ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

}

// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	// replace() polyfill
	if (!("replace" in document.createElement("_").classList)) {
		DOMTokenList.prototype.replace = function (token, replacement_token) {
			var
				  tokens = this.toString().split(" ")
				, index = tokens.indexOf(token + "")
			;
			if (~index) {
				tokens = tokens.slice(index);
				this.remove.apply(this, tokens);
				this.add(replacement_token);
				this.add.apply(this, tokens.slice(1));
			}
		}
	}

	testElement = null;
}());

}


/*!
 * modernizr v3.5.0
 * Build https://modernizr.com/download?-cssanimations-csstransforms-filereader-svg-webworkers-addtest-fnbind-setclasses-testprop-dontmin
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/

;(function(window, document, undefined){
  var tests = [];
  

  /**
   *
   * ModernizrProto is the constructor for Modernizr
   *
   * @class
   * @access public
   */

  var ModernizrProto = {
    // The current version, dummy
    _version: '3.5.0',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config: {
      'classPrefix': '',
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },

    // Queue of tests
    _q: [],

    // Stub these for people who are listening
    on: function(test, cb) {
      // I don't really think people should do this, but we can
      // safe guard it a bit.
      // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
      // This is in case people listen to synchronous tests. I would leave it out,
      // but the code to *disallow* sync tests in the real version of this
      // function is actually larger than this.
      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },

    addTest: function(name, fn, options) {
      tests.push({name: name, fn: fn, options: options});
    },

    addAsyncTest: function(fn) {
      tests.push({name: null, fn: fn});
    }
  };

  

  // Fake some of Object.create so we can force non test results to be non "own" properties.
  var Modernizr = function() {};
  Modernizr.prototype = ModernizrProto;

  // Leak modernizr globally when you `require` it rather than force it here.
  // Overwrite name so constructor name is nicer :D
  Modernizr = new Modernizr();

  

  var classes = [];
  

  /**
   * is returns a boolean if the typeof an obj is exactly type.
   *
   * @access private
   * @function is
   * @param {*} obj - A thing we want to check the type of
   * @param {string} type - A string to compare the typeof against
   * @returns {boolean}
   */

  function is(obj, type) {
    return typeof obj === type;
  }
  ;

  /**
   * Run through all tests and detect their support in the current UA.
   *
   * @access private
   */

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        // run the test, throw the return value into the Modernizr,
        // then based on that boolean, define an appropriate className
        // and push it into an array of classes we'll join later.
        //
        // If there is no name, it's an 'async' test that is run,
        // but not directly added to the object. That should
        // be done with a post-run addTest call.
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            // Add all the aliases into the names list
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }

        // Run the test, or use the raw value if it's not a function
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


        // Set each of the names on the Modernizr object
        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx];
          // Support dot properties as sub tests. We don't do checking to make sure
          // that the implied parent tests have been added. You must call them in
          // order (either in the test, or make the parent test a dependency).
          //
          // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
          // hashtag famous last words
          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            // cast to a Boolean, if not one already
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }

            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }
  ;

  /**
   * docElement is a convenience wrapper to grab the root element of the document
   *
   * @access private
   * @returns {HTMLElement|SVGElement} The root element of the document
   */

  var docElement = document.documentElement;
  

  /**
   * A convenience helper to check if the document we are running in is an SVG document
   *
   * @access private
   * @returns {boolean}
   */

  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
  

  /**
   * setClasses takes an array of class names and adds them to the root element
   *
   * @access private
   * @function setClasses
   * @param {string[]} classes - Array of class names
   */

  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]
  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';

    if (isSVG) {
      className = className.baseVal;
    }

    // Change `no-js` to `js` (independently of the `enableClasses` option)
    // Handle classPrefix on this too
    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      // Add the new classes
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      if (isSVG) {
        docElement.className.baseVal = className;
      } else {
        docElement.className = className;
      }
    }

  }

  ;

  /**
   * hasOwnProp is a shim for hasOwnProperty that is needed for Safari 2.0 support
   *
   * @author kangax
   * @access private
   * @function hasOwnProp
   * @param {object} object - The object to check for a property
   * @param {string} property - The property to check for
   * @returns {boolean}
   */

  // hasOwnProperty shim by kangax needed for Safari 2.0 support
  var hasOwnProp;

  (function() {
    var _hasOwnProperty = ({}).hasOwnProperty;
    /* istanbul ignore else */
    /* we have no way of testing IE 5.5 or safari 2,
     * so just assume the else gets hit */
    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
      hasOwnProp = function(object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function(object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }
  })();

  


   // _l tracks listeners for async tests, as well as tests that execute after the initial run
  ModernizrProto._l = {};

  /**
   * Modernizr.on is a way to listen for the completion of async tests. Being
   * asynchronous, they may not finish before your scripts run. As a result you
   * will get a possibly false negative `undefined` value.
   *
   * @memberof Modernizr
   * @name Modernizr.on
   * @access public
   * @function on
   * @param {string} feature - String name of the feature detect
   * @param {function} cb - Callback function returning a Boolean - true if feature is supported, false if not
   * @example
   *
   * ```js
   * Modernizr.on('flash', function( result ) {
   *   if (result) {
   *    // the browser has flash
   *   } else {
   *     // the browser does not have flash
   *   }
   * });
   * ```
   */

  ModernizrProto.on = function(feature, cb) {
    // Create the list of listeners if it doesn't exist
    if (!this._l[feature]) {
      this._l[feature] = [];
    }

    // Push this test on to the listener list
    this._l[feature].push(cb);

    // If it's already been resolved, trigger it on next tick
    if (Modernizr.hasOwnProperty(feature)) {
      // Next Tick
      setTimeout(function() {
        Modernizr._trigger(feature, Modernizr[feature]);
      }, 0);
    }
  };

  /**
   * _trigger is the private function used to signal test completion and run any
   * callbacks registered through [Modernizr.on](#modernizr-on)
   *
   * @memberof Modernizr
   * @name Modernizr._trigger
   * @access private
   * @function _trigger
   * @param {string} feature - string name of the feature detect
   * @param {function|boolean} [res] - A feature detection function, or the boolean =
   * result of a feature detection function
   */

  ModernizrProto._trigger = function(feature, res) {
    if (!this._l[feature]) {
      return;
    }

    var cbs = this._l[feature];

    // Force async
    setTimeout(function() {
      var i, cb;
      for (i = 0; i < cbs.length; i++) {
        cb = cbs[i];
        cb(res);
      }
    }, 0);

    // Don't trigger these again
    delete this._l[feature];
  };

  /**
   * addTest allows you to define your own feature detects that are not currently
   * included in Modernizr (under the covers it's the exact same code Modernizr
   * uses for its own [feature detections](https://github.com/Modernizr/Modernizr/tree/master/feature-detects)). Just like the offical detects, the result
   * will be added onto the Modernizr object, as well as an appropriate className set on
   * the html element when configured to do so
   *
   * @memberof Modernizr
   * @name Modernizr.addTest
   * @optionName Modernizr.addTest()
   * @optionProp addTest
   * @access public
   * @function addTest
   * @param {string|object} feature - The string name of the feature detect, or an
   * object of feature detect names and test
   * @param {function|boolean} test - Function returning true if feature is supported,
   * false if not. Otherwise a boolean representing the results of a feature detection
   * @example
   *
   * The most common way of creating your own feature detects is by calling
   * `Modernizr.addTest` with a string (preferably just lowercase, without any
   * punctuation), and a function you want executed that will return a boolean result
   *
   * ```js
   * Modernizr.addTest('itsTuesday', function() {
   *  var d = new Date();
   *  return d.getDay() === 2;
   * });
   * ```
   *
   * When the above is run, it will set Modernizr.itstuesday to `true` when it is tuesday,
   * and to `false` every other day of the week. One thing to notice is that the names of
   * feature detect functions are always lowercased when added to the Modernizr object. That
   * means that `Modernizr.itsTuesday` will not exist, but `Modernizr.itstuesday` will.
   *
   *
   *  Since we only look at the returned value from any feature detection function,
   *  you do not need to actually use a function. For simple detections, just passing
   *  in a statement that will return a boolean value works just fine.
   *
   * ```js
   * Modernizr.addTest('hasJquery', 'jQuery' in window);
   * ```
   *
   * Just like before, when the above runs `Modernizr.hasjquery` will be true if
   * jQuery has been included on the page. Not using a function saves a small amount
   * of overhead for the browser, as well as making your code much more readable.
   *
   * Finally, you also have the ability to pass in an object of feature names and
   * their tests. This is handy if you want to add multiple detections in one go.
   * The keys should always be a string, and the value can be either a boolean or
   * function that returns a boolean.
   *
   * ```js
   * var detects = {
   *  'hasjquery': 'jQuery' in window,
   *  'itstuesday': function() {
   *    var d = new Date();
   *    return d.getDay() === 2;
   *  }
   * }
   *
   * Modernizr.addTest(detects);
   * ```
   *
   * There is really no difference between the first methods and this one, it is
   * just a convenience to let you write more readable code.
   */

  function addTest(feature, test) {

    if (typeof feature == 'object') {
      for (var key in feature) {
        if (hasOwnProp(feature, key)) {
          addTest(key, feature[ key ]);
        }
      }
    } else {

      feature = feature.toLowerCase();
      var featureNameSplit = feature.split('.');
      var last = Modernizr[featureNameSplit[0]];

      // Again, we don't check for parent test existence. Get that right, though.
      if (featureNameSplit.length == 2) {
        last = last[featureNameSplit[1]];
      }

      if (typeof last != 'undefined') {
        // we're going to quit if you're trying to overwrite an existing test
        // if we were to allow it, we'd do this:
        //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
        //   docElement.className = docElement.className.replace( re, '' );
        // but, no rly, stuff 'em.
        return Modernizr;
      }

      test = typeof test == 'function' ? test() : test;

      // Set the value (this is the magic, right here).
      if (featureNameSplit.length == 1) {
        Modernizr[featureNameSplit[0]] = test;
      } else {
        // cast to a Boolean, if not one already
        if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
          Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
        }

        Modernizr[featureNameSplit[0]][featureNameSplit[1]] = test;
      }

      // Set a single class (either `feature` or `no-feature`)
      setClasses([(!!test && test != false ? '' : 'no-') + featureNameSplit.join('-')]);

      // Trigger the event
      Modernizr._trigger(feature, test);
    }

    return Modernizr; // allow chaining.
  }

  // After all the tests are run, add self to the Modernizr prototype
  Modernizr._q.push(function() {
    ModernizrProto.addTest = addTest;
  });

  



  /**
   * contains checks to see if a string contains another string
   *
   * @access private
   * @function contains
   * @param {string} str - The string we want to check for substrings
   * @param {string} substr - The substring we want to search the first string for
   * @returns {boolean}
   */

  function contains(str, substr) {
    return !!~('' + str).indexOf(substr);
  }

  ;

  /**
   * createElement is a convenience wrapper around document.createElement. Since we
   * use createElement all over the place, this allows for (slightly) smaller code
   * as well as abstracting away issues with creating elements in contexts other than
   * HTML documents (e.g. SVG documents).
   *
   * @access private
   * @function createElement
   * @returns {HTMLElement|SVGElement} An HTML or SVG element
   */

  function createElement() {
    if (typeof document.createElement !== 'function') {
      // This is the case in IE7, where the type of createElement is "object".
      // For this reason, we cannot call apply() as Object is not a Function.
      return document.createElement(arguments[0]);
    } else if (isSVG) {
      return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
    } else {
      return document.createElement.apply(document, arguments);
    }
  }

  ;

  /**
   * Create our "modernizr" element that we do most feature tests on.
   *
   * @access private
   */

  var modElem = {
    elem: createElement('modernizr')
  };

  // Clean up this element
  Modernizr._q.push(function() {
    delete modElem.elem;
  });

  

  var mStyle = {
    style: modElem.elem.style
  };

  // kill ref for gc, must happen before mod.elem is removed, so we unshift on to
  // the front of the queue.
  Modernizr._q.unshift(function() {
    delete mStyle.style;
  });

  

  /**
   * getBody returns the body of a document, or an element that can stand in for
   * the body if a real body does not exist
   *
   * @access private
   * @function getBody
   * @returns {HTMLElement|SVGElement} Returns the real body of a document, or an
   * artificially created element that stands in for the body
   */

  function getBody() {
    // After page load injecting a fake body doesn't work so check if body exists
    var body = document.body;

    if (!body) {
      // Can't use the real body create a fake one.
      body = createElement(isSVG ? 'svg' : 'body');
      body.fake = true;
    }

    return body;
  }

  ;

  /**
   * injectElementWithStyles injects an element with style element and some CSS rules
   *
   * @access private
   * @function injectElementWithStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   */

  function injectElementWithStyles(rule, callback, nodes, testnames) {
    var mod = 'modernizr';
    var style;
    var ret;
    var node;
    var docOverflow;
    var div = createElement('div');
    var body = getBody();

    if (parseInt(nodes, 10)) {
      // In order not to give false positives we create a node for each test
      // This also allows the method to scale for unspecified uses
      while (nodes--) {
        node = createElement('div');
        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
        div.appendChild(node);
      }
    }

    style = createElement('style');
    style.type = 'text/css';
    style.id = 's' + mod;

    // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
    // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
    (!body.fake ? div : body).appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(document.createTextNode(rule));
    }
    div.id = mod;

    if (body.fake) {
      //avoid crashing IE8, if background image is used
      body.style.background = '';
      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
      body.style.overflow = 'hidden';
      docOverflow = docElement.style.overflow;
      docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    ret = callback(div, rule);
    // If this is done after page load we don't want to remove the body so check if body exists
    if (body.fake) {
      body.parentNode.removeChild(body);
      docElement.style.overflow = docOverflow;
      // Trigger layout so kinetic scrolling isn't disabled in iOS6+
      // eslint-disable-next-line
      docElement.offsetHeight;
    } else {
      div.parentNode.removeChild(div);
    }

    return !!ret;

  }

  ;

  /**
   * domToCSS takes a camelCase string and converts it to kebab-case
   * e.g. boxSizing -> box-sizing
   *
   * @access private
   * @function domToCSS
   * @param {string} name - String name of camelCase prop we want to convert
   * @returns {string} The kebab-case version of the supplied name
   */

  function domToCSS(name) {
    return name.replace(/([A-Z])/g, function(str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  }
  ;


  /**
   * wrapper around getComputedStyle, to fix issues with Firefox returning null when
   * called inside of a hidden iframe
   *
   * @access private
   * @function computedStyle
   * @param {HTMLElement|SVGElement} - The element we want to find the computed styles of
   * @param {string|null} [pseudoSelector]- An optional pseudo element selector (e.g. :before), of null if none
   * @returns {CSSStyleDeclaration}
   */

  function computedStyle(elem, pseudo, prop) {
    var result;

    if ('getComputedStyle' in window) {
      result = getComputedStyle.call(window, elem, pseudo);
      var console = window.console;

      if (result !== null) {
        if (prop) {
          result = result.getPropertyValue(prop);
        }
      } else {
        if (console) {
          var method = console.error ? 'error' : 'log';
          console[method].call(console, 'getComputedStyle returning null, its possible modernizr test results are inaccurate');
        }
      }
    } else {
      result = !pseudo && elem.currentStyle && elem.currentStyle[prop];
    }

    return result;
  }

  ;

  /**
   * nativeTestProps allows for us to use native feature detection functionality if available.
   * some prefixed form, or false, in the case of an unsupported rule
   *
   * @access private
   * @function nativeTestProps
   * @param {array} props - An array of property names
   * @param {string} value - A string representing the value we want to check via @supports
   * @returns {boolean|undefined} A boolean when @supports exists, undefined otherwise
   */

  // Accepts a list of property names and a single value
  // Returns `undefined` if native detection not available
  function nativeTestProps(props, value) {
    var i = props.length;
    // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
    if ('CSS' in window && 'supports' in window.CSS) {
      // Try every prefixed variant of the property
      while (i--) {
        if (window.CSS.supports(domToCSS(props[i]), value)) {
          return true;
        }
      }
      return false;
    }
    // Otherwise fall back to at-rule (for Opera 12.x)
    else if ('CSSSupportsRule' in window) {
      // Build a condition string for every prefixed variant
      var conditionText = [];
      while (i--) {
        conditionText.push('(' + domToCSS(props[i]) + ':' + value + ')');
      }
      conditionText = conditionText.join(' or ');
      return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function(node) {
        return computedStyle(node, null, 'position') == 'absolute';
      });
    }
    return undefined;
  }
  ;

  /**
   * cssToDOM takes a kebab-case string and converts it to camelCase
   * e.g. box-sizing -> boxSizing
   *
   * @access private
   * @function cssToDOM
   * @param {string} name - String name of kebab-case prop we want to convert
   * @returns {string} The camelCase version of the supplied name
   */

  function cssToDOM(name) {
    return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
      return m1 + m2.toUpperCase();
    }).replace(/^-/, '');
  }
  ;

  // testProps is a generic CSS / DOM property test.

  // In testing support for a given CSS property, it's legit to test:
  //    `elem.style[styleName] !== undefined`
  // If the property is supported it will return an empty string,
  // if unsupported it will return undefined.

  // We'll take advantage of this quick test and skip setting a style
  // on our modernizr element, but instead just testing undefined vs
  // empty string.

  // Property names can be provided in either camelCase or kebab-case.

  function testProps(props, prefixed, value, skipValueTest) {
    skipValueTest = is(skipValueTest, 'undefined') ? false : skipValueTest;

    // Try native detect first
    if (!is(value, 'undefined')) {
      var result = nativeTestProps(props, value);
      if (!is(result, 'undefined')) {
        return result;
      }
    }

    // Otherwise do it properly
    var afterInit, i, propsLength, prop, before;

    // If we don't have a style element, that means we're running async or after
    // the core tests, so we'll need to create our own elements to use

    // inside of an SVG element, in certain browsers, the `style` element is only
    // defined for valid tags. Therefore, if `modernizr` does not have one, we
    // fall back to a less used element and hope for the best.
    // for strict XHTML browsers the hardly used samp element is used
    var elems = ['modernizr', 'tspan', 'samp'];
    while (!mStyle.style && elems.length) {
      afterInit = true;
      mStyle.modElem = createElement(elems.shift());
      mStyle.style = mStyle.modElem.style;
    }

    // Delete the objects if we created them.
    function cleanElems() {
      if (afterInit) {
        delete mStyle.style;
        delete mStyle.modElem;
      }
    }

    propsLength = props.length;
    for (i = 0; i < propsLength; i++) {
      prop = props[i];
      before = mStyle.style[prop];

      if (contains(prop, '-')) {
        prop = cssToDOM(prop);
      }

      if (mStyle.style[prop] !== undefined) {

        // If value to test has been passed in, do a set-and-check test.
        // 0 (integer) is a valid property value, so check that `value` isn't
        // undefined, rather than just checking it's truthy.
        if (!skipValueTest && !is(value, 'undefined')) {

          // Needs a try catch block because of old IE. This is slow, but will
          // be avoided in most cases because `skipValueTest` will be used.
          try {
            mStyle.style[prop] = value;
          } catch (e) {}

          // If the property value has changed, we assume the value used is
          // supported. If `value` is empty string, it'll fail here (because
          // it hasn't changed), which matches how browsers have implemented
          // CSS.supports()
          if (mStyle.style[prop] != before) {
            cleanElems();
            return prefixed == 'pfx' ? prop : true;
          }
        }
        // Otherwise just return true, or the property name if this is a
        // `prefixed()` call
        else {
          cleanElems();
          return prefixed == 'pfx' ? prop : true;
        }
      }
    }
    cleanElems();
    return false;
  }

  ;

  /**
   * testProp() investigates whether a given style property is recognized
   * Property names can be provided in either camelCase or kebab-case.
   *
   * @memberof Modernizr
   * @name Modernizr.testProp
   * @access public
   * @optionName Modernizr.testProp()
   * @optionProp testProp
   * @function testProp
   * @param {string} prop - Name of the CSS property to check
   * @param {string} [value] - Name of the CSS value to check
   * @param {boolean} [useValue] - Whether or not to check the value if @supports isn't supported
   * @returns {boolean}
   * @example
   *
   * Just like [testAllProps](#modernizr-testallprops), only it does not check any vendor prefixed
   * version of the string.
   *
   * Note that the property name must be provided in camelCase (e.g. boxSizing not box-sizing)
   *
   * ```js
   * Modernizr.testProp('pointerEvents')  // true
   * ```
   *
   * You can also provide a value as an optional second argument to check if a
   * specific value is supported
   *
   * ```js
   * Modernizr.testProp('pointerEvents', 'none') // true
   * Modernizr.testProp('pointerEvents', 'penguin') // false
   * ```
   */

  var testProp = ModernizrProto.testProp = function(prop, value, useValue) {
    return testProps([prop], undefined, value, useValue);
  };
  

  /**
   * fnBind is a super small [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) polyfill.
   *
   * @access private
   * @function fnBind
   * @param {function} fn - a function you want to change `this` reference to
   * @param {object} that - the `this` you want to call the function with
   * @returns {function} The wrapped version of the supplied function
   */

  function fnBind(fn, that) {
    return function() {
      return fn.apply(that, arguments);
    };
  }

  ;

  /**
   * If the browsers follow the spec, then they would expose vendor-specific styles as:
   *   elem.style.WebkitBorderRadius
   * instead of something like the following (which is technically incorrect):
   *   elem.style.webkitBorderRadius

   * WebKit ghosts their properties in lowercase but Opera & Moz do not.
   * Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
   *   erik.eae.net/archives/2008/03/10/21.48.10/

   * More here: github.com/Modernizr/Modernizr/issues/issue/21
   *
   * @access private
   * @returns {string} The string representing the vendor-specific style properties
   */

  var omPrefixes = 'Moz O ms Webkit';
  

  var cssomPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : []);
  ModernizrProto._cssomPrefixes = cssomPrefixes;
  

  /**
   * List of JavaScript DOM values used for tests
   *
   * @memberof Modernizr
   * @name Modernizr._domPrefixes
   * @optionName Modernizr._domPrefixes
   * @optionProp domPrefixes
   * @access public
   * @example
   *
   * Modernizr._domPrefixes is exactly the same as [_prefixes](#modernizr-_prefixes), but rather
   * than kebab-case properties, all properties are their Capitalized variant
   *
   * ```js
   * Modernizr._domPrefixes === [ "Moz", "O", "ms", "Webkit" ];
   * ```
   */

  var domPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : []);
  ModernizrProto._domPrefixes = domPrefixes;
  

  /**
   * testDOMProps is a generic DOM property test; if a browser supports
   *   a certain property, it won't return undefined for it.
   *
   * @access private
   * @function testDOMProps
   * @param {array.<string>} props - An array of properties to test for
   * @param {object} obj - An object or Element you want to use to test the parameters again
   * @param {boolean|object} elem - An Element to bind the property lookup again. Use `false` to prevent the check
   * @returns {false|*} returns false if the prop is unsupported, otherwise the value that is supported
   */
  function testDOMProps(props, obj, elem) {
    var item;

    for (var i in props) {
      if (props[i] in obj) {

        // return the property name as a string
        if (elem === false) {
          return props[i];
        }

        item = obj[props[i]];

        // let's bind a function
        if (is(item, 'function')) {
          // bind to obj unless overriden
          return fnBind(item, elem || obj);
        }

        // return the unbound function or obj or value
        return item;
      }
    }
    return false;
  }

  ;

  /**
   * testPropsAll tests a list of DOM properties we want to check against.
   * We specify literally ALL possible (known and/or likely) properties on
   * the element including the non-vendor prefixed one, for forward-
   * compatibility.
   *
   * @access private
   * @function testPropsAll
   * @param {string} prop - A string of the property to test for
   * @param {string|object} [prefixed] - An object to check the prefixed properties on. Use a string to skip
   * @param {HTMLElement|SVGElement} [elem] - An element used to test the property and value against
   * @param {string} [value] - A string of a css value
   * @param {boolean} [skipValueTest] - An boolean representing if you want to test if value sticks when set
   * @returns {false|string} returns the string version of the property, or false if it is unsupported
   */
  function testPropsAll(prop, prefixed, elem, value, skipValueTest) {

    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
      props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

    // did they call .prefixed('boxSizing') or are we just testing a prop?
    if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
      return testProps(props, prefixed, value, skipValueTest);

      // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
    } else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
  }

  // Modernizr.testAllProps() investigates whether a given style property,
  // or any of its vendor-prefixed variants, is recognized
  //
  // Note that the property names must be provided in the camelCase variant.
  // Modernizr.testAllProps('boxSizing')
  ModernizrProto.testAllProps = testPropsAll;

  

  /**
   * testAllProps determines whether a given CSS property is supported in the browser
   *
   * @memberof Modernizr
   * @name Modernizr.testAllProps
   * @optionName Modernizr.testAllProps()
   * @optionProp testAllProps
   * @access public
   * @function testAllProps
   * @param {string} prop - String naming the property to test (either camelCase or kebab-case)
   * @param {string} [value] - String of the value to test
   * @param {boolean} [skipValueTest=false] - Whether to skip testing that the value is supported when using non-native detection
   * @example
   *
   * testAllProps determines whether a given CSS property, in some prefixed form,
   * is supported by the browser.
   *
   * ```js
   * testAllProps('boxSizing')  // true
   * ```
   *
   * It can optionally be given a CSS value in string form to test if a property
   * value is valid
   *
   * ```js
   * testAllProps('display', 'block') // true
   * testAllProps('display', 'penguin') // false
   * ```
   *
   * A boolean can be passed as a third parameter to skip the value check when
   * native detection (@supports) isn't available.
   *
   * ```js
   * testAllProps('shapeOutside', 'content-box', true);
   * ```
   */

  function testAllProps(prop, value, skipValueTest) {
    return testPropsAll(prop, undefined, undefined, value, skipValueTest);
  }
  ModernizrProto.testAllProps = testAllProps;
  
/*!
{
  "name": "CSS Animations",
  "property": "cssanimations",
  "caniuse": "css-animation",
  "polyfills": ["transformie", "csssandpaper"],
  "tags": ["css"],
  "warnings": ["Android < 4 will pass this test, but can only animate a single property at a time"],
  "notes": [{
    "name" : "Article: 'Dispelling the Android CSS animation myths'",
    "href": "https://goo.gl/OGw5Gm"
  }]
}
!*/
/* DOC
Detects whether or not elements can be animated using CSS
*/

  Modernizr.addTest('cssanimations', testAllProps('animationName', 'a', true));

/*!
{
  "name": "CSS Transforms",
  "property": "csstransforms",
  "caniuse": "transforms2d",
  "tags": ["css"]
}
!*/

  Modernizr.addTest('csstransforms', function() {
    // Android < 3.0 is buggy, so we sniff and blacklist
    // http://git.io/hHzL7w
    return navigator.userAgent.indexOf('Android 2.') === -1 &&
           testAllProps('transform', 'scale(1)', true);
  });

/*!
{
  "name": "File API",
  "property": "filereader",
  "caniuse": "fileapi",
  "notes": [{
    "name": "W3C Working Draft",
    "href": "https://www.w3.org/TR/FileAPI/"
  }],
  "tags": ["file"],
  "builderAliases": ["file_api"],
  "knownBugs": ["Will fail in Safari 5 due to its lack of support for the standards defined FileReader object"]
}
!*/
/* DOC
`filereader` tests for the File API specification

Tests for objects specific to the File API W3C specification without
being redundant (don't bother testing for Blob since it is assumed
to be the File object's prototype.)
*/

  Modernizr.addTest('filereader', !!(window.File && window.FileList && window.FileReader));

/*!
{
  "name": "SVG",
  "property": "svg",
  "caniuse": "svg",
  "tags": ["svg"],
  "authors": ["Erik Dahlstrom"],
  "polyfills": [
    "svgweb",
    "raphael",
    "amplesdk",
    "canvg",
    "svg-boilerplate",
    "sie",
    "dojogfx",
    "fabricjs"
  ]
}
!*/
/* DOC
Detects support for SVG in `<embed>` or `<object>` elements.
*/

  Modernizr.addTest('svg', !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);

/*!
{
  "name": "Web Workers",
  "property": "webworkers",
  "caniuse" : "webworkers",
  "tags": ["performance", "workers"],
  "notes": [{
    "name": "W3C Reference",
    "href": "https://www.w3.org/TR/workers/"
  }, {
    "name": "HTML5 Rocks article",
    "href": "http://www.html5rocks.com/en/tutorials/workers/basics/"
  }, {
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/Guide/Performance/Using_web_workers"
  }],
  "polyfills": ["fakeworker", "html5shims"]
}
!*/
/* DOC
Detects support for the basic `Worker` API from the Web Workers spec. Web Workers provide a simple means for web content to run scripts in background threads.
*/

  Modernizr.addTest('webworkers', 'Worker' in window);


  // Run each test
  testRunner();

  // Remove the "no-js" class if it exists
  setClasses(classes);

  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest;

  // Run the things that are supposed to run after the tests
  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }

  // Leak Modernizr namespace
  window.Modernizr = Modernizr;


;

})(window, document);


!function(e){"undefined"!=typeof exports?e(exports):(window.hljs=e({}),"function"==typeof define&&define.amd&&define("hljs",[],function(){return window.hljs}))}(function(e){function n(e){return e.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function t(e){return e.nodeName.toLowerCase()}function r(e,n){var t=e&&e.exec(n);return t&&0==t.index}function a(e){return/no-?highlight|plain|text/.test(e)}function i(e){var n,t,r,i=e.className+" ";if(i+=e.parentNode?e.parentNode.className:"",t=/\blang(?:uage)?-([\w-]+)\b/.exec(i))return E(t[1])?t[1]:"no-highlight";for(i=i.split(/\s+/),n=0,r=i.length;r>n;n++)if(E(i[n])||a(i[n]))return i[n]}function o(e,n){var t,r={};for(t in e)r[t]=e[t];if(n)for(t in n)r[t]=n[t];return r}function u(e){var n=[];return function r(e,a){for(var i=e.firstChild;i;i=i.nextSibling)3==i.nodeType?a+=i.nodeValue.length:1==i.nodeType&&(n.push({event:"start",offset:a,node:i}),a=r(i,a),t(i).match(/br|hr|img|input/)||n.push({event:"stop",offset:a,node:i}));return a}(e,0),n}function c(e,r,a){function i(){return e.length&&r.length?e[0].offset!=r[0].offset?e[0].offset<r[0].offset?e:r:"start"==r[0].event?e:r:e.length?e:r}function o(e){function r(e){return" "+e.nodeName+'="'+n(e.value)+'"'}f+="<"+t(e)+Array.prototype.map.call(e.attributes,r).join("")+">"}function u(e){f+="</"+t(e)+">"}function c(e){("start"==e.event?o:u)(e.node)}for(var s=0,f="",l=[];e.length||r.length;){var g=i();if(f+=n(a.substr(s,g[0].offset-s)),s=g[0].offset,g==e){l.reverse().forEach(u);do c(g.splice(0,1)[0]),g=i();while(g==e&&g.length&&g[0].offset==s);l.reverse().forEach(o)}else"start"==g[0].event?l.push(g[0].node):l.pop(),c(g.splice(0,1)[0])}return f+n(a.substr(s))}function s(e){function n(e){return e&&e.source||e}function t(t,r){return new RegExp(n(t),"m"+(e.cI?"i":"")+(r?"g":""))}function r(a,i){if(!a.compiled){if(a.compiled=!0,a.k=a.k||a.bK,a.k){var u={},c=function(n,t){e.cI&&(t=t.toLowerCase()),t.split(" ").forEach(function(e){var t=e.split("|");u[t[0]]=[n,t[1]?Number(t[1]):1]})};"string"==typeof a.k?c("keyword",a.k):Object.keys(a.k).forEach(function(e){c(e,a.k[e])}),a.k=u}a.lR=t(a.l||/\b\w+\b/,!0),i&&(a.bK&&(a.b="\\b("+a.bK.split(" ").join("|")+")\\b"),a.b||(a.b=/\B|\b/),a.bR=t(a.b),a.e||a.eW||(a.e=/\B|\b/),a.e&&(a.eR=t(a.e)),a.tE=n(a.e)||"",a.eW&&i.tE&&(a.tE+=(a.e?"|":"")+i.tE)),a.i&&(a.iR=t(a.i)),void 0===a.r&&(a.r=1),a.c||(a.c=[]);var s=[];a.c.forEach(function(e){e.v?e.v.forEach(function(n){s.push(o(e,n))}):s.push("self"==e?a:e)}),a.c=s,a.c.forEach(function(e){r(e,a)}),a.starts&&r(a.starts,i);var f=a.c.map(function(e){return e.bK?"\\.?("+e.b+")\\.?":e.b}).concat([a.tE,a.i]).map(n).filter(Boolean);a.t=f.length?t(f.join("|"),!0):{exec:function(){return null}}}}r(e)}function f(e,t,a,i){function o(e,n){for(var t=0;t<n.c.length;t++)if(r(n.c[t].bR,e))return n.c[t]}function u(e,n){if(r(e.eR,n)){for(;e.endsParent&&e.parent;)e=e.parent;return e}return e.eW?u(e.parent,n):void 0}function c(e,n){return!a&&r(n.iR,e)}function g(e,n){var t=N.cI?n[0].toLowerCase():n[0];return e.k.hasOwnProperty(t)&&e.k[t]}function h(e,n,t,r){var a=r?"":w.classPrefix,i='<span class="'+a,o=t?"":"</span>";return i+=e+'">',i+n+o}function p(){if(!L.k)return n(y);var e="",t=0;L.lR.lastIndex=0;for(var r=L.lR.exec(y);r;){e+=n(y.substr(t,r.index-t));var a=g(L,r);a?(B+=a[1],e+=h(a[0],n(r[0]))):e+=n(r[0]),t=L.lR.lastIndex,r=L.lR.exec(y)}return e+n(y.substr(t))}function d(){var e="string"==typeof L.sL;if(e&&!x[L.sL])return n(y);var t=e?f(L.sL,y,!0,M[L.sL]):l(y,L.sL.length?L.sL:void 0);return L.r>0&&(B+=t.r),e&&(M[L.sL]=t.top),h(t.language,t.value,!1,!0)}function b(){return void 0!==L.sL?d():p()}function v(e,t){var r=e.cN?h(e.cN,"",!0):"";e.rB?(k+=r,y=""):e.eB?(k+=n(t)+r,y=""):(k+=r,y=t),L=Object.create(e,{parent:{value:L}})}function m(e,t){if(y+=e,void 0===t)return k+=b(),0;var r=o(t,L);if(r)return k+=b(),v(r,t),r.rB?0:t.length;var a=u(L,t);if(a){var i=L;i.rE||i.eE||(y+=t),k+=b();do L.cN&&(k+="</span>"),B+=L.r,L=L.parent;while(L!=a.parent);return i.eE&&(k+=n(t)),y="",a.starts&&v(a.starts,""),i.rE?0:t.length}if(c(t,L))throw new Error('Illegal lexeme "'+t+'" for mode "'+(L.cN||"<unnamed>")+'"');return y+=t,t.length||1}var N=E(e);if(!N)throw new Error('Unknown language: "'+e+'"');s(N);var R,L=i||N,M={},k="";for(R=L;R!=N;R=R.parent)R.cN&&(k=h(R.cN,"",!0)+k);var y="",B=0;try{for(var C,j,I=0;;){if(L.t.lastIndex=I,C=L.t.exec(t),!C)break;j=m(t.substr(I,C.index-I),C[0]),I=C.index+j}for(m(t.substr(I)),R=L;R.parent;R=R.parent)R.cN&&(k+="</span>");return{r:B,value:k,language:e,top:L}}catch(O){if(-1!=O.message.indexOf("Illegal"))return{r:0,value:n(t)};throw O}}function l(e,t){t=t||w.languages||Object.keys(x);var r={r:0,value:n(e)},a=r;return t.forEach(function(n){if(E(n)){var t=f(n,e,!1);t.language=n,t.r>a.r&&(a=t),t.r>r.r&&(a=r,r=t)}}),a.language&&(r.second_best=a),r}function g(e){return w.tabReplace&&(e=e.replace(/^((<[^>]+>|\t)+)/gm,function(e,n){return n.replace(/\t/g,w.tabReplace)})),w.useBR&&(e=e.replace(/\n/g,"<br>")),e}function h(e,n,t){var r=n?R[n]:t,a=[e.trim()];return e.match(/\bhljs\b/)||a.push("hljs"),-1===e.indexOf(r)&&a.push(r),a.join(" ").trim()}function p(e){var n=i(e);if(!a(n)){var t;w.useBR?(t=document.createElementNS("http://www.w3.org/1999/xhtml","div"),t.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n")):t=e;var r=t.textContent,o=n?f(n,r,!0):l(r),s=u(t);if(s.length){var p=document.createElementNS("http://www.w3.org/1999/xhtml","div");p.innerHTML=o.value,o.value=c(s,u(p),r)}o.value=g(o.value),e.innerHTML=o.value,e.className=h(e.className,n,o.language),e.result={language:o.language,re:o.r},o.second_best&&(e.second_best={language:o.second_best.language,re:o.second_best.r})}}function d(e){w=o(w,e)}function b(){if(!b.called){b.called=!0;var e=document.querySelectorAll("pre code");Array.prototype.forEach.call(e,p)}}function v(){addEventListener("DOMContentLoaded",b,!1),addEventListener("load",b,!1)}function m(n,t){var r=x[n]=t(e);r.aliases&&r.aliases.forEach(function(e){R[e]=n})}function N(){return Object.keys(x)}function E(e){return x[e]||x[R[e]]}var w={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0},x={},R={};return e.highlight=f,e.highlightAuto=l,e.fixMarkup=g,e.highlightBlock=p,e.configure=d,e.initHighlighting=b,e.initHighlightingOnLoad=v,e.registerLanguage=m,e.listLanguages=N,e.getLanguage=E,e.inherit=o,e.IR="[a-zA-Z]\\w*",e.UIR="[a-zA-Z_]\\w*",e.NR="\\b\\d+(\\.\\d+)?",e.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",e.BNR="\\b(0b[01]+)",e.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",e.BE={b:"\\\\[\\s\\S]",r:0},e.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[e.BE]},e.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[e.BE]},e.PWM={b:/\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such)\b/},e.C=function(n,t,r){var a=e.inherit({cN:"comment",b:n,e:t,c:[]},r||{});return a.c.push(e.PWM),a.c.push({cN:"doctag",b:"(?:TODO|FIXME|NOTE|BUG|XXX):",r:0}),a},e.CLCM=e.C("//","$"),e.CBCM=e.C("/\\*","\\*/"),e.HCM=e.C("#","$"),e.NM={cN:"number",b:e.NR,r:0},e.CNM={cN:"number",b:e.CNR,r:0},e.BNM={cN:"number",b:e.BNR,r:0},e.CSSNM={cN:"number",b:e.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0},e.RM={cN:"regexp",b:/\//,e:/\/[gimuy]*/,i:/\n/,c:[e.BE,{b:/\[/,e:/\]/,r:0,c:[e.BE]}]},e.TM={cN:"title",b:e.IR,r:0},e.UTM={cN:"title",b:e.UIR,r:0},e});hljs.registerLanguage("javascript",function(e){return{aliases:["js"],k:{keyword:"in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"},c:[{cN:"pi",r:10,b:/^\s*['"]use (strict|asm)['"]/},e.ASM,e.QSM,{cN:"string",b:"`",e:"`",c:[e.BE,{cN:"subst",b:"\\$\\{",e:"\\}"}]},e.CLCM,e.CBCM,{cN:"number",v:[{b:"\\b(0[bB][01]+)"},{b:"\\b(0[oO][0-7]+)"},{b:e.CNR}],r:0},{b:"("+e.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[e.CLCM,e.CBCM,e.RM,{b:/</,e:/>\s*[);\]]/,r:0,sL:"xml"}],r:0},{cN:"function",bK:"function",e:/\{/,eE:!0,c:[e.inherit(e.TM,{b:/[A-Za-z$_][0-9A-Za-z$_]*/}),{cN:"params",b:/\(/,e:/\)/,eB:!0,eE:!0,c:[e.CLCM,e.CBCM],i:/["'\(]/}],i:/\[|%/},{b:/\$[(.]/},{b:"\\."+e.IR,r:0},{bK:"import",e:"[;$]",k:"import from as",c:[e.ASM,e.QSM]},{cN:"class",bK:"class",e:/[{;=]/,eE:!0,i:/[:"\[\]]/,c:[{bK:"extends"},e.UTM]}],i:/#/}});hljs.registerLanguage("php",function(e){var c={cN:"variable",b:"\\$+[a-zA-Z_-ÿ][a-zA-Z0-9_-ÿ]*"},a={cN:"preprocessor",b:/<\?(php)?|\?>/},i={cN:"string",c:[e.BE,a],v:[{b:'b"',e:'"'},{b:"b'",e:"'"},e.inherit(e.ASM,{i:null}),e.inherit(e.QSM,{i:null})]},n={v:[e.BNM,e.CNM]};return{aliases:["php3","php4","php5","php6"],cI:!0,k:"and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception default die require __FUNCTION__ enddeclare final try switch continue endfor endif declare unset true false trait goto instanceof insteadof __DIR__ __NAMESPACE__ yield finally",c:[e.CLCM,e.HCM,e.C("/\\*","\\*/",{c:[{cN:"doctag",b:"@[A-Za-z]+"},a]}),e.C("__halt_compiler.+?;",!1,{eW:!0,k:"__halt_compiler",l:e.UIR}),{cN:"string",b:"<<<['\"]?\\w+['\"]?$",e:"^\\w+;",c:[e.BE]},a,c,{b:/(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/},{cN:"function",bK:"function",e:/[;{]/,eE:!0,i:"\\$|\\[|%",c:[e.UTM,{cN:"params",b:"\\(",e:"\\)",c:["self",c,e.CBCM,i,n]}]},{cN:"class",bK:"class interface",e:"{",eE:!0,i:/[:\(\$"]/,c:[{bK:"extends implements"},e.UTM]},{bK:"namespace",e:";",i:/[\.']/,c:[e.UTM]},{bK:"use",e:";",c:[e.UTM]},{b:"=>"},i,n]}});hljs.registerLanguage("xml",function(t){var s="[A-Za-z0-9\\._:-]+",c={b:/<\?(php)?(?!\w)/,e:/\?>/,sL:"php"},e={eW:!0,i:/</,r:0,c:[c,{cN:"attribute",b:s,r:0},{b:"=",r:0,c:[{cN:"value",c:[c],v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s\/>]+/}]}]}]};return{aliases:["html","xhtml","rss","atom","xsl","plist"],cI:!0,c:[{cN:"doctype",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},t.C("<!--","-->",{r:10}),{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{title:"style"},c:[e],starts:{e:"</style>",rE:!0,sL:"css"}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{title:"script"},c:[e],starts:{e:"</script>",rE:!0,sL:["actionscript","javascript","handlebars"]}},c,{cN:"pi",b:/<\?\w+/,e:/\?>/,r:10},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"title",b:/[^ \/><\n\t]+/,r:0},e]}]}});hljs.registerLanguage("sql",function(e){var t=e.C("--","$");return{cI:!0,i:/[<>]/,c:[{cN:"operator",bK:"begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate savepoint release|0 unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup revoke",e:/;/,eW:!0,k:{keyword:"abort abs absolute acc acce accep accept access accessed accessible account acos action activate add addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias allocate allow alter always analyze ancillary and any anydata anydataset anyschema anytype apply archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound buffer_cache buffer_pool build bulk by byte byteordermark bytes c cache caching call calling cancel capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base char_length character_length characters characterset charindex charset charsetform charsetid check checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation collect colu colum column column_value columns columns_updated comment commit compact compatibility compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection consider consistent constant constraint constraints constructor container content contents context contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime customdatum cycle d data database databases datafile datafiles datalength date_add date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor deterministic diagnostics difference dimension direct_load directory disable disable_all disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div do document domain dotnet double downgrade drop dumpfile duplicate duration e each edition editionable editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding execu execut execute exempt exists exit exp expire explain export export_set extended extent external external_1 external_2 externally extract f failed failed_login_attempts failover failure far fast feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final finish first first_value fixed flash_cache flashback floor flush following follows for forall force form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ftp full function g general generated get get_format get_lock getdate getutcdate global global_name globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex hierarchy high high_priority hosts hour http i id ident_current ident_incr ident_seed identified identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile initial initialized initially initrans inmemory inner innodb input insert install instance instantiable instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists k keep keep_duplicates key keys kill l language large last|0 last_day last_insert_id last_value lax lcase lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit lines link|0 list|0 listagg little ln load load_file lob lobs local localtime localtimestamp locate locator lock|0 locked log log10 log2 logfile logfiles logging logical logical_reads_per_call logoff logon logs long loop|0 low low_priority lower lpad lrtrim ltrim m main make_set makedate maketime managed management manual map mapping mask master master_pos_wait match matched materialized max maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans md5 measures median medium member memcompress memory merge microsecond mid migration min minextents minimum mining minus minute minvalue missing mod mode model modification modify module monitoring month months mount move movement multiset mutex n name name_const names nan national native natural nav nchar nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck noswitch not nothing notice notrim novalidate now nowait nth_value nullif nulls num numb numbe nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary out outer outfile outline output over overflow overriding p package pad parallel parallel_enable parameters parent parse partial partition partitions pascal passing password password_grace_time password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction prediction_cost prediction_details prediction_probability prediction_set prepare present preserve prior priority private private_sga privileges procedural procedure procedure_analyze processlist profiles project prompt protection public publishingservername purge quarter query quick quiesce quota quotename radians raise|0 rand range rank raw read reads readsize rebuild record records recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy reject rekey relational relative relaylog release|0 release_lock relies_on relocate rely rem remainder repair repeat replace replicate replication required reset resetlogs resize resource respect restore restricted result result_cache resumable resume retention return returning returns reuse reverse revoke right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll sdo_georaster sdo_topo_geometry search sec_to_time second section securefile security seed segment self sequence sequential serializable server servererror session session_user sessions_per_user set sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone standby start starting startup statement static statistics stats_binomial_test stats_crosstab stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime t table tables tablespace tan tdo template temporary terminated tertiary_weights test than then thread through tier ties time time_format time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unpivot unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear wellformed when whene whenev wheneve whenever where while whitespace with within without work wrapped xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek",literal:"true false null",built_in:"array bigint binary bit blob boolean char character date dec decimal float int int8 integer interval number numeric real record serial serial8 smallint text varchar varying void"},c:[{cN:"string",b:"'",e:"'",c:[e.BE,{b:"''"}]},{cN:"string",b:'"',e:'"',c:[e.BE,{b:'""'}]},{cN:"string",b:"`",e:"`",c:[e.BE]},e.CNM,e.CBCM,t]},e.CBCM,t]}});hljs.registerLanguage("css",function(e){var c="[a-zA-Z-][a-zA-Z0-9_-]*",a={cN:"function",b:c+"\\(",rB:!0,eE:!0,e:"\\("},r={cN:"rule",b:/[A-Z\_\.\-]+\s*:/,rB:!0,e:";",eW:!0,c:[{cN:"attribute",b:/\S/,e:":",eE:!0,starts:{cN:"value",eW:!0,eE:!0,c:[a,e.CSSNM,e.QSM,e.ASM,e.CBCM,{cN:"hexcolor",b:"#[0-9A-Fa-f]+"},{cN:"important",b:"!important"}]}}]};return{cI:!0,i:/[=\/|'\$]/,c:[e.CBCM,r,{cN:"id",b:/\#[A-Za-z0-9_-]+/},{cN:"class",b:/\.[A-Za-z0-9_-]+/},{cN:"attr_selector",b:/\[/,e:/\]/,i:"$"},{cN:"pseudo",b:/:(:)?[a-zA-Z0-9\_\-\+\(\)"']+/},{cN:"at_rule",b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{cN:"at_rule",b:"@",e:"[{;]",c:[{cN:"keyword",b:/\S+/},{b:/\s/,eW:!0,eE:!0,r:0,c:[a,e.ASM,e.QSM,e.CSSNM]}]},{cN:"tag",b:c,r:0},{cN:"rules",b:"{",e:"}",i:/\S/,c:[e.CBCM,r]}]}});hljs.registerLanguage("json",function(e){var t={literal:"true false null"},i=[e.QSM,e.CNM],l={cN:"value",e:",",eW:!0,eE:!0,c:i,k:t},c={b:"{",e:"}",c:[{cN:"attribute",b:'\\s*"',e:'"\\s*:\\s*',eB:!0,eE:!0,c:[e.BE],i:"\\n",starts:l}],i:"\\S"},n={b:"\\[",e:"\\]",c:[e.inherit(l,{cN:null})],i:"\\S"};return i.splice(i.length,0,c,n),{c:i,k:t,i:"\\S"}});


/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {
'use strict';

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ <>]+(@|:\/)[^ <>]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^<'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)([\s\S]*?[^`])\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|\\[\[\]]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(
          cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1])
        );
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2].trim(), true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return text;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return text;
    }
  }
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = base.replace(/[^/]*$/, '');
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
  } else {
    return base + href;
  }
}
var baseUrls = {};
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false,
  baseUrl: null
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());



/*! jQuery-ui-Slider-Pips - v1.11.4 - 2016-09-04
* Copyright (c) 2016 Simon Goellner <simey.me@gmail.com>; Licensed MIT */

(function($) {

    "use strict";

    var extensionMethods = {





        // pips

        pips: function( settings ) {

            var slider = this,
                i, j, p,
                collection = "",
                mousedownHandlers,
                min = slider._valueMin(),
                max = slider._valueMax(),
                pips = ( max - min ) / slider.options.step,
                $handles = slider.element.find(".ui-slider-handle"),
                $pips;

            var options = {

                first: "label",
                /* "label", "pip", false */

                last: "label",
                /* "label", "pip", false */

                rest: "pip",
                /* "label", "pip", false */

                labels: false,
                /* [array], { first: "string", rest: [array], last: "string" }, false */

                prefix: "",
                /* "", string */

                suffix: "",
                /* "", string */

                step: ( pips > 100 ) ? Math.floor( pips * 0.05 ) : 1,
                /* number */

                formatLabel: function(value) {
                    return this.prefix + value + this.suffix;
                }
                /* function
                    must return a value to display in the pip labels */

            };

            if ( $.type( settings ) === "object" || $.type( settings ) === "undefined" ) {

                $.extend( options, settings );
                slider.element.data("pips-options", options );

            } else {

                if ( settings === "destroy" ) {

                    destroy();

                } else if ( settings === "refresh" ) {

                    slider.element.slider( "pips", slider.element.data("pips-options") );

                }

                return;

            }


            // we don't want the step ever to be a floating point or negative
            // (or 0 actually, so we'll set it to 1 in that case).
            slider.options.pipStep = Math.abs( Math.round( options.step ) ) || 1;

            // get rid of all pips that might already exist.
            slider.element
                .off( ".selectPip" )
                .addClass("ui-slider-pips")
                .find(".ui-slider-pip")
                .remove();

            // small object with functions for marking pips as selected.

            var selectPip = {

                single: function(value) {

                    this.resetClasses();

                    $pips
                        .filter(".ui-slider-pip-" + this.classLabel(value) )
                        .addClass("ui-slider-pip-selected");

                    if ( slider.options.range ) {

                        $pips.each(function(k, v) {

                            var pipVal = $(v).children(".ui-slider-label").data("value");

                            if (( slider.options.range === "min" && pipVal < value ) ||
                                ( slider.options.range === "max" && pipVal > value )) {

                                $(v).addClass("ui-slider-pip-inrange");

                            }

                        });

                    }

                },

                range: function(values) {

                    this.resetClasses();

                    for ( i = 0; i < values.length; i++ ) {

                        $pips
                            .filter(".ui-slider-pip-" + this.classLabel(values[i]) )
                            .addClass("ui-slider-pip-selected-" + ( i + 1 ) );

                    }

                    if ( slider.options.range ) {

                        $pips.each(function(k, v) {

                            var pipVal = $(v).children(".ui-slider-label").data("value");

                            if ( pipVal > values[0] && pipVal < values[1] ) {

                                $(v).addClass("ui-slider-pip-inrange");

                            }

                        });

                    }

                },

                classLabel: function(value) {

                    return value.toString().replace(".", "-");

                },

                resetClasses: function() {

                    var regex = /(^|\s*)(ui-slider-pip-selected|ui-slider-pip-inrange)(-{1,2}\d+|\s|$)/gi;

                    $pips.removeClass( function(index, css) {
                        return ( css.match(regex) || [] ).join(" ");
                    });

                }

            };

            function getClosestHandle( val ) {

                var h, k,
                    sliderVals,
                    comparedVals,
                    closestVal,
                    tempHandles = [],
                    closestHandle = 0;

                if ( slider.values() && slider.values().length ) {

                    // get the current values of the slider handles
                    sliderVals = slider.values();

                    // find the offset value from the `val` for each
                    // handle, and store it in a new array
                    comparedVals = $.map( sliderVals, function(v) {
                        return Math.abs( v - val );
                    });

                    // figure out the closest handles to the value
                    closestVal = Math.min.apply( Math, comparedVals );

                    // if a comparedVal is the closestVal, then
                    // set the value accordingly, and set the closest handle.
                    for ( h = 0; h < comparedVals.length; h++ ) {
                        if ( comparedVals[h] === closestVal ) {
                            tempHandles.push(h);
                        }
                    }

                    // set the closest handle to the first handle in array,
                    // just incase we have no _lastChangedValue to compare to.
                    closestHandle = tempHandles[0];

                    // now we want to find out if any of the closest handles were
                    // the last changed handle, if so we specify that handle to change
                    for ( k = 0; k < tempHandles.length; k++ ) {
                        if ( slider._lastChangedValue === tempHandles[k] ) {
                            closestHandle = tempHandles[k];
                        }
                    }

                    if ( slider.options.range && tempHandles.length === 2 ) {

                        if ( val > sliderVals[1] ) {

                            closestHandle = tempHandles[1];

                        } else if ( val < sliderVals[0] ) {

                            closestHandle = tempHandles[0];

                        }

                    }

                }

                return closestHandle;

            }

            function destroy() {

                slider.element
                    .off(".selectPip")
                    .on("mousedown.slider", slider.element.data("mousedown-original") )
                    .removeClass("ui-slider-pips")
                    .find(".ui-slider-pip")
                    .remove();

            }

            // when we click on a label, we want to make sure the
            // slider's handle actually goes to that label!
            // so we check all the handles and see which one is closest
            // to the label we clicked. If 2 handles are equidistant then
            // we move both of them. We also want to trigger focus on the
            // handle.

            // without this method the label is just treated like a part
            // of the slider and there's no accuracy in the selected value

            function labelClick( label, e ) {

                if (slider.option("disabled")) {
                    return;
                }

                var val = $(label).data("value"),
                    indexToChange = getClosestHandle( val );

                if ( slider.values() && slider.values().length ) {

                    slider.options.values[ indexToChange ] = slider._trimAlignValue( val );

                } else {

                    slider.options.value = slider._trimAlignValue( val );

                }

                slider._refreshValue();
                slider._change( e, indexToChange );

            }

            // method for creating a pip. We loop this for creating all
            // the pips.

            function createPip( which ) {

                var label,
                    percent,
                    number = which,
                    classes = "ui-slider-pip",
                    css = "",
                    value = slider.value(),
                    values = slider.values(),
                    labelValue,
                    classLabel,
                    labelIndex;

                if ( which === "first" ) {

                    number = 0;

                } else if ( which === "last" ) {

                    number = pips;

                }

                // labelValue is the actual value of the pip based on the min/step
                labelValue = min + ( slider.options.step * number );

                // classLabel replaces any decimals with hyphens
                classLabel = labelValue.toString().replace(".", "-");

                // get the index needed for selecting labels out of the array
                labelIndex = ( number + min ) - min;

                // we need to set the human-readable label to either the
                // corresponding element in the array, or the appropriate
                // item in the object... or an empty string.

                if ( $.type(options.labels) === "array" ) {

                    label = options.labels[ labelIndex ] || "";

                } else if ( $.type( options.labels ) === "object" ) {

                    if ( which === "first" ) {

                        // set first label
                        label = options.labels.first || "";

                    } else if ( which === "last" ) {

                        // set last label
                        label = options.labels.last || "";

                    } else if ( $.type( options.labels.rest ) === "array" ) {

                        // set other labels, but our index should start at -1
                        // because of the first pip.
                        label = options.labels.rest[ labelIndex - 1 ] || "";

                    } else {

                        // urrggh, the options must be f**ked, just show nothing.
                        label = labelValue;

                    }

                } else {

                    label = labelValue;

                }




                if ( which === "first" ) {

                    // first Pip on the Slider
                    percent = "0%";

                    classes += " ui-slider-pip-first";
                    classes += ( options.first === "label" ) ? " ui-slider-pip-label" : "";
                    classes += ( options.first === false ) ? " ui-slider-pip-hide" : "";

                } else if ( which === "last" ) {

                    // last Pip on the Slider
                    percent = "100%";

                    classes += " ui-slider-pip-last";
                    classes += ( options.last === "label" ) ? " ui-slider-pip-label" : "";
                    classes += ( options.last === false ) ? " ui-slider-pip-hide" : "";

                } else {

                    // all other Pips
                    percent = (( 100 / pips ) * which ).toFixed(4) + "%";

                    classes += ( options.rest === "label" ) ? " ui-slider-pip-label" : "";
                    classes += ( options.rest === false ) ? " ui-slider-pip-hide" : "";

                }

                classes += " ui-slider-pip-" + classLabel;


                // add classes for the initial-selected values.
                if ( values && values.length ) {

                    for ( i = 0; i < values.length; i++ ) {

                        if ( labelValue === values[i] ) {

                            classes += " ui-slider-pip-initial-" + ( i + 1 );
                            classes += " ui-slider-pip-selected-" + ( i + 1 );

                        }

                    }

                    if ( slider.options.range ) {

                        if ( labelValue > values[0] && 
                            labelValue < values[1] ) {

                            classes += " ui-slider-pip-inrange";

                        }

                    }

                } else {

                    if ( labelValue === value ) {

                        classes += " ui-slider-pip-initial";
                        classes += " ui-slider-pip-selected";

                    }

                    if ( slider.options.range ) {

                        if (( slider.options.range === "min" && labelValue < value ) ||
                            ( slider.options.range === "max" && labelValue > value )) {

                            classes += " ui-slider-pip-inrange";

                        }

                    }

                }



                css = ( slider.options.orientation === "horizontal" ) ?
                    "left: " + percent :
                    "bottom: " + percent;


                // add this current pip to the collection
                return "<span class=\"" + classes + "\" style=\"" + css + "\">" +
                            "<span class=\"ui-slider-line\"></span>" +
                            "<span class=\"ui-slider-label\" data-value=\"" +
                                labelValue + "\">" + options.formatLabel(label) + "</span>" +
                        "</span>";

            }

            // create our first pip
            collection += createPip("first");

            // for every stop in the slider where we need a pip; create one.
            for ( p = slider.options.pipStep; p < pips; p += slider.options.pipStep ) {
                collection += createPip( p );
            }

            // create our last pip
            collection += createPip("last");

            // append the collection of pips.
            slider.element.append( collection );

            // store the pips for setting classes later.
            $pips = slider.element.find(".ui-slider-pip");



            // store the mousedown handlers for later, just in case we reset
            // the slider, the handler would be lost!

            if ( $._data( slider.element.get(0), "events").mousedown &&
                $._data( slider.element.get(0), "events").mousedown.length ) {

                mousedownHandlers = $._data( slider.element.get(0), "events").mousedown;

            } else {

                mousedownHandlers = slider.element.data("mousedown-handlers");

            }

            slider.element.data("mousedown-handlers", mousedownHandlers.slice() );

            // loop through all the mousedown handlers on the slider,
            // and store the original namespaced (.slider) event handler so
            // we can trigger it later.
            for ( j = 0; j < mousedownHandlers.length; j++ ) {
                if ( mousedownHandlers[j].namespace === "slider" ) {
                    slider.element.data("mousedown-original", mousedownHandlers[j].handler );
                }
            }

            // unbind the mousedown.slider event, because it interferes with
            // the labelClick() method (stops smooth animation), and decide
            // if we want to trigger the original event based on which element
            // was clicked.
            slider.element
                .off("mousedown.slider")
                .on("mousedown.selectPip", function(e) {

                    var $target = $(e.target),
                        closest = getClosestHandle( $target.data("value") ),
                        $handle = $handles.eq( closest );

                    $handle.addClass("ui-state-active");

                    if ( $target.is(".ui-slider-label") ) {

                        labelClick( $target, e );

                        slider.element
                            .one("mouseup.selectPip", function() {

                                $handle
                                    .removeClass("ui-state-active")
                                    .focus();

                            });

                    } else {

                        var originalMousedown = slider.element.data("mousedown-original");
                        originalMousedown(e);

                    }

                });




            slider.element.on( "slide.selectPip slidechange.selectPip", function(e, ui) {

                var $slider = $(this),
                    value = $slider.slider("value"),
                    values = $slider.slider("values");

                if ( ui ) {

                    value = ui.value;
                    values = ui.values;

                }

                if ( slider.values() && slider.values().length ) {

                    selectPip.range( values );

                } else {

                    selectPip.single( value );

                }

            });




        },








        // floats

        float: function( settings ) {

            var i,
                slider = this,
                min = slider._valueMin(),
                max = slider._valueMax(),
                value = slider._value(),
                values = slider._values(),
                tipValues = [],
                $handles = slider.element.find(".ui-slider-handle");

            var options = {

                handle: true,
                /* false */

                pips: false,
                /* true */

                labels: false,
                /* [array], { first: "string", rest: [array], last: "string" }, false */

                prefix: "",
                /* "", string */

                suffix: "",
                /* "", string */

                event: "slidechange slide",
                /* "slidechange", "slide", "slidechange slide" */

                formatLabel: function(value) {
                    return this.prefix + value + this.suffix;
                }
                /* function
                    must return a value to display in the floats */

            };

            if ( $.type( settings ) === "object" || $.type( settings ) === "undefined" ) {

                $.extend( options, settings );
                slider.element.data("float-options", options );

            } else {

                if ( settings === "destroy" ) {

                    destroy();

                } else if ( settings === "refresh" ) {

                    slider.element.slider( "float", slider.element.data("float-options") );

                }

                return;

            }




            if ( value < min ) {
                value = min;
            }

            if ( value > max ) {
                value = max;
            }

            if ( values && values.length ) {

                for ( i = 0; i < values.length; i++ ) {

                    if ( values[i] < min ) {
                        values[i] = min;
                    }

                    if ( values[i] > max ) {
                        values[i] = max;
                    }

                }

            }

            // add a class for the CSS
            slider.element
                .addClass("ui-slider-float")
                .find(".ui-slider-tip, .ui-slider-tip-label")
                .remove();



            function destroy() {

                slider.element
                    .off(".sliderFloat")
                    .removeClass("ui-slider-float")
                    .find(".ui-slider-tip, .ui-slider-tip-label")
                    .remove();

            }


            function getPipLabels( values ) {

                // when checking the array we need to divide
                // by the step option, so we store those values here.

                var vals = [],
                    steppedVals = $.map( values, function(v) {
                        return Math.ceil(( v - min ) / slider.options.step);
                    });

                // now we just get the values we need to return
                // by looping through the values array and assigning the
                // label if it exists.

                if ( $.type( options.labels ) === "array" ) {

                    for ( i = 0; i < values.length; i++ ) {

                        vals[i] = options.labels[ steppedVals[i] ] || values[i];

                    }

                } else if ( $.type( options.labels ) === "object" ) {

                    for ( i = 0; i < values.length; i++ ) {

                        if ( values[i] === min ) {

                            vals[i] = options.labels.first || min;

                        } else if ( values[i] === max ) {

                            vals[i] = options.labels.last || max;

                        } else if ( $.type( options.labels.rest ) === "array" ) {

                            vals[i] = options.labels.rest[ steppedVals[i] - 1 ] || values[i];

                        } else {

                            vals[i] = values[i];

                        }

                    }

                } else {

                    for ( i = 0; i < values.length; i++ ) {

                        vals[i] = values[i];

                    }

                }

                return vals;

            }

            // apply handle tip if settings allows.
            if ( options.handle ) {

                // we need to set the human-readable label to either the
                // corresponding element in the array, or the appropriate
                // item in the object... or an empty string.

                tipValues = ( slider.values() && slider.values().length ) ?
                    getPipLabels( values ) :
                    getPipLabels( [ value ] );

                for ( i = 0; i < tipValues.length; i++ ) {

                    $handles
                        .eq( i )
                        .append( $("<span class=\"ui-slider-tip\">"+ options.formatLabel(tipValues[i]) +"</span>") );

                }

            }

            if ( options.pips ) {

                // if this slider also has pip-labels, we make those into tips, too.
                slider.element.find(".ui-slider-label").each(function(k, v) {

                    var $this = $(v),
                        val = [ $this.data("value") ],
                        label,
                        $tip;


                    label = options.formatLabel( getPipLabels( val )[0] );

                    // create a tip element
                    $tip =
                        $("<span class=\"ui-slider-tip-label\">" + label + "</span>")
                            .insertAfter( $this );

                });

            }

            // check that the event option is actually valid against our
            // own list of the slider's events.
            if ( options.event !== "slide" &&
                options.event !== "slidechange" &&
                options.event !== "slide slidechange" &&
                options.event !== "slidechange slide" ) {

                options.event = "slidechange slide";

            }

            // when slider changes, update handle tip label.
            slider.element
                .off(".sliderFloat")
                .on( options.event + ".sliderFloat", function( e, ui ) {

                    var uiValue = ( $.type( ui.value ) === "array" ) ? ui.value : [ ui.value ],
                        val = options.formatLabel( getPipLabels( uiValue )[0] );

                    $(ui.handle)
                        .find(".ui-slider-tip")
                        .html( val );

                });

        }

    };

    $.extend(true, $.ui.slider.prototype, extensionMethods);

})(jQuery);



/**
 * sifter.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('sifter', factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.Sifter = factory();
	}
}(this, function() {

	/**
	 * Textually searches arrays and hashes of objects
	 * by property (or multiple properties). Designed
	 * specifically for autocomplete.
	 *
	 * @constructor
	 * @param {array|object} items
	 * @param {object} items
	 */
	var Sifter = function(items, settings) {
		this.items = items;
		this.settings = settings || {diacritics: true};
	};

	/**
	 * Splits a search string into an array of individual
	 * regexps to be used to match results.
	 *
	 * @param {string} query
	 * @returns {array}
	 */
	Sifter.prototype.tokenize = function(query) {
		query = trim(String(query || '').toLowerCase());
		if (!query || !query.length) return [];

		var i, n, regex, letter;
		var tokens = [];
		var words = query.split(/ +/);

		for (i = 0, n = words.length; i < n; i++) {
			regex = escape_regex(words[i]);
			if (this.settings.diacritics) {
				for (letter in DIACRITICS) {
					if (DIACRITICS.hasOwnProperty(letter)) {
						regex = regex.replace(new RegExp(letter, 'g'), DIACRITICS[letter]);
					}
				}
			}
			tokens.push({
				string : words[i],
				regex  : new RegExp(regex, 'i')
			});
		}

		return tokens;
	};

	/**
	 * Iterates over arrays and hashes.
	 *
	 * ```
	 * this.iterator(this.items, function(item, id) {
	 *    // invoked for each item
	 * });
	 * ```
	 *
	 * @param {array|object} object
	 */
	Sifter.prototype.iterator = function(object, callback) {
		var iterator;
		if (is_array(object)) {
			iterator = Array.prototype.forEach || function(callback) {
				for (var i = 0, n = this.length; i < n; i++) {
					callback(this[i], i, this);
				}
			};
		} else {
			iterator = function(callback) {
				for (var key in this) {
					if (this.hasOwnProperty(key)) {
						callback(this[key], key, this);
					}
				}
			};
		}

		iterator.apply(object, [callback]);
	};

	/**
	 * Returns a function to be used to score individual results.
	 *
	 * Good matches will have a higher score than poor matches.
	 * If an item is not a match, 0 will be returned by the function.
	 *
	 * @param {object|string} search
	 * @param {object} options (optional)
	 * @returns {function}
	 */
	Sifter.prototype.getScoreFunction = function(search, options) {
		var self, fields, tokens, token_count, nesting;

		self        = this;
		search      = self.prepareSearch(search, options);
		tokens      = search.tokens;
		fields      = search.options.fields;
		token_count = tokens.length;
		nesting     = search.options.nesting;

		/**
		 * Calculates how close of a match the
		 * given value is against a search token.
		 *
		 * @param {mixed} value
		 * @param {object} token
		 * @return {number}
		 */
		var scoreValue = function(value, token) {
			var score, pos;

			if (!value) return 0;
			value = String(value || '');
			pos = value.search(token.regex);
			if (pos === -1) return 0;
			score = token.string.length / value.length;
			if (pos === 0) score += 0.5;
			return score;
		};

		/**
		 * Calculates the score of an object
		 * against the search query.
		 *
		 * @param {object} token
		 * @param {object} data
		 * @return {number}
		 */
		var scoreObject = (function() {
			var field_count = fields.length;
			if (!field_count) {
				return function() { return 0; };
			}
			if (field_count === 1) {
				return function(token, data) {
					return scoreValue(getattr(data, fields[0], nesting), token);
				};
			}
			return function(token, data) {
				for (var i = 0, sum = 0; i < field_count; i++) {
					sum += scoreValue(getattr(data, fields[i], nesting), token);
				}
				return sum / field_count;
			};
		})();

		if (!token_count) {
			return function() { return 0; };
		}
		if (token_count === 1) {
			return function(data) {
				return scoreObject(tokens[0], data);
			};
		}

		if (search.options.conjunction === 'and') {
			return function(data) {
				var score;
				for (var i = 0, sum = 0; i < token_count; i++) {
					score = scoreObject(tokens[i], data);
					if (score <= 0) return 0;
					sum += score;
				}
				return sum / token_count;
			};
		} else {
			return function(data) {
				for (var i = 0, sum = 0; i < token_count; i++) {
					sum += scoreObject(tokens[i], data);
				}
				return sum / token_count;
			};
		}
	};

	/**
	 * Returns a function that can be used to compare two
	 * results, for sorting purposes. If no sorting should
	 * be performed, `null` will be returned.
	 *
	 * @param {string|object} search
	 * @param {object} options
	 * @return function(a,b)
	 */
	Sifter.prototype.getSortFunction = function(search, options) {
		var i, n, self, field, fields, fields_count, multiplier, multipliers, get_field, implicit_score, sort;

		self   = this;
		search = self.prepareSearch(search, options);
		sort   = (!search.query && options.sort_empty) || options.sort;

		/**
		 * Fetches the specified sort field value
		 * from a search result item.
		 *
		 * @param  {string} name
		 * @param  {object} result
		 * @return {mixed}
		 */
		get_field = function(name, result) {
			if (name === '$score') return result.score;
			return getattr(self.items[result.id], name, options.nesting);
		};

		// parse options
		fields = [];
		if (sort) {
			for (i = 0, n = sort.length; i < n; i++) {
				if (search.query || sort[i].field !== '$score') {
					fields.push(sort[i]);
				}
			}
		}

		// the "$score" field is implied to be the primary
		// sort field, unless it's manually specified
		if (search.query) {
			implicit_score = true;
			for (i = 0, n = fields.length; i < n; i++) {
				if (fields[i].field === '$score') {
					implicit_score = false;
					break;
				}
			}
			if (implicit_score) {
				fields.unshift({field: '$score', direction: 'desc'});
			}
		} else {
			for (i = 0, n = fields.length; i < n; i++) {
				if (fields[i].field === '$score') {
					fields.splice(i, 1);
					break;
				}
			}
		}

		multipliers = [];
		for (i = 0, n = fields.length; i < n; i++) {
			multipliers.push(fields[i].direction === 'desc' ? -1 : 1);
		}

		// build function
		fields_count = fields.length;
		if (!fields_count) {
			return null;
		} else if (fields_count === 1) {
			field = fields[0].field;
			multiplier = multipliers[0];
			return function(a, b) {
				return multiplier * cmp(
					get_field(field, a),
					get_field(field, b)
				);
			};
		} else {
			return function(a, b) {
				var i, result, a_value, b_value, field;
				for (i = 0; i < fields_count; i++) {
					field = fields[i].field;
					result = multipliers[i] * cmp(
						get_field(field, a),
						get_field(field, b)
					);
					if (result) return result;
				}
				return 0;
			};
		}
	};

	/**
	 * Parses a search query and returns an object
	 * with tokens and fields ready to be populated
	 * with results.
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
	Sifter.prototype.prepareSearch = function(query, options) {
		if (typeof query === 'object') return query;

		options = extend({}, options);

		var option_fields     = options.fields;
		var option_sort       = options.sort;
		var option_sort_empty = options.sort_empty;

		if (option_fields && !is_array(option_fields)) options.fields = [option_fields];
		if (option_sort && !is_array(option_sort)) options.sort = [option_sort];
		if (option_sort_empty && !is_array(option_sort_empty)) options.sort_empty = [option_sort_empty];

		return {
			options : options,
			query   : String(query || '').toLowerCase(),
			tokens  : this.tokenize(query),
			total   : 0,
			items   : []
		};
	};

	/**
	 * Searches through all items and returns a sorted array of matches.
	 *
	 * The `options` parameter can contain:
	 *
	 *   - fields {string|array}
	 *   - sort {array}
	 *   - score {function}
	 *   - filter {bool}
	 *   - limit {integer}
	 *
	 * Returns an object containing:
	 *
	 *   - options {object}
	 *   - query {string}
	 *   - tokens {array}
	 *   - total {int}
	 *   - items {array}
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
	Sifter.prototype.search = function(query, options) {
		var self = this, value, score, search, calculateScore;
		var fn_sort;
		var fn_score;

		search  = this.prepareSearch(query, options);
		options = search.options;
		query   = search.query;

		// generate result scoring function
		fn_score = options.score || self.getScoreFunction(search);

		// perform search and sort
		if (query.length) {
			self.iterator(self.items, function(item, id) {
				score = fn_score(item);
				if (options.filter === false || score > 0) {
					search.items.push({'score': score, 'id': id});
				}
			});
		} else {
			self.iterator(self.items, function(item, id) {
				search.items.push({'score': 1, 'id': id});
			});
		}

		fn_sort = self.getSortFunction(search, options);
		if (fn_sort) search.items.sort(fn_sort);

		// apply limits
		search.total = search.items.length;
		if (typeof options.limit === 'number') {
			search.items = search.items.slice(0, options.limit);
		}

		return search;
	};

	// utilities
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var cmp = function(a, b) {
		if (typeof a === 'number' && typeof b === 'number') {
			return a > b ? 1 : (a < b ? -1 : 0);
		}
		a = asciifold(String(a || ''));
		b = asciifold(String(b || ''));
		if (a > b) return 1;
		if (b > a) return -1;
		return 0;
	};

	var extend = function(a, b) {
		var i, n, k, object;
		for (i = 1, n = arguments.length; i < n; i++) {
			object = arguments[i];
			if (!object) continue;
			for (k in object) {
				if (object.hasOwnProperty(k)) {
					a[k] = object[k];
				}
			}
		}
		return a;
	};

	/**
	 * A property getter resolving dot-notation
	 * @param  {Object}  obj     The root object to fetch property on
	 * @param  {String}  name    The optionally dotted property name to fetch
	 * @param  {Boolean} nesting Handle nesting or not
	 * @return {Object}          The resolved property value
	 */
	var getattr = function(obj, name, nesting) {
	    if (!obj || !name) return;
	    if (!nesting) return obj[name];
	    var names = name.split(".");
	    while(names.length && (obj = obj[names.shift()]));
	    return obj;
	};

	var trim = function(str) {
		return (str + '').replace(/^\s+|\s+$|/g, '');
	};

	var escape_regex = function(str) {
		return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	};

	var is_array = Array.isArray || (typeof $ !== 'undefined' && $.isArray) || function(object) {
		return Object.prototype.toString.call(object) === '[object Array]';
	};

	var DIACRITICS = {
		'a': '[aḀḁĂăÂâǍǎȺⱥȦȧẠạÄäÀàÁáĀāÃãÅåąĄÃąĄ]',
		'b': '[b␢βΒB฿𐌁ᛒ]',
		'c': '[cĆćĈĉČčĊċC̄c̄ÇçḈḉȻȼƇƈɕᴄＣｃ]',
		'd': '[dĎďḊḋḐḑḌḍḒḓḎḏĐđD̦d̦ƉɖƊɗƋƌᵭᶁᶑȡᴅＤｄð]',
		'e': '[eÉéÈèÊêḘḙĚěĔĕẼẽḚḛẺẻĖėËëĒēȨȩĘęᶒɆɇȄȅẾếỀềỄễỂểḜḝḖḗḔḕȆȇẸẹỆệⱸᴇＥｅɘǝƏƐε]',
		'f': '[fƑƒḞḟ]',
		'g': '[gɢ₲ǤǥĜĝĞğĢģƓɠĠġ]',
		'h': '[hĤĥĦħḨḩẖẖḤḥḢḣɦʰǶƕ]',
		'i': '[iÍíÌìĬĭÎîǏǐÏïḮḯĨĩĮįĪīỈỉȈȉȊȋỊịḬḭƗɨɨ̆ᵻᶖİiIıɪＩｉ]',
		'j': '[jȷĴĵɈɉʝɟʲ]',
		'k': '[kƘƙꝀꝁḰḱǨǩḲḳḴḵκϰ₭]',
		'l': '[lŁłĽľĻļĹĺḶḷḸḹḼḽḺḻĿŀȽƚⱠⱡⱢɫɬᶅɭȴʟＬｌ]',
		'n': '[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲȠƞᵰᶇɳȵɴＮｎŊŋ]',
		'o': '[oØøÖöÓóÒòÔôǑǒŐőŎŏȮȯỌọƟɵƠơỎỏŌōÕõǪǫȌȍՕօ]',
		'p': '[pṔṕṖṗⱣᵽƤƥᵱ]',
		'q': '[qꝖꝗʠɊɋꝘꝙq̃]',
		'r': '[rŔŕɌɍŘřŖŗṘṙȐȑȒȓṚṛⱤɽ]',
		's': '[sŚśṠṡṢṣꞨꞩŜŝŠšŞşȘșS̈s̈]',
		't': '[tŤťṪṫŢţṬṭƮʈȚțṰṱṮṯƬƭ]',
		'u': '[uŬŭɄʉỤụÜüÚúÙùÛûǓǔŰűŬŭƯưỦủŪūŨũŲųȔȕ∪]',
		'v': '[vṼṽṾṿƲʋꝞꝟⱱʋ]',
		'w': '[wẂẃẀẁŴŵẄẅẆẇẈẉ]',
		'x': '[xẌẍẊẋχ]',
		'y': '[yÝýỲỳŶŷŸÿỸỹẎẏỴỵɎɏƳƴ]',
		'z': '[zŹźẐẑŽžŻżẒẓẔẕƵƶ]'
	};

	var asciifold = (function() {
		var i, n, k, chunk;
		var foreignletters = '';
		var lookup = {};
		for (k in DIACRITICS) {
			if (DIACRITICS.hasOwnProperty(k)) {
				chunk = DIACRITICS[k].substring(2, DIACRITICS[k].length - 1);
				foreignletters += chunk;
				for (i = 0, n = chunk.length; i < n; i++) {
					lookup[chunk.charAt(i)] = k;
				}
			}
		}
		var regexp = new RegExp('[' +  foreignletters + ']', 'g');
		return function(str) {
			return str.replace(regexp, function(foreignletter) {
				return lookup[foreignletter];
			}).toLowerCase();
		};
	})();


	// export
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	return Sifter;
}));



/**
 * microplugin.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('microplugin', factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.MicroPlugin = factory();
	}
}(this, function() {
	var MicroPlugin = {};

	MicroPlugin.mixin = function(Interface) {
		Interface.plugins = {};

		/**
		 * Initializes the listed plugins (with options).
		 * Acceptable formats:
		 *
		 * List (without options):
		 *   ['a', 'b', 'c']
		 *
		 * List (with options):
		 *   [{'name': 'a', options: {}}, {'name': 'b', options: {}}]
		 *
		 * Hash (with options):
		 *   {'a': { ... }, 'b': { ... }, 'c': { ... }}
		 *
		 * @param {mixed} plugins
		 */
		Interface.prototype.initializePlugins = function(plugins) {
			var i, n, key;
			var self  = this;
			var queue = [];

			self.plugins = {
				names     : [],
				settings  : {},
				requested : {},
				loaded    : {}
			};

			if (utils.isArray(plugins)) {
				for (i = 0, n = plugins.length; i < n; i++) {
					if (typeof plugins[i] === 'string') {
						queue.push(plugins[i]);
					} else {
						self.plugins.settings[plugins[i].name] = plugins[i].options;
						queue.push(plugins[i].name);
					}
				}
			} else if (plugins) {
				for (key in plugins) {
					if (plugins.hasOwnProperty(key)) {
						self.plugins.settings[key] = plugins[key];
						queue.push(key);
					}
				}
			}

			while (queue.length) {
				self.require(queue.shift());
			}
		};

		Interface.prototype.loadPlugin = function(name) {
			var self    = this;
			var plugins = self.plugins;
			var plugin  = Interface.plugins[name];

			if (!Interface.plugins.hasOwnProperty(name)) {
				throw new Error('Unable to find "' +  name + '" plugin');
			}

			plugins.requested[name] = true;
			plugins.loaded[name] = plugin.fn.apply(self, [self.plugins.settings[name] || {}]);
			plugins.names.push(name);
		};

		/**
		 * Initializes a plugin.
		 *
		 * @param {string} name
		 */
		Interface.prototype.require = function(name) {
			var self = this;
			var plugins = self.plugins;

			if (!self.plugins.loaded.hasOwnProperty(name)) {
				if (plugins.requested[name]) {
					throw new Error('Plugin has circular dependency ("' + name + '")');
				}
				self.loadPlugin(name);
			}

			return plugins.loaded[name];
		};

		/**
		 * Registers a plugin.
		 *
		 * @param {string} name
		 * @param {function} fn
		 */
		Interface.define = function(name, fn) {
			Interface.plugins[name] = {
				'name' : name,
				'fn'   : fn
			};
		};
	};

	var utils = {
		isArray: Array.isArray || function(vArg) {
			return Object.prototype.toString.call(vArg) === '[object Array]';
		}
	};

	return MicroPlugin;
}));

/**
 * selectize.js (v0.12.4)
 * Copyright (c) 2013–2015 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

/*jshint curly:false */
/*jshint browser:true */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('selectize', ['jquery','sifter','microplugin'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'), require('sifter'), require('microplugin'));
	} else {
		root.Selectize = factory(root.jQuery, root.Sifter, root.MicroPlugin);
	}
}(this, function($, Sifter, MicroPlugin) {
	'use strict';

	var highlight = function($element, pattern) {
		if (typeof pattern === 'string' && !pattern.length) return;
		var regex = (typeof pattern === 'string') ? new RegExp(pattern, 'i') : pattern;
	
		var highlight = function(node) {
			var skip = 0;
			if (node.nodeType === 3) {
				var pos = node.data.search(regex);
				if (pos >= 0 && node.data.length > 0) {
					var match = node.data.match(regex);
					var spannode = document.createElement('span');
					spannode.className = 'highlight';
					var middlebit = node.splitText(pos);
					var endbit = middlebit.splitText(match[0].length);
					var middleclone = middlebit.cloneNode(true);
					spannode.appendChild(middleclone);
					middlebit.parentNode.replaceChild(spannode, middlebit);
					skip = 1;
				}
			} else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
				for (var i = 0; i < node.childNodes.length; ++i) {
					i += highlight(node.childNodes[i]);
				}
			}
			return skip;
		};
	
		return $element.each(function() {
			highlight(this);
		});
	};
	
	/**
	 * removeHighlight fn copied from highlight v5 and
	 * edited to remove with() and pass js strict mode
	 */
	$.fn.removeHighlight = function() {
		return this.find("span.highlight").each(function() {
			this.parentNode.firstChild.nodeName;
			var parent = this.parentNode;
			parent.replaceChild(this.firstChild, this);
			parent.normalize();
		}).end();
	};
	
	
	var MicroEvent = function() {};
	MicroEvent.prototype = {
		on: function(event, fct){
			this._events = this._events || {};
			this._events[event] = this._events[event] || [];
			this._events[event].push(fct);
		},
		off: function(event, fct){
			var n = arguments.length;
			if (n === 0) return delete this._events;
			if (n === 1) return delete this._events[event];
	
			this._events = this._events || {};
			if (event in this._events === false) return;
			this._events[event].splice(this._events[event].indexOf(fct), 1);
		},
		trigger: function(event /* , args... */){
			this._events = this._events || {};
			if (event in this._events === false) return;
			for (var i = 0; i < this._events[event].length; i++){
				this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}
	};
	
	/**
	 * Mixin will delegate all MicroEvent.js function in the destination object.
	 *
	 * - MicroEvent.mixin(Foobar) will make Foobar able to use MicroEvent
	 *
	 * @param {object} the object which will support MicroEvent
	 */
	MicroEvent.mixin = function(destObject){
		var props = ['on', 'off', 'trigger'];
		for (var i = 0; i < props.length; i++){
			destObject.prototype[props[i]] = MicroEvent.prototype[props[i]];
		}
	};
	
	var IS_MAC        = /Mac/.test(navigator.userAgent);
	
	var KEY_A         = 65;
	var KEY_COMMA     = 188;
	var KEY_RETURN    = 13;
	var KEY_ESC       = 27;
	var KEY_LEFT      = 37;
	var KEY_UP        = 38;
	var KEY_P         = 80;
	var KEY_RIGHT     = 39;
	var KEY_DOWN      = 40;
	var KEY_N         = 78;
	var KEY_BACKSPACE = 8;
	var KEY_DELETE    = 46;
	var KEY_SHIFT     = 16;
	var KEY_CMD       = IS_MAC ? 91 : 17;
	var KEY_CTRL      = IS_MAC ? 18 : 17;
	var KEY_TAB       = 9;
	
	var TAG_SELECT    = 1;
	var TAG_INPUT     = 2;
	
	// for now, android support in general is too spotty to support validity
	var SUPPORTS_VALIDITY_API = !/android/i.test(window.navigator.userAgent) && !!document.createElement('input').validity;
	
	
	var isset = function(object) {
		return typeof object !== 'undefined';
	};
	
	/**
	 * Converts a scalar to its best string representation
	 * for hash keys and HTML attribute values.
	 *
	 * Transformations:
	 *   'str'     -> 'str'
	 *   null      -> ''
	 *   undefined -> ''
	 *   true      -> '1'
	 *   false     -> '0'
	 *   0         -> '0'
	 *   1         -> '1'
	 *
	 * @param {string} value
	 * @returns {string|null}
	 */
	var hash_key = function(value) {
		if (typeof value === 'undefined' || value === null) return null;
		if (typeof value === 'boolean') return value ? '1' : '0';
		return value + '';
	};
	
	/**
	 * Escapes a string for use within HTML.
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	var escape_html = function(str) {
		return (str + '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	};
	
	/**
	 * Escapes "$" characters in replacement strings.
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	var escape_replace = function(str) {
		return (str + '').replace(/\$/g, '$$$$');
	};
	
	var hook = {};
	
	/**
	 * Wraps `method` on `self` so that `fn`
	 * is invoked before the original method.
	 *
	 * @param {object} self
	 * @param {string} method
	 * @param {function} fn
	 */
	hook.before = function(self, method, fn) {
		var original = self[method];
		self[method] = function() {
			fn.apply(self, arguments);
			return original.apply(self, arguments);
		};
	};
	
	/**
	 * Wraps `method` on `self` so that `fn`
	 * is invoked after the original method.
	 *
	 * @param {object} self
	 * @param {string} method
	 * @param {function} fn
	 */
	hook.after = function(self, method, fn) {
		var original = self[method];
		self[method] = function() {
			var result = original.apply(self, arguments);
			fn.apply(self, arguments);
			return result;
		};
	};
	
	/**
	 * Wraps `fn` so that it can only be invoked once.
	 *
	 * @param {function} fn
	 * @returns {function}
	 */
	var once = function(fn) {
		var called = false;
		return function() {
			if (called) return;
			called = true;
			fn.apply(this, arguments);
		};
	};
	
	/**
	 * Wraps `fn` so that it can only be called once
	 * every `delay` milliseconds (invoked on the falling edge).
	 *
	 * @param {function} fn
	 * @param {int} delay
	 * @returns {function}
	 */
	var debounce = function(fn, delay) {
		var timeout;
		return function() {
			var self = this;
			var args = arguments;
			window.clearTimeout(timeout);
			timeout = window.setTimeout(function() {
				fn.apply(self, args);
			}, delay);
		};
	};
	
	/**
	 * Debounce all fired events types listed in `types`
	 * while executing the provided `fn`.
	 *
	 * @param {object} self
	 * @param {array} types
	 * @param {function} fn
	 */
	var debounce_events = function(self, types, fn) {
		var type;
		var trigger = self.trigger;
		var event_args = {};
	
		// override trigger method
		self.trigger = function() {
			var type = arguments[0];
			if (types.indexOf(type) !== -1) {
				event_args[type] = arguments;
			} else {
				return trigger.apply(self, arguments);
			}
		};
	
		// invoke provided function
		fn.apply(self, []);
		self.trigger = trigger;
	
		// trigger queued events
		for (type in event_args) {
			if (event_args.hasOwnProperty(type)) {
				trigger.apply(self, event_args[type]);
			}
		}
	};
	
	/**
	 * A workaround for http://bugs.jquery.com/ticket/6696
	 *
	 * @param {object} $parent - Parent element to listen on.
	 * @param {string} event - Event name.
	 * @param {string} selector - Descendant selector to filter by.
	 * @param {function} fn - Event handler.
	 */
	var watchChildEvent = function($parent, event, selector, fn) {
		$parent.on(event, selector, function(e) {
			var child = e.target;
			while (child && child.parentNode !== $parent[0]) {
				child = child.parentNode;
			}
			e.currentTarget = child;
			return fn.apply(this, [e]);
		});
	};
	
	/**
	 * Determines the current selection within a text input control.
	 * Returns an object containing:
	 *   - start
	 *   - length
	 *
	 * @param {object} input
	 * @returns {object}
	 */
	var getSelection = function(input) {
		var result = {};
		if ('selectionStart' in input) {
			result.start = input.selectionStart;
			result.length = input.selectionEnd - result.start;
		} else if (document.selection) {
			input.focus();
			var sel = document.selection.createRange();
			var selLen = document.selection.createRange().text.length;
			sel.moveStart('character', -input.value.length);
			result.start = sel.text.length - selLen;
			result.length = selLen;
		}
		return result;
	};
	
	/**
	 * Copies CSS properties from one element to another.
	 *
	 * @param {object} $from
	 * @param {object} $to
	 * @param {array} properties
	 */
	var transferStyles = function($from, $to, properties) {
		var i, n, styles = {};
		if (properties) {
			for (i = 0, n = properties.length; i < n; i++) {
				styles[properties[i]] = $from.css(properties[i]);
			}
		} else {
			styles = $from.css();
		}
		$to.css(styles);
	};
	
	/**
	 * Measures the width of a string within a
	 * parent element (in pixels).
	 *
	 * @param {string} str
	 * @param {object} $parent
	 * @returns {int}
	 */
	var measureString = function(str, $parent) {
		if (!str) {
			return 0;
		}
	
		var $test = $('<test>').css({
			position: 'absolute',
			top: -99999,
			left: -99999,
			width: 'auto',
			padding: 0,
			whiteSpace: 'pre'
		}).text(str).appendTo('body');
	
		transferStyles($parent, $test, [
			'letterSpacing',
			'fontSize',
			'fontFamily',
			'fontWeight',
			'textTransform'
		]);
	
		var width = $test.width();
		$test.remove();
	
		return width;
	};
	
	/**
	 * Sets up an input to grow horizontally as the user
	 * types. If the value is changed manually, you can
	 * trigger the "update" handler to resize:
	 *
	 * $input.trigger('update');
	 *
	 * @param {object} $input
	 */
	var autoGrow = function($input) {
		var currentWidth = null;
	
		var update = function(e, options) {
			var value, keyCode, printable, placeholder, width;
			var shift, character, selection;
			e = e || window.event || {};
			options = options || {};
	
			if (e.metaKey || e.altKey) return;
			if (!options.force && $input.data('grow') === false) return;
	
			value = $input.val();
			if (e.type && e.type.toLowerCase() === 'keydown') {
				keyCode = e.keyCode;
				printable = (
					(keyCode >= 97 && keyCode <= 122) || // a-z
					(keyCode >= 65 && keyCode <= 90)  || // A-Z
					(keyCode >= 48 && keyCode <= 57)  || // 0-9
					keyCode === 32 // space
				);
	
				if (keyCode === KEY_DELETE || keyCode === KEY_BACKSPACE) {
					selection = getSelection($input[0]);
					if (selection.length) {
						value = value.substring(0, selection.start) + value.substring(selection.start + selection.length);
					} else if (keyCode === KEY_BACKSPACE && selection.start) {
						value = value.substring(0, selection.start - 1) + value.substring(selection.start + 1);
					} else if (keyCode === KEY_DELETE && typeof selection.start !== 'undefined') {
						value = value.substring(0, selection.start) + value.substring(selection.start + 1);
					}
				} else if (printable) {
					shift = e.shiftKey;
					character = String.fromCharCode(e.keyCode);
					if (shift) character = character.toUpperCase();
					else character = character.toLowerCase();
					value += character;
				}
			}
	
			placeholder = $input.attr('placeholder');
			if (!value && placeholder) {
				value = placeholder;
			}
	
			width = measureString(value, $input) + 4;
			if (width !== currentWidth) {
				currentWidth = width;
				$input.width(width);
				$input.triggerHandler('resize');
			}
		};
	
		$input.on('keydown keyup update blur', update);
		update();
	};
	
	var domToString = function(d) {
		var tmp = document.createElement('div');
	
		tmp.appendChild(d.cloneNode(true));
	
		return tmp.innerHTML;
	};
	
	var logError = function(message, options){
		if(!options) options = {};
		var component = "Selectize";
	
		console.error(component + ": " + message)
	
		if(options.explanation){
			// console.group is undefined in <IE11
			if(console.group) console.group();
			console.error(options.explanation);
			if(console.group) console.groupEnd();
		}
	}
	
	
	var Selectize = function($input, settings) {
		var key, i, n, dir, input, self = this;
		input = $input[0];
		input.selectize = self;
	
		// detect rtl environment
		var computedStyle = window.getComputedStyle && window.getComputedStyle(input, null);
		dir = computedStyle ? computedStyle.getPropertyValue('direction') : input.currentStyle && input.currentStyle.direction;
		dir = dir || $input.parents('[dir]:first').attr('dir') || '';
	
		// setup default state
		$.extend(self, {
			order            : 0,
			settings         : settings,
			$input           : $input,
			tabIndex         : $input.attr('tabindex') || '',
			tagType          : input.tagName.toLowerCase() === 'select' ? TAG_SELECT : TAG_INPUT,
			rtl              : /rtl/i.test(dir),
	
			eventNS          : '.selectize' + (++Selectize.count),
			highlightedValue : null,
			isOpen           : false,
			isDisabled       : false,
			isRequired       : $input.is('[required]'),
			isInvalid        : false,
			isLocked         : false,
			isFocused        : false,
			isInputHidden    : false,
			isSetup          : false,
			isShiftDown      : false,
			isCmdDown        : false,
			isCtrlDown       : false,
			ignoreFocus      : false,
			ignoreBlur       : false,
			ignoreHover      : false,
			hasOptions       : false,
			currentResults   : null,
			lastValue        : '',
			caretPos         : 0,
			loading          : 0,
			loadedSearches   : {},
	
			$activeOption    : null,
			$activeItems     : [],
	
			optgroups        : {},
			options          : {},
			userOptions      : {},
			items            : [],
			renderCache      : {},
			onSearchChange   : settings.loadThrottle === null ? self.onSearchChange : debounce(self.onSearchChange, settings.loadThrottle)
		});
	
		// search system
		self.sifter = new Sifter(this.options, {diacritics: settings.diacritics});
	
		// build options table
		if (self.settings.options) {
			for (i = 0, n = self.settings.options.length; i < n; i++) {
				self.registerOption(self.settings.options[i]);
			}
			delete self.settings.options;
		}
	
		// build optgroup table
		if (self.settings.optgroups) {
			for (i = 0, n = self.settings.optgroups.length; i < n; i++) {
				self.registerOptionGroup(self.settings.optgroups[i]);
			}
			delete self.settings.optgroups;
		}
	
		// option-dependent defaults
		self.settings.mode = self.settings.mode || (self.settings.maxItems === 1 ? 'single' : 'multi');
		if (typeof self.settings.hideSelected !== 'boolean') {
			self.settings.hideSelected = self.settings.mode === 'multi';
		}
	
		self.initializePlugins(self.settings.plugins);
		self.setupCallbacks();
		self.setupTemplates();
		self.setup();
	};
	
	// mixins
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	MicroEvent.mixin(Selectize);
	
	if(typeof MicroPlugin !== "undefined"){
		MicroPlugin.mixin(Selectize);
	}else{
		logError("Dependency MicroPlugin is missing",
			{explanation:
				"Make sure you either: (1) are using the \"standalone\" "+
				"version of Selectize, or (2) require MicroPlugin before you "+
				"load Selectize."}
		);
	}
	
	
	// methods
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	$.extend(Selectize.prototype, {
	
		/**
		 * Creates all elements and sets up event bindings.
		 */
		setup: function() {
			var self      = this;
			var settings  = self.settings;
			var eventNS   = self.eventNS;
			var $window   = $(window);
			var $document = $(document);
			var $input    = self.$input;
	
			var $wrapper;
			var $control;
			var $control_input;
			var $dropdown;
			var $dropdown_content;
			var $dropdown_parent;
			var inputMode;
			var timeout_blur;
			var timeout_focus;
			var classes;
			var classes_plugins;
			var inputId;
	
			inputMode         = self.settings.mode;
			classes           = $input.attr('class') || '';
	
			$wrapper          = $('<div>').addClass(settings.wrapperClass).addClass(classes).addClass(inputMode);
			$control          = $('<div>').addClass(settings.inputClass).addClass('items').appendTo($wrapper);
			$control_input    = $('<input type="text" autocomplete="off" />').appendTo($control).attr('tabindex', $input.is(':disabled') ? '-1' : self.tabIndex);
			$dropdown_parent  = $(settings.dropdownParent || $wrapper);
			$dropdown         = $('<div>').addClass(settings.dropdownClass).addClass(inputMode).hide().appendTo($dropdown_parent);
			$dropdown_content = $('<div>').addClass(settings.dropdownContentClass).appendTo($dropdown);
	
			if(inputId = $input.attr('id')) {
				$control_input.attr('id', inputId + '-selectized');
				$("label[for='"+inputId+"']").attr('for', inputId + '-selectized');
			}
	
			if(self.settings.copyClassesToDropdown) {
				$dropdown.addClass(classes);
			}
	
			$wrapper.css({
				width: $input[0].style.width
			});
	
			if (self.plugins.names.length) {
				classes_plugins = 'plugin-' + self.plugins.names.join(' plugin-');
				$wrapper.addClass(classes_plugins);
				$dropdown.addClass(classes_plugins);
			}
	
			if ((settings.maxItems === null || settings.maxItems > 1) && self.tagType === TAG_SELECT) {
				$input.attr('multiple', 'multiple');
			}
	
			if (self.settings.placeholder) {
				$control_input.attr('placeholder', settings.placeholder);
			}
	
			// if splitOn was not passed in, construct it from the delimiter to allow pasting universally
			if (!self.settings.splitOn && self.settings.delimiter) {
				var delimiterEscaped = self.settings.delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
				self.settings.splitOn = new RegExp('\\s*' + delimiterEscaped + '+\\s*');
			}
	
			if ($input.attr('autocorrect')) {
				$control_input.attr('autocorrect', $input.attr('autocorrect'));
			}
	
			if ($input.attr('autocapitalize')) {
				$control_input.attr('autocapitalize', $input.attr('autocapitalize'));
			}
	
			self.$wrapper          = $wrapper;
			self.$control          = $control;
			self.$control_input    = $control_input;
			self.$dropdown         = $dropdown;
			self.$dropdown_content = $dropdown_content;
	
			$dropdown.on('mouseenter', '[data-selectable]', function() { return self.onOptionHover.apply(self, arguments); });
			$dropdown.on('mousedown click', '[data-selectable]', function() { return self.onOptionSelect.apply(self, arguments); });
			watchChildEvent($control, 'mousedown', '*:not(input)', function() { return self.onItemSelect.apply(self, arguments); });
			autoGrow($control_input);
	
			$control.on({
				mousedown : function() { return self.onMouseDown.apply(self, arguments); },
				click     : function() { return self.onClick.apply(self, arguments); }
			});
	
			$control_input.on({
				mousedown : function(e) { e.stopPropagation(); },
				keydown   : function() { return self.onKeyDown.apply(self, arguments); },
				keyup     : function() { return self.onKeyUp.apply(self, arguments); },
				keypress  : function() { return self.onKeyPress.apply(self, arguments); },
				resize    : function() { self.positionDropdown.apply(self, []); },
				blur      : function() { return self.onBlur.apply(self, arguments); },
				focus     : function() { self.ignoreBlur = false; return self.onFocus.apply(self, arguments); },
				paste     : function() { return self.onPaste.apply(self, arguments); }
			});
	
			$document.on('keydown' + eventNS, function(e) {
				self.isCmdDown = e[IS_MAC ? 'metaKey' : 'ctrlKey'];
				self.isCtrlDown = e[IS_MAC ? 'altKey' : 'ctrlKey'];
				self.isShiftDown = e.shiftKey;
			});
	
			$document.on('keyup' + eventNS, function(e) {
				if (e.keyCode === KEY_CTRL) self.isCtrlDown = false;
				if (e.keyCode === KEY_SHIFT) self.isShiftDown = false;
				if (e.keyCode === KEY_CMD) self.isCmdDown = false;
			});
	
			$document.on('mousedown' + eventNS, function(e) {
				if (self.isFocused) {
					// prevent events on the dropdown scrollbar from causing the control to blur
					if (e.target === self.$dropdown[0] || e.target.parentNode === self.$dropdown[0]) {
						return false;
					}
					// blur on click outside
					if (!self.$control.has(e.target).length && e.target !== self.$control[0]) {
						self.blur(e.target);
					}
				}
			});
	
			$window.on(['scroll' + eventNS, 'resize' + eventNS].join(' '), function() {
				if (self.isOpen) {
					self.positionDropdown.apply(self, arguments);
				}
			});
			$window.on('mousemove' + eventNS, function() {
				self.ignoreHover = false;
			});
	
			// store original children and tab index so that they can be
			// restored when the destroy() method is called.
			this.revertSettings = {
				$children : $input.children().detach(),
				tabindex  : $input.attr('tabindex')
			};
	
			$input.attr('tabindex', -1).hide().after(self.$wrapper);
	
			if ($.isArray(settings.items)) {
				self.setValue(settings.items);
				delete settings.items;
			}
	
			// feature detect for the validation API
			if (SUPPORTS_VALIDITY_API) {
				$input.on('invalid' + eventNS, function(e) {
					e.preventDefault();
					self.isInvalid = true;
					self.refreshState();
				});
			}
	
			self.updateOriginalInput();
			self.refreshItems();
			self.refreshState();
			self.updatePlaceholder();
			self.isSetup = true;
	
			if ($input.is(':disabled')) {
				self.disable();
			}
	
			self.on('change', this.onChange);
	
			$input.data('selectize', self);
			$input.addClass('selectized');
			self.trigger('initialize');
	
			// preload options
			if (settings.preload === true) {
				self.onSearchChange('');
			}
	
		},
	
		/**
		 * Sets up default rendering functions.
		 */
		setupTemplates: function() {
			var self = this;
			var field_label = self.settings.labelField;
			var field_optgroup = self.settings.optgroupLabelField;
	
			var templates = {
				'optgroup': function(data) {
					return '<div class="optgroup">' + data.html + '</div>';
				},
				'optgroup_header': function(data, escape) {
					return '<div class="optgroup-header">' + escape(data[field_optgroup]) + '</div>';
				},
				'option': function(data, escape) {
					return '<div class="option">' + escape(data[field_label]) + '</div>';
				},
				'item': function(data, escape) {
					return '<div class="item">' + escape(data[field_label]) + '</div>';
				},
				'option_create': function(data, escape) {
					return '<div class="create">Add <strong>' + escape(data.input) + '</strong>&hellip;</div>';
				}
			};
	
			self.settings.render = $.extend({}, templates, self.settings.render);
		},
	
		/**
		 * Maps fired events to callbacks provided
		 * in the settings used when creating the control.
		 */
		setupCallbacks: function() {
			var key, fn, callbacks = {
				'initialize'      : 'onInitialize',
				'change'          : 'onChange',
				'item_add'        : 'onItemAdd',
				'item_remove'     : 'onItemRemove',
				'clear'           : 'onClear',
				'option_add'      : 'onOptionAdd',
				'option_remove'   : 'onOptionRemove',
				'option_clear'    : 'onOptionClear',
				'optgroup_add'    : 'onOptionGroupAdd',
				'optgroup_remove' : 'onOptionGroupRemove',
				'optgroup_clear'  : 'onOptionGroupClear',
				'dropdown_open'   : 'onDropdownOpen',
				'dropdown_close'  : 'onDropdownClose',
				'type'            : 'onType',
				'load'            : 'onLoad',
				'focus'           : 'onFocus',
				'blur'            : 'onBlur'
			};
	
			for (key in callbacks) {
				if (callbacks.hasOwnProperty(key)) {
					fn = this.settings[callbacks[key]];
					if (fn) this.on(key, fn);
				}
			}
		},
	
		/**
		 * Triggered when the main control element
		 * has a click event.
		 *
		 * @param {object} e
		 * @return {boolean}
		 */
		onClick: function(e) {
			var self = this;
	
			// necessary for mobile webkit devices (manual focus triggering
			// is ignored unless invoked within a click event)
			if (!self.isFocused) {
				self.focus();
				e.preventDefault();
			}
		},
	
		/**
		 * Triggered when the main control element
		 * has a mouse down event.
		 *
		 * @param {object} e
		 * @return {boolean}
		 */
		onMouseDown: function(e) {
			var self = this;
			var defaultPrevented = e.isDefaultPrevented();
			var $target = $(e.target);
	
			if (self.isFocused) {
				// retain focus by preventing native handling. if the
				// event target is the input it should not be modified.
				// otherwise, text selection within the input won't work.
				if (e.target !== self.$control_input[0]) {
					if (self.settings.mode === 'single') {
						// toggle dropdown
						self.isOpen ? self.close() : self.open();
					} else if (!defaultPrevented) {
						self.setActiveItem(null);
					}
					return false;
				}
			} else {
				// give control focus
				if (!defaultPrevented) {
					window.setTimeout(function() {
						self.focus();
					}, 0);
				}
			}
		},
	
		/**
		 * Triggered when the value of the control has been changed.
		 * This should propagate the event to the original DOM
		 * input / select element.
		 */
		onChange: function() {
			this.$input.trigger('change');
		},
	
		/**
		 * Triggered on <input> paste.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onPaste: function(e) {
			var self = this;
	
			if (self.isFull() || self.isInputHidden || self.isLocked) {
				e.preventDefault();
				return;
			}
	
			// If a regex or string is included, this will split the pasted
			// input and create Items for each separate value
			if (self.settings.splitOn) {
	
				// Wait for pasted text to be recognized in value
				setTimeout(function() {
					var pastedText = self.$control_input.val();
					if(!pastedText.match(self.settings.splitOn)){ return }
	
					var splitInput = $.trim(pastedText).split(self.settings.splitOn);
					for (var i = 0, n = splitInput.length; i < n; i++) {
						self.createItem(splitInput[i]);
					}
				}, 0);
			}
		},
	
		/**
		 * Triggered on <input> keypress.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyPress: function(e) {
			if (this.isLocked) return e && e.preventDefault();
			var character = String.fromCharCode(e.keyCode || e.which);
			if (this.settings.create && this.settings.mode === 'multi' && character === this.settings.delimiter) {
				this.createItem();
				e.preventDefault();
				return false;
			}
		},
	
		/**
		 * Triggered on <input> keydown.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyDown: function(e) {
			var isInput = e.target === this.$control_input[0];
			var self = this;
	
			if (self.isLocked) {
				if (e.keyCode !== KEY_TAB) {
					e.preventDefault();
				}
				return;
			}
	
			switch (e.keyCode) {
				case KEY_A:
					if (self.isCmdDown) {
						self.selectAll();
						return;
					}
					break;
				case KEY_ESC:
					if (self.isOpen) {
						e.preventDefault();
						e.stopPropagation();
						self.close();
					}
					return;
				case KEY_N:
					if (!e.ctrlKey || e.altKey) break;
				case KEY_DOWN:
					if (!self.isOpen && self.hasOptions) {
						self.open();
					} else if (self.$activeOption) {
						self.ignoreHover = true;
						var $next = self.getAdjacentOption(self.$activeOption, 1);
						if ($next.length) self.setActiveOption($next, true, true);
					}
					e.preventDefault();
					return;
				case KEY_P:
					if (!e.ctrlKey || e.altKey) break;
				case KEY_UP:
					if (self.$activeOption) {
						self.ignoreHover = true;
						var $prev = self.getAdjacentOption(self.$activeOption, -1);
						if ($prev.length) self.setActiveOption($prev, true, true);
					}
					e.preventDefault();
					return;
				case KEY_RETURN:
					if (self.isOpen && self.$activeOption) {
						self.onOptionSelect({currentTarget: self.$activeOption});
						e.preventDefault();
					}
					return;
				case KEY_LEFT:
					self.advanceSelection(-1, e);
					return;
				case KEY_RIGHT:
					self.advanceSelection(1, e);
					return;
				case KEY_TAB:
					if (self.settings.selectOnTab && self.isOpen && self.$activeOption) {
						self.onOptionSelect({currentTarget: self.$activeOption});
	
						// Default behaviour is to jump to the next field, we only want this
						// if the current field doesn't accept any more entries
						if (!self.isFull()) {
							e.preventDefault();
						}
					}
					if (self.settings.create && self.createItem()) {
						e.preventDefault();
					}
					return;
				case KEY_BACKSPACE:
				case KEY_DELETE:
					self.deleteSelection(e);
					return;
			}
	
			if ((self.isFull() || self.isInputHidden) && !(IS_MAC ? e.metaKey : e.ctrlKey)) {
				e.preventDefault();
				return;
			}
		},
	
		/**
		 * Triggered on <input> keyup.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyUp: function(e) {
			var self = this;
	
			if (self.isLocked) return e && e.preventDefault();
			var value = self.$control_input.val() || '';
			if (self.lastValue !== value) {
				self.lastValue = value;
				self.onSearchChange(value);
				self.refreshOptions();
				self.trigger('type', value);
			}
		},
	
		/**
		 * Invokes the user-provide option provider / loader.
		 *
		 * Note: this function is debounced in the Selectize
		 * constructor (by `settings.loadThrottle` milliseconds)
		 *
		 * @param {string} value
		 */
		onSearchChange: function(value) {
			var self = this;
			var fn = self.settings.load;
			if (!fn) return;
			if (self.loadedSearches.hasOwnProperty(value)) return;
			self.loadedSearches[value] = true;
			self.load(function(callback) {
				fn.apply(self, [value, callback]);
			});
		},
	
		/**
		 * Triggered on <input> focus.
		 *
		 * @param {object} e (optional)
		 * @returns {boolean}
		 */
		onFocus: function(e) {
			var self = this;
			var wasFocused = self.isFocused;
	
			if (self.isDisabled) {
				self.blur();
				e && e.preventDefault();
				return false;
			}
	
			if (self.ignoreFocus) return;
			self.isFocused = true;
			if (self.settings.preload === 'focus') self.onSearchChange('');
	
			if (!wasFocused) self.trigger('focus');
	
			if (!self.$activeItems.length) {
				self.showInput();
				self.setActiveItem(null);
				self.refreshOptions(!!self.settings.openOnFocus);
			}
	
			self.refreshState();
		},
	
		/**
		 * Triggered on <input> blur.
		 *
		 * @param {object} e
		 * @param {Element} dest
		 */
		onBlur: function(e, dest) {
			var self = this;
			if (!self.isFocused) return;
			self.isFocused = false;
	
			if (self.ignoreFocus) {
				return;
			} else if (!self.ignoreBlur && document.activeElement === self.$dropdown_content[0]) {
				// necessary to prevent IE closing the dropdown when the scrollbar is clicked
				self.ignoreBlur = true;
				self.onFocus(e);
				return;
			}
	
			var deactivate = function() {
				self.close();
				self.setTextboxValue('');
				self.setActiveItem(null);
				self.setActiveOption(null);
				self.setCaret(self.items.length);
				self.refreshState();
	
				// IE11 bug: element still marked as active
				dest && dest.focus && dest.focus();
	
				self.ignoreFocus = false;
				self.trigger('blur');
			};
	
			self.ignoreFocus = true;
			if (self.settings.create && self.settings.createOnBlur) {
				self.createItem(null, false, deactivate);
			} else {
				deactivate();
			}
		},
	
		/**
		 * Triggered when the user rolls over
		 * an option in the autocomplete dropdown menu.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onOptionHover: function(e) {
			if (this.ignoreHover) return;
			this.setActiveOption(e.currentTarget, false);
		},
	
		/**
		 * Triggered when the user clicks on an option
		 * in the autocomplete dropdown menu.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onOptionSelect: function(e) {
			var value, $target, $option, self = this;
	
			if (e.preventDefault) {
				e.preventDefault();
				e.stopPropagation();
			}
	
			$target = $(e.currentTarget);
			if ($target.hasClass('create')) {
				self.createItem(null, function() {
					if (self.settings.closeAfterSelect) {
						self.close();
					}
				});
			} else {
				value = $target.attr('data-value');
				if (typeof value !== 'undefined') {
					self.lastQuery = null;
					self.setTextboxValue('');
					self.addItem(value);
					if (self.settings.closeAfterSelect) {
						self.close();
					} else if (!self.settings.hideSelected && e.type && /mouse/.test(e.type)) {
						self.setActiveOption(self.getOption(value));
					}
				}
			}
		},
	
		/**
		 * Triggered when the user clicks on an item
		 * that has been selected.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onItemSelect: function(e) {
			var self = this;
	
			if (self.isLocked) return;
			if (self.settings.mode === 'multi') {
				e.preventDefault();
				self.setActiveItem(e.currentTarget, e);
			}
		},
	
		/**
		 * Invokes the provided method that provides
		 * results to a callback---which are then added
		 * as options to the control.
		 *
		 * @param {function} fn
		 */
		load: function(fn) {
			var self = this;
			var $wrapper = self.$wrapper.addClass(self.settings.loadingClass);
	
			self.loading++;
			fn.apply(self, [function(results) {
				self.loading = Math.max(self.loading - 1, 0);
				if (results && results.length) {
					self.addOption(results);
					self.refreshOptions(self.isFocused && !self.isInputHidden);
				}
				if (!self.loading) {
					$wrapper.removeClass(self.settings.loadingClass);
				}
				self.trigger('load', results);
			}]);
		},
	
		/**
		 * Sets the input field of the control to the specified value.
		 *
		 * @param {string} value
		 */
		setTextboxValue: function(value) {
			var $input = this.$control_input;
			var changed = $input.val() !== value;
			if (changed) {
				$input.val(value).triggerHandler('update');
				this.lastValue = value;
			}
		},
	
		/**
		 * Returns the value of the control. If multiple items
		 * can be selected (e.g. <select multiple>), this returns
		 * an array. If only one item can be selected, this
		 * returns a string.
		 *
		 * @returns {mixed}
		 */
		getValue: function() {
			if (this.tagType === TAG_SELECT && this.$input.attr('multiple')) {
				return this.items;
			} else {
				return this.items.join(this.settings.delimiter);
			}
		},
	
		/**
		 * Resets the selected items to the given value.
		 *
		 * @param {mixed} value
		 */
		setValue: function(value, silent) {
			var events = silent ? [] : ['change'];
	
			debounce_events(this, events, function() {
				this.clear(silent);
				this.addItems(value, silent);
			});
		},
	
		/**
		 * Sets the selected item.
		 *
		 * @param {object} $item
		 * @param {object} e (optional)
		 */
		setActiveItem: function($item, e) {
			var self = this;
			var eventName;
			var i, idx, begin, end, item, swap;
			var $last;
	
			if (self.settings.mode === 'single') return;
			$item = $($item);
	
			// clear the active selection
			if (!$item.length) {
				$(self.$activeItems).removeClass('active');
				self.$activeItems = [];
				if (self.isFocused) {
					self.showInput();
				}
				return;
			}
	
			// modify selection
			eventName = e && e.type.toLowerCase();
	
			if (eventName === 'mousedown' && self.isShiftDown && self.$activeItems.length) {
				$last = self.$control.children('.active:last');
				begin = Array.prototype.indexOf.apply(self.$control[0].childNodes, [$last[0]]);
				end   = Array.prototype.indexOf.apply(self.$control[0].childNodes, [$item[0]]);
				if (begin > end) {
					swap  = begin;
					begin = end;
					end   = swap;
				}
				for (i = begin; i <= end; i++) {
					item = self.$control[0].childNodes[i];
					if (self.$activeItems.indexOf(item) === -1) {
						$(item).addClass('active');
						self.$activeItems.push(item);
					}
				}
				e.preventDefault();
			} else if ((eventName === 'mousedown' && self.isCtrlDown) || (eventName === 'keydown' && this.isShiftDown)) {
				if ($item.hasClass('active')) {
					idx = self.$activeItems.indexOf($item[0]);
					self.$activeItems.splice(idx, 1);
					$item.removeClass('active');
				} else {
					self.$activeItems.push($item.addClass('active')[0]);
				}
			} else {
				$(self.$activeItems).removeClass('active');
				self.$activeItems = [$item.addClass('active')[0]];
			}
	
			// ensure control has focus
			self.hideInput();
			if (!this.isFocused) {
				self.focus();
			}
		},
	
		/**
		 * Sets the selected item in the dropdown menu
		 * of available options.
		 *
		 * @param {object} $object
		 * @param {boolean} scroll
		 * @param {boolean} animate
		 */
		setActiveOption: function($option, scroll, animate) {
			var height_menu, height_item, y;
			var scroll_top, scroll_bottom;
			var self = this;
	
			if (self.$activeOption) self.$activeOption.removeClass('active');
			self.$activeOption = null;
	
			$option = $($option);
			if (!$option.length) return;
	
			self.$activeOption = $option.addClass('active');
	
			if (scroll || !isset(scroll)) {
	
				height_menu   = self.$dropdown_content.height();
				height_item   = self.$activeOption.outerHeight(true);
				scroll        = self.$dropdown_content.scrollTop() || 0;
				y             = self.$activeOption.offset().top - self.$dropdown_content.offset().top + scroll;
				scroll_top    = y;
				scroll_bottom = y - height_menu + height_item;
	
				if (y + height_item > height_menu + scroll) {
					self.$dropdown_content.stop().animate({scrollTop: scroll_bottom}, animate ? self.settings.scrollDuration : 0);
				} else if (y < scroll) {
					self.$dropdown_content.stop().animate({scrollTop: scroll_top}, animate ? self.settings.scrollDuration : 0);
				}
	
			}
		},
	
		/**
		 * Selects all items (CTRL + A).
		 */
		selectAll: function() {
			var self = this;
			if (self.settings.mode === 'single') return;
	
			self.$activeItems = Array.prototype.slice.apply(self.$control.children(':not(input)').addClass('active'));
			if (self.$activeItems.length) {
				self.hideInput();
				self.close();
			}
			self.focus();
		},
	
		/**
		 * Hides the input element out of view, while
		 * retaining its focus.
		 */
		hideInput: function() {
			var self = this;
	
			self.setTextboxValue('');
			self.$control_input.css({opacity: 0, position: 'absolute', left: self.rtl ? 10000 : -10000});
			self.isInputHidden = true;
		},
	
		/**
		 * Restores input visibility.
		 */
		showInput: function() {
			this.$control_input.css({opacity: 1, position: 'relative', left: 0});
			this.isInputHidden = false;
		},
	
		/**
		 * Gives the control focus.
		 */
		focus: function() {
			var self = this;
			if (self.isDisabled) return;
	
			self.ignoreFocus = true;
			self.$control_input[0].focus();
			window.setTimeout(function() {
				self.ignoreFocus = false;
				self.onFocus();
			}, 0);
		},
	
		/**
		 * Forces the control out of focus.
		 *
		 * @param {Element} dest
		 */
		blur: function(dest) {
			this.$control_input[0].blur();
			this.onBlur(null, dest);
		},
	
		/**
		 * Returns a function that scores an object
		 * to show how good of a match it is to the
		 * provided query.
		 *
		 * @param {string} query
		 * @param {object} options
		 * @return {function}
		 */
		getScoreFunction: function(query) {
			return this.sifter.getScoreFunction(query, this.getSearchOptions());
		},
	
		/**
		 * Returns search options for sifter (the system
		 * for scoring and sorting results).
		 *
		 * @see https://github.com/brianreavis/sifter.js
		 * @return {object}
		 */
		getSearchOptions: function() {
			var settings = this.settings;
			var sort = settings.sortField;
			if (typeof sort === 'string') {
				sort = [{field: sort}];
			}
	
			return {
				fields      : settings.searchField,
				conjunction : settings.searchConjunction,
				sort        : sort
			};
		},
	
		/**
		 * Searches through available options and returns
		 * a sorted array of matches.
		 *
		 * Returns an object containing:
		 *
		 *   - query {string}
		 *   - tokens {array}
		 *   - total {int}
		 *   - items {array}
		 *
		 * @param {string} query
		 * @returns {object}
		 */
		search: function(query) {
			var i, value, score, result, calculateScore;
			var self     = this;
			var settings = self.settings;
			var options  = this.getSearchOptions();
	
			// validate user-provided result scoring function
			if (settings.score) {
				calculateScore = self.settings.score.apply(this, [query]);
				if (typeof calculateScore !== 'function') {
					throw new Error('Selectize "score" setting must be a function that returns a function');
				}
			}
	
			// perform search
			if (query !== self.lastQuery) {
				self.lastQuery = query;
				result = self.sifter.search(query, $.extend(options, {score: calculateScore}));
				self.currentResults = result;
			} else {
				result = $.extend(true, {}, self.currentResults);
			}
	
			// filter out selected items
			if (settings.hideSelected) {
				for (i = result.items.length - 1; i >= 0; i--) {
					if (self.items.indexOf(hash_key(result.items[i].id)) !== -1) {
						result.items.splice(i, 1);
					}
				}
			}
	
			return result;
		},
	
		/**
		 * Refreshes the list of available options shown
		 * in the autocomplete dropdown menu.
		 *
		 * @param {boolean} triggerDropdown
		 */
		refreshOptions: function(triggerDropdown) {
			var i, j, k, n, groups, groups_order, option, option_html, optgroup, optgroups, html, html_children, has_create_option;
			var $active, $active_before, $create;
	
			if (typeof triggerDropdown === 'undefined') {
				triggerDropdown = true;
			}
	
			var self              = this;
			var query             = $.trim(self.$control_input.val());
			var results           = self.search(query);
			var $dropdown_content = self.$dropdown_content;
			var active_before     = self.$activeOption && hash_key(self.$activeOption.attr('data-value'));
	
			// build markup
			n = results.items.length;
			if (typeof self.settings.maxOptions === 'number') {
				n = Math.min(n, self.settings.maxOptions);
			}
	
			// render and group available options individually
			groups = {};
			groups_order = [];
	
			for (i = 0; i < n; i++) {
				option      = self.options[results.items[i].id];
				option_html = self.render('option', option);
				optgroup    = option[self.settings.optgroupField] || '';
				optgroups   = $.isArray(optgroup) ? optgroup : [optgroup];
	
				for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
					optgroup = optgroups[j];
					if (!self.optgroups.hasOwnProperty(optgroup)) {
						optgroup = '';
					}
					if (!groups.hasOwnProperty(optgroup)) {
						groups[optgroup] = document.createDocumentFragment();
						groups_order.push(optgroup);
					}
					groups[optgroup].appendChild(option_html);
				}
			}
	
			// sort optgroups
			if (this.settings.lockOptgroupOrder) {
				groups_order.sort(function(a, b) {
					var a_order = self.optgroups[a].$order || 0;
					var b_order = self.optgroups[b].$order || 0;
					return a_order - b_order;
				});
			}
	
			// render optgroup headers & join groups
			html = document.createDocumentFragment();
			for (i = 0, n = groups_order.length; i < n; i++) {
				optgroup = groups_order[i];
				if (self.optgroups.hasOwnProperty(optgroup) && groups[optgroup].childNodes.length) {
					// render the optgroup header and options within it,
					// then pass it to the wrapper template
					html_children = document.createDocumentFragment();
					html_children.appendChild(self.render('optgroup_header', self.optgroups[optgroup]));
					html_children.appendChild(groups[optgroup]);
	
					html.appendChild(self.render('optgroup', $.extend({}, self.optgroups[optgroup], {
						html: domToString(html_children),
						dom:  html_children
					})));
				} else {
					html.appendChild(groups[optgroup]);
				}
			}
	
			$dropdown_content.html(html);
	
			// highlight matching terms inline
			if (self.settings.highlight && results.query.length && results.tokens.length) {
				$dropdown_content.removeHighlight();
				for (i = 0, n = results.tokens.length; i < n; i++) {
					highlight($dropdown_content, results.tokens[i].regex);
				}
			}
	
			// add "selected" class to selected options
			if (!self.settings.hideSelected) {
				for (i = 0, n = self.items.length; i < n; i++) {
					self.getOption(self.items[i]).addClass('selected');
				}
			}
	
			// add create option
			has_create_option = self.canCreate(query);
			if (has_create_option) {
				$dropdown_content.prepend(self.render('option_create', {input: query}));
				$create = $($dropdown_content[0].childNodes[0]);
			}
	
			// activate
			self.hasOptions = results.items.length > 0 || has_create_option;
			if (self.hasOptions) {
				if (results.items.length > 0) {
					$active_before = active_before && self.getOption(active_before);
					if ($active_before && $active_before.length) {
						$active = $active_before;
					} else if (self.settings.mode === 'single' && self.items.length) {
						$active = self.getOption(self.items[0]);
					}
					if (!$active || !$active.length) {
						if ($create && !self.settings.addPrecedence) {
							$active = self.getAdjacentOption($create, 1);
						} else {
							$active = $dropdown_content.find('[data-selectable]:first');
						}
					}
				} else {
					$active = $create;
				}
				self.setActiveOption($active);
				if (triggerDropdown && !self.isOpen) { self.open(); }
			} else {
				self.setActiveOption(null);
				if (triggerDropdown && self.isOpen) { self.close(); }
			}
		},
	
		/**
		 * Adds an available option. If it already exists,
		 * nothing will happen. Note: this does not refresh
		 * the options list dropdown (use `refreshOptions`
		 * for that).
		 *
		 * Usage:
		 *
		 *   this.addOption(data)
		 *
		 * @param {object|array} data
		 */
		addOption: function(data) {
			var i, n, value, self = this;
	
			if ($.isArray(data)) {
				for (i = 0, n = data.length; i < n; i++) {
					self.addOption(data[i]);
				}
				return;
			}
	
			if (value = self.registerOption(data)) {
				self.userOptions[value] = true;
				self.lastQuery = null;
				self.trigger('option_add', value, data);
			}
		},
	
		/**
		 * Registers an option to the pool of options.
		 *
		 * @param {object} data
		 * @return {boolean|string}
		 */
		registerOption: function(data) {
			var key = hash_key(data[this.settings.valueField]);
			if (typeof key === 'undefined' || key === null || this.options.hasOwnProperty(key)) return false;
			data.$order = data.$order || ++this.order;
			this.options[key] = data;
			return key;
		},
	
		/**
		 * Registers an option group to the pool of option groups.
		 *
		 * @param {object} data
		 * @return {boolean|string}
		 */
		registerOptionGroup: function(data) {
			var key = hash_key(data[this.settings.optgroupValueField]);
			if (!key) return false;
	
			data.$order = data.$order || ++this.order;
			this.optgroups[key] = data;
			return key;
		},
	
		/**
		 * Registers a new optgroup for options
		 * to be bucketed into.
		 *
		 * @param {string} id
		 * @param {object} data
		 */
		addOptionGroup: function(id, data) {
			data[this.settings.optgroupValueField] = id;
			if (id = this.registerOptionGroup(data)) {
				this.trigger('optgroup_add', id, data);
			}
		},
	
		/**
		 * Removes an existing option group.
		 *
		 * @param {string} id
		 */
		removeOptionGroup: function(id) {
			if (this.optgroups.hasOwnProperty(id)) {
				delete this.optgroups[id];
				this.renderCache = {};
				this.trigger('optgroup_remove', id);
			}
		},
	
		/**
		 * Clears all existing option groups.
		 */
		clearOptionGroups: function() {
			this.optgroups = {};
			this.renderCache = {};
			this.trigger('optgroup_clear');
		},
	
		/**
		 * Updates an option available for selection. If
		 * it is visible in the selected items or options
		 * dropdown, it will be re-rendered automatically.
		 *
		 * @param {string} value
		 * @param {object} data
		 */
		updateOption: function(value, data) {
			var self = this;
			var $item, $item_new;
			var value_new, index_item, cache_items, cache_options, order_old;
	
			value     = hash_key(value);
			value_new = hash_key(data[self.settings.valueField]);
	
			// sanity checks
			if (value === null) return;
			if (!self.options.hasOwnProperty(value)) return;
			if (typeof value_new !== 'string') throw new Error('Value must be set in option data');
	
			order_old = self.options[value].$order;
	
			// update references
			if (value_new !== value) {
				delete self.options[value];
				index_item = self.items.indexOf(value);
				if (index_item !== -1) {
					self.items.splice(index_item, 1, value_new);
				}
			}
			data.$order = data.$order || order_old;
			self.options[value_new] = data;
	
			// invalidate render cache
			cache_items = self.renderCache['item'];
			cache_options = self.renderCache['option'];
	
			if (cache_items) {
				delete cache_items[value];
				delete cache_items[value_new];
			}
			if (cache_options) {
				delete cache_options[value];
				delete cache_options[value_new];
			}
	
			// update the item if it's selected
			if (self.items.indexOf(value_new) !== -1) {
				$item = self.getItem(value);
				$item_new = $(self.render('item', data));
				if ($item.hasClass('active')) $item_new.addClass('active');
				$item.replaceWith($item_new);
			}
	
			// invalidate last query because we might have updated the sortField
			self.lastQuery = null;
	
			// update dropdown contents
			if (self.isOpen) {
				self.refreshOptions(false);
			}
		},
	
		/**
		 * Removes a single option.
		 *
		 * @param {string} value
		 * @param {boolean} silent
		 */
		removeOption: function(value, silent) {
			var self = this;
			value = hash_key(value);
	
			var cache_items = self.renderCache['item'];
			var cache_options = self.renderCache['option'];
			if (cache_items) delete cache_items[value];
			if (cache_options) delete cache_options[value];
	
			delete self.userOptions[value];
			delete self.options[value];
			self.lastQuery = null;
			self.trigger('option_remove', value);
			self.removeItem(value, silent);
		},
	
		/**
		 * Clears all options.
		 */
		clearOptions: function() {
			var self = this;
	
			self.loadedSearches = {};
			self.userOptions = {};
			self.renderCache = {};
			self.options = self.sifter.items = {};
			self.lastQuery = null;
			self.trigger('option_clear');
			self.clear();
		},
	
		/**
		 * Returns the jQuery element of the option
		 * matching the given value.
		 *
		 * @param {string} value
		 * @returns {object}
		 */
		getOption: function(value) {
			return this.getElementWithValue(value, this.$dropdown_content.find('[data-selectable]'));
		},
	
		/**
		 * Returns the jQuery element of the next or
		 * previous selectable option.
		 *
		 * @param {object} $option
		 * @param {int} direction  can be 1 for next or -1 for previous
		 * @return {object}
		 */
		getAdjacentOption: function($option, direction) {
			var $options = this.$dropdown.find('[data-selectable]');
			var index    = $options.index($option) + direction;
	
			return index >= 0 && index < $options.length ? $options.eq(index) : $();
		},
	
		/**
		 * Finds the first element with a "data-value" attribute
		 * that matches the given value.
		 *
		 * @param {mixed} value
		 * @param {object} $els
		 * @return {object}
		 */
		getElementWithValue: function(value, $els) {
			value = hash_key(value);
	
			if (typeof value !== 'undefined' && value !== null) {
				for (var i = 0, n = $els.length; i < n; i++) {
					if ($els[i].getAttribute('data-value') === value) {
						return $($els[i]);
					}
				}
			}
	
			return $();
		},
	
		/**
		 * Returns the jQuery element of the item
		 * matching the given value.
		 *
		 * @param {string} value
		 * @returns {object}
		 */
		getItem: function(value) {
			return this.getElementWithValue(value, this.$control.children());
		},
	
		/**
		 * "Selects" multiple items at once. Adds them to the list
		 * at the current caret position.
		 *
		 * @param {string} value
		 * @param {boolean} silent
		 */
		addItems: function(values, silent) {
			var items = $.isArray(values) ? values : [values];
			for (var i = 0, n = items.length; i < n; i++) {
				this.isPending = (i < n - 1);
				this.addItem(items[i], silent);
			}
		},
	
		/**
		 * "Selects" an item. Adds it to the list
		 * at the current caret position.
		 *
		 * @param {string} value
		 * @param {boolean} silent
		 */
		addItem: function(value, silent) {
			var events = silent ? [] : ['change'];
	
			debounce_events(this, events, function() {
				var $item, $option, $options;
				var self = this;
				var inputMode = self.settings.mode;
				var i, active, value_next, wasFull;
				value = hash_key(value);
	
				if (self.items.indexOf(value) !== -1) {
					if (inputMode === 'single') self.close();
					return;
				}
	
				if (!self.options.hasOwnProperty(value)) return;
				if (inputMode === 'single') self.clear(silent);
				if (inputMode === 'multi' && self.isFull()) return;
	
				$item = $(self.render('item', self.options[value]));
				wasFull = self.isFull();
				self.items.splice(self.caretPos, 0, value);
				self.insertAtCaret($item);
				if (!self.isPending || (!wasFull && self.isFull())) {
					self.refreshState();
				}
	
				if (self.isSetup) {
					$options = self.$dropdown_content.find('[data-selectable]');
	
					// update menu / remove the option (if this is not one item being added as part of series)
					if (!self.isPending) {
						$option = self.getOption(value);
						value_next = self.getAdjacentOption($option, 1).attr('data-value');
						self.refreshOptions(self.isFocused && inputMode !== 'single');
						if (value_next) {
							self.setActiveOption(self.getOption(value_next));
						}
					}
	
					// hide the menu if the maximum number of items have been selected or no options are left
					if (!$options.length || self.isFull()) {
						self.close();
					} else {
						self.positionDropdown();
					}
	
					self.updatePlaceholder();
					self.trigger('item_add', value, $item);
					self.updateOriginalInput({silent: silent});
				}
			});
		},
	
		/**
		 * Removes the selected item matching
		 * the provided value.
		 *
		 * @param {string} value
		 */
		removeItem: function(value, silent) {
			var self = this;
			var $item, i, idx;
	
			$item = (value instanceof $) ? value : self.getItem(value);
			value = hash_key($item.attr('data-value'));
			i = self.items.indexOf(value);
	
			if (i !== -1) {
				$item.remove();
				if ($item.hasClass('active')) {
					idx = self.$activeItems.indexOf($item[0]);
					self.$activeItems.splice(idx, 1);
				}
	
				self.items.splice(i, 1);
				self.lastQuery = null;
				if (!self.settings.persist && self.userOptions.hasOwnProperty(value)) {
					self.removeOption(value, silent);
				}
	
				if (i < self.caretPos) {
					self.setCaret(self.caretPos - 1);
				}
	
				self.refreshState();
				self.updatePlaceholder();
				self.updateOriginalInput({silent: silent});
				self.positionDropdown();
				self.trigger('item_remove', value, $item);
			}
		},
	
		/**
		 * Invokes the `create` method provided in the
		 * selectize options that should provide the data
		 * for the new item, given the user input.
		 *
		 * Once this completes, it will be added
		 * to the item list.
		 *
		 * @param {string} value
		 * @param {boolean} [triggerDropdown]
		 * @param {function} [callback]
		 * @return {boolean}
		 */
		createItem: function(input, triggerDropdown) {
			var self  = this;
			var caret = self.caretPos;
			input = input || $.trim(self.$control_input.val() || '');
	
			var callback = arguments[arguments.length - 1];
			if (typeof callback !== 'function') callback = function() {};
	
			if (typeof triggerDropdown !== 'boolean') {
				triggerDropdown = true;
			}
	
			if (!self.canCreate(input)) {
				callback();
				return false;
			}
	
			self.lock();
	
			var setup = (typeof self.settings.create === 'function') ? this.settings.create : function(input) {
				var data = {};
				data[self.settings.labelField] = input;
				data[self.settings.valueField] = input;
				return data;
			};
	
			var create = once(function(data) {
				self.unlock();
	
				if (!data || typeof data !== 'object') return callback();
				var value = hash_key(data[self.settings.valueField]);
				if (typeof value !== 'string') return callback();
	
				self.setTextboxValue('');
				self.addOption(data);
				self.setCaret(caret);
				self.addItem(value);
				self.refreshOptions(triggerDropdown && self.settings.mode !== 'single');
				callback(data);
			});
	
			var output = setup.apply(this, [input, create]);
			if (typeof output !== 'undefined') {
				create(output);
			}
	
			return true;
		},
	
		/**
		 * Re-renders the selected item lists.
		 */
		refreshItems: function() {
			this.lastQuery = null;
	
			if (this.isSetup) {
				this.addItem(this.items);
			}
	
			this.refreshState();
			this.updateOriginalInput();
		},
	
		/**
		 * Updates all state-dependent attributes
		 * and CSS classes.
		 */
		refreshState: function() {
			this.refreshValidityState();
			this.refreshClasses();
		},
	
		/**
		 * Update the `required` attribute of both input and control input.
		 *
		 * The `required` property needs to be activated on the control input
		 * for the error to be displayed at the right place. `required` also
		 * needs to be temporarily deactivated on the input since the input is
		 * hidden and can't show errors.
		 */
		refreshValidityState: function() {
			if (!this.isRequired) return false;
	
			var invalid = !this.items.length;
	
			this.isInvalid = invalid;
			this.$control_input.prop('required', invalid);
			this.$input.prop('required', !invalid);
		},
	
		/**
		 * Updates all state-dependent CSS classes.
		 */
		refreshClasses: function() {
			var self     = this;
			var isFull   = self.isFull();
			var isLocked = self.isLocked;
	
			self.$wrapper
				.toggleClass('rtl', self.rtl);
	
			self.$control
				.toggleClass('focus', self.isFocused)
				.toggleClass('disabled', self.isDisabled)
				.toggleClass('required', self.isRequired)
				.toggleClass('invalid', self.isInvalid)
				.toggleClass('locked', isLocked)
				.toggleClass('full', isFull).toggleClass('not-full', !isFull)
				.toggleClass('input-active', self.isFocused && !self.isInputHidden)
				.toggleClass('dropdown-active', self.isOpen)
				.toggleClass('has-options', !$.isEmptyObject(self.options))
				.toggleClass('has-items', self.items.length > 0);
	
			self.$control_input.data('grow', !isFull && !isLocked);
		},
	
		/**
		 * Determines whether or not more items can be added
		 * to the control without exceeding the user-defined maximum.
		 *
		 * @returns {boolean}
		 */
		isFull: function() {
			return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
		},
	
		/**
		 * Refreshes the original <select> or <input>
		 * element to reflect the current state.
		 */
		updateOriginalInput: function(opts) {
			var i, n, options, label, self = this;
			opts = opts || {};
	
			if (self.tagType === TAG_SELECT) {
				options = [];
				for (i = 0, n = self.items.length; i < n; i++) {
					label = self.options[self.items[i]][self.settings.labelField] || '';
					options.push('<option value="' + escape_html(self.items[i]) + '" selected="selected">' + escape_html(label) + '</option>');
				}
				if (!options.length && !this.$input.attr('multiple')) {
					options.push('<option value="" selected="selected"></option>');
				}
				self.$input.html(options.join(''));
			} else {
				self.$input.val(self.getValue());
				self.$input.attr('value',self.$input.val());
			}
	
			if (self.isSetup) {
				if (!opts.silent) {
					self.trigger('change', self.$input.val());
				}
			}
		},
	
		/**
		 * Shows/hide the input placeholder depending
		 * on if there items in the list already.
		 */
		updatePlaceholder: function() {
			if (!this.settings.placeholder) return;
			var $input = this.$control_input;
	
			if (this.items.length) {
				$input.removeAttr('placeholder');
			} else {
				$input.attr('placeholder', this.settings.placeholder);
			}
			$input.triggerHandler('update', {force: true});
		},
	
		/**
		 * Shows the autocomplete dropdown containing
		 * the available options.
		 */
		open: function() {
			var self = this;
	
			if (self.isLocked || self.isOpen || (self.settings.mode === 'multi' && self.isFull())) return;
			self.focus();
			self.isOpen = true;
			self.refreshState();
			self.$dropdown.css({visibility: 'hidden', display: 'block'});
			self.positionDropdown();
			self.$dropdown.css({visibility: 'visible'});
			self.trigger('dropdown_open', self.$dropdown);
		},
	
		/**
		 * Closes the autocomplete dropdown menu.
		 */
		close: function() {
			var self = this;
			var trigger = self.isOpen;
	
			if (self.settings.mode === 'single' && self.items.length) {
				self.hideInput();
				self.$control_input.blur(); // close keyboard on iOS
			}
	
			self.isOpen = false;
			self.$dropdown.hide();
			self.setActiveOption(null);
			self.refreshState();
	
			if (trigger) self.trigger('dropdown_close', self.$dropdown);
		},
	
		/**
		 * Calculates and applies the appropriate
		 * position of the dropdown.
		 */
		positionDropdown: function() {
			var $control = this.$control;
			var offset = this.settings.dropdownParent === 'body' ? $control.offset() : $control.position();
			offset.top += $control.outerHeight(true);
	
			this.$dropdown.css({
				width : $control.outerWidth(),
				top   : offset.top,
				left  : offset.left
			});
		},
	
		/**
		 * Resets / clears all selected items
		 * from the control.
		 *
		 * @param {boolean} silent
		 */
		clear: function(silent) {
			var self = this;
	
			if (!self.items.length) return;
			self.$control.children(':not(input)').remove();
			self.items = [];
			self.lastQuery = null;
			self.setCaret(0);
			self.setActiveItem(null);
			self.updatePlaceholder();
			self.updateOriginalInput({silent: silent});
			self.refreshState();
			self.showInput();
			self.trigger('clear');
		},
	
		/**
		 * A helper method for inserting an element
		 * at the current caret position.
		 *
		 * @param {object} $el
		 */
		insertAtCaret: function($el) {
			var caret = Math.min(this.caretPos, this.items.length);
			if (caret === 0) {
				this.$control.prepend($el);
			} else {
				$(this.$control[0].childNodes[caret]).before($el);
			}
			this.setCaret(caret + 1);
		},
	
		/**
		 * Removes the current selected item(s).
		 *
		 * @param {object} e (optional)
		 * @returns {boolean}
		 */
		deleteSelection: function(e) {
			var i, n, direction, selection, values, caret, option_select, $option_select, $tail;
			var self = this;
	
			direction = (e && e.keyCode === KEY_BACKSPACE) ? -1 : 1;
			selection = getSelection(self.$control_input[0]);
	
			if (self.$activeOption && !self.settings.hideSelected) {
				option_select = self.getAdjacentOption(self.$activeOption, -1).attr('data-value');
			}
	
			// determine items that will be removed
			values = [];
	
			if (self.$activeItems.length) {
				$tail = self.$control.children('.active:' + (direction > 0 ? 'last' : 'first'));
				caret = self.$control.children(':not(input)').index($tail);
				if (direction > 0) { caret++; }
	
				for (i = 0, n = self.$activeItems.length; i < n; i++) {
					values.push($(self.$activeItems[i]).attr('data-value'));
				}
				if (e) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if ((self.isFocused || self.settings.mode === 'single') && self.items.length) {
				if (direction < 0 && selection.start === 0 && selection.length === 0) {
					values.push(self.items[self.caretPos - 1]);
				} else if (direction > 0 && selection.start === self.$control_input.val().length) {
					values.push(self.items[self.caretPos]);
				}
			}
	
			// allow the callback to abort
			if (!values.length || (typeof self.settings.onDelete === 'function' && self.settings.onDelete.apply(self, [values]) === false)) {
				return false;
			}
	
			// perform removal
			if (typeof caret !== 'undefined') {
				self.setCaret(caret);
			}
			while (values.length) {
				self.removeItem(values.pop());
			}
	
			self.showInput();
			self.positionDropdown();
			self.refreshOptions(true);
	
			// select previous option
			if (option_select) {
				$option_select = self.getOption(option_select);
				if ($option_select.length) {
					self.setActiveOption($option_select);
				}
			}
	
			return true;
		},
	
		/**
		 * Selects the previous / next item (depending
		 * on the `direction` argument).
		 *
		 * > 0 - right
		 * < 0 - left
		 *
		 * @param {int} direction
		 * @param {object} e (optional)
		 */
		advanceSelection: function(direction, e) {
			var tail, selection, idx, valueLength, cursorAtEdge, $tail;
			var self = this;
	
			if (direction === 0) return;
			if (self.rtl) direction *= -1;
	
			tail = direction > 0 ? 'last' : 'first';
			selection = getSelection(self.$control_input[0]);
	
			if (self.isFocused && !self.isInputHidden) {
				valueLength = self.$control_input.val().length;
				cursorAtEdge = direction < 0
					? selection.start === 0 && selection.length === 0
					: selection.start === valueLength;
	
				if (cursorAtEdge && !valueLength) {
					self.advanceCaret(direction, e);
				}
			} else {
				$tail = self.$control.children('.active:' + tail);
				if ($tail.length) {
					idx = self.$control.children(':not(input)').index($tail);
					self.setActiveItem(null);
					self.setCaret(direction > 0 ? idx + 1 : idx);
				}
			}
		},
	
		/**
		 * Moves the caret left / right.
		 *
		 * @param {int} direction
		 * @param {object} e (optional)
		 */
		advanceCaret: function(direction, e) {
			var self = this, fn, $adj;
	
			if (direction === 0) return;
	
			fn = direction > 0 ? 'next' : 'prev';
			if (self.isShiftDown) {
				$adj = self.$control_input[fn]();
				if ($adj.length) {
					self.hideInput();
					self.setActiveItem($adj);
					e && e.preventDefault();
				}
			} else {
				self.setCaret(self.caretPos + direction);
			}
		},
	
		/**
		 * Moves the caret to the specified index.
		 *
		 * @param {int} i
		 */
		setCaret: function(i) {
			var self = this;
	
			if (self.settings.mode === 'single') {
				i = self.items.length;
			} else {
				i = Math.max(0, Math.min(self.items.length, i));
			}
	
			if(!self.isPending) {
				// the input must be moved by leaving it in place and moving the
				// siblings, due to the fact that focus cannot be restored once lost
				// on mobile webkit devices
				var j, n, fn, $children, $child;
				$children = self.$control.children(':not(input)');
				for (j = 0, n = $children.length; j < n; j++) {
					$child = $($children[j]).detach();
					if (j <  i) {
						self.$control_input.before($child);
					} else {
						self.$control.append($child);
					}
				}
			}
	
			self.caretPos = i;
		},
	
		/**
		 * Disables user input on the control. Used while
		 * items are being asynchronously created.
		 */
		lock: function() {
			this.close();
			this.isLocked = true;
			this.refreshState();
		},
	
		/**
		 * Re-enables user input on the control.
		 */
		unlock: function() {
			this.isLocked = false;
			this.refreshState();
		},
	
		/**
		 * Disables user input on the control completely.
		 * While disabled, it cannot receive focus.
		 */
		disable: function() {
			var self = this;
			self.$input.prop('disabled', true);
			self.$control_input.prop('disabled', true).prop('tabindex', -1);
			self.isDisabled = true;
			self.lock();
		},
	
		/**
		 * Enables the control so that it can respond
		 * to focus and user input.
		 */
		enable: function() {
			var self = this;
			self.$input.prop('disabled', false);
			self.$control_input.prop('disabled', false).prop('tabindex', self.tabIndex);
			self.isDisabled = false;
			self.unlock();
		},
	
		/**
		 * Completely destroys the control and
		 * unbinds all event listeners so that it can
		 * be garbage collected.
		 */
		destroy: function() {
			var self = this;
			var eventNS = self.eventNS;
			var revertSettings = self.revertSettings;
	
			self.trigger('destroy');
			self.off();
			self.$wrapper.remove();
			self.$dropdown.remove();
	
			self.$input
				.html('')
				.append(revertSettings.$children)
				.removeAttr('tabindex')
				.removeClass('selectized')
				.attr({tabindex: revertSettings.tabindex})
				.show();
	
			self.$control_input.removeData('grow');
			self.$input.removeData('selectize');
	
			$(window).off(eventNS);
			$(document).off(eventNS);
			$(document.body).off(eventNS);
	
			delete self.$input[0].selectize;
		},
	
		/**
		 * A helper method for rendering "item" and
		 * "option" templates, given the data.
		 *
		 * @param {string} templateName
		 * @param {object} data
		 * @returns {string}
		 */
		render: function(templateName, data) {
			var value, id, label;
			var html = '';
			var cache = false;
			var self = this;
			var regex_tag = /^[\t \r\n]*<([a-z][a-z0-9\-_]*(?:\:[a-z][a-z0-9\-_]*)?)/i;
	
			if (templateName === 'option' || templateName === 'item') {
				value = hash_key(data[self.settings.valueField]);
				cache = !!value;
			}
	
			// pull markup from cache if it exists
			if (cache) {
				if (!isset(self.renderCache[templateName])) {
					self.renderCache[templateName] = {};
				}
				if (self.renderCache[templateName].hasOwnProperty(value)) {
					return self.renderCache[templateName][value];
				}
			}
	
			// render markup
			html = $(self.settings.render[templateName].apply(this, [data, escape_html]));
	
			// add mandatory attributes
			if (templateName === 'option' || templateName === 'option_create') {
				html.attr('data-selectable', '');
			}
			else if (templateName === 'optgroup') {
				id = data[self.settings.optgroupValueField] || '';
				html.attr('data-group', id);
			}
			if (templateName === 'option' || templateName === 'item') {
				html.attr('data-value', value || '');
			}
	
			// update cache
			if (cache) {
				self.renderCache[templateName][value] = html[0];
			}
	
			return html[0];
		},
	
		/**
		 * Clears the render cache for a template. If
		 * no template is given, clears all render
		 * caches.
		 *
		 * @param {string} templateName
		 */
		clearCache: function(templateName) {
			var self = this;
			if (typeof templateName === 'undefined') {
				self.renderCache = {};
			} else {
				delete self.renderCache[templateName];
			}
		},
	
		/**
		 * Determines whether or not to display the
		 * create item prompt, given a user input.
		 *
		 * @param {string} input
		 * @return {boolean}
		 */
		canCreate: function(input) {
			var self = this;
			if (!self.settings.create) return false;
			var filter = self.settings.createFilter;
			return input.length
				&& (typeof filter !== 'function' || filter.apply(self, [input]))
				&& (typeof filter !== 'string' || new RegExp(filter).test(input))
				&& (!(filter instanceof RegExp) || filter.test(input));
		}
	
	});
	
	
	Selectize.count = 0;
	Selectize.defaults = {
		options: [],
		optgroups: [],
	
		plugins: [],
		delimiter: ',',
		splitOn: null, // regexp or string for splitting up values from a paste command
		persist: true,
		diacritics: true,
		create: false,
		createOnBlur: false,
		createFilter: null,
		highlight: true,
		openOnFocus: true,
		maxOptions: 1000,
		maxItems: null,
		hideSelected: null,
		addPrecedence: false,
		selectOnTab: false,
		preload: false,
		allowEmptyOption: false,
		closeAfterSelect: false,
	
		scrollDuration: 60,
		loadThrottle: 300,
		loadingClass: 'loading',
	
		dataAttr: 'data-data',
		optgroupField: 'optgroup',
		valueField: 'value',
		labelField: 'text',
		optgroupLabelField: 'label',
		optgroupValueField: 'value',
		lockOptgroupOrder: false,
	
		sortField: '$order',
		searchField: ['text'],
		searchConjunction: 'and',
	
		mode: null,
		wrapperClass: 'selectize-control',
		inputClass: 'selectize-input',
		dropdownClass: 'selectize-dropdown',
		dropdownContentClass: 'selectize-dropdown-content',
	
		dropdownParent: null,
	
		copyClassesToDropdown: true,
	
		/*
		load                 : null, // function(query, callback) { ... }
		score                : null, // function(search) { ... }
		onInitialize         : null, // function() { ... }
		onChange             : null, // function(value) { ... }
		onItemAdd            : null, // function(value, $item) { ... }
		onItemRemove         : null, // function(value) { ... }
		onClear              : null, // function() { ... }
		onOptionAdd          : null, // function(value, data) { ... }
		onOptionRemove       : null, // function(value) { ... }
		onOptionClear        : null, // function() { ... }
		onOptionGroupAdd     : null, // function(id, data) { ... }
		onOptionGroupRemove  : null, // function(id) { ... }
		onOptionGroupClear   : null, // function() { ... }
		onDropdownOpen       : null, // function($dropdown) { ... }
		onDropdownClose      : null, // function($dropdown) { ... }
		onType               : null, // function(str) { ... }
		onDelete             : null, // function(values) { ... }
		*/
	
		render: {
			/*
			item: null,
			optgroup: null,
			optgroup_header: null,
			option: null,
			option_create: null
			*/
		}
	};
	
	
	$.fn.selectize = function(settings_user) {
		var defaults             = $.fn.selectize.defaults;
		var settings             = $.extend({}, defaults, settings_user);
		var attr_data            = settings.dataAttr;
		var field_label          = settings.labelField;
		var field_value          = settings.valueField;
		var field_optgroup       = settings.optgroupField;
		var field_optgroup_label = settings.optgroupLabelField;
		var field_optgroup_value = settings.optgroupValueField;
	
		/**
		 * Initializes selectize from a <input type="text"> element.
		 *
		 * @param {object} $input
		 * @param {object} settings_element
		 */
		var init_textbox = function($input, settings_element) {
			var i, n, values, option;
	
			var data_raw = $input.attr(attr_data);
	
			if (!data_raw) {
				var value = $.trim($input.val() || '');
				if (!settings.allowEmptyOption && !value.length) return;
				values = value.split(settings.delimiter);
				for (i = 0, n = values.length; i < n; i++) {
					option = {};
					option[field_label] = values[i];
					option[field_value] = values[i];
					settings_element.options.push(option);
				}
				settings_element.items = values;
			} else {
				settings_element.options = JSON.parse(data_raw);
				for (i = 0, n = settings_element.options.length; i < n; i++) {
					settings_element.items.push(settings_element.options[i][field_value]);
				}
			}
		};
	
		/**
		 * Initializes selectize from a <select> element.
		 *
		 * @param {object} $input
		 * @param {object} settings_element
		 */
		var init_select = function($input, settings_element) {
			var i, n, tagName, $children, order = 0;
			var options = settings_element.options;
			var optionsMap = {};
	
			var readData = function($el) {
				var data = attr_data && $el.attr(attr_data);
				if (typeof data === 'string' && data.length) {
					return JSON.parse(data);
				}
				return null;
			};
	
			var addOption = function($option, group) {
				$option = $($option);
	
				var value = hash_key($option.val());
				if (!value && !settings.allowEmptyOption) return;
	
				// if the option already exists, it's probably been
				// duplicated in another optgroup. in this case, push
				// the current group to the "optgroup" property on the
				// existing option so that it's rendered in both places.
				if (optionsMap.hasOwnProperty(value)) {
					if (group) {
						var arr = optionsMap[value][field_optgroup];
						if (!arr) {
							optionsMap[value][field_optgroup] = group;
						} else if (!$.isArray(arr)) {
							optionsMap[value][field_optgroup] = [arr, group];
						} else {
							arr.push(group);
						}
					}
					return;
				}
	
				var option             = readData($option) || {};
				option[field_label]    = option[field_label] || $option.text();
				option[field_value]    = option[field_value] || value;
				option[field_optgroup] = option[field_optgroup] || group;
	
				optionsMap[value] = option;
				options.push(option);
	
				if ($option.is(':selected')) {
					settings_element.items.push(value);
				}
			};
	
			var addGroup = function($optgroup) {
				var i, n, id, optgroup, $options;
	
				$optgroup = $($optgroup);
				id = $optgroup.attr('label');
	
				if (id) {
					optgroup = readData($optgroup) || {};
					optgroup[field_optgroup_label] = id;
					optgroup[field_optgroup_value] = id;
					settings_element.optgroups.push(optgroup);
				}
	
				$options = $('option', $optgroup);
				for (i = 0, n = $options.length; i < n; i++) {
					addOption($options[i], id);
				}
			};
	
			settings_element.maxItems = $input.attr('multiple') ? null : 1;
	
			$children = $input.children();
			for (i = 0, n = $children.length; i < n; i++) {
				tagName = $children[i].tagName.toLowerCase();
				if (tagName === 'optgroup') {
					addGroup($children[i]);
				} else if (tagName === 'option') {
					addOption($children[i]);
				}
			}
		};
	
		return this.each(function() {
			if (this.selectize) return;
	
			var instance;
			var $input = $(this);
			var tag_name = this.tagName.toLowerCase();
			var placeholder = $input.attr('placeholder') || $input.attr('data-placeholder');
			if (!placeholder && !settings.allowEmptyOption) {
				placeholder = $input.children('option[value=""]').text();
			}
	
			var settings_element = {
				'placeholder' : placeholder,
				'options'     : [],
				'optgroups'   : [],
				'items'       : []
			};
	
			if (tag_name === 'select') {
				init_select($input, settings_element);
			} else {
				init_textbox($input, settings_element);
			}
	
			instance = new Selectize($input, $.extend(true, {}, defaults, settings_element, settings_user));
		});
	};
	
	$.fn.selectize.defaults = Selectize.defaults;
	$.fn.selectize.support = {
		validity: SUPPORTS_VALIDITY_API
	};
	
	
	Selectize.define('drag_drop', function(options) {
		if (!$.fn.sortable) throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
		if (this.settings.mode !== 'multi') return;
		var self = this;
	
		self.lock = (function() {
			var original = self.lock;
			return function() {
				var sortable = self.$control.data('sortable');
				if (sortable) sortable.disable();
				return original.apply(self, arguments);
			};
		})();
	
		self.unlock = (function() {
			var original = self.unlock;
			return function() {
				var sortable = self.$control.data('sortable');
				if (sortable) sortable.enable();
				return original.apply(self, arguments);
			};
		})();
	
		self.setup = (function() {
			var original = self.setup;
			return function() {
				original.apply(this, arguments);
	
				var $control = self.$control.sortable({
					items: '[data-value]',
					forcePlaceholderSize: true,
					disabled: self.isLocked,
					start: function(e, ui) {
						ui.placeholder.css('width', ui.helper.css('width'));
						$control.css({overflow: 'visible'});
					},
					stop: function() {
						$control.css({overflow: 'hidden'});
						var active = self.$activeItems ? self.$activeItems.slice() : null;
						var values = [];
						$control.children('[data-value]').each(function() {
							values.push($(this).attr('data-value'));
						});
						self.setValue(values);
						self.setActiveItem(active);
					}
				});
			};
		})();
	
	});
	
	Selectize.define('dropdown_header', function(options) {
		var self = this;
	
		options = $.extend({
			title         : 'Untitled',
			headerClass   : 'selectize-dropdown-header',
			titleRowClass : 'selectize-dropdown-header-title',
			labelClass    : 'selectize-dropdown-header-label',
			closeClass    : 'selectize-dropdown-header-close',
	
			html: function(data) {
				return (
					'<div class="' + data.headerClass + '">' +
						'<div class="' + data.titleRowClass + '">' +
							'<span class="' + data.labelClass + '">' + data.title + '</span>' +
							'<a href="javascript:void(0)" class="' + data.closeClass + '">&times;</a>' +
						'</div>' +
					'</div>'
				);
			}
		}, options);
	
		self.setup = (function() {
			var original = self.setup;
			return function() {
				original.apply(self, arguments);
				self.$dropdown_header = $(options.html(options));
				self.$dropdown.prepend(self.$dropdown_header);
			};
		})();
	
	});
	
	Selectize.define('optgroup_columns', function(options) {
		var self = this;
	
		options = $.extend({
			equalizeWidth  : true,
			equalizeHeight : true
		}, options);
	
		this.getAdjacentOption = function($option, direction) {
			var $options = $option.closest('[data-group]').find('[data-selectable]');
			var index    = $options.index($option) + direction;
	
			return index >= 0 && index < $options.length ? $options.eq(index) : $();
		};
	
		this.onKeyDown = (function() {
			var original = self.onKeyDown;
			return function(e) {
				var index, $option, $options, $optgroup;
	
				if (this.isOpen && (e.keyCode === KEY_LEFT || e.keyCode === KEY_RIGHT)) {
					self.ignoreHover = true;
					$optgroup = this.$activeOption.closest('[data-group]');
					index = $optgroup.find('[data-selectable]').index(this.$activeOption);
	
					if(e.keyCode === KEY_LEFT) {
						$optgroup = $optgroup.prev('[data-group]');
					} else {
						$optgroup = $optgroup.next('[data-group]');
					}
	
					$options = $optgroup.find('[data-selectable]');
					$option  = $options.eq(Math.min($options.length - 1, index));
					if ($option.length) {
						this.setActiveOption($option);
					}
					return;
				}
	
				return original.apply(this, arguments);
			};
		})();
	
		var getScrollbarWidth = function() {
			var div;
			var width = getScrollbarWidth.width;
			var doc = document;
	
			if (typeof width === 'undefined') {
				div = doc.createElement('div');
				div.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
				div = div.firstChild;
				doc.body.appendChild(div);
				width = getScrollbarWidth.width = div.offsetWidth - div.clientWidth;
				doc.body.removeChild(div);
			}
			return width;
		};
	
		var equalizeSizes = function() {
			var i, n, height_max, width, width_last, width_parent, $optgroups;
	
			$optgroups = $('[data-group]', self.$dropdown_content);
			n = $optgroups.length;
			if (!n || !self.$dropdown_content.width()) return;
	
			if (options.equalizeHeight) {
				height_max = 0;
				for (i = 0; i < n; i++) {
					height_max = Math.max(height_max, $optgroups.eq(i).height());
				}
				$optgroups.css({height: height_max});
			}
	
			if (options.equalizeWidth) {
				width_parent = self.$dropdown_content.innerWidth() - getScrollbarWidth();
				width = Math.round(width_parent / n);
				$optgroups.css({width: width});
				if (n > 1) {
					width_last = width_parent - width * (n - 1);
					$optgroups.eq(n - 1).css({width: width_last});
				}
			}
		};
	
		if (options.equalizeHeight || options.equalizeWidth) {
			hook.after(this, 'positionDropdown', equalizeSizes);
			hook.after(this, 'refreshOptions', equalizeSizes);
		}
	
	
	});
	
	Selectize.define('remove_button', function(options) {
		options = $.extend({
				label     : '&times;',
				title     : 'Remove',
				className : 'remove',
				append    : true
			}, options);
	
			var singleClose = function(thisRef, options) {
	
				options.className = 'remove-single';
	
				var self = thisRef;
				var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
	
				/**
				 * Appends an element as a child (with raw HTML).
				 *
				 * @param {string} html_container
				 * @param {string} html_element
				 * @return {string}
				 */
				var append = function(html_container, html_element) {
					return html_container + html_element;
				};
	
				thisRef.setup = (function() {
					var original = self.setup;
					return function() {
						// override the item rendering method to add the button to each
						if (options.append) {
							var id = $(self.$input.context).attr('id');
							var selectizer = $('#'+id);
	
							var render_item = self.settings.render.item;
							self.settings.render.item = function(data) {
								return append(render_item.apply(thisRef, arguments), html);
							};
						}
	
						original.apply(thisRef, arguments);
	
						// add event listener
						thisRef.$control.on('click', '.' + options.className, function(e) {
							e.preventDefault();
							if (self.isLocked) return;
	
							self.clear();
						});
	
					};
				})();
			};
	
			var multiClose = function(thisRef, options) {
	
				var self = thisRef;
				var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
	
				/**
				 * Appends an element as a child (with raw HTML).
				 *
				 * @param {string} html_container
				 * @param {string} html_element
				 * @return {string}
				 */
				var append = function(html_container, html_element) {
					var pos = html_container.search(/(<\/[^>]+>\s*)$/);
					return html_container.substring(0, pos) + html_element + html_container.substring(pos);
				};
	
				thisRef.setup = (function() {
					var original = self.setup;
					return function() {
						// override the item rendering method to add the button to each
						if (options.append) {
							var render_item = self.settings.render.item;
							self.settings.render.item = function(data) {
								return append(render_item.apply(thisRef, arguments), html);
							};
						}
	
						original.apply(thisRef, arguments);
	
						// add event listener
						thisRef.$control.on('click', '.' + options.className, function(e) {
							e.preventDefault();
							if (self.isLocked) return;
	
							var $item = $(e.currentTarget).parent();
							self.setActiveItem($item);
							if (self.deleteSelection()) {
								self.setCaret(self.items.length);
							}
						});
	
					};
				})();
			};
	
			if (this.settings.mode === 'single') {
				singleClose(this, options);
				return;
			} else {
				multiClose(this, options);
			}
	});
	
	
	Selectize.define('restore_on_backspace', function(options) {
		var self = this;
	
		options.text = options.text || function(option) {
			return option[this.settings.labelField];
		};
	
		this.onKeyDown = (function() {
			var original = self.onKeyDown;
			return function(e) {
				var index, option;
				if (e.keyCode === KEY_BACKSPACE && this.$control_input.val() === '' && !this.$activeItems.length) {
					index = this.caretPos - 1;
					if (index >= 0 && index < this.items.length) {
						option = this.options[this.items[index]];
						if (this.deleteSelection(e)) {
							this.setTextboxValue(options.text.apply(this, [option]));
							this.refreshOptions(true);
						}
						e.preventDefault();
						return;
					}
				}
				return original.apply(this, arguments);
			};
		})();
	});
	

	return Selectize;
}));


// Spectrum Colorpicker v1.8.0
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT

(function (factory) {
    "use strict";

    if (typeof define === 'function' && define.amd) { // AMD
        define(['jquery'], factory);
    }
    else if (typeof exports == "object" && typeof module == "object") { // CommonJS
        module.exports = factory(require('jquery'));
    }
    else { // Browser
        factory(jQuery);
    }
})(function($, undefined) {
    "use strict";

    var defaultOpts = {

        // Callbacks
        beforeShow: noop,
        move: noop,
        change: noop,
        show: noop,
        hide: noop,

        // Options
        color: false,
        flat: false,
        showInput: false,
        allowEmpty: false,
        showButtons: true,
        clickoutFiresChange: true,
        showInitial: false,
        showPalette: false,
        showPaletteOnly: false,
        hideAfterPaletteSelect: false,
        togglePaletteOnly: false,
        showSelectionPalette: true,
        localStorageKey: false,
        appendTo: "body",
        maxSelectionSize: 7,
        cancelText: "cancel",
        chooseText: "choose",
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        clearText: "Clear Color Selection",
        noColorSelectedText: "No Color Selected",
        preferredFormat: false,
        className: "", // Deprecated - use containerClassName and replacerClassName instead.
        containerClassName: "",
        replacerClassName: "",
        showAlpha: false,
        theme: "sp-light",
        palette: [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]],
        selectionPalette: [],
        disabled: false,
        offset: null
    },
    spectrums = [],
    IE = !!/msie/i.exec( window.navigator.userAgent ),
    rgbaSupport = (function() {
        function contains( str, substr ) {
            return !!~('' + str).indexOf(substr);
        }

        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background-color:rgba(0,0,0,.5)';
        return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
    })(),
    replaceInput = [
        "<div class='sp-replacer'>",
            "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
            "<div class='sp-dd'>&#9660;</div>",
        "</div>"
    ].join(''),
    markup = (function () {

        // IE does not support gradients with multiple stops, so we need to simulate
        //  that for the rainbow slider with 8 divs that each have a single gradient
        var gradientFix = "";
        if (IE) {
            for (var i = 1; i <= 6; i++) {
                gradientFix += "<div class='sp-" + i + "'></div>";
            }
        }

        return [
            "<div class='sp-container sp-hidden'>",
                "<div class='sp-palette-container'>",
                    "<div class='sp-palette sp-thumb sp-cf'></div>",
                    "<div class='sp-palette-button-container sp-cf'>",
                        "<button type='button' class='sp-palette-toggle'></button>",
                    "</div>",
                "</div>",
                "<div class='sp-picker-container'>",
                    "<div class='sp-top sp-cf'>",
                        "<div class='sp-fill'></div>",
                        "<div class='sp-top-inner'>",
                            "<div class='sp-color'>",
                                "<div class='sp-sat'>",
                                    "<div class='sp-val'>",
                                        "<div class='sp-dragger'></div>",
                                    "</div>",
                                "</div>",
                            "</div>",
                            "<div class='sp-clear sp-clear-display'>",
                            "</div>",
                            "<div class='sp-hue'>",
                                "<div class='sp-slider'></div>",
                                gradientFix,
                            "</div>",
                        "</div>",
                        "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
                    "</div>",
                    "<div class='sp-input-container sp-cf'>",
                        "<input class='sp-input' type='text' spellcheck='false'  />",
                    "</div>",
                    "<div class='sp-initial sp-thumb sp-cf'></div>",
                    "<div class='sp-button-container sp-cf'>",
                        "<a class='sp-cancel' href='#'></a>",
                        "<button type='button' class='sp-choose'></button>",
                    "</div>",
                "</div>",
            "</div>"
        ].join("");
    })();

    function paletteTemplate (p, color, className, opts) {
        var html = [];
        for (var i = 0; i < p.length; i++) {
            var current = p[i];
            if(current) {
                var tiny = tinycolor(current);
                var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
                c += (tinycolor.equals(color, current)) ? " sp-thumb-active" : "";
                var formattedString = tiny.toString(opts.preferredFormat || "rgb");
                var swatchStyle = rgbaSupport ? ("background-color:" + tiny.toRgbString()) : "filter:" + tiny.toFilter();
                html.push('<span title="' + formattedString + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
            } else {
                var cls = 'sp-clear-display';
                html.push($('<div />')
                    .append($('<span data-color="" style="background-color:transparent;" class="' + cls + '"></span>')
                        .attr('title', opts.noColorSelectedText)
                    )
                    .html()
                );
            }
        }
        return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
    }

    function hideAll() {
        for (var i = 0; i < spectrums.length; i++) {
            if (spectrums[i]) {
                spectrums[i].hide();
            }
        }
    }

    function instanceOptions(o, callbackContext) {
        var opts = $.extend({}, defaultOpts, o);
        opts.callbacks = {
            'move': bind(opts.move, callbackContext),
            'change': bind(opts.change, callbackContext),
            'show': bind(opts.show, callbackContext),
            'hide': bind(opts.hide, callbackContext),
            'beforeShow': bind(opts.beforeShow, callbackContext)
        };

        return opts;
    }

    function spectrum(element, o) {

        var opts = instanceOptions(o, element),
            flat = opts.flat,
            showSelectionPalette = opts.showSelectionPalette,
            localStorageKey = opts.localStorageKey,
            theme = opts.theme,
            callbacks = opts.callbacks,
            resize = throttle(reflow, 10),
            visible = false,
            isDragging = false,
            dragWidth = 0,
            dragHeight = 0,
            dragHelperHeight = 0,
            slideHeight = 0,
            slideWidth = 0,
            alphaWidth = 0,
            alphaSlideHelperWidth = 0,
            slideHelperHeight = 0,
            currentHue = 0,
            currentSaturation = 0,
            currentValue = 0,
            currentAlpha = 1,
            palette = [],
            paletteArray = [],
            paletteLookup = {},
            selectionPalette = opts.selectionPalette.slice(0),
            maxSelectionSize = opts.maxSelectionSize,
            draggingClass = "sp-dragging",
            shiftMovementDirection = null;

        var doc = element.ownerDocument,
            body = doc.body,
            boundElement = $(element),
            disabled = false,
            container = $(markup, doc).addClass(theme),
            pickerContainer = container.find(".sp-picker-container"),
            dragger = container.find(".sp-color"),
            dragHelper = container.find(".sp-dragger"),
            slider = container.find(".sp-hue"),
            slideHelper = container.find(".sp-slider"),
            alphaSliderInner = container.find(".sp-alpha-inner"),
            alphaSlider = container.find(".sp-alpha"),
            alphaSlideHelper = container.find(".sp-alpha-handle"),
            textInput = container.find(".sp-input"),
            paletteContainer = container.find(".sp-palette"),
            initialColorContainer = container.find(".sp-initial"),
            cancelButton = container.find(".sp-cancel"),
            clearButton = container.find(".sp-clear"),
            chooseButton = container.find(".sp-choose"),
            toggleButton = container.find(".sp-palette-toggle"),
            isInput = boundElement.is("input"),
            isInputTypeColor = isInput && boundElement.attr("type") === "color" && inputTypeColorSupport(),
            shouldReplace = isInput && !flat,
            replacer = (shouldReplace) ? $(replaceInput).addClass(theme).addClass(opts.className).addClass(opts.replacerClassName) : $([]),
            offsetElement = (shouldReplace) ? replacer : boundElement,
            previewElement = replacer.find(".sp-preview-inner"),
            initialColor = opts.color || (isInput && boundElement.val()),
            colorOnShow = false,
            currentPreferredFormat = opts.preferredFormat,
            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange,
            isEmpty = !initialColor,
            allowEmpty = opts.allowEmpty && !isInputTypeColor;

        function applyOptions() {

            if (opts.showPaletteOnly) {
                opts.showPalette = true;
            }

            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);

            if (opts.palette) {
                palette = opts.palette.slice(0);
                paletteArray = $.isArray(palette[0]) ? palette : [palette];
                paletteLookup = {};
                for (var i = 0; i < paletteArray.length; i++) {
                    for (var j = 0; j < paletteArray[i].length; j++) {
                        var rgb = tinycolor(paletteArray[i][j]).toRgbString();
                        paletteLookup[rgb] = true;
                    }
                }
            }

            container.toggleClass("sp-flat", flat);
            container.toggleClass("sp-input-disabled", !opts.showInput);
            container.toggleClass("sp-alpha-enabled", opts.showAlpha);
            container.toggleClass("sp-clear-enabled", allowEmpty);
            container.toggleClass("sp-buttons-disabled", !opts.showButtons);
            container.toggleClass("sp-palette-buttons-disabled", !opts.togglePaletteOnly);
            container.toggleClass("sp-palette-disabled", !opts.showPalette);
            container.toggleClass("sp-palette-only", opts.showPaletteOnly);
            container.toggleClass("sp-initial-disabled", !opts.showInitial);
            container.addClass(opts.className).addClass(opts.containerClassName);

            reflow();
        }

        function initialize() {

            if (IE) {
                container.find("*:not(input)").attr("unselectable", "on");
            }

            applyOptions();

            if (shouldReplace) {
                boundElement.after(replacer).hide();
            }

            if (!allowEmpty) {
                clearButton.hide();
            }

            if (flat) {
                boundElement.after(container).hide();
            }
            else {

                var appendTo = opts.appendTo === "parent" ? boundElement.parent() : $(opts.appendTo);
                if (appendTo.length !== 1) {
                    appendTo = $("body");
                }

                appendTo.append(container);
            }

            updateSelectionPaletteFromStorage();

            offsetElement.bind("click.spectrum touchstart.spectrum", function (e) {
                if (!disabled) {
                    toggle();
                }

                e.stopPropagation();

                if (!$(e.target).is("input")) {
                    e.preventDefault();
                }
            });

            if(boundElement.is(":disabled") || (opts.disabled === true)) {
                disable();
            }

            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
            container.click(stopPropagation);

            // Handle user typed input
            textInput.change(setFromTextInput);
            textInput.bind("paste", function () {
                setTimeout(setFromTextInput, 1);
            });
            textInput.keydown(function (e) { if (e.keyCode == 13) { setFromTextInput(); } });

            cancelButton.text(opts.cancelText);
            cancelButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                revert();
                hide();
            });

            clearButton.attr("title", opts.clearText);
            clearButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                isEmpty = true;
                move();

                if(flat) {
                    //for the flat style, this is a change event
                    updateOriginalInput(true);
                }
            });

            chooseButton.text(opts.chooseText);
            chooseButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (IE && textInput.is(":focus")) {
                    textInput.trigger('change');
                }

                if (isValid()) {
                    updateOriginalInput(true);
                    hide();
                }
            });

            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);
            toggleButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                opts.showPaletteOnly = !opts.showPaletteOnly;

                // To make sure the Picker area is drawn on the right, next to the
                // Palette area (and not below the palette), first move the Palette
                // to the left to make space for the picker, plus 5px extra.
                // The 'applyOptions' function puts the whole container back into place
                // and takes care of the button-text and the sp-palette-only CSS class.
                if (!opts.showPaletteOnly && !flat) {
                    container.css('left', '-=' + (pickerContainer.outerWidth(true) + 5));
                }
                applyOptions();
            });

            draggable(alphaSlider, function (dragX, dragY, e) {
                currentAlpha = (dragX / alphaWidth);
                isEmpty = false;
                if (e.shiftKey) {
                    currentAlpha = Math.round(currentAlpha * 10) / 10;
                }

                move();
            }, dragStart, dragStop);

            draggable(slider, function (dragX, dragY) {
                currentHue = parseFloat(dragY / slideHeight);
                isEmpty = false;
                if (!opts.showAlpha) {
                    currentAlpha = 1;
                }
                move();
            }, dragStart, dragStop);

            draggable(dragger, function (dragX, dragY, e) {

                // shift+drag should snap the movement to either the x or y axis.
                if (!e.shiftKey) {
                    shiftMovementDirection = null;
                }
                else if (!shiftMovementDirection) {
                    var oldDragX = currentSaturation * dragWidth;
                    var oldDragY = dragHeight - (currentValue * dragHeight);
                    var furtherFromX = Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);

                    shiftMovementDirection = furtherFromX ? "x" : "y";
                }

                var setSaturation = !shiftMovementDirection || shiftMovementDirection === "x";
                var setValue = !shiftMovementDirection || shiftMovementDirection === "y";

                if (setSaturation) {
                    currentSaturation = parseFloat(dragX / dragWidth);
                }
                if (setValue) {
                    currentValue = parseFloat((dragHeight - dragY) / dragHeight);
                }

                isEmpty = false;
                if (!opts.showAlpha) {
                    currentAlpha = 1;
                }

                move();

            }, dragStart, dragStop);

            if (!!initialColor) {
                set(initialColor);

                // In case color was black - update the preview UI and set the format
                // since the set function will not run (default color is black).
                updateUI();
                currentPreferredFormat = opts.preferredFormat || tinycolor(initialColor).format;

                addColorToSelectionPalette(initialColor);
            }
            else {
                updateUI();
            }

            if (flat) {
                show();
            }

            function paletteElementClick(e) {
                if (e.data && e.data.ignore) {
                    set($(e.target).closest(".sp-thumb-el").data("color"));
                    move();
                }
                else {
                    set($(e.target).closest(".sp-thumb-el").data("color"));
                    move();
                    updateOriginalInput(true);
                    if (opts.hideAfterPaletteSelect) {
                      hide();
                    }
                }

                return false;
            }

            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            paletteContainer.delegate(".sp-thumb-el", paletteEvent, paletteElementClick);
            initialColorContainer.delegate(".sp-thumb-el:nth-child(1)", paletteEvent, { ignore: true }, paletteElementClick);
        }

        function updateSelectionPaletteFromStorage() {

            if (localStorageKey && window.localStorage) {

                // Migrate old palettes over to new format.  May want to remove this eventually.
                try {
                    var oldPalette = window.localStorage[localStorageKey].split(",#");
                    if (oldPalette.length > 1) {
                        delete window.localStorage[localStorageKey];
                        $.each(oldPalette, function(i, c) {
                             addColorToSelectionPalette(c);
                        });
                    }
                }
                catch(e) { }

                try {
                    selectionPalette = window.localStorage[localStorageKey].split(";");
                }
                catch (e) { }
            }
        }

        function addColorToSelectionPalette(color) {
            if (showSelectionPalette) {
                var rgb = tinycolor(color).toRgbString();
                if (!paletteLookup[rgb] && $.inArray(rgb, selectionPalette) === -1) {
                    selectionPalette.push(rgb);
                    while(selectionPalette.length > maxSelectionSize) {
                        selectionPalette.shift();
                    }
                }

                if (localStorageKey && window.localStorage) {
                    try {
                        window.localStorage[localStorageKey] = selectionPalette.join(";");
                    }
                    catch(e) { }
                }
            }
        }

        function getUniqueSelectionPalette() {
            var unique = [];
            if (opts.showPalette) {
                for (var i = 0; i < selectionPalette.length; i++) {
                    var rgb = tinycolor(selectionPalette[i]).toRgbString();

                    if (!paletteLookup[rgb]) {
                        unique.push(selectionPalette[i]);
                    }
                }
            }

            return unique.reverse().slice(0, opts.maxSelectionSize);
        }

        function drawPalette() {

            var currentColor = get();

            var html = $.map(paletteArray, function (palette, i) {
                return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i, opts);
            });

            updateSelectionPaletteFromStorage();

            if (selectionPalette) {
                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection", opts));
            }

            paletteContainer.html(html.join(""));
        }

        function drawInitial() {
            if (opts.showInitial) {
                var initial = colorOnShow;
                var current = get();
                initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial", opts));
            }
        }

        function dragStart() {
            if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
                reflow();
            }
            isDragging = true;
            container.addClass(draggingClass);
            shiftMovementDirection = null;
            boundElement.trigger('dragstart.spectrum', [ get() ]);
        }

        function dragStop() {
            isDragging = false;
            container.removeClass(draggingClass);
            boundElement.trigger('dragstop.spectrum', [ get() ]);
        }

        function setFromTextInput() {

            var value = textInput.val();

            if ((value === null || value === "") && allowEmpty) {
                set(null);
                updateOriginalInput(true);
            }
            else {
                var tiny = tinycolor(value);
                if (tiny.isValid()) {
                    set(tiny);
                    updateOriginalInput(true);
                }
                else {
                    textInput.addClass("sp-validation-error");
                }
            }
        }

        function toggle() {
            if (visible) {
                hide();
            }
            else {
                show();
            }
        }

        function show() {
            var event = $.Event('beforeShow.spectrum');

            if (visible) {
                reflow();
                return;
            }

            boundElement.trigger(event, [ get() ]);

            if (callbacks.beforeShow(get()) === false || event.isDefaultPrevented()) {
                return;
            }

            hideAll();
            visible = true;

            $(doc).bind("keydown.spectrum", onkeydown);
            $(doc).bind("click.spectrum", clickout);
            $(window).bind("resize.spectrum", resize);
            replacer.addClass("sp-active");
            container.removeClass("sp-hidden");

            reflow();
            updateUI();

            colorOnShow = get();

            drawInitial();
            callbacks.show(colorOnShow);
            boundElement.trigger('show.spectrum', [ colorOnShow ]);
        }

        function onkeydown(e) {
            // Close on ESC
            if (e.keyCode === 27) {
                hide();
            }
        }

        function clickout(e) {
            // Return on right click.
            if (e.button == 2) { return; }

            // If a drag event was happening during the mouseup, don't hide
            // on click.
            if (isDragging) { return; }

            if (clickoutFiresChange) {
                updateOriginalInput(true);
            }
            else {
                revert();
            }
            hide();
        }

        function hide() {
            // Return if hiding is unnecessary
            if (!visible || flat) { return; }
            visible = false;

            $(doc).unbind("keydown.spectrum", onkeydown);
            $(doc).unbind("click.spectrum", clickout);
            $(window).unbind("resize.spectrum", resize);

            replacer.removeClass("sp-active");
            container.addClass("sp-hidden");

            callbacks.hide(get());
            boundElement.trigger('hide.spectrum', [ get() ]);
        }

        function revert() {
            set(colorOnShow, true);
        }

        function set(color, ignoreFormatChange) {
            if (tinycolor.equals(color, get())) {
                // Update UI just in case a validation error needs
                // to be cleared.
                updateUI();
                return;
            }

            var newColor, newHsv;
            if (!color && allowEmpty) {
                isEmpty = true;
            } else {
                isEmpty = false;
                newColor = tinycolor(color);
                newHsv = newColor.toHsv();

                currentHue = (newHsv.h % 360) / 360;
                currentSaturation = newHsv.s;
                currentValue = newHsv.v;
                currentAlpha = newHsv.a;
            }
            updateUI();

            if (newColor && newColor.isValid() && !ignoreFormatChange) {
                currentPreferredFormat = opts.preferredFormat || newColor.getFormat();
            }
        }

        function get(opts) {
            opts = opts || { };

            if (allowEmpty && isEmpty) {
                return null;
            }

            return tinycolor.fromRatio({
                h: currentHue,
                s: currentSaturation,
                v: currentValue,
                a: Math.round(currentAlpha * 100) / 100
            }, { format: opts.format || currentPreferredFormat });
        }

        function isValid() {
            return !textInput.hasClass("sp-validation-error");
        }

        function move() {
            updateUI();

            callbacks.move(get());
            boundElement.trigger('move.spectrum', [ get() ]);
        }

        function updateUI() {

            textInput.removeClass("sp-validation-error");

            updateHelperLocations();

            // Update dragger background color (gradients take care of saturation and value).
            var flatColor = tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
            dragger.css("background-color", flatColor.toHexString());

            // Get a format that alpha will be included in (hex and names ignore alpha)
            var format = currentPreferredFormat;
            if (currentAlpha < 1 && !(currentAlpha === 0 && format === "name")) {
                if (format === "hex" || format === "hex3" || format === "hex6" || format === "name") {
                    format = "rgb";
                }
            }

            var realColor = get({ format: format }),
                displayColor = '';

             //reset background info for preview element
            previewElement.removeClass("sp-clear-display");
            previewElement.css('background-color', 'transparent');

            if (!realColor && allowEmpty) {
                // Update the replaced elements background with icon indicating no color selection
                previewElement.addClass("sp-clear-display");
            }
            else {
                var realHex = realColor.toHexString(),
                    realRgb = realColor.toRgbString();

                // Update the replaced elements background color (with actual selected color)
                if (rgbaSupport || realColor.alpha === 1) {
                    previewElement.css("background-color", realRgb);
                }
                else {
                    previewElement.css("background-color", "transparent");
                    previewElement.css("filter", realColor.toFilter());
                }

                if (opts.showAlpha) {
                    var rgb = realColor.toRgb();
                    rgb.a = 0;
                    var realAlpha = tinycolor(rgb).toRgbString();
                    var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

                    if (IE) {
                        alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
                    }
                    else {
                        alphaSliderInner.css("background", "-webkit-" + gradient);
                        alphaSliderInner.css("background", "-moz-" + gradient);
                        alphaSliderInner.css("background", "-ms-" + gradient);
                        // Use current syntax gradient on unprefixed property.
                        alphaSliderInner.css("background",
                            "linear-gradient(to right, " + realAlpha + ", " + realHex + ")");
                    }
                }

                displayColor = realColor.toString(format);
            }

            // Update the text entry input as it changes happen
            if (opts.showInput) {
                textInput.val(displayColor);
            }

            if (opts.showPalette) {
                drawPalette();
            }

            drawInitial();
        }

        function updateHelperLocations() {
            var s = currentSaturation;
            var v = currentValue;

            if(allowEmpty && isEmpty) {
                //if selected color is empty, hide the helpers
                alphaSlideHelper.hide();
                slideHelper.hide();
                dragHelper.hide();
            }
            else {
                //make sure helpers are visible
                alphaSlideHelper.show();
                slideHelper.show();
                dragHelper.show();

                // Where to show the little circle in that displays your current selected color
                var dragX = s * dragWidth;
                var dragY = dragHeight - (v * dragHeight);
                dragX = Math.max(
                    -dragHelperHeight,
                    Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight)
                );
                dragY = Math.max(
                    -dragHelperHeight,
                    Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight)
                );
                dragHelper.css({
                    "top": dragY + "px",
                    "left": dragX + "px"
                });

                var alphaX = currentAlpha * alphaWidth;
                alphaSlideHelper.css({
                    "left": (alphaX - (alphaSlideHelperWidth / 2)) + "px"
                });

                // Where to show the bar that displays your current selected hue
                var slideY = (currentHue) * slideHeight;
                slideHelper.css({
                    "top": (slideY - slideHelperHeight) + "px"
                });
            }
        }

        function updateOriginalInput(fireCallback) {
            var color = get(),
                displayColor = '',
                hasChanged = !tinycolor.equals(color, colorOnShow);

            if (color) {
                displayColor = color.toString(currentPreferredFormat);
                // Update the selection palette with the current color
                addColorToSelectionPalette(color);
            }

            if (isInput) {
                boundElement.val(displayColor);
            }

            if (fireCallback && hasChanged) {
                callbacks.change(color);
                boundElement.trigger('change', [ color ]);
            }
        }

        function reflow() {
            if (!visible) {
                return; // Calculations would be useless and wouldn't be reliable anyways
            }
            dragWidth = dragger.width();
            dragHeight = dragger.height();
            dragHelperHeight = dragHelper.height();
            slideWidth = slider.width();
            slideHeight = slider.height();
            slideHelperHeight = slideHelper.height();
            alphaWidth = alphaSlider.width();
            alphaSlideHelperWidth = alphaSlideHelper.width();

            if (!flat) {
                container.css("position", "absolute");
                if (opts.offset) {
                    container.offset(opts.offset);
                } else {
                    container.offset(getOffset(container, offsetElement));
                }
            }

            updateHelperLocations();

            if (opts.showPalette) {
                drawPalette();
            }

            boundElement.trigger('reflow.spectrum');
        }

        function destroy() {
            boundElement.show();
            offsetElement.unbind("click.spectrum touchstart.spectrum");
            container.remove();
            replacer.remove();
            spectrums[spect.id] = null;
        }

        function option(optionName, optionValue) {
            if (optionName === undefined) {
                return $.extend({}, opts);
            }
            if (optionValue === undefined) {
                return opts[optionName];
            }

            opts[optionName] = optionValue;

            if (optionName === "preferredFormat") {
                currentPreferredFormat = opts.preferredFormat;
            }
            applyOptions();
        }

        function enable() {
            disabled = false;
            boundElement.attr("disabled", false);
            offsetElement.removeClass("sp-disabled");
        }

        function disable() {
            hide();
            disabled = true;
            boundElement.attr("disabled", true);
            offsetElement.addClass("sp-disabled");
        }

        function setOffset(coord) {
            opts.offset = coord;
            reflow();
        }

        initialize();

        var spect = {
            show: show,
            hide: hide,
            toggle: toggle,
            reflow: reflow,
            option: option,
            enable: enable,
            disable: disable,
            offset: setOffset,
            set: function (c) {
                set(c);
                updateOriginalInput();
            },
            get: get,
            destroy: destroy,
            container: container
        };

        spect.id = spectrums.push(spect) - 1;

        return spect;
    }

    /**
    * checkOffset - get the offset below/above and left/right element depending on screen position
    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
    */
    function getOffset(picker, input) {
        var extraY = 0;
        var dpWidth = picker.outerWidth();
        var dpHeight = picker.outerHeight();
        var inputHeight = input.outerHeight();
        var doc = picker[0].ownerDocument;
        var docElem = doc.documentElement;
        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
        var offset = input.offset();
        offset.top += inputHeight;

        offset.left -=
            Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offset.left + dpWidth - viewWidth) : 0);

        offset.top -=
            Math.min(offset.top, ((offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
            Math.abs(dpHeight + inputHeight - extraY) : extraY));

        return offset;
    }

    /**
    * noop - do nothing
    */
    function noop() {

    }

    /**
    * stopPropagation - makes the code only doing this a little easier to read in line
    */
    function stopPropagation(e) {
        e.stopPropagation();
    }

    /**
    * Create a function bound to a given object
    * Thanks to underscore.js
    */
    function bind(func, obj) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 2);
        return function () {
            return func.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    /**
    * Lightweight drag helper.  Handles containment within the element, so that
    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
    */
    function draggable(element, onmove, onstart, onstop) {
        onmove = onmove || function () { };
        onstart = onstart || function () { };
        onstop = onstop || function () { };
        var doc = document;
        var dragging = false;
        var offset = {};
        var maxHeight = 0;
        var maxWidth = 0;
        var hasTouch = ('ontouchstart' in window);

        var duringDragEvents = {};
        duringDragEvents["selectstart"] = prevent;
        duringDragEvents["dragstart"] = prevent;
        duringDragEvents["touchmove mousemove"] = move;
        duringDragEvents["touchend mouseup"] = stop;

        function prevent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        function move(e) {
            if (dragging) {
                // Mouseup happened outside of window
                if (IE && doc.documentMode < 9 && !e.button) {
                    return stop();
                }

                var t0 = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
                var pageX = t0 && t0.pageX || e.pageX;
                var pageY = t0 && t0.pageY || e.pageY;

                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

                if (hasTouch) {
                    // Stop scrolling in iOS
                    prevent(e);
                }

                onmove.apply(element, [dragX, dragY, e]);
            }
        }

        function start(e) {
            var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);

            if (!rightclick && !dragging) {
                if (onstart.apply(element, arguments) !== false) {
                    dragging = true;
                    maxHeight = $(element).height();
                    maxWidth = $(element).width();
                    offset = $(element).offset();

                    $(doc).bind(duringDragEvents);
                    $(doc.body).addClass("sp-dragging");

                    move(e);

                    prevent(e);
                }
            }
        }

        function stop() {
            if (dragging) {
                $(doc).unbind(duringDragEvents);
                $(doc.body).removeClass("sp-dragging");

                // Wait a tick before notifying observers to allow the click event
                // to fire in Chrome.
                setTimeout(function() {
                    onstop.apply(element, arguments);
                }, 0);
            }
            dragging = false;
        }

        $(element).bind("touchstart mousedown", start);
    }

    function throttle(func, wait, debounce) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var throttler = function () {
                timeout = null;
                func.apply(context, args);
            };
            if (debounce) clearTimeout(timeout);
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    }

    function inputTypeColorSupport() {
        return $.fn.spectrum.inputTypeColorSupport();
    }

    /**
    * Define a jQuery plugin
    */
    var dataID = "spectrum.id";
    $.fn.spectrum = function (opts, extra) {

        if (typeof opts == "string") {

            var returnValue = this;
            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function () {
                var spect = spectrums[$(this).data(dataID)];
                if (spect) {
                    var method = spect[opts];
                    if (!method) {
                        throw new Error( "Spectrum: no such method: '" + opts + "'" );
                    }

                    if (opts == "get") {
                        returnValue = spect.get();
                    }
                    else if (opts == "container") {
                        returnValue = spect.container;
                    }
                    else if (opts == "option") {
                        returnValue = spect.option.apply(spect, args);
                    }
                    else if (opts == "destroy") {
                        spect.destroy();
                        $(this).removeData(dataID);
                    }
                    else {
                        method.apply(spect, args);
                    }
                }
            });

            return returnValue;
        }

        // Initializing a new instance of spectrum
        return this.spectrum("destroy").each(function () {
            var options = $.extend({}, opts, $(this).data());
            var spect = spectrum(this, options);
            $(this).data(dataID, spect.id);
        });
    };

    $.fn.spectrum.load = true;
    $.fn.spectrum.loadOpts = {};
    $.fn.spectrum.draggable = draggable;
    $.fn.spectrum.defaults = defaultOpts;
    $.fn.spectrum.inputTypeColorSupport = function inputTypeColorSupport() {
        if (typeof inputTypeColorSupport._cachedResult === "undefined") {
            var colorInput = $("<input type='color'/>")[0]; // if color element is supported, value will default to not null
            inputTypeColorSupport._cachedResult = colorInput.type === "color" && colorInput.value !== "";
        }
        return inputTypeColorSupport._cachedResult;
    };

    $.spectrum = { };
    $.spectrum.localization = { };
    $.spectrum.palettes = { };

    $.fn.spectrum.processNativeColorInputs = function () {
        var colorInputs = $("input[type=color]");
        if (colorInputs.length && !inputTypeColorSupport()) {
            colorInputs.spectrum({
                preferredFormat: "hex6"
            });
        }
    };

    // TinyColor v1.1.2
    // https://github.com/bgrins/TinyColor
    // Brian Grinstead, MIT License

    (function() {

    var trimLeft = /^[\s,#]+/,
        trimRight = /\s+$/,
        tinyCounter = 0,
        math = Math,
        mathRound = math.round,
        mathMin = math.min,
        mathMax = math.max,
        mathRandom = math.random;

    var tinycolor = function(color, opts) {

        color = (color) ? color : '';
        opts = opts || { };

        // If input is already a tinycolor, return itself
        if (color instanceof tinycolor) {
           return color;
        }
        // If we are called as a function, call using new instead
        if (!(this instanceof tinycolor)) {
            return new tinycolor(color, opts);
        }

        var rgb = inputToRGB(color);
        this._originalInput = color,
        this._r = rgb.r,
        this._g = rgb.g,
        this._b = rgb.b,
        this._a = rgb.a,
        this._roundA = mathRound(100*this._a) / 100,
        this._format = opts.format || rgb.format;
        this._gradientType = opts.gradientType;

        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (this._r < 1) { this._r = mathRound(this._r); }
        if (this._g < 1) { this._g = mathRound(this._g); }
        if (this._b < 1) { this._b = mathRound(this._b); }

        this._ok = rgb.ok;
        this._tc_id = tinyCounter++;
    };

    tinycolor.prototype = {
        isDark: function() {
            return this.getBrightness() < 128;
        },
        isLight: function() {
            return !this.isDark();
        },
        isValid: function() {
            return this._ok;
        },
        getOriginalInput: function() {
          return this._originalInput;
        },
        getFormat: function() {
            return this._format;
        },
        getAlpha: function() {
            return this._a;
        },
        getBrightness: function() {
            var rgb = this.toRgb();
            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        },
        setAlpha: function(value) {
            this._a = boundAlpha(value);
            this._roundA = mathRound(100*this._a) / 100;
            return this;
        },
        toHsv: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
        },
        toHsvString: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
            return (this._a == 1) ?
              "hsv("  + h + ", " + s + "%, " + v + "%)" :
              "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
        },
        toHsl: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
        },
        toHslString: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
            return (this._a == 1) ?
              "hsl("  + h + ", " + s + "%, " + l + "%)" :
              "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
        },
        toHex: function(allow3Char) {
            return rgbToHex(this._r, this._g, this._b, allow3Char);
        },
        toHexString: function(allow3Char) {
            return '#' + this.toHex(allow3Char);
        },
        toHex8: function() {
            return rgbaToHex(this._r, this._g, this._b, this._a);
        },
        toHex8String: function() {
            return '#' + this.toHex8();
        },
        toRgb: function() {
            return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
        },
        toRgbString: function() {
            return (this._a == 1) ?
              "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
              "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
        },
        toPercentageRgb: function() {
            return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
        },
        toPercentageRgbString: function() {
            return (this._a == 1) ?
              "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
              "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
        },
        toName: function() {
            if (this._a === 0) {
                return "transparent";
            }

            if (this._a < 1) {
                return false;
            }

            return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
        },
        toFilter: function(secondColor) {
            var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
            var secondHex8String = hex8String;
            var gradientType = this._gradientType ? "GradientType = 1, " : "";

            if (secondColor) {
                var s = tinycolor(secondColor);
                secondHex8String = s.toHex8String();
            }

            return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
        },
        toString: function(format) {
            var formatSet = !!format;
            format = format || this._format;

            var formattedString = false;
            var hasAlpha = this._a < 1 && this._a >= 0;
            var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");

            if (needsAlphaFormat) {
                // Special case for "transparent", all other non-alpha formats
                // will return rgba when there is transparency.
                if (format === "name" && this._a === 0) {
                    return this.toName();
                }
                return this.toRgbString();
            }
            if (format === "rgb") {
                formattedString = this.toRgbString();
            }
            if (format === "prgb") {
                formattedString = this.toPercentageRgbString();
            }
            if (format === "hex" || format === "hex6") {
                formattedString = this.toHexString();
            }
            if (format === "hex3") {
                formattedString = this.toHexString(true);
            }
            if (format === "hex8") {
                formattedString = this.toHex8String();
            }
            if (format === "name") {
                formattedString = this.toName();
            }
            if (format === "hsl") {
                formattedString = this.toHslString();
            }
            if (format === "hsv") {
                formattedString = this.toHsvString();
            }

            return formattedString || this.toHexString();
        },

        _applyModification: function(fn, args) {
            var color = fn.apply(null, [this].concat([].slice.call(args)));
            this._r = color._r;
            this._g = color._g;
            this._b = color._b;
            this.setAlpha(color._a);
            return this;
        },
        lighten: function() {
            return this._applyModification(lighten, arguments);
        },
        brighten: function() {
            return this._applyModification(brighten, arguments);
        },
        darken: function() {
            return this._applyModification(darken, arguments);
        },
        desaturate: function() {
            return this._applyModification(desaturate, arguments);
        },
        saturate: function() {
            return this._applyModification(saturate, arguments);
        },
        greyscale: function() {
            return this._applyModification(greyscale, arguments);
        },
        spin: function() {
            return this._applyModification(spin, arguments);
        },

        _applyCombination: function(fn, args) {
            return fn.apply(null, [this].concat([].slice.call(args)));
        },
        analogous: function() {
            return this._applyCombination(analogous, arguments);
        },
        complement: function() {
            return this._applyCombination(complement, arguments);
        },
        monochromatic: function() {
            return this._applyCombination(monochromatic, arguments);
        },
        splitcomplement: function() {
            return this._applyCombination(splitcomplement, arguments);
        },
        triad: function() {
            return this._applyCombination(triad, arguments);
        },
        tetrad: function() {
            return this._applyCombination(tetrad, arguments);
        }
    };

    // If input is an object, force 1 into "1.0" to handle ratios properly
    // String input requires "1.0" as input, so 1 will be treated as 1
    tinycolor.fromRatio = function(color, opts) {
        if (typeof color == "object") {
            var newColor = {};
            for (var i in color) {
                if (color.hasOwnProperty(i)) {
                    if (i === "a") {
                        newColor[i] = color[i];
                    }
                    else {
                        newColor[i] = convertToPercentage(color[i]);
                    }
                }
            }
            color = newColor;
        }

        return tinycolor(color, opts);
    };

    // Given a string or object, convert that input to RGB
    // Possible string inputs:
    //
    //     "red"
    //     "#f00" or "f00"
    //     "#ff0000" or "ff0000"
    //     "#ff000000" or "ff000000"
    //     "rgb 255 0 0" or "rgb (255, 0, 0)"
    //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
    //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
    //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
    //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
    //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
    //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
    //
    function inputToRGB(color) {

        var rgb = { r: 0, g: 0, b: 0 };
        var a = 1;
        var ok = false;
        var format = false;

        if (typeof color == "string") {
            color = stringInputToObject(color);
        }

        if (typeof color == "object") {
            if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
                rgb = rgbToRgb(color.r, color.g, color.b);
                ok = true;
                format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
            }
            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
                color.s = convertToPercentage(color.s);
                color.v = convertToPercentage(color.v);
                rgb = hsvToRgb(color.h, color.s, color.v);
                ok = true;
                format = "hsv";
            }
            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
                color.s = convertToPercentage(color.s);
                color.l = convertToPercentage(color.l);
                rgb = hslToRgb(color.h, color.s, color.l);
                ok = true;
                format = "hsl";
            }

            if (color.hasOwnProperty("a")) {
                a = color.a;
            }
        }

        a = boundAlpha(a);

        return {
            ok: ok,
            format: color.format || format,
            r: mathMin(255, mathMax(rgb.r, 0)),
            g: mathMin(255, mathMax(rgb.g, 0)),
            b: mathMin(255, mathMax(rgb.b, 0)),
            a: a
        };
    }


    // Conversion Functions
    // --------------------

    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

    // `rgbToRgb`
    // Handle bounds / percentage checking to conform to CSS color spec
    // <http://www.w3.org/TR/css3-color/>
    // *Assumes:* r, g, b in [0, 255] or [0, 1]
    // *Returns:* { r, g, b } in [0, 255]
    function rgbToRgb(r, g, b){
        return {
            r: bound01(r, 255) * 255,
            g: bound01(g, 255) * 255,
            b: bound01(b, 255) * 255
        };
    }

    // `rgbToHsl`
    // Converts an RGB color value to HSL.
    // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
    // *Returns:* { h, s, l } in [0,1]
    function rgbToHsl(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min) {
            h = s = 0; // achromatic
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return { h: h, s: s, l: l };
    }

    // `hslToRgb`
    // Converts an HSL color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hslToRgb(h, s, l) {
        var r, g, b;

        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);

        function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        if(s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHsv`
    // Converts an RGB color value to HSV
    // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
    // *Returns:* { h, s, v } in [0,1]
    function rgbToHsv(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max === 0 ? 0 : d / max;

        if(max == min) {
            h = 0; // achromatic
        }
        else {
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h, s: s, v: v };
    }

    // `hsvToRgb`
    // Converts an HSV color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
     function hsvToRgb(h, s, v) {

        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);

        var i = math.floor(h),
            f = h - i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s),
            mod = i % 6,
            r = [v, q, p, p, t, v][mod],
            g = [t, v, v, q, p, p][mod],
            b = [p, p, t, v, v, q][mod];

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHex`
    // Converts an RGB color to hex
    // Assumes r, g, and b are contained in the set [0, 255]
    // Returns a 3 or 6 character hex
    function rgbToHex(r, g, b, allow3Char) {

        var hex = [
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];

        // Return a 3 character hex if possible
        if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }

        return hex.join("");
    }
        // `rgbaToHex`
        // Converts an RGBA color plus alpha transparency to hex
        // Assumes r, g, b and a are contained in the set [0, 255]
        // Returns an 8 character hex
        function rgbaToHex(r, g, b, a) {

            var hex = [
                pad2(convertDecimalToHex(a)),
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];

            return hex.join("");
        }

    // `equals`
    // Can be called with any tinycolor input
    tinycolor.equals = function (color1, color2) {
        if (!color1 || !color2) { return false; }
        return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
    };
    tinycolor.random = function() {
        return tinycolor.fromRatio({
            r: mathRandom(),
            g: mathRandom(),
            b: mathRandom()
        });
    };


    // Modification Functions
    // ----------------------
    // Thanks to less.js for some of the basics here
    // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

    function desaturate(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }

    function saturate(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }

    function greyscale(color) {
        return tinycolor(color).desaturate(100);
    }

    function lighten (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }

    function brighten(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var rgb = tinycolor(color).toRgb();
        rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
        rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
        rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
        return tinycolor(rgb);
    }

    function darken (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }

    // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
    // Values outside of this range will be wrapped into this range.
    function spin(color, amount) {
        var hsl = tinycolor(color).toHsl();
        var hue = (mathRound(hsl.h) + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return tinycolor(hsl);
    }

    // Combination Functions
    // ---------------------
    // Thanks to jQuery xColor for some of the ideas behind these
    // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

    function complement(color) {
        var hsl = tinycolor(color).toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return tinycolor(hsl);
    }

    function triad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
        ];
    }

    function tetrad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
        ];
    }

    function splitcomplement(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
            tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
        ];
    }

    function analogous(color, results, slices) {
        results = results || 6;
        slices = slices || 30;

        var hsl = tinycolor(color).toHsl();
        var part = 360 / slices;
        var ret = [tinycolor(color)];

        for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(tinycolor(hsl));
        }
        return ret;
    }

    function monochromatic(color, results) {
        results = results || 6;
        var hsv = tinycolor(color).toHsv();
        var h = hsv.h, s = hsv.s, v = hsv.v;
        var ret = [];
        var modification = 1 / results;

        while (results--) {
            ret.push(tinycolor({ h: h, s: s, v: v}));
            v = (v + modification) % 1;
        }

        return ret;
    }

    // Utility Functions
    // ---------------------

    tinycolor.mix = function(color1, color2, amount) {
        amount = (amount === 0) ? 0 : (amount || 50);

        var rgb1 = tinycolor(color1).toRgb();
        var rgb2 = tinycolor(color2).toRgb();

        var p = amount / 100;
        var w = p * 2 - 1;
        var a = rgb2.a - rgb1.a;

        var w1;

        if (w * a == -1) {
            w1 = w;
        } else {
            w1 = (w + a) / (1 + w * a);
        }

        w1 = (w1 + 1) / 2;

        var w2 = 1 - w1;

        var rgba = {
            r: rgb2.r * w1 + rgb1.r * w2,
            g: rgb2.g * w1 + rgb1.g * w2,
            b: rgb2.b * w1 + rgb1.b * w2,
            a: rgb2.a * p  + rgb1.a * (1 - p)
        };

        return tinycolor(rgba);
    };


    // Readability Functions
    // ---------------------
    // <http://www.w3.org/TR/AERT#color-contrast>

    // `readability`
    // Analyze the 2 colors and returns an object with the following properties:
    //    `brightness`: difference in brightness between the two colors
    //    `color`: difference in color/hue between the two colors
    tinycolor.readability = function(color1, color2) {
        var c1 = tinycolor(color1);
        var c2 = tinycolor(color2);
        var rgb1 = c1.toRgb();
        var rgb2 = c2.toRgb();
        var brightnessA = c1.getBrightness();
        var brightnessB = c2.getBrightness();
        var colorDiff = (
            Math.max(rgb1.r, rgb2.r) - Math.min(rgb1.r, rgb2.r) +
            Math.max(rgb1.g, rgb2.g) - Math.min(rgb1.g, rgb2.g) +
            Math.max(rgb1.b, rgb2.b) - Math.min(rgb1.b, rgb2.b)
        );

        return {
            brightness: Math.abs(brightnessA - brightnessB),
            color: colorDiff
        };
    };

    // `readable`
    // http://www.w3.org/TR/AERT#color-contrast
    // Ensure that foreground and background color combinations provide sufficient contrast.
    // *Example*
    //    tinycolor.isReadable("#000", "#111") => false
    tinycolor.isReadable = function(color1, color2) {
        var readability = tinycolor.readability(color1, color2);
        return readability.brightness > 125 && readability.color > 500;
    };

    // `mostReadable`
    // Given a base color and a list of possible foreground or background
    // colors for that base, returns the most readable color.
    // *Example*
    //    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
    tinycolor.mostReadable = function(baseColor, colorList) {
        var bestColor = null;
        var bestScore = 0;
        var bestIsReadable = false;
        for (var i=0; i < colorList.length; i++) {

            // We normalize both around the "acceptable" breaking point,
            // but rank brightness constrast higher than hue.

            var readability = tinycolor.readability(baseColor, colorList[i]);
            var readable = readability.brightness > 125 && readability.color > 500;
            var score = 3 * (readability.brightness / 125) + (readability.color / 500);

            if ((readable && ! bestIsReadable) ||
                (readable && bestIsReadable && score > bestScore) ||
                ((! readable) && (! bestIsReadable) && score > bestScore)) {
                bestIsReadable = readable;
                bestScore = score;
                bestColor = tinycolor(colorList[i]);
            }
        }
        return bestColor;
    };


    // Big List of Colors
    // ------------------
    // <http://www.w3.org/TR/css3-color/#svg-color>
    var names = tinycolor.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    };

    // Make it easy to access colors via `hexNames[hex]`
    var hexNames = tinycolor.hexNames = flip(names);


    // Utilities
    // ---------

    // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
    function flip(o) {
        var flipped = { };
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                flipped[o[i]] = i;
            }
        }
        return flipped;
    }

    // Return a valid alpha value [0,1] with all invalid values being set to 1
    function boundAlpha(a) {
        a = parseFloat(a);

        if (isNaN(a) || a < 0 || a > 1) {
            a = 1;
        }

        return a;
    }

    // Take input from [0, n] and return it as [0, 1]
    function bound01(n, max) {
        if (isOnePointZero(n)) { n = "100%"; }

        var processPercent = isPercentage(n);
        n = mathMin(max, mathMax(0, parseFloat(n)));

        // Automatically convert percentage into number
        if (processPercent) {
            n = parseInt(n * max, 10) / 100;
        }

        // Handle floating point rounding errors
        if ((math.abs(n - max) < 0.000001)) {
            return 1;
        }

        // Convert into [0, 1] range if it isn't already
        return (n % max) / parseFloat(max);
    }

    // Force a number between 0 and 1
    function clamp01(val) {
        return mathMin(1, mathMax(0, val));
    }

    // Parse a base-16 hex value into a base-10 integer
    function parseIntFromHex(val) {
        return parseInt(val, 16);
    }

    // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
    // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
    function isOnePointZero(n) {
        return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
    }

    // Check to see if string passed in is a percentage
    function isPercentage(n) {
        return typeof n === "string" && n.indexOf('%') != -1;
    }

    // Force a hex value to have 2 characters
    function pad2(c) {
        return c.length == 1 ? '0' + c : '' + c;
    }

    // Replace a decimal with it's percentage value
    function convertToPercentage(n) {
        if (n <= 1) {
            n = (n * 100) + "%";
        }

        return n;
    }

    // Converts a decimal to a hex value
    function convertDecimalToHex(d) {
        return Math.round(parseFloat(d) * 255).toString(16);
    }
    // Converts a hex value to a decimal
    function convertHexToDecimal(h) {
        return (parseIntFromHex(h) / 255);
    }

    var matchers = (function() {

        // <http://www.w3.org/TR/css3-values/#integers>
        var CSS_INTEGER = "[-\\+]?\\d+%?";

        // <http://www.w3.org/TR/css3-values/#number-value>
        var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

        // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
        var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

        // Actual matching.
        // Parentheses and commas are optional, but not required.
        // Whitespace can take the place of commas or opening paren
        var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

        return {
            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
            hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
            hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    })();

    // `stringInputToObject`
    // Permissive string parsing.  Take in a number of formats, and output an object
    // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
    function stringInputToObject(color) {

        color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
        var named = false;
        if (names[color]) {
            color = names[color];
            named = true;
        }
        else if (color == 'transparent') {
            return { r: 0, g: 0, b: 0, a: 0, format: "name" };
        }

        // Try to match string input using regular expressions.
        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
        // Just return an object and let the conversion functions handle that.
        // This way the result will be the same whether the tinycolor is initialized with string or object.
        var match;
        if ((match = matchers.rgb.exec(color))) {
            return { r: match[1], g: match[2], b: match[3] };
        }
        if ((match = matchers.rgba.exec(color))) {
            return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        if ((match = matchers.hsl.exec(color))) {
            return { h: match[1], s: match[2], l: match[3] };
        }
        if ((match = matchers.hsla.exec(color))) {
            return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        if ((match = matchers.hsv.exec(color))) {
            return { h: match[1], s: match[2], v: match[3] };
        }
        if ((match = matchers.hsva.exec(color))) {
            return { h: match[1], s: match[2], v: match[3], a: match[4] };
        }
        if ((match = matchers.hex8.exec(color))) {
            return {
                a: convertHexToDecimal(match[1]),
                r: parseIntFromHex(match[2]),
                g: parseIntFromHex(match[3]),
                b: parseIntFromHex(match[4]),
                format: named ? "name" : "hex8"
            };
        }
        if ((match = matchers.hex6.exec(color))) {
            return {
                r: parseIntFromHex(match[1]),
                g: parseIntFromHex(match[2]),
                b: parseIntFromHex(match[3]),
                format: named ? "name" : "hex"
            };
        }
        if ((match = matchers.hex3.exec(color))) {
            return {
                r: parseIntFromHex(match[1] + '' + match[1]),
                g: parseIntFromHex(match[2] + '' + match[2]),
                b: parseIntFromHex(match[3] + '' + match[3]),
                format: named ? "name" : "hex"
            };
        }

        return false;
    }

    window.tinycolor = tinycolor;
    })();

    $(function () {
        if ($.fn.spectrum.load) {
            $.fn.spectrum.processNativeColorInputs();
        }
    });

});



/*!
 * Customize Plus v1.1.1 (https://knitkode.com/products/customize-plus)
 * Enhance and extend the WordPress Customize in your themes.
 * Copyright (c) 2014-2018 KnitKode <dev@knitkode.com> (https://knitkode.com/)
 * @license SEE LICENSE IN license.txt (Last change on: 27-1-2018)
 */(function (window$1,document$1,$$1,_$1,wp,pluginApi,marked,hljs,Modernizr) {
  'use strict';

  var DEBUG = !!window.kkcp.DEBUG;

  /**
   * @fileOverview Lists of custom types used in Customize Plus JavaScript
   *
   */

  /**
   * Shim type for PHP `array`
   * @typedef {Array} array
   */

  /**
   * Shim type for PHP `bool`
   * @typedef {boolean} bool
   */

  /**
   * Shim type for PHP (`int|float`)
   * @typedef {number} number
   */

  /**
   * Shim type for PHP `integer`
   * @typedef {number} int
   */

  /**
   * Shim type for PHP `float`
   * @typedef {number} float
   */

  /**
   * Shim type for PHP `null`
   * @typedef {?} null
   */

  /**
   * Shim type for PHP `mixed`
   * @typedef {(number|string|Array.<mixed>|Object.<string|number, mixed>)} mixed
   */

  /**
   * A $validity notification representation
   * @typedef {Object.<string, string>} ValidityNotification
   * @property {string} code
   * @property {string} type
   * @property {string} msg
   */

  /**
   * Shim type for WordPress `WP_Error`
   * @typedef {Array.<ValidityNotification>} WP_Error
   */

  /**
   * Shim type for WordPress `WP_Customize_Setting`
   * @typedef {settings.Base} WP_Customize_Setting
   */

  /**
   * Shim type for WordPress `WP_Customize_Control`
   * @typedef {controls.Base} WP_Customize_Control
   */

  /**
   * Accessible on `window.kkcp.core`
   *
   * @since  1.0.0
   * @namespace core
   * @type {Object}
   */
  pluginApi.core = pluginApi.core || {};

  /**
   * Accessible on `window.kkcp.components`
   *
   * @since  1.0.0
   * @namespace components
   * @type {Object}
   */
  pluginApi.components = pluginApi.components || {};

  /**
   * Accessible on `window.kkcp.settings`
   *
   * @since  1.0.0
   * @namespace settings
   * @type {Object}
   */
  pluginApi.settings = pluginApi.settings || {};

  /**
   * Accessible on `window.kkcp.controls`
   *
   * @since  1.0.0
   * @namespace controls
   * @type {Object}
   */
  pluginApi.controls = pluginApi.controls || {};

  /**
   * Accessible on `window.kkcp.sections`
   *
   * @since  1.0.0
   * @namespace sections
   * @type {Object}
   */
  pluginApi.sections = pluginApi.sections || {};

  /**
   * Accessible on `window.kkcp.panels`
   *
   * @since  1.0.0
   * @namespace panels
   * @type {Object}
   */
  pluginApi.panels = pluginApi.panels || {};

  /**
   * Accessible on `window.kkcp.l10n`, populated by PHP via JSON
   *
   * @see PHP KKcp_Customize->get_l10n()
   * @since  1.0.0
   * @namespace l10n
   * @readonly
   * @type {Object}
   */
  pluginApi.l10n = pluginApi.l10n || {};

  /**
   * Accessible on `window.kkcp.constants`, populated by PHP via JSON
   *
   * @see PHP KKcp_Customize->get_constants()
   * @since  1.0.0
   * @namespace constants
   * @readonly
   * @type {Object}
   */
  pluginApi.constants = pluginApi.constants || {};

  /**
   * Customize Plus public API
   *
   * Accessible on `window.kkcp` during production and on `window.api`
   * during development.
   *
   * @since  1.0.0
   * @type {Object}
   */
  var api$1 = pluginApi;

  /**
   * WordPress Customize public API
   *
   * Accessible on `window.wp.customize` during production and on `window.wpApi`
   * during development.
   *
   * @since  1.0.0
   * @access package
   * @type {Object}
   */
  var wpApi = wp.customize;

  /**
   * Reuse the same jQuery wrapped `window` object
   *
   * @since  1.0.0
   * @access package
   * @type {jQuery}
   */
  var $window = $$1(window$1);

  /**
   * Reuse the same jQuery wrapped `document` object
   *
   * @since  1.0.0
   * @access package
   * @type {jQuery}
   */
  var $document = $$1(document$1);

  /**
   * Reuse the same `body` element
   *
   * @since  1.0.0
   * @access package
   * @type {HTMLElement}
   */
  var body = document$1.getElementsByTagName('body')[0];

  /**
   * Reuse the same jQuery wrapped WordPress API ready deferred object
   *
   * @since  1.0.0
   * @access package
   * @type {jQuery.Deferred}
   */
  var $readyWP = $$1.Deferred();

  /**
   * Reuse the same jQuery wrapped DOM ready deferred object
   *
   * @since  1.0.0
   * @access package
   * @type {jQuery.Deferred}
   */
  var $readyDOM = $$1.Deferred();

  /**
   * Reuse the same WordPress API and DOM ready deferred object. Resolved when
   * both of them are resolved.
   *
   * @since  1.0.0
   * @access package
   * @type {jQuery.Deferred}
   */
  var $ready = $$1.when($readyDOM, $readyWP);


  wpApi.bind('ready', function () { $readyWP.resolve(); });

  var _readyDOM = function (fn) {
    if (document$1.readyState !== 'loading') {
      fn();
    } else {
      document$1.addEventListener('DOMContentLoaded', fn);
    }
  };
  _readyDOM(function () { $readyDOM.resolve(); });

  // be sure to have what we need
  if (!wp) {
    throw new Error('Missing crucial object `wp`');
    $readyWP.reject();
    $readyDOM.reject();
  }

  // be sure to have what we need
  if (!pluginApi) {
    throw new Error('Missing crucial object `kkcp`');
    $readyWP.reject();
    $readyDOM.reject();
  }

  // var DEBUG = !!window.kkcp.DEBUG; is injected through rollup
  if (DEBUG) {
    $ready.done(function () { console.log('global $ready.done()'); });

    DEBUG = {
      performances: false,
      compiler: false
    };

    // just useful aliases for debugging
    window$1.api = api$1;
    window$1.wpApi = wpApi;
  }

  /**
   * Set default speed of jQuery animations
   */
  $$1.fx.speeds['_default'] = 180; // whitelisted from uglify \\

  /**
   * Markdown init (with marked.js)
   *
   */
  (function () {

    // bail if marked is not available on window
    if (!marked || !hljs) {
      return;
    }

    /**
     * Custom marked renderer
     * {@link http://git.io/vZ05H source}
     * @type {marked}
     */
    var markedRenderer = new marked.Renderer();

    /**
     * Add `target="_blank" to external links
     * @param  {string} href
     * @param  {string} title
     * @param  {string} text
     * @return {string}
     */
    markedRenderer.link = function (href, title, text) {
      var external = /^https?:\/\/.+$/.test(href);
      var newWindow = external || title === 'newWindow';
      // links are always skipped from the tab index
      var out = '<a href="' + href + '" tabindex="-1"';
      if (newWindow) {
        out += ' target="_blank"';
      }
      if (title && title !== 'newWindow') {
        out += ' title="' + title + '"';
      }
      return out += '>' + text + '</a>';
    };

    /**
     * Set marked options
     */
    marked.setOptions({
      // anchorTargetBlank: true,
      renderer: markedRenderer,
      highlight: function (code) {
        return hljs.highlightAuto(code).value;
      }
    });

    body.classList.add('kkcp-markdown-supported');

  })();

  /**
   * @fileOverview An helper class containing helper methods. This has its PHP
   * equivalent in `class-helper.php`
   *
   * @module Utils
   */
  /**
   * Customize Plus base url
   *
   * @since  1.1.0
   * @type {string}
   */
  var _CP_URL = api$1.constants['CP_URL'];

  /**
   * Customize Plus images url
   *
   * @since  1.1.0
   * @type {string}
   */
  var _CP_URL_IMAGES = _CP_URL + "images/";

  /**
   * Images base url
   *
   * @since  1.0.0
   * @type {string}
   */
  var _IMAGES_BASE_URL = api$1.constants['IMAGES_BASE_URL'];

  /**
   * Docs base url
   *
   * @since  1.0.0
   * @type {string}
   */
  var _DOCS_BASE_URL = api$1.constants['DOCS_BASE_URL'];

  /**
   * Is it an absolute URL?
   *
   * @see {@link http://stackoverflow.com/a/19709846/1938970}
   * @since  1.0.0
   *
   * @param  {string}  url The URL to test
   * @return {boolean}     Whether is absolute or relative
   */
  function _isAbsoluteUrl (url) {
    return /^(?:[a-z]+:)?\/\//i._absoluteUrl.test(url);
  }

  /**
   * Clean URL from multiple slashes
   *
   * Strips possible multiple slashes caused by the string concatenation or dev errors
   *
   * @since  1.0.0
   *
   * @param  {string} url
   * @return {string}
   */
  function _cleanUrlFromMultipleSlashes (url) {
    return url.replace(/[a-z-A-Z-0-9_]{1}(\/\/+)/g, '/');
  }

  /**
   * Get a clean URL
   *
   * If an absolute URL is passed we just strip multiple slashes,
   * if a relative URL is passed we also prepend the right base url.
   *
   * @since  1.0.0
   *
   * @param  {string} url
   * @param  {string} type
   * @return {string}
   */
  function _getCleanUrl (url, type) {
    var finalUrl = url;

    if (!_isAbsoluteUrl(url)) {
      switch (type) {
        case 'img':
          finalUrl = _IMAGES_BASE_URL + url;
          break;
        case 'docs':
          finalUrl = _DOCS_BASE_URL + url;
          break;
        default:
          break;
      }
    }
    return _cleanUrlFromMultipleSlashes(finalUrl);
  }

  /**
   * Each control execute callback with control as argument
   *
   * @since  1.0.0
   *
   * @param {function(WP_Customize_Control)} callback
   */
  function _eachControl (callback) {
    var wpApiControl = wpApi.control;

    for (var controlId in wpApi.settings.controls) {
      callback(wpApiControl(controlId));
    }
  }

  /**
   * Options API regex
   *
   * @since  1.1.0
   *
   * @param  {string}  controlId The control id
   * @return {boolean}
   */
  var _optionsApiRegex = new RegExp(api$1.constants['OPTIONS_PREFIX'] + '\\[.*\\]');

  /**
   * Is the control's setting using the `theme_mods` API?
   *
   * @since  1.0.0
   *
   * @param  {string}  controlId The control id
   * @return {boolean}
   */
  function _isThemeModsApi (controlId) {
    return !_optionsApiRegex.test(controlId);
  }

  /**
   * Is the control's setting using the `options` API?
   * Deduced by checking that the control id is structured as:
   * `themeprefix[setting-id]`
   *
   * @since  1.0.0
   *
   * @param  {string}  controlId The control id
   * @return {boolean}
   */
  function _isOptionsApi (controlId) {
    return _optionsApiRegex.test(controlId);
  }

  /**
   * Get stylesheet by Node id
   *
   * @since  1.0.0
   *
   * @param  {string} nodeId
   * @return {?HTMLElement}
   */
  function _getStylesheetById (nodeId) {
    var stylesheets = document$1.styleSheets;
    try {
      for (var i = 0, l = stylesheets.length; i < l; i++) {
        if (stylesheets[i].ownerNode.id === nodeId) {
          return stylesheets[i];
        }
      }
    } catch(e) {
      return null;
    }
  }

  /**
   * Get rules from stylesheet for the given selector
   *
   * @since  1.0.0
   *
   * @param  {HTMLElement} stylesheet
   * @param  {string} selector
   * @return {string}
   */
  function _getRulesFromStylesheet (stylesheet, selector) {
    var output = '';

    if (stylesheet) {
      var rules = stylesheet.rules || stylesheet.cssRules;
      for (var i = 0, l = rules.length; i < l; i++) {
        if (rules[i].selectorText === selector) {
          output += (rules[i].cssText) ? ' ' + rules[i].cssText : ' ' + rules[i].style.cssText;
        }
      }
    }
    return output;
  }

  /**
   * Get CSS (property/value pairs) from the given rules.
   *
   * Basically it just clean the `rules` string removing the selector and
   * the brackets.
   *
   * @since  1.0.0
   *
   * @param  {string} rules
   * @param  {string} selector
   * @return {string}
   */
  function _getCssRulesContent (rules, selector) {
    var regex = new RegExp(selector, 'g');
    var output = rules.replace(regex, '');
    output = output.replace(/({|})/g, '');
    return output.trim();
  }

  /**
   * Get image url
   *
   * @since  1.0.0
   *
   * @param  {string} url The image URL, relative or absolute
   * @return {string}     The absolute URL of the image
   */
  function getImageUrl (url) {
    return _getCleanUrl(url, 'img');
  }

  /**
   * Get docs url
   *
   * @since  1.0.0
   *
   * @param  {string} url The docs URL, relative or absolute
   * @return {string}     The absolute URL of the docs
   */
  function getDocsUrl (url) {
    return _getCleanUrl(url, 'docs');
  }

  /**
   * Bind a link element or directly link to a specific control to focus
   *
   * @since  1.0.0
   *
   * @param  {HTMLElement} linkEl The link DOM element `<a>`
   * @param  {string} controlId   The control id to link to
   */
  function linkControl (linkEl, controlId) {
    var controlToFocus = wpApi.control(controlId);

    // be sure there is the control and update dynamic color message text
    if (controlToFocus) {
      if (linkEl) {
        linkEl.onclick = function () {
          focus(controlToFocus);
        };
      } else {
        focus(controlToFocus);
      }
    }
  }

  /**
   * Wrap WordPress control focus with some custom stuff
   *
   * @since  1.0.0
   *
   * @param {WP_Customize_Control} control
   */
  function focus (control) {
    try {
      // try this so it become possible to use this function even
      // with WordPress native controls which don't have this method
      control._mount(true);

      // always disable search, it could be that we click on this
      // link from a search result try/catch because search is not
      // always enabled
      api$1.components.Search.disable();
    } catch(e) {}
    control.focus();
    control.container.addClass('kkcp-control-focused');
    setTimeout(function () {
      control.container.removeClass('kkcp-control-focused');
    }, 2000);
  }

  /**
   * Template
   *
   * Similar to WordPress one but using a JavaScript string directly instead of
   * a DOM id to pass the template content.
   *
   * @since  1.1.0
   *
   * @param  {string} tpl  A template string
   * @return {function}    A function that lazily-compiles the template requested.
   */
  var template = _$1.memoize(function (tpl) {
    var compiled;

    return function ( data ) {
      compiled = compiled || _$1.template(tpl,  templateOptions);
      return compiled( data );
    };
  });

  /**
   * Template options
   *
   * Similar to WordPress one but using `{%` instead of `<#` for logic, more like
   * Jinja or Twig.
   *
   * @since  1.1.0
   * @see  WordPress Core `wp-includes/js/wp-utils.js`.
   *
   * @return {Object}
   */
  var templateOptions = {
    // evaluate:    /{%([\s\S]+?)%}/g,
    evaluate:    /<#([\s\S]+?)#>/g,
    interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
    escape:      /\{\{([^\}]+?)\}\}(?!\})/g,
    variable:    'data'
  };

  /**
   * @alias core.Utils
   * @description  Exposed module <a href="module-Utils.html">Utils</a>
   * @access package
   *
   * @since  1.0.0
   */
  var Utils = api$1.core.Utils = {
    _CP_URL: _CP_URL,
    _CP_URL_IMAGES: _CP_URL_IMAGES,
    _IMAGES_BASE_URL: _IMAGES_BASE_URL,
    _DOCS_BASE_URL: _DOCS_BASE_URL,
    _isAbsoluteUrl: _isAbsoluteUrl,
    _cleanUrlFromMultipleSlashes: _cleanUrlFromMultipleSlashes,
    _getCleanUrl: _getCleanUrl,
    _eachControl: _eachControl,
    _isThemeModsApi: _isThemeModsApi,
    _isOptionsApi: _isOptionsApi,
    _getStylesheetById: _getStylesheetById,
    _getRulesFromStylesheet: _getRulesFromStylesheet,
    _getCssRulesContent: _getCssRulesContent,
    getImageUrl: getImageUrl,
    getDocsUrl: getDocsUrl,
    linkControl: linkControl,
    focus: focus,
    template: template,
  }

  /**
   * WordPress Tight
   *
   * We can put some logic in private functions to grab the
   * right things in case WordPress change stuff across versions
   *
   * @since 1.0.0
   * @access private
   *
   * @class WpTight
   * @requires Utils
   */
  var WpTight = function WpTight () {

    /**
     * WordPress UI elements
     *
     * @type {Object.<string, jQuery|HTMLElement>}
     */
    this.el = {};

    /**
     * WordPress query parameters used in the customize app url
     *
     * @private
     * @internal
     * @type {Array}
     */
    this._customizeQueryParamsKeys = [
      'changeset_uuid', // e.g. e6ba8e82-e628-4d6e-b7b4-39a480bc043c
      'customize_snapshot_uuid' // e.g. 52729bb7-9686-496e-90fa-7170405a5502
    ];

    /**
     * The suffix appended to the styles ids by WordPress when enqueuing them
     * through `wp_enqueue_style`
     *
     * @type {string}
     */
    this.cssSuffix = '-css';

    /**
     * The id of the WordPress core css with the color schema
     *
     * @private
     * @internal
     * @type {string}
     */
    this._colorSchemaCssId = 'colors-css';

    /**
     * The WordPress color schema useful selectors
     *
     * @private
     * @internal
     * @type {Object}
     */
    this._colorSchemaSelectors = {
      _primary: '.wp-core-ui .wp-ui-primary',
      _textPrimary: '.wp-core-ui .wp-ui-text-primary',
      _linksPrimary: '#adminmenu .wp-submenu .wp-submenu-head',
      _highlight: '.wp-core-ui .wp-ui-highlight',
      _textHighlight: '.wp-core-ui .wp-ui-text-highlight',
      _linksHighlight: '#adminmenu a',
      _notificationColor: '.wp-core-ui .wp-ui-text-notification'
    };

    /**
     * WordPress Admin colors
     *
     * @private
     * @internal
     * @type {Object}
     */
    this._colorSchema = this._getWpAdminColors();

    // bootstraps on DOM ready
    $readyDOM.then(this._$onReady.bind(this));
  };

  /**
   * On DOM ready
   *
   * @return {void}
   */
  WpTight.prototype._$onReady = function _$onReady () {
    var el = this.el;

    /** @type {JQuery} */
    el.container = $$1('.wp-full-overlay');
    /** @type {JQuery} */
    el.controls = $$1('#customize-controls');
    /** @type {JQuery} */
    el.themeControls = $$1('#customize-theme-controls');
    /** @type {JQuery} */
    el.preview = $$1('#customize-preview');
    /** @type {JQuery} */
    el.header = $$1('#customize-header-actions');
    /** @type {JQuery} */
    el.footer = $$1('#customize-footer-actions');
    /** @type {JQuery} */
    el.devices = el.footer.find('.devices');
    /** @type {JQuery} */
    el.close = el.header.find('.customize-controls-close');
    /** @type {JQuery} */
    el.sidebar = $$1('.wp-full-overlay-sidebar-content');
    /** @type {JQuery} */
    el.info = $$1('#customize-info');
    /** @type {JQuery} */
    el.customizeControls = $$1('#customize-theme-controls').find('ul').first();
  };

  /**
   * Get WordPress Admin colors
   *
   * @return {Object}
   */
  WpTight.prototype._getWpAdminColors = function _getWpAdminColors () {
    var stylesheet = Utils._getStylesheetById(this._colorSchemaCssId);
    var schema = this._colorSchemaSelectors;
    var output = {};
    for (var key in schema) {
      if (schema.hasOwnProperty(key)) {
        var selector = schema[key];
        var rules = Utils._getRulesFromStylesheet(stylesheet, selector);
        output[key] = Utils._getCssRulesContent(rules, selector);
      }
    }
    return output;
  };

  /**
   * @name wpTight
   * @description  Instance of {@link WpTight}
   *
   * @instance
   * @memberof core
   */
  api$1.core.wpTight = new WpTight();

  /**
   * Skeleton
   *
   * Element wrappers for Customize Plus Skeleton DOM.
   *
   * @since 1.0.0
   * @access private
   *
   * @class Skeleton
   * @requires Modernizr
   */
  var Skeleton = function Skeleton () {
    var this$1 = this;

    $readyDOM.then(function () {

      // set elements as properties
      this$1._loader = document$1.getElementById('kkcp-loader-preview');
      this$1.$loader = $$1(this$1._loader);
      this$1.img = document$1.getElementById('kkcp-loader-img');
      this$1.title = document$1.getElementById('kkcp-loader-title');
      this$1.text = document$1.getElementById('kkcp-loader-text');
      this$1._loaderSidebar = document$1.getElementById('kkcp-loader-sidebar');
      this$1.$loaderSidebar = $$1(this$1._loaderSidebar);

      // the first time the iframe preview has loaded hide the skeleton loader
      wpApi.previewer.targetWindow.bind(this$1._hideLoaderPreview.bind(this$1));
    });
  };

  /**
   * Trigger loading UI state (changes based on added css class)
   *
   */
  Skeleton.prototype.loading = function loading () {
    body.classList.add('kkcp-loading');
  };

  /**
   * Remove loading UI state
   *
   */
  Skeleton.prototype.loaded = function loaded () {
    body.classList.remove('kkcp-loading');
  };

  /**
   * Show 'full page' loader
   *
   */
  Skeleton.prototype.show = function show (what) {
      var this$1 = this;

    $readyDOM.done(function () {
      if (!what || what === 'preview') {
        this$1._loader.style.display = 'block';
      }
      if (!what || what === 'sidebar') {
        this$1._loaderSidebar.style.display = 'block';
      }
    });
  };

  /**
   * Hide loaders overlays, use jQuery animation if the browser supports
   * WebWorkers (this is related to the Premium Compiler component)
   *
   * @requires Modernizr
   * @param {string} what What to hide: 'preview' or 'sidebar' (pass nothing
   *                    to hide both)
   */
  Skeleton.prototype.hide = function hide (what) {
      var this$1 = this;

    $readyDOM.done(function () {
      var shouldFade = Modernizr.webworkers;
      if (!what || what === 'preview') {
        if (shouldFade) {
          this$1.$loader.fadeOut();
        } else {
          this$1._loader.style.display = 'none';
        }
      }
      if (!what || what === 'sidebar') {
        if (shouldFade) {
          this$1.$loaderSidebar.fadeOut();
        } else {
          this$1._loaderSidebar.style.display = 'none';
        }
      }
    });
  };

  /**
   * Hide loader and unbind itself
   * (we could also take advantage of the underscore `once` utility)
   *
   * @access package
   */
  Skeleton.prototype._hideLoaderPreview = function _hideLoaderPreview () {
    this.hide('preview');
    wpApi.previewer.targetWindow.unbind(this._hideLoaderPreview);
  };

  /**
   * @name skeleton
   * @description  Instance of {@link Skeleton}
   *
   * @instance
   * @memberof core
   */
  api$1.core.skeleton = new Skeleton();

  /**
   * Tabs
   *
   * Manage tabbed content inside controls
   *
   * @since 1.0.0
   * @access private
   *
   * @class Tabs
   * @requires components.Screenpreview
   */
  var Tabs = function Tabs () {
    /**
     * Class name for a selected tab
     * @type {string}
     */
    this._CLASS_TAB_SELECTED = 'selected';

    /**
     * Tab selector (for jQuery)
     * @type {string}
     */
    this._SELECTOR_TAB = '.kkcp-tab';

    /**
     * Tab content selector (for jQuery)
     * @type {string}
     */
    this._SELECTOR_TAB_CONTENT = '.kkcp-tab-content';

    // bootstraps on DOM ready
    $readyDOM.then(this._$onReady.bind(this));
  };

  /**
   * On DOM ready
   *
   * Uses event delegation so we are able to bind our 'temporary'
   * DOM removed and reappended by the controls
   */
  Tabs.prototype._$onReady = function _$onReady () {
    var self = this;

    $document.on('click', self._SELECTOR_TAB, function() {
      var area = this.parentNode.parentNode; // kkcptoimprove \\
      var tabs = area.getElementsByClassName('kkcp-tab');
      var panels = area.getElementsByClassName('kkcp-tab-content');
      var isScreenPicker = area.classList.contains('kkcp-screen-picker');
      var tabAttrName = isScreenPicker ? 'data-screen' : 'data-tab';
      var target = this.getAttribute(tabAttrName);

      // remove 'selected' class from all the other tab links
      for (var i = tabs.length - 1; i >= 0; i--) {
        tabs[i].classList.remove(self._CLASS_TAB_SELECTED);
      }
      // add the 'selected' class to the clicked tab link
      this.className += ' ' + self._CLASS_TAB_SELECTED;

      // loop through panels and show the current one
      for (var j = panels.length - 1; j >= 0; j--) {
        var panel = panels[j];
        var $panelInputs = $$1('input, .ui-slider-handle', panel);
        if (panel.getAttribute(tabAttrName) === target) {
          panel.classList.add(self._CLASS_TAB_SELECTED);
          // reset manual tabIndex to normal browser behavior
          $panelInputs.attr('tabIndex', '0');
        } else {
          panel.classList.remove(self._CLASS_TAB_SELECTED);
          // exclude hidden `<input>` fields from keyboard navigation
          $panelInputs.attr('tabIndex', '-1');
        }
      }

      // if this tabbed area is related to the screenpreview then notify it
      if (isScreenPicker) {
        // we might not have the Screenpreview component enabled
        try {
          api$1.components.Screenpreview.setDevice(target);
        } catch(e) {
          console.warn('Tabs tried to use Screenpreview, which is undefined.', e);
        }
      }
    });
  };

  /**
   * Update Screen Picker Tabs
   * @param{int|string} size The size to which update the tabs
   * @param{JQuery} $container An element to use as context to look for
   *                           screen pickers UI DOM
   */
  Tabs.prototype._updateScreenPickerTabs = function _updateScreenPickerTabs (size, $container) {
    var self = this;
    var $screenPickers = $$1('.kkcp-screen-picker', $container);

    $screenPickers.each(function () {
      var $area = $$1(this);
      var $tabs = $area.find(self._SELECTOR_TAB);
      var $panels = $area.find(self._SELECTOR_TAB_CONTENT);
      var filter = function () {
        return this.getAttribute('data-screen') === size;
      };
      var $tabActive = $tabs.filter(filter);
      var $panelActive = $panels.filter(filter);
      $tabs.removeClass(self._CLASS_TAB_SELECTED);
      $panels.removeClass(self._CLASS_TAB_SELECTED);
      $tabActive.addClass(self._CLASS_TAB_SELECTED);
      $panelActive.addClass(self._CLASS_TAB_SELECTED);
    });
  };

  /**
   * Update statuses of all tabs on page up to given screen size.
   *
   * @param{string} size Screenpreview size (`xs`, `sm`, `md`, `lg`)
   */
  Tabs.prototype.changeSize = function changeSize (size) {
    this._updateScreenPickerTabs(size, document$1);
  };

  /**
   * Sync the tabs within the given container
   * with current Screenpreview size
   *
   * @param {JQuery} $container A container with tabbed areas (probably a
   *                          control container)
   */
  Tabs.prototype.syncSize = function syncSize ($container) {
    // we might not have the Screenpreview component enabled
    try {
      this._updateScreenPickerTabs(api$1.components.Screenpreview.getSize(), $container);
    } catch(e) {
      console.warn('Tabs tried to use Screenpreview, which is undefined.', e);
    }
  };

  /**
   * @name tabs
   * @description  Instance of {@link Tabs}
   *
   * @instance
   * @memberof core
   */
  api$1.core.tabs = new Tabs();

  /**
   * Tooltips
   *
   * Manage tooltips using jQuery UI Tooltip
   *
   * @since 1.0.0
   * @access private
   *
   * @class Tooltips
   * @requires jQueryUI.Tooltip
   */
  var Tooltips = function Tooltips () {

    /**
     * @type {string}
     */
    this._BASE_CLASS = '.kkcpui-tooltip';

    /**
     * @type {Array<Object<string, string>>}
     */
    this._ALLOWED_POSITIONS = [{
      _name: 'top',
      _container: $document,
      _position: {
        my: 'center bottom-2',
        at: 'center top-5'
      }
    }, {
      _name: 'bottom',
      _container: $$1(body),
      _position: {
        my: 'center top+2',
        at: 'center bottom+5'
      }
    }];

    /**
     * @type {Object<string,boolean|string>}
     */
    this._DEFAULT_OPTIONS = {
      show: false,
      hide: false
    };

    // bootstraps on DOM ready
    $readyDOM.then(this._$onReady.bind(this));
  };

  /**
   * On DOM ready
   *
   * Init tooltips for each allowed position
   */
  Tooltips.prototype._$onReady = function _$onReady () {
      var this$1 = this;

    for (var i = this._ALLOWED_POSITIONS.length - 1; i >= 0; i--) {
      var custom = this$1._ALLOWED_POSITIONS[i];
      var options = _$1.defaults({
        items: ((this$1._BASE_CLASS) + "--" + (custom._name)),
        classes: {
          'ui-tooltip': custom._name,
        },
       
        tooltipClass: custom._name,
        position: custom._position
      }, this$1._DEFAULT_OPTIONS);

      // this should stay the same
      options.position.collision = 'flipfit';

      // init tooltip (it uses event delegation)
      // to have different tooltips positioning we need a different container
      // for each initialisation otherwise each overlap each other.
      custom._container.tooltip(options);
    }
  };

  /**
   * @name tooltips
   * @description  Instance of {@link Tooltips}
   *
   * @instance
   * @memberof core
   */
  api$1.core.tooltips = new Tooltips();

  var sprintf = function sprintf() {
    //  discuss at: http://locutus.io/php/sprintf/
    // original by: Ash Searle (http://hexmen.com/blog/)
    // improved by: Michael White (http://getsprink.com)
    // improved by: Jack
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Dj
    // improved by: Allidylls
    //    input by: Paulo Freitas
    //    input by: Brett Zamir (http://brett-zamir.me)
    //   example 1: sprintf("%01.2f", 123.1)
    //   returns 1: '123.10'
    //   example 2: sprintf("[%10s]", 'monkey')
    //   returns 2: '[    monkey]'
    //   example 3: sprintf("[%'#10s]", 'monkey')
    //   returns 3: '[####monkey]'
    //   example 4: sprintf("%d", 123456789012345)
    //   returns 4: '123456789012345'
    //   example 5: sprintf('%-03s', 'E')
    //   returns 5: 'E00'

    var regex = /%%|%(\d+\$)?([-+'#0 ]*)(\*\d+\$|\*|\d+)?(?:\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
    var a = arguments;
    var i = 0;
    var format = a[i++];

    var _pad = function _pad(str, len, chr, leftJustify) {
      if (!chr) {
        chr = ' ';
      }
      var padding = str.length >= len ? '' : new Array(1 + len - str.length >>> 0).join(chr);
      return leftJustify ? str + padding : padding + str;
    };

    var justify = function justify(value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
      var diff = minWidth - value.length;
      if (diff > 0) {
        if (leftJustify || !zeroPad) {
          value = _pad(value, minWidth, customPadChar, leftJustify);
        } else {
          value = [value.slice(0, prefix.length), _pad('', diff, '0', true), value.slice(prefix.length)].join('');
        }
      }
      return value;
    };

    var _formatBaseX = function _formatBaseX(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
      // Note: casts negative numbers to positive ones
      var number = value >>> 0;
      prefix = prefix && number && {
        '2': '0b',
        '8': '0',
        '16': '0x'
      }[base] || '';
      value = prefix + _pad(number.toString(base), precision || 0, '0', false);
      return justify(value, prefix, leftJustify, minWidth, zeroPad);
    };

    // _formatString()
    var _formatString = function _formatString(value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
      if (precision !== null && precision !== undefined) {
        value = value.slice(0, precision);
      }
      return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
    };

    // doFormat()
    var doFormat = function doFormat(substring, valueIndex, flags, minWidth, precision, type) {
      var number, prefix, method, textTransform, value;

      if (substring === '%%') {
        return '%';
      }

      // parse flags
      var leftJustify = false;
      var positivePrefix = '';
      var zeroPad = false;
      var prefixBaseX = false;
      var customPadChar = ' ';
      var flagsl = flags.length;
      var j;
      for (j = 0; j < flagsl; j++) {
        switch (flags.charAt(j)) {
          case ' ':
            positivePrefix = ' ';
            break;
          case '+':
            positivePrefix = '+';
            break;
          case '-':
            leftJustify = true;
            break;
          case "'":
            customPadChar = flags.charAt(j + 1);
            break;
          case '0':
            zeroPad = true;
            customPadChar = '0';
            break;
          case '#':
            prefixBaseX = true;
            break;
        }
      }

      // parameters may be null, undefined, empty-string or real valued
      // we want to ignore null, undefined and empty-string values
      if (!minWidth) {
        minWidth = 0;
      } else if (minWidth === '*') {
        minWidth = +a[i++];
      } else if (minWidth.charAt(0) === '*') {
        minWidth = +a[minWidth.slice(1, -1)];
      } else {
        minWidth = +minWidth;
      }

      // Note: undocumented perl feature:
      if (minWidth < 0) {
        minWidth = -minWidth;
        leftJustify = true;
      }

      if (!isFinite(minWidth)) {
        throw new Error('sprintf: (minimum-)width must be finite');
      }

      if (!precision) {
        precision = 'fFeE'.indexOf(type) > -1 ? 6 : type === 'd' ? 0 : undefined;
      } else if (precision === '*') {
        precision = +a[i++];
      } else if (precision.charAt(0) === '*') {
        precision = +a[precision.slice(1, -1)];
      } else {
        precision = +precision;
      }

      // grab value using valueIndex if required?
      value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

      switch (type) {
        case 's':
          return _formatString(value + '', leftJustify, minWidth, precision, zeroPad, customPadChar);
        case 'c':
          return _formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
        case 'b':
          return _formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'o':
          return _formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'x':
          return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'X':
          return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
        case 'u':
          return _formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'i':
        case 'd':
          number = +value || 0;
          // Plain Math.round doesn't just truncate
          number = Math.round(number - number % 1);
          prefix = number < 0 ? '-' : positivePrefix;
          value = prefix + _pad(String(Math.abs(number)), precision, '0', false);
          return justify(value, prefix, leftJustify, minWidth, zeroPad);
        case 'e':
        case 'E':
        case 'f': // @todo: Should handle locales (as per setlocale)
        case 'F':
        case 'g':
        case 'G':
          number = +value;
          prefix = number < 0 ? '-' : positivePrefix;
          method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
          textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
          value = prefix + Math.abs(number)[method](precision);
          return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
        default:
          return substring;
      }
    };

    return format.replace(regex, doFormat);
  };

  var vsprintf = function vsprintf(format, args) {
    //  discuss at: http://locutus.io/php/vsprintf/
    // original by: ejsanders
    //   example 1: vsprintf('%04d-%02d-%02d', [1988, 8, 1])
    //   returns 1: '1988-08-01'

    var sprintf$$1 = sprintf;

    return sprintf$$1.apply(this, [format].concat(args));
  };

  var is_int = function is_int(mixedVar) {
    // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/is_int/
    // original by: Alex
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: WebDevHobo (http://webdevhobo.blogspot.com/)
    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
    //  revised by: Matt Bradley
    // bugfixed by: Kevin van Zonneveld (http://kvz.io)
    //      note 1: 1.0 is simplified to 1 before it can be accessed by the function, this makes
    //      note 1: it different from the PHP implementation. We can't fix this unfortunately.
    //   example 1: is_int(23)
    //   returns 1: true
    //   example 2: is_int('23')
    //   returns 2: false
    //   example 3: is_int(23.5)
    //   returns 3: false
    //   example 4: is_int(true)
    //   returns 4: false

    return mixedVar === +mixedVar && isFinite(mixedVar) && !(mixedVar % 1);
  };

  var is_float = function is_float(mixedVar) {
    // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/is_float/
    // original by: Paulo Freitas
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // improved by: WebDevHobo (http://webdevhobo.blogspot.com/)
    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
    //      note 1: 1.0 is simplified to 1 before it can be accessed by the function, this makes
    //      note 1: it different from the PHP implementation. We can't fix this unfortunately.
    //   example 1: is_float(186.31)
    //   returns 1: true

    return +mixedVar === mixedVar && (!isFinite(mixedVar) || !!(mixedVar % 1));
  };

  var is_numeric = function is_numeric(mixedVar) {
    // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/is_numeric/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: David
    // improved by: taith
    // bugfixed by: Tim de Koning
    // bugfixed by: WebDevHobo (http://webdevhobo.blogspot.com/)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Denis Chenu (http://shnoulle.net)
    //   example 1: is_numeric(186.31)
    //   returns 1: true
    //   example 2: is_numeric('Kevin van Zonneveld')
    //   returns 2: false
    //   example 3: is_numeric(' +186.31e2')
    //   returns 3: true
    //   example 4: is_numeric('')
    //   returns 4: false
    //   example 5: is_numeric([])
    //   returns 5: false
    //   example 6: is_numeric('1 ')
    //   returns 6: false

    var whitespace = [' ', '\n', '\r', '\t', '\f', '\x0b', '\xa0', '\u2000', '\u2001', '\u2002', '\u2003', '\u2004', '\u2005', '\u2006', '\u2007', '\u2008', '\u2009', '\u200A', '\u200B', '\u2028', '\u2029', '\u3000'].join('');

    // @todo: Break this up using many single conditions with early returns
    return (typeof mixedVar === 'number' || typeof mixedVar === 'string' && whitespace.indexOf(mixedVar.slice(-1)) === -1) && mixedVar !== '' && !isNaN(mixedVar);
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  var empty = function empty(mixedVar) {
    //  discuss at: http://locutus.io/php/empty/
    // original by: Philippe Baumann
    //    input by: Onno Marsman (https://twitter.com/onnomarsman)
    //    input by: LH
    //    input by: Stoyan Kyosev (http://www.svest.org/)
    // bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Francesco
    // improved by: Marc Jansen
    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
    //   example 1: empty(null)
    //   returns 1: true
    //   example 2: empty(undefined)
    //   returns 2: true
    //   example 3: empty([])
    //   returns 3: true
    //   example 4: empty({})
    //   returns 4: true
    //   example 5: empty({'aFunc' : function () { alert('humpty'); } })
    //   returns 5: false

    var undef;
    var key;
    var i;
    var len;
    var emptyValues = [undef, null, false, 0, '', '0'];

    for (i = 0, len = emptyValues.length; i < len; i++) {
      if (mixedVar === emptyValues[i]) {
        return true;
      }
    }

    if ((typeof mixedVar === 'undefined' ? 'undefined' : _typeof(mixedVar)) === 'object') {
      for (key in mixedVar) {
        if (mixedVar.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    }

    return false;
  };

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var assertString_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = assertString;
  function assertString(input) {
    var isString = typeof input === 'string' || input instanceof String;

    if (!isString) {
      throw new TypeError('This library (validator.js) validates strings only');
    }
  }
  module.exports = exports['default'];
  });

  unwrapExports(assertString_1);

  var merge_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = merge;
  function merge() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaults = arguments[1];

    for (var key in defaults) {
      if (typeof obj[key] === 'undefined') {
        obj[key] = defaults[key];
      }
    }
    return obj;
  }
  module.exports = exports['default'];
  });

  unwrapExports(merge_1);

  var isFQDN_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isFQDN;



  var _assertString2 = _interopRequireDefault(assertString_1);



  var _merge2 = _interopRequireDefault(merge_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var default_fqdn_options = {
    require_tld: true,
    allow_underscores: false,
    allow_trailing_dot: false
  };

  function isFQDN(str, options) {
    (0, _assertString2.default)(str);
    options = (0, _merge2.default)(options, default_fqdn_options);

    /* Remove the optional trailing dot before checking validity */
    if (options.allow_trailing_dot && str[str.length - 1] === '.') {
      str = str.substring(0, str.length - 1);
    }
    var parts = str.split('.');
    if (options.require_tld) {
      var tld = parts.pop();
      if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
        return false;
      }
      // disallow spaces
      if (/[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20]/.test(tld)) {
        return false;
      }
    }
    for (var part, i = 0; i < parts.length; i++) {
      part = parts[i];
      if (options.allow_underscores) {
        part = part.replace(/_/g, '');
      }
      if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
        return false;
      }
      // disallow full-width chars
      if (/[\uff01-\uff5e]/.test(part)) {
        return false;
      }
      if (part[0] === '-' || part[part.length - 1] === '-') {
        return false;
      }
    }
    return true;
  }
  module.exports = exports['default'];
  });

  unwrapExports(isFQDN_1);

  var isIP_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isIP;



  var _assertString2 = _interopRequireDefault(assertString_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  var ipv6Block = /^[0-9A-F]{1,4}$/i;

  function isIP(str) {
    var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    (0, _assertString2.default)(str);
    version = String(version);
    if (!version) {
      return isIP(str, 4) || isIP(str, 6);
    } else if (version === '4') {
      if (!ipv4Maybe.test(str)) {
        return false;
      }
      var parts = str.split('.').sort(function (a, b) {
        return a - b;
      });
      return parts[3] <= 255;
    } else if (version === '6') {
      var blocks = str.split(':');
      var foundOmissionBlock = false; // marker to indicate ::

      // At least some OS accept the last 32 bits of an IPv6 address
      // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
      // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
      // and '::a.b.c.d' is deprecated, but also valid.
      var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
      var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

      if (blocks.length > expectedNumberOfBlocks) {
        return false;
      }
      // initial or final ::
      if (str === '::') {
        return true;
      } else if (str.substr(0, 2) === '::') {
        blocks.shift();
        blocks.shift();
        foundOmissionBlock = true;
      } else if (str.substr(str.length - 2) === '::') {
        blocks.pop();
        blocks.pop();
        foundOmissionBlock = true;
      }

      for (var i = 0; i < blocks.length; ++i) {
        // test for a :: which can not be at the string start/end
        // since those cases have been handled above
        if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
          if (foundOmissionBlock) {
            return false; // multiple :: in address
          }
          foundOmissionBlock = true;
        } else if (foundIPv4TransitionBlock && i === blocks.length - 1) {
          // it has been checked before that the last
          // block is a valid IPv4 address
        } else if (!ipv6Block.test(blocks[i])) {
          return false;
        }
      }
      if (foundOmissionBlock) {
        return blocks.length >= 1;
      }
      return blocks.length === expectedNumberOfBlocks;
    }
    return false;
  }
  module.exports = exports['default'];
  });

  unwrapExports(isIP_1);

  var isURL_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isURL;



  var _assertString2 = _interopRequireDefault(assertString_1);



  var _isFQDN2 = _interopRequireDefault(isFQDN_1);



  var _isIP2 = _interopRequireDefault(isIP_1);



  var _merge2 = _interopRequireDefault(merge_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var default_url_options = {
    protocols: ['http', 'https', 'ftp'],
    require_tld: true,
    require_protocol: false,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false
  };

  var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;

  function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
  }

  function checkHost(host, matches) {
    for (var i = 0; i < matches.length; i++) {
      var match = matches[i];
      if (host === match || isRegExp(match) && match.test(host)) {
        return true;
      }
    }
    return false;
  }

  function isURL(url, options) {
    (0, _assertString2.default)(url);
    if (!url || url.length >= 2083 || /[\s<>]/.test(url)) {
      return false;
    }
    if (url.indexOf('mailto:') === 0) {
      return false;
    }
    options = (0, _merge2.default)(options, default_url_options);
    var protocol = void 0,
        auth = void 0,
        host = void 0,
        hostname = void 0,
        port = void 0,
        port_str = void 0,
        split = void 0,
        ipv6 = void 0;

    split = url.split('#');
    url = split.shift();

    split = url.split('?');
    url = split.shift();

    split = url.split('://');
    if (split.length > 1) {
      protocol = split.shift();
      if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
        return false;
      }
    } else if (options.require_protocol) {
      return false;
    } else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
      split[0] = url.substr(2);
    }
    url = split.join('://');

    if (url === '') {
      return false;
    }

    split = url.split('/');
    url = split.shift();

    if (url === '' && !options.require_host) {
      return true;
    }

    split = url.split('@');
    if (split.length > 1) {
      auth = split.shift();
      if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
        return false;
      }
    }
    hostname = split.join('@');

    port_str = null;
    ipv6 = null;
    var ipv6_match = hostname.match(wrapped_ipv6);
    if (ipv6_match) {
      host = '';
      ipv6 = ipv6_match[1];
      port_str = ipv6_match[2] || null;
    } else {
      split = hostname.split(':');
      host = split.shift();
      if (split.length) {
        port_str = split.join(':');
      }
    }

    if (port_str !== null) {
      port = parseInt(port_str, 10);
      if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
        return false;
      }
    }

    if (!(0, _isIP2.default)(host) && !(0, _isFQDN2.default)(host, options) && (!ipv6 || !(0, _isIP2.default)(ipv6, 6))) {
      return false;
    }

    host = host || ipv6;

    if (options.host_whitelist && !checkHost(host, options.host_whitelist)) {
      return false;
    }
    if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
      return false;
    }

    return true;
  }
  module.exports = exports['default'];
  });

  var isURL = unwrapExports(isURL_1);

  var isByteLength_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  exports.default = isByteLength;



  var _assertString2 = _interopRequireDefault(assertString_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /* eslint-disable prefer-rest-params */
  function isByteLength(str, options) {
    (0, _assertString2.default)(str);
    var min = void 0;
    var max = void 0;
    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
      min = options.min || 0;
      max = options.max;
    } else {
      // backwards compatibility: isByteLength(str, min [, max])
      min = arguments[1];
      max = arguments[2];
    }
    var len = encodeURI(str).split(/%..|./).length - 1;
    return len >= min && (typeof max === 'undefined' || len <= max);
  }
  module.exports = exports['default'];
  });

  unwrapExports(isByteLength_1);

  var isEmail_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isEmail;



  var _assertString2 = _interopRequireDefault(assertString_1);



  var _merge2 = _interopRequireDefault(merge_1);



  var _isByteLength2 = _interopRequireDefault(isByteLength_1);



  var _isFQDN2 = _interopRequireDefault(isFQDN_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var default_email_options = {
    allow_display_name: false,
    require_display_name: false,
    allow_utf8_local_part: true,
    require_tld: true
  };

  /* eslint-disable max-len */
  /* eslint-disable no-control-regex */
  var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\,\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
  var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
  var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
  var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
  var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
  /* eslint-enable max-len */
  /* eslint-enable no-control-regex */

  function isEmail(str, options) {
    (0, _assertString2.default)(str);
    options = (0, _merge2.default)(options, default_email_options);

    if (options.require_display_name || options.allow_display_name) {
      var display_email = str.match(displayName);
      if (display_email) {
        str = display_email[1];
      } else if (options.require_display_name) {
        return false;
      }
    }

    var parts = str.split('@');
    var domain = parts.pop();
    var user = parts.join('@');

    var lower_domain = domain.toLowerCase();
    if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
      user = user.replace(/\./g, '').toLowerCase();
    }

    if (!(0, _isByteLength2.default)(user, { max: 64 }) || !(0, _isByteLength2.default)(domain, { max: 254 })) {
      return false;
    }

    if (!(0, _isFQDN2.default)(domain, { require_tld: options.require_tld })) {
      return false;
    }

    if (user[0] === '"') {
      user = user.slice(1, user.length - 1);
      return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
    }

    var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;

    var user_parts = user.split('.');
    for (var i = 0; i < user_parts.length; i++) {
      if (!pattern.test(user_parts[i])) {
        return false;
      }
    }

    return true;
  }
  module.exports = exports['default'];
  });

  var isEmail = unwrapExports(isEmail_1);

  /**
   * @fileOverview An helper class containing helper methods. This has its PHP
   * equivalent in `class-helper.php`
   *
   * @module Helper
   * @requires tinycolor
   */
  /* global tinycolor */

  /**
   * Is setting value (`control.setting()`) empty?
   *
   * Used to check if required control's settings have instead an empty value
   *
   * @see php class method `KKcp_Validate::is_empty()`
   * @param  {string}  value
   * @return {bool}
   */
  function isEmpty (value) {
    // first try to compare it to empty primitives
    if (value === null || value === undefined || value === '') {
      return true;
    } else {
      // if it's a jsonized value try to parse it
      try {
        value = JSON.parse(value);
      } catch(e) {}

      // and then see if we have an empty array or an empty object
      if ((_.isArray(value) || _.isObject(value)) && _.isEmpty(value)) {
        return true;
      }

      return false;
    }
  }

  /**
   * Is keyword color?
   *
   * It needs a value cleaned of all whitespaces (sanitized)
   *
   * @since  1.0.0
   *
   * @param  {string} $value  The value value to check
   * @return bool
   */
  function isKeywordColor( $value ) {
    var keywords = api.constants['colorsKeywords'] || [];
    return keywords.indexOf( $value ) !== -1;
  }

  /**
   * Is HEX color?
   *
   * It needs a value cleaned of all whitespaces (sanitized)
   *
   * @since  1.0.0
   *
   * @param  {string} $value  The value value to check
   * @return {bool}
   */
  function isHex( $value ) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test( $value )
  }

  /**
   * Is RGB color?
   *
   * It needs a value cleaned of all whitespaces (sanitized)
   * Inspired by formvalidation.js by Nguyen Huu Phuoc, aka @nghuuphuoc
   * and contributors {@link https://github.com/formvalidation/}.
   *
   * @since  1.0.0
   *
   * @param  {string} $value  The value value to check
   * @return {bool}
   */
  function isRgb( $value ) {
    var regexInteger = /^rgb\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){2}(\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*)\)$/;
    var regexPercent = /^rgb\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/;
    return regexInteger.test( $value ) || regexPercent.test( $value );
  }

  /**
   * Is RGBA color?
   *
   * It needs a value cleaned of all whitespaces (sanitized)
   * Inspired by formvalidation.js by Nguyen Huu Phuoc, aka @nghuuphuoc
   * and contributors {@link https://github.com/formvalidation/}.
   *
   * @since  1.0.0
   *
   * @param  {string} $value  The value value to check
   * @return {bool}
   */
  function isRgba( $value ) {
    var regexInteger = /^rgba\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
    var regexPercent = /^rgba\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
    return regexInteger.test( $value ) || regexPercent.test( $value );
  }

  // hsl: return /^hsl\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/.test(value);
  // hsla: return /^hsla\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/.test(value);

  /**
   * Is a valid color among the color formats given?
   *
   * It needs a value cleaned of all whitespaces (sanitized)
   *
   * @since  1.0.0
   *
   * @param  {string} $value           The value value to check
   * @param  {Array} $allowed_formats  The allowed color formats
   * @return {bool}
   */
  function isColor ( $value, $allowedFormats ) {
    for (var i = 0; i < $allowedFormats.length; i++) {
      var $format = $allowedFormats[i];

      if ( $format === 'keyword' && isKeywordColor( $value ) ) {
        return true;
      }
      else if ( $format === 'hex' && isHex( $value ) ) {
        return true;
      }
      else if ( $format === 'rgb' && isRgb( $value ) ) {
        return true;
      }
      else if ( $format === 'rgba' && isRgba( $value ) ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Convert a hexa decimal color code to its RGB equivalent
   *
   * @link(http://php.net/manual/en/function.hexdec.php#99478, original source)
   * @since  1.0.0
   * @param  {string} $value          Hexadecimal color value
   * @param  {bool}   $returnAsString If set true, returns the value separated by
   *                                  the separator character. Otherwise returns an
   *                                  associative array.
   * @return {array|string} Depending on second parameter. Returns `false` if
   *                        invalid hex color value
   */
  function hexToRgb( $value, $returnAsString ) {
    if ( $returnAsString === void 0 ) $returnAsString = true;

    return $returnAsString ? tinycolor.toRgbString( $value ) : tinycolor.toRgb( $value );
  }

  /**
   * Converts a RGBA color to a RGB, stripping the alpha channel value
   *
   * It needs a value cleaned of all whitespaces (sanitized).
   *
   * @method
   * @since  1.0.0
   * @param  {string} $input
   * @return ?string
   */
  var rgbaToRgb = hexToRgb;

  /**
   * Normalize font family.
   *
   * Be sure that a font family is wrapped in quote, good for consistency
   *
   * @since  1.0.0
   *
   * @param  {string} $value
   * @return {string}
   */
  function normalizeFontFamily( $value ) {
    $value = $value.replace(/'/g, '').replace(/"/g, '');
    return ("'" + ($value.trim()) + "'");
  }

  /**
   * Normalize font families
   *
   * Be sure that one or multiple font families are all trimmed and wrapped in
   * quotes, good for consistency
   *
   * @since  1.0.0
   *
   * @param {string|array} $value
   * @return {string|null}
   */
  function normalizeFontFamilies( $value ) {
    var $sanitized = [];

    if ( _.isString( $value ) ) {
      $value = $value.split(',');
    }
    if ( _.isArray( $value ) ) {
      for (var i = 0; i < $value.length; i++) {
        $sanitized.push( normalizeFontFamily( $value[i] ));
      }
      return $sanitized.join(',');
    }

    return null;
  }

  /**
   * Extract number (either integers or float)
   *
   * @see http://stackoverflow.com/a/17885985/1938970
   *
   * @since  1.0.0
   * @param  {string}         $value         The value from to extract from
   * @return {number|null} The extracted number or null if the value does not
   *                       contain any digit.
   */
  function extractNumber( $value ) {
    var matches = /(\+|-)?((\d+(\.\d+)?)|(\.\d+))/.exec( $value );

    if (matches && is_numeric( matches[0] ) ) {
      return Number( matches[0] );
    }

    return null;
  }

  /**
   * Extract size unit
   *
   * It returns the first matched, so the units are kind of sorted by popularity.
   * @see http://www.w3schools.com/cssref/css_units.asp List of the css units
   *
   * @since  1.0.0
   * @param  {string}     $value          The value from to extract from
   * @param  {null|array} $allowed_units  An array of allowed units
   * @return {string|null}                The first valid unit found.
   */
  function extractSizeUnit( $value, $allowed_units ) {
    var matches = /(px|%|em|rem|vh|vw|vmin|vmax|cm|mm|in|pt|pc|ch|ex)/.exec( $value );

    if (matches && matches[0] ) {
      return matches[0];
    }
    return null;
  }

  /**
   * Modulus
   *
   * @source https://stackoverflow.com/a/31711034
   * @param  {number} val
   * @param  {number} step
   * @return {number}
   */
  function modulus(val, step){
    var valDecCount = (val.toString().split('.')[1] || '').length;
    var stepDecCount = (step.toString().split('.')[1] || '').length;
    var decCount = valDecCount > stepDecCount? valDecCount : stepDecCount;
    var valInt = parseInt(val.toFixed(decCount).replace('.',''));
    var stepInt = parseInt(step.toFixed(decCount).replace('.',''));
    return (valInt % stepInt) / Math.pow(10, decCount);
  }

  /**
   * Is Multiple of
   *
   * Take a look at the {@link http://stackoverflow.com/q/12429362/1938970
   * stackoverflow question} about this topic. This solution is an ok
   * compromise. We use `Math.abs` to convert negative number to positive
   * otherwise the minor comparison would always return true for negative
   * numbers.
   *
   * This could be a valid alternative to the above `modulus` function.
   * Note that unlike `modulus` the return value here is a boolean.
   *
   * @ignore
   * @param  {string}  val
   * @param  {string}  step
   * @return {bool}
   */


  /**
   * To Boolean
   * '0' or '1' to boolean
   *
   * @static
   * @param  {string|number} value
   * @return {bool}
   */
  function numberToBoolean (value) {
    return typeof value === 'boolean' ? value : !!parseInt(value, 10);
  }

  /**
   * Strip HTML from value
   * {@link http://stackoverflow.com/q/5002111/1938970}
   *
   * @static
   * @param  {string} value
   * @return {string}
   */
  function stripHTML (value) {
    return $(document.createElement('div')).html(value).text();
  }

  /**
   * Does string value contains HTML?
   *
   * This is just to warn the user, actual sanitization is done backend side.
   *
   * @see https://stackoverflow.com/a/15458987
   * @param  {string}  value
   * @return {bool}
   */
  function hasHTML (value) {
    return /<[a-z][\s\S]*>/i.test(value);
  }

  /**
   * Is HTML?
   *
   * It tries to use the DOMParser object (see Browser compatibility table
   * [here](mzl.la/2kh7HEl)), otherwise it just.
   * Solution inspired by this {@link http://bit.ly/2k6uFLI, stackerflow answer)
   *
   * Not currently in use.
   *
   * @ignore
   * @param  {string}  str
   * @return {bool}
   */


  /**
   * @alias core.Helper
   * @description  Exposed module <a href="module-Helper.html">Helper</a>
   * @access package
   */
  var Helper = {
    isEmpty: isEmpty,
    isHex: isHex,
    isRgb: isRgb,
    isRgba: isRgba,
    isColor: isColor,
    hexToRgb: hexToRgb,
    rgbaToRgb: rgbaToRgb,
    normalizeFontFamily: normalizeFontFamily,
    normalizeFontFamilies: normalizeFontFamilies,
    extractSizeUnit: extractSizeUnit,
    extractNumber: extractNumber,
    modulus: modulus,
    // These don't have a PHP equivalent in the KKcp_Helper class:
    numberToBoolean: numberToBoolean,
    stripHTML: stripHTML,
    hasHTML: hasHTML,
  }

  /**
   * @fileOverview Collects all validate methods used by Customize Plus controls.
   * Each function has also a respective PHP version in `class-validate.php`.
   *
   * @module Validate
   * @requires Helper
   */
  /* global tinycolor */

  /**
   * Validate a required setting value
   *
   * @since 1.0.0
   *
   * @param {WP_Error}             $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  function required( $validity, $value, $setting, $control ) {
    if ( !$control.params.optional ) {
      if ( Helper.isEmpty( $value ) ) {
        $validity = $control._addError( $validity, 'vRequired' );
      }
    }
    return $validity;
  }

  /**
   * Validate a single choice
   *
   * @since 1.0.0
   *
   * @param {WP_Error}             $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  function singleChoice( $validity, $value, $setting, $control ) {
    var _validChoices = $control._validChoices;
    var $choices = _validChoices && _validChoices.length ? _validChoices : $control.params.choices;

    if ( _$1.isArray( $choices ) && $choices.indexOf( $value ) === -1 ) {
      $validity = $control._addError( $validity, 'vNotAChoice', $value );
    }

    return $validity;
  }

  /**
   * Validate an array of choices
   *
   * @since 1.0.0
   *
   * @param {WP_Error}             $validity
   * @param {array}                $value        The value to validate.
   * @param {WP_Customize_Setting} $setting      Setting instance.
   * @param {WP_Customize_Control} $control      Control instance.
   * @param {bool}                 $check_length Should match choices length? e.g.
   *                                             for sortable control where the
   *                                             all the defined choices should be
   *                                             present in the validated value
   * @return {WP_Error}
   */
  function multipleChoices( $validity, $value, $setting, $control, $check_length ) {
    if ( $check_length === void 0 ) $check_length = false;

    var _validChoices = $control._validChoices;
    var params = $control.params;
    var $choices = _validChoices && _validChoices.length ? _validChoices : params.choices;

    if ( !_$1.isArray( $value ) ) {
      $validity = $control._addError( $validity, 'vNotArray' );
    } else {

      // check that the length of the value array is correct
      if ( $check_length && $choices.length !== $value.length ) {
        $validity = $control._addError( $validity, 'vNotExactLengthArray', $choices.length );
      }

      // check the minimum number of choices selectable
      if ( is_int( params.min ) && $value.length < params.min ) {
        $validity = $control._addError( $validity, 'vNotMinLengthArray', params.min );
      }

      // check the maximum number of choices selectable
      if ( is_int( params.max ) && $value.length > params.max ) {
        $validity = $control._addError( $validity, 'vNotMaxLengthArray', params.max );
      }

      // now check that the selected values are allowed choices
      for (var i = 0; i < $value.length; i++) {
        if ( $choices.indexOf( $value[i] ) === -1 ) {
          $validity = $control._addError( $validity, 'vNotAChoice', $value[i] );
        }
      }
    }

    return $validity;
  }

  /**
   * Validate one or more choices
   *
   * @since 1.0.0
   *
   * @param {WP_Error}             $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  function oneOrMoreChoices( $validity, $value, $setting, $control ) {
    if ( _$1.isString( $value ) ) {
      return singleChoice( $validity, $value, $setting, $control );
    }
    return multipleChoices( $validity, $value, $setting, $control );
  }

  /**
   * Validate sortable
   *
   * @since 1.1.0
   *
   * @param {WP_Error}             $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  function sortable( $validity, $value, $setting, $control ) {
    return multipleChoices( $validity, $value, $setting, $control, true );
  }

  /**
   * Validate font family
   *
   * @since 1.0.0
   *
   * @param {WP_Error}             $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  function fontFamily( $validity, $value, $setting, $control ) {
    if ( _$1.isString( $value ) ) {
      $value = $value.split( ',' );
    }
    // this is enough to do in JavaScript only, there is sanitization anyway
    if ( _$1.isArray( $value ) ) {
      $value = _$1.map( $value, function (v) { return Helper.normalizeFontFamily( v ); } );
    }
    return multipleChoices( $validity, $value, $setting, $control );
  }

  /**
   * Validate checkbox
   *
   * @since 1.0.0
   *
   * @param {WP_Error}             $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  function checkbox( $validity, $value, $setting, $control ) {
    if ( $value != 1 && $value != 0 ) {
      $validity = $control._addError( $validity, 'vCheckbox' );
    }
    return $validity;
  }

  /**
   * Validate tags
   *
   * @since 1.0.0
   *
   * @param {WP_Error}             $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  function tags( $validity, $value, $setting, $control ) {
    var params = $control.params;

    if ( !_$1.isString( $value ) ) {
      $validity = $control._addError( $validity, 'vTagsType' );
    }
    if (!_$1.isArray($value)) {
      $value = $value.split(',');
    }

    // maybe check the minimum number of choices selectable
    if ( is_int( params.min ) && $value.length < params.min ) {
      $validity = $control._addError( $validity, 'vTagsMin', params.min );
    }
    // maybe check the maxmimum number of choices selectable
    if ( is_int( params.max ) && $value.length > params.max ) {
      $validity = $control._addError( $validity, 'vTagsMax', params.max );
    }

    return $validity;
  }

  /**
   * Validate text
   *
   * @since 1.0.0
   *
   * @param {WP_Error}             $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  function text( $validity, $value, $setting, $control ) {
    var $attrs = $control.params['attrs'] || {};
    var $type = $attrs.type || 'text';

    // type
    if ( ! _$1.isString( $value ) ) {
      $validity = $control._addError( $validity, 'vTextType' );
    }
    // url
    // make the `isURL` function behaving like php's `filter_var( $value, FILTER_VALIDATE_URL )`
    if ( $type === 'url' && !isURL( $value, { require_tld: false, allow_trailing_dot: true } ) ) {
      $validity = $control._addError( $validity, 'vInvalidUrl' );
    }
    // email
    else if ( $type === 'email' && !isEmail( $value ) ) {
      $validity = $control._addError( $validity, 'vInvalidEmail' );
    }
    // max length
    if ( is_int( $attrs['maxlength'] ) && $value.length > $attrs['maxlength'] ) {
      $validity = $control._addError( $validity, 'vTextTooLong', $attrs['maxlength'] );
    }
    // min length
    if ( is_int( $attrs['minlength'] ) && $value.length < $attrs['minlength'] ) {
      $validity = $control._addError( $validity, 'vTextTooShort', $attrs['minlength'] );
    }
    // pattern
    if ( _$1.isString( $attrs['pattern'] ) && ! $value.match( new RegExp( $attrs['pattern'] ) ) ) {
      $validity = $control._addError( $validity, 'vTextPatternMismatch', $attrs['pattern'] );
    }

    // html must be escaped
    if ( $control.params.html === 'escape' ) {
      if ( Helper.hasHTML( $value ) ) {
        $validity = $control._addWarning( $validity, 'vTextEscaped' );
      }
    }
    // html is dangerously completely allowed
    else if ( $control.params.html === 'dangerous' ) {
      $validity = $control._addWarning( $validity, 'vTextDangerousHtml' );
    }
    // html is not allowed at all
    else if ( ! $control.params.html ) {
      if ( Helper.hasHTML( $value ) ) {
        $validity = $control._addError( $validity, 'vTextHtml' );
      }
    }
   

    return $validity;
  }

  /**
   * Validate number
   *
   * @since 1.0.0
   *
   * @param {WP_Error}             $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  function number( $validity, $value, $setting, $control ) {
    var $attrs = $control.params.attrs || {};

    // coerce to number
    $value = Number($value);

    // no number
    if ( ! is_numeric( $value ) ) {
      $validity = $control._addError( $validity, 'vNotAnumber' );
      return $validity;
    }
    // unallowed float
    if ( is_float( $value ) && !$attrs['float'] ) {
      $validity = $control._addError( $validity, 'vNoFloat' );
    }
    // must be an int but it is not
    else if ( ! is_int( $value ) && !$attrs['float'] ) {
      $validity = $control._addError( $validity, 'vNotAnInteger' );
    }

    if ( $attrs ) {
      // if doesn't respect the step given
      if ( is_numeric( $attrs['step'] ) && Helper.modulus($value, $attrs['step']) !== 0 ) {
        $validity = $control._addError( $validity, 'vNumberStep', $attrs['step'] );
      }
      // if it's lower than the minimum
      if ( is_numeric( $attrs['min'] ) && $value < $attrs['min'] ) {
        $validity = $control._addError( $validity, 'vNumberLow', $attrs['min'] );
      }
      // if it's higher than the maxmimum
      if ( is_numeric( $attrs['max'] ) && $value > $attrs['max'] ) {
        $validity = $control._addError( $validity, 'vNumberHigh', $attrs['max'] );
      }
    }

    return $validity;
  }

  /**
   * Validate css unit
   *
   * @since 1.0.0
   *
   * @param {WP_Error}                $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  function sizeUnit( $validity, $unit, $setting, $control ) {
    var params = $control.params;

    // if it needs a unit and it is missing
    if ( ! empty( params['units'] ) && ! $unit ) {
      $validity = $control._addError( $validity, 'vSliderMissingUnit' );
    }
    // if the unit specified is not in the allowed ones
    else if ( ! empty( params['units'] ) && $unit && params['units'].indexOf( $unit ) === -1 ) {
      $validity = $control._addError( $validity, 'vSliderUnitNotAllowed', $unit );
    }
    // if a unit is specified but none is allowed
    else if ( empty( params['units'] ) && $unit ) {
      $validity = $control._addError( $validity, 'vSliderNoUnit' );
    }

    return $validity;
  }

  /**
   * Validate slider
   *
   * @since 1.0.0
   *
   * @param {WP_Error}             $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  function slider( $validity, $value, $setting, $control ) {
    var $number = Helper.extractNumber( $value );
    var $unit = Helper.extractSizeUnit( $value );

    $validity = number( $validity, $number, $setting, $control );
    $validity = sizeUnit( $validity, $unit, $setting, $control );

    return $validity;
  }

  /**
   * Validate color
   *
   * @since 1.0.0
   *
   * @requires tinycolor
   * @param {WP_Error}             $validity
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {WP_Error}
   */
  function color( $validity, $value, $setting, $control ) {
    var params = $control.params;

    if (!_$1.isString($value)) {
      return $control._addError( $validity, 'vColorWrongType' );
    }
    $value = $value.replace(/\s/g, '');

    if ( ! params.transparent && tinycolor($value).toName() === 'transparent' ) {
      $validity = $control._addError( $validity, 'vNoTransparent' );
    }
    else if ( ! params.alpha && Helper.isRgba($value)) {
      $validity = $control._addError( $validity, 'vNoRGBA' );
    }
    else if ( ! params.picker && _$1.isArray(params.palette) ) {
      var valueNormalized = $control.softenize($value);
      var paletteNormalized = _$1.flatten(params.palette, true);
      paletteNormalized = _$1.map(paletteNormalized, function (color) {
        return $control.softenize(color);
      });
      if ( paletteNormalized.indexOf(valueNormalized) === -1 ) {
        $validity = $control._addError( $validity, 'vNotInPalette' );
      }
    }
    else if ( ! Helper.isColor( $value, api$1.constants['colorFormatsSupported'] ) ) {
      $validity = $control._addError( $validity, 'vColorInvalid' );
    }

    return $validity;
  }

  /**
   * @alias core.Validate
   * @description  Exposed module <a href="module-Validate.html">Validate</a>
   * @access package
   */
  var Validate = api$1.core.Validate = {
    required: required,
    singleChoice: singleChoice,
    multipleChoices: multipleChoices,
    oneOrMoreChoices: oneOrMoreChoices,
    sortable: sortable,
    fontFamily: fontFamily,
    checkbox: checkbox,
    tags: tags,
    text: text,
    number: number,
    sizeUnit: sizeUnit,
    slider: slider,
    color: color,
  };

  /**
   * Notification
   *
   * @since 1.0.0
   *
   * @memberof core
   * @class Notification
   * @extends wp.customize.Notification
   * @augments wp.customize.Class
   *
   * @requires Utils
   */
  var Notification = (function (superclass) {
    function Notification () {
      superclass.apply(this, arguments);
    }

    if ( superclass ) Notification.__proto__ = superclass;
    Notification.prototype = Object.create( superclass && superclass.prototype );
    Notification.prototype.constructor = Notification;

    Notification.prototype.render = function render () {
      var notification = this, container, data;
      if ( ! notification.template ) {
        // @note tweak is done here, template string instead of an id
        notification.template = Utils.template( this._tpl() );
      }
      data = _.extend( {}, notification, {
        alt: notification.parent && notification.parent.alt
      } );
      container = $( notification.template( data ) );

      if ( notification.dismissible ) {
        container.find( '.notice-dismiss' ).on( 'click keydown', function( event ) {
          if ( 'keydown' === event.type && 13 !== event.which ) {
            return;
          }

          if ( notification.parent ) {
            notification.parent.remove( notification.code );
          } else {
            container.remove();
          }
        });
      }

      return container;
    };

    /**
     * Template
     *
     * For now it's the same as the WordPress default one plus markdown support
     *
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access package
     *
     * @return {string}
     */
    Notification.prototype._tpl = function _tpl () {
      return  "\n      <li class=\"notice notice-{{ data.type || 'info' }} {{ data.alt ? 'notice-alt' : '' }} {{ data.dismissible ? 'is-dismissible' : '' }} {{ data.containerClasses || '' }} kkcp-notification\" data-code=\"{{ data.code }}\" data-type=\"{{ data.type }}\">\n        <# if (marked) { #>{{{ marked(data.message || data.code) }}}<# } else { #><div class=\"notification-message\">{{{ data.message || data.code }}}</div><# } #>\n        <# if ( data.dismissible ) { #>\n          <button type=\"button\" class=\"notice-dismiss\"><span class=\"screen-reader-text\"><?php esc_html( 'Dismiss' ) ?></span></button>\n        <# } #>\n      </li>\n    "
    };

    return Notification;
  }(wpApi.Notification));

  var Notification$1 = api$1.core.Notification = Notification;

  /**
   * Control Base class
   *
   * Expands the default Customizer Control class (through standard class syntax).
   * Render controls content on demand when their section is expanded then remove
   * the DOM when the section is collapsed (inflation/deflation).
   * Since we override some 'not-meant-to-be-overriden' methods keep an eye on
   * @link(http://git.io/vZ6Yq, WordPress source code).
   *
   * @see PHP class KKcp_Customize_Control_Base
   * @since  1.0.0
   *
   * @memberof controls
   * @class Base
   *
   * @extends wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Utils
   * @requires Validate
   */
  var Base = (function (superclass) {
    function Base (id, options) {
      this.initialize(id, options);
      this.componentInit();
      this._customInitialize();
    }

    if ( superclass ) Base.__proto__ = superclass;
    Base.prototype = Object.create( superclass && superclass.prototype );
    Base.prototype.constructor = Base;

    /**
     * {@inheritDoc}
     *
     * Tweak the initialize method.
     *
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @override
     */
    Base.prototype.initialize = function initialize (id, options) {
      var control = this, deferredSettingIds = [], settings, gatherSettings;

      control.params = _$1.extend(
        {},
        control.defaults,
        control.params || {}, // In case sub-class already defines.
        options.params || options || {} // The options.params property is deprecated but it is checked first for back-compat.
      );

      if ( ! wpApi.Control.instanceCounter ) {
        wpApi.Control.instanceCounter = 0;
      }
      wpApi.Control.instanceCounter++;
      if ( ! control.params.instanceNumber ) {
        control.params.instanceNumber = wpApi.Control.instanceCounter;
      }

      // Look up the type if one was not supplied.
      if ( ! control.params.type ) {
        _$1.find( wpApi.controlConstructor, function( Constructor, type ) {
          if ( Constructor === control.constructor ) {
            control.params.type = type;
            return true;
          }
          return false;
        } );
      }

      // @note `control.params.content` is managed differently in `_mount` and
      // `_unmount` methods
      // if ( ! control.params.content ) {
      //   control.params.content = $( '<li></li>', {
      //     id: 'customize-control-' + id.replace( /]/g, '' ).replace( /\[/g, '-' ),
      //     'class': 'customize-control customize-control-' + control.params.type
      //   } );
      // }

      var container = document$1.createElement('li');
      container.id = 'customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
      container.className = 'customize-control kkcp-control customize-control-'
        + control.params.type;

      // @note add a flag so that we are able to recognize our custom controls,
      // let's keep it short, so we need only to check `if (control.kkcp)`
      control.kkcp = 1;

      control.id = id;
      // @note all this stuff is not needed in Customize Plus Controls
      // control.selector = '#customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
      // control.templateSelector = 'customize-control-' + control.params.type + '-content';
      // if ( control.params.content ) {
      //   control.container = $( control.params.content );
      // } else {
      //   control.container = $( control.selector ); // Likely dead, per above. See #28709.
      // }
      control.container = $$1(container);

      // @note save a reference of the raw DOM node, we're gonna use it more
      // than the jQuery object `container` (which we can't change, because it's
      // used by methods which we don't override)
      control._container = container;

      // @note this is disabled, template are defined in Javascript control classes
      // if ( control.params.templateId ) {
      //   control.templateSelector = control.params.templateId;
      // } else {
      //   control.templateSelector = 'customize-control-' + control.params.type + '-content';
      // }

      control.deferred = _$1.extend( control.deferred || {}, {
        embedded: new $$1.Deferred()
      } );
      control.section = new wpApi.Value();
      control.priority = new wpApi.Value();
      control.active = new wpApi.Value();
      control.activeArgumentsQueue = [];
      control.notifications = new wpApi.Notifications({
        alt: control.altNotice
      });

      control.elements = [];

      control.active.bind( function ( active ) {
        var args = control.activeArgumentsQueue.shift();
        args = $$1.extend( {}, control.defaultActiveArguments, args );
        control.onChangeActive( active, args );
      } );

      control.section.set( control.params.section );
      control.priority.set( isNaN( control.params.priority ) ? 10 : control.params.priority );
      control.active.set( control.params.active );

      wpApi.utils.bubbleChildValueChanges( control, [ 'section', 'priority', 'active' ] );

      control.settings = {};

      settings = {};
      if ( control.params.setting ) {
        settings['default'] = control.params.setting;
      }
      _$1.extend( settings, control.params.settings );

      // Note: Settings can be an array or an object, with values being either setting IDs or Setting (or Value) objects.
      _$1.each( settings, function( value, key ) {
        var setting;
        if ( _$1.isObject( value ) && _$1.isFunction( value.extended ) && value.extended( wpApi.Value ) ) {
          control.settings[ key ] = value;
        } else if ( _$1.isString( value ) ) {
          setting = wpApi( value );
          if ( setting ) {
            control.settings[ key ] = setting;
          } else {
            deferredSettingIds.push( value );
          }
        }
      } );

      gatherSettings = function() {

        // Fill-in all resolved settings.
        _$1.each( settings, function ( settingId, key ) {
          if ( ! control.settings[ key ] && _$1.isString( settingId ) ) {
            control.settings[ key ] = wpApi( settingId );
          }

        } );

        // Make sure settings passed as array gets associated with default.
        if ( control.settings[0] && ! control.settings['default'] ) {
          control.settings['default'] = control.settings[0];
        }

        // Identify the main setting.
        control.setting = control.settings['default'] || null;

        // @note this way of managing controls is disabled here
        // control.linkElements();

        // @note disable here for on demand rendering/inflation
        if (!api$1.constants['DYNAMIC_CONTROLS_RENDERING']) {
          control.embed();
        }
      };

      if ( 0 === deferredSettingIds.length ) {
        gatherSettings();
      } else {
        wpApi.apply( wpApi, deferredSettingIds.concat( gatherSettings ) );
      }
    };

    /**
     * Component init
     *
     * This is the methods that subclasses could override with their custom init
     * logic (no DOM is available at this point)
     *
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access package
     * @abstract
     * @return {void}
     */
    Base.prototype.componentInit = function componentInit () {
    };

    /**
     * Custom initialization
     *
     * Collect here the custom initialization additions of Customize Plus controls
     *
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @access private
     * @return {void}
     */
    Base.prototype._customInitialize = function _customInitialize () {
      var this$1 = this;

      // alias for ready method React like
      this.ready = this.componentDidMount;

      // After the control is embedded on the page, invoke the "ready" method.
      this.deferred.embedded.done(function () {
        // @note this way of managing controls is disabled
        // this.linkElements();
        this$1.setupNotifications();

        // this.ready(); // @note ready is called within `_mount` called here below
        if (!api$1.constants['DYNAMIC_CONTROLS_RENDERING']) {
          this$1._mount();
        }
      });

      if (api$1.constants['DYNAMIC_CONTROLS_RENDERING']) {
        // embed control only when the parent section get clicked to keep the DOM
        // light,to make this work no data must be stored in the DOM
        wpApi.section(this.section()).expanded.bind(function (expanded) {
         
          // either unmount and mount dom each time...
          if (expanded) {
            _$1.defer(this$1._mount.bind(this$1));
          } else {
            this$1._unmount();
          }
          // ...or just do it the first time a control is expanded
          // if (expanded && !this.rendered) {
          //   _.defer(this._mount.bind(this));
          // }
        });
      }

      // controls can be setting-less from 4.5, so check
      if (this.setting) {

        // add custom validation function overriding the empty function from WP
        // API in `customize-thiss.js`, in the constructor `api.Value`
        if (!this.params['noLiveValidation']) {
          this.setting.validate = this._validate.bind(this);
        }

        // add sanitization of the value `postMessage`d to the preview
        if (!this.params['noLiveSanitization'] && !this.params['loose']) {
          this.setting.sanitize = function (value) {
            return this$1.sanitize(value, this$1.setting, this$1);
          };
        }

        // bind setting change to this method to reflect a programmatic
        // change on the UI, only if the control is rendered
        this.setting.bind(function (value) {
         
          var sectionId = this$1.section();
          if ( ! sectionId || ( wpApi.section.has( sectionId ) && wpApi.section( sectionId ).expanded() ) ) {
            if (this$1.rendered && this$1.shouldComponentUpdate(value)) {
              this$1.componentDidUpdate(value);
            }
          }
        });

        if (api$1.constants['DYNAMIC_CONTROLS_RENDERING']) {
          // this is needed to render a setting notification in its this
          this.setting.notifications.bind('add', function (notification) {
            // if (DEBUG) {
            //   console.log(`Notification add [${notification.code}] for default
            //    setting of this '${this.id}'`);
            // }
            this$1.notifications.add(new Notification$1(notification.code,
              { message: notification.message })
            );
            this$1.notifications.render();
          });

          // this is needed to render a setting notification in its this
          this.setting.notifications.bind('removed', function (notification) {
            // if (DEBUG) {
            //   console.log(`Notification remove [${notification.code}] for default
            //    setting of this '${this.id}'`);
            // }
            this$1.notifications.remove(notification.code);
            this$1.notifications.render();
          });
        }
      }
    };

    /**
     * Get localize string for current control
     *
     * Allows control classes to get a localized string by its key value. This is
     * useful during validation to define the validation messages only once both
     * for JavaScript and PHP validation.
     *
     * @see  PHP KKcp_Customize_Control_Base->l10n()
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @access package
     * @param {string} $key
     * @return {string}
     */
    Base.prototype._l10n = function _l10n ( $key ) {
      return api$1.l10n[ $key ] || '';
    };

    /**
     * Private `validate` wrap, it only wraps the `setting.validate` function
     * calling each control subclass `validate` method on its default setting.
     *
     * Always check that required setting (not `optional`) are not empty,
     * if it pass the check call the control specific abstract `validate` method.
     *
     * @see  PHP KKcp_Customize_Control_Base::validate_callback
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @access package
     * @param  {string} value
     * @return {string} The value validated or the last setting value.
     */
    Base.prototype._validate = function _validate (value) {
      var $validity = [];

      // immediately check a required value validity
      $validity = Validate.required($validity, value, this.setting, this);

      // if a required value is not supplied only perform one validation routine
      if (!_$1.keys($validity).length) {

        // otherwise apply the specific control/setting validation
        $validity = this.validate($validity, value, this.setting, this);
      }

      this._manageValidityNotifications($validity);

      // if there are no errors return the given new value
      if (!$validity.length) {
        return value;
      }

      // otherwise choose what to return based on the "looseness" of this control
      return this.params.loose ? value : this.setting();
    };

    /**
     * Manage validity notifications
     *
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @access package
     * @abstract
     * @param  {WP_Error} $validity
     */
    Base.prototype._manageValidityNotifications = function _manageValidityNotifications ($validity) {
      var this$1 = this;

      var notifications = this.setting.notifications.get();
      var newCodes = _$1.pluck($validity, 'code');
      var currentCodes = [];

      // flag used somewhere else (see below)
      this._currentValueHasError = !!$validity.length;

      for (var i = 0; i < notifications.length; i++) {
        var code = notifications[i]['code'];
        currentCodes.push(code);
        // if an existing notification is now valid remove it
        if (newCodes.indexOf(code) === -1) {
          this$1.setting.notifications.remove(code);
        }
      }

      for (var j = 0; j < $validity.length; j++) {
        var ref = $validity[j];
        var code$1 = ref.code;
        var type = ref.type;
        var msg = ref.msg;

        // if the notification is not there already add it
        if (currentCodes.indexOf(code$1) === -1) {
          this$1.setting.notifications.add(
            new Notification$1(code$1, {
              type: type,
              message: msg || api$1.l10n['vInvalid'],
            }
          ));
        }
      }
    };

    /**
     * Add validity notitification
     *
     * @see  PHP KKcp_Customize_Control_Base->add_error()
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access package
     * @param {string}            $type
     * @param {WP_Error}          $validity
     * @param {string}            $msg_id
     * @param {mixed|array|null}  $msg_arguments
     * @return {WP_Error}
     */
    Base.prototype._addValidityNotification = function _addValidityNotification ( $type, $validity, $msg_id, $msg_arguments ) {
      var $msg = this._l10n( $msg_id );

      // if there is an array of message arguments
      if ( _$1.isArray( $msg_arguments ) ) {
        $msg = vsprintf( $msg, $msg_arguments );
      }
      // if there is just one message argument
      else if ( $msg_arguments ) {
        $msg = sprintf( $msg, $msg_arguments );
      }
      // if it is a simple string message leave it as it is

      $validity.push({
        code: $msg_id,
        type: $type,
        msg: $msg
      });

      return $validity;
    };

    /**
     * Add error
     *
     * Shortcut to manage $validity during validation
     *
     * @see  PHP KKcp_Customize_Control_Base->add_error()
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @access package
     * @param {WP_Error}          $validity
     * @param {string}            $msg_id
     * @param {mixed|array|null}  $msg_arguments
     * @return {WP_Error}
     */
    Base.prototype._addError = function _addError ( $validity, $msg_id, $msg_arguments ) {
      return this._addValidityNotification( 'error', $validity, $msg_id, $msg_arguments );
    };

    /**
     * Add warning
     *
     * Shortcut to manage $validity during validation
     *
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access package
     * @param {WP_Error}          $validity
     * @param {string}            $msg_id
     * @param {mixed|array|null}  $msg_arguments
     * @return {WP_Error}
     */
    Base.prototype._addWarning = function _addWarning ( $validity, $msg_id, $msg_arguments ) {
      return this._addValidityNotification( 'warning', $validity, $msg_id, $msg_arguments );
    };

    /**
     * Add info
     *
     * Shortcut to manage $validity during validation
     *
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access package
     * @param {WP_Error}          $validity
     * @param {string}            $msg_id
     * @param {mixed|array|null}  $msg_arguments
     * @return {WP_Error}
     */
    Base.prototype._addInfo = function _addInfo ( $validity, $msg_id, $msg_arguments ) {
      return this._addValidityNotification( 'info', $validity, $msg_id, $msg_arguments );
    };

    /**
     * Validate control's default setting value
     *
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @access public
     * @abstract
     * @param {WP_Error}             $validity
     * @param {mixed}                $value    The value to validate.
     * @param {WP_Customize_Setting} $setting  Setting instance.
     * @param {WP_Customize_Control} $control  Control instance.
     * @return {WP_Error}
     */
    Base.prototype.validate = function validate ( $validity, $value, $setting, $control ) {
      if ( $validity === void 0 ) $validity=[];

      return $validity;
    };

    /**
     * Sanitize control's default setting value
     *
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @access public
     * @abstract
     *
     * @param {string}               $value   The value to sanitize.
     * @param {WP_Customize_Setting} $setting Setting instance.
     * @param {WP_Customize_Control} $control Control instance.
     * @return {string|null} The sanitized value.
     */
    Base.prototype.sanitize = function sanitize ( $value, $setting, $control ) {
      return $value;
    };

    /**
     * Template
     *
     * Returns the control's complete template, either a simple string or a more
     * complex and composed method. This method is publicly accessible and should
     * be overrided by controls that extend but are outside Customize Plus.
     *
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access public
     * @abstract
     *
     * @return {string}
     */
    Base.prototype.template = function template$$1 () {
      var tpl = '';
      tpl += this._tplExtras();
      tpl += this._tpl();
      tpl += this._tplNotifications();

      return tpl;
    };

    /**
     * Template
     *
     *
     * Subclasses within Customize Plus must have their own '_tpl' template
     * overriding this method. This cannot be ovverided through public API, that
     * is why the method is underscore prefixed and mangled during minification.
     *
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access package
     * @abstract
     */
    Base.prototype._tpl = function _tpl () {
      return "";
    };

    /**
     * Control's specific header template
     *
     * Subclasses should call this method themselves in the appropriate template
     * position, according to their specific needs. By default (if not overriden)
     * this template partial prints the label and description as markdown if the
     * markdown js plugin is available. This cannot be called or ovverided through
     * public API, that is why the method is underscore prefixed and mangled
     * during minification.
     *
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access package
     * @abstract
     *
     * @return {string}
     */
    Base.prototype._tplHeader = function _tplHeader () {
      return"\n      <# if (data.label) { #>\n        <div class=\"customize-control-title\">\n          <# if (marked) { #>{{{ marked(data.label) }}}<# } else { #>{{{ data.label }}}<# } #>\n        </div>\n      <# } if (data.description) { #>\n        <div class=\"description customize-control-description\">\n          <# if (marked) { #>{{{ marked(data.description) }}}\n          <# } else { #>{{{ data.description }}}<# } #>\n        </div>\n      <# } #>\n    ";
    };

    /**
     * Control's specific notification template
     *
     * Subclasses within Customize Plus can have their own 'notification' template
     * overriding this method. This cannot be ovverided through public API, that
     * is why the method is underscore prefixed and mangled during minification.
     *
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access package
     * @abstract
     *
     * @return {string}
     */
    Base.prototype._tplNotifications = function _tplNotifications () {
      return '<div class="customize-control-notifications-container"></div>';
    };

    /**
     * Control's extras menu template
     *
     * Subclasses within Customize Plus can have their own 'extras' template
     * overriding this method. This cannot be ovverided through public API, that
     * is why the method is underscore prefixed and mangled during minification.
     *
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access package
     * @abstract
     *
     * @return {string}
     */
    Base.prototype._tplExtras = function _tplExtras () {
      return ("\n      <div class=\"kkcp-extras\">\n        <i class=\"kkcp-extras-btn kkcpui-control-btn dashicons dashicons-admin-generic\"></i>\n        <ul class=\"kkcp-extras-list\">\n          <li class=\"kkcp-extras-reset_last\">" + (api$1.l10n['resetLastSaved']) + "</li>\n          <li class=\"kkcp-extras-reset_initial\">" + (api$1.l10n['resetInitial']) + "</li>\n          <li class=\"kkcp-extras-reset_factory\">" + (api$1.l10n['resetFactory']) + "</li>\n        </ul>\n      </div>\n    ");
    };

    /**
     * Render the control from its JS template, uses custom template utility.
     *
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @access protected
     * @override
     */
    Base.prototype.renderContent = function renderContent () {
      var ref = this;
      var _container = ref._container;
      var templateSelector = ref.templateSelector;

      // replaces the container element's content with the control.
      var template$$1 = Utils.template(this.template());
      if (template$$1 && _container) {

        /* jshint funcscope: true */
        if (DEBUG.performances) { var t = performance.now(); }

        // render and store it in the params
        this.params.content = _container.innerHTML = template$$1(this.params);

        if (DEBUG.performances) { console.log('%c renderContent of ' + this.params.type + '(' +
          this.id + ') took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7'); }
      }

      this._rerenderNotifications();
    };

    /**
     * Destroy
     *
     * Unmounts the component and remove also the `<li>` container.
     *
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @alias controls.Base._unmount
     * @access public
     */
    Base.prototype.destroy = function destroy () {
      this._unmount(true);
      this._container.parentNode.removeChild(this._container);
    };

    /**
     * Should component update (React like)
     *
     * @see https://reactjs.org/docs/react-component.html#shouldcomponentupdate
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access protected
     * @abstract
     * @param {mixed} $value The new setting value
     * @return {boolean}
     */
    Base.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      return true;
    };

    /**
     * Component did update (React like)
     *
     * This is usually called by a programmatic change like a reset of the control
     * default setting value.
     *
     * @see https://reactjs.org/docs/react-component.html#componentdidupdate
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @access protected
     * @abstract
     * @param {mixed} $value The new setting value
     */
    Base.prototype.componentDidUpdate = function componentDidUpdate ($value) {};

    /**
     * Component did mount (React like)
     *
     * @see  https://reactjs.org/docs/react-component.html#componentdidunmount
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access protected
     * @abstract
     */
    Base.prototype.componentDidMount = function componentDidMount () {};

    /**
     * Component will unmount (React like)
     *
     * @see  https://reactjs.org/docs/react-component.html#componentwillunmount
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access protected
     * @abstract
     */
    Base.prototype.componentWillUnmount = function componentWillUnmount () {};

    /**
     * Unmount (React current substitute)
     *
     * Removes the DOM of the control. In case the DOM store is empty (the first
     * time this method get called) it fills it. This could removed once React is
     * implemented
     *
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access package
     *
     * @param {boolean} force
     */
    Base.prototype._unmount = function _unmount (force) {
      var this$1 = this;

      /* jshint funcscope: true */
      // if (DEBUG) var t = performance.now();

      var container = this._container;

      if (!this.params.content) {
        this.params.content = container.innerHTML.trim();
      }

      // call the abstract method
      if (this.rendered) {
        this.componentWillUnmount();
      }

      // and empty the DOM from the container deferred
      // the slide out animation of the section doesn't freeze
      _$1.defer(function () {
        // due to the timeout we need to be sure that the section is not expanded
        if (force || !wpApi.section(this$1.section.get()).expanded.get()) {

          /* jshint funcscope: true */
          if (DEBUG.performances) { var t = performance.now(); }

          // Super fast empty DOM element
          // {@link http://jsperf.com/jquery-html-vs-empty-vs-innerhtml/20}
          // while (container.lastChild) {
          //   container.removeChild(container.lastChild);
          // }

         
          container.innerHTML = '';

          if (DEBUG.performances) { console.log('%c unmount of ' + this$1.params.type + '(' + this$1.id +
            ') took ' + (performance.now() - t) + ' ms.', 'background: #D2FFF1'); }

          // flag control that it's not rendered
          this$1.rendered = false;
        }
      });
    };

    /**
     * Mount (React current substitute)
     *
     * The first time renders from the js template, afterward retrieve the DOM
     * string from the `template` param store. After the template has been
     * rendered call the `componentDidMount` method, overridden in each control
     * with their own specific DOM initialization. Also put a flag `rendered` on
     * the control instance to indicate whether the control is rendered or not.
     *
     * @since 1.1.0
     *
     * @memberof! controls.Base#
     * @access package
     *
     * @param  {boolean} resolveEmbeddedDeferred Sometimes (i.e. for the
     *                                           `control.focus()` method) we need
     *                                           to resolve the deffered embed.
     */
    Base.prototype._mount = function _mount (resolveEmbeddedDeferred) {
      /* jshint funcscope: true */
      if (DEBUG.performances) { var t = performance.now(); }
      if (!this.params.content) {
        this.renderContent();

        if (DEBUG.performances) { console.log('%c mount DOM of ' + this.params.type +
          ' took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7'); }
      } else {
        if (!this.rendered) {
          this._container.innerHTML = this.params.content;
          this._rerenderNotifications();

          if (DEBUG.performances) { console.log('%c mount DOM of ' + this.params.type +
            ' took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7'); }
        }
      }
      this.rendered = true;
      this.componentDidMount();
      if (resolveEmbeddedDeferred) {
        this.deferred.embedded.resolve();
      }
      this._extras();

      // if (DEBUG.performances) console.log('%c mount of ' + this.params.type +
      //   ' took ' + (performance.now() - t) + ' ms.', 'background: #D2FFF1');
    };

    /**
     * Re-render notifications after content has been re-rendered.
     *
     * This is taken as it is from the core base control class
     * (`wp.customize.Control`)in the end of the `renderContent` method.
     * We extract it in a method to reuse on component DOM recreation.
     *
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @access package
     */
    Base.prototype._rerenderNotifications = function _rerenderNotifications () {
      this.notifications.container = this.getNotificationsContainerElement();
      var sectionId = this.section();
      if ( ! sectionId || ( wpApi.section.has( sectionId ) && wpApi.section( sectionId ).expanded() ) ) {
        this.notifications.render();
      }
    };

    /**
     * Softenize
     *
     * Normalize setting for soft comparison.
     *
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @access public
     * @abstract
     * @static
     * @param  {?} value Could be the original, the current, or the initial
     *                   session value
     * @return {?}       The 'normalized' value passed as an argument.
     */
    Base.prototype.softenize = function softenize (value) {
      return value;
    };

    /**
     * Manage the extras dropdown menu of the control.
     *
     * @since 1.0.0
     *
     * @memberof! controls.Base#
     * @access package
     */
    Base.prototype._extras = function _extras () {
      var this$1 = this;

      // constants
      var CLASS_OPEN = 'kkcp-extras-open';
      var CLASS_RESET_LAST = 'kkcp-extras-reset_last';
      var CLASS_RESET_INITIAL = 'kkcp-extras-reset_initial';
      var CLASS_RESET_FACTORY = 'kkcp-extras-reset_factory';
      var CLASS_DISABLED = 'kkcp-disabled';
      // DOM
      var container = this._container;
      var area = container.getElementsByClassName('kkcp-extras')[0];
      var toggle = container.getElementsByClassName('kkcp-extras-btn')[0];
      var btnResetLast = container.getElementsByClassName(CLASS_RESET_LAST)[0];
      var btnResetInitial = container.getElementsByClassName(CLASS_RESET_INITIAL)[0];
      var btnResetFactory = container.getElementsByClassName(CLASS_RESET_FACTORY)[0];
      // setting, uses closure
      var setting = this.setting;
      // state
      var isOpen = false;

      // handlers
      var _closeExtras = function () {
        container.classList.remove(CLASS_OPEN);
      };
      // reset setting to the last saved value and closes the `extras` dropdown.
      var _resetLastValue = function () {
        setting.forceSet(setting['vLastSaved']);
        _closeExtras();
      };
      // reset setting to the value at the beginning of the session. and closes
      // the `extras` dropdown.
      var _resetInitialValue = function () {
        setting.forceSet(setting['vInitial']);
        _closeExtras();
      };
      // reset setting to the value at the factory state (as defined in the theme
      // defaults) and closes the `extras` dropdown.
      var _resetFactoryValue = function () {
        setting.forceSet(setting['vFactory']);
        _closeExtras();
      };
      // enable button responsible for: resetting to last saved value
      var _enableBtnLast = function () {
        btnResetLast.className = CLASS_RESET_LAST;
        btnResetLast.onclick = _resetLastValue;
      };
      // disable button responsible for: resetting to initial value
      var _disableBtnLast = function () {
        btnResetLast.className = CLASS_RESET_LAST + " " + CLASS_DISABLED;
        btnResetLast.onclick = '';
      };
      // enable button responsible for: resetting to initial value
      var _enableBtnInitial = function () {
        btnResetInitial.className = CLASS_RESET_INITIAL;
        btnResetInitial.onclick = _resetInitialValue;
      };
      // disable button responsible for: resetting to initial value
      var _disableBtnInitial = function () {
        btnResetInitial.className = CLASS_RESET_INITIAL + " " + CLASS_DISABLED;
        btnResetInitial.onclick = '';
      };
      // enable button responsible for: resetting to factory / theme-default value
      var _enableBtnFactory = function () {
        btnResetFactory.className = CLASS_RESET_FACTORY;
        btnResetFactory.onclick = _resetFactoryValue;
      };
      // disable button responsible for: resetting to factory / theme-default value
      var _disableBtnFactory = function () {
        btnResetFactory.className = CLASS_RESET_FACTORY + " " + CLASS_DISABLED;
        btnResetFactory.onclick = '';
      };

      // update status (enable / disable) for each control in the `extras` menu.
      // when the extras dropdown is open determine which actions are enabled and
      // bind them. If the current value is the same as the one the action effect
      // would give disable the action.
      var _onExtrasOpen = function () {
        // if the control current value is not valid enable both reset buttons
        if (this$1._currentValueHasError) {
          _enableBtnInitial();
          _enableBtnFactory();
          return;
        }

        var currentValue = this$1.softenize(setting());

        if (_$1.isEqual(currentValue, this$1.softenize(setting['vLastSaved']))) {
          _disableBtnLast();
        } else {
          _enableBtnLast();
        }
        if (_$1.isEqual(currentValue, this$1.softenize(setting['vInitial']))) {
          _disableBtnInitial();
        } else {
          _enableBtnInitial();
        }
        if (_$1.isEqual(currentValue, this$1.softenize(setting['vFactory']))) {
          _disableBtnFactory();
        } else {
          _enableBtnFactory();
        }
      };

      if (toggle) {
        if (DEBUG) {
          toggle.title = 'Click to dump control object into console';
        }
        toggle.onclick = function () {
          isOpen = !isOpen;
          container.classList.toggle(CLASS_OPEN, isOpen);
          if (isOpen) {
            _onExtrasOpen();
          }
          if (DEBUG) {
            console.info(("Control[" + (this$1.id) + "] "), this$1);
          }
        };
      }

      if (area) {
        area.onmouseenter = function () {
          isOpen = true;
          container.classList.add(CLASS_OPEN);
          _onExtrasOpen();
        };
        area.onmouseleave = function () {
          isOpen = false;
          // don't close immediately, wait a bit and see if the mouse is still out
          // of the area
          setTimeout(function () {
            if (!isOpen) {
              container.classList.remove(CLASS_OPEN);
            }
          }, 200);
        };
      }
    };

    return Base;
  }(wpApi.Control));

  /**
   * Fix autofocus
   *
   * This is needed if autofocus is set to one of our 'post-rendered' controls
   */
  wpApi.bind('ready', function () {
    try {
      var controlToFocusID = window$1._wpCustomizeSettings.autofocus.control;
      if (controlToFocusID) {
        Utils.linkControl(null, controlToFocusID);
      }
    } catch(e) {
      console.warn('Fix autofocus', e);
    }
  });

  /**
   * Save last saved value on each control instance on `saved` hook. With this in
   * the extras menu users will be able to reset the setting value to the last
   * saved value.
   */
  wpApi.bind('save', function () {
    Utils._eachControl(function (control) {
      if (control && control.setting && control.setting['_dirty']) { // whitelisted from uglify \\
        // console.log(control.id, 'is dirty on save with value:', control.setting());
        control.setting['vLastSaved'] = control.setting();
      }
    });
  });

  var Base$1 = api$1.controls.Base = Base;

  // import './utils';
  // import './_banner';

  /**
   * Control Base Choices class
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class BaseChoices
   *
   * @extends controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var BaseChoices = (function (Base) {
    function BaseChoices () {
      Base.apply(this, arguments);
    }

    if ( Base ) BaseChoices.__proto__ = Base;
    BaseChoices.prototype = Object.create( Base && Base.prototype );
    BaseChoices.prototype.constructor = BaseChoices;

    BaseChoices.prototype.componentInit = function componentInit () {
      this._validChoices = this._getValidChoices(this.params.choices);
    };

    /**
     * Get valid choices values from given choices
     *
     * @since   1.0.0
     * @memberof! controls.BaseChoices#
     *
     * @param  {Array<string>|Object<string, Object>} choices
     * @return {Array<string>}
     */
    BaseChoices.prototype._getValidChoices = function _getValidChoices (choices) {
      if (_$1.isArray(choices)) {
        return choices;
      }
      if (!_$1.isUndefined(choices)) {
        var validChoices = [];
        for (var choiceKey in choices) {
          if (choices.hasOwnProperty(choiceKey)) {
            validChoices.push(choiceKey);
          }
        }
        return validChoices;
      }
      return [];
    };

    /**
     * {@inheritdoc}. Choice supports both a string if you only want to pass a
     * label or an array with `label`, `sublabel`, `tooltip`, `popover_title`,
     * `popover_txt`, etc.
     *
     * @since 1.1.0
     * @override
     */
    BaseChoices.prototype._tpl = function _tpl () {
      return ("\n      <# var choices = data.choices, idx = 0;\n        if (!_.isEmpty(choices)) { #>\n          " + (this._tplHeader()) + "\n          " + (this._tplAboveChoices()) + "\n          " + (this._tplChoicesLoop()) + "\n          " + (this._tplBelowChoices()) + "\n      <# } #>\n    ")
    };

    /**
     * Ouput the choices template in a loop. Override this in subclasses
     * to change behavior, for instance in sortable controls.
     *
     * @since   1.1.0
     * @memberof! controls.BaseChoices#
     *
     * @access package
     * @return {string}
     */
    BaseChoices.prototype._tplChoicesLoop = function _tplChoicesLoop () {
      return ("<# for (var val in choices) { #>" + (this._tplChoice()) + "<#} #>")
    };

    /**
     * Ouput the js to configure each choice template data and its UI
     *
     * @since   1.1.0
     * @memberof! controls.BaseChoices#
     *
     * @access package
     * @return {string}
     */
    BaseChoices.prototype._tplChoice = function _tplChoice () {
      return ("\n      <# if (choices.hasOwnProperty(val)) {\n        var label;\n        var choice = choices[val];\n        var classes = '';\n        var attributes = '';\n        var tooltip = '';\n        var id = data.id + idx++;\n        if (!_.isUndefined(choice.label)) {\n          label = choice.label;\n          if (choice.popover) {\n            classes += 'kkcpui-popover ';\n            if (choice.popover.title) attributes += ' data-title=\"' + choice.popover.title + '\"';\n            if (choice.popover.img) attributes += ' data-img=\"' + choice.popover.img + '\"';\n            if (choice.popover.text) attributes += ' data-text=\"' + choice.popover.text + '\"';\n            if (choice.popover.video) attributes += ' data-video=\"' + choice.popover.video + '\"';\n          }\n          if (choice.tooltip) {\n            classes += 'kkcpui-tooltip--top ';\n            attributes += ' title=\"' + choice.tooltip + '\"';\n            tooltip = choice.tooltip;\n          }\n        } else {\n          label = choice;\n        }\n        if (!tooltip) {\n          tooltip = label;\n        }\n      #>\n        " + (this._tplChoiceUi()) + "\n      <# } #>\n    ")
    };

    /**
     * Custom choice template UI
     *
     * @since   1.1.0
     * @memberof! controls.BaseChoices#
     *
     * @abstract
     * @access package
     * @return {string}
     */
    BaseChoices.prototype._tplChoiceUi = function _tplChoiceUi () {
      return ""
    };

    /**
     * Add a part of template just before the choices loop
     *
     * @since   1.1.0
     * @memberof! controls.BaseChoices#
     *
     * @abstract
     * @access package
     * @return {string}
     */
    BaseChoices.prototype._tplAboveChoices = function _tplAboveChoices () {
      return ""
    };

    /**
     * Add a part of template just after the choices loop
     *
     * @since   1.1.0
     * @memberof! controls.BaseChoices#
     *
     * @abstract
     * @access package
     * @return {string}
     */
    BaseChoices.prototype._tplBelowChoices = function _tplBelowChoices () {
      return ""
    };

    return BaseChoices;
  }(Base$1));

  /**
   * Control Base Input class
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class controls.BaseInput
   *
   * @extends controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var BaseInput = (function (Base) {
    function BaseInput () {
      Base.apply(this, arguments);
    }

    if ( Base ) BaseInput.__proto__ = Base;
    BaseInput.prototype = Object.create( Base && Base.prototype );
    BaseInput.prototype.constructor = BaseInput;

    BaseInput.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      return this.__input.value !== $value;
    };

    /**
     * @override
     */
    BaseInput.prototype.componentDidUpdate = function componentDidUpdate ($value) {
      this.__input.value = $value;
    };

    /**
     * @override
     */
    BaseInput.prototype.componentDidMount = function componentDidMount () {
      var self = this;
      self.__input = self._container.getElementsByTagName('input')[0];

      // sync input and listen for changes
      $$1(self.__input)
        .val(self.setting())
        .on('change keyup paste', function () {
          self.setting.set(this.value);
        });
    };

    /**
     * {@inheritDoc}. Note that the `tooltip` input_attr is printed in a wrapping
     * span instead of directly on the input field.
     *
     * @since 1.1.0
     * @override
     */
    BaseInput.prototype._tpl = function _tpl () {
      return ("\n      <label>\n        " + (this._tplHeader()) + "<# var attrs = data.attrs || {}; #>\n        <# if (attrs.tooltip) { #><span class=\"kkcpui-tooltip--top\" title=\"{{ attrs.tooltip || '' }}\"><# } #>\n        " + (this._tplInner()) + "\n        <# if (attrs.tooltip) { #></span><# } #>\n      </label>\n    ")
    };

    /**
     * Js template for the actual input element area, override this e.g. in the
     * Password Control
     *
     * @since 1.1.0
     * @abstract
     */
    BaseInput.prototype._tplInner = function _tplInner () {
      return this._tplInput();
    };

    /**
     * Js template for the actual input element
     *
     * @since 1.1.0
     * @abstract
     */
    BaseInput.prototype._tplInput = function _tplInput () {
      return "\n      <input class=\"kkcp-input\" type=\"{{ attrs.type || data.type.replace('kkcp_','') }}\" value=\"\"\n        <# for (var key in attrs) { if (attrs.hasOwnProperty(key) && key !== 'title') { #>{{ key }}=\"{{ attrs[key] }}\" <# } } #>\n      >\n    "
    };

    return BaseInput;
  }(Base$1));

  var round = function round(value, precision, mode) {
    //  discuss at: http://locutus.io/php/round/
    // original by: Philip Peterson
    //  revised by: Onno Marsman (https://twitter.com/onnomarsman)
    //  revised by: T.Wild
    //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
    //    input by: Greenseed
    //    input by: meo
    //    input by: William
    //    input by: Josep Sanz (http://www.ws3.es/)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //      note 1: Great work. Ideas for improvement:
    //      note 1: - code more compliant with developer guidelines
    //      note 1: - for implementing PHP constant arguments look at
    //      note 1: the pathinfo() function, it offers the greatest
    //      note 1: flexibility & compatibility possible
    //   example 1: round(1241757, -3)
    //   returns 1: 1242000
    //   example 2: round(3.6)
    //   returns 2: 4
    //   example 3: round(2.835, 2)
    //   returns 3: 2.84
    //   example 4: round(1.1749999999999, 2)
    //   returns 4: 1.17
    //   example 5: round(58551.799999999996, 2)
    //   returns 5: 58551.8

    var m, f, isHalf, sgn; // helper variables
    // making sure precision is integer
    precision |= 0;
    m = Math.pow(10, precision);
    value *= m;
    // sign of the number
    sgn = value > 0 | -(value < 0);
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);

    if (isHalf) {
      switch (mode) {
        case 'PHP_ROUND_HALF_DOWN':
          // rounds .5 toward zero
          value = f + (sgn < 0);
          break;
        case 'PHP_ROUND_HALF_EVEN':
          // rouds .5 towards the next even integer
          value = f + f % 2 * sgn;
          break;
        case 'PHP_ROUND_HALF_ODD':
          // rounds .5 towards the next odd integer
          value = f + !(f % 2);
          break;
        default:
          // rounds .5 away from zero
          value = f + (sgn > 0);
      }
    }

    return (isHalf ? value : Math.round(value)) / m;
  };

  /**
   * @fileOverview Collects all sanitization methods used by Customize Plus
   * controls. Each function has also a respective PHP version in
   * `class-sanitize.php`.
   *
   * @since 1.0.0
   * @access package
   *
   * @module Sanitize
   * @requires Helper
   * @requires Validate
   */
  /**
   * Sanitize string
   *
   * @since 1.0.0
   * @param {mixed}                $input   The value to sanitize.
   * @return {string} The sanitized value.
   */
  function string ($input) {
    if (!_$1.isString($input)) {
      return JSON.stringify($input);
    }
    return $input;
  }

  /**
   * Sanitize single choice
   *
   * @since 1.0.0
   * @param {string}               $value   The value to sanitize.
   * @param {WP_Customize_Setting} $setting Setting instance.
   * @param {WP_Customize_Control} $control Control instance.
   * @return {string|null} The sanitized value.
   */
  function singleChoice$1 ( $value, $setting, $control ) {
    var _validChoices = $control._validChoices;
    var choices = _validChoices && _validChoices.length ? _validChoices : $control.params.choices;

    // if it is an allowed choice return it escaped
    if ( _$1.isArray( choices ) && choices.indexOf( $value ) !== -1 ) {
      // return _.escape( $value );
      return Helper.stripHTML( $value );
    }

    return null;
  }

  /**
   * Sanitize multiple choices
   *
   * @since 1.0.0
   * @param {array}                $value   The value to sanitize.
   * @param {WP_Customize_Setting} $setting Setting instance.
   * @param {WP_Customize_Control} $control Control instance.
   * @param {bool}                 $check_length Should match choices length? e.g.
   *                                             for sortable control where the
   *                                             all the defined choices should be
   *                                             present in the sanitized value
   * @return {array|null} The sanitized value.
   */
  function multipleChoices$1( $value, $setting, $control, $check_length ) {
    if ( $check_length === void 0 ) $check_length = false;

    var _validChoices = $control._validChoices;
    var params = $control.params;
    var $choices = _validChoices && _validChoices.length ? _validChoices : params.choices;

    if ( !_$1.isArray( $value ) ) {
      $value = [ $value ];
    }

    // filter out the not alowed choices and sanitize the others
    var $valueClean = [];
    for (var i = 0; i < $value.length; i++) {
      if ( $choices.indexOf( $value[i] ) !== -1 ) {
        // $valueClean.push( _.escape( $value[i] ) );
        $valueClean.push( Helper.stripHTML( $value[i] ) );
      }
    }
    $value = $valueClean;

    // if the selection was all wrong return the default, otherwise go on and try
    // to fix it
    if ( ! $value.length ) {
      return null;
    }

    // fill the array if there are not enough values
    if ( $check_length && $choices.length !== $value.length ) {
      $value = _$1.uniq( _$1.union( $value, $choices ) );
      return $value.slice( 0, $choices.length );
    }

    // fill the array if there are not enough values
    if ( is_int( params.min ) && $value.length < params.min ) {
      var $availableChoices = _$1.difference( $choices, $value );
      $value = $value.concat( $availableChoices.slice( 0, $value.length - params.min ) );
    }

    // slice the array if there are too many values
    if ( is_int( params.max ) && $value.length > params.max ) {
      $value = $value.slice( 0, params.max );
    }

    return $value;
  }

  /**
   * Sanitize one or more choices
   *
   * @since 1.0.0
   * @param {mixed}                $value   The value to sanitize.
   * @param {WP_Customize_Setting} $setting Setting instance.
   * @param {WP_Customize_Control} $control Control instance.
   * @return {string|array|null} The sanitized value.
   */
  function oneOrMoreChoices$1 ( $value, $setting, $control ) {
    if ( _$1.isString( $value ) ) {
      return singleChoice$1( $value, $setting, $control );
    }
    if ( _$1.isArray( $value ) ) {
      return multipleChoices$1( $value, $setting, $control );
    }
    return null;
  }

  /**
   * Sanitize sortable
   *
   * @since 1.1.0
   * @param {mixed}                $value   The value to sanitize.
   * @param {WP_Customize_Setting} $setting Setting instance.
   * @param {WP_Customize_Control} $control Control instance.
   * @return {array|null} The sanitized value.
   */
  function sortable$1 ( $value, $setting, $control ) {
    return multipleChoices$1( $value, $setting, $control, true );
  }

  /**
   * Sanitize font family
   *
   * @since 1.0.0
   *
   * @param {string|array}         $value   The value to sanitize.
   * @param {WP_Customize_Setting} $setting Setting instance.
   * @param {WP_Customize_Control} $control Control instance.
   * @return {string|null} The sanitized value.
   */
  function fontFamily$1( $value, $setting, $control ) {
    $value = Helper.normalizeFontFamilies( $value );

    if ( _$1.isString( $value ) ) {
      $value = $value.split( ',' );
    }
    $value = multipleChoices$1( $value, $setting, $control );

    if ( _$1.isArray( $value ) ) {
      return $value.join( ',' );
    }

    return null;
  }

  /**
   * Sanitize checkbox
   *
   * @since 1.0.0
   * @param {mixed}                $value    The value to validate.
   * @param {WP_Customize_Setting} $setting  Setting instance.
   * @param {WP_Customize_Control} $control  Control instance.
   * @return {string:0|1}
   */
  function checkbox$1( $value, $setting, $control ) {
    return Boolean( $value ) ? '1' : '0';
  }

  /**
   * Sanitize tags
   *
   * @since 1.0.0
   * @param {mixed}                $value   The value to sanitize.
   * @param {WP_Customize_Setting} $setting Setting instance.
   * @param {WP_Customize_Control} $control Control instance.
   * @return {string} The sanitized value.
   */
  function tags$1( $value, $setting, $control ) {
    var params = $control.params;

    if ( _$1.isString( $value ) ) {
      $value = $value.split(',');
    }
    if ( ! _$1.isArray( $value ) ) {
      $value = [ string( $value ) ];
    }
    $value = _$1.map( $value, function (value) { return value.trim() });

    if ( is_int( params.max ) && $value.length > params.max ) {
      $value = $value.slice( 0, params.max );
    }

    // return _.escape( $value.join(',') );
    return Helper.stripHTML( $value.join(',') );
  }

  /**
   * Sanitize text
   *
   * @since 1.0.0
   * @param {mixed}                $value   The value to sanitize.
   * @param {WP_Customize_Setting} $setting Setting instance.
   * @param {WP_Customize_Control} $control Control instance.
   * @return {string} The sanitized value.
   */
  function text$1( $value, $setting, $control ) {
    var $attrs = $control.params['attrs'] || {};
    var $input_type = $attrs.type || 'text';

    $value = string( $value );

    // url
    if ( 'url' === $input_type ) {
      $value = $value.trim();
    }
    // email
    else if ( 'email' === $input_type ) {
      $value = $value.trim();
    }
    // max length
    if ( is_int( $attrs['maxlength'] ) && $value.length > $attrs['maxlength'] ) {
      $value = $value.substr( 0, $attrs['maxlength'] );
    }
    // min length
    if ( is_int( $attrs['minlength'] ) && $value.length < $attrs['minlength'] ) {
      return null;
    }
    // pattern
    if ( _$1.isString( $attrs['pattern'] ) && ! $value.match( new RegExp( $attrs['pattern'] ) ) ) {
      return null;
    }
    // html must be escaped
    if ( $control.params.html === 'escape' ) {
      $value = _$1.escape( $value );
    }
    // html is dangerously completely allowed
    else if ( $control.params.html === 'dangerous' ) {
      $value = $value;
    }
    // html is not allowed at all
    else if ( ! $control.params.html ) {
      $value = Helper.stripHTML($value);
    }
   

    return $value;
  }

  /**
   * Sanitize number
   *
   * @since 1.0.0
   * @param {mixed}                $value   The value to sanitize.
   * @param {WP_Customize_Setting} $setting Setting instance.
   * @param {WP_Customize_Control} $control Control instance.
   * @return {number|null} The sanitized value.
   */
  function number$1( $value, $setting, $control ) {
    var $attrs = $control.params['attrs'] || {};
    $value = Helper.extractNumber( $value, $attrs['float'] );

    if ( ! is_numeric( $value ) ) {
      return null;
    }

    // if it's a float but it is not allowed to be it round it
    if ( is_float( $value ) && !$attrs['float'] ) {
      $value = round( $value );
    }
    // if doesn't respect the step given round it to the closest
    // then do the min and max checks
    if ( _$1.isNumber( $attrs['step'] ) && Helper.modulus($value, $attrs['step']) !== 0 ) {
      $value = round( $value / $attrs['step'] ) * $attrs['step'];
    }
    // if it's lower than the minimum return the minimum
    if ( _$1.isNumber( $attrs['min'] ) && $value < $attrs['min'] ) {
      return $attrs['min'];
    }
    // if it's higher than the maxmimum return the maximum
    if ( _$1.isNumber( $attrs['max'] ) && $value > $attrs['max'] ) {
      return $attrs['max'];
    }

    return $value;
  }

  /**
   * Sanitize CSS size unit
   *
   * @since 1.0.0
   * @param {string}   $unit          The unit to sanitize
   * @param {mixed}    $allowed_units The allowed units
   * @return {string}
   */
  function sizeUnit$1( $unit, $allowed_units ) {
    $allowed_units = $allowed_units || [];

    // if no unit is allowed
    if ( !$allowed_units.length ) {
      return '';
    }
    // if it needs a unit and it is missing
    else if ( $allowed_units.length && ! $unit ) {
      return $allowed_units[0];
    }
    // if the unit specified is not in the allowed ones
    else if ( $allowed_units.length && $unit && $allowed_units.indexOf( $unit ) === -1 ) {
      return $allowed_units[0];
    }
    // if the unit specified is in the allowed ones
    else if ( $allowed_units.length && $unit && $allowed_units.indexOf( $unit ) !== -1 ) {
      return $unit;
    }

    return '';
  }

  /**
   * Sanitize slider
   *
   * @since 1.0.0
   * @param {mixed}                $value   The value to sanitize.
   * @param {WP_Customize_Setting} $setting Setting instance.
   * @param {WP_Customize_Control} $control Control instance.
   * @return {string|number|null} The sanitized value.
   */
  function slider$1( $value, $setting, $control ) {
    var $number = Helper.extractNumber( $value );
    var $unit = Helper.extractSizeUnit( $value );

    $number = number$1( $number, $setting, $control );
    $unit = sizeUnit$1( $unit, $control.params['units'] );

    if ( $number === null ) {
      return null;
    }

    if ( $unit ) {
      return $number + $unit;
    }

    return $number;
  }

  /**
   * Sanitize color

   * It escapes HTML, removes spacs and strips the alpha channel if not allowed.
   * It checks also for a hex color string like '#c1c2b4' or '#c00' or '#CCc000'
   * or 'CCC' and fixes it. If the value is not valid it returns the setting
   * default.
   *
   * @since 1.0.0
   *
   * @param {mixed}                $value   The value to sanitize.
   * @param {WP_Customize_Setting} $setting Setting instance.
   * @param {WP_Customize_Control} $control Control instance.
   * @return {string|number} The sanitized value.
   */
  function color$1( $value, $setting, $control ) {
    if (!_$1.isString($value)) {
      return JSON.stringify($value);
    }
    $value = _$1.escape( $value.replace(/\s/g, '') );

   
    if ( Helper.isRgba( $value ) && ! $control.params.alpha ) {
      return Helper.rgbaToRgb( $value );
    }
    if ( $value.match( /^([A-Fa-f0-9]{3}){1,2}$/ ) ) {
      return ("#" + $value);
    }
    var $validity = Validate.color( {}, $value, $setting, $control );

    if ( _$1.keys( $validity ).length ) {
      return null;
    }
    return $value;
  }

  /**
   * @alias core.Sanitize
   * @description  Exposed module <a href="module-Sanitize.html">Sanitize</a>
   * @access package
   */
  var Sanitize = {
    singleChoice: singleChoice$1,
    multipleChoices: multipleChoices$1,
    oneOrMoreChoices: oneOrMoreChoices$1,
    sortable: sortable$1,
    fontFamily: fontFamily$1,
    checkbox: checkbox$1,
    tags: tags$1,
    text: text$1,
    number: number$1,
    sizeUnit: sizeUnit$1,
    slider: slider$1,
    color: color$1,
  };

  /**
   * Control Base Radio class
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class controls.BaseRadio
   *
   * @extends controls.BaseChoices
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   */
  var BaseRadio = (function (BaseChoices$$1) {
    function BaseRadio (id, args) {
      BaseChoices$$1.call(this, id, args);

      this.validate = Validate.singleChoice;
      this.sanitize = Sanitize.singleChoice;
    }

    if ( BaseChoices$$1 ) BaseRadio.__proto__ = BaseChoices$$1;
    BaseRadio.prototype = Object.create( BaseChoices$$1 && BaseChoices$$1.prototype );
    BaseRadio.prototype.constructor = BaseRadio;

    /**
     * @override
     */
    BaseRadio.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      return $value.toString() !== this._getValueFromUI();
    };

    /**
     * @override
     */
    BaseRadio.prototype.componentDidUpdate = function componentDidUpdate ($value) {
      this._updateUI($value);
    };

    /**
     * @override
     */
    BaseRadio.prototype.componentDidMount = function componentDidMount () {
      this.__inputs = this._container.getElementsByTagName('input');
      this._updateUI(this.setting(), true);
    };

    /**
     * Sync radios and maybe bind change event
     *
     * @since   1.0.0
     * @memberof! controls.BaseRadio#
     *
     * @param {mixed}   $value
     * @param {boolean} bind
     */
    BaseRadio.prototype._updateUI = function _updateUI ($value, bind) {
      var this$1 = this;

      for (var i = 0, l = this.__inputs.length; i < l; i++) {
        var input = this$1.__inputs[i];
        input.checked = $value === input.value;
        if (bind) {
          input.onchange = function (event) {
            this$1.setting.set(event.target.value);
          };
        }
      }
    };

    /**
     * Get value from UI
     *
     * @since   1.1.0
     * @memberof! controls.BaseRadio#
     *
     * @return {?string}
     */
    BaseRadio.prototype._getValueFromUI = function _getValueFromUI () {
      var this$1 = this;

      for (var i = 0, l = this.__inputs.length; i < l; i++) {
        if (this$1.__inputs[i].checked) {
          return this$1.__inputs[i].value;
        }
      }
      return null;
    };

    return BaseRadio;
  }(BaseChoices));

  /**
   * Control Base Set class
   *
   * Unlike its PHP respective class KKcp_Customize_Control_Base_Set this does not
   * extends the BaseChoices class because we don't actually share anything with
   * it. In fact the data `min`, `max`, `choices` come from PHP anyway and the
   * population of the valid choices uses a different approach here.
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class BaseSet
   *
   * @extends controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   */
  var BaseSet = (function (Base) {
    function BaseSet (id, args) {
      Base.call(this, id, args);

      this.validate = Validate.oneOrMoreChoices;
      this.sanitize = Sanitize.oneOrMoreChoices;

    }

    if ( Base ) BaseSet.__proto__ = Base;
    BaseSet.prototype = Object.create( Base && Base.prototype );
    BaseSet.prototype.constructor = BaseSet;

    /**
     * @see KKcp_Customize_Control_Base_Set->populate_valid_choices where we do
     * kind of the same extraction but a bit differently because we don't need
     * to extract data for the `<select>Select</select>` field too, and also
     * because in php arrays are just arrays.
     *
     * @override
     */
    BaseSet.prototype.componentInit = function componentInit () {
      var filteredSets = this._getFilteredSets(this.params.choices);
      var data = this._getSelectDataFromSets(filteredSets);
      this._options = data._options;
      this._groups = data._groups;
      this._validChoices = data._validChoices;
      // console.log(this._validChoices);
    };

    /**
     * @override
     */
    BaseSet.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      if (_$1.isString($value)) {
        $value = [$value];
      }
      return !_$1.isEqual(value, this._getValueFromUI());
    };

    /**
     * @override
     */
    BaseSet.prototype.componentDidUpdate = function componentDidUpdate ($value) {
      this._updateUI($value);
    };

    /**
     * @override
     */
    BaseSet.prototype.componentWillUnmount = function componentWillUnmount () {
      if (this.__input  && this.__input.selectize) {
        this.__input.selectize.destroy();
      }
    };

    /**
     * @override
     */
    BaseSet.prototype.componentDidMount = function componentDidMount () {
      this.__input = this._container.getElementsByClassName('kkcp-select')[0];
      this._initUI();
      this._updateUI(this.setting());
    };

    /**
     * Get set from constants
     *
     * It uses the `setVar` added in `base-set.php` control class
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     *
     * @param  {string} name
     * @return {Object}
     */
    BaseSet.prototype._getSet = function _getSet (name) {
      return api$1.constants[this.params.setVar][name];
    };

    /**
     * Get flatten set values (bypass the subdivision in groups)
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     * @static
     *
     * @param  {Object} set
     * @return {Array}
     */
    BaseSet.prototype._getFlattenSetValues = function _getFlattenSetValues (set) {
      return _$1.flatten(_$1.pluck(set, 'values'));
    };

    /**
     * Get filtered sets
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     *
     * @param  {mixed}  choices
     * @return {Object}
     */
    BaseSet.prototype._getFilteredSets = function _getFilteredSets (choices) {
      var this$1 = this;

      var ref = this.params;
      var supportedSets = ref.supportedSets;
      var filteredSets = {};

      for (var i = 0; i < supportedSets.length; i++) {
        var setName = supportedSets[i];
        filteredSets[setName] = this$1._getFilteredSet(setName, choices);
      }
      return filteredSets;
    };

    /**
     * Get filtered set
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     *
     * @param  {string} name
     * @param  {?string|Array|Object} filter
     * @return {Object}
     */
    BaseSet.prototype._getFilteredSet = function _getFilteredSet (name, filter) {
      var this$1 = this;

      var set = this._getSet(name);
      var filteredSet = {};

      // choices filter is a single set name
      if (_$1.isString(filter) && name === filter) {
        filteredSet = set;
      }
      // choices filter is an array of set names
      else if (_$1.isArray(filter) && filter.indexOf(name) !== -1) {
        filteredSet = set;
      }
      // choices filter is a more complex filter that filters per set
      else if (!_$1.isUndefined(filter)) {
        for (var filterGroupKey in filter) {
          if (filter.hasOwnProperty(filterGroupKey)) {
            var filterGroups = filter[filterGroupKey];

            // whitelist based on a filter string
            if (_$1.isString(filterGroups)) {
              // whitelist simply a group by its name
              if (set[filterGroups]) {
                filteredSet[filterGroups] = set[filterGroups];
              } else {
                // whitelist with a quickChoices filter, which filter by values
                // on all the set groups regardless of the set group names.
                var quickChoices = filterGroups.split(',');
                if (quickChoices.length) {
                  filteredSet = _$1.intersection(this$1._getFlattenSetValues(set), quickChoices);
                  // we can break here, indeed, this is a quick filter...
                  break;
                }
              }
            }
            // whitelist multiple groups of a set
            else if (_$1.isArray(filterGroups)) {
              filteredSet = _$1.pick(set, filterGroups);
            }
            // whitelist specific values per each group of the set
            else if (!_$1.isUndefined(filterGroups)) {
              for (var filterGroupKey$1 in filterGroups) {
                if (filterGroups.hasOwnProperty(filterGroupKey$1)) {
                  filteredSet[filterGroupKey$1] = _$1.intersection(set[filterGroupKey$1]['values'], filterGroups[filterGroupKey$1]);
                }
              }
            }
          }
        }
      // choices filter is not present, just use all the set
      } else {
        filteredSet = set;
      }

      return filteredSet;
    };

    /**
     * Get select data for this control from the filtered set
     *
     * Besides the creation of the `options` and `groups` array to populate
     * the `<select>` field we also create the `choices` array. We do this
     * here in order to avoid defining it in each icon php control that would
     * print a lot of duplicated JSON data, since icons sets have usually many
     * entries we just define them globally and then use them as in the other
     * select-like controls on the `params.choices` to provide validation.
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     *
     * @param  {Object<Object>} sets
     * @return {Object<string,Array<string>,string,Array<string>,string,Array<string>>}
     */
    BaseSet.prototype._getSelectDataFromSets = function _getSelectDataFromSets (sets) {
      var options = [];
      var groups = [];
      var validChoices = [];

      for (var setName in sets) {
        if (sets.hasOwnProperty(setName)) {
          var set = sets[setName];

          // set can be a flat array ... (e.g. when is filtered by a quickChoices)
          if (_$1.isArray(set)) {
            for (var i = 0; i < set.length; i++) {
              var value = set[i];

              options.push({
                value: value,
                set: setName,
              });

              validChoices.push(value);
            }
          // set can be an object, and here we divide the select data in groups
          } else {
            for (var groupId in set) {
              if (set.hasOwnProperty(groupId)) {
                var group = set[groupId];
                groups.push({
                  value: groupId,
                  label: group['label']
                });
                var values = group['values'];
                for (var i$1 = 0; i$1 < values.length; i$1++) {
                  options.push({
                    value: values[i$1],
                    group: groupId,
                    set: setName,
                  });
                  validChoices.push(values[i$1]);
                }
              }
            }
          }
        }
      }

      return {
        _options: options,
        _groups: groups,
        _validChoices: validChoices,
      };
    };

    /**
     * Get select options
     *
     * The select can either have or not have options divided by groups.
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     *
     * @return {Object}
     */
    BaseSet.prototype._getSelectOpts = function _getSelectOpts () {
      var this$1 = this;

      var customOpts = this._getSelectCustomOpts();

      var defaultOpts = {
        plugins: ['drag_drop','remove_button'],
        maxItems: this.params.max,
        options: this._options,
        valueField: 'value',
        sortField: 'value',
        searchField: ['value'],
        render: {
          item: this._renderItem.bind(this),
          option: this._renderOption.bind(this)
        },
        onChange: function (value) {
          this$1.setting.set(value);
        }
      };

      if (this._groups.length) {
        defaultOpts['optgroups'] = this._groups;
        defaultOpts['optgroupField'] = 'group';
        defaultOpts['optgroupValueField'] = 'value';
        defaultOpts['lockOptgroupOrder'] = true;
        defaultOpts['render']['optgroup_header'] = this._renderGroupHeader.bind(this);
      }

      return _$1.extend(defaultOpts, customOpts)
    };

    /**
     * Get select custom options (subclasses can implement this)
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     * @abstract
     *
     * @return {Object}
     */
    BaseSet.prototype._getSelectCustomOpts = function _getSelectCustomOpts () {
      return {};
    };

    /**
     * Init UI
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     */
    BaseSet.prototype._initUI = function _initUI () {
      if (this.__input.selectize) {
        this.__input.selectize.destroy();
      }

      $(this.__input).selectize(this._getSelectOpts());
    };

    /**
     * Get value from UI
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     *
     * @return {?string|Array}
     */
    BaseSet.prototype._getValueFromUI = function _getValueFromUI () {
      if (!this.__input) {
        return null;
      }
      if (this.__input.selectize) {
        return this.__input.selectize.getValue();
      }
      return null;
    };

    /**
     * Update UI
     *
     * Pass `true` as second argument to perform a `silent` update, that does
     * not trigger the `onChange` event.
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     *
     * @param  {string|Array} value
     */
    BaseSet.prototype._updateUI = function _updateUI (value) {
      if (this.__input.selectize) {
        this.__input.selectize.setValue(value, true);
      } else {
        this._initUI();
        this._updateUI(value);
      }
    };

    /**
     * Select render item function
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     * @abstract
     *
     * @param  {Object} data     The selct option object representation.
     * @return {string}          The option template.
     */
    BaseSet.prototype._renderItem = function _renderItem (data) {};

    /**
     * Select render option function
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     * @abstract
     *
     * @param  {Object} data     The selct option object representation.
     * @return {string}          The option template.
     */
    BaseSet.prototype._renderOption = function _renderOption (data) {};

    /**
     * Select render option function
     *
     * @since   1.0.0
     * @memberof! controls.BaseSet#
     * @abstract
     *
     * @param  {Object} data     The select option object representation.
     * @return {string}          The option template.
     */
    BaseSet.prototype._renderGroupHeader = function _renderGroupHeader (data) {};

    return BaseSet;
  }(Base$1));

  /**
   * Control Buttonset
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_buttonset`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Buttonset
   *
   * @extends controls.BaseRadio
   * @augments controls.BaseChoices
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Buttonset = (function (BaseRadio$$1) {
    function Buttonset () {
      BaseRadio$$1.apply(this, arguments);
    }

    if ( BaseRadio$$1 ) Buttonset.__proto__ = BaseRadio$$1;
    Buttonset.prototype = Object.create( BaseRadio$$1 && BaseRadio$$1.prototype );
    Buttonset.prototype.constructor = Buttonset;

    Buttonset.prototype._tplChoiceUi = function _tplChoiceUi () {
      return "\n      <input id=\"{{ id }}\" type=\"radio\" value=\"{{ val }}\" name=\"_customize-kkcp_buttonset-{{ data.id }}\">\n      <label class=\"{{ classes }} kkcpui-tooltip--top\" {{ attributes }} title=\"{{ tooltip }}\" for=\"{{ id }}\" onclick=\"\">{{ label }}</label>\n    "
    };

    /**
     * @since 1.1.0
     * @override
     */
    Buttonset.prototype._tplAboveChoices = function _tplAboveChoices () {
      return "\n      <div class=\"switch-toggle kkcpui-switch switch-{{ _.size(choices) }}\">\n    "
    };

    /**
     * @since 1.1.0
     * @override
     */
    Buttonset.prototype._tplBelowChoices = function _tplBelowChoices () {
      return "\n      <a></a>\n      </div>\n    "
    };

    return Buttonset;
  }(BaseRadio));

  wpApi.controlConstructor['kkcp_buttonset'] = api$1.controls.Buttonset = Buttonset;

  /**
   * Control Checkbox
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_checkbox`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Checkbox
   *
   * @extends controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   */
  var Checkbox = (function (Base) {
    function Checkbox (id, args) {
      Base.call(this, id, args);

      this.validate = Validate.checkbox;
      this.sanitize = Sanitize.checkbox;
    }

    if ( Base ) Checkbox.__proto__ = Base;
    Checkbox.prototype = Object.create( Base && Base.prototype );
    Checkbox.prototype.constructor = Checkbox;

    /**
     * We need this to fix situations like: `'1' === 1` returning false.
     *
     * @override
     */
    Checkbox.prototype.softenize = function softenize ($value) {
      return ($value === 0 || $value === 1) ? $value.toString() : $value;
    };

    /**
     * @override
     */
    Checkbox.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      var $uiValue = numberToBoolean(this.__input.checked);

      return this.softenize($uiValue) !== this.softenize($value);
    };

    /**
     * @override
     */
    Checkbox.prototype.componentDidUpdate = function componentDidUpdate ($value) {
      this.__input.checked = numberToBoolean($value);
    };

    /**
     * @override
     */
    Checkbox.prototype.componentDidMount = function componentDidMount () {
      var this$1 = this;

      this.__input = this._container.getElementsByTagName('input')[0];

      this.__input.checked = numberToBoolean(this.setting());

      this.__input.onchange = function (event) {
        event.preventDefault();
        var value = event.target.checked ? 1 : 0;
        this$1.setting.set(value);
      };
    };

    /**
     * @override
     */
    Checkbox.prototype._tpl = function _tpl () {
      return ("\n      " + (this._tplHeader()) + "\n      <label>\n        <input type=\"checkbox\" name=\"_customize-kkcp_checkbox-{{ data.id }}\" value=\"\" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}=\"{{ a[key] }}\" <# } } #>>\n        <# if (data.attrs && data.attrs.label) { #>{{{ data.attrs.label }}}<# } #>\n      </label>\n    ")
    };

    return Checkbox;
  }(Base$1));

  var Checkbox$1 = wpApi.controlConstructor['kkcp_checkbox'] = api$1.controls.Checkbox = Checkbox;

  /* global tinycolor */

  /**
   * Control Color class
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_color`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Color
   *
   * @extends controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   * @requires tinycolor
   *
   * @requires Validate
   * @requires Sanitize
   */
  var Color = (function (Base) {
    function Color (id, args) {
      Base.call(this, id, args);

      this.validate = Validate.color;
      this.sanitize = Sanitize.color;
    }

    if ( Base ) Color.__proto__ = Base;
    Color.prototype = Object.create( Base && Base.prototype );
    Color.prototype.constructor = Color;

    /**
     * Use tinycolor (included in spectrum.js) to always convert colors to the
     * same format, so to have the same output result when the input is `red` or
     * `#f00` or `#ff0000` or `rgba(255, 0, 0, 1)`. If it is not an actual color
     * but an expression or a variable tinycolor won't recognize a `_format`
     * (such as hex, name, rgba, etc..), we rely on this do decide what to return
     *
     * @override
     * @requires tinycolor.toRgbString
     */
    Color.prototype.softenize = function softenize ($value) {
      var anyColor = tinycolor($value);

      if (!anyColor['_format']) { // whitelisted from uglify \\
        return $value;
      } else {
        return anyColor.toRgbString();
      }
    };

    /**
     * @override
     */
    Color.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      return this.softenize(this._getValueFromUi()) !== this.softenize($value);
    };

    /**
     * @override
     */
    Color.prototype.componentDidUpdate = function componentDidUpdate ($value) {
      this._updateUI($value);
    };

    /**
     * @override
     */
    Color.prototype.componentWillUnmount = function componentWillUnmount () {
      if (this.__$picker) {
        this.__$picker.spectrum('destroy');
      }
    };

    /**
     * @override
     */
    Color.prototype.componentDidMount = function componentDidMount () {
      var this$1 = this;

      var container = this._container;
      var btnCustom = container.getElementsByClassName('kkcpui-toggle')[0];

      this.__preview = container.getElementsByClassName('kkcpcolor-current-overlay')[0];
      this.__$picker = $$1(container.getElementsByClassName('kkcpcolor-input')[0]);
      this.__$expander = $$1(container.getElementsByClassName('kkcp-expander')[0]).hide();

      this._updateUI(this.setting());

      var isOpen = false;
      var pickerIsInitialized = false;

      var _maybeInitializeSpectrum = function () {
        // initialize only once
        if (!pickerIsInitialized) {
          this$1.__$picker.spectrum(this$1._getSpectrumOpts());
          pickerIsInitialized = true;
        }
      };

      btnCustom.onmouseover = _maybeInitializeSpectrum;

      btnCustom.onclick = function () {
        isOpen = !isOpen;
        _maybeInitializeSpectrum();

        // and toggle
        if (isOpen) {
          this$1.__$expander.slideDown();
        } else {
          this$1.__$expander.slideUp();
        }
        return false;
      };
    };

    /**
     * Get Spectrum plugin options
     *
     * {@link https://bgrins.github.io/spectrum/ spectrum API}
     *
     * @since   1.0.0
     * @memberof! controls.Color#
     * @access protected
     *
     * @param  {?object} options Options that override the defaults (optional)
     * @return {object} The spectrum plugin options
     */
    Color.prototype._getSpectrumOpts = function _getSpectrumOpts (options) {
      var this$1 = this;

      var params = this.params;
      var $container = this.container;

      return _$1.extend({
        preferredFormat: 'hex',
        flat: true,
        showInput: true,
        showInitial: false,
        showButtons: false,
        // localStorageKey: 'kkcp_spectrum',
        showSelectionPalette: false,
        togglePaletteMoreText: api$1.l10n['togglePaletteMoreText'],
        togglePaletteLessText: api$1.l10n['togglePaletteLessText'],
        allowEmpty: !!params.transparent,
        showAlpha: !!params.alpha,
        showPalette: !!params.palette,
        showPaletteOnly: !!params.palette && (params.picker === 'hidden' || !params.picker),
        togglePaletteOnly: !!params.palette && (params.picker === 'hidden' || params.picker),
        palette: params.palette,
        color: this.setting(),
        show: function () {
          $container.find('.sp-input').focus();
        },
        move: function (tinycolor) {
          var color$$1 = tinycolor ? tinycolor.toString() : 'transparent';
          this$1.setting.set(color$$1);
        },
        change: function (tinycolor) {
          var color$$1 = tinycolor ? tinycolor.toString() : 'transparent';
          this$1.setting.set(color$$1);
          if (!tinycolor) {
            $container.find('.sp-input').val('transparent');
          }
        }
      }, options || {});
    };

    /**
     * Get value from UI
     *
     * @since   1.1.0
     * @memberof! controls.Color#
     *
     * @access protected
     * @return {string}
     */
    Color.prototype._getValueFromUi = function _getValueFromUi () {
      return this.__preview.style.background;
    };

    /**
     * Update UI
     *
     * @since   1.1.0
     * @memberof! controls.Color#
     *
     * @access protected
     * @param  {string} $value
     */
    Color.prototype._updateUI = function _updateUI ($value) {
      this.__preview.style.background = $value;

      if (this.__$picker && this.__$picker.spectrum) {
        this.__$picker.spectrum('set', $value);
      }
    };

    /**
     * @override
     */
    Color.prototype._tpl = function _tpl () {
      return ("\n      " + (this._tplHeader()) + "\n      <span class=\"kkcpcolor-current kkcpcolor-current-bg\"></span>\n      <span class=\"kkcpcolor-current kkcpcolor-current-overlay\"></span>\n      <button class=\"kkcpui-toggle kkcpcolor-toggle\">" + (this._l10n('selectColor')) + "</button>\n      <div class=\"kkcp-expander\">\n        <input class=\"kkcpcolor-input\" type=\"text\">\n      </div>\n    ")
    };

    return Color;
  }(Base$1));

  wpApi.controlConstructor['kkcp_color'] = api$1.controls.Color = Color;

  /**
   * Control Content class
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_content`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Content
   *
   * @extends controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Content = (function (Base) {
    function Content () {
      Base.apply(this, arguments);
    }

    if ( Base ) Content.__proto__ = Base;
    Content.prototype = Object.create( Base && Base.prototype );
    Content.prototype.constructor = Content;

    Content.prototype.template = function template () {
      return "\n      <# if (data.alert) { #><div class=\"kkcpui-alert {{ data.alert }}\"><# } #>\n        <# if (data.label) { #><span class=\"customize-control-title\"><# if (marked) { #>{{{ marked(data.label) }}}<# } else { #>{{{ data.label }}}<# } #></span><# } #>\n        <# if (data.description) { #><span<# if (!data.alert) { #> class=\"description customize-control-description\"<# } #>><# if (marked) { #>{{{ marked(data.description) }}}<# } else { #>{{{ data.description }}}<# } #></span><# } #>\n        <# if (marked && data.markdown) { #><div class=\"description kkcp-markdown\">{{{ marked(data.markdown) }}}</div><# } #>\n      <# if (data.alert) { #></div><# } #>\n    "
    };

    return Content;
  }(Base$1));

  wpApi.controlConstructor['kkcp_content'] = api$1.controls.Content = Content;

  /**
   * Font Family Control
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_font_family`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class FontFamily
   *
   * @extends controls.BaseSet
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   * @requires Helper
   */
  var FontFamily = (function (BaseSet$$1) {
    function FontFamily (id, args) {
      BaseSet$$1.call(this, id, args);

      this.validate = Validate.fontFamily;
      this.sanitize = Sanitize.fontFamily;
    }

    if ( BaseSet$$1 ) FontFamily.__proto__ = BaseSet$$1;
    FontFamily.prototype = Object.create( BaseSet$$1 && BaseSet$$1.prototype );
    FontFamily.prototype.constructor = FontFamily;

    /**
     * Always quote all font families
     *
     * @override
     */
    FontFamily.prototype.componentInit = function componentInit () {
      BaseSet$$1.prototype.componentInit.call(this);

      this._options = _$1.map(this._options, function (option) {
        option.value = Helper.normalizeFontFamily(option.value);
        return option;
      });
      this._validChoices = _$1.map(this._validChoices, function (value) { return Helper.normalizeFontFamily(value); });
    };

    /**
     * @override
     */
    FontFamily.prototype.softenize = function softenize ($value) {
      if (_$1.isArray($value)) {
        $value = $value.join(',');
      }
      return $value;
    };

    /**
     * @override
     */
    FontFamily.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      return !_$1.isEqual(this.softenize($value), this.__input.selectize.getValue());
    };

    /**
     * @override
     */
    FontFamily.prototype.componentDidUpdate = function componentDidUpdate ($value) {
      this._updateUI($value);
    };

    /**
     * @override
     */
    FontFamily.prototype.componentDidMount = function componentDidMount () {
      this.__input = this._container.getElementsByClassName('kkcp-select')[0];
      this._updateUI(this.setting());
    };

    /**
     * @override
     */
    FontFamily.prototype._updateUI = function _updateUI (value) {
      // this is due to a bug, we should use:
      // this.__input.selectize.setValue(value, true);
      // @see https://github.com/brianreavis/selectize.js/issues/568
      // instead here first we have to destroy thene to reinitialize, this
      // happens only through a programmatic change such as a reset action
      if (this.__input.selectize) {
        this.__input.selectize.destroy();
      }

      this.__input.value = value;

      // init select plugin
      $$1(this.__input).selectize(this._getSelectOpts());
    };

    /**
     * @override
     */
    FontFamily.prototype._getSelectCustomOpts = function _getSelectCustomOpts () {
      return {
        hideSelected: true,
        delimiter: ',',
      }
    };

    /**
     * @override
     */
    FontFamily.prototype._renderItem = function _renderItem (data) {
      var label = data.value.replace(/'/g, '').replace(/"/g, '');
      var value = _$1.escape(data.value);
      return ("<div style=\"font-family:" + value + "\">" + (_$1.escape(label)) + "</div>");
    };

    /**
     * @override
     */
    FontFamily.prototype._renderOption = function _renderOption (data) {
      var label = data.value.replace(/'/g, '').replace(/"/g, '');
      var value = _$1.escape(data.value);
      return ("<div style=\"font-family:" + value + "\">" + (_$1.escape(label)) + "</div>");
    };

    /**
     * @override
     */
    FontFamily.prototype._renderGroupHeader = function _renderGroupHeader (data) {
      return ("<div class=\"kkcp-icon-selectHeader\">" + (_$1.escape(data.label)) + "</div>");
    };

    /**
     * @override
     */
    FontFamily.prototype._tpl = function _tpl () {
      return ("\n      <label>\n        " + (this._tplHeader()) + "\n      </label>\n      <input class=\"kkcp-select\" type=\"text\">\n    ");
    };

    return FontFamily;
  }(BaseSet));

  wpApi.controlConstructor['kkcp_font_family'] = api$1.controls.FontFamily = FontFamily;

  /**
   * Control Icon
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_icon`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Icon
   *
   * @extends controls.BaseSet
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Icon = (function (BaseSet$$1) {
    function Icon () {
      BaseSet$$1.apply(this, arguments);
    }

    if ( BaseSet$$1 ) Icon.__proto__ = BaseSet$$1;
    Icon.prototype = Object.create( BaseSet$$1 && BaseSet$$1.prototype );
    Icon.prototype.constructor = Icon;

    Icon.prototype._renderItem = function _renderItem (data) {
      return ("<div class=\"kkcp-icon-selectItem kkcpui-tooltip--top\" title=\"" + (_$1.escape(data.value)) + "\">\n        <i class=\"" + (_$1.escape(this._getIconClassName(data))) + "\"></i>\n      </div>");
    };

    /**
     * @override
     */
    Icon.prototype._renderOption = function _renderOption (data) {
      return ("<div class=\"kkcp-icon-selectOption kkcpui-tooltip--top\" title=\"" + (_$1.escape(data.value)) + "\">\n        <i class=\"" + (_$1.escape(this._getIconClassName(data))) + "\"></i>\n      </div>");
    };

    /**
     * @override
     */
    Icon.prototype._renderGroupHeader = function _renderGroupHeader (data) {
      return ("<div class=\"kkcp-icon-selectHeader\">" + (_$1.escape(data.label)) + "</div>");
    };

    /**
     * Get option icon class name
     *
     * @since   1.0.0
     * @memberof! controls.Icon#
     * @access protected
     *
     * @param  {Object} data The single option data
     * @return {string}
     */
    Icon.prototype._getIconClassName = function _getIconClassName (data) {
      return ((data.set) + " " + (data.set) + "-" + (data.value));
    };

    /**
     * @override
     */
    Icon.prototype._tpl = function _tpl () {
      return ("\n      <label>" + (this._tplHeader()) + "</label>\n      <select class=\"kkcp-select\" placeholder=\"" + (this._l10n['iconSearchPlaceholder']) + "\"<# if (data.max > 1) { #>  name=\"icon[]\" multiple<# } else { #>name=\"icon\"<# } #>>\n        <option value=\"\">" + (this._l10n['iconSearchPlaceholder']) + "</option>\n      </select>\n    ")
    };

    return Icon;
  }(BaseSet));

  wpApi.controlConstructor['kkcp_icon'] = api$1.controls.Icon = Icon;

  /**
   * @fileOverview A simple logger utility.
   *
   * @module Logger
   */

  /**
   * Log error
   *
   * @param  {string} context
   * @param  {string} msg
   * @return {void}
   */
  function logError (context, msg) {
    console.error(context, msg);
  }

  /**
   * Control Sortable
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_sortable`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Sortable
   *
   * @extends controls.BaseChoices
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   */
  var Sortable = (function (BaseChoices$$1) {
    function Sortable (id, args) {
      BaseChoices$$1.call(this, id, args);

      this.validate = Validate.sortable;
      this.sanitize = Sanitize.sortable;
    }

    if ( BaseChoices$$1 ) Sortable.__proto__ = BaseChoices$$1;
    Sortable.prototype = Object.create( BaseChoices$$1 && BaseChoices$$1.prototype );
    Sortable.prototype.constructor = Sortable;

    /**
     * @override
     */
    Sortable.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      return !_$1.isEqual($value, this._getValueFromUI());
    };

    /**
     * @override
     */
    Sortable.prototype.componentDidUpdate = function componentDidUpdate ($value) {
      this._updateUI($value);
    };

    /**
     * @override
     */
    Sortable.prototype.componentDidMount = function componentDidMount () {
      var this$1 = this;

      this._buildItemsMap();

      this.container.sortable({
        items: '.kkcp-sortable',
        cursor: 'move',
        update: function () {
          var value = this$1._getValueFromUI();
          this$1.setting.set(value);
        }
      });
    };

    /**
     * Build items map
     *
     * It creates a sortable items map, a key (grabbed from the `data-value`
     * attribute) with the corresponding DOM element
     *
     * @since   1.0.0
     * @memberof! controls.Sortable#
     * @access protected
     */
    Sortable.prototype._buildItemsMap = function _buildItemsMap () {
      var this$1 = this;

      var items = this._container.getElementsByClassName('kkcp-sortable');
      this.__itemsMap = {};

      for (var i = 0, l = items.length; i < l; i++) {
        var itemKey = items[i].getAttribute('data-value');
        this$1.__itemsMap[itemKey] = {
          _sortable: items[i]
        };
      }
    };

    /**
     * Get value from UI
     *
     * @since   1.1.0
     * @memberof! controls.Sortable#
     * @access protected
     *
     * @return {Array}
     */
    Sortable.prototype._getValueFromUI = function _getValueFromUI () {
      return this.container.sortable('toArray', { attribute: 'data-value' });
    };

    /**
     * Update UI
     *
     * Manually reorder the sortable list, needed when a programmatic change
     * is triggered. Unfortunately jQuery UI sortable does not have a method
     * to keep in sync the order of an array and its corresponding DOM.
     *
     * @since   1.0.0
     * @memberof! controls.Sortable#
     * @access protected
     *
     * @param {mixed} $value
     */
    Sortable.prototype._updateUI = function _updateUI ($value) {
      var this$1 = this;

      var value = this.setting();

      if (!_$1.isArray($value)) {
        return logError('controls.Sortable->_updateUI', "setting.value must be an array");
      }

      for (var i = 0, l = $value.length; i < l; i++) {
        var itemValueAsKey = $value[i];
        var item = this$1.__itemsMap[itemValueAsKey];
        if (item) {
          var itemSortableDOM = item._sortable;
          itemSortableDOM.parentNode.removeChild(itemSortableDOM);
          this$1._container.appendChild(itemSortableDOM);
        } else {
          logError('controls.Sortable->_updateUI', ("item '" + itemValueAsKey + "' has no '_sortable' DOM in 'this.__itemsMap'"));
        }
      }

      this.container.sortable('refresh');
    };

    /**
     * @override
     */
    Sortable.prototype._tplChoicesLoop = function _tplChoicesLoop () {
      return ("\n      <# if (_.isArray(data.choicesOrdered)) { for (var i = 0; i < data.choicesOrdered.length; i++) {\n        var val = data.choicesOrdered[i]; #>\n        " + (this._tplChoice()) + "\n      <# } } #>\n    ");
    };

    /**
     * @override
     */
    Sortable.prototype._tplChoiceUi = function _tplChoiceUi () {
      return "<div class=\"kkcp-sortable\" title=\"{{ val }}\" data-value=\"{{ val }}\" class=\"{{ classes }}\" {{ attributes }}>{{ label }}</div>";
    };

    return Sortable;
  }(BaseChoices));

  var Sortable$1 = wpApi.controlConstructor['kkcp_sortable'] = api$1.controls.Sortable = Sortable;

  /**
   * Control Multicheck
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_multicheck`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Multicheck
   *
   * @extends controls.BaseChoices
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   */
  var Multicheck = (function (BaseChoices$$1) {
    function Multicheck (id, args) {
      BaseChoices$$1.call(this, id, args);

      this.validate = Validate.multipleChoices;
      this.sanitize = Sanitize.multipleChoices;
    }

    if ( BaseChoices$$1 ) Multicheck.__proto__ = BaseChoices$$1;
    Multicheck.prototype = Object.create( BaseChoices$$1 && BaseChoices$$1.prototype );
    Multicheck.prototype.constructor = Multicheck;

    /**
     * @override
     */
    Multicheck.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      return !_$1.isEqual($value, this._getValueFromUI());
    };

    /**
     * @override
     */
    Multicheck.prototype.componentDidUpdate = function componentDidUpdate ($value) {
      this._updateUIcheckboxes($value);

      if (this.params.sortable) {
        this._updateUIreorder($value);
      }
    };

    /**
     * @override
     */
    Multicheck.prototype.componentDidMount = function componentDidMount () {
      var this$1 = this;

      this.__inputs = this._container.getElementsByTagName('input');

      // special stuff for sortable multicheck controls
      if (this.params.sortable) {
        this.container.sortable({
          items: '> label',
          cursor: 'move',
          update: function () {
            this$1.setting.set(this$1._getValueFromUI());
          }
        });

        this._buildItemsMap();
      }

      // sync checked state on checkboxes and bind (argument `true`)
      this._updateUIcheckboxes(this.setting(), true);
    };

    /**
     * Build items map
     *
     * @since   1.0.0
     * @memberof! controls.Multicheck#
     * @access protected
     */
    Multicheck.prototype._buildItemsMap = function _buildItemsMap () {
      var this$1 = this;

      var items = this._container.getElementsByTagName('label');
      this.__itemsMap = {};

      for (var i = 0, l = items.length; i < l; i++) {
        this$1.__itemsMap[items[i].title] = {
          _sortable: items[i],
          _input: items[i].getElementsByTagName('input')[0]
        };
      }
    };

    /**
     * Get sorted value, reading checkboxes status from the DOM
     *
     * @since   1.0.0
     * @memberof! controls.Multicheck#
     * @access protected
     *
     * @return {Array}
     */
    Multicheck.prototype._getValueFromUI = function _getValueFromUI () {
      var this$1 = this;

      var valueSorted = [];

      for (var i = 0, l = this.__inputs.length; i < l; i++) {
        var input = this$1.__inputs[i];
        if (input.checked) {
          valueSorted.push(input.value);
        }
      }
      return valueSorted;
    };

    /**
     * @override
     */
    Multicheck.prototype._updateUIreorder = function _updateUIreorder ($value) {
      var this$1 = this;

      // sort first the checked ones
      Sortable$1.prototype._updateUI.apply(this);

      // then sort the unchecked ones
      for (var itemValueAsKey in this$1.params.choices) {
        var item = this$1.__itemsMap[itemValueAsKey];

        if (item) {
          if ($value.indexOf(itemValueAsKey) === -1) {
            var itemSortableDOM = item._sortable;
            itemSortableDOM.parentNode.removeChild(itemSortableDOM);
            this$1._container.appendChild(itemSortableDOM);
          }
        } else {
          logError('controls.Multicheck->_reorder', ("item '" + itemValueAsKey + "' has no '_sortable' DOM in 'this.__itemsMap'"));
        }
      }
    };

    /**
     * Update UI checkboxes and maybe bind change event
     *
     * @since   1.0.0
     * @memberof! controls.Multicheck#
     * @access protected
     *
     * @param  {mixed}   $value
     * @param  {boolean} bind
     */
    Multicheck.prototype._updateUIcheckboxes = function _updateUIcheckboxes ($value, bind) {
      var this$1 = this;

      if (!_$1.isArray($value)) {
        return logError('controls.Multicheck->_updateUIcheckboxes', "setting.value must be an array");
      }

      for (var i = 0, l = this.__inputs.length; i < l; i++) {
        var input = this$1.__inputs[i];
        input.checked = $value.indexOf(input.value) !== -1;
        if (bind) {
          input.onchange = function () {
            this$1.setting.set(this$1._getValueFromUI());
          };
        }
      }
    };

    /**
     * If the control is sortable we first show the ordered choices (the ones
     * stored as value in the DB, gathered with `$this->value()`) and then the
     * other choices, that's why the double loop with the `indexOf` condition.
     *
     * @override
     */
    Multicheck.prototype._tplChoicesLoop = function _tplChoicesLoop () {
      var tplChoice = this._tplChoice();

      return ("\n      <# if (data.sortable) {\n        if (_.isArray(data.choicesOrdered)) {\n          for (var i = 0; i < data.choicesOrdered.length; i++) {\n            var val = data.choicesOrdered[i]; #>\n            " + tplChoice + "\n          <# }\n          for (var val in choices) {\n            if (data.choicesOrdered.indexOf(val) === -1) { #>\n              " + tplChoice + "\n            <# }\n          }\n        }\n      } else {\n        for (var val in choices) { #>\n          " + tplChoice + "\n        <# }\n      } #>\n    ")
    };

    /**
     * @override
     */
    Multicheck.prototype._tplChoiceUi = function _tplChoiceUi () {
      return "\n      <label class=\"{{ classes }}\" {{ attributes }}>\n        <input type=\"checkbox\" name=\"_customize-kkcp_multicheck-{{ data.id }}\" value=\"{{ val }}\">{{{ label }}}\n      </label>\n    "
    };

    return Multicheck;
  }(BaseChoices));

  wpApi.controlConstructor['kkcp_multicheck'] = api$1.controls.Multicheck = Multicheck;

  /**
   * Control Number
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_number`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Number
   *
   * @extends controls.BaseInput
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   */
  var Number$1 = (function (BaseInput$$1) {
    function Number (id, args) {
      BaseInput$$1.call(this, id, args);

      this.validate = Validate.number;
      this.sanitize = Sanitize.number;
    }

    if ( BaseInput$$1 ) Number.__proto__ = BaseInput$$1;
    Number.prototype = Object.create( BaseInput$$1 && BaseInput$$1.prototype );
    Number.prototype.constructor = Number;

    /**
     * We just neet to convert the value to string for the check, for the rest
     * is the same as in the base input control
     *
     * @override
     */
    Number.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      return this.__input.value !== $value.toString();
    };

    return Number;
  }(BaseInput));

  wpApi.controlConstructor['kkcp_number'] = api$1.controls.Number = Number$1;

  /**
   * Control Text class
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_text`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Text
   *
   * @extends controls.BaseInput
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   */
  var Text = (function (BaseInput$$1) {
    function Text (id, args) {
      BaseInput$$1.call(this, id, args);

      this.validate = Validate.text;
      this.sanitize = Sanitize.text;
    }

    if ( BaseInput$$1 ) Text.__proto__ = BaseInput$$1;
    Text.prototype = Object.create( BaseInput$$1 && BaseInput$$1.prototype );
    Text.prototype.constructor = Text;

    return Text;
  }(BaseInput));

  var Text$1 = wpApi.controlConstructor['kkcp_text'] = api$1.controls.Text = Text;

  /**
   * Control Password class
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_password`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Password
   *
   * @extends controls.Text
   * @augments controls.BaseInput
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   */
  var Password = (function (Text) {
    function Password () {
      Text.apply(this, arguments);
    }

    if ( Text ) Password.__proto__ = Text;
    Password.prototype = Object.create( Text && Text.prototype );
    Password.prototype.constructor = Password;

    Password.prototype.componentDidUpdate = function componentDidUpdate ($value) {
      this.__input.value = $value;

      if (this.__text) {
        this.__text.value = $value;
      }
    };

    /**
     * @override
     */
    Password.prototype.componentDidMount = function componentDidMount () {
      var self = this;
      var ref = this;
      var setting = ref.setting;
      var ref$1 = this.params || {};
      var attrs = ref$1.attrs;

      self.__input = self._container.getElementsByTagName('input')[0];

      if (attrs['visibility']) {

        self.__text = self._container.getElementsByTagName('input')[1];

        // bind the visibility toggle button
        self.container.find('.kkcp-password__toggle').click(function (event) {
          if (event) {
            event.preventDefault();
          }
          self.__isVisible = !self.__isVisible;
          self._toggleVisibility(self.__isVisible);
        });

        // sync the text preview to the input password
        $(self.__text)
          .val(setting())
          .on('change keyup paste', function () {
            setting.set(this.value);
            self.__input.value = this.value;
          });
      }

      // sync input and listen for changes
      $(self.__input)
        .val(setting())
        .on('change keyup paste', function () {
          setting.set(this.value);
          if (self.__text) {
            self.__text.value = this.value;
          }
        });
    };

    /**
     * Toggle password visiblity
     *
     * @since   1.0.0
     * @memberof! controls.Password#
     * @access protected
     *
     * @param  {boolean} isVisible
     */
    Password.prototype._toggleVisibility = function _toggleVisibility (isVisible) {
      if (isVisible) {
        this.container.addClass('kkcp-password-visible');
        this.__text.focus();
      } else {
        this.container.removeClass('kkcp-password-visible');
        this.__input.focus();
      }
    };

    /**
     * @override
     */
    Password.prototype._tplInner = function _tplInner () {
      var tplInput = this._tplInput();

      return ("\n      <span class=\"kkcp-password\">\n        <# if (data.attrs && data.attrs.visibility) { #>\n          " + tplInput + "\n          <input class=\"kkcp-password__preview\" type=\"text\" tabindex=\"-1\" <# for (var key in attrs) { if (attrs.hasOwnProperty(key) && key !== 'title') { #>{{ key }}=\"{{ attrs[key] }}\" <# } } #>>\n          <button class=\"kkcp-password__toggle\">\n            <span class=\"kkcp-password__hide\" aria-label=\"" + (this._l10n('passwordHide')) + "\"><i class=\"dashicons dashicons-hidden\"></i></span>\n            <span class=\"kkcp-password__show\" aria-label=\"" + (this._l10n('passwordShow')) + "\"><i class=\"dashicons dashicons-visibility\"></i></span>\n          </button>\n        <# } else { #>\n          " + tplInput + "\n        <# } #>\n      </span>\n    ")
    };

    return Password;
  }(Text$1));

  wpApi.controlConstructor['kkcp_password'] = api$1.controls.Password = Password;

  /**
   * Control Radio
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_radio`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Radio
   *
   * @extends controls.BaseRadio
   * @augments controls.BaseChoices
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Radio = (function (BaseRadio$$1) {
    function Radio () {
      BaseRadio$$1.apply(this, arguments);
    }

    if ( BaseRadio$$1 ) Radio.__proto__ = BaseRadio$$1;
    Radio.prototype = Object.create( BaseRadio$$1 && BaseRadio$$1.prototype );
    Radio.prototype.constructor = Radio;

    Radio.prototype._tplChoiceUi = function _tplChoiceUi () {
      return "\n      <label class=\"{{ classes }}\" {{{ attributes }}}>\n        <input type=\"radio\" value=\"{{ val }}\" name=\"_customize-kkcp_radio-{{ data.id }}\">\n        {{ label }}\n        <# if (choice.sublabel) { #><small> ({{ choice.sublabel }})</small><# } #>\n      </label>\n    "
    };

    return Radio;
  }(BaseRadio));

  wpApi.controlConstructor['kkcp_radio'] = api$1.controls.Radio = Radio;

  /**
   * Control Radio Image
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_radio_image`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class RadioImage
   *
   * @extends controls.BaseRadio
   * @augments controls.BaseChoices
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var RadioImage = (function (BaseRadio$$1) {
    function RadioImage () {
      BaseRadio$$1.apply(this, arguments);
    }

    if ( BaseRadio$$1 ) RadioImage.__proto__ = BaseRadio$$1;
    RadioImage.prototype = Object.create( BaseRadio$$1 && BaseRadio$$1.prototype );
    RadioImage.prototype.constructor = RadioImage;

    RadioImage.prototype._tplChoiceUi = function _tplChoiceUi () {
      return ("\n      <input id=\"{{ id }}\" class=\"kkcp-radio-image\" type=\"radio\" value=\"{{ val }}\" name=\"_customize-kkcp_radio_image-{{ data.id }}\">\n      <label for=\"{{ id }}\" class=\"{{ classes }}\" {{ attributes }}>\n        <# var imgUrl = choice.img_custom ? '" + _IMAGES_BASE_URL + "' + choice.img_custom : '" + _CP_URL_IMAGES + "' + choice.img + '.png'; #>\n        <img class=\"kkcpui-tooltip--top\" src=\"{{ imgUrl }}\" title=\"{{ tooltip }}\">\n      </label>\n    ")
    };

    return RadioImage;
  }(BaseRadio));

  wpApi.controlConstructor['kkcp_radio_image'] = api$1.controls.RadioImage = RadioImage;

  /**
   * Control Select class
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_select`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Select
   *
   * @extends controls.BaseChoices
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   */
  var Select = (function (BaseChoices$$1) {
    function Select (id, args) {
      BaseChoices$$1.call(this, id, args);

      this.validate = Validate.oneOrMoreChoices;
      this.sanitize = Sanitize.oneOrMoreChoices;
    }

    if ( BaseChoices$$1 ) Select.__proto__ = BaseChoices$$1;
    Select.prototype = Object.create( BaseChoices$$1 && BaseChoices$$1.prototype );
    Select.prototype.constructor = Select;

    /**
     * @override
     */
    Select.prototype.componentWillUnmount = function componentWillUnmount () {
      if (this.__select.selectize) {
        this.__select.selectize.destroy();
      }
    };

    /**
     * We do a comparison with two equals `==` because sometimes we want to
     * compare `500` to `'500'` (like in the font-weight dropdown) and return
     * true from that
     *
     * @override
     */
    Select.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      return this._getValueFromUI() != $value;
    };

    /**
     * @override
     */
    Select.prototype.componentDidUpdate = function componentDidUpdate (value) {
      this._updateUI(value);
    };

    /**
     * @override
     */
    Select.prototype.componentDidMount = function componentDidMount () {
      var attrs = this.params['attrs'] || {};
      var setting = this.setting;

      this.__select = this._container.getElementsByTagName('select')[0];

      // or use normal DOM API
      if (attrs['native']) {
        this.__options = this._container.getElementsByTagName('option');

        this.__select.onchange = function () {
          setting.set(this.value);
        };
      // use select plugin
      } else {
        var pluginOptions = {
          plugins: [],
          maxItems: this.params.max,
          onChange: function (value) {
            setting.set(value);
          }
        };

        if (attrs['hide_selected']) {
          pluginOptions.hideSelected = true;
        }
        if (attrs['sort']) {
          pluginOptions.sortField = 'text';
        }
        if (attrs['removable']) {
          pluginOptions.plugins.push('remove_button');
        }
        if (attrs['draggable']) {
          pluginOptions.plugins.push('drag_drop');
        }
        if (attrs['restore_on_backspace']) {
          pluginOptions.plugins.push('restore_on_backspace');
        }

        $$1(this.__select).selectize(pluginOptions);
      }

      // sync selected state on options on ready
      this._updateUI(this.setting());
    };

    /**
     * Get value from UI
     *
     * @since   1.0.0
     * @memberof! controls.Select#
     * @access protected
     *
     * @return {?Array<string>}
     */
    Select.prototype._getValueFromUI = function _getValueFromUI () {
      if (!this.__select) {
        return null;
      }
      if (this.__select.selectize) {
        return this.__select.selectize.getValue();
      }
      return this.__select.value;
    };

    /**
     * Update UI syncing options values
     *
     * Pass `true` as second argument to perform a `silent` update, that does
     * not trigger the `onChange` event
     *
     * @since   1.0.0
     * @memberof! controls.Select#
     * @access protected
     *
     * @param {string|Array<string>} value
     */
    Select.prototype._updateUI = function _updateUI (value) {
      var this$1 = this;

      // use plugin
      if (this.__select.selectize) {
        this.__select.selectize.setValue(value, true);
      }
      // or use normal DOM API
      else {
        for (var i = this.__options.length; i--;) {
          var option = this$1.__options[i];
          option.selected = (value == option.value);
        }
      }
    };

    /**
     * @override
     */
    Select.prototype._tplChoiceUi = function _tplChoiceUi () {
      return "\n      <option class=\"{{ classes }}\" {{ attributes }} value=\"{{ val }}\"<# if (choice.sublabel) { #> data-sublabel=\"{{{ choice.sublabel }}}\"<# } #>>\n        {{ label }}\n      </option>\n    "
    };

    /**
     * @override
     */
    Select.prototype._tplAboveChoices = function _tplAboveChoices () {
      return "<select name=\"_customize-kkcp_select-{{ data.id }}\">"
    };

    /**
     * @override
     */
    Select.prototype._tplBelowChoices = function _tplBelowChoices () {
      return "</select>"
    };

    return Select;
  }(BaseChoices));

  var Select$1 = wpApi.controlConstructor['kkcp_select'] = api$1.controls.Select = Select;

  /**
   * Control Font Weight
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_font_weight`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class FontWeight
   *
   * @extends controls.Select
   * @augments controls.BaseChoices
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var FontWeight = (function (Select) {
  	function FontWeight () {
  		Select.apply(this, arguments);
  	}if ( Select ) FontWeight.__proto__ = Select;
  	FontWeight.prototype = Object.create( Select && Select.prototype );
  	FontWeight.prototype.constructor = FontWeight;

  	

  	return FontWeight;
  }(Select$1));

  wpApi.controlConstructor['kkcp_font_weight'] = api$1.controls.FontWeight = FontWeight;

  /**
   * Control Slider
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_slider`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Slider
   *
   * @extends controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   * @requires Helper
   */
  var Slider = (function (Base) {
    function Slider (id, args) {
      Base.call(this, id, args);

      this.validate = Validate.slider;
      this.sanitize = Sanitize.slider;
    }

    if ( Base ) Slider.__proto__ = Base;
    Slider.prototype = Object.create( Base && Base.prototype );
    Slider.prototype.constructor = Slider;

    /**
     * Let's consider '44' to be equal to 44.
     * @override
     */
    Slider.prototype.softenize = function softenize ($value) {
      return $value.toString();
    };

    /**
     * @override
     */
    Slider.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      return !_$1.isEqual(this.softenize($value), this._getValueFromUI());
    };

    /**
     * @override
     */
    Slider.prototype.componentDidUpdate = function componentDidUpdate ($value) {
      this._setPartialValue($value, 'API');
    };

    /**
     * This function is divided in subfunctions to make it easy to reuse part of
     * this control in other controls that extends this, such as `size_dynamic`.
     *
     * @override
     */
    Slider.prototype.componentDidMount = function componentDidMount () {
      this._setDOMrefs();
      this._initSliderAndBindInputs();
      this._updateUI(this.setting());
    };

    /**
     * Set DOM element as control properties
     *
     * @since   1.0.0
     * @memberof! controls.Slider#
     * @access protected
     */
    Slider.prototype._setDOMrefs = function _setDOMrefs () {
      var container = this._container;
      this.__inputNumber = container.getElementsByClassName('kkcp-slider-number')[0];
      this.__$inputUnits = $$1(container.getElementsByClassName('kkcp-unit'));
      this.__$inputSlider = $$1(container.getElementsByClassName('kkcp-slider')[0]);
    };

    /**
     * Init slider and bind input UI.
     *
     * @since   1.0.0
     * @memberof! controls.Slider#
     * @access protected
     */
    Slider.prototype._initSliderAndBindInputs = function _initSliderAndBindInputs () {
      var self = this;
      var params = self.params;
      var inputNumber = self.__inputNumber;
      var $inputSlider = self.__$inputSlider;
      var onInputNumberChange = function () {
        var value = this.value;
        $inputSlider.slider('value', value);
        self._setPartialValue({ _number: value });
      };

      // Bind click action to unit picker
      // (only if there is more than one unit allowed)
      if (params['units'] && params['units'].length > 1) {
        var $inputUnits = self.__$inputUnits;
        $inputUnits.on('click', function () {
          $inputUnits.removeClass('kkcp-current');
          this.className += ' kkcp-current';
          self._setPartialValue({ _unit: this.value });
        });
      }

      // Bind number input
      inputNumber.onchange = onInputNumberChange;
      inputNumber.onkeyup = onInputNumberChange;

      // Init Slider
      var sliderOptions = params['attrs'] || {};
      $inputSlider.slider(_$1.extend(sliderOptions, {
        value: Helper.extractNumber(this.setting()),
        slide: function(event, ui) {
          inputNumber.value = ui.value;
          self._setPartialValue({ _number: ui.value });
        },
        change: function(event, ui) {
          // trigger change effect only on user input, @see
          // https://forum.jquery.com/topic/setting-a-sliders-value-without-triggering-the-change-event
          if (event.originalEvent) {
            self._setPartialValue({ _number: ui.value });
          }
        }
      }));
    };

    /**
     * Get current `setting` value from DOM or from given arg
     *
     * @since   1.0.0
     * @memberof! controls.Slider#
     * @access protected
     *
     * @param  {Object<string,string>} value An optional value formed as
     *                                       `{ number: ?, unit: ? }`
     * @return {string}
     */
    Slider.prototype._getValueFromUI = function _getValueFromUI (value) {
      var output;

      if (value && value._number) {
        output = value._number.toString();
      } else {
        output = this.__inputNumber.value;
      }
      if (this.params['units']) {
        if (value && value._unit) {
          output += value._unit;
        } else {
          output += this.__$inputUnits.filter('.kkcp-current').val();
        }
      }
      return output;
    };

    /**
     * Update UI control
     *
     * Reflect a programmatic setting change on the UI.
     *
     * @since   1.0.0
     * @memberof! controls.Slider#
     * @access protected
     *
     * @param {?string} value Optional, the value from where to extract number and unit,
     *                        uses `this.setting()` if a `null` value is passed.
     */
    Slider.prototype._updateUI = function _updateUI (value) {
      var params = this.params;
      var number$$1 = Helper.extractNumber(value);
      var unit = Helper.extractSizeUnit(value);

      // update number input
      this.__inputNumber.value = number$$1;
      // update number slider
      this.__$inputSlider.slider('value', number$$1);
      // update unit picker
      if (params['units']) {
        this.__$inputUnits.removeClass('kkcp-current').filter(function () {
          return this.value === unit;
        }).addClass('kkcp-current');
      }
    };

    /**
     * Set partial value
     *
     * Wraps `setting.set()` with some additional stuff.
     *
     * @since   1.0.0
     * @memberof! controls.Slider#
     * @access protected
     *
     * @param  {string} value
     * @param  {string} from  Where the value come from (could be from the UI:
     *                        picker, dynamic fields, expr field) or from the
     *                        API (on programmatic value change).
     */
    Slider.prototype._setPartialValue = function _setPartialValue (value, from) {
      if (from === 'API') {
        this._updateUI(value);
      } else {
        this.setting.set(this._getValueFromUI(value));
      }
    };

    /**
     * Separate the slider template to make it reusable by child classes
     *
     * @override
     */
    Slider.prototype._tplSlider = function _tplSlider () {
      return "\n      <# if (data.units) { #>\n        <div class=\"kkcp-inputs-wrap\">\n          <input type=\"number\" class=\"kkcp-slider-number\" value=\"\" tabindex=\"-1\"\n            <# for (var key in data.attrs) { if (data.attrs.hasOwnProperty(key)) { #>{{ key }}=\"{{ data.attrs[key] }}\" <# } } #>>\n          <div class=\"kkcp-unit-wrap\"><# for (var i = 0, l = data.units.length; i < l; i++) { #><input type=\"text\" class=\"kkcp-unit\" readonly=\"true\" tabindex=\"-1\" value=\"{{ data.units[i] }}\"><# } #></div>\n        </div>\n      <# } else { #>\n        <input type=\"number\" class=\"kkcp-slider-number\" value=\"\" tabindex=\"-1\"\n          <# for (var key in data.attrs) { if (data.attrs.hasOwnProperty(key)) { #>{{ key }}=\"{{ data.attrs[key] }}\" <# } } #>>\n        <# } #>\n      <div class=\"kkcp-slider-wrap\">\n        <div class=\"kkcp-slider\"></div>\n      </div>\n    "
    };

    /**
     * @override
     */
    Slider.prototype._tpl = function _tpl () {
      return ("" + (this._tplHeader()) + (this._tplSlider()))
    };

    return Slider;
  }(Base$1));

  wpApi.controlConstructor['kkcp_slider'] = api$1.controls.Slider = Slider;

  /**
   * Control Tags class
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_tags`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Tags
   *
   * @extends controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   */
  var Tags = (function (Base) {
    function Tags (id, args) {
      Base.call(this, id, args);

      this.validate = Validate.tags;
      this.sanitize = Sanitize.tags;
    }

    if ( Base ) Tags.__proto__ = Base;
    Tags.prototype = Object.create( Base && Base.prototype );
    Tags.prototype.constructor = Tags;

    /**
     * @override
     */
    Tags.prototype.componentInit = function componentInit () {
      var this$1 = this;

      var attrs = this.params['attrs'] || {};

      var pluginOptions = {
        plugins: [],
        persist: false,
        create: function (input) {
          return {
            value: input,
            text: input
          };
        },
        onChange: function (value) {
          this$1.setting.set(value);
        }
      };

      if (attrs['persist']) {
        pluginOptions.persist = true;
      }
      if (attrs['removable']) {
        pluginOptions.plugins.push('remove_button');
      }
      if (attrs['draggable']) {
        pluginOptions.plugins.push('drag_drop');
      }
      if (attrs['restore_on_backspace']) {
        pluginOptions.plugins.push('restore_on_backspace');
      }

      this._pluginOptions = pluginOptions;
    };

    /**
     * @override
     */
    Tags.prototype.componentWillUnmount = function componentWillUnmount () {
      this.__input.selectize.destroy();
    };

    /**
     * @override
     */
    Tags.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      return this.__input.selectize.getValue() !== $value;
    };

    /**
     * @override
     */
    Tags.prototype.componentDidUpdate = function componentDidUpdate ($value) {
      this._updateUI($value);
    };

    /**
     * @override
     */
    Tags.prototype.componentDidMount = function componentDidMount () {
      this.__input = this._container.getElementsByTagName('input')[0];

      this._updateUI(this.setting());
    };

    /**
     * Update UI
     *
     * @since   1.0.0
     * @memberof! controls.Tags#
     * @access protected
     *
     * @param {string} $value
     */
    Tags.prototype._updateUI = function _updateUI ($value) {
      // here we should not destroy and recreate, but this is a plugin bug:
      // @see https://github.com/brianreavis/selectize.js/issues/568
      if (this.__input.selectize) {
        this.__input.selectize.destroy();
      }
      this.__input.value = $value;
      $$1(this.__input).selectize(this._pluginOptions);

      // this.__input.selectize.setValue($value, true);
    };

    /**
     * @override
     */
    Tags.prototype._tpl = function _tpl () {
      return ("\n      <label>\n        " + (this._tplHeader()) + "\n        <input type=\"text\" value=\"\">\n      </label>\n    ")
    };

    return Tags;
  }(Base$1));

  wpApi.controlConstructor['kkcp_tags'] = api$1.controls.Tags = Tags;

  /**
   * Control Textarea class
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_textarea`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Textarea
   *
   * @extends controls.Text
   * @augments controls.BaseInput
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   *
   * @requires Validate
   * @requires Sanitize
   * @requires tinyMCE
   */
  var Textarea = (function (Text) {
    function Textarea () {
      Text.apply(this, arguments);
    }

    if ( Text ) Textarea.__proto__ = Text;
    Textarea.prototype = Object.create( Text && Text.prototype );
    Textarea.prototype.constructor = Textarea;

    Textarea.prototype.componentInit = function componentInit () {
      if (this.params['wp_editor']) {
        this._wpEditorID = this._getWpEditorId();
      }
    };

    /**
     * @override
     */
    Textarea.prototype.componentWillUnmount = function componentWillUnmount () {
      if (this.params['wp_editor']) {
        // it might be that this method is called too soon, even before tinyMCE
        // has been loaded, so try it and don't break.
        try {
          if (this._wpEditorIsActive) {
            // window.tinyMCE.remove('#' + this._wpEditorID);
            window$1.wp.editor.remove(this._wpEditorID);
          }
        } catch(e) {}
      }
    };

    /**
     * @override
     */
    Textarea.prototype.shouldComponentUpdate = function shouldComponentUpdate ($value) {
      return $value !== this._getValueFromUI();
    };

    /**
     * @override
     */
    Textarea.prototype.componentDidUpdate = function componentDidUpdate ($value) {
      this._updateUI($value);
    };

    /**
     * @override
     */
    Textarea.prototype.componentDidMount = function componentDidMount () {
      this.__textarea = this._container.getElementsByTagName('textarea')[0];

      // params.wp_editor can be either a boolean or an object with options
      if (this.params['wp_editor'] && !this._wpEditorIsActive) {
        this._initWpEditor();
      } else {
        var self = this;

        this._updateUI(self.setting());

        $$1(self.__textarea).on('change keyup paste', function () {
          self.setting.set(this.value);
        });
      }
    };

    /**
     * Get value from UI
     *
     * @since   1.1.0
     * @memberof! controls.Textarea#
     * @access protected
     */
    Textarea.prototype._getValueFromUI = function _getValueFromUI () {
      if (this.params['wp_editor']) {
        var wpEditorInstance = window$1.tinyMCE.get(this._wpEditorID);
        return wpEditorInstance.getContent();
        // returnwindow.wp.editor.getContent(this._wpEditorID);;
      } else {
        return this.__textarea.value;
      }
    };

    /**
     * Update UI
     *
     * @since   1.1.0
     * @memberof! controls.Textarea#
     * @access protected
     *
     * @param {$value}
     */
    Textarea.prototype._updateUI = function _updateUI ($value) {
      if (this.params['wp_editor']) {
        var wpEditorInstance = window$1.tinyMCE.get(this._wpEditorID);
        wpEditorInstance.setContent($value);
      } else {
        this.__textarea.value = $value;
      }
    };

    /**
     * Get textarea id, add a suffix and replace dashes with underscores
     * as suggested by WordPress Codex.
     *
     * @see https://codex.wordpress.org/Function_Reference/wp_editor -> $editor_id
     *
     * @since   1.0.0
     * @memberof! controls.Textarea#
     * @access protected
     */
    Textarea.prototype._getWpEditorId = function _getWpEditorId () {
      return ((this.id.replace(/-/g, '_')) + "__textarea");
    };

    /**
     * Maybe init wp_editor.
     *
     * In case it's needed we load by ajax the wp_editor. We put a promise
     * on our API root object. In this way all the textareas controls that
     * implements the wp_editor can read the status of the loading scripts
     * from the same place allowing us to require the js scripts only once.
     * We pass `load`: 1 to the ajax call to infrom the php function to load
     * the script only from this call (in fact we reuse the same php function
     * later on). Once loaded the response (with the needed scripts) is
     * prepended to the body and we get rid of the doubled `dashicons-css`
     * included in the response, which creates layout problems.
     *
     * @since   1.0.0
     * @memberof! controls.Textarea#
     * @access protected
     */
    Textarea.prototype._initWpEditor = function _initWpEditor () {
      // dynamically set id on textarea, then use it as a target for wp_editor
      this.__textarea.id = this._wpEditorID;

      var setting = this.setting;

      // get wp_editor custom options defined by the developer through the php API
      var optionsCustom = _$1.isObject(this.params['wp_editor']) ? this.params['wp_editor'] : {};

      // set default options
      var optionsDefaults = $$1.extend(true, {}, window$1.wp.editor.getDefaultSettings(), {
        teeny: true,
        mediaButtons: false,
      });

      // merge the options adding the required options (the needed element id and
      // setup callback with our bindings to the WordPRess customize API)
      // in this way we make sure the required options can't be overwritten
      // by developers when declaring wp_editor support through an array of opts
      var options = $$1.extend(true, optionsDefaults, optionsCustom, {
        // elements: this.__textarea.id,
        tinymce: {
          target: this.__textarea,
          setup: function (editor) {
            editor.on('init', function () {
              // at a certain point it seemed that somehow we needed a timeout here,
              // without it it doesn't work. Now it works, but leave the comment here
              // for possible future problems.
              // setTimeout(function () {
              editor.setContent(setting());
              // }, 1000);
            });
            editor.on('change keyup', function () {
              setting.set(editor.getContent());
            });
          }
        }
      });

      window$1.wp.editor.initialize(this._wpEditorID, options);

      this._wpEditorIsActive = true;
    };

    /**
     * @override
     */
    Textarea.prototype._tpl = function _tpl () {
      return ("\n      <label>\n        " + (this._tplHeader()) + "<# var attrs = data.attrs; #>\n        <textarea class=\"kkcpui-textarea<# if (data.wp_editor && data.wp_editor.editorClass) { #> {{ data.wp_editor.editorClass }}<# } #>\"\n          <# for (var key in attrs) { if (attrs.hasOwnProperty(key)) { #>{{ key }}=\"{{ attrs[key] }}\" <# } } #>\n          rows=\"<# if (data.wp_editor && data.wp_editor.textareaRows) { #>{{ data.wp_editor.textareaRows }}<# } else if (attrs && attrs.rows) { #>{{ attrs.rows }}<# } else { #>4<# } #>\"\n          <# if (data.wp_editor && data.wp_editor.editorHeight) { #> style=\"height:{{ data.wp_editor.editorHeight }}px\"\n        <# } #>>\n        </textarea>\n      </label>\n    ")
    };

    return Textarea;
  }(Text$1));

  wpApi.controlConstructor['kkcp_textarea'] = api$1.controls.Textarea = Textarea;

  /**
   * Control Toggle
   *
   * Accessible globally on `wp.customize.controlConstructor.kkcp_toggle`
   *
   * @since  1.0.0
   *
   * @memberof controls
   * @class Toggle
   *
   * @extends controls.Checkbox
   * @augments controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Toggle = (function (Checkbox) {
    function Toggle () {
      Checkbox.apply(this, arguments);
    }

    if ( Checkbox ) Toggle.__proto__ = Checkbox;
    Toggle.prototype = Object.create( Checkbox && Checkbox.prototype );
    Toggle.prototype.constructor = Toggle;

    Toggle.prototype._tpl = function _tpl () {
      return ("\n      " + (this._tplHeader()) + "\n      <# var labelFalse = data.attrs ? data.attrs.label_false : ''; labelTrue = data.attrs ? data.attrs.label_true : ''; #>\n      <label class=\"switch-light kkcpui-switch<# if (labelFalse && labelTrue) { var l0l = labelFalse.length, l1l = labelTrue.length; #><# if ((l0l && l1l) && (Math.abs(l0l - l1l) > 1) || l0l > 6 || l1l > 6) { #> kkcpui-switch__labelsauto<# } else { #> kkcpui-switch__labels<# } } #>\" onclick=\"\">\n        <input type=\"checkbox\" name=\"_customize-kkcp_toggle-{{ data.id }}\" value=\"\" <# var a = data.attrs; for (var key in a) { if (a.hasOwnProperty(key)) { #>{{ key }}=\"{{ a[key] }}\" <# } } #><# if (data.value) { #> checked<# } #>>\n        <span<# if (!labelFalse && !labelTrue) { #> aria-hidden=\"true\"<# } #>>\n          <span><# if (labelFalse) { #>{{ labelFalse }}<# } #></span>\n          <span><# if (labelTrue) { #>{{ labelTrue }}<# } #></span>\n          <a></a>\n        </span>\n      </label>\n    ");
    };

    return Toggle;
  }(Checkbox$1));

  wpApi.controlConstructor['kkcp_toggle'] = api$1.controls.Toggle = Toggle;

  /**
   * Setting Base class
   *
   * Accessible globally on `wp.customize.settingConstructor.kkcp_base`
   *
   * @see PHP class KKcp_Customize_Setting_Base
   * @since  1.0.0
   *
   * @memberof settings
   * @class Base
   *
   * @extends wp.customize.Setting
   * @augments wp.customize.Value
   * @augments wp.customize.Class
   */
  var Base$2 = wpApi.Setting.extend({

    /**
     * {@inheritdoc}. Add the initial and lastSave values for reset value actions.
     * The `factory` value is added in the PHP Setting class constructor.
     *
     * @memberof! settings.Base#
     *
     * @since 1.0.0
     * @override
     */
    initialize: function( id, value, options ) {
      wpApi.Setting.prototype.initialize.call(this, id, value, options);

      // we need to grab this manually because the json data of a setting class is
      // not passed over in its entirety to the JavaScript constructor, only
      // `transport`, `previewer` and `dirty` are given as argument when WordPress
      // create Settings in `customize-controls.js`#7836
      var data = wpApi.settings.settings[id];
      if (data) {
        this.vFactory = data['default'];
      }
      this.vInitial = this();
      this.vLastSaved = this.vInitial;
    },

    /**
     * {@inheritcoc}. Sanitize value before sending it to the preview via
     * `postMessage`.
     *
     * @memberof! settings.Base#
     *
     * @since 1.0.0
     * @override
     */
    preview: function() {
      var setting = this, transport;
      transport = setting.transport;

      if ( 'postMessage' === transport && ! wpApi.state( 'previewerAlive' ).get() ) {
        transport = 'refresh';
      }

      if ( 'postMessage' === transport ) {
        // we just add here a sanitization method
        setting.previewer.send( 'setting', [ setting.id, this.sanitize(setting()) ] );
      } else if ( 'refresh' === transport ) {
        setting.previewer.refresh();
      }
    },

    /**
     * Sanitize setting
     *
     * This is here to allow controls to define a sanitization method before then
     * the setting value is sent to the preview via `postMessage`
     *
     * @memberof! settings.Base#
     *
     * @abstract
     * @param  {mixed} value
     * @return {mixed}
     */
    sanitize: function (value) {
      return value;
    },

    /**
     * Force `set`.
     *
     * Use case:
     * When a required text control content gets deleted by the user,
     * the extras dropdown shows the reset buttons enabled but clicking on any
     * of them doesn't give any effect in the UI. Why? Because when the input
     * field gets emptied the validate function set the setting to the last
     * value using `return this.setting()`, this returning value it is likely
     * to be the same as the initial session or the factory value, therefore
     * before and after the user has clicked the reset button the value of the
     * setting could stay the same. Despite this make sense, the input field
     * gets out of sync, it becomes empty, while the setting value remains the
     * latest valid value).
     * The callback that should be called on reset (the `componentDidUpdate` method)
     * in this scenario doesn't get called because in the WordPress
     * `customize-base.js#187` there is a check that return the function if the
     * setting has been set with the same value as the last one, preventing so
     * to fire the callbacks binded to the setting and, with these, also our
     * `componentDidUpdatefromAPI` that would update the UI, that is our input field with
     * the resetted value. To overcome this problem we can force the setting to
     * set anyway by temporarily set the private property `_value` to a dummy
     * value and then re-setting the setting to the desired value, in this way
     * the callbacks are fired and the UI get back in sync.
     *
     * @memberof! settings.Base#
     *
     * @param  {WP_Customize_Setting} setting
     * @param  {string} value
     */
    forceSet: function forceSet (value, dummyValue) {
      this['_value'] = dummyValue || 'dummy'; // whitelisted from uglify \\
      this.set(value);
    }
  });

  wpApi.settingConstructor['kkcp_base'] = api$1.settings.Base = Base$2;

}(window,document,jQuery,_,wp,kkcp,marked,hljs,Modernizr));
