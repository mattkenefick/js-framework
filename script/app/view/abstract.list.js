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

    namespace.AbstractView_List = namespace.View_Base.extend({

        name: "AbstractView List",

        infinite_scroll_target: '.infinite-scroll',
        waypoint: null,

        initialize: function(options) {
            options || (options = {});

            // bindings
            _.bindAll(this, 'onFetchSuccess', 'onReachInfiniteScroll');

            // super
            namespace.View_Base.prototype.initialize.call(this, options);
        },

        attachEvents: function() {
            namespace.View_Base.prototype.attachEvents.call(this);

            this.getWaypoint().waypoint(this.onReachInfiniteScroll, {
                    offset: 'bottom-in-view'
                });

            this.collection.on(Events.FETCH_SUCCESS, this.onFetchSuccess);
        },

        detachEvents: function() {
            namespace.View_Base.prototype.detachEvents.call(this);

            this.getWaypoint().waypoint('destroy');

            this.collection.off(Events.FETCH_SUCCESS, this.onFetchSuccess);
        },

        render: function() {
            namespace.View_Base.prototype.render.call(this);

            // render all
            this.views.each(function(view) {
                view.render()
                    .$el
                    .appendTo(this.$el);
            }, this);
        },

        createListItems: function() {
            var view, list_item_view;

            list_item_view = this.uses || 'AbstractView_ListItem';

            this.collection.each(function(model) {
                view               = new namespace[list_item_view]({ model: model });
                view.custom_map    = _.extend(view.custom_map || {}, this.custom_map);
                view.model_map     = _.extend(view.model_map || {}, this.model_map)
                view.template_html = view.template_html || this.template_html;

                this.views.add(view);
            }, this);
        },

        setItemTemplate: function(html, model_map, custom_map) {
            this.custom_map    = custom_map || {};
            this.model_map     = model_map || {};
            this.template_html = html || '';

            this.views.each(function(view) {
                view.custom_map    = custom_map;
                view.model_map     = model_map;
                view.template_html = html;
            }, this);

            return this;
        },


        // Getters / Setters
        // --------------------------------------------------------------

        getWaypoint: function() {
            return this.$el.siblings(this.infinite_scroll_target);
        },


        // Event Handlers
        // --------------------------------------------------------------

        onFetchSuccess: function(collection) {
            // new items
            this.createListItems();

            // show them
            this.render();

            // re-enable waypoints
            this.getWaypoint().waypoint('enable');
        },

        onReachInfiniteScroll: function(direction) {
            if (direction == 'down') {
                // log
                this.log("Fetching more results");

                // temporarily disable waypoint
                this.getWaypoint().waypoint('disable');

                // fetch new content
                this.collection.next();
            }
        }

    });

})(window.pm || (window.pm = {}));