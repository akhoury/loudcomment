(function(global) {
	var util = global.util,
		$ = global.$,
		domName = function(name) {
			return util.prefixedName('lc-model-', name);
		},
		defaults = {
			name: 'model',
			api: '//api.loudcomment.com',
			asDispatcher: {},
			asLogger: {
				prefix: '',
				level: 'error'
			},
			asBinder: {},
			asTemplater: {},

			templates: null,
			template: null,
			templateIndex: null
		};

	var Model = function(target, config) {

		this.$target = $(target).eq(0);
		this.target = this.$target.get(0);
		this.config = $.extend(true, {}, defaults, config);
		this.$el = $('<div />');

		/* abstract some mixins configs for 'sexiness' purposes */
		if (this.config.codename) {
			this.asModule.asLogger.prefix = 'lc:' + this.config.codename + ':';
		}
		if (this.config.templates) {
			this.config.asTemplater.templates = this.config.templates;
		}
		if (this.config.template) {
			this.config.asTemplater.template = this.config.template;
		}
		if (this.config.templateIndex) {
			this.config.asTemplater.templateIndexName = this.config.templateIndex;
		}

		global.asDispatcher.call(this, this.config.asDispatcher);
		global.asLogger.call(this, this.config.asLogger);
		global.asBinder.call(this, this.config.asBinder);
		global.asTemplater.call(this, this.config.asTemplater);

		this.init();
	};

	Model.prototype = {

		init: function() {
			this.$target.attr(domName('loaded'), true);
			this.ensureTemplates().done(this.bind(function() {
				this.on('data', this.bind(function(data) {
					this.meta = data || {};
					this.render();
					this.attachEvents();
				}));

				if (this.id)
					this.fetch();
				else {
					this.trigger('data');
				}
			}));
		},

		destroy: function() {
			this.$target.removeAttr(domName('loaded'));
			this.unattachEvents();
			this.empty().remove();
		},

		fetch: function() {
			return $.ajax({
				type: 'GET',
				url: this.config.api + '/' + this.codename,
				data: {
					id: this.id
				}
			}).done(this.bind(function(response) {
				this.trigger('data', response);
			}));
		}
	};

	global.Model = Model;

})(LoudComment);