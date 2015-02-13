/**
 * Pass js files here: http://www.dotnetwise.com/Code/Externs/.
 *
 * Get them from:
 *
 * - https://rawgit.com/ichord/At.js/master/dist/js/jquery.atwho.js
 *
 * @fileoverview Externs for....
 * @see http://api.jquery.com/
 * @externs
 */


/** @typedef {
              {
                at: (?string|undefined),
                alias: (?string|undefined),
                data: (Array.<*>|string),
                displayTpl: (?string|undefined),
                insertTpl: (?string|undefined),
                searchKey: (?string|undefined),
                limit: (?number|undefined),
                maxLen: (?number|undefined),
                startWithSpace: (?boolean|undefined),
                displayTimeout: (?number|undefined),
                highlightFirst: (?boolean|undefined),
                delay: (?number|undefined),
                suffix: (?string|undefined),
                hideWithoutSuffix: (?boolean|undefined),
                beforeReposition: (function({left:number,top:number})|undefined)
              }} */
var atWhoSettings;

/**
 * @param {(string|atWhoSettings|Object.<string, *>)=} options
 * @return {!jQuery}
 */
jQuery.prototype.atwho = function(options) {};





/** @typedef {
              {
                vars: (Array.<string>),
                varsLookup: (Object.<string, ?boolean>),
                functions: (Array.<string>),
                onChange: (function()|undefined),
                onSet: (function()|undefined),
                value: (?string|number)
              }} */
var ExprOptions;


var less = {};
var Modernizr = {};
var lunr = {};
var Color = {};
var jQuery = {};
var _ = {};
var K6 = {};
var wp = {};
