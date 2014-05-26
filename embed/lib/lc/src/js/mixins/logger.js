(function() {
    var LC = LoudComment,
        $ = LC.$,
        util = LC.util;

    LC.asLogger = (function(){
        var levels = {
                error: 6,
                log: 5,
                info: 4,
                warn: 3,
                debug: 2,
                trace: 1
            },

            _console = window.console || {},

            level = function(val) {
                if (val !== undefined) {
                    this.asLogger.config.level = val;
                }
                return this.asLogger.config.level;
            },

            prefix = function(val) {
                if (val !== undefined) {
                    this.asLogger.config = val;
                }

                return this.asLogger.config.prefix;
            },

            can = function(level) {
                return !! (
                    typeof _console[level] === 'function'
                        && (util.isNumber(this.asLogger.config.level)
                        ? this.asLogger.config.level
                        : levels[this.asLogger.config.level]) >= levels[level]
                    );
            },

            print = function(level, args) {
                args = Array.prototype.slice.call(args, 0);

                if (this.asLogger.config.prefix)
                    args.unshift(this.asLogger.config.prefix);

                return _console[level].apply(_console, args);
            },

            error = function () {
                if (can.call(this, 'error')) {
                    print.call(this, 'error', arguments);
                }
            },

            log = function() {
                if (can.call(this, 'log')) {
                    print.call(this, 'log', arguments);
                }
            },

            info = function() {
                if (can.call(this, 'info')) {
                    print.call(this, 'info', arguments);
                }
            },

            warn = function() {
                if (can.call(this, 'warn')) {
                    print.call(this, 'warn', arguments);
                }
            },

            debug = function() {
                if (can.call(this, 'debug')) {
                    print.call(this, 'debug', arguments);
                }
            },

            trace = function() {
                if (can.call(this, 'trace')) {
                    print.call(this, 'trace', arguments);
                }
            };

        return function(context, config) {
            this.asLogger = this.asLogger || {};
            this.asLogger.config = $.extend(true, {}, defaults, config);

            this.error = error;
            this.log = log;
            this.info = info;
            this.warn = warn;
            this.trace = trace;
            this.debug = debug;

            this.loggerLevel = level;
            this.loggerPrefix = prefix;
            this.loggerCan = can;

            return this;
        };
    })();

})();