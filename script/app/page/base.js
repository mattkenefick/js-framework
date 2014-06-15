/**
 * @package Project Name
 * @client  Client
 * @authors Name <email>
 * @date    2014-06-15 00:00:00
 * @version 0.0.1
 */

;(function(namespace) {
    'use strict';

    namespace.Page_Base = Backbone.View.extend({

        initialize: function(options) {
            options || (options = {});

            // super
            Backbone.View.prototype.initialize.call(this, options);

            // views
            this.views = new namespace.View_Views(this);
            this.$v    = _.bind(function(x) {
                return this.views.get(x);
            }, this); // alias;
        },

        attachEvents: function() {
            this.delegateEvents();
        },

        detachEvents: function() {
            this.undelegateEvents();
        },

        reset: function() {
            return this;
        },


        // Animation
        // ---------------------------------------------------------

        animateIn: function() {
            // state
            this.$el.addClass('state-animated-in');

            return this.$el.fadeIn();
        },

        animateOut: function() {
            // state
            this.$el.removeClass('state-animated-in');

            return this.$el.fadeOut();
        },


        // Event Handlers
        // ---------------------------------------------------------

        onAnimatedIn: function() {
            console.log("[Page] Animated in.");
        },

        onAnimatedOut: function() {
            console.log("[Page] Animated out.");
        }

    });

})(window.pm || (window.pm = {}));