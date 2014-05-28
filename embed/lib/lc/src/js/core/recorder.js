(function() {
    var LC = LoudComment,
        util = LC.util,
        $ = LC.$,

        defaults = {
            codename: 'recorder',
            templates: ['recorder/index']
		},

		domName = function(name) {
			return util.prefixedName('lc-recorder-', name);
		};

    var Recorder = function(target, config) {
        this.$target = $(target).eq(0);
        this.target = this.$target.get(0);
        this.config = $.extend(true, {}, defaults, config);

		this.$el = $('<div />')
			.addClass(domName('container'))
			.hide()
			.insertAfter(this.$target);

		LC.asModule.call(this, this, this.config);

		this.on('data', this.setup.bind(this));
		this.init();
    };

    Recorder.prototype = {
		setup: function() {
			this.$el.show();
			this.bindUI();
		},

		upload: function() {
			this.dispatch('upload');
		},

        record: function() {
			this.dispatch('record');

			this.dispatch('recording');
            this.dispatch('recorded');
        },

        stop: function() {
			this.dispatch('stop');

			this.dispatch('saving');
            this.dispatch('saved');
        },

        cancel: function() {
            this.dispatch('cancel');
        },

        play: function() {
			this.dispatch('play');
		},

        pause: function() {
			this.dispatch('pause');
		},

        volume: function(val) {

        },

        state: function() {

		},

		bindUI: function() {
			this.on('record', this.onRecord.bind(this));
			this.on('stop', this.onStop.bind(this));
			this.on('play', this.onPlay.bind(this));
			this.on('pause', this.onPause.bind(this));
			this.on('populate', this.onUpload.bind(this));
			this.on('cancel', this.onCancel.bind(this));
		},

		onPlay: function() {
			this.findByClass('play-btn').addClass('lc-hidden');
			this.findByClass('pause-btn').removeClass('lc-hidden');
		},

		onRecord: function() {
			this.findByClass('mic-btn').addClass('lc-hidden');
			this.findByClass('stop-btn').removeClass('lc-hidden');
			this.findByClass('cancel-btn').removeClass('lc-hidden');
			this.findByClass('times').removeClass('lc-hidden');
		},

		onStop: function() {
			this.findByClass('mic-btn').addClass('lc-hidden');
			this.findByClass('pause-btn').addClass('lc-hidden');
			this.findByClass('stop-btn').addClass('lc-hidden');
			this.findByClass('play-btn').removeClass('lc-hidden');
			this.findByClass('cancel-btn').removeClass('lc-hidden');
			this.findByClass('upload-btn').removeClass('lc-hidden');
			this.findByClass('times').removeClass('lc-hidden');
		},

		onUpload: function() {

		},

		onPause: function() {
			this.onStop();
		},

		onCancel: function() {
			this.findByClass('mic-btn').removeClass('lc-hidden');
			this.findByClass('stop-btn').addClass('lc-hidden');
			this.findByClass('play-btn').addClass('lc-hidden');
			this.findByClass('pause-btn').addClass('lc-hidden');
			this.findByClass('upload-btn').addClass('lc-hidden');
			this.findByClass('cancel-btn').addClass('lc-hidden');
			this.findByClass('times').addClass('lc-hidden');
		},

		onTimeUpdate: function() {

		},

		findByClass: function(selector) {
			return this.$el.find('.' + domName(selector));
		}
    };

    LoudComment.Recorder = Recorder;
})();