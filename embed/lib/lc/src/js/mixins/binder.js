(function(global) {

    var $ = global.$,
		util = global.util;

    global.asBinder = (function() {
        var bind = function(callback) {
                return callback.bind(this);
            },

            actOnEvents = function(fn) {
                var eventsBinderAttribute = this.asBinder.config.events;

                if (!eventsBinderAttribute || !this.$el || !this.$el.length || !fn) {
                    return;
                }

                var elements = this.$el.find('[' + eventsBinderAttribute + ']');
                elements.each(bind.call(this, function(i, el) {
                    el = $(el);
                    var values = el.attr(eventsBinderAttribute);
                    util.trim(values).split(',').forEach(this.bind(function(pair, j) {
                        var parts = pair.split(':'),
                            events = parts[0],
                            callback = parts[1];

                        if (typeof this[callback] === 'function') {
                            el[fn](events, this[callback].bind(this));
                        } else {
                            if (this.warn) this.warn(callback  + ' is not a function of', this);
                        }
                    }));
                }));
            },

            attachEvents = function() {
                actOnEvents.call(this, 'on');
            },

            unattachEvents = function() {
                actOnEvents.call(this, 'off');
            },

            defaults = {
                events: 'data-lc-events'
            };

        return function(context, config) {
            this.asBinder = this.asBinder || {};
            this.asBinder.config = $.extend(true, {}, defaults, config);

            this.attachEvents = attachEvents;
            this.unattachEvents = unattachEvents;
            this.bind = bind;

            return this;
        };
    })();

})(LoudComment);