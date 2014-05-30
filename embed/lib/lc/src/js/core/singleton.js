(function(global) {

    var LC = function(target, config) {
		// maybe not
	};

	LC.$ = global.jQuery || global.Zepto || global.$;
	LC.TemplateEngine = global.Handlebars;
	LC.envGlobal = global;

	var $ = LC.$,
		defaults = {
            recordersSelector: ''
				+ 'input[type="text"],'
				+ 'input[type="search"],'
				+ 'input[type="email"],'
				+ 'input[type="url"],'
				+ 'input[type="tel"],'
				+ 'input[type="number"],'
				+ 'textarea',

            playersSelector: ':not(iframe)'
		};

	LC.reload = function(config) {
		var i = 0;
		LC.instances = LC.instances || [];
		while (LC.instances.length) {
			LC.instances[i].destroy();
			delete LC.instances[i];
		}

		LC.load(config);
	};

	LC.load = function(config) {
		config = $.extend(true, defaults, config);
		LC.instances = LC.instances || [];

		var inputs = $(config.recordersSelector);
		inputs.each(function(i, el) {
			LC.instances.push(new LC.Recorder(el, config));
		});

		var posts = $(config.playersSelector);
		posts.filter(function() { return this.nodeType === 3; }).each(function(i, el) {
			LC.instances.push(new LC.Player(el, config));
		});
	};

	global.LC = LC;
	global.LoudComment = LC;

})(this);