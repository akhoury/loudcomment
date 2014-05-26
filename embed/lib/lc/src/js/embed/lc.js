(function(global) {
    var look4 = 'embed/loudcomment.js',
        look4re = new RegExp(look4),
        scripts = document.getElementsByTagName('script'),
        script = scripts[scripts.length - 1],
        src = script.src,
        config = {};

    if (!look4re.test(src)) {
        script = document.querySelector('script[src$="' + look4 + '"]');
        src = script.getAttribute('src');
    }

    if (!script) throw new Error('loudcomment.js can\'t find self injecting script tag');

    var config = (function() {
            try {
                return JSON.parse((script.getAttribute('data-lc-config') || '{}').replace(/'/g, '"'));
            } catch (e) {
                return {};
            }
        })();

    if (config.selector) {

    }
})(this);