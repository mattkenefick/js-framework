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
        Events    = namespace.Events,
        State     = namespace.State,
        Pages     = namespace.Pages
    ;

    namespace.App = Backbone.View.extend({

        events: {
            'mousemove': 'onMouseMove'
        },

        pages: null,

        initialize: function(options) {
            options || (options = {});

            // super
            Backbone.View.prototype.initialize.call(this, options);

            // pages
            this.pages = {};

            // this.pages[Pages.INTRODUCTION] = new namespace.Page_Introduction({
            //     el: this.$el.find('#' + Pages.INTRODUCTION)
            // });
        },

        attachEvents: function() {

        },

        detachEvents: function() {

        },

        render: function() {
            // set body ready
            this.$el.addClass('ready');

            return this;
        },


        // Event Handlers
        // -------------------------------------------------------------

        onMouseMove: function(e) {
            State.mouseX = e.pageX;
            State.mouseY = e.pageY;
        }

    });

})(window.pm || (window.pm = {}));