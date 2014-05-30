(function(global) {

    var Widget = global.Widget,
        util = global.util,
        $ = global.$,
        defaults = {
            widgetName: 'player',
            templates: ['player/index'],
            meta: {
                title: '',
                description: '',
                lander: '',
                src: ''
            }
        };

    var Player = function(target, config) {
        Widget.call(this, target, $.extend(true, {}, defaults, config));

        this.on('data', this.setup.bind(this));
        this.init();
    };

    Player.prototype = Object.create(Widget.prototype);

    Player.prototype.setup = function() {
        var a = this.$target.find('a:contains');
        // ....
    };

    Player.prototype.play = function() {
        this.dispatch('playing');
    };

    Player.prototype.pause = function() {
        this.dispatch('paused');
    };

    Player.prototype.stop = function() {
        this.dispatch('stopped');
    };

    Player.prototype.volume = function(val) {
        if (val !== undefined && this.media.volume !== val) {
            this.media.volume = val;
            this.dispatch('volumeChange', val);
        }
        return this.media.volume;
    };

    global.Player = Player;

})(LoudComment);