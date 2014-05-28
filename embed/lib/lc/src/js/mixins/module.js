(function(global) {

    var $ = global.$,
		util = global.util,
		domName = function(name) {
			return util.prefixedName('lc-module-', name);
		};

    global.asModule = (function() {
        var init = function() {
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

            destroy = function() {
				this.$target.removeAttr(domName('loaded'));
				this.unattachEvents();
                this.empty().remove();
            },

            fetch = function() {
                return $.ajax({
                    type: 'GET',
                    url: this.asModule.config.api,
                    data: {
                        id: this.id
                    }
                }).done(this.bind(function(response) {
                    this.trigger('data', response);
                }));
            },

            defaults = {
                codename: 'module',
                api: '//api.loudcomment.com',
                asDispatcher: {
                    config: {}
                },
                asLogger: {
                    config: {
                        prefix: '',
                        level: 'error'
                    }
                },
                asBinder: {
                    config: {}
                },
                asTemplater: {
                    config: {}
                },
				templateIndex: null
            };

        return function(context, config) {
            this.asModule = this.asModule || {};
            this.asModule.config = $.extend(true, {}, defaults, config);

            /* abstract some mixins configs for 'sexiness' purposes */
            if (this.asModule.config.codename) {
                this.asModule.config.asLogger.config.prefix = 'lc:' + this.asModule.config.codename + ':';
            }
            if (this.asModule.config.templates) {
                this.asModule.config.asTemplater.config.templates = this.asModule.config.templates;
            }
            if (this.asModule.config.template) {
                this.asModule.config.asTemplater.config.template = this.asModule.config.template;
            }
            if (this.asModule.config.templateIndex) {
                this.asModule.config.asTemplater.config.templateIndexName = this.asModule.config.templateIndex;
            }

			global.asDispatcher.call(this, this.asModule.config.asDispatcher.config);
			global.asLogger.call(this, this.asModule.config.asLogger.config);
			global.asBinder.call(this, this.asModule.config.asBinder.config);
			global.asTemplater.call(this, this.asModule.config.asTemplater.config);

			this.destroy = destroy;
            this.init = init;
            this.fetch = fetch;

            return this;
        };
    })();

})(LoudComment);