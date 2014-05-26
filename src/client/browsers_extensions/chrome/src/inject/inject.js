chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // script code starts here
            (function($, undefined){
                console.log("[LC][DEBUG] Script start");

                var R = Math.floor(Math.random() * Math.pow(10,20));
                // check in LC is loaded already
                if(!window._LOUDCOMMENT)
                    window._LOUDCOMMENT = {};

                // default configs
                var defaults = {
                    audible: {
                        site: "loudcomment.com",
                        path: "/c/"
                    },
                    field: {
                        defaultNoticeHtml: "by <a target='_blank' href='http://loudcomment.com'>LoudComment.com</a>",
                        labelOnRecord: "Recording, drag mouse left to cancel"
                    }
                };

                // for later use
                var isiOS = /iphone|ipod|ipad/i.test(navigator.userAgent);
                var isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

                // keep references for all the fields and audible elements
                window._LOUDCOMMENT._fields = window._LOUDCOMMENT._fields || [];
                window._LOUDCOMMENT._audibles = window._LOUDCOMMENT._audibles || [];

                // to do
                var Field = window._LOUDCOMMENT.FieldFactory = function($el, config, index){
                    // Field instance creation
                    this.index = index;
                    this.config = config;
                    this.target = $el;
                    this.type = $el.prop("tagName");
                    this.setupUI();
                    this.attachEvents();
                    this.target.data("lc-loaded-" + R, true);
                };

                // to do
                Field.prototype = {
                    setupUI: function (){
                        this.ui = $("<div />").addClass("lc-ui-" + R).data("state", "stopped").css({width: this.target.width() + "px", height: "16px"});
                        this.controls = $("<div />").addClass("lc-controls-" + R);
                        this.recordStopBtn = $("<div/>").addClass("lc-icon-" + R + " lc-record-stop-btn-" + R + " lc-record-btn-" + R);
                        this.playPauseBtn = $("<div/>").addClass("lc-icon-" + R + " lc-play-pause-btn-" + R + " lc-play-btn-" + R + " lc-disabled-" + R);
                        this.submitBtn = $("<div/>").addClass("lc-icon-" + R + " lc-submit-btn-" + R + " lc-disabled-" + R);
                        this.timer = $("<div/>").addClass("lc-timer-" + R);
                        this.notice = $("<div/>").addClass("lc-notice-" + R).html(this.config.defaultNoticeHtml);
                        this.controls.append(this.recordStopBtn).append(this.playPauseBtn).append(this.submitBtn).append(this.timer);
                        this.ui.append(this.controls).append(this.notice);
                        this.target.after(this.ui);
                    },

                    attachEvents: function(){
                        var self = this;
                        self.recordStopBtn.on("click", function(e){
                            self.onRecordOrStopClick(e);
                        });
                        self.playPauseBtn.on("click", function(e){
                            self.onPlayOrPauseClick(e);
                        });
                    },

                    onRecordOrStopClick: function(){
                        var state = this.ui.data("state");
                        if( state == "stopped" || state.indexOf("recorded") == 0 ) {
                            this.startRecording();
                        } else if ( state == "recording") {
                            this.stopRecording();
                        }
                    },

                    onPlayOrPauseClick: function(){
                        var state = this.ui.data("state");
                        if(this.playPauseBtn.hasClass("lc-play-btn-" + R)) {
                            this.play();
                        } else if (this.playPauseBtn.hasClass("lc-pause-btn-" + R)) {
                            this.pause();
                        }
                    },

                    play: function(){
                        this.playingUI();
                        this.ui.data("state", "recorded-playing");
                    },

                    pause: function(){
                        this.recordedUI();
                        this.ui.data("state", "recorded");
                    },

                    startRecording: function(){
                        var self = this;
                        self.ui.data("state", "recording");
                        self.recordingUI();
                        self.start = new Date();
                        self._UIInterval = setInterval(function(){
                            self.notice.text("Recording: " + (new Date() - self.start)/1000 + "sec (max 60sec)");
                        }, 1000);
                    },
                    stopRecording: function(){
                        clearInterval(this._UIInterval);
                        this.target.val(this.target.val() + " http://loudcomment.com/c/S0m3BulllshitHashOveDere-" + this.index);
                        this.ui.data("state", "recorded");
                        this.recordedUI();
                    },
                    recordingUI: function(){
                        this.recordStopBtn.removeClass("lc-record-btn-" + R).addClass("lc-stop-btn-" + R);
                        this.playPauseBtn.addClass("lc-disabled-" + R);
                        this.submitBtn.addClass("lc-disabled-" + R);
                    },
                    recordedUI: function(){
                        this.recordStopBtn.removeClass("lc-stop-btn-" + R).addClass("lc-record-btn-" + R);
                        this.playPauseBtn.removeClass("lc-disabled-" + R);
                        this.submitBtn.removeClass("lc-disabled-" + R);
                        this.notice.text(this.notice.text().replace("Recording", "Recorded"));
                    },
                    playingUI: function(){
                        this.recordStopBtn.removeClass("lc-stop-btn-" + R).addClass("lc-record-btn-" + R);
                        this.playPauseBtn.removeClass("lc-disabled-" + R).removeClass("lc-play-btn-" + R).addClass("lc-pause-btn-" + R);
                        this.submitBtn.removeClass("lc-disabled-" + R);
                        this.notice.text(this.notice.text().replace("Recording", "Recorded"));
                        this.notice.text(this.notice.text().replace("Recorded", "Playing"));
                    },
                    idleUI: function(){},
                    setTagVisibleAttr: function(){},
                    submitRecording: function(){},
                    cancelRecording: function(){}

                };

                // demo, needs cleanup
                var Audible = window._LOUDCOMMENT.AudibleFactory = function($el, config, index){

                    this.index = index;
                    this.config = config;
                    this.target = $el;
                    this.href = $el.attr("href");

                    // get the hash id from the url
                    var siteIndex = this.href.indexOf(this.config.site + this.config.path);
                    var qIndex = this.href.indexOf("?");
                    this.hash = this.href.substring(siteIndex + (this.config.site + this.config.path).length, ( qIndex > -1 ? qIndex : this.href.length));

                    // audio element
                    this.mp3src = "http://" + this.config.site + this.config.path + this.hash + ".mp3";
                    this.audioEl = $("<audio />").attr("controls", "controls");
                    this.audioEl.append($("<source />").attr("src", this.mp3src));
                    this.target.replaceWith($("<p/>").append(this.audioEl).html());
                };

                // todo
                Audible.prototype = {

                };

                // initial setup for fields
                var initialSetup = window._LOUDCOMMENT.initialSetup = function (config){

                    config = $.extend({}, defaults, config);

                    // find all the fields, make them recordable
                    $("input[type='text'], textarea").each(function(i, el){
                        _LOUDCOMMENT._fields[i] = new Field($(el), config.field, i);
                    });

                    // find all the exsisting comments, make them look like, playas
                    $( "a:contains(" + config.audible.site + config.audible.path +  ")").each(function(i, el){
                        _LOUDCOMMENT._audibles[i] = new Audible($(el), config.audible, i);
                    });
                };

                // temp CSS here for demo purposes, will be moved a diff file
                var css = ""
                        + ".lc-ui-" + R + " {"
                        + " position: relative !important;"
                        + " margin: 3px !important;"
                        + " display: block !important;"
                        + "}"
                        + ".lc-controls-" + R + " {"
                        + " position: relative;"
                        + " float: left;"
                        + " min-width: 51px;"
                        + " max-width: 80px;"
                        + " height: 16px;"
                        + " display: inline;"
                        + " z-index: 2147483647 !important;"
                        + "}"
                        + "div.lc-notice-" + R + " {"
                        + " font-size: 8px !important;"
                        + " display: inline !important;"
                        + " line-height: 20px !important;"
                        + " margin: 0 0 0 10px !important;"
                        + " float: left !important;"
                        + "}"
                        + "div.lc-notice-" + R + " a {"
                        + " text-decoration: none !important;"
                        + " color: black !important;"
                        + "}"
                        + "div.lc-icon-" + R + " {"
                        + " display: inline-block !important;"
                        + " opacity: 0.8 !important;"
                        + " position: relative !important;"
                        + " cursor: hand !important;"
                        + " cursor: pointer !important;"
                        + " width: 16px !important;"
                        + " height: 16px !important;"
                        + " background-image: url('data:image/png;base64,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KkaapgmPjolXvw0NDaGjowN79uzB5z73OQwODmJmZgapVAqzs7MVb5SbV8QwDA9DZovFIizL8hRlZVleats2otEompqaKkeAgiCgtrYWqVTKm4txVVWFbdt48MEHcd9991WY7/HHHwfP8/AazRs2bKjUhzRNm6VSCeFwGJ///OcffO65566an5+/uqmpab9pmv7XX3/9Z9XV1T/r6Oh4eOPGjY9KkuQQQhiapilBEAzDMBYUmJ2dRWNjI55//nk0NDRUXFxdXY2dO3decv0PHToE27bNWCyG3t5etLa2ZrZv3/7JdDqdKBaLE+U2zG2pVOrpd9999wfnz5//ViKR+KllWTfOzs5e39vb+53rr7/+MQCgJElyLctyu7u7r2gX7N27F7t27UJtba1WV1eHYrGIM2fOgGEYKxQKTXj9gmAwuLetra2xvb39NlVV82fPnv2+YRjXG4aBwcHBH8/Nze0AACYWi7mEEOfxxx/H73//ezzyyCPo6OjA2NgYnnrqKUiSVClYJicncezYMdA0jZqamuyqVauQyWRAURRUVa0ElrdMrutCFMXXmpubDyaTyVHTNKMe4PX19dUBAJNIJBRN0xSe53HixAnccssteOyxx1BXV4c9e/aA4ziwLOudgkCSJOTzeQSDwbmuri5ks1lomlapKy9uUAaDQUSj0WKpVPrPsbGxfysfZgy1tbU9DwDklVdewZEjRzYfOHBg89atW0k+n68eHR0V6uvrOcuyaF3XKYqi3PIxixWNRpVCoaDNzMz8dyKReK+Miqiursby5csxNTUFXdehqiosy0I+nwdFUWBZFpIk3WaaZuvq1at/kclk0t/+9rfBxONx8Dx/0DCMYytWrKgyDCMqCIKYz+fZ6upq2jAMqtwfcFiWtZYtW1YsFApz/f39s+l0GjRNe+fH+MQnPoELT0gJISifSaG+vh7hcPg10zRJJBJxZmZmAAD/NwBrSqKkUWE4/QAAAABJRU5ErkJggg==') !important;"
                        + "}"
                        + ".lc-icon-" + R + ".lc-submit-btn-" + R + " {"
                        + " background-position: 0 32px !important;"
                        + "}"
                        + ".lc-icon-" + R + ".lc-disabled-" + R + " {"
                        + " opacity: 0.3 !important;"
                        + " cursor: auto !important;"
                        + "}"
                        + ".lc-icon-" + R + ".lc-play-pause-btn-" + R + ".lc-play-btn-" + R + " {"
                        + " background-position: 0 0 !important;"
                        + "}"
                        + ".lc-icon-" + R + ".lc-play-pause-btn-" + R + ".lc-pause-btn-" + R + " {"
                        + " background-position: 16px 0 !important;"
                        + "}"
                        + ".lc-icon-" + R + ".lc-record-stop-btn-" + R + ".lc-stop-btn-" + R + " {"
                        + " background-position: 0 48px !important;"
                        + "}"
                        + ".lc-icon-" + R + ".lc-record-stop-btn-" + R + ".lc-record-btn-" + R + " {"
                        + " background-position: 16px 48px !important;"
                        + "}"
                        + ".lc-icon-" + R + ".lc-record-stop-btn-" + R + ".lc-record-btn-" + R + ".lc-record-btn-recording-" + R + " {"
                        + " background-position: 16px 32px !important;"
                        + "}"
                        + ".lc-icon-" + R + ".lc-record-stop-btn-" + R + " {"
                        + " left: 0;"
                        + " top: 0;"
                        + "}"
                        + ".lc-icon-" + R + ".lc-play-pause-btn-" + R + " {"
                        + " left: 5px;"
                        + " top: 0;"
                        + "}"
                        + ".lc-icon-" + R + ".lc-submit-btn-" + R + " {"
                        + " left: 5px;"
                        + " top: 0;"
                        + "}"
                        + ".lc-icon-" + R + ":hover:not(.lc-disabled-" + R + ") {"
                        + " opacity: 1 !important;"
                        + "}"
                        + ".lc-spinner-" + R + " {"
                        + " width: 16px;"
                        + " height: 16px;"
                        + " background-image: url('');"
                        + "}"
                    ;
                (function(d,c){
                    var s=d.createElement('style');
                    s.type='text/css';
                    if (s.styleSheet)
                        s.styleSheet.cssText = c;
                    else
                        s.appendChild(d.createTextNode(css));
                    d.getElementsByTagName('head')[0].appendChild(s);
                })(document,css);

                window._LOUDCOMMENT.initialSetup({audible: {site: "robtowns.com", path: "/music/"}});

            })(jQuery);
        }
    }, 10);
});