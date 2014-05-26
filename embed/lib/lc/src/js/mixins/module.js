(function(global) {

    var $ = global.$;

    global.asModule = (function() {
        var init = function() {
                global.asDispatcher.call(this, this.asModule.config.asDispatcher.config);
                global.asLogger.call(this, this.asModule.config.asLogger.config);
                global.asBinder.call(this, this.asModule.config.asBinder.config);
                global.asTemplater.call(this, this.asModule.config.asTemplater.config);


                this.ensureTemplates().done(this.bind(function() {
                    this.on('lc:module:data', this.bind(function(data) {
                        this.meta = data || {};

                        this.render();
                        this.attachEvents();
                    }));

                    if (this.id)
                        this.fetch();
                    else {
                        this.trigger('lc:module:data');
                    }
                }));

            },

            destroy = function(){
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
                    this.trigger('lc:module:data', response);
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
                        prefix: 'lc:module:',
                        level: 'error'
                    }
                },
                asBinder: {
                    config: {}
                },
                asTemplater: {
                    config: {}
                }
            };

        return function(context, config) {
            this.asModule = this.asModule || {};
            this.asModule.config = $.extend(true, {}, defaults, config);

            /* abstract some mixins configs for 'sexiness' purposes */

            if (config.codename) {
                this.asModule.config.asLogger.config.prefix = 'lc:' + config.codename + ':';
            }
            if (this.config.templates) {
                this.asModule.config.asTemplater.config.templates = config.templates;
            }
            if (this.config.template) {
                this.asModule.config.asTemplater.config.template = config.template;
            }
            if (this.config.templateIndex) {
                this.asModule.config.asTemplater.config.templateIndexName = config.templateIndex;
            }

            this.destroy = destroy;
            this.init = init;
            this.fetch = fetch;

            return this;
        };
    })();

})(LoudComment);