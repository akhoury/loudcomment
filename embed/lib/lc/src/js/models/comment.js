(function(global) {
	var util = global.util,
		$ = global.$,

		defaults = {
			codename: 'comment',
			templates: ['comment/index', 'module/_header', 'module/_footer']
		},
		domName = function(name) {
			return util.prefixedName('lc-comment-', name);
		};

	var Comment = function(target, config) {
		throw new Error('Not implemented yet!');

		this.$target = $(target);
		this.target = this.$target.get(0);
		this.$el = $('<div />')
			.addClass(domName('container'))
			.hide()
			.appendTo(this.$target);

		this.config = $.extend(true, {}, defaults, config);

		global.asModule.call(this, this, this.config);
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