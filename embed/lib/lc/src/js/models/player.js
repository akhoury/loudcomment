(function() {
    var LC = LoudComment,
		Model = LC.Model,
        util = LC.util,
        $ = LC.$,
        defaults = {
            codename: 'player',
            templates: ['player/index'],
            meta: {
                title: '',
                description: '',
                lander: '',
                src: ''
            },

			playbableTextPattern: /loudcomment.com/
		},

		domName = function(name) {
			return util.prefixedName('lc-player-', name);
		};

    var Player = function(target, config) {
        this.$target = $(target).eq(0);
		this.target = this.$target.get(0);
		this.config = $.extend(true, {}, defaults, config);
        this.$el = $('<div />')
			.addClass(domName('container'))
			.hide()
			.appendTo(this.$target);

        LC.asModule.call(this, this, this.config);
        this.on('data', this.setup.bind(this));
		this.init();
    };

    Player.prototype = {
        setup: function() {
			var a = this.$target.find('a:contains');
		},

		play: function() {
            this.dispatch('playing');
        },

        pause: function() {
            this.dispatch('paused');
        },

        stop: function() {
            this.dispatch('stopped');
        },

        volume: function(val) {
            if (val !== undefined && this.media.volume !== val) {
                this.media.volume = val;
                this.dispatch('volume.changed', val);
            }
            return this.media.volume;
        }
    };

    LoudComment.Player = Player;
})();