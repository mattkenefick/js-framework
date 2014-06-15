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

    namespace.AbstractView_ListItem = namespace.View_Base.extend({

        tagName: 'li',

        render: function(params) {
            var html = '';

            params || (params = {});

            namespace.View_Base.prototype.render.call(this);

            // model mapping
            // maps a strings to model variables
            // { "name": "first_name" } evaluates to {{ name }} / this.model.get('first_name')
            if (this.model_map) {
                // model
                _.each(this.model_map, function(value, key) {
                    params[key] = this.model.get(value) || "";
                }, this);
            }

            if (this.custom_map) {
                _.each(this.custom_map, function(value, key) {
                    params[key] = this.custom_map[key] || params[key];
                }, this);
            }

            // templating
            if (this.template_html) {
                html = twig({
                    data: this.template_html
                });
            }

            // show
            this.$el.html( html.render(params) );

            return this;
        }

    });

})(window.pm || (window.pm = {}));