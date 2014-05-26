(function() {
    var LC = LoudComment,
        util = LC.util,
        $ = LC.$,

        defaults = {
            codename: 'player',
            templates: ['player/index', 'module/_header', 'module/_footer'],
            meta: {
                title: '',
                description: '',
                lander: '',
                src: ''
            }
        };

    var Player = function(target, config) {
        if (target instanceof LC.Recorder) {
            this.recorder = target;
            target = this.recorder.$el.find('.player');
        }

        if (typeof target === 'string') {
            target = $(target).eq(0);
        }

        this.$el = target;
        this.config = $.extend(true, {}, defaults, config);

        this.id = 1;

        LC.asModule.call(this, this, this.config);
        this.init();
    };

    Player.prototype = {
        play: function() {
            this.dispatch('lc:player:playing');
        },

        pause: function() {
            this.dispatch('lc:player:paused');
        },

        stop: function() {
            this.dispatch('lc:player:stopped');
        },

        volume: function(val) {
            if (val !== undefined && this.media.volume !== val) {
                this.media.volume = val;
                this.dispatch('lc:player:volume.changed', val);
            }
            return this.media.volume;
        }
    };

    LoudComment.Player = Player;
})();