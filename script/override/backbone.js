
// Extend Backbone
// -----------------------------------------------------------------

if (window['Hammer']) {
    Backbone.View.prototype.delegateEvents = function(events) {
        if (!(events || (events = _.result(this, 'events')))) return this;
        this.undelegateEvents();

        for (var key in events) {
            var method = events[key];
            if (!_.isFunction(method)) method = this[events[key]];
            if (!method) continue;

            var match = key.match(/^(\S+)\s*(.*)$/);
            var eventName = match[1], selector = match[2];
            method = _.bind(method, this);
            eventName += '.delegateEvents' + this.cid;

            // tap
            if (selector === '') {
                this.$el.hammer().on(eventName, method);
            } else {
                this.$el.hammer().on(eventName, selector, method);
            }
        }
        return this;
    };

    $(document)
        .on('focus', 'input, textarea, select', function(e) {
            $('.fixable').addClass('fixfixed');
        })
        .on('blur', 'input, textarea, select', function(e) {
            _.defer(function() {
                $('.fixable').removeClass('fixfixed');
            });
        });
}

var bbsync = Backbone.sync;

Backbone.sync = function(method, model, options) {
    options || (options = {});

    if (window.pm.Settings.get('token')) {
        options.headers = {
            'Authorization': 'Bearer ' + window.pm.Settings.get('token')
        };
    }

    return bbsync(method, model, options);
};

Backbone.View.prototype.log = function() {
    var args = Array.prototype.slice.call(arguments, 0, arguments.length);

    args.unshift("[" + this.name + "]");

    console.log.apply(console, args);
};

Backbone.View.prototype.info = function() {
    var args = Array.prototype.slice.call(arguments, 0, arguments.length);

    args.unshift("[" + this.name + "]");

    console.info.apply(console, args);
};

Backbone.View.prototype.warn = function() {
    var args = Array.prototype.slice.call(arguments, 0, arguments.length);

    args.unshift("[" + this.name + "]");

    console.warn.apply(console, args);
};

