(function(global) {

    var Engine = global.TemplateEngine,
        util = global.util;

    // for detailed comments, see https://gist.github.com/akhoury/9118682
    // a helper to execute javascript expressions
    Engine.registerHelper('x', function (expression, options) {
        var fn = function(){}, result;
        try {
            fn = Function.apply(this,['window', 'return ' + expression + ' ;']);
        } catch (e) {
            console.warn('{{x ' + expression + '}} has invalid javascript', e);
        }

        try {
            result = fn.bind(this)(window);
        } catch (e) {
            console.warn('{{x ' + expression + '}} hit a runtime error', e);
        }
        return result;
    });

// a helper to execute an IF statement with any expression
    Engine.registerHelper('xif', function (expression, options) {
        return Engine.helpers['x'].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
    });

/// like x but allows you to access upper level scope
    Engine.registerHelper("z", function () {
        var options = arguments[arguments.length - 1];
        delete arguments[arguments.length - 1];
        return Engine.helpers["x"].apply(this, [Array.prototype.slice.call(arguments, 0).join(''), options]);
    });

    Engine.registerHelper("zif", function () {
        var options = arguments[arguments.length - 1];
        delete arguments[arguments.length - 1];
        return Engine.helpers["x"].apply(this, [Array.prototype.slice.call(arguments, 0).join(''), options]) ? options.fn(this) : options.inverse(this);
    });

// a helper to execute any util function and get its return
    Engine.registerHelper('u', function() {
        var key = '';
        if (arguments.length) {
            key = arguments[0];
            delete arguments[0];
            // delete the options arguments passed by hbs
            delete arguments[arguments.length - 1];
        }
        if (util.hasOwnProperty(key)) {
            return typeof util[key] == 'function' ?
                util[key].apply(util, arguments) :
                util[key];
        } else {
            throw new Error('util.' + key + ' is not a function nor a property');
        }
    });

// a helper to execute any util function and get its return
    Engine.registerHelper('uif', function() {
        var options = arguments[arguments.length - 1];
        return Engine.helpers['u'].apply(this, arguments) ? options.fn(this) : options.inverse(this);
    });

// a helper to execute any global function or get global.property
    Engine.registerHelper('g', function() {
        var path, value;
        if (arguments.length) {
            path = arguments[0];
            delete arguments[0];
            // delete the options arguments passed by hbs
            delete arguments[arguments.length - 1];
        }
        value = util.prop(global, path);
        if (typeof value != 'undefined' && value !== null) {
            return typeof value == 'function' ?
                value.apply({}, arguments) :
                value;
        } else {
            throw new Error('global.' + path + ' is not a function nor a property');
        }
    });
    Engine.registerHelper('gif', function() {
        var options = arguments[arguments.length - 1];
        return Engine.helpers['g'].apply(this, arguments) ? options.fn(this) : options.inverse(this);
    });

    Engine.registerHelper('geach', function(path, options) {
        var value = util.prop(global, arguments[0]);
        if (!Array.isArray(value))
            value = [];

        return Engine.helpers['each'].apply(this, [value, options]);
    });

// pretty simple 2 arguments with one operator from the list below
    Engine.registerHelper('ifCond', function (v1, operator, v2, options) {

        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
                break;
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
                break;
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
                break;
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                break;
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
                break;
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                break;
            case '||': // only two args here :/ temp, stay tuned for ifArgsCond helper
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
                break;
            case '&&': // only two args here :/ temp, stay tuned for ifArgsCond helper
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
                break;
            case '!=': // only two args here :/ temp, stay tuned for ifArgsCond helper
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
                break;
            default:
                return options.inverse(this);
                break;
        }
    });

    Engine.registerHelper('debug', function() {
        console.log('=====CONTEXT-START====');
        console.log(this);
        console.log('=====CONTEXT-END====');

        console.log('=====ARGUMENTS-START====');
        console.log(arguments);
        console.log('=====ARGUMENTS-END====');
    });

})(LoudComment);
