(function(global) {
	'use strict';

	var util = {}, fs, path;

	if ('undefined' === typeof window) {
		fs = require('fs');
		path = require('path');
	} else {
		// in a browser
	}

	util.merge = function() {
		var result = {}, obj, keys;
		for (var i = 0; i < arguments.length; i++) {
			obj = arguments[i] || {};
			keys = Object.keys(obj);
			for (var j = 0; j < keys.length; j++) {
				result[keys[j]] = obj[keys[j]];
			}
		}
		return result;
	};

	util.injectScripts = function (arr, callback, options) {
		if (arr && arr.length) {
			util.injectScript(arr[0], util.merge({}, options, {onload: function() { util.injectScripts(arr.slice(1), callback, options);}}));
		} else {
			if (typeof(callback) == 'function')
				callback();
		}
	};

	util.injectStyles = function(arr, callback, options) {
		if (arr && arr.length) {
			util.injectStyle(arr[0], util.merge({}, options, {onload: function() { util.injectStyles(arr.slice(1), callback, options)}}));
		} else {
			if (typeof(callback) == 'function')
				callback();
		}
	};

	util.injectScript = function(src, options) {
		options || (options = {});
		util.injectTag('script', {src: src, type: 'text/javascript'}, options);
	};

	util.injectStyle = function(href, options) {
		options || (options = {});
		var img = document.createElement('img');

		img.onerror = options.onload || null;
		delete options.onload;

		util.injectTag('link', {href: href, type: 'text/css', rel: 'stylesheet'}, options);
		img.src = href;
	};

	util.injectTag = function (tagName, attrs, options) {
		options || (options = {});

		var tag = document.createElement(tagName);
		tag.onload = options.onload || null;

		Object.keys(attrs).forEach(function(key) {
			tag.setAttribute(key, attrs[key]);
		});

		if (options.insertBefore) {
			options.insertBefore.parentNode.insertBefore(tag, options.insertBefore);
		} else if (options.appendChild) {
			options.appendChild.appendChild(tag);
		} else {
			var scripts = document.getElementsByTagName('script');
			scripts[scripts.length - 1].parentNode.appendChild(tag);
		}
	};


	util.selectContent = function(target) {
		var $el = $(target),
			el = $el.get(0),
			tagName = $el.prop('tagName'),
			range;

		if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
			return el.select();
		}

		if (document.body.createTextRange) { // ms
			range = document.body.createTextRange();
			range.moveToElementText(el);
			range.select();
		} else if (window.getSelection) { // moz, opera, webkit
			var selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(el);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	};


	util.scrollTo = function(selector) {
		var offset = $(selector).offset();
		if (offset)
			$('body, html').stop().animate({scrollTop: parseInt(offset.top, 10)}, 500);
	};

	//todo: get rid of this, I haz moment.js now
	util.ago = function(timestamp) {
		var seconds = Math.floor((+new Date() - timestamp) / 1000),
			interval = Math.floor(seconds / 31536000);
		if (interval > 1)
			return interval + ' years';
		interval = Math.floor(seconds / 2592000);
		if (interval > 1)
			return interval + ' months';
		interval = Math.floor(seconds / 86400);
		if (interval > 1)
			return interval + ' days';
		interval = Math.floor(seconds / 3600);
		if (interval > 1)
			return interval + ' hours';
		interval = Math.floor(seconds / 60);
		if (interval > 1)
			return interval + ' minutes';
		return Math.floor(seconds) + ' seconds';
	};

	util.generateUUID = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};

	util.isNumber = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};

	util.daysInMonth = function (m, y) {
		y = y || (new Date).getFullYear();
		return /8|3|5|10/.test(m) ? 30 : m == 1 ? (!(y % 4) && y % 100) || !(y % 400) ? 29 : 28 : 31;
	};

	util.titlelize = function (str) {
		str || (str = '');
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	util.hasNumber = function (n) {
		return !isNaN(parseFloat(n));
	};

	util.truncate = function (str, len) {
		if (typeof str != 'string') return str;
		len = util.isNumber(len) ? len : 20;
		return str.length <= len ? str : str.substr(0, len - 3) + '...';
	};

	util.arrMin = function (arr) {
		return Math.min.apply(null, arr);
	};

	util.arrMax = function (arr) {
		return Math.max.apply(null, arr);
	};

	util.augmentFunction = function (base, extra, context) {
		return (function () {
			return function () {
				base.apply(context || this, arguments);
				extra.apply(context || this, arguments);
			};
		})();
	};

	// return boolean if 'true' or 'false', or a number if parsable
	// doesn't support object and arrays parsing, maybe try { JSON.parse(..) } catch(){}
	util.toType = function(str){
		var type = typeof str, nb = parseFloat(str);
		if (type == 'boolean' || type == 'number')
			return str;
		else
			return !isNaN(nb) && isFinite(str) ? nb : str === 'true' ? true : str === 'false' ? false : str;
	};

	util.isIE = function () {
		var myNav = navigator.userAgent.toLowerCase();
		return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	};

	//http://dense13.com/blog/2009/05/03/converting-string-to-slug-javascript
	util.slugify = function(str) {
		str = str.replace(/^\s+|\s+$/g, '');
		str = str.toLowerCase();
		if(/^[\w]+$/.test(str)) {
			str = str.replace(/[^\w\s\d\-_]/g, '-');
		}
		str = str.replace(/\s+/g, '-');
		str = str.replace(/-+/g, '-');
		str = str.replace(/-$/g, '');
		str = str.replace(/^-/g, '');
		return str;
	};

	util.fileExtension = function (path) {
		return ('' + path).split('.').pop();
	};

	// stolen from Angular https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L11
	// then closed over the pattern for performance
	util.isValidUrl = (function(){
		var pattern = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
		return function (url) {
			return url && url.length < 2083 && url.match(pattern);
		};
	})();

	util.urlToLocation = function(url) {
		var a = document.createElement('a');
		a.href = url;
		return a;
	};

	util.generateUUID = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};

	// http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
	util.walk = function(dir, done) {
		var results = [];

		fs.readdir(dir, function(err, list) {
			if (err) {
				return done(err);
			}
			var pending = list.length;
			if (!pending) {
				return done(null, results);
			}
			list.forEach(function(file) {
				file = dir + '/' + file;
				fs.stat(file, function(err, stat) {
					if (stat && stat.isDirectory()) {
						util.walk(file, function(err, res) {
							results = results.concat(res);
							if (!--pending) {
								done(null, results);
							}
						});
					} else {
						results.push(file);
						if (!--pending) {
							done(null, results);
						}
					}
				});
			});
		});
	};

	// https://github.com/gruntjs/grunt/blob/master/lib/grunt/file.js#L209
	util.recurse = function (rootdir, callback, subdir) {
		var abspath = subdir ? path.join(rootdir, subdir) : rootdir;

		fs.readdirSync(abspath).forEach(function(filename) {
			var filepath = path.join(abspath, filename);
			if (fs.statSync(filepath).isDirectory()) {
				util.recurse(rootdir, callback, path.join(subdir || '', filename || ''));
			} else {
				callback(filepath, rootdir, subdir, filename);
			}
		});
	};

	util.customWalk = function (dir, options) {
		options || (options = {});
		var arr = [],
			parse = typeof options.parse == 'function' ? options.parse : function(s) { return s;},
			pre = Array.isArray(options.pre) ? options.pre : [],
			post = Array.isArray(options.post) ? options.post : [],
			skip = Array.isArray(options.skip) ? options.skip : [];

		if (fs.existsSync(dir)) {
			util.recurse(dir, function(file) {
				var ext = ('' + file).split('.').pop();
				if (pre.indexOf(file) === -1 && post.indexOf(file) === -1 && skip.indexOf(file) === -1 && (!options.ext || options.ext === ext)) {
					arr.push(parse(file));
				}
			});
		}

		return pre.map(parse).concat(arr, post.map(parse));
	};


	util.urlToLocation = function(url) {
		var a = document.createElement('a');
		a.href = url;
		return a;
	};

	// return boolean if string 'true' or string 'false', or if a parsable string which is a number
	// also supports JSON object and/or arrays parsing
	util.toType = function(str) {
		var type = typeof str;
		if (type !== 'string') {
			return str;
		} else {
			var nb = parseFloat(str);
			if (!isNaN(nb) && isFinite(str))
				return nb;
			if (str === 'false')
				return false;
			if (str === 'true')
				return true;

			try {
				str = JSON.parse(str);
			} catch (e) {}

			return str;
		}
	};

	// Safely get/set chained properties on an object
	// set example: utils.props(A, 'a.b.c.d', 10) // sets A to {a: {b: {c: {d: 10}}}}, and returns 10
	// get example: utils.props(A, 'a.b.c') // returns {d: 10}
	// get example: utils.props(A, 'a.b.c.foo.bar') // returns undefined without throwing a TypeError
	// credits to github.com/gkindel
	util.props = function(obj, props, value) {
		if(obj === undefined)
			obj = window;
		if(props == null)
			return undefined;
		var i = props.indexOf('.');
		if( i == -1 ) {
			if(value !== undefined)
				obj[props] = value;
			return obj[props];
		}
		var prop = props.slice(0, i),
			newProps = props.slice(i + 1);

		if(props !== undefined && !(obj[prop] instanceof Object) )
			obj[prop] = {};

		return util.props(obj[prop], newProps, value);
	};

	util.minifiedVersion = function(url) {
		var arr = ('' + url).split('.');
		arr.splice(arr.length - 1, 0, 'min');
		return arr.join('.');
	};

	util.params = function(options) {
		var a, hash = {}, params;

		options = options || {};
		options.skipToType = options.skipToType || {};

		if (options.url) {
			a = utils.urlToLocation(options.url);
		}
		params = (a ? a.search : window.location.search).substring(1).split("&");

		params.forEach(function(param) {
			var val = param.split('='),
				key = decodeURI(val[0]),
				value = options.skipToType[key] ? decodeURI(val[1]) : utils.toType(decodeURI(val[1]));

			if (key)
				hash[key] = value;
		});
		return hash;
	};

	util.param = function(key) {
		return util.params()[key];
	};

	util.prefixedName = function (prefix, name) {
		var parts = (name || '')
			.replace(/\s{2,}/g, ' ')
			.split(' ');

		return $.map(parts, function(v, i) {
			return prefix + (v || '');
		}).join(' ');
	};

	// todo: trim spaces
	util.trim = function(s) {
		return s;
	};

	if (typeof module !== 'undefined') {
		module.exports = util.merge({}, util, global.util || {});
	} else {
		global.util = util.merge({}, util, global.util || {});
	}

})(window.LoudComment);