(function() {
	var LC = LoudComment,
		Model = LC.Model,
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
		config = $.extend(true, {}, defaults, config);

		this.on('data', this.setup.bind(this));
		Model.call(this, target, config);
	};

	Recorder.prototype = new Model();

	Recorder.prototype.setup = function() {
		this.$el
			.addClass(domName('container'))
			.insertAfter(this.$target)
			.show();

		this.bindAdjust();
		this.bindUI();
	};

	Recorder.prototype.upload = function() {
		this.dispatch('upload');
	};

	Recorder.prototype.record = function() {
		this.dispatch('record');

		this.dispatch('recording');
		this.dispatch('recorded');
	};

	Recorder.prototype.stop = function() {
		this.dispatch('stop');

		this.dispatch('saving');
		this.dispatch('saved');
	};

	Recorder.prototype.cancel = function() {
		this.dispatch('cancel');
	};

	Recorder.prototype.play = function() {
		this.dispatch('play');
	};

	Recorder.prototype.pause = function() {
		this.dispatch('pause');
	};

	Recorder.prototype.adjust = function() {
		var pos = this.$target.position(),
			w = this.$target.width();

		//todo: meh
		this.$el.css({position: 'absolute', top: pos.top + 3, left: pos.left + w - 100});
		this.trigger('adjust');
	};

	Recorder.prototype.bindAdjust = function() {
		this.adjust();

		if (this.$target.attrchange) {
			// https://code.google.com/p/chromium/issues/detail?id=293948
			this.$target.attrchange({trackValues: true, callback: this.adjust.bind(this)});
		}
		$(window).resize(this.adjust.bind(this));
		this.$target.on('resize change', this.adjust.bind(this));
	};

	Recorder.prototype.bindUI = function() {
		this.on('record', this.onRecord.bind(this));
		this.on('stop', this.onStop.bind(this));
		this.on('play', this.onPlay.bind(this));
		this.on('adjust', this.onAdjust.bind(this));
		this.on('pause', this.onPause.bind(this));
		this.on('populate', this.onUpload.bind(this));
		this.on('cancel', this.onCancel.bind(this));
	};

	Recorder.prototype.onPlay = function() {
		this.findByClass('play-btn').addClass('lc-hidden');
		this.findByClass('pause-btn').removeClass('lc-hidden');
	};

	Recorder.prototype.onRecord = function() {
		this.findByClass('mic-btn').addClass('lc-hidden');
		this.findByClass('stop-btn').removeClass('lc-hidden');
		this.findByClass('cancel-btn').removeClass('lc-hidden');
		this.findByClass('times').removeClass('lc-hidden');
	};

	Recorder.prototype.onStop = function() {
		this.findByClass('mic-btn').addClass('lc-hidden');
		this.findByClass('pause-btn').addClass('lc-hidden');
		this.findByClass('stop-btn').addClass('lc-hidden');
		this.findByClass('play-btn').removeClass('lc-hidden');
		this.findByClass('cancel-btn').removeClass('lc-hidden');
		this.findByClass('upload-btn').removeClass('lc-hidden');
		this.findByClass('times').removeClass('lc-hidden');
	};

	Recorder.prototype.onUpload = function() {

	};

	Recorder.prototype.onPause = function() {
		this.onStop();
	};

	Recorder.prototype.onCancel = function() {
		this.findByClass('mic-btn').removeClass('lc-hidden');
		this.findByClass('stop-btn').addClass('lc-hidden');
		this.findByClass('play-btn').addClass('lc-hidden');
		this.findByClass('pause-btn').addClass('lc-hidden');
		this.findByClass('upload-btn').addClass('lc-hidden');
		this.findByClass('cancel-btn').addClass('lc-hidden');
		this.findByClass('times').addClass('lc-hidden');
	};

	Recorder.prototype.onAdjust = function() {
	};

	Recorder.prototype.onTimeUpdate = function() {

	};

	Recorder.prototype.findByClass = function(selector) {
		return this.$el.find('.' + domName(selector));
	};

	LoudComment.Recorder = Recorder;
})();