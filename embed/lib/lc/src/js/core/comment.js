(function() {

    (function() {
        var LC = LoudComment,
            util = LC.util,
            $ = LC.$,

            defaults = {
                codename: 'comment',
                templates: ['comment/index', 'module/_header', 'module/_footer']
            };

        var Comment = function(target, config) {

            if (typeof target === 'string') {
                target = $(target).eq(0);
            }

            this.$el = target;
            this.config = $.extend(true, {}, defaults, config);

            LC.asModule.call(this, this, this.config);
            this.init();
        };

        Comment.prototype = {
            post: function() {

            },

            get: function() {

            },

            replyTo: function() {

            },

            voteUp: function() {

            },

            voteDown: function() {

            },

            vote: function(inc) {
                inc = inc === 1 || inc === -1 ? inc : 0;
            },

            favorite: function() {

            },

            unfavorite: function() {

            }
        };

        LoudComment.Player = Player;
    })();

})(this);