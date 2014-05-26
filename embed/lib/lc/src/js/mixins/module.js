(function() {

    var LC = LoudComment,
        $ = LC.$;

    LC.asModule = (function() {
        var init = function() {
                LC.asDispatcher.call(this, this.asModule.config.asDispatcher.config);
                LC.asLogger.call(this, this.asModule.config.asLogger.config);
                LC.asBinder.call(this, this.asModule.config.asBinder.config);
                LC.asTemplater.call(this, this.asModule.config.asTemplater.config);

                this.ensureTemplate();
                this.render();
                this.attachEvents();
            },

            destroy = function(){
                this.unattachEvents();
                this.empty().remove();
            },

            defaults = {
                codename: 'module',
                asDispatcher: {
                    config: {}
                },
                asLogger: {
                    config: {
                        prefix: 'lc:module:',
                        level: 'error'
                    }
                },
                asBinder: {
                    config: {}
                },
                asTemplater: {
                    config: {
                        template: function() { return ''; }
                    }
                }
            };

        return function(context, config) {
            this.asModule = this.asModule || {};
            this.asModule.config = $.extend(true, {}, defaults, config);

            if (config.codename) {
                this.asModule.config.asLogger.config.prefix = 'lc:' + config.codename + ':';
            }

            if (config.template) {
                this.asModule.config.asTemplater.config.template = config.template;
            }

            this.destroy = destroy;
            this.init = init;

            return this;
        };
    })();
})();