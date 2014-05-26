(function(global) {
    var Comment = function(target, config) {
        this.recorder = new global.LoudComment.Recorder(target, config);
    };

    Comment.$ = global.jQuery || global.Zepto || global.$;

    global.LoudComment = Comment;
})(this);