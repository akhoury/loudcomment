(function() {

    var LC = LoudComment,
        $ = LC.$;

    LC.asTemplater = (function() {

        var ensureTemplate = function() {
                var type = typeof this.asTemplater.config.template;

                if (!this.config.template) {
                    throw new Error('a config.template is required');
                }

                if (type === 'string') {
                    this.template = function() { return this.asTemplater.config.template; }
                } else if (type === 'function') {
                    this.template = this.asTemplater.config.template.bind(this);
                } else {
                    this.template = function() { return ''; };
                }

                if (this.dispatch && this.config.codename) {
                    this.dispatch('lc:' + this.config.codename + ':template.ready');
                }

                return this.template;
            },

            render = function() {

                this.$el.stop().empty().html(this.template(this.meta || {}));

                if (this.dispatch && this.config.codename) {
                    this.dispatch('lc:' + this.config.codename + ':template.rendered');
                }

                return this.$el;
            },

            empty = function() {
                return this.$el.empty();
            },

            defaults = {
                template: function() { return ''; }
            };

        return function(config) {
            this.asTemplater = this.asTemplater = {};
            this.asTemplater.config = $.extend(true, {}, defaults, config);

            if (!this.$el)
                throw new Error('$el is required to act asTemplater.');

            this.ensureTemplate = ensureTemplate;
            this.render = render;
            this.empty = empty;

            return this;
        };
    })();
})();