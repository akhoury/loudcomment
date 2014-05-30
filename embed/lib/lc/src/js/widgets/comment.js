(function(global) {

    var util = global.util,
		$ = global.$,
		Widget = global.Widget,
        defaults = {
			widgetName: 'comment',
			templates: ['comment/index', 'module/_header', 'module/_footer']
		};

	var Comment = function(target, config) {
        Widget.call(this, target, $.extend(true, {}, defaults, config));

        this.on('data', this.setup.bind(this));
        this.init();
	};

	Comment.prototype = {
		post: function() {},
		get: function() {},
		replyTo: function() {},
		voteUp: function() {},
		voteDown: function() {},
		vote: function(inc) {},
		favorite: function() {},
		unfavorite: function() {}
	};

	global.Comment = Comment;

})(LoudComment);