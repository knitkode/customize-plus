/*!
 * modernizr v3.3.1
 * Build http://modernizr.com/download?-cssanimations-csstransforms-filereader-svg-webworkers-addtest-fnbind-setclasses-testprop-dontmin
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
(function(window, document, undefined) {
    var tests = [];
    var ModernizrProto = {
        _version: "3.3.1",
        _config: {
            classPrefix: "",
            enableClasses: true,
            enableJSClass: true,
            usePrefixes: true
        },
        _q: [],
        on: function(test, cb) {
            var self = this;
            setTimeout(function() {
                cb(self[test]);
            }, 0);
        },
        addTest: function(name, fn, options) {
            tests.push({
                name: name,
                fn: fn,
                options: options
            });
        },
        addAsyncTest: function(fn) {
            tests.push({
                name: null,
                fn: fn
            });
        }
    };
    var Modernizr = function() {};
    Modernizr.prototype = ModernizrProto;
    Modernizr = new Modernizr();
    var classes = [];
    function is(obj, type) {
        return typeof obj === type;
    }
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
                if (feature.name) {
                    featureNames.push(feature.name.toLowerCase());
                    if (feature.options && feature.options.aliases && feature.options.aliases.length) {
                        for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
                            featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
                        }
                    }
                }
                result = is(feature.fn, "function") ? feature.fn() : feature.fn;
                for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
                    featureName = featureNames[nameIdx];
                    featureNameSplit = featureName.split(".");
                    if (featureNameSplit.length === 1) {
                        Modernizr[featureNameSplit[0]] = result;
                    } else {
                        if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
                            Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
                        }
                        Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
                    }
                    classes.push((result ? "" : "no-") + featureNameSplit.join("-"));
                }
            }
        }
    }
    var docElement = document.documentElement;
    var isSVG = docElement.nodeName.toLowerCase() === "svg";
    function setClasses(classes) {
        var className = docElement.className;
        var classPrefix = Modernizr._config.classPrefix || "";
        if (isSVG) {
            className = className.baseVal;
        }
        if (Modernizr._config.enableJSClass) {
            var reJS = new RegExp("(^|\\s)" + classPrefix + "no-js(\\s|$)");
            className = className.replace(reJS, "$1" + classPrefix + "js$2");
        }
        if (Modernizr._config.enableClasses) {
            className += " " + classPrefix + classes.join(" " + classPrefix);
            isSVG ? docElement.className.baseVal = className : docElement.className = className;
        }
    }
    var hasOwnProp;
    (function() {
        var _hasOwnProperty = {}.hasOwnProperty;
        if (!is(_hasOwnProperty, "undefined") && !is(_hasOwnProperty.call, "undefined")) {
            hasOwnProp = function(object, property) {
                return _hasOwnProperty.call(object, property);
            };
        } else {
            hasOwnProp = function(object, property) {
                return property in object && is(object.constructor.prototype[property], "undefined");
            };
        }
    })();
    ModernizrProto._l = {};
    ModernizrProto.on = function(feature, cb) {
        if (!this._l[feature]) {
            this._l[feature] = [];
        }
        this._l[feature].push(cb);
        if (Modernizr.hasOwnProperty(feature)) {
            setTimeout(function() {
                Modernizr._trigger(feature, Modernizr[feature]);
            }, 0);
        }
    };
    ModernizrProto._trigger = function(feature, res) {
        if (!this._l[feature]) {
            return;
        }
        var cbs = this._l[feature];
        setTimeout(function() {
            var i, cb;
            for (i = 0; i < cbs.length; i++) {
                cb = cbs[i];
                cb(res);
            }
        }, 0);
        delete this._l[feature];
    };
    function addTest(feature, test) {
        if (typeof feature == "object") {
            for (var key in feature) {
                if (hasOwnProp(feature, key)) {
                    addTest(key, feature[key]);
                }
            }
        } else {
            feature = feature.toLowerCase();
            var featureNameSplit = feature.split(".");
            var last = Modernizr[featureNameSplit[0]];
            if (featureNameSplit.length == 2) {
                last = last[featureNameSplit[1]];
            }
            if (typeof last != "undefined") {
                return Modernizr;
            }
            test = typeof test == "function" ? test() : test;
            if (featureNameSplit.length == 1) {
                Modernizr[featureNameSplit[0]] = test;
            } else {
                if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
                    Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
                }
                Modernizr[featureNameSplit[0]][featureNameSplit[1]] = test;
            }
            setClasses([ (!!test && test != false ? "" : "no-") + featureNameSplit.join("-") ]);
            Modernizr._trigger(feature, test);
        }
        return Modernizr;
    }
    Modernizr._q.push(function() {
        ModernizrProto.addTest = addTest;
    });
    function contains(str, substr) {
        return !!~("" + str).indexOf(substr);
    }
    function createElement() {
        if (typeof document.createElement !== "function") {
            return document.createElement(arguments[0]);
        } else if (isSVG) {
            return document.createElementNS.call(document, "http://www.w3.org/2000/svg", arguments[0]);
        } else {
            return document.createElement.apply(document, arguments);
        }
    }
    var modElem = {
        elem: createElement("modernizr")
    };
    Modernizr._q.push(function() {
        delete modElem.elem;
    });
    var mStyle = {
        style: modElem.elem.style
    };
    Modernizr._q.unshift(function() {
        delete mStyle.style;
    });
    function getBody() {
        var body = document.body;
        if (!body) {
            body = createElement(isSVG ? "svg" : "body");
            body.fake = true;
        }
        return body;
    }
    function injectElementWithStyles(rule, callback, nodes, testnames) {
        var mod = "modernizr";
        var style;
        var ret;
        var node;
        var docOverflow;
        var div = createElement("div");
        var body = getBody();
        if (parseInt(nodes, 10)) {
            while (nodes--) {
                node = createElement("div");
                node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                div.appendChild(node);
            }
        }
        style = createElement("style");
        style.type = "text/css";
        style.id = "s" + mod;
        (!body.fake ? div : body).appendChild(style);
        body.appendChild(div);
        if (style.styleSheet) {
            style.styleSheet.cssText = rule;
        } else {
            style.appendChild(document.createTextNode(rule));
        }
        div.id = mod;
        if (body.fake) {
            body.style.background = "";
            body.style.overflow = "hidden";
            docOverflow = docElement.style.overflow;
            docElement.style.overflow = "hidden";
            docElement.appendChild(body);
        }
        ret = callback(div, rule);
        if (body.fake) {
            body.parentNode.removeChild(body);
            docElement.style.overflow = docOverflow;
            docElement.offsetHeight;
        } else {
            div.parentNode.removeChild(div);
        }
        return !!ret;
    }
    function domToCSS(name) {
        return name.replace(/([A-Z])/g, function(str, m1) {
            return "-" + m1.toLowerCase();
        }).replace(/^ms-/, "-ms-");
    }
    function nativeTestProps(props, value) {
        var i = props.length;
        if ("CSS" in window && "supports" in window.CSS) {
            while (i--) {
                if (window.CSS.supports(domToCSS(props[i]), value)) {
                    return true;
                }
            }
            return false;
        } else if ("CSSSupportsRule" in window) {
            var conditionText = [];
            while (i--) {
                conditionText.push("(" + domToCSS(props[i]) + ":" + value + ")");
            }
            conditionText = conditionText.join(" or ");
            return injectElementWithStyles("@supports (" + conditionText + ") { #modernizr { position: absolute; } }", function(node) {
                return getComputedStyle(node, null).position == "absolute";
            });
        }
        return undefined;
    }
    function cssToDOM(name) {
        return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
            return m1 + m2.toUpperCase();
        }).replace(/^-/, "");
    }
    function testProps(props, prefixed, value, skipValueTest) {
        skipValueTest = is(skipValueTest, "undefined") ? false : skipValueTest;
        if (!is(value, "undefined")) {
            var result = nativeTestProps(props, value);
            if (!is(result, "undefined")) {
                return result;
            }
        }
        var afterInit, i, propsLength, prop, before;
        var elems = [ "modernizr", "tspan" ];
        while (!mStyle.style) {
            afterInit = true;
            mStyle.modElem = createElement(elems.shift());
            mStyle.style = mStyle.modElem.style;
        }
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
            if (contains(prop, "-")) {
                prop = cssToDOM(prop);
            }
            if (mStyle.style[prop] !== undefined) {
                if (!skipValueTest && !is(value, "undefined")) {
                    try {
                        mStyle.style[prop] = value;
                    } catch (e) {}
                    if (mStyle.style[prop] != before) {
                        cleanElems();
                        return prefixed == "pfx" ? prop : true;
                    }
                } else {
                    cleanElems();
                    return prefixed == "pfx" ? prop : true;
                }
            }
        }
        cleanElems();
        return false;
    }
    var testProp = ModernizrProto.testProp = function(prop, value, useValue) {
        return testProps([ prop ], undefined, value, useValue);
    };
    function fnBind(fn, that) {
        return function() {
            return fn.apply(that, arguments);
        };
    }
    var omPrefixes = "Moz O ms Webkit";
    var cssomPrefixes = ModernizrProto._config.usePrefixes ? omPrefixes.split(" ") : [];
    ModernizrProto._cssomPrefixes = cssomPrefixes;
    var domPrefixes = ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(" ") : [];
    ModernizrProto._domPrefixes = domPrefixes;
    function testDOMProps(props, obj, elem) {
        var item;
        for (var i in props) {
            if (props[i] in obj) {
                if (elem === false) {
                    return props[i];
                }
                item = obj[props[i]];
                if (is(item, "function")) {
                    return fnBind(item, elem || obj);
                }
                return item;
            }
        }
        return false;
    }
    function testPropsAll(prop, prefixed, elem, value, skipValueTest) {
        var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1), props = (prop + " " + cssomPrefixes.join(ucProp + " ") + ucProp).split(" ");
        if (is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed, value, skipValueTest);
        } else {
            props = (prop + " " + domPrefixes.join(ucProp + " ") + ucProp).split(" ");
            return testDOMProps(props, prefixed, elem);
        }
    }
    ModernizrProto.testAllProps = testPropsAll;
    function testAllProps(prop, value, skipValueTest) {
        return testPropsAll(prop, undefined, undefined, value, skipValueTest);
    }
    ModernizrProto.testAllProps = testAllProps;
    Modernizr.addTest("cssanimations", testAllProps("animationName", "a", true));
    Modernizr.addTest("csstransforms", function() {
        return navigator.userAgent.indexOf("Android 2.") === -1 && testAllProps("transform", "scale(1)", true);
    });
    Modernizr.addTest("filereader", !!(window.File && window.FileList && window.FileReader));
    Modernizr.addTest("svg", !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect);
    Modernizr.addTest("webworkers", "Worker" in window);
    testRunner();
    setClasses(classes);
    delete ModernizrProto.addTest;
    delete ModernizrProto.addAsyncTest;
    for (var i = 0; i < Modernizr._q.length; i++) {
        Modernizr._q[i]();
    }
    window.Modernizr = Modernizr;
})(window, document);