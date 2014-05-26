(function() {

    var LC = LoudComment,
        $ = LC.$;

    LC.asDispatcher = (function() {

        var on = function() {
                this.$dispatcher.on.apply(this.$dispatcher, arguments);
                return this;
            },

            trigger = function() {
                this.$dispatcher.trigger.apply(this.$dispatcher, arguments);
                return this;
            },

            one = function() {
                this.$dispatcher.one.apply(this.$dispatcher, arguments);
                return this;
            },

            off = function() {
                this.$dispatcher.off.apply(this.$dispatcher, arguments);
                return this;
            },

            defaults = {};

        return function(context, config) {
            this.asDispatcher = this.asDispatcher || {};
            this.asDispatcher.config = $.extend(true, {}, defaults, config);

            this.$dispatcher = $('<bl />');

            this.on = on;
            this.trigger = trigger;
            this.one = one;
            this.off = off;

            /* aliases */
            this.listen = on;
            this.once = one;
            this.dispatch = trigger;
            this.forget = off;
            this.addEventListener = on;
            this.removeEventListener = off;
            this.dispatchEvent = trigger;

            return this;
        };
    })();
})();