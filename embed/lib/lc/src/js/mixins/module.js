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
            }

        return function(context, config) {

			this.destroy = destroy;
            this.init = init;
            this.fetch = fetch;

            return this;
        };
    })();

})(LoudComment);