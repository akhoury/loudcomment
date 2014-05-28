(function(global) {

    var Engine = global.TemplateEngine,
        $ = global.$;

    global.templates = global.templates || {};
    global.asTemplater = (function() {

        var ensureTemplates = function(callback, options) {
                options = options || {};

                var ajaxOptions = $.extend({}, options.ajaxOptions),
                    config = this.asTemplater.config,
                    deferreds = [],
                    done = this.bind(function() {
                        Object.keys(global.templates).forEach(this.bind(function(name) {
                            if (
                                this.asTemplater.config.templateIndexName
                                && name === this.asTemplater.config.templateIndexName
                                && typeof global.templates[name] === 'function'
                                ) {
                                this.template = global.templates[name];
                            }
                            if (this.asTemplater.config.partialsPattern.test(name)) {
                                this.registerTemplatePartial(name, global.templates[name]);
                            }
                        }));

                        if (typeof callback === 'function') {
                            callback.call(this, global.templates);
                        }
                        this.dispatch('lc:' + this.config.codename + ':templates.ready');
                    });

                if (!config.template && (!Array.isArray(config.templates) || !config.templates.length)) {
                    throw new Error('at least one config template Value or Url Pair(s) is required');
                }


                var templateUrlPair, templateValuePair, templatesUrlPairs = [], templatesValuePairs = [];

                if (config.template) {
                    if (typeof config.template === 'object') {
                        if (config.template.url) {
                            templateUrlPair = config.template;
                        } else if (config.template.value) {
                            templateValuePair = config.template
                        }

                    } else if (typeof config.template === 'string') {
                        // assume it's a URL name, without a url, which would be determined by the config.urlTemplate
                        templateUrlPair = {name: config.template};
                    }

                    if (!this.asTemplater.config.templateIndexName) {
                        this.asTemplater.config.templateIndexName = config.template.name || config.template;
                    }
                }

                if (Array.isArray(config.templates) && config.templates.length) {
                    for (var i = 0; i < config.templates.length; i++) {
                        var template = config.templates[i] || '',
                            name = template.name || template;

                        if (!i && !this.asTemplater.config.templateIndexName) {
                            this.asTemplater.config.templateIndexName = name;
                        }

                        if (typeof template === 'object') {
                            if (template.url) {
                                templatesUrlPairs.push(template);
                            } else if (template.value) {
                                templatesValuePairs.push(template);
                            }
                        } else if (typeof template === 'string') {
                            // assume it's a URL name, without a url, which would be determined by the config.urlTemplate
                            templatesUrlPairs.push({name: template});
                        }
                    }
                }

                if (templateValuePair) {
                    deferreds.push(this.setTemplateByValue(templateValuePair.name, templateValuePair.value));
                }

                if (templatesValuePairs.length) {
                    deferreds.push(this.setTemplatesByValues(templatesValuePairs));
                }

                if (templateUrlPair) {
                    deferreds.push(this.setTemplateByUrl(templateUrlPair.name || templateUrlPair, templateUrlPair.url, ajaxOptions));
                }

                if (templatesUrlPairs.length) {
                    deferreds.push(this.setTemplatesByUrls(templatesUrlPairs));
                }

                return $.when.apply(this, deferreds).done(done);
            },

            registerPartial = function(name, value) {
                return Engine.registerPartial(name, value);
            },

            registerHelper = function(name, callback) {
                return Engine.registerHelper(name, callback);
            },

            setTemplateByValue = function(name, value) {
                var type = typeof value,
                    template,
                    deferred = new $.Deferred();

                if (type === 'string') {
                    template = Engine.compile(value);
                } else if (type === 'function') {
                    template = value.bind(this);
                }

                global.templates[name] = template;
                deferred.resolve();

                return deferred;
            },

            setTemplatesByValues = function(list) {
                var deferred = new $.Deferred();

                list.forEach(this.bind(function(pair) {
                    this.setTemplateByValue(pair.name, pair.value);
                }));

                deferred.resolve();
                return deferred;
            },

            setTemplateByUrl = function(name, url, options) {
                if (!url && typeof name === 'string' && this.asTemplater.config.urlTemplate) {
                    url = Engine.compile(this.asTemplater.config.urlTemplate)({templateName: name});
                }

                return $.ajax($.extend({}, options, {
                    url: url,
                    dataType: "html"
                })).done(function(data){
                    global.templates[name] = Engine.compile(data);
                }).fail(function(){
                    if (self.warn) {
                        self.warn(name + " template ajax failed");
                    }
                });
            },

            setTemplatesByUrls = function(list, options) {
                var deferreds = [];

                list.forEach(this.bind(function(pair) {
                    deferreds.push(this.setTemplateByUrl(pair.name || pair, pair.url, options));
                }));

                return $.when.apply(this, deferreds);
            },

            render = function() {
                this.$el.stop().empty().html(
                    this.template(
                        $.extend(true, this.config || {}, this.meta || {})
                    ));

                if (this.dispatch && this.config.codename) {
                    this.dispatch('lc:' + this.config.codename + ':template.rendered');
                }

                return this.$el;
            },

            empty = function() {
                return this.$el.empty();
            },

            defaults = {
                template: null,
                templates: null,

                partialsPattern: /\_/,
                urlTemplate: '/lib/lc/src/templates/{{templateName}}.hbs',
                templateIndexName: ''
            };

        return function(config) {
            this.asTemplater = this.asTemplater = {};
            this.asTemplater.config = $.extend(true, {}, defaults, config);

            if (!this.$el)
                throw new Error('$el is required to act asTemplater.');

            this.ensureTemplates = ensureTemplates;

            this.registerTemplatePartial = registerPartial;
            this.registerTemplateHelper = registerHelper;

            this.setTemplateByValue = setTemplateByValue;
            this.setTemplatesByValues = setTemplatesByValues;
            this.setTemplateByUrl = setTemplateByUrl;
            this.setTemplatesByUrls = setTemplatesByUrls;

            this.render = render;
            this.empty = empty;

            return this;
        };
    })();

})(LoudComment);