/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170112
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
if (!("classList" in document.createElement("_")) 
	|| document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

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
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
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
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
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
		if (checkTokenAndGetIndex(this, token) === -1) {
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
		while (index !== -1) {
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
	token += "";

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

} else {
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

	testElement = null;
}());

}

}




/*!
 * modernizr v3.0.0-pre
 * modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton, Ryan Seddon, Alexander Farkas, Patrick Kettner, Stu Cox
 * MIT License
 */
!function(e,n,t){function r(e,n){return typeof e===n}function o(){var e,n,t,o,i,s,a;for(var f in y){if(e=[],n=y[f],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,"function")?n.fn():n.fn,i=0;i<e.length;i++)s=e[i],a=s.split("."),1===a.length?C[a[0]]=o:2===a.length&&(!C[a[0]]||C[a[0]]instanceof Boolean||(C[a[0]]=new Boolean(C[a[0]])),C[a[0]][a[1]]=o),S.push((o?"":"no-")+a.join("-"))}}function i(e){var n=T.className,t=C._config.classPrefix||"";if(C._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}C._config.enableClasses&&(n+=" "+t+e.join(" "+t),T.className=n)}function s(e,n){if("object"==typeof e)for(var t in e)w(e,t)&&s(t,e[t]);else{e=e.toLowerCase();var r=e.split("."),o=C[r[0]];if(2==r.length&&(o=o[r[1]]),"undefined"!=typeof o)return C;n="function"==typeof n?n():n,1==r.length?C[r[0]]=n:2==r.length&&(!C[r[0]]||C[r[0]]instanceof Boolean||(C[r[0]]=new Boolean(C[r[0]])),C[r[0]][r[1]]=n),i([(n&&0!=n?"":"no-")+r.join("-")]),C._trigger(e,n)}return C}function a(e,n){return!!~(""+e).indexOf(n)}function f(){var e=n.body;return e||(e=b("body"),e.fake=!0),e}function l(e,n,t,r){var o,i,s,a,l="modernizr",u=b("div"),d=f();if(parseInt(t,10))for(;t--;)s=b("div"),s.id=r?r[t]:l+(t+1),u.appendChild(s);return o=["&#173;",'<style id="s',l,'">',e,"</style>"].join(""),u.id=l,(d.fake?d:u).innerHTML+=o,d.appendChild(u),d.fake&&(d.style.background="",d.style.overflow="hidden",a=T.style.overflow,T.style.overflow="hidden",T.appendChild(d)),i=n(u,e),d.fake?(d.parentNode.removeChild(d),T.style.overflow=a,T.offsetHeight):u.parentNode.removeChild(u),!!i}function u(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function d(n,r){var o=n.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(u(n[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+u(n[o])+":"+r+")");return i=i.join(" or "),l("@supports ("+i+") { #modernizr { position: absolute; } }",function(n){return"absolute"==(e.getComputedStyle?getComputedStyle(n,null):n.currentStyle).position})}return t}function c(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function p(e,n,o,i){function s(){l&&(delete P.style,delete P.modElem)}if(i=r(i,"undefined")?!1:i,!r(o,"undefined")){var f=d(e,o);if(!r(f,"undefined"))return f}var l,u,p,m,h;for(P.style||(l=!0,P.modElem=b("modernizr"),P.style=P.modElem.style),p=e.length,u=0;p>u;u++)if(m=e[u],h=P.style[m],a(m,"-")&&(m=c(m)),P.style[m]!==t){if(i||r(o,"undefined"))return s(),"pfx"==n?m:!0;try{P.style[m]=o}catch(g){}if(P.style[m]!=h)return s(),"pfx"==n?m:!0}return s(),!1}function m(e,n){return function(){return e.apply(n,arguments)}}function h(e,n,t){var o;for(var i in e)if(e[i]in n)return t===!1?e[i]:(o=n[e[i]],r(o,"function")?m(o,t||n):o);return!1}function g(e,n,t,o,i){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+k.join(s+" ")+s).split(" ");return r(n,"string")||r(n,"undefined")?p(a,n,o,i):(a=(e+" "+z.join(s+" ")+s).split(" "),h(a,n,t))}function v(e,n,r){return g(e,t,t,n,r)}var y=[],_={_version:"v3.0.0pre",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){y.push({name:e,fn:n,options:t})},addAsyncTest:function(e){y.push({name:null,fn:e})}},C=function(){};C.prototype=_,C=new C;var w,S=[],T=n.documentElement;!function(){var e={}.hasOwnProperty;w=r(e,"undefined")||r(e.call,"undefined")?function(e,n){return n in e&&r(e.constructor.prototype[n],"undefined")}:function(n,t){return e.call(n,t)}}(),_._l={},_.on=function(e,n){this._l[e]||(this._l[e]=[]),this._l[e].push(n),C.hasOwnProperty(e)&&setTimeout(function(){C._trigger(e,C[e])},0)},_._trigger=function(e,n){if(this._l[e]){var t=this._l[e];setTimeout(function(){var e,r;for(e=0;e<t.length;e++)(r=t[e])(n)},0),delete this._l[e]}},C._q.push(function(){_.addTest=s});var b=function(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):n.createElement.apply(n,arguments)},x={elem:b("modernizr")};C._q.push(function(){delete x.elem});var P={style:x.elem.style};C._q.unshift(function(){delete P.style});var j=(_.testProp=function(e,n,r){return p([e],t,n,r)},"Webkit Moz O ms"),k=_._config.usePrefixes?j.split(" "):[];_._cssomPrefixes=k;var z=_._config.usePrefixes?j.toLowerCase().split(" "):[];_._domPrefixes=z,_.testAllProps=g,_.testAllProps=v,C.addTest("cssanimations",v("animationName","a",!0)),C.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&v("transform","scale(1)",!0)}),C.addTest("filereader",!!(e.File&&e.FileList&&e.FileReader)),C.addTest("webworkers","Worker"in e),o(),i(S),delete _.addTest,delete _.addAsyncTest;for(var A=0;A<C._q.length;A++)C._q[A]();e.Modernizr=C}(this,document);


!function(e){"undefined"!=typeof exports?e(exports):(window.hljs=e({}),"function"==typeof define&&define.amd&&define("hljs",[],function(){return window.hljs}))}(function(e){function n(e){return e.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function t(e){return e.nodeName.toLowerCase()}function r(e,n){var t=e&&e.exec(n);return t&&0==t.index}function a(e){return/no-?highlight|plain|text/.test(e)}function i(e){var n,t,r,i=e.className+" ";if(i+=e.parentNode?e.parentNode.className:"",t=/\blang(?:uage)?-([\w-]+)\b/.exec(i))return E(t[1])?t[1]:"no-highlight";for(i=i.split(/\s+/),n=0,r=i.length;r>n;n++)if(E(i[n])||a(i[n]))return i[n]}function o(e,n){var t,r={};for(t in e)r[t]=e[t];if(n)for(t in n)r[t]=n[t];return r}function u(e){var n=[];return function r(e,a){for(var i=e.firstChild;i;i=i.nextSibling)3==i.nodeType?a+=i.nodeValue.length:1==i.nodeType&&(n.push({event:"start",offset:a,node:i}),a=r(i,a),t(i).match(/br|hr|img|input/)||n.push({event:"stop",offset:a,node:i}));return a}(e,0),n}function c(e,r,a){function i(){return e.length&&r.length?e[0].offset!=r[0].offset?e[0].offset<r[0].offset?e:r:"start"==r[0].event?e:r:e.length?e:r}function o(e){function r(e){return" "+e.nodeName+'="'+n(e.value)+'"'}f+="<"+t(e)+Array.prototype.map.call(e.attributes,r).join("")+">"}function u(e){f+="</"+t(e)+">"}function c(e){("start"==e.event?o:u)(e.node)}for(var s=0,f="",l=[];e.length||r.length;){var g=i();if(f+=n(a.substr(s,g[0].offset-s)),s=g[0].offset,g==e){l.reverse().forEach(u);do c(g.splice(0,1)[0]),g=i();while(g==e&&g.length&&g[0].offset==s);l.reverse().forEach(o)}else"start"==g[0].event?l.push(g[0].node):l.pop(),c(g.splice(0,1)[0])}return f+n(a.substr(s))}function s(e){function n(e){return e&&e.source||e}function t(t,r){return new RegExp(n(t),"m"+(e.cI?"i":"")+(r?"g":""))}function r(a,i){if(!a.compiled){if(a.compiled=!0,a.k=a.k||a.bK,a.k){var u={},c=function(n,t){e.cI&&(t=t.toLowerCase()),t.split(" ").forEach(function(e){var t=e.split("|");u[t[0]]=[n,t[1]?Number(t[1]):1]})};"string"==typeof a.k?c("keyword",a.k):Object.keys(a.k).forEach(function(e){c(e,a.k[e])}),a.k=u}a.lR=t(a.l||/\b\w+\b/,!0),i&&(a.bK&&(a.b="\\b("+a.bK.split(" ").join("|")+")\\b"),a.b||(a.b=/\B|\b/),a.bR=t(a.b),a.e||a.eW||(a.e=/\B|\b/),a.e&&(a.eR=t(a.e)),a.tE=n(a.e)||"",a.eW&&i.tE&&(a.tE+=(a.e?"|":"")+i.tE)),a.i&&(a.iR=t(a.i)),void 0===a.r&&(a.r=1),a.c||(a.c=[]);var s=[];a.c.forEach(function(e){e.v?e.v.forEach(function(n){s.push(o(e,n))}):s.push("self"==e?a:e)}),a.c=s,a.c.forEach(function(e){r(e,a)}),a.starts&&r(a.starts,i);var f=a.c.map(function(e){return e.bK?"\\.?("+e.b+")\\.?":e.b}).concat([a.tE,a.i]).map(n).filter(Boolean);a.t=f.length?t(f.join("|"),!0):{exec:function(){return null}}}}r(e)}function f(e,t,a,i){function o(e,n){for(var t=0;t<n.c.length;t++)if(r(n.c[t].bR,e))return n.c[t]}function u(e,n){if(r(e.eR,n)){for(;e.endsParent&&e.parent;)e=e.parent;return e}return e.eW?u(e.parent,n):void 0}function c(e,n){return!a&&r(n.iR,e)}function g(e,n){var t=N.cI?n[0].toLowerCase():n[0];return e.k.hasOwnProperty(t)&&e.k[t]}function h(e,n,t,r){var a=r?"":w.classPrefix,i='<span class="'+a,o=t?"":"</span>";return i+=e+'">',i+n+o}function p(){if(!L.k)return n(y);var e="",t=0;L.lR.lastIndex=0;for(var r=L.lR.exec(y);r;){e+=n(y.substr(t,r.index-t));var a=g(L,r);a?(B+=a[1],e+=h(a[0],n(r[0]))):e+=n(r[0]),t=L.lR.lastIndex,r=L.lR.exec(y)}return e+n(y.substr(t))}function d(){var e="string"==typeof L.sL;if(e&&!x[L.sL])return n(y);var t=e?f(L.sL,y,!0,M[L.sL]):l(y,L.sL.length?L.sL:void 0);return L.r>0&&(B+=t.r),e&&(M[L.sL]=t.top),h(t.language,t.value,!1,!0)}function b(){return void 0!==L.sL?d():p()}function v(e,t){var r=e.cN?h(e.cN,"",!0):"";e.rB?(k+=r,y=""):e.eB?(k+=n(t)+r,y=""):(k+=r,y=t),L=Object.create(e,{parent:{value:L}})}function m(e,t){if(y+=e,void 0===t)return k+=b(),0;var r=o(t,L);if(r)return k+=b(),v(r,t),r.rB?0:t.length;var a=u(L,t);if(a){var i=L;i.rE||i.eE||(y+=t),k+=b();do L.cN&&(k+="</span>"),B+=L.r,L=L.parent;while(L!=a.parent);return i.eE&&(k+=n(t)),y="",a.starts&&v(a.starts,""),i.rE?0:t.length}if(c(t,L))throw new Error('Illegal lexeme "'+t+'" for mode "'+(L.cN||"<unnamed>")+'"');return y+=t,t.length||1}var N=E(e);if(!N)throw new Error('Unknown language: "'+e+'"');s(N);var R,L=i||N,M={},k="";for(R=L;R!=N;R=R.parent)R.cN&&(k=h(R.cN,"",!0)+k);var y="",B=0;try{for(var C,j,I=0;;){if(L.t.lastIndex=I,C=L.t.exec(t),!C)break;j=m(t.substr(I,C.index-I),C[0]),I=C.index+j}for(m(t.substr(I)),R=L;R.parent;R=R.parent)R.cN&&(k+="</span>");return{r:B,value:k,language:e,top:L}}catch(O){if(-1!=O.message.indexOf("Illegal"))return{r:0,value:n(t)};throw O}}function l(e,t){t=t||w.languages||Object.keys(x);var r={r:0,value:n(e)},a=r;return t.forEach(function(n){if(E(n)){var t=f(n,e,!1);t.language=n,t.r>a.r&&(a=t),t.r>r.r&&(a=r,r=t)}}),a.language&&(r.second_best=a),r}function g(e){return w.tabReplace&&(e=e.replace(/^((<[^>]+>|\t)+)/gm,function(e,n){return n.replace(/\t/g,w.tabReplace)})),w.useBR&&(e=e.replace(/\n/g,"<br>")),e}function h(e,n,t){var r=n?R[n]:t,a=[e.trim()];return e.match(/\bhljs\b/)||a.push("hljs"),-1===e.indexOf(r)&&a.push(r),a.join(" ").trim()}function p(e){var n=i(e);if(!a(n)){var t;w.useBR?(t=document.createElementNS("http://www.w3.org/1999/xhtml","div"),t.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n")):t=e;var r=t.textContent,o=n?f(n,r,!0):l(r),s=u(t);if(s.length){var p=document.createElementNS("http://www.w3.org/1999/xhtml","div");p.innerHTML=o.value,o.value=c(s,u(p),r)}o.value=g(o.value),e.innerHTML=o.value,e.className=h(e.className,n,o.language),e.result={language:o.language,re:o.r},o.second_best&&(e.second_best={language:o.second_best.language,re:o.second_best.r})}}function d(e){w=o(w,e)}function b(){if(!b.called){b.called=!0;var e=document.querySelectorAll("pre code");Array.prototype.forEach.call(e,p)}}function v(){addEventListener("DOMContentLoaded",b,!1),addEventListener("load",b,!1)}function m(n,t){var r=x[n]=t(e);r.aliases&&r.aliases.forEach(function(e){R[e]=n})}function N(){return Object.keys(x)}function E(e){return x[e]||x[R[e]]}var w={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0},x={},R={};return e.highlight=f,e.highlightAuto=l,e.fixMarkup=g,e.highlightBlock=p,e.configure=d,e.initHighlighting=b,e.initHighlightingOnLoad=v,e.registerLanguage=m,e.listLanguages=N,e.getLanguage=E,e.inherit=o,e.IR="[a-zA-Z]\\w*",e.UIR="[a-zA-Z_]\\w*",e.NR="\\b\\d+(\\.\\d+)?",e.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",e.BNR="\\b(0b[01]+)",e.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",e.BE={b:"\\\\[\\s\\S]",r:0},e.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[e.BE]},e.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[e.BE]},e.PWM={b:/\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such)\b/},e.C=function(n,t,r){var a=e.inherit({cN:"comment",b:n,e:t,c:[]},r||{});return a.c.push(e.PWM),a.c.push({cN:"doctag",b:"(?:TODO|FIXME|NOTE|BUG|XXX):",r:0}),a},e.CLCM=e.C("//","$"),e.CBCM=e.C("/\\*","\\*/"),e.HCM=e.C("#","$"),e.NM={cN:"number",b:e.NR,r:0},e.CNM={cN:"number",b:e.CNR,r:0},e.BNM={cN:"number",b:e.BNR,r:0},e.CSSNM={cN:"number",b:e.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0},e.RM={cN:"regexp",b:/\//,e:/\/[gimuy]*/,i:/\n/,c:[e.BE,{b:/\[/,e:/\]/,r:0,c:[e.BE]}]},e.TM={cN:"title",b:e.IR,r:0},e.UTM={cN:"title",b:e.UIR,r:0},e});hljs.registerLanguage("javascript",function(e){return{aliases:["js"],k:{keyword:"in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"},c:[{cN:"pi",r:10,b:/^\s*['"]use (strict|asm)['"]/},e.ASM,e.QSM,{cN:"string",b:"`",e:"`",c:[e.BE,{cN:"subst",b:"\\$\\{",e:"\\}"}]},e.CLCM,e.CBCM,{cN:"number",v:[{b:"\\b(0[bB][01]+)"},{b:"\\b(0[oO][0-7]+)"},{b:e.CNR}],r:0},{b:"("+e.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[e.CLCM,e.CBCM,e.RM,{b:/</,e:/>\s*[);\]]/,r:0,sL:"xml"}],r:0},{cN:"function",bK:"function",e:/\{/,eE:!0,c:[e.inherit(e.TM,{b:/[A-Za-z$_][0-9A-Za-z$_]*/}),{cN:"params",b:/\(/,e:/\)/,eB:!0,eE:!0,c:[e.CLCM,e.CBCM],i:/["'\(]/}],i:/\[|%/},{b:/\$[(.]/},{b:"\\."+e.IR,r:0},{bK:"import",e:"[;$]",k:"import from as",c:[e.ASM,e.QSM]},{cN:"class",bK:"class",e:/[{;=]/,eE:!0,i:/[:"\[\]]/,c:[{bK:"extends"},e.UTM]}],i:/#/}});hljs.registerLanguage("php",function(e){var c={cN:"variable",b:"\\$+[a-zA-Z_-ÿ][a-zA-Z0-9_-ÿ]*"},a={cN:"preprocessor",b:/<\?(php)?|\?>/},i={cN:"string",c:[e.BE,a],v:[{b:'b"',e:'"'},{b:"b'",e:"'"},e.inherit(e.ASM,{i:null}),e.inherit(e.QSM,{i:null})]},n={v:[e.BNM,e.CNM]};return{aliases:["php3","php4","php5","php6"],cI:!0,k:"and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception default die require __FUNCTION__ enddeclare final try switch continue endfor endif declare unset true false trait goto instanceof insteadof __DIR__ __NAMESPACE__ yield finally",c:[e.CLCM,e.HCM,e.C("/\\*","\\*/",{c:[{cN:"doctag",b:"@[A-Za-z]+"},a]}),e.C("__halt_compiler.+?;",!1,{eW:!0,k:"__halt_compiler",l:e.UIR}),{cN:"string",b:"<<<['\"]?\\w+['\"]?$",e:"^\\w+;",c:[e.BE]},a,c,{b:/(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/},{cN:"function",bK:"function",e:/[;{]/,eE:!0,i:"\\$|\\[|%",c:[e.UTM,{cN:"params",b:"\\(",e:"\\)",c:["self",c,e.CBCM,i,n]}]},{cN:"class",bK:"class interface",e:"{",eE:!0,i:/[:\(\$"]/,c:[{bK:"extends implements"},e.UTM]},{bK:"namespace",e:";",i:/[\.']/,c:[e.UTM]},{bK:"use",e:";",c:[e.UTM]},{b:"=>"},i,n]}});hljs.registerLanguage("xml",function(t){var s="[A-Za-z0-9\\._:-]+",c={b:/<\?(php)?(?!\w)/,e:/\?>/,sL:"php"},e={eW:!0,i:/</,r:0,c:[c,{cN:"attribute",b:s,r:0},{b:"=",r:0,c:[{cN:"value",c:[c],v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s\/>]+/}]}]}]};return{aliases:["html","xhtml","rss","atom","xsl","plist"],cI:!0,c:[{cN:"doctype",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},t.C("<!--","-->",{r:10}),{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{title:"style"},c:[e],starts:{e:"</style>",rE:!0,sL:"css"}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{title:"script"},c:[e],starts:{e:"</script>",rE:!0,sL:["actionscript","javascript","handlebars"]}},c,{cN:"pi",b:/<\?\w+/,e:/\?>/,r:10},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"title",b:/[^ \/><\n\t]+/,r:0},e]}]}});hljs.registerLanguage("sql",function(e){var t=e.C("--","$");return{cI:!0,i:/[<>]/,c:[{cN:"operator",bK:"begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate savepoint release|0 unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup revoke",e:/;/,eW:!0,k:{keyword:"abort abs absolute acc acce accep accept access accessed accessible account acos action activate add addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias allocate allow alter always analyze ancillary and any anydata anydataset anyschema anytype apply archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound buffer_cache buffer_pool build bulk by byte byteordermark bytes c cache caching call calling cancel capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base char_length character_length characters characterset charindex charset charsetform charsetid check checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation collect colu colum column column_value columns columns_updated comment commit compact compatibility compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection consider consistent constant constraint constraints constructor container content contents context contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime customdatum cycle d data database databases datafile datafiles datalength date_add date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor deterministic diagnostics difference dimension direct_load directory disable disable_all disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div do document domain dotnet double downgrade drop dumpfile duplicate duration e each edition editionable editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding execu execut execute exempt exists exit exp expire explain export export_set extended extent external external_1 external_2 externally extract f failed failed_login_attempts failover failure far fast feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final finish first first_value fixed flash_cache flashback floor flush following follows for forall force form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ftp full function g general generated get get_format get_lock getdate getutcdate global global_name globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex hierarchy high high_priority hosts hour http i id ident_current ident_incr ident_seed identified identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile initial initialized initially initrans inmemory inner innodb input insert install instance instantiable instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists k keep keep_duplicates key keys kill l language large last|0 last_day last_insert_id last_value lax lcase lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit lines link|0 list|0 listagg little ln load load_file lob lobs local localtime localtimestamp locate locator lock|0 locked log log10 log2 logfile logfiles logging logical logical_reads_per_call logoff logon logs long loop|0 low low_priority lower lpad lrtrim ltrim m main make_set makedate maketime managed management manual map mapping mask master master_pos_wait match matched materialized max maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans md5 measures median medium member memcompress memory merge microsecond mid migration min minextents minimum mining minus minute minvalue missing mod mode model modification modify module monitoring month months mount move movement multiset mutex n name name_const names nan national native natural nav nchar nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck noswitch not nothing notice notrim novalidate now nowait nth_value nullif nulls num numb numbe nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary out outer outfile outline output over overflow overriding p package pad parallel parallel_enable parameters parent parse partial partition partitions pascal passing password password_grace_time password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction prediction_cost prediction_details prediction_probability prediction_set prepare present preserve prior priority private private_sga privileges procedural procedure procedure_analyze processlist profiles project prompt protection public publishingservername purge quarter query quick quiesce quota quotename radians raise|0 rand range rank raw read reads readsize rebuild record records recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy reject rekey relational relative relaylog release|0 release_lock relies_on relocate rely rem remainder repair repeat replace replicate replication required reset resetlogs resize resource respect restore restricted result result_cache resumable resume retention return returning returns reuse reverse revoke right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll sdo_georaster sdo_topo_geometry search sec_to_time second section securefile security seed segment self sequence sequential serializable server servererror session session_user sessions_per_user set sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone standby start starting startup statement static statistics stats_binomial_test stats_crosstab stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime t table tables tablespace tan tdo template temporary terminated tertiary_weights test than then thread through tier ties time time_format time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unpivot unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear wellformed when whene whenev wheneve whenever where while whitespace with within without work wrapped xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek",literal:"true false null",built_in:"array bigint binary bit blob boolean char character date dec decimal float int int8 integer interval number numeric real record serial serial8 smallint text varchar varying void"},c:[{cN:"string",b:"'",e:"'",c:[e.BE,{b:"''"}]},{cN:"string",b:'"',e:'"',c:[e.BE,{b:'""'}]},{cN:"string",b:"`",e:"`",c:[e.BE]},e.CNM,e.CBCM,t]},e.CBCM,t]}});hljs.registerLanguage("css",function(e){var c="[a-zA-Z-][a-zA-Z0-9_-]*",a={cN:"function",b:c+"\\(",rB:!0,eE:!0,e:"\\("},r={cN:"rule",b:/[A-Z\_\.\-]+\s*:/,rB:!0,e:";",eW:!0,c:[{cN:"attribute",b:/\S/,e:":",eE:!0,starts:{cN:"value",eW:!0,eE:!0,c:[a,e.CSSNM,e.QSM,e.ASM,e.CBCM,{cN:"hexcolor",b:"#[0-9A-Fa-f]+"},{cN:"important",b:"!important"}]}}]};return{cI:!0,i:/[=\/|'\$]/,c:[e.CBCM,r,{cN:"id",b:/\#[A-Za-z0-9_-]+/},{cN:"class",b:/\.[A-Za-z0-9_-]+/},{cN:"attr_selector",b:/\[/,e:/\]/,i:"$"},{cN:"pseudo",b:/:(:)?[a-zA-Z0-9\_\-\+\(\)"']+/},{cN:"at_rule",b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{cN:"at_rule",b:"@",e:"[{;]",c:[{cN:"keyword",b:/\S+/},{b:/\s/,eW:!0,eE:!0,r:0,c:[a,e.ASM,e.QSM,e.CSSNM]}]},{cN:"tag",b:c,r:0},{cN:"rules",b:"{",e:"}",i:/\S/,c:[e.CBCM,r]}]}});hljs.registerLanguage("json",function(e){var t={literal:"true false null"},i=[e.QSM,e.CNM],l={cN:"value",e:",",eW:!0,eE:!0,c:i,k:t},c={b:"{",e:"}",c:[{cN:"attribute",b:'\\s*"',e:'"\\s*:\\s*',eB:!0,eE:!0,c:[e.BE],i:"\\n",starts:l}],i:"\\S"},n={b:"\\[",e:"\\]",c:[e.inherit(l,{cN:null})],i:"\\S"};return i.splice(i.length,0,c,n),{c:i,k:t,i:"\\S"}});


/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

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
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
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
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
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
      out += this.renderer.codespan(escape(cap[2], true));
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
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
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
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
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
      return '<p>An error occured:</p><pre>'
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
  xhtml: false
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
 * Customize Plus v1.0.0 (https://knitkode.com/products/customize-plus)
 * Enhance and extend the WordPress Customizer.
 * Copyright (c) 2014-2017 KnitKode <dev@knitkode.com> (https://knitkode.com/)
 * @license SEE LICENSE IN license.txt (Last change on: 28-11-2017)
 */(function ($,marked,hljs,window$1,document,_,wp$1,pluginApi,Modernizr) {
  'use strict';

  var DEBUG = !!api.DEBUG;

  /**
   * Set default speed of jQuery animations
   */
  $.fx.speeds['_default'] = 180; // whitelisted from uglify \\

  /** @type {Object} It collects core components */
  pluginApi.core = pluginApi.core || {};

  /** @type {Object} It collects additional components */
  pluginApi.components = pluginApi.components || {};

  /** @type {Object} It collects controls, sections and panels prototypes */
  pluginApi.controls = pluginApi.controls || {};
  pluginApi.sections = pluginApi.sections || {};
  pluginApi.panels = pluginApi.panels || {};

  // exports Customize Plus API
  var api = pluginApi;

  /** @type {jQuery} */
  var $window = $(window$1);

  /** @type {jQuery} */
  var $document = $(document);

  /** @type {HTMLElement} */
  var body = document.getElementsByTagName('body')[0];

  /** @type {Object} */
  var wpApi = wp$1.customize;

  /** @type {jQuery.Deferred} */
  var $readyWP = $.Deferred();

  /** @type {jQuery.Deferred} */
  var $readyDOM = $.Deferred();

  /** @type {jQuery.Deferred} */
  var $ready = $.when($readyDOM, $readyWP);

  wpApi.bind('ready', function () { $readyWP.resolve(); });

  var _readyDOM = function (fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };
  _readyDOM(function () { $readyDOM.resolve(); });

 
  // var DEBUG = !!api.DEBUG; is injected through rollup
  if (DEBUG) {
    $ready.done(function () { console.log('global $ready.done()'); });

    DEBUG = {
      performances: false,
      compiler: false
    };
    // shim for Opera
    window$1.performance = window$1.performance || { now: function(){} };
    // var t = performance.now();

    // just useful aliases for debugging
    window$1.api = pluginApi;
    window$1.wpApi = wpApi;
  }

  // // be sure to have what we need, bail otherwise
  // if (!wp) {
  //   throw new Error('Missing crucial object `wp`');

  // // be sure to have what we need, bail otherwise
  // if (!pluginApi) {
  //   throw new Error('Missing crucial object `kkcp`');
  // }

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

  /* jshint maxlen: 1000 */

  /**
   * Regexes
   *
   * @class api.core.Regexes
   *
   * It might be that we need a regex that match of available words,
   * in that case it might be that we want to define the words in an
   * array (maybe coming from php?). So for array to regex conversion
   * do: `new RegExp(MY_VAR.join('|'), 'g')`. See {@link
   * http://stackoverflow.com/q/28280920/1938970 stackoverflow}.
   */
  var Regexes = {
    /**
     * Whitespaces global match
     *
     * To clean user input (most often when writing custom expressions)
     * so that it would later on be more easily parsable by our validation
     * regexes. Use this as follow: `string.replace(Regexes.whitespaces, '')`.
     *
     * {@link http://stackoverflow.com/a/5963202/1938970}
     *
     * @const
     * @type {RegExp}
     */
    _whitespaces: /\s+/g,
    /**
     * Grab all variables (sanitized user input)
     *
     * It capture a group from each `@variable-name` found
     *
     * @const
     * @type {RegExp}
     */
    _variables_match: /@([a-zA-Z-_0-9]+)/g,
    /**
     * Simple color function (raw user input)
     *
     * This just checks if the user input looks like a valid simple function
     * expression, so it's gentle with whitespace. It capture the number
     * (`amount`) but not to use it.
     *
     * {@link http://regex101.com/r/wC5aO9/3}
     *
     * @const
     * @type {RegExp}
     */
    _colorSimpleFunction_test: /^\s*[a-z]+\(\s*@[a-zA-Z-_0-9]+\,\s*(0\.[0-9]*[1-9][0-9]*|100|[1-9]\d?|[1-9]\d?\.[0-9]+)%?\s*\)\s*$/,
    /**
     * Simple color function (sanitized user input)
     *
     * This works only after having stripped all whitespaces,
     * it capture three groups: 'functionName', varName', 'amount'
     *
     * {@link http://regex101.com/r/nC7iA2/2}
     *
     * @const
     * @type {RegExp}
     */
    _colorSimpleFunction_match: /^([a-z]+)\(@([a-zA-Z-_0-9]+)\,(0\.[0-9]*[1-9][0-9]*|100|[1-9]\d?|[1-9]\d?\.[0-9]+)%?\)$/,
    /**
     * Simple variable (raw user input)
     *
     * This just checks if the user input looks like a single variable,
     * so it's gentle with whitespace.
     *
     * {@link https://regex101.com/r/aP9mJ1/1}
     *
     * @const
     * @type {RegExp}
     */
    _simpleVariable_test: /^\s*@[a-zA-Z-_0-9]+\s*$/,
    /**
     * Simple variable (sanitized user input)
     *
     * This works only after having stripped all whitespaces,
     * it capture one group: the `varName'
     *
     * {@link https://regex101.com/r/aO6fI9/2}
     *
     * @const
     * @type {RegExp}
     */
    _simpleVariable_match: /^@([a-zA-Z-_0-9]+)$/,
    /**
     * Variable (just grab a variable wherever it is)
     *
     * it capture one group: the `varName'
     *
     * @const
     * @type {RegExp}
     */
    _variable_match: /@([a-zA-Z-_0-9]+)/,
    /**
     * Extract unit, it returns the first matched, so the units are sorted by
     * popularity (approximately).
     *
     * @see http://www.w3schools.com/cssref/css_units.asp List of the css units
     * @const
     * @type {RegExp}
     */
    _extractUnit: /(px|%|em|rem|vh|vw|vmin|vmax|cm|mm|in|pt|pc|ch|ex)/,
    /**
     * Extract number from string (both integers or float)
     *
     * @see http://stackoverflow.com/a/17885985/1938970
     * @const
     * @type {RegExp}
     */
    _extractNumber: /(\+|-)?((\d+(\.\d+)?)|(\.\d+))/,
    /**
     * Detects if the shape of the string is that of a setting saved or to be
     * saved through the options API, e.g. `mytheme[a_setting_id]``
     *
     * @type {RegExp}
     */
    _optionsApi: new RegExp(api.constants['OPTIONS_PREFIX'] + '\\[.*\\]'),
    /**
     * Helps to understand if a url is absolute or relative
     *
     * @@todo test
     * @const
     * @type {RegExp}
     */
    _absoluteUrl: /^(?:[a-z]+:)?\/\//i,
    /**
     * Multiple slashes
     *
     * @@todo test
     * @const
     * @type {RegExp}
     */
    _multipleSlashes: /[a-z-A-Z-0-9_]{1}(\/\/+)/g
  };

  // export to public API
  var Regexes$1 = api.core.Regexes = Regexes;

  /**
   * Utils
   *
   * @class api.core.Utils
   */
  var Utils$1 = function Utils () {

    /** @type {string} */
    this._IMAGES_BASE_URL = api.constants['IMAGES_BASE_URL'];

    /** @type {string} */
    this._DOCS_BASE_URL = api.constants['DOCS_BASE_URL'];
  };

  /**
   * Is it an absolute URL?
   *
   * {@link http://stackoverflow.com/a/19709846/1938970}
   * @param{string}url The URL to test
   * @return {Boolean}   Whether is absolute or relative
   */
  Utils$1.prototype._isAbsoluteUrl = function _isAbsoluteUrl (url) {
    return Regexes$1._absoluteUrl.test(url);
  };
  /**
   * Clean URL from multiple slashes
   *
   * Strips possible multiple slashes caused by the string concatenation or dev errors
   *
   * @param{string} url
   * @return {string}
   */
  Utils$1.prototype._cleanUrlFromMultipleSlashes = function _cleanUrlFromMultipleSlashes (url) {
    return url.replace(Regexes$1._multipleSlashes, '/');
  };

  /**
   * Get a clean URL
   *
   * If an absolute URL is passed we just strip multiple slashes,
   * if a relative URL is passed we also prepend the right base url.
   *
   * @param{string} url
   * @param{string} type
   * @return {string}
   */
  Utils$1.prototype._getCleanUrl = function _getCleanUrl (url, type) {
    // return the absolute url
    var finalUrl = url;
    if (!this._isAbsoluteUrl(url)) {
      switch (type) {
        case 'img':
          finalUrl = this._IMAGES_BASE_URL + url;
          break;
        case 'docs':
          finalUrl = this._DOCS_BASE_URL + url;
          break;
        default:
          break;
      }
    }
    return this._cleanUrlFromMultipleSlashes(finalUrl);
  };

  /**
   * Get image url
   *
   * @static
   * @param{string} url The image URL, relative or absolute
   * @return {string}   The absolute URL of the image
   */
  Utils$1.prototype.getImageUrl = function getImageUrl (url) {
    return this._getCleanUrl(url, 'img');
  };

  /**
   * Get docs url
   *
   * @static
   * @param{string} url The docs URL, relative or absolute
   * @return {string}   The absolute URL of the docs
   */
  Utils$1.prototype.getDocsUrl = function getDocsUrl (url) {
    return this._getCleanUrl(url, 'docs');
  };

  /**
   * Bind a link element or directly link to a specific control to focus
   *
   * @static
   * @param{HTMLElement} linkEl The link DOM element `<a>`
   * @param{string} controlId The control id to link to
   */
  Utils$1.prototype.linkControl = function linkControl (linkEl, controlId) {
      var this$1 = this;

    var controlToFocus = wpApi.control(controlId);

    // be sure there is the control and update dynamic color message text
    if (controlToFocus) {
      if (linkEl) {
        linkEl.onclick = function () {
          this$1.focus(controlToFocus);
        };
      } else {
        this.focus(controlToFocus);
      }
    }
  };

  /**
   * Wrap WordPress control focus with some custom stuff
   *
   * @param {wp.customize.control} control
   */
  Utils$1.prototype.focus = function focus (control) {
    try {
      // try this so it become possible to use this function even
      // with WordPress native controls which don't have this method
      control.inflate(true);

      // always disable search, it could be that we click on this
      // link from a search result try/catch because search is not
      // always enabled
      api.components.Search.disable();
    } catch(e) {}
    control.focus();
    control.container.addClass('kkcp-control-focused');
    setTimeout(function () {
      control.container.removeClass('kkcp-control-focused');
    }, 2000);
  };

  /**
   * Reset control -> setting value to the value according
   * to the given mode argument
   *
   * @static
   * @param{Control} controlThe control whose setting has to be reset
   * @param{string} resetType Either `'initial'` or `'factory'`
   * @return {boolean}        Whether the reset has succeded
   */
  Utils$1.prototype.resetControl = function resetControl (control, resetType) {
    var params = control.params;
    if (!control.setting) {
      return true;
    }
    var value;
    if (resetType === 'last' && !_.isUndefined(params.vLast)) {
      value = params.vLast;
    } else if (resetType === 'initial') {
      value = params.vInitial;
    } else if (resetType === 'factory') {
      value = params.vFactory;
    }
    if (value) {
      control.setting.set(value);
      return true;
    } else {
      return false;
    }
  };

  /**
   * Check if the given type of reset is needed for a specific control
   *
   * @static
   * @param{Control} controlThe control which need to be checked
   * @param{string} resetType Either `'initial'` or `'factory'`
   * @return {boolean}        Whether the reset has succeded
   */
  Utils$1.prototype._isResetNeeded = function _isResetNeeded (control, resetType) {
    var params = control.params;
    if (!control.kkcp || !control.setting) {
      return false;
    }
    var _softenize = control.softenize;
    var value = _softenize(control.setting());
    if (resetType === 'last' && !_.isUndefined(params.vLast)) {
      return value !== _softenize(params.vLast);
    } else if (resetType === 'initial') {
      return value !== _softenize(params.vInitial);
    } else if (resetType === 'factory') {
      return value !== _softenize(params.vFactory);
    }
  };

  /**
   * Force `setting.set`.
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
   * The callback that should be called on reset (the `syncUIfromAPI` method)
   * in this scenario doesn't get called because in the WordPress
   * `customize-base.js#187` there is a check that return the function if the
   * setting has been set with the same value as the last one, preventing so
   * to fire the callbacks binded to the setting and, with these, also our
   * `syncUIfromAPI` that would update the UI, that is our input field with
   * the resetted value. To overcome this problem we can force the setting to
   * set anyway by temporarily set the private property `_value` to a dummy
   * value and then re-setting the setting to the desired value, in this way
   * the callbacks are fired and the UI get back in sync.
   *
   * @static
   * @param{wp.customize.Setting} setting
   * @param{string} value
   */
  Utils$1.prototype._forceSettingSet = function _forceSettingSet (setting, value, dummyValue) {
    setting['_value'] = dummyValue || 'dummy'; // whitelisted from uglify \\
    setting.set(value);
  };

  /**
   * Is setting value (`control.setting()`) empty?
   * Used to check if required control's settings have instead an empty value
   *
   * @see php class method `KKcp_Sanitize::is_setting_value_empty()`
   * @static
   * @param{string}value
   * @return {Boolean}
   */
  Utils$1.prototype._isSettingValueEmpty = function _isSettingValueEmpty (value) {
    // first try to compare it to an empty string
    if (value === '') {
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
  };

  /**
   * Each control execute callback with control as argument
   *
   * @static
   * @param {function} callback
   */
  Utils$1.prototype._eachControl = function _eachControl (callback) {
    var wpApiControl = wpApi.control;
    for (var controlId in wpApi.settings.controls) {
      var control = wpApiControl(controlId);
     
      if (control && control.setting) {
        callback(control);
      }
    }
  };

  /**
   * Is the control's setting using the `theme_mods` API?
   *
   * @static
   * @param{string}controlId The control id
   * @return {Boolean}
   */
  Utils$1.prototype._isThemeModsApi = function _isThemeModsApi (controlId) {
    return !Regexes$1._optionsApi.test(controlId);
  };

  /**
   * Is the control's setting using the `options` API?
   * Deduced by checking that the control id is structured as:
   * `themeprefix[setting-id]`
   *
   * @static
   * @param{string}controlId The control id
   * @return {Boolean}
   */
  Utils$1.prototype._isOptionsApi = function _isOptionsApi (controlId) {
    return Regexes$1._optionsApi.test(controlId);
  };

  /**
   * Strip HTML from input
   * {@link http://stackoverflow.com/q/5002111/1938970}
   *
   * @static
   * @param{string} input
   * @return {string}
   */
  Utils$1.prototype._stripHTML = function _stripHTML (input) {
    return $(document.createElement('div')).html(input).text();
  };

  /**
   * Selectize render option function
   *
   * @abstract
   * @static
   * @param{Object} data   The selectize option object representation.
   * @param{function} escape Selectize escape function.
   * @return {string}        The option template.
   */
  Utils$1.prototype._selectizeRenderOptionSize = function _selectizeRenderOptionSize (data, escape) {
    return '<div class="kkcpsize-selectOption">' +
        '<i>' + escape(data.valueCSS) + '</i> ' + escape(data.label) +
      '</div>';
  };

  /**
   * Selectize render option function
   *
   * @abstract
   * @static
   * @param{Object} data   The selectize option object representation.
   * @param{function} escape Selectize escape function.
   * @return {string}        The option template.
   */
  Utils$1.prototype._selectizeRenderOptionColor = function _selectizeRenderOptionColor (data, escape) {
    return '<div class="kkcpcolor-selectOption" style="border-color:' +
      escape(data.valueCSS) + '">' + escape(data.label) + '</div>';
  };

  /**
   * Get stylesheet by Node id
   *
   * @abstract
   * @static
   * @param{string} nodeId
   * @return {?HTMLElement}
   */
  Utils$1.prototype._getStylesheetById = function _getStylesheetById (nodeId) {
    var stylesheets = document.styleSheets;
    try {
      for (var i = 0, l = stylesheets.length; i < l; i++) {
        if (stylesheets[i].ownerNode.id === nodeId) {
          return stylesheets[i];
        }
      }
    } catch(e) {
      return null;
    }
  };

  /**
   * Get rules from stylesheet for the given selector
   *
   * @abstract
   * @static
   * @param{HTMLElement} stylesheet
   * @param{string} selector
   * @return {string}
   */
  Utils$1.prototype._getRulesFromStylesheet = function _getRulesFromStylesheet (stylesheet, selector) {
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
  };

  /**
   * Get CSS (property/value pairs) from the given rules.
   *
   * Basically it just clean the `rules` string removing the selector and
   * the brackets.
   *
   * @param{string} rules
   * @param{string} selector
   * @return {string}
   */
  Utils$1.prototype._getCssRulesContent = function _getCssRulesContent (rules, selector) {
    var regex = new RegExp(selector, 'g');
    var output = rules.replace(regex, '');
    output = output.replace(/({|})/g, '');
    return output.trim();
  };

  // export to public API
  var Utils = api.core.Utils = new Utils$1();

  function unwrapExports (x) {
  	return x && x.__esModule ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var assertString_1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = assertString;
  function assertString(input) {
    if (typeof input !== 'string') {
      throw new TypeError('This library (validator.js) validates strings only');
    }
  }
  module.exports = exports['default'];
  });

  var isHexColor_1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isHexColor;

  var _assertString = assertString_1;

  var _assertString2 = _interopRequireDefault(_assertString);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;

  function isHexColor(str) {
    (0, _assertString2.default)(str);
    return hexcolor.test(str);
  }
  module.exports = exports['default'];
  });

  var isHexColor = unwrapExports(isHexColor_1);

  var matches_1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = matches;

  var _assertString = assertString_1;

  var _assertString2 = _interopRequireDefault(_assertString);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function matches(str, pattern, modifiers) {
    (0, _assertString2.default)(str);
    if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
      pattern = new RegExp(pattern, modifiers);
    }
    return pattern.test(str);
  }
  module.exports = exports['default'];
  });

  // import { api } from './globals';
  /**
   * Color validation utility
   *
   * Heavily inspired by formvalidation.js
   * by Nguyen Huu Phuoc, aka @nghuuphuoc and contributors
   * {@link https://github.com/formvalidation/}
   *
   * @type {Object}
   */
  var _validatorColor = {
    types: [ 'hex', 'rgb', 'rgba', 'hsl', 'hsla', 'keyword' ],
    // available also on `less.js` global var `less.data.colors` as Object
    keywords: {
      'aliceblue': 0,
      'antiquewhite': 0,
      'aqua': 0,
      'aquamarine': 0,
      'azure': 0,
      'beige': 0,
      'bisque': 0,
      'black': 0,
      'blanchedalmond': 0,
      'blue': 0,
      'blueviolet': 0,
      'brown': 0,
      'burlywood': 0,
      'cadetblue': 0,
      'chartreuse': 0,
      'chocolate': 0,
      'coral': 0,
      'cornflowerblue': 0,
      'cornsilk': 0,
      'crimson': 0,
      'cyan': 0,
      'darkblue': 0,
      'darkcyan': 0,
      'darkgoldenrod': 0,
      'darkgray': 0,
      'darkgreen': 0,
      'darkgrey': 0,
      'darkkhaki': 0,
      'darkmagenta': 0,
      'darkolivegreen': 0,
      'darkorange': 0,
      'darkorchid': 0,
      'darkred': 0,
      'darksalmon': 0,
      'darkseagreen': 0,
      'darkslateblue': 0,
      'darkslategray': 0,
      'darkslategrey': 0,
      'darkturquoise': 0,
      'darkviolet': 0,
      'deeppink': 0,
      'deepskyblue': 0,
      'dimgray': 0,
      'dimgrey': 0,
      'dodgerblue': 0,
      'firebrick': 0,
      'floralwhite': 0,
      'forestgreen': 0,
      'fuchsia': 0,
      'gainsboro': 0,
      'ghostwhite': 0,
      'gold': 0,
      'goldenrod': 0,
      'gray': 0,
      'green': 0,
      'greenyellow': 0,
      'grey': 0,
      'honeydew': 0,
      'hotpink': 0,
      'indianred': 0,
      'indigo': 0,
      'ivory': 0,
      'khaki': 0,
      'lavender': 0,
      'lavenderblush': 0,
      'lawngreen': 0,
      'lemonchiffon': 0,
      'lightblue': 0,
      'lightcoral': 0,
      'lightcyan': 0,
      'lightgoldenrodyellow': 0,
      'lightgray': 0,
      'lightgreen': 0,
      'lightgrey': 0,
      'lightpink': 0,
      'lightsalmon': 0,
      'lightseagreen': 0,
      'lightskyblue': 0,
      'lightslategray': 0,
      'lightslategrey': 0,
      'lightsteelblue': 0,
      'lightyellow': 0,
      'lime': 0,
      'limegreen': 0,
      'linen': 0,
      'magenta': 0,
      'maroon': 0,
      'mediumaquamarine': 0,
      'mediumblue': 0,
      'mediumorchid': 0,
      'mediumpurple': 0,
      'mediumseagreen': 0,
      'mediumslateblue': 0,
      'mediumspringgreen': 0,
      'mediumturquoise': 0,
      'mediumvioletred': 0,
      'midnightblue': 0,
      'mintcream': 0,
      'mistyrose': 0,
      'moccasin': 0,
      'navajowhite': 0,
      'navy': 0,
      'oldlace': 0,
      'olive': 0,
      'olivedrab': 0,
      'orange': 0,
      'orangered': 0,
      'orchid': 0,
      'palegoldenrod': 0,
      'palegreen': 0,
      'paleturquoise': 0,
      'palevioletred': 0,
      'papayawhip': 0,
      'peachpuff': 0,
      'peru': 0,
      'pink': 0,
      'plum': 0,
      'powderblue': 0,
      'purple': 0,
      'red': 0,
      'rosybrown': 0,
      'royalblue': 0,
      'saddlebrown': 0,
      'salmon': 0,
      'sandybrown': 0,
      'seagreen': 0,
      'seashell': 0,
      'sienna': 0,
      'silver': 0,
      'skyblue': 0,
      'slateblue': 0,
      'slategray': 0,
      'slategrey': 0,
      'snow': 0,
      'springgreen': 0,
      'steelblue': 0,
      'tan': 0,
      'teal': 0,
      'thistle': 0,
      'tomato': 0,
      'transparent': 0,
      'turquoise': 0,
      'violet': 0,
      'wheat': 0,
      'white': 0,
      'whitesmoke': 0,
      'yellow': 0,
      'yellowgreen': 0
    },
    hex: function(value) {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
    },
    hsl: function(value) {
      return /^hsl\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/.test(value);
    },
    hsla: function(value) {
      return /^hsla\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/.test(value);
    },
    keyword: function(value) {
      return !!this.keywords[value];
    },
    rgb: function(value) {
      var regexInteger = /^rgb\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){2}(\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*)\)$/;
      var regexPercent = /^rgb\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/;
      return regexInteger.test(value) || regexPercent.test(value);
    },
    rgba: function(value) {
      var regexInteger = /^rgba\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
      var regexPercent = /^rgba\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
      return regexInteger.test(value) || regexPercent.test(value);
    }
  };

  /**
   * Is Color
   * @param  {string} str The string to validate
   * @return {boolean}    Whether is valid or not.
   */


  /**
   * Is keyword Color
   * @param  {string} str The string to validate
   * @return {boolean}    Whether is valid or not.
   */


  /**
   * Is rgba Color
   * @param  {string} str The string to validate
   * @return {boolean}    Whether is valid or not.
   */
  function isRgbaColor (str) {
    return _validatorColor.rgba(str);
  }

  /**
   * Is Var
   * @param  {string} str The string to validate
   * @return {boolean}    Whether is valid or not.
   */


  /**
   * Is Multiple of
   *
   * Take a look at the {@link http://stackoverflow.com/q/12429362/1938970
   * stackoverflow question} about this topic. This solution is an ok
   * compromise. We use `Math.abs` to convert negative number to positive
   * otherwise the minor comparison would always return true for negative
   * numbers.
   *
   * @param  {string}  number   [description]
   * @param  {string}  multiple [description]
   * @return {Boolean}          [description]
   */
  function isMultipleOf (number1, number2) {
    var a = Math.abs(number1);
    var b = Math.abs(number2);
    var result = Math.round( Math.round(a * 100000) % Math.round(b * 100000) ) / 100000;
    return result < 1e-5;
  }

  /**
   * Is HTML?
   *
   * It tries to use the DOMParser object (see Browser compatibility table
   * [here](mzl.la/2kh7HEl)), otherwise it just.
   * Solution inspired by this [stackerflow answer](http://bit.ly/2k6uFLI)
   *
   *
   * @param  {string}  str
   * @return {Boolean}
   */


  /**
   * To Boolean
   * '0' or '1' to boolean
   *
   * @static
   * @param  {strin|number} value
   * @return {boolean}
   */
  function numberToBoolean (value) {
    return typeof value === 'boolean' ? value : !!parseInt(value, 10);
  }

  // export to public API
  // export default api.core.Validators = Validators;

  /**
   * WordPress Tight
   *
   * We can put some logic in private functions to grab the
   * right things in case WordPress change stuff across versions
   *
   * @class api.core.WpTight
   */
  var WpTight = (function () {

    /**
     * The id of the WordPress core css with the color schema
     *
     * @private
     * @internal
     * @type {string}
     */
    var _colorSchemaCssId = 'colors-css';

    /**
     * The WordPress color schema useful selectors
     *
     * @private
     * @internal
     * @type {Object}
     */
    var _colorSchemaSelectors = {
      _primary: '.wp-core-ui .wp-ui-primary',
      _textPrimary: '.wp-core-ui .wp-ui-text-primary',
      _linksPrimary: '#adminmenu .wp-submenu .wp-submenu-head',
      _highlight: '.wp-core-ui .wp-ui-highlight',
      _textHighlight: '.wp-core-ui .wp-ui-text-highlight',
      _linksHighlight: '#adminmenu a',
      _notificationColor: '.wp-core-ui .wp-ui-text-notification'
    };

    /**
     * Get WordPress Admin colors
     *
     * @abstract
     * @return {object}
     */
    function _getWpAdminColors () {
      var stylesheet = Utils._getStylesheetById(_colorSchemaCssId);
      var schema = _colorSchemaSelectors;
      var output = {};
      for (var key in schema) {
        if (schema.hasOwnProperty(key)) {
          var selector = schema[key];
          var rules = Utils._getRulesFromStylesheet(stylesheet, selector);
          output[key] = Utils._getCssRulesContent(rules, selector);
        }
      }
      return output;
    }

    // @access public
    return {
      /**
       * Init
       *
       * @return {void}
       */
      init: function () {
        /**
         * WordPress UI elements
         *
         * @type {Object.<string, jQuery|HTMLElement>}
         */
        var el = this.el = {};

        /** @type {JQuery} */
        el.container = $('.wp-full-overlay');
        /** @type {JQuery} */
        el.controls = $('#customize-controls');
        /** @type {JQuery} */
        el.themeControls = $('#customize-theme-controls');
        /** @type {JQuery} */
        el.preview = $('#customize-preview');
        /** @type {JQuery} */
        el.header = $('#customize-header-actions');
        /** @type {JQuery} */
        el.footer = $('#customize-footer-actions');
        /** @type {JQuery} */
        el.devices = el.footer.find('.devices');
        /** @type {JQuery} */
        el.close = el.header.find('.customize-controls-close');
        /** @type {JQuery} */
        el.sidebar = $('.wp-full-overlay-sidebar-content');
        /** @type {JQuery} */
        el.info = $('#customize-info');
        /** @type {JQuery} */
        el.customizeControls = $('#customize-theme-controls').find('ul').first();
      },
      /**
       * The suffix appended to the styles ids by WordPress when enqueuing them
       * through `wp_enqueue_style`
       *
       * @type {string}
       */
      cssSuffix: '-css',
      /**
       * WordPress Admin colors
       *
       * @private
       * @internal
       * @type {object}
       */
      _colorSchema: _getWpAdminColors(),
      /**
       * WordPress query parameters used in the customize app url
       */
      _customizeQueryParamsKeys: [
        'changeset_uuid', // e.g. e6ba8e82-e628-4d6e-b7b4-39a480bc043c
        'customize_snapshot_uuid' // e.g. 52729bb7-9686-496e-90fa-7170405a5502
      ]
    };
  })();

  $readyDOM.then(WpTight.init.bind(WpTight));

  // export to public API
  api.core.WpTight = WpTight;

  /**
   * Skeleton element wrappers
   *
   * @class api.core.Skeleton
   * @requires Modernizr
   */
  var Skeleton = (function () {

    /** @type {JQuery} */
    var _$deferredDom = $.Deferred();

    // @access public
    return {
      /**
       * Init
       */
      init: function () {
        $readyDOM.then(this._initOnDomReady.bind(this));
      },
      /**
       * Init on DOM ready
       */
      _initOnDomReady: function () {
        // set elements as properties
        this._loader = document.getElementById('kkcp-loader-preview');
        this.$loader = $(this._loader);
        this.img = document.getElementById('kkcp-loader-img');
        this.title = document.getElementById('kkcp-loader-title');
        this.text = document.getElementById('kkcp-loader-text');
        this._loaderSidebar = document.getElementById('kkcp-loader-sidebar');
        this.$loaderSidebar = $(this._loaderSidebar);

        _$deferredDom.resolve();
        // the first time the iframe preview has loaded hide the skeleton loader
        wpApi.previewer.targetWindow.bind(this._hideLoaderPreview.bind(this));
      },
      /**
       * Trigger loading UI state (changes based on added css class)
       */
      loading: function () {
        body.classList.add('kkcp-loading');
      },
      /**
       * Remove loading UI state
       */
      loaded: function () {
        body.classList.remove('kkcp-loading');
      },
      /**
       * Show 'full page' loader
       */
      show: function (what) {
        var this$1 = this;

        _$deferredDom.done(function () {
          if (!what || what === 'preview') {
            this$1._loader.style.display = 'block';
          }
          if (!what || what === 'sidebar') {
            this$1._loaderSidebar.style.display = 'block';
          }
        });
      },
      /**
       * Hide loaders overlays, use jQuery animation if the browser supports
       * WebWorkers (this is related to the Premium Compiler component)
       * @param {string} what What to hide: 'preview' or 'sidebar' (pass nothing
       *                      to hide both)
       */
      hide: function (what) {
        var this$1 = this;

        _$deferredDom.done(function () {
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
      },
      /**
       * Hide loader and unbind itself
       * (we could also take advantage of the underscore `once` utility)
       */
      _hideLoaderPreview: function () {
        this.hide('preview');
        wpApi.previewer.targetWindow.unbind(this._hideLoaderPreview);
      }
    };
  })();

  // Initialize
  Skeleton.init();

  // export to public API
  api.core.Skeleton = Skeleton;

  /**
   * Tabs
   *
   * Manage tabbed content inside controls
   *
   * @class api.core.Tabs
   * @requires api.components.Screenpreview
   */
  var Tabs = (function () {

    /**
     * Class name for a selected tab
     * @type {string}
     */
    var CLASS_TAB_SELECTED = 'selected';

    /**
     * Tab selector (for jQuery)
     * @type {string}
     */
    var SELECTOR_TAB = '.kkcp-tab';

    /**
     * Tab content selector (for jQuery)
     * @type {string}
     */
    var SELECTOR_TAB_CONTENT = '.kkcp-tab-content';

    /**
     * Uses event delegation so we are able to bind our 'temporary'
     * DOM removed and reappended by the controls
     */
    function _init () {
      $document.on('click', SELECTOR_TAB, function() {
        var area = this.parentNode.parentNode; // kkcptoimprove \\
        var tabs = area.getElementsByClassName('kkcp-tab');
        var panels = area.getElementsByClassName('kkcp-tab-content');
        var isScreenPicker = area.classList.contains('kkcp-screen-picker');
        var tabAttrName = isScreenPicker ? 'data-screen' : 'data-tab';
        var target = this.getAttribute(tabAttrName);

        // remove 'selected' class from all the other tab links
        for (var i = tabs.length - 1; i >= 0; i--) {
          tabs[i].classList.remove(CLASS_TAB_SELECTED);
        }
        // add the 'selected' class to the clicked tab link
        this.className += ' ' + CLASS_TAB_SELECTED;

        // loop through panels and show the current one
        for (var j = panels.length - 1; j >= 0; j--) {
          var panel = panels[j];
          var $panelInputs = $('input, .ui-slider-handle', panel);
          if (panel.getAttribute(tabAttrName) === target) {
            panel.classList.add(CLASS_TAB_SELECTED);
            // reset manual tabIndex to normal browser behavior
            $panelInputs.attr('tabIndex', '0');
          } else {
            panel.classList.remove(CLASS_TAB_SELECTED);
            // exclude hidden `<input>` fields from keyboard navigation
            $panelInputs.attr('tabIndex', '-1');
          }
        }

        // if this tabbed area is related to the screenpreview then notify it
        if (isScreenPicker) {
          // we might not have the Screenpreview component enabled
          try {
            api.components.Screenpreview.setDevice(target);
          } catch(e) {
            console.warn('Tabs tried to use Screenpreview, which is undefined.', e);
          }
        }
      });
    }

    /**
     * Update Screen Picker Tabs
     * @param  {int|string} size   The size to which update the tabs
     * @param  {JQuery} $container An element to use as context to look for
     *                             screen pickers UI DOM
     */
    function _updateScreenPickerTabs (size, $container) {
      var $screenPickers = $('.kkcp-screen-picker', $container);
      $screenPickers.each(function () {
        var $area = $(this);
        var $tabs = $area.find(SELECTOR_TAB);
        var $panels = $area.find(SELECTOR_TAB_CONTENT);
        var filter = function () {
          return this.getAttribute('data-screen') === size;
        };
        var $tabActive = $tabs.filter(filter);
        var $panelActive = $panels.filter(filter);
        $tabs.removeClass(CLASS_TAB_SELECTED);
        $panels.removeClass(CLASS_TAB_SELECTED);
        $tabActive.addClass(CLASS_TAB_SELECTED);
        $panelActive.addClass(CLASS_TAB_SELECTED);
      });
    }

    // @access public
    return {
      init: _init,
      /**
       * Update statuses of all tabs on page up to given screen size.
       *
       * @param  {string} size Screenpreview size (`xs`, `sm`, `md`, `lg`)
       */
      changeSize: function (size) {
        _updateScreenPickerTabs(size, document);
      },
      /**
       * Sync the tabs within the given container
       * with current Screenpreview size
       *
       * @param {JQuery} $container A container with tabbed areas (probably a
       *                            control container)
       */
      syncSize: function ($container) {
        // we might not have the Screenpreview component enabled
        try {
          _updateScreenPickerTabs(api.components.Screenpreview.getSize(), $container);
        } catch(e) {
          console.warn('Tabs tried to use Screenpreview, which is undefined.', e);
        }
      }
    };
  })();

  $readyDOM.then(Tabs.init.bind(Tabs));

  // export to public API
  api.core.Tabs = Tabs;

  /**
   * Tooltips
   *
   * Manage tooltips using jQuery UI Tooltip
   *
   * @class api.core.Tooltips
   * @requires jQueryUI.Tooltip
   */
  var Tooltips = (function () {

    /**
     * @const
     * @type {string}
     */
    var BASE_CLASS = '.kkcpui-tooltip';

    /**
     * @const
     * @type {Array<Object<string, string>>}
     */
    var ALLOWED_POSITIONS = [{
      _name: 'top',
      _container: $document,
      _position: {
        my: 'center bottom-2',
        at: 'center top-5'
      }
    }, {
      _name: 'bottom',
      _container: $(body),
      _position: {
        my: 'center top+2',
        at: 'center bottom+5'
      }
    }];

    /**
     * @const
     * @type {Object<string,boolean|string>}
     */
    var DEFAULT_OPTIONS = {
      show: false,
      hide: false
    };

    /**
     * Init tooltips for each allowed position
     */
    function _init () {
      for (var i = ALLOWED_POSITIONS.length - 1; i >= 0; i--) {
        var custom = ALLOWED_POSITIONS[i];
        var options = _.defaults({
          items: BASE_CLASS + '--' + custom._name,
          classes: {
            'ui-tooltip': custom._name,
          },
         
          tooltipClass: custom._name,
          position: custom._position
        }, DEFAULT_OPTIONS);

        // this should stay the same
        options.position.collision = 'flipfit';

        // init tooltip (it uses event delegation)
        // to have different tooltips positining we need a different container
        // for each initialisation otherwise each overlap each other.
        custom._container.tooltip(options);
      }
    }

    // @access public
    return {
      init: _init
    };
  })();

  $readyDOM.then(Tooltips.init.bind(Tooltips));

  // export to public API
  api.core.Tooltips = Tooltips;

  /**
   * Control Base class
   *
   * Change a bit the default Customizer Control class.
   * Render controls content on demand when their section is expanded then remove
   * the DOM when the section is collapsed. Since we override the `initialize`
   * and `renderContent` methods keep an eye on
   * @link(http://git.io/vZ6Yq, WordPress source code).
   *
   * @see PHP class KKcp_Customize_Control_Base.
   *
   * @class api.controls.Base
   * @extends wp.customize.Control
   * @augments wp.customize.Class
   * @requires api.core.Skeleton
   * @requires api.core.Utils
   */
  api.controls.Base = wpApi.Control.extend({
    /**
     * Tweak the initialize methods.
     * @param {string} id                       - Unique identifier for the control instance.
       * @param {object} options                  - Options hash for the control instance.
       * @param {object} options.type             - Type of control (e.g. text, radio, dropdown-pages, etc.)
       * @param {string} [options.content]        - The HTML content for the control or at least its container. This should normally be left blank and instead supplying a templateId.
       * @param {string} [options.templateId]     - Template ID for control's content.
       * @param {string} [options.priority=10]    - Order of priority to show the control within the section.
       * @param {string} [options.active=true]    - Whether the control is active.
       * @param {string} options.section          - The ID of the section the control belongs to.
       * @param {mixed}  [options.setting]        - The ID of the main setting or an instance of this setting.
       * @param {mixed}  options.settings         - An object with keys (e.g. default) that maps to setting IDs or Setting/Value objects, or an array of setting IDs or Setting/Value objects.
       * @param {mixed}  options.settings.default - The ID of the setting the control relates to.
       * @param {string} options.settings.data    - @todo Is this used?
       * @param {string} options.label            - Label.
       * @param {string} options.description      - Description.
       * @param {number} [options.instanceNumber] - Order in which this instance was created in relation to other instances.
       * @param {object} [options.params]         - Deprecated wrapper for the above properties.
       * @returns {void}
       */
    initialize: function(id, options) {
      var control = this;
      var deferredSettingIds = [];
      var gatherSettings;
      var settings;
      var advancedClass;

      control.params = _.extend(
        {},
        control.defaults,
        control.params || {}, // In case sub-class already defines.
        options.params || options || {} // The options.params property is deprecated, but it is checked first for back-compat.
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
        _.find( wpApi.controlConstructor, function( Constructor, type ) {
          if ( Constructor === control.constructor ) {
            control.params.type = type;
            return true;
          }
          return false;
        } );
      }

      // if ( ! control.params.content ) {
      //   control.params.content = $( '<li></li>', {
      //     id: 'customize-control-' + id.replace( /]/g, '' ).replace( /\[/g, '-' ),
      //     'class': 'customize-control customize-control-' + control.params.type
      //   } );
      // }

      advancedClass = control.params.advanced ? ' kkcp-control-advanced' : '';

      var container = document.createElement('li');
      container.id = 'customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
      container.className = 'customize-control kkcp-control customize-control-'
        + control.params.type + advancedClass;

      // add a flag so that we are able to recognize our custom controls, let's
      // keep it short, so we need only to check `if (control.kkcp)`
      control.kkcp = 1;

      control.id = id;
      // control.selector = '#customize-control-' + id.replace( /\]/g, '' ).replace( /\[/g, '-' );
      // control.templateSelector = 'customize-control-' + control.params.type + '-content';
      // if ( control.params.content ) {
      //   control.container = $( control.params.content );
      // } else {
      //   control.container = $( control.selector ); // Likely dead, per above. See #28709.
      // }
      control.container = $(container);

      // save a reference of the raw DOM node, we're gonna use it more
      // than the jQuery object `container` (which we can't change, because it's
      // used by methods which we don't override)
      control._container = container;

      if ( control.params.templateId ) {
        control.templateSelector = control.params.templateId;
      } else {
        control.templateSelector = 'customize-control-' + control.params.type + '-content';
      }

      control.deferred = _.extend( control.deferred || {}, {
        embedded: new $.Deferred()
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
        args = $.extend( {}, control.defaultActiveArguments, args );
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
      _.extend( settings, control.params.settings );

      // Note: Settings can be an array or an object, with values being either setting IDs or Setting (or Value) objects.
      _.each( settings, function( value, key ) {
        var setting;
        if ( _.isObject( value ) && _.isFunction( value.extended ) && value.extended( wpApi.Value ) ) {
          control.settings[ key ] = value;
        } else if ( _.isString( value ) ) {
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
        _.each( settings, function ( settingId, key ) {
          if ( ! control.settings[ key ] && _.isString( settingId ) ) {
            control.settings[ key ] = wpApi( settingId );
          }
        } );

        // Make sure settings passed as array gets associated with default.
        if ( control.settings[0] && ! control.settings['default'] ) {
          control.settings['default'] = control.settings[0];
        }

        // Identify the main setting.
        control.setting = control.settings['default'] || null;

        // control.linkElements();
        // either deflate and re-inflate dom each time...
        // if (expanded) {
        //   _.defer(control.inflate.bind(control));
        // } else {
        //   control.deflate();
        // }
        // ...or just do it the first time a control is expanded
        if (expanded && !control.rendered) {
          _.defer(control.inflate.bind(control));
        }
      });

      // controls can be setting-less from 4.5
      if (control.setting) {
        // Add custom validation function overriding the empty function from WP
        // API in `customize-controls.js`, in the constructor `api.Value`
        control.setting.validate = control._validateWrap.bind(control);

        // bind setting change to control method to reflect a programmatic
        // change on the UI, only if the control is rendered
        control.setting.bind(function (value) {
          if (control.rendered) {
            control.syncUI.call(control, value);
          }
        });
      }
    },
    /**
     * Validate wrap function.
     * Always check that required setting (not `optional`) are not empty,
     * if it pass the check call the control specific abstract `validate` method.
     *
     *
     * @access private
     * @param  {string} newValue
     * @return {string} The newValue validated or the last setting value.
     */
    _validateWrap: function (newValue) {
      if (!this.params.optional && Utils._isSettingValueEmpty(newValue)) {
        this._onValidateError({ error: true, msg: api.l10n['vRequired'] });
        this._currentValueHasError = true;
        return this.setting();

      } else {
        newValue = this.sanitize(newValue);
        var validationResult = this.validate(newValue);

        if (validationResult.error) {
          this._onValidateError(validationResult);
          this._currentValueHasError = true;
          return this.setting();
        } else {
          this._onValidateSuccess(validationResult);
          this._currentValueHasError = false;
          return validationResult;
        }
      }
    },
    /**
     * On validation error (optionally override it in subclasses)
     * @abstract
     * @access private
     * @param  {Object<string,boolean|string>} error `{ error: true, msg: string }`
     */
    _onValidateError: function (error) {
      var msg = error && error.msg ? error.msg : api.l10n['vInvalid'];
      var id = (this.id) + "__error_" + (msg.replace(/\s/g, ''));

      if (!this._currentNotificationId || id !== this._currentNotificationId) {
        console.log(("Control adds notification with id: " + id));
        var notification = new wpApi.Notification(id, { type: 'error', message: msg });
        // debugger;
        this.notifications.add(notification);
        this.notifications.render();

        this._currentNotificationId = id;
      }
    },
    /**
     * On validation success (optionally override it in subclasses)
     * @abstract
     * @access private
     */
    _onValidateSuccess: function () {
      if (this._currentNotificationId) {
        this.notifications.remove(this._currentNotificationId);
        this.notifications.render();
        console.log(("Control removes notification with id: " + (this._currentNotificationId)));
        this._currentNotificationId = false;
      }
    },
    /**
     * Validate
     *
     * @abstract
     * @param  {string} newValue
     * @return {string} The newValue validated
     */
    validate: function (newValue) {
      return newValue;
    },
    /**
     * Sanitize
     *
     * @abstract
     * @param  {string} newValue
     * @return {string} The newValue sanitized
     */
    sanitize: function (newValue) {
      return newValue;
    },
    /**
     * Sync UI with value coming from API, a programmatic change like a reset.
     *
     * @abstract
     * @param {string} value The new setting value.
     */
    /* jshint unused: false */
    syncUI: function (value) {},
    /**
     * Triggered when the control has been initialized
     *
     * @abstract
     */
    onInit: function() {},
    /**
     * Render the control from its JS template, if it exists.
     *
     * @override
     */
    renderContent: function () {
      var control = this;
      var _container = control._container;
      var templateId = control.templateSelector;
      var template;

      // Replace the container element's content with the control.
      if (document.getElementById('tmpl-' + templateId)) {
        template = wp.template(templateId);
        if (template && _container) {

          /* jshint funcscope: true */
          if (DEBUG.performances) { var t = performance.now(); }

          // render and store it in the params
          control.template = _container.innerHTML = template(control.params).trim();

          // var frag = document.createDocumentFragment();
          // var tplNode = document.createElement('div');
          // tplNode.innerHTML = template( control.params ).trim();
          // frag.appendChild(tplNode);
          // control.template = frag;
          // _container.appendChild(frag);

          if (DEBUG.performances) { console.log('%c renderContent of ' + control.params.type + '(' +
            control.id + ') took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7'); }
        }
      }

      this._rerenderNotifications();
    },
    /**
     * We don't need this method
     */
    dropdownInit: null,
    /**
     * Triggered just before the control get deflated from DOM
     *
     * @abstract
     */
    onDeflate: function () {},
    /**
     * Remove the DOM of the control.
     * In case the DOM store is empty (the first time
     * this method get called) it fills it.
     */
    deflate: function () {
      /* jshint funcscope: true */
      // if (DEBUG) var t = performance.now();

      var container = this._container;

      if (!this.template) {
        this.template = container.innerHTML.trim();
      }

      // call the abstract method
      this.onDeflate();

      // and empty the DOM from the container deferred
      // the slide out animation of the section doesn't freeze
      _.defer(function () {
        // due to the timeout we need to be sure that the section is not expanded
        if (!wpApi.section(this.section.get()).expanded.get()) {

          /* jshint funcscope: true */
          if (DEBUG.performances) { var t = performance.now(); }

          // Super fast empty DOM element
          // {@link http://jsperf.com/jquery-html-vs-empty-vs-innerhtml/20}
          // while (container.lastChild) {
          //   container.removeChild(container.lastChild);
          // }

         
          container.innerHTML = '';

          if (DEBUG.performances) { console.log('%c deflate of ' + this.params.type + '(' + this.id +
            ') took ' + (performance.now() - t) + ' ms.', 'background: #D2FFF1'); }

          // flag control that it's not rendered
          this.rendered = false;
        }
      }.bind(this));
    },
    /**
     * Inflate
     *
     * Render or 'inflate' the template of the control. The first time render it
     * from the js template, afterward retrieve the DOM string from the `template`
     * param store. After the template has been rendered call the `ready` method,
     * overridden in each control with their own specific logic. Also put a flag
     * `rendered` on the control instance to indicate whether the control is
     * rendered or not.
     *
     * @param  {boolean} shouldResolveEmbeddedDeferred Sometimes (i.e. for the
     *                                                 `control.focus()` method)
     *                                                 we need to resolve embed
     */
    inflate: function (shouldResolveEmbeddedDeferred) {
      /* jshint funcscope: true */
      if (DEBUG.performances) { var t = performance.now(); }
      if (!this.template) {
        this.renderContent();

        if (DEBUG.performances) { console.log('%c inflate DOM of ' + this.params.type +
          ' took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7'); }
      } else {
        if (!this.rendered) {
          this._container.innerHTML = this.template;
          this._rerenderNotifications();

          if (DEBUG.performances) { console.log('%c inflate DOM of ' + this.params.type +
            ' took ' + (performance.now() - t) + ' ms.', 'background: #EF9CD7'); }
        }
      }
      this.rendered = true;
      this.ready();
      if (shouldResolveEmbeddedDeferred) {
        this.deferred.embedded.resolve();
      }
      this._extras();
      // errors get resetted because on ready we fill the values in the UI with
      // the value of `this.setting()` which can never be not valid (see the
      // `_validateWrap` method above)
      this._onValidateSuccess();

      // if (DEBUG.performances) console.log('%c inflate of ' + this.params.type +
      //   ' took ' + (performance.now() - t) + ' ms.', 'background: #D2FFF1');
    },
    /**
     * Re-render notifications after content has been re-rendered.
     * This is taken as it is from the core base control class
     * (`wp.customize.Control`)in the end of the `renderContent` method
     */
    _rerenderNotifications: function _rerenderNotifications (){
      this.notifications.container = this.getNotificationsContainerElement();
      var sectionId = this.section();
      if ( ! sectionId || ( wpApi.section.has( sectionId ) && wpApi.section( sectionId ).expanded() ) ) {
        this.notifications.render();
      }
    },
    /**
     * Softenize
     *
     * Normalize setting for soft comparison.
     *
     * @abstract
     * @static
     * @access private
     * @param  {?} value Could be the original, the current, or the initial
     *                   session value
     * @return {string} The 'normalized' value passed as an argument.
     */
    softenize: function (value) {
      return value;
    },
    /**
     * Manage the extras dropdown menu of the control.
     *
     * @access private
     */
    _extras: function () {
      var self = this;
      var params = this.params;
      /**
       * Reference to abstract method different in various control's subclasses
       * @type {function(*)}
       */
      var _softenize = this.softenize;
      // constants
      var CLASS_RESET_LAST = ' kkcp-extras-reset_last';
      var CLASS_RESET_INITIAL = ' kkcp-extras-reset_initial';
      var CLASS_RESET_FACTORY = 'kkcp-extras-reset_factory';
      var CLASS_DISABLED = ' kkcp-disabled';
      // DOM
      var container = this._container;
      var area = container.getElementsByClassName('kkcp-extras')[0];
      var toggle = container.getElementsByClassName('kkcp-extras-btn')[0];
      var btnResetLast = container.getElementsByClassName(CLASS_RESET_LAST)[0];
      var btnResetInitial = container.getElementsByClassName(CLASS_RESET_INITIAL)[0];
      var btnResetFactory = container.getElementsByClassName(CLASS_RESET_FACTORY)[0];
      // value variables, uses closure
      var setting = this.setting;
      var initialValue = this.params.vInitial;
      var factoryValue = this.params.vFactory;
      // state
      var isOpen = false;

      // handlers
      var _closeExtras = function () {
        container.classList.remove('kkcp-extras-open');
      };
      /**
       * Reset setting to the last saved value
       * It closes the `extras` dropdown.
       *
       */
      var _resetLastValue = function () {
        Utils._forceSettingSet(setting, params.vLast);
        _closeExtras();
      };
      /**
       * Reset setting to the value at the beginning of the session.
       * It closes the `extras` dropdown.
       *
       */
      var _resetInitialValue = function () {
        Utils._forceSettingSet(setting, initialValue);
        _closeExtras();
      };
      /**
       * Reset setting to the value at the factory state
       * (as defined in the theme defaults).
       * It closes the `extras` dropdown.
       *
       */
      var _resetFactoryValue = function () {
        Utils._forceSettingSet(setting, factoryValue);
        _closeExtras();
      };
      /**
       * Enable button responsible for: resetting to last saved value
       */
      var _enableBtnLast = function () {
        btnResetLast.className = CLASS_RESET_LAST;
        btnResetLast.onclick = _resetLastValue;
      };
      /**
       * Disable button responsible for: resetting to initial value
       */
      var _disableBtnLast = function () {
        btnResetLast.className = CLASS_RESET_LAST + CLASS_DISABLED;
        btnResetLast.onclick = '';
      };
      /**
       * Enable button responsible for: resetting to initial value
       */
      var _enableBtnInitial = function () {
        btnResetInitial.className = CLASS_RESET_INITIAL;
        btnResetInitial.onclick = _resetInitialValue;
      };
      /**
       * Disable button responsible for: resetting to initial value
       */
      var _disableBtnInitial = function () {
        btnResetInitial.className = CLASS_RESET_INITIAL + CLASS_DISABLED;
        btnResetInitial.onclick = '';
      };
      /**
       * Enable button responsible for: resetting to factory / theme-default value
       */
      var _enableBtnFactory = function () {
        btnResetFactory.className = CLASS_RESET_FACTORY;
        btnResetFactory.onclick = _resetFactoryValue;
      };
      /**
       * Disable button responsible for: resetting to factory / theme-default value
       */
      var _disableBtnFactory = function () {
        btnResetFactory.className = CLASS_RESET_FACTORY + CLASS_DISABLED;
        btnResetFactory.onclick = '';
      };
      /**
       * Update status (enable / disable)
       * for each control in the `extras` menu.
       */
      var _onExtrasOpen = function () {
        // if the control current value is not valid enable both reset buttons
        if (self._currentValueHasError) {
          _enableBtnInitial();
          _enableBtnFactory();
          return;
        }

        var currentValue = _softenize(setting());
        var lastValue = params.vLast;

        // the last saved value is not always there like the others, we don't put
        // it in the big json through php, to save bytes, in the end. We check
        // here if the last value is `undefined`
        if (_.isUndefined(lastValue) || currentValue === _softenize(lastValue)) {
          _disableBtnLast();
        } else {
          _enableBtnLast();
        }
        if (currentValue === _softenize(initialValue)) {
          _disableBtnInitial();
        } else {
          _enableBtnInitial();
        }
        if (currentValue === _softenize(factoryValue)) {
          _disableBtnFactory();
        } else {
          _enableBtnFactory();
        }
      };

      /**
       * When the extras dropdown is open determine which actions are
       * enabled and bind them. If the current value is the same
       * as the one the action effect would give disable the action.
       */
      if (toggle) {
        if (DEBUG) {
          toggle.title = 'Click to dump control object into console';
        }
        toggle.onclick = function () {
          isOpen = !isOpen;
          container.classList.toggle('kkcp-extras-open', isOpen);
          if (isOpen) {
            _onExtrasOpen();
          }
          if (DEBUG) {
            console.info('Control[' + self.id + '] ', self);
          }
        };
      }

      if (area) {
        area.onmouseenter = function () {
          isOpen = true;
          container.classList.add('kkcp-extras-open');
          _onExtrasOpen();
        };
        area.onmouseleave = function () {
          isOpen = false;
          // don't close immediately, wait a bit and see if the mouse is still out of the area
          setTimeout(function () {
            if (!isOpen) {
              container.classList.remove('kkcp-extras-open');
            }
          }, 200);
        };
      }
    }
  });

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
      if (control.setting && control.setting['_dirty']) { // whitelisted from uglify \\
        // console.log(control.id, 'is dirty on save with value:', control.setting());
        control.params.vLast = control.setting();
      }
    });
  });

  // import './globals';
          return value;
        } else {
          return anyColor.toRgbString();
        }
      } catch(e) {
        console.warn('Control->Color->softenize: tinycolor conversion failed', e);
        return value;
      }
    },
    /**
     * @override
     */
    validate: function (value) {
      var params = this.params;
      var softenize = this.softenize;
      if (params.showPaletteOnly &&
        !params.togglePaletteOnly &&
        _.isArray(params.palette)
      ) {
        var allColorsAllowed = _.flatten(params.palette, true);
        allColorsAllowed = _.map(allColorsAllowed, function (color) {
          return softenize(color);
        });
        if (allColorsAllowed.indexOf(softenize(value)) !== -1) {
          return value;
        } else {
          return { error: true, msg: api.l10n['vNotInPalette'] };
        }
      }
      else if (
        (!params.disallowTransparent && value === 'transparent') ||
        isHexColor(value) ||
        (params.allowAlpha && isRgbaColor(value))
      ) {
        return value;
      } else {
        return { error: true };
      }
    },
    /**
     * @override
     */
    syncUI: function (value) {
      this._apply(value, 'API');
    },
    /**
     * Destroy `spectrum` instances if any.
     *
     * @override
     */
    onDeflate: function () {
      if (this.__$picker && this.rendered) {
        this.__$picker.spectrum('destroy');
      }
    },
    /**
     * @override
     */
    ready: function () {
      var self = this;
      /** @type {HTMLElement} */
      var container = this._container;
      /** @type {HTMLElement} */
      var btnCustom = container.getElementsByClassName('kkcpui-toggle')[0];

      /** @type {HTMLElement} */
      this.__preview = container.getElementsByClassName('kkcpcolor-current-overlay')[0];
      /** @type {JQuery} */
      this.__$picker = $(container.getElementsByClassName('kkcpcolor-input')[0]);
      /** @type {JQuery} */
      this.__$expander = $(container.getElementsByClassName('kkcp-expander')[0]).hide();

      self._updateUIpreview(self.setting());


      var isOpen = false;
      var pickerIsInitialized = false;
      var _maybeInitializeSpectrum = function () {
        // initialize only once
        if (!pickerIsInitialized) {
          self.__$picker.spectrum(self._getSpectrumOpts(self));
          pickerIsInitialized = true;
        }
      };

      btnCustom.onmouseover = _maybeInitializeSpectrum;

      btnCustom.onclick = function() {
        isOpen = !isOpen;
        _maybeInitializeSpectrum();

        // and toggle
        if (isOpen) {
          self.__$expander.slideDown();
        } else {
          self.__$expander.slideUp();
        }
        return false;
      };
    },
    /**
     * Get Spectrum plugin options
     *
     * {@link https://bgrins.github.io/spectrum/ spectrum API}
     * @param  {Object} options Options that override the defaults (optional)
     * @return {Object} The spectrum plugin options
     */
    _getSpectrumOpts: function (options) {
      var self = this;
      var params = self.params;
      var $container = self.container;
      return _.extend({
        preferredFormat: 'hex',
        flat: true,
        showInput: true,
        showInitial: false,
        showButtons: false,
        // localStorageKey: 'kkcp_spectrum',
        showSelectionPalette: false,
        togglePaletteMoreText: api.l10n['togglePaletteMoreText'],
        togglePaletteLessText: api.l10n['togglePaletteLessText'],
        allowEmpty: !params.disallowTransparent,
        showAlpha: params.allowAlpha,
        showPalette: !!params.palette,
        showPaletteOnly: params.showPaletteOnly && params.palette,
        togglePaletteOnly: params.togglePaletteOnly && params.palette,
        palette: params.palette,
        color: self.setting(),
        show: function () {
          $container.find('.sp-input').focus();
          if (params.showInitial) {
            $container.find('.sp-container').addClass('sp-show-initial');
          }
        },
        move: function (tinycolor) {
          var color = tinycolor ? tinycolor.toString() : 'transparent';
          self._apply(color);
        },
        change: function (tinycolor) {
          if (!tinycolor) {
            $container.find('.sp-input').val('transparent');
          }
        }
      }, options || {});
    },
    /**
     * Update UI preview (the color box on the left hand side)
     */
    _updateUIpreview: function (newValue) {
      this.__preview.style.background = newValue;
    },
    /**
     * Update UI control (the spectrum color picker)
     */
    _updateUIcustomControl: function (newValue) {
      this.__$picker.spectrum('set', newValue);
    },
    /**
     * Apply, wrap the `setting.set()` function
     * doing some additional stuff.
     *
     * @access private
     * @param  {string} value
     * @param  {string} from  Where the value come from (could be from the UI:
     *                        picker, dynamic fields, expr field) or from the
     *                        API (on programmatic value change).
     */
    _apply: function (value, from) {
      this.params.valueCSS = value;

      if (this.rendered) {
        this._updateUIpreview(value);

        if (from === 'API') {
          this._updateUIcustomControl(value);
        }
      }

      if (from !== 'API') {
        // set new value
        this.setting.set(value);
      }
    }
  });

  wpApi.controlConstructor['kkcp_color'] = api.controls.Color = Control$3;

  /**
   * Control Content class
   *
   * @class api.controls.Content
   * @constructor
   * @extends api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Control$4 = api.controls.Base.extend({
    /**
     * Some methods are not needed here
     *
     * @override
     */
    _validateWrap: function () {},
    _onValidateError: function () {},
    _onValidateSuccess: function () {},
    validate: function () {},
    sanitize: function () {},
    syncUI: function () {},
    softenize: function () {},
    _extras: function () {}
  });

  wpApi.controlConstructor['kkcp_content'] = api.controls.Content = Control$4;

  // import ControlBase from './base';

  /**
   * Font Family Control
   *
   * @class wp.customize.controlConstructor.kkcp_font_family
   * @constructor
   * @extends api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Control$5 = api.controls.Base.extend({
    /**
     * @override
     * @see php `KKcp_Sanitize::font_families`
     * @param  {string|array} value [description]
     * @return {string}       [description]
     */
    validate: function (value) {
      // treat value only if it's a string (unlike the php function)
      // because here we always have to get a string.
      if (typeof value === 'string') {
        return value;
      } else {
        return { error: true };
      }
    },
    /**
     * @override
     */
    sanitize: function (value) {
      var sanitized = [];
      var singleValues = value.split(',');
      for (var i = 0, l = singleValues.length; i < l; i++) {
        var valueUnquoted = singleValues[i].replace(/'/g, '').replace(/"/g, '');
        sanitized.push('\'' + valueUnquoted.trim() + '\'');
      }
      return sanitized.join(',');
    },
    /**
     * @override
     */
    syncUI: function (value) {
      if (value !== this.__input.value) {
        this._updateUI(value);
      }
    },
    /**
     * Destroy `selectize` instance.
     *
     * @override
     */
    onDeflate: function () {
      if (this.__input  && this.__input.selectize) {
        this.__input.selectize.destroy();
      }
    },
    /**
     * @override
     */
    ready: function () {
      this.__input = this._container.getElementsByClassName('kkcp-selectize')[0];
      this._fontFamilies = api.constants['font_families'].map(function (fontFamilyName) {
        return { item: fontFamilyName };
      });
      this._updateUI();
    },
    /**
     * Update UI
     *
     * @param  {string} value
     */
    _updateUI: function (value) {
      var setting = this.setting;

      // if there is an instance of selectize destroy it
      if (this.__input.selectize) {
        this.__input.selectize.destroy();
      }

      this.__input.value = value || setting();

      // init selectize plugin
      $(this.__input).selectize({
        plugins: ['drag_drop','remove_button'],
        delimiter: ',',
        maxItems: 10,
        persist: false,
        hideSelected: true,
        options: this._fontFamilies,
        labelField: 'item',
        valueField: 'item',
        sortField: 'item',
        searchField: 'item',
        create: function (input) {
          return {
            value: input,
            text: input.replace(/'/g, '') // remove quotes from UI only
          };
        },
        render: {
          item: this._selectizeRenderItemAndOption,
          option: this._selectizeRenderItemAndOption
        }
      })
      .on('change', function () {
        setting.set(this.value);
      })
      .on('item_remove', function (e,b) {
        if (DEBUG) { console.log(this, e, b); }
      });
    },
    /**
     * Selectize render item and option function
     *
     * @static
     * @param  {Object} data     The selectize option object representation.
     * @param  {function} escape Selectize escape function.
     * @return {string}          The option template.
     */
    _selectizeRenderItemAndOption: function (data, escape) {
      var value = escape(data.item);
      return '<div style="font-family:' + value + '">' + value.replace(/'/g, '').replace(/"/g, '') + '</div>';
    }
  });

  wpApi.controlConstructor['kkcp_font_family'] = api.controls.FontFamily = Control$5;

  // import ControlBase from './base';

  /**
   * Control Icon
   *
   * @class wp.customize.controlConstructor.kkcp_icon
   * @constructor
   * @extends api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Control$6 = api.controls.Base.extend({
    /**
     * @override
     * @see php `KKcp_Sanitize::font_families`
     * @param  {string|array} value [description]
     * @return {string}       [description]
     */
    validate: function (value) {
      // treat value only if it's a string (unlike the php function)
      // because here we always have to get a string.
     
    },
    /**
     * Get selectize items from icon set
     * @param  {Object} set
     * @return {Object<Array,Array>}
     */
    _getSelectizeDataFromIconsSet: function (set) {
      var selectizeOptions = [];
      var selectizeGroups = [];
      for (var groupId in set) {
        if (set.hasOwnProperty(groupId)) {
          var group = set[groupId];
          selectizeGroups.push({
            id: groupId,
            label: group.label
          });
          var icons = group.icons;
          for (var i = 0; i < icons.length; i++) {
            selectizeOptions.push({
              id: icons[i],
              group: groupId
            });
          }
        }
      }
      return {
        _options: selectizeOptions,
        _groups: selectizeGroups
      };
    },
    /**
     * Update UI
     *
     * @param  {string} value
     */
    _updateUI: function (value) {
      var setting = this.setting;
      var selectizeOpts = this.params.selectize || {};

      // if there is an instance of selectize destroy it
      if (this.__input.selectize) {
        this.__input.selectize.destroy();
      }

      this.__input.value = value || setting();

      // init selectize plugin
      $(this.__input).selectize(_.extend({
        plugins: ['drag_drop','remove_button'],
        maxItems: null,
        options: this._iconOptions,
        optgroups: this._iconGroups,
        optgroupField: 'group',
        optgroupValueField: 'id',
        lockOptgroupOrder: true,
        valueField: 'id',
        sortField: 'id',
        searchField: ['id'],
        render: {
          item: this._selectizeRenderItem.bind(this),
          option: this._selectizeRenderOption.bind(this),
          optgroup_header: this._selectizeRenderGroupHeader.bind(this),
        },
        onChange: function (value) {
          console.log(value);
          setting.set(value);
        }
      }, selectizeOpts));
    },
    /**
     * Selectize render item function
     *
     * @static
     * @param  {Object} data     The selectize option object representation.
     * @param  {function} escape Selectize escape function.
     * @return {string}          The option template.
     */
    _selectizeRenderItem: function (data, escape) {
      var value = data.id;
      return '<div class="kkcp-icon-selectItem kkcpui-tooltip--top" title="' + escape(value) + '">' +
          '<i class="' + escape(this._getIconClassName(value)) + '"></i>' +
        '</div>';
    },
    /**
     * Selectize render option function
     *
     * @static
     * @param  {Object} data     The selectize option object representation.
     * @param  {function} escape Selectize escape function.
     * @return {string}          The option template.
     */
    _selectizeRenderOption: function (data, escape) {
      var value = data.id;
      return '<div class="kkcp-icon-selectOption kkcpui-tooltip--top" title="' + escape(value) + '">' +
          '<i class="' + escape(this._getIconClassName(value)) + '"></i>' +
        '</div>';
    },
    /**
     * Selectize render option function
     *
     * @static
     * @param  {Object} data     The selectize option object representation.
     * @param  {function} escape Selectize escape function.
     * @return {string}          The option template.
     */
    _selectizeRenderGroupHeader: function (data, escape) {
      return '<div class="kkcp-icon-selectHeader">' + escape(data.label) + '</div>';
    },
    /**
     * Get icon class name
     * @param  {[type]} icon [description]
     * @return {[type]}      [description]
     */
    _getIconClassName: function (icon) {
      var iconsSetName = this._iconSet;
      return iconsSetName + ' ' + iconsSetName + '-' + icon;
    }
  });

  wpApi.controlConstructor['kkcp_icon'] = api.controls.Icon = Control$6;

  // import ControlBase from './base';

  /**
   * Control Multicheck
   *
   * @class wp.customize.controlConstructor.kkcp_multicheck
   * @constructor
   * @extends api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Control$7 = api.controls.Base.extend({
    /**
     * @override
     * @return {string|object<string,boolean>} A JSONified Array
     */
    validate: function (rawNewValue) {
      var this$1 = this;

      var newValue = rawNewValue;
      // in case the value come from a reset action it is a json
      // string (as it is saed in the db) so we need to parse it
      try {
        newValue = JSON.parse(rawNewValue);
      } catch(e) {}
      if(_.isArray(newValue)) {
        var validArray = [];
        for (var i = 0; i < newValue.length; i++) {
          // only if it is an allowed choice...
          if (this$1.params.choices.hasOwnProperty(newValue[i])) {
            validArray.push( newValue[i] );
          }
        }
        return JSON.stringify(validArray);
      } else {
        return { error: true };
      }
    },
    /**
     * @override
     */
    syncUI: function (value) {
      if (value !== this._getValueFromUI(true)) {
        this._syncCheckboxes();

        if (this.params.sortable) {
          this._reorder();
        }
      }
    },
    /**
     * @override
     */
    ready: function () {
      this.__inputs = this._container.getElementsByTagName('input');

      // special stuff for sortable multicheck controls
      if (this.params.sortable) {
        var self = this;
        var setting = self.setting;

        this.container.sortable({
          items: '> label',
          cursor: 'move',
          update: function () {
            setting.set(self._getValueFromUI());
          }
        });

        this._buildItemsMap();
      }

      // sync checked state on checkboxes on ready and bind (argument `true`)
      this._syncCheckboxes(true);
    },
    /**
     * @override
     */
    _buildItemsMap: function () {
      var this$1 = this;

      var items = this._container.getElementsByTagName('label');
      this.__itemsMap = {};

      for (var i = 0, l = items.length; i < l; i++) {
        this$1.__itemsMap[items[i].title] = {
          _sortable: items[i],
          _input: items[i].getElementsByTagName('input')[0]
        };
      }
    },
    /**
     * @override
     */
    _reorder: function () {
      var this$1 = this;

      // sort first the checked ones
      api.controls['Sortable'].prototype._reorder.apply(this);

      // then sort the unchecked ones
      var valueAsArray = JSON.parse(this.setting());
      for (var key in this$1.params.choices) {
        if (valueAsArray.indexOf(key) === -1) {
          var itemDOM = this$1.__itemsMap[key]._sortable;
          itemDOM.parentNode.removeChild(itemDOM);
          this$1._container.appendChild(itemDOM);
        }
      }
    },
    /**
     * Get sorted value, reaading checkboxes status from the DOM
     *
     * @param {boolean} jsonize Whether to stringify the array or not
     * @return {array|string} It could be a normal array or a JSONized one based
     *                        on the argument `jsonize`.
     */
    _getValueFromUI: function (jsonize) {
      var this$1 = this;

      var valueSorted = [];
      for (var i = 0, l = this.__inputs.length; i < l; i++) {
        var input = this$1.__inputs[i];
        if (input.checked) {
          valueSorted.push(input.value);
        }
      }
      return jsonize ? JSON.stringify(valueSorted) : valueSorted;
    },
    /**
     * Sync checkboxes and maybe bind change event
     * We need to be fast here, use vanilla js.
     *
     * @param  {boolean} bindAsWell Bind on change?
     */
    _syncCheckboxes: function (bindAsWell) {
      var this$1 = this;

      var valueAsArray = [];
      try {
        valueAsArray = JSON.parse(this.setting());
      } catch(e) {
        console.warn('Control->Multicheck: setting value of ' + this.id +
          ' is not a valid json array', this.setting());
      }
      for (var i = 0, l = this.__inputs.length; i < l; i++) {
        var input = this$1.__inputs[i];
        input.checked = valueAsArray.indexOf(input.value) !== -1;
        if (bindAsWell) {
          input.onchange = function () {
            this.setting.set(this._getValueFromUI());
          }.bind(this$1);
        }
      }
    }
  });

  wpApi.controlConstructor['kkcp_multicheck'] = api.controls.Multicheck = Control$7;

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

    var regex = /%%|%(\d+\$)?([\-+'#0 ]*)(\*\d+\$|\*|\d+)?(?:\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
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

  var isInt_1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isInt;

  var _assertString = assertString_1;

  var _assertString2 = _interopRequireDefault(_assertString);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
  var intLeadingZeroes = /^[-+]?[0-9]+$/;

  function isInt(str, options) {
    (0, _assertString2.default)(str);
    options = options || {};

    // Get the regex to use for testing, based on whether
    // leading zeroes are allowed or not.
    var regex = options.hasOwnProperty('allow_leading_zeroes') && !options.allow_leading_zeroes ? int : intLeadingZeroes;

    // Check min/max/lt/gt
    var minCheckPassed = !options.hasOwnProperty('min') || str >= options.min;
    var maxCheckPassed = !options.hasOwnProperty('max') || str <= options.max;
    var ltCheckPassed = !options.hasOwnProperty('lt') || str < options.lt;
    var gtCheckPassed = !options.hasOwnProperty('gt') || str > options.gt;

    return regex.test(str) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
  }
  module.exports = exports['default'];
  });

  var isInt = unwrapExports(isInt_1);

  /**
   * Control Number
   *
   * @class wp.customize.controlConstructor.kkcp_number
   * @alias api.controls.Number
   * @constructor
   * @extends api.controls.BaseInput
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Control$8 = ControlBaseInput.extend({
    /**
     * We just neet to convert the value to string for the check, for the rest
     * is the same as in the base input control
     *
     * @override
     */
    syncUI: function (value) {
      if (value && this.__input.value !== value.toString()) {
        this.__input.value = value;
      }
    },
    /**
     * @override
     */
    sanitize: function (value) {
      return Number(value);
    },
    /**
     * @override
     */
    validate: function (value) {
      var params = this.params;
      var attrs = params.attrs;
      var errorMsg = '';

      if (isNaN(value)) {
        errorMsg += api.l10n['vNotAnumber'];
      } else {

      }
      if (!params.allowFloat) {
        if (is_float(value)) {
          errorMsg += api.l10n['vNoFloat'] + ' ';
        } else if (!isInt(value.toString())) {
          errorMsg += api.l10n['vNotAnInteger'] + ' ';
        }
      }
      if (attrs) {
        if (attrs.min && value < attrs.min) {
          errorMsg += sprintf(api.l10n['vNumberLow'], attrs.min) + ' ';
        }
        if (attrs.max && value > attrs.max) {
          errorMsg += sprintf(api.l10n['vNumberHigh'], attrs.max) + ' ';
        }
        if (attrs.step && !isMultipleOf(value.toString(), attrs.step)) {
          errorMsg += sprintf(api.l10n['vNumberStep'], attrs.step) + ' ';
        }
      }

      // if there is an error return it
      if (errorMsg) {
        return {
          error: true,
          msg: errorMsg
        };
      // otherwise return the valid value
      } else {
        return value;
      }
    }
  });

  wpApi.controlConstructor['kkcp_number'] = api.controls.Number = Control$8;

  /**
   * Control Radio
   *
   * @class wp.customize.controlConstructor.kkcp_radio
   * @constructor
   * @extends api.controls.BaseRadio
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Control$9 = ControlBaseRadio;

  wpApi.controlConstructor['kkcp_radio'] = api.controls.Radio = Control$9;

  /**
   * Control Radio Image
   *
   * @class wp.customize.controlConstructor.kkcp_radio_image
   * @constructor
   * @extends api.controls.BaseRadio
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Control$10 = ControlBaseRadio;

  wpApi.controlConstructor['kkcp_radio_image'] = api.controls.RadioImage = Control$10;

  // import ControlBase from './base';

  /**
   * Control Select class
   *
   * @class wp.customize.controlConstructor.kkcp_select
   * @alias api.controls.Select
   * @constructor
   * @extends api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Control$11 = api.controls.Base.extend({
    /**
     * override
     */
    validate: function (rawNewValue) {
      var choices = this.params.choices;
      var newValue;
      // it could come as a stringified array through a programmatic change
      // of the setting (i.e. from a a reset action)
      try {
        newValue = JSON.parse(rawNewValue);
      } catch(e) {
        newValue = rawNewValue;
      }
      // validate array of values
      if (_.isArray(newValue) && this.params.selectize) {
        var validatedArray = [];
        for (var i = 0, l = newValue.length; i < l; i++) {
          var item = newValue[i];
          if (choices.hasOwnProperty(item)) {
            validatedArray.push(item);
          }
        }
        return JSON.stringify(validatedArray);
      }
      // validate string value
      if (choices.hasOwnProperty(newValue)) {
        return newValue;
      }
      // otherwise return error
      return { error: true };
    },
    /**
     * Destroy `selectize` instance if any.
     *
     * @override
     */
    onDeflate: function () {
      if (this.__select && this.__select.selectize) {
        this.__select.selectize.destroy();
      }
    },
    /**
     * @override
     */
    syncUI: function () {
      this._syncOptions();
    },
    /**
     * @override
     */
    ready: function () {
      var this$1 = this;

      var selectizeOpts = this.params.selectize || false;
      var setting = this.setting;

      this.__select = this._container.getElementsByTagName('select')[0];
      this.__options = this._container.getElementsByTagName('option');

      // use selectize
      if (selectizeOpts) {
        $(this.__select).selectize(_.extend({
          onChange: function (value) {
            // if it's an array be sure the value is actually different and not
            // just a JSON vs non-JSON situation
            if (_.isArray(value)) {
              if (!this$1._isSameAsSetting(value)) {
                setting.set(value);
              }
            } else {
              setting.set(value);
            }
          }
        }, selectizeOpts));
      // or use normal DOM API
      } else {
        this.__select.onchange = function () {
          setting.set(this.value);
        };
      }

      // sync selected state on options on ready
      this._syncOptions();
    },
    /**
     * Sync options and maybe bind change event
     *
     * We need to be fast here, use vanilla js.
     * We do a comparison with two equals `==` because sometimes we want to
     * compare `500` to `'500'` (like in the font-weight dropdown) and return
     * true from that.
     *
     */
    _syncOptions: function () {
      var this$1 = this;

      var value = this.setting();

      // use selectize
      if (this.params.selectize) {
        // it could be a json array or a simple string
        try {
          this.__select.selectize.setValue(JSON.parse(value));
        } catch(e) {
          this.__select.selectize.setValue(value);
        }
      }
      // or use normal DOM API
      else {
        for (var i = this.__options.length; i--;) {
          var option = this$1.__options[i];
          option.selected = (value == option.value);
        }
      }
    },
    /**
     * Check if the given value is the same as the current setting value,
     * this will return `true` even in the scenario where the two values
     * are one a real JS array and the other its JSONified version. This
     * equality (that shouldn't trigger a `setting.set`) happens e.g. on load
     *
     * @param  {Array}  value
     * @return {Boolean}
     */
    _isSameAsSetting: function _isSameAsSetting (value) {
      var settingValue = this.setting.get();
      var valueToCompare = value;

      try {
        settingValue = JSON.parse(settingValue);
      } catch (e) {
        settingValue = JSON.stringify(settingValue);
        valueToCompare = JSON.stringify(valueToCompare);
      }
      return _.isEqual(settingValue, valueToCompare);
    }
  });

  var ControlSelect = wpApi.controlConstructor['kkcp_select'] = api.controls.Select = Control$11;

  /**
   * Control Font Weight
   *
   * @class wp.customize.controlConstructor.kkcp_font_weight
   * @constructor
   * @extends api.controls.Select
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Control$12 = ControlSelect;

  wpApi.controlConstructor['kkcp_font_weight'] = api.controls.FontWeight = Control$12;

  // import ControlBase from './base';

  /**
   * Control Slider
   *
   * @class wp.customize.controlConstructor.kkcp_slider
   * @alias api.controls.Slider
   * @constructor
   * @extends api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   * @requires api.core.Regexes
   */
  var Control$13 = api.controls.Base.extend({
    /**
     * Let's consider '44' to be equal to 44.
     * @override
     */
    softenize: function (value) {
      return value.toString();
    },
    /**
     * @override
     */
    validate: function (newValue) {
      var params = this.params;
      var errorMsg = '';
      var unit = '';
      var number = '';

      if (params.units) {
        unit = this._extractFirstUnit(newValue);
        if (!unit || params.units.indexOf(unit) === -1) {
          errorMsg = api.l10n['vInvalidUnit'];
          unit = params.units[0];
        }
      }

      // validate number with the api.controls.Number method
      number = api.controls.Number.prototype.validate.call(this,
        this._extractFirstNumber(newValue));

      if (number.error) {
        errorMsg += ' ' + number.msg;
      }

      if (errorMsg) {
        return {
          error: true,
          msg: errorMsg
        };
      } else {
        return number.toString() + unit;
      }
    },
    /**
     * @override
     */
    syncUI: function (value) {
      if (value !== this._getValueFromUI()) {
        this._setPartialValue(value, 'API');
      }
    },
    /**
     * This function is divided in subfunction to make it easy to reuse part of
     * this control in other controls that extend this, such as `size_dynamic`.
     * @override
     */
    ready: function () {
      this._setDOMelements();
      this._initSliderAndBindInputs();
      // update UI with current values (wait for the slider to be initialized)
      this._updateUIcustomControl(this.setting());
    },
    /**
     * Set DOM element as control properties
     */
    _setDOMelements: function () {
      var container = this._container;
      /** @type {HTMLElement} */
      this.__inputNumber = container.getElementsByClassName('kkcp-slider-number')[0];
      /** @type {JQuery} */
      this.__$inputUnits = $(container.getElementsByClassName('kkcp-unit'));
      /** @type {JQuery} */
      this.__$inputSlider = $(container.getElementsByClassName('kkcp-slider')[0]);
    },
    /**
     * Init slider and bind input UI.
     */
    _initSliderAndBindInputs: function () {
      var self = this;
      var params = self.params;
      var inputNumber = self.__inputNumber;
      var $inputSlider = self.__$inputSlider;

      // Bind click action to unit picker
      // (only if there is more than one unit allowed)
      if (params.units && params.units.length > 1) {
        var $inputUnits = self.__$inputUnits;
        $inputUnits.on('click', function () {
          $inputUnits.removeClass('kkcp-current');
          this.className += ' kkcp-current';
          self._setPartialValue({ _unit: this.value });
        });
      }

      // Bind number input
      inputNumber.onchange = function () {
        var value = this.value;
        $inputSlider.slider('value', value);
        self._setPartialValue({ _number: value });
      };

      // Init Slider
      var sliderOptions = params.attrs || {};
      $inputSlider.slider(_.extend(sliderOptions, {
        value: self._extractFirstNumber(),
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
    },
    /**
     * Extract first found unit from value
     * @param  {?string} value [description]
     * @return {?string}       [description]
     */
    _extractFirstUnit: function (value) {
      var valueOrigin = value || this.setting();
      var matchesUnit = Regexes$1._extractUnit.exec(valueOrigin);
      if (matchesUnit && matchesUnit[0]) {
        return matchesUnit[0];
      }
      return null;
    },
    /**
     * Extract first number found in value
     * @param  {?string|number} value [description]
     * @return {?string}              [description]
     */
    _extractFirstNumber: function (value) {
      var valueOrigin = value || this.setting();
      var matchesNumber = Regexes$1._extractNumber.exec(valueOrigin);
      if (matchesNumber && matchesNumber[0]) {
        return matchesNumber[0];
      }
      return null;
    },
    /**
     * Get current `setting` value from DOM or from given arg
     * @param  {Object<string,string>} value An optional value formed as
     *                                       `{ number: ?, unit: ? }`
     * @return {string}
     */
    _getValueFromUI: function (value) {
      var output;
      if (value && value._number) {
        output = value._number.toString();
      } else {
        output = this.__inputNumber.value;
      }
      if (this.params.units) {
        if (value && value._unit) {
          output += value._unit;
        } else {
          output += this.__$inputUnits.filter('.kkcp-current').val();
        }
      }
      return output;
    },
    /**
     * Update UI control
     *
     * Reflect a programmatic setting change on the UI.
     * @param {?string} value Optional, the value from where to extract number and unit,
     *                        uses `this.setting()` if a `null` value is passed.
     */
    _updateUIcustomControl: function (value) {
      var params = this.params;
      var number = this._extractFirstNumber(value);
      var unit = this._extractFirstUnit(value);

      // update number input
      this.__inputNumber.value = number;
      // update number slider
      this.__$inputSlider.slider('value', number);
      // update unit picker
      if (params.units) {
        this.__$inputUnits.removeClass('kkcp-current').filter(function () {
          return this.value === unit;
        }).addClass('kkcp-current');
      }
    },
    /**
     * Set partial value
     *
     * Wrap the `setting.set()` function doing some additional stuff.
     *
     * @access private
     * @param  {string} value
     * @param  {string} from  Where the value come from (could be from the UI:
     *                        picker, dynamic fields, expr field) or from the
     *                        API (on programmatic value change).
     */
    _setPartialValue: function (value, from) {
      if (from === 'API') {
        this._updateUIcustomControl(value);
      } else {
        this.setting.set(this._getValueFromUI(value));
      }
    }
  });

  wpApi.controlConstructor['kkcp_slider'] = api.controls.Slider = Control$13;

  // import ControlBase from './base';

  /**
   * Control Sortable
   *
   * @class wp.customize.controlConstructor.kkcp_sortable
   * @alias api.controls.Sortable
   * @constructor
   * @extends api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Control$14 = api.controls.Base.extend({
    /**
     * @override
     */
    validate: function (rawNewValue) {
      var choices = this.params.choices;
      var newValue;
      // it could come as a stringified array through a programmatic change
      // of the setting (i.e. from a a reset action)
      try {
        newValue = JSON.parse(rawNewValue);
      } catch(e) {
        newValue = rawNewValue;
      }
      // validate array of values
      if (_.isArray(newValue)) {
        var validatedArray = [];
        for (var i = 0, l = newValue.length; i < l; i++) {
          var item = newValue[i];
          if (choices.hasOwnProperty(item)) {
            validatedArray.push(item);
          }
        }
        return JSON.stringify(validatedArray);
      }
      else {
        return { error: true };
      }
    },
    /**
     * @override
     */
    syncUI: function (value) {
      if (value !== this.params.lastValue) {
        this._reorder();
        this.params.lastValue = value;
      }
    },
    /**
     * @override
     */
    ready: function () {
      var setting = this.setting;
      var container = this.container;

      this._buildItemsMap();

      this.params.lastValue = this.setting();

      container.sortable({
        items: '.kkcp-sortable',
        cursor: 'move',
        update: function () {
          setting.set(container.sortable('toArray', { attribute: 'title' }));
        }
      });
    },
    /**
     * Build sortable items map, a key (grabbed from the `title` attrbiute)
     * with the corresponding DOM element
     */
    _buildItemsMap: function () {
      var this$1 = this;

      var items = this._container.getElementsByClassName('kkcp-sortable');
      this.__itemsMap = {};

      for (var i = 0, l = items.length; i < l; i++) {
        this$1.__itemsMap[items[i].title] = {
          _sortable: items[i]
        };
      }
    },
    /**
     * Manually reorder the sortable list, needed when a programmatic change
     * is triggered. Unfortunately jQuery UI sortable does not have a method
     * to keep in sync the order of an array and its corresponding DOM.
     */
    _reorder: function () {
      var this$1 = this;

      var valueAsArray = JSON.parse(this.setting());

      for (var i = 0, l = valueAsArray.length; i < l; i++) {
        var itemValue = valueAsArray[i];
        var itemDOM = this$1.__itemsMap[itemValue]._sortable;
        itemDOM.parentNode.removeChild(itemDOM);
        this$1._container.appendChild(itemDOM);
      }

      this.container.sortable('refresh');
    }
  });

  wpApi.controlConstructor['kkcp_sortable'] = api.controls.Sortable = Control$14;

  // import ControlBase from './base';

  /**
   * Control Tags class
   *
   * @class wp.customize.controlConstructor.kkcp_tags
   * @constructor
   * @extends api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   * @requires api.core.Utils
   */
  var Control$15 = api.controls.Base.extend({
    /**
     * @override
     */
    validate: function (rawNewValue) {
      if (_.isString(rawNewValue)) {
        var newValue = rawNewValue;
        newValue = _.map(newValue.split(','), function (string) {
          return string.trim();
        });
        newValue = _.uniq(newValue);
        var maxItems = this.params.selectize ? this.params.selectize.maxItems : null;
        if (maxItems && _.isNumber(maxItems)) {
          if (newValue.length > maxItems) {
            newValue = newValue.slice(0, maxItems);
          }
        }
        return Utils._stripHTML(newValue.join(','));
      }
      return { error: true };
    },
    /**
     * Destroy `selectize` instance if any.
     *
     * @override
     */
    onDeflate: function () {
      if (this.__input && this.__input.selectize) {
        this.__input.selectize.destroy();
      }
    },
    /**
     * @override
     */
    syncUI: function (value) {
      var selectize = this.__input.selectize;
      if (selectize && selectize.getValue() !== value) {
        this.__input.value = value;
        // this is due to a bug, we should use:
        // selectize.setValue(value, true);
        // but @see https://github.com/brianreavis/selectize.js/issues/568
        // so first we have to destroy thene to reinitialize, this happens
        // only through a programmatic change such as a reset action
        selectize.destroy();
        this._initSelectize();
      }
    },
    /**
     * @override
     */
    ready: function () {
      this.__input = this._container.getElementsByTagName('input')[0];

      // fill input before to initialize selectize
      // so it grabs the value directly from the DOM
      this.__input.value = this.setting();

      this._initSelectize();
    },
    /**
     * Init selectize on text input
     */
    _initSelectize: function () {
      var setting = this.setting;
      var selectizeOpts = this.params.selectize || {};

      $(this.__input).selectize(_.extend({
        persist: false,
        create: function (input) {
          return {
            value: input,
            text: input
          };
        },
        onChange: function (value) {
          setting.set(value);
        }
      }, selectizeOpts));
    }
  });

  wpApi.controlConstructor['kkcp_tags'] = api.controls.Tags = Control$15;

  var merge_1 = createCommonjsModule(function (module, exports) {
  'use strict';

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

  var isFQDN = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isFDQN;

  var _assertString = assertString_1;

  var _assertString2 = _interopRequireDefault(_assertString);

  var _merge = merge_1;

  var _merge2 = _interopRequireDefault(_merge);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var default_fqdn_options = {
    require_tld: true,
    allow_underscores: false,
    allow_trailing_dot: false
  };

  function isFDQN(str, options) {
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
    }
    for (var part, i = 0; i < parts.length; i++) {
      part = parts[i];
      if (options.allow_underscores) {
        part = part.replace(/_/g, '');
      }
      if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
        return false;
      }
      if (/[\uff01-\uff5e]/.test(part)) {
        // disallow full-width chars
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

  var isIP_1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isIP;

  var _assertString = assertString_1;

  var _assertString2 = _interopRequireDefault(_assertString);

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

  var isURL_1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isURL;

  var _assertString = assertString_1;

  var _assertString2 = _interopRequireDefault(_assertString);

  var _isFQDN = isFQDN;

  var _isFQDN2 = _interopRequireDefault(_isFQDN);

  var _isIP = isIP_1;

  var _isIP2 = _interopRequireDefault(_isIP);

  var _merge = merge_1;

  var _merge2 = _interopRequireDefault(_merge);

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

    port_str = ipv6 = null;
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

    if (!(0, _isIP2.default)(host) && !(0, _isFQDN2.default)(host, options) && (!ipv6 || !(0, _isIP2.default)(ipv6, 6)) && host !== 'localhost') {
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
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  exports.default = isByteLength;

  var _assertString = assertString_1;

  var _assertString2 = _interopRequireDefault(_assertString);

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

  var isEmail_1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isEmail;

  var _assertString = assertString_1;

  var _assertString2 = _interopRequireDefault(_assertString);

  var _merge = merge_1;

  var _merge2 = _interopRequireDefault(_merge);

  var _isByteLength = isByteLength_1;

  var _isByteLength2 = _interopRequireDefault(_isByteLength);

  var _isFQDN = isFQDN;

  var _isFQDN2 = _interopRequireDefault(_isFQDN);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var default_email_options = {
    allow_display_name: false,
    require_display_name: false,
    allow_utf8_local_part: true,
    require_tld: true
  };

  /* eslint-disable max-len */
  /* eslint-disable no-control-regex */
  var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
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

    if (!(0, _isByteLength2.default)(user, { max: 64 }) || !(0, _isByteLength2.default)(domain, { max: 256 })) {
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
   * Control Text class
   *
   * @class wp.customize.controlConstructor.kkcp_text
   * @constructor
   * @extends api.controls.BaseInput
   * @augments api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Classnds
   * @requires api.core.Utils
   */
  var Control$16 = ControlBaseInput.extend({
    /**
     * @override
     * @inheritdoc api.controls.Base.validate
     */
    validate: function (value) {
      var attrs = this.params.attrs;
      var inputType = attrs.type || 'text';
      var errorMsg = '';

      // max length
      if (attrs.maxlength && value.length > attrs.maxlength) {
        errorMsg += api.l10n['vTooLong'];
      }
      // url
      if (inputType === 'url' && !isURL(value)) {
        errorMsg += api.l10n['vInvalidUrl'];
      }
      // email
      else if (inputType === 'email' && !isEmail(value)) {
        errorMsg += api.l10n['vInvalidEmail'];
      }
      // text
      else {
        // always strip HTML
        value = Utils._stripHTML(value);
      }

      if (errorMsg) {
        return {
          error: true,
          msg: errorMsg
        };
      } else {
        return value;
      }
    }
  });

  wpApi.controlConstructor['kkcp_text'] = api.controls.Text = Control$16;

  // import ControlBase from './base';

  /**
   * Control Textarea class
   *
   * @class wp.customize.controlConstructor.kkcp_textarea
   * @constructor
   * @extends api.controls.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   * @requires tinyMCE
   */
  var Control$17 = api.controls.Base.extend({
    /**
     * @override
     */
    sanitize: function (newValue) {
      if (!this.params.allowHTML && !this.params.wp_editor) {
        return _.escape(newValue);
      } else {
        return newValue;
      }
    },
    /**
     * @override
     */
    validate: function (newValue) {
     
      if (_.isString(newValue)) {
        return newValue;
      } else {
        return { error: true };
      }
    },
    /**
     * @override
     */
    onInit: function () {
      if (this.params.wp_editor) {
        this._wpEditorID = this._getWpEditorId();
      }
    },
    /**
     * Destroy tinyMCE instance
     * @override
     */
    onDeflate: function () {
      if (this.params.wp_editor) {
        // it might be that this method is called too soon, even before tinyMCE
        // has been loaded, so try it and don't break.
        try {
          if (this._wpEditorIsActive) {
            // window.tinyMCE.remove('#' + this._wpEditorID);
            window$1.wp.editor.remove(this._wpEditorID);
          }
        } catch(e) {}
      }
    },
    /**
     * @override
     */
    syncUI: function (value) {
      var lastValue;
      var wpEditorInstance;
      if (this.params.wp_editor) {
        wpEditorInstance = window$1.tinyMCE.get(this._wpEditorID);
        lastValue = wpEditorInstance.getContent();
        // lastValue = window.wp.editor.getContent(this._wpEditorID);;
      } else {
        lastValue = this.__textarea.value;
      }
      if (value && lastValue !== value) {
        // additional check to prevent the textarea content to be escaped
        // while you type if html is not allowed
        if (!this.params.allowHTML && !this.params.wp_editor
            && _.escape(lastValue) === value) {
          return;
        }
        if (this.params.wp_editor) {
          wpEditorInstance.setContent(value);
        } else {
          this.__textarea.value = value;
        }
      }
    },
    /**
     * @override
     */
    ready: function () {
      this.__textarea = this._container.getElementsByTagName('textarea')[0];

      // params.wp_editor can be either a boolean or an object with options
      if (this.params.wp_editor && !this._wpEditorIsActive) {
        this._initWpEditor();
      } else {
        this._syncAndListen();
      }
    },
    /**
     * Get textarea id, add a suffix and replace dashes with underscores
     * as suggested by WordPress Codex.
     *
     * @see https://codex.wordpress.org/Function_Reference/wp_editor -> $editor_id
     */
    _getWpEditorId: function () {
      return ((this.id.replace(/-/g, '_')) + "__textarea");
    },
    /**
     * Sync textarea and listen for changes
     */
    _syncAndListen: function () {
      var self = this;
      $(self.__textarea)
        .val(self.setting())
        .on('change keyup paste', function () {
          self.setting.set(this.value);
        });
    },
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
     */
    _initWpEditor: function () {
      // dynamically set id on textarea, then use it as a target for wp_editor
      this.__textarea.id = this._wpEditorID;

      var setting = this.setting;

      // get wp_editor custom options defined by the developer through the php API
      var optionsCustom = _.isObject(this.params.wp_editor) ? this.params.wp_editor : {};

      // set default options
      var optionsDefaults = $.extend(true, {}, window$1.wp.editor.getDefaultSettings(), {
        teeny: true,
        mediaButtons: false,
      });

      // merge the options adding the required options (the needed element id and
      // setup callback with our bindings to the WordPRess customize API)
      // in this way we make sure the required options can't be overwritten
      // by developers when declaring wp_editor support through an array of opts
      var options = $.extend(true, optionsDefaults, optionsCustom, {
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
    }
  });

  wpApi.controlConstructor['kkcp_textarea'] = api.controls.Textarea = Control$17;

  /**
   * Control Toggle
   *
   * @class wp.customize.controlConstructor.kkcp_toggle
   * @constructor
   * @extends api.controls.Checkbox
   * @augments wp.customize.Base
   * @augments wp.customize.Control
   * @augments wp.customize.Class
   */
  var Control$18 = ControlCheckbox;

  wpApi.controlConstructor['kkcp_toggle'] = api.controls.Toggle = Control$18;

  /**
   * Temp
   *
   * Temporary js to inject
   */
  // if (DEBUG) {
  //   wpApi.bind('ready', function() {
  //     console.log('wp API ready', this, arguments);
  //   });
  //   wpApi.bind('save', function() {
  //     console.log('wp API saving ...', this, arguments);
  //   });
  //   wpApi.bind('saved', function() {
  //     console.log('wp API saved !', this, arguments);
  //   });
  //   wpApi.bind('activated', function() {
  //     console.log('wp API activated ????', this, arguments);
  //   });
  //   wpApi.previewer.bind('url', function () {
  //     console.log("wpApi.previewer.bind('url'", this, arguments);
  //   });
  // }


  // // from: https://make.wordpress.org/core/2014/10/27/toward-a-complete-javascript-api-for-the-customizer/
  // wpApi.section.each(function ( section ) {
  //   if ( ! section.panel() ) {
  //     section.expand({ allowMultiple: true });
  //   }
  // });
  //

}(jQuery,marked,hljs,window,document,_,wp,kkcp,Modernizr));
