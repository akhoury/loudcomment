(function(global) {
	var util = global.util,
		$ = global.$,
		defaults = {
			widgetName: 'widget',
			api: '//api.loudcomment.com',

			asDispatcher: {},
			asLogger: {},
			asBinder: {},
			asTemplater: {},

			templates: null,
			template: null,
			templateIndex: null
		};

	var Widget = function(target, config) {
		this.$target = $(target).eq(0);
		this.target = this.$target.get(0);
		this.config = $.extend(true, {}, defaults, config, this.config);
        this.$el = $('<div />');

		/* abstract some mixins configs for 'sexiness' purposes */
		if (this.config.widgetName) {
			this.config.asLogger.prefix = 'lc:' + this.config.widgetName + ':';
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

        /* mixins */
		global.asDispatcher.call(this, this.config.asDispatcher);
		global.asLogger.call(this, this.config.asLogger);
		global.asBinder.call(this, this.config.asBinder);
		global.asTemplater.call(this, this.config.asTemplater);

        this.uuid = this.config.widgetName + '-' + util.generateUUID();
        this.$el.attr({'data-lc-uuid': this.uuid});
	};

	Widget.prototype = {

		init: function() {
			this.$target.attr(this.domName('loaded'), true);
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
			this.$target.removeAttr(this.domName('loaded'));
			this.unattachEvents();
			this.$el.empty().remove();
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
		},

        fetchData: function() {
            return this.fetch.apply(this, arguments);
        },

        domName: function(name) {
            return util.prefixedName('lc-' + this.config.widgetName + '-', name);
        },

        eventName: function(name) {
            return util.prefixedName('lc:' + this.config.widgetName + ':', name);
        }
	};

	global.Widget = Widget;

})(LoudComment);