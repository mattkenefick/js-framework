/**
 * @package Project Name
 * @client  Client
 * @authors Name <email>
 * @date    2014-06-15 00:00:00
 * @version 0.0.1
 */

;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants,
        Events    = namespace.Events;

    namespace.View_Base = Backbone.View.extend({

        _animate_state: Events.ANIMATION_END,

        views: null,

        // boolean for whether or not the render has happened
        rendered: false,


        initialize: function(options) {
            options || (options = {});

            // bind
            _.bindAll(this, '_onAnimateIn', '_onAnimateOut');

            // merge options
            _.extend(this, options);

            // views
            this.views = new namespace.View_Views(this);
            this.v     = _.bind(function(x) {
                return this.views.get(x);
            }, this); // alias;

            // parent
            this.parent = options.parent || window;

            // template
            if (this.templateName) {
                this.template = $('#' + this.templateName).html();
                this.twig     = twig({ data: this.template });
            }

            if (this.template && (this.isPage || this.autoRender)) {
                this.$el.html( this.twig.render() );
            }
        },

        attachEvents: function() {
            this.detachEvents();
            this.delegateEvents(this.events);
            this.views.execAll('attachEvents');
        },

        detachEvents: function() {
            this.views.execAll('detachEvents');

            this.undelegateEvents();
        },

        reattachEvents: function() {
            this.detachEvents();
            this.attachEvents();
        },

        animateIn: function(options) {
            options || (options = {});

            options.duration = !isNaN(options.duration) ? options.duration : Constants.ANIMATION_DURATION;

            if (this.isHidden()) {
                this.animateOut({ duration: 0 });
            }

            this._onAnimateStart();

            this.$el
                .stop()
                .delay(options.delay || 0)
                .fadeIn(options.duration, _.bind(this._onAnimateIn, this));

            return this;
        },

        animateOut: function(options) {
            options || (options = {});

            options.duration = !isNaN(options.duration) ? options.duration : Constants.ANIMATION_DURATION;

            this._onAnimateStart();

            this.$el
                .stop()
                .delay(options.delay || 0)
                .fadeOut(options.duration, _.bind(this._onAnimateOut, this));

            return this;
        },

        animateToggle: function(options) {
            if (this._animate_state === Constants.ANIMATE_IN) {
                this.animateOut(options);
            }
            else if (this._animate_state === Constants.ANIMATE_OUT) {
                this.animateIn(options);
            }

            return this;
        },

        hide: function() {
            this.$el
                .css('display', '')
                .addClass('hide');

            return this;
        },

        show: function() {
            this.$el
                .css('display', '')
                .removeClass('hide');

            return this;
        },

        fadeIn: function() {
            this.$el
                .removeClass('hide')
                .hide()
                .fadeIn();

            return this;
        },

        fadeOut: function() {
            this.$el.fadeOut();

            return this;
        },

        template: function(params) {
            return namespace.func.template(this.templateName, params || {});
        },

        decode: function(object, attr_key, val_key) {
            attr_key = attr_key || 'name';
            val_key  = val_key || 'val';

            _.each(object, function(value, key) {
                this.$el.find("[" + attr_key + "=" + key + "]")[val_key](value);
            }, this);
        },

        encode: function(attr_key, val_key) {
            var hash = {};

            attr_key = attr_key || 'name';
            val_key  = val_key || 'val';

            this.$el.find('*[' + attr_key + ']').each(function(e) {
                hash[$(this).prop(attr_key)] = $(this)[val_key]();
            });

            return hash;
        },

        lock: function() {
            this.locked = true;
        },

        unlock: function() {
            this.locked = false;
        },

        isLocked: function() {
            return this.locked === true;
        },

        setState: function(type) {
            this.$el.addClass('state-' + type);
        },

        unsetState: function(type) {
            this.$el.removeClass('state-' + type);
        },

        unsetAllStates: function(type) {
            this.$el[0].className = this.$el[0].className.replace(/\bstate\-.*?\b/g, '');
        },

        reset: function() {
            // remove custom style
            this.$el.attr('style', null);

            // remove state classes
            this.unsetAllStates();

            return this;
        },

        render: function() {
            Backbone.View.prototype.render.call(this);

            return this;
        },


        // Getters
        // --------------------------------------------------------------

        hasRendered: function() {
            return !!this.rendered;
        },

        isBottomVisible: function() {
            var position = this.$el.position();

            if (position && position.top) {
                return this.$el.outerHeight() + this.$el.position().top < window.innerHeight + $(window).scrollTop();
            }
            else {
                console.log(this.$el, " cannot get position");
            }
        },

        isHidden: function() {
            return !!this.$el.hasClass('hide');
        },

        isLocked: function() {
            return this.locked === true;
        },


        // Internal
        // ---------------------------------------------------------------

        _setAnimateStart: function() {
            this._animate_state = Constants.ANIMATE_TRANSITION;
        },

        _setAnimateIn: function() {
            this._animate_state = Constants.ANIMATE_IN;
        },

        _setAnimateOut: function() {
            this._animate_state = Constants.ANIMATE_OUT;
        },


        // Event Handlers
        // ----------------------------------------------------------------

        _onAnimateStart: function() {
            this._setAnimateStart();

            this.trigger(Events.ANIMATING);

            // unhide this block
            this.show();
        },

        _onAnimateIn: function() {
            this._setAnimateIn();

            // state
            this.$el.addClass('state-animated-in');

            this.trigger(Events.ANIMATE_IN);
        },

        _onAnimateOut: function() {
            this._setAnimateOut();

            // state
            this.$el.removeClass('state-animated-in');

            this.trigger(Events.ANIMATE_OUT);
        }

    });

})(window.pm || (window.pm = {}));