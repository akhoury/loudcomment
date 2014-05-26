(function(){
    var $ = jQuery || window.jQuery;

    // safe console
    if (!window.console) console = {};
    if (!console.log) console.log = function(){};
    if (!console.error) console.error = function(){};
    if (!console.warn) console.warn = function(){};


    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    var defaults = {
        api: {
            url: "//loudcomment.com",
            path: "/c/"
        }
    };

    var LoudComment = function (config) {

        if (! (this instanceof LoudComment) )
            return new LoudComment(config);

        this.config = $.extend({}, defaults, config);
        LoudComment.DEBUG = this.config.debug;
    };

    LoudComment.prototype = {};

    LoudComment.addModule = function(name, cb){
        var _proto = LoudComment.prototype;
        if( _proto[name] )
            throw "Cannot add module: " + name + ", name already taken";

        _proto[name] = function () {
            cb.apply(this, arguments);
            return this;
        };
    };

    LoudComment.l = function(str){
        if (this.DEBUG)
            console.log(str);
    };

    LoudComment.ui = {};
    LoudComment.util = {};

    // for later use
    LoudComment.isiOS = /iphone|ipod|ipad/i.test(navigator.userAgent);
    LoudComment.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

    window.LoudComment = LoudComment;
    window.LC = LoudComment;

})();

(function(jQuery, window){
    var $ = jQuery || window.jQuery;
    var LC = window.LoudComment || window.LC;
    var defaults = {};

    var Recorder = function (options) {

        if (! (this instanceof Recorder) )
            return new Recorder(config);

        this.config = $.extend({}, defaults, options);
        this.init();
        this.recorder = null;
    };

    LoudComment.addModule("recorder", function(options){
        if(!Array.isArray(this.recorders))
            this.recorders = [];
        this.recorders.push(new Recorder(options));
    });

    Recorder.prototype = {

        init: function(){
            this.target = $(this.config.selector).not(this.config.notSelector);
            this.setupUI();
            this.attachEvents();
            LC.l("init done.");
        },

        state: function(dataStateVal){
            if (dataStateVal)
                this.ui.data("state", dataStateVal);
            else
                return this.ui.data("state");
        },

        setupUI: function(){
            this.ui = $("<div />").addClass("lc-recorder-ui").data("state", "stopped");
            this.controls = $("<div />").addClass("lc-recorder-controls");
            this.recordStopBtn = $("<a />").addClass("lc-recorder-icon lc-recorder-record-stop-btn lc-recorder-record-btn");
            this.playPauseBtn = $("<a />").addClass("lc-recorder-icon lc-recorder-play-pause-btn lc-recorder-play-btn lc-recorder-disabled");
            this.submitBtn = $("<a />").addClass("lc-recorder-icon lc-recorder-submit-btn lc-recorder-disabled");
            this.timer = $("<div/>").addClass("lc-recorder-timer");
            this.notice = $("<div/>").addClass("lc-recorder-notice").html(this.config.defaultNoticeHtml || undefined);
            this.controls.append(this.recordStopBtn, this.playPauseBtn, this.submitBtn, this.timer);
            this.ui.append(this.controls).append(this.notice);
            this.ui.append($("<audio />").addClass("lc-recorder-audio-el"));
            this.target.append(this.ui);
            this.state("idle");
        },

        attachEvents: function(){
            this.recordStopBtn.on("click", this.onRecordStop.bind(this));
            this.playPauseBtn.on("click", this.onPlayPause.bind(this));
        },

        onRecordStop: function(e){
            var s = this.state();
            if (s == "recording")
                this.stopRecording();
            if (s == "recorded" || s == "idle")
                this.startRecording()
            LC.l("onRecordStop, event: " + e.type + ", state: " + s);
        },

        onPlayPause: function(e){
            var s = this.state();
            if (s == "recorded")
                this.play();
            if (s == "recorded-playing")
                this.pause();

            LC.l("onPlayPause, event: " + e.type);
        },

        play: function(){
            this.playingUI();
            this.state("recorded-playing");
            LC.l("play");
        },

        pause: function(){
            this.recordedUI({rmNoticeSelector: ".lc-recorder-notice-playing"});
            this.state("recorded");
            LC.l("pause");
        },

        startRecording: function(){
            this._startRecording();
            this.recordingUI();
            this.start = new Date();
            this._UIInterval = setInterval(this.onTimeUpdate.bind(this), 1000);
            this.state("recording");
        },

        onTimeUpdate: function(){
            this.notice.text("Recording: " + ((new Date() - this.start)/1000).toFixed(0) + "sec (max 60sec)");
        },

        stopRecording: function(){
            clearInterval(this._UIInterval);
            this._stopRecording();
            this.notice.text("Recorded: " + " seconds");
            this.ui.data("state", "recorded");
            this.recordedUI();
        },

        recordingUI: function(){
            this.recordStopBtn.removeClass("lc-recorder-record-btn").addClass("lc-recorder-stop-btn");
            this.playPauseBtn.addClass("lc-recorder-disabled");
            this.submitBtn.addClass("lc-recorder-disasbled");
        },

        recordedUI: function(options){
            options = options || {};
            this.recordStopBtn.removeClass("lc-recorder-stop-btn").addClass("lc-recorder-record-btn");
            this.playPauseBtn.removeClass("lc-recorder-disabled lc-recorder-pause-btn").addClass("lc-recorder-play-btn");
            this.submitBtn.removeClass("lc-recorder-disabled");
            this.removeFromNotice(options.rmNoticeSelector);
        },

        playingUI: function(){
            this.recordStopBtn.removeClass("lc-recorder-stop-btn").addClass("lc-recorder-record-btn");
            this.playPauseBtn.removeClass("lc-recorder-disabled lc-recorder-play-btn").addClass("lc-recorder-pause-btn");
            this.submitBtn.removeClass("lc-recorder-disabled");
            this.appendNotice({klasses: "lc-recorder-notice-playing", text: ", playing ..."});
        },

        removeFromNotice: function(selector) {
            if (selector)
                this.notice.find(selector).remove();
        },

        appendNotice: function(options){
            options = options || {};
            var t = $(options.tag ? "<" + options.tag + "/>" : "<span />")
                .addClass(options.klasses || "")
                .text(options.text || undefined)
                .html(options.html || undefined);
            this.notice.append(t);
        },

        idle: function(){
            clearInterval(this._UIInterval);
            this.notice.text("");
            this.state("idle");
        },

        onFail: function(){
            LC.l("Rejected!: " + e.type);
        },

        onSuccess: function(s){
            var context = new webkitAudioContext();
            var mediaStreamSource = context.createMediaStreamSource(s);
            this.recorder = new Recorder(mediaStreamSource);
            this.recorder.record();

            // audio loopback
            // mediaStreamSource.connect(context.destination);
        },

        _startRecording: function(){
            if (navigator.getUserMedia) {
                navigator.getUserMedia({audio: true}, this.onSuccess.bind(this), this.onFail.bind(this));
            } else {
                LC.l("navigator.getUserMedia not present");
            }
        },

        _stopRecording: function(){
            var self = this;
            this.recorder.stop();
            this.recorder.exportWAV(function(s) {
                self.audio.src = window.URL.createObjectURL(s);
            });
        },


        setTagVisibleAttr: function(){},
        submitRecording: function(){},
        cancelRecording: function(){}
    };

})(jQuery, window, undefined);