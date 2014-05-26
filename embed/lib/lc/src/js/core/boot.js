(function(global) {
    var LoudComment = function(target, config) {
        this.recorder = new global.LoudComment.Recorder(target, config);
    };

    LoudComment.$ = global.jQuery || global.Zepto || global.$;
    LoudComment.TemplateEngine = global.Handlebars;
    LoudComment.envGlobal = global;

    global.LoudComment = LoudComment;

})(this);