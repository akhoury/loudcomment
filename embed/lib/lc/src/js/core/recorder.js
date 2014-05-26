(function() {
    var LC = LoudComment,
        util = LC.util,
        $ = LC.$,
        defaults = {
            codename: 'recorder',
            templates: ['recorder/index', 'module/_header', 'module/_footer']
        };

    var Recorder = function(target, config) {

        if (target instanceof LC.Player) {
            this.player = target;
            target = this.player.$el.find('.recorder');
        }

        if (typeof target === 'string') {
            target = $(target).eq(0);
        }

        this.$el = target;
        this.config = $.extend(true, {}, defaults, config);

        LC.asModule.call(this, this, this.config);
        this.init();
    };

    Recorder.prototype = {
        record: function() {
            this.dispatch('lc:recorder:recording');
            this.dispatch('lc:recorder:recorded');
        },

        save: function() {
            this.dispatch('lc:recorder:saving');
            this.dispatch('lc:recorder:saved');
        },

        cancel: function() {
            this.dispatch('lc:recorder:cancelled');
        },

        play: function() {
        },

        pause: function() {
        },

        stop: function() {
        },

        volume: function(val) {
        },

        state: function() {
        }
    };

    LoudComment.Recorder = Recorder;
})();