/**
 * @package Project Name
 * @client  Client
 * @authors Matt Kenefick <matt@polymermallard.com>
 */

 ;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants;

    window.URL = window.Utility_URL = {

        // <Bool> Whether or not we should bust cache on the URL
        bustCache: true,


        // Public Methods
        // -------------------------------------------------------------------

        go: function(url) {
            var url;

            url = BASE_URL.length ? url.replace(BASE_URL + '/', '') : url;

            Backbone.history.navigate( url, { trigger: true } );
        },

        base: function(url) {
            url || (url = '');

            return this.filter(BASE_URL + url);
        },

        api: function(url) {
            url || (url = '');

            return this.filter(Constants.API_URL + url);
        },

        upgrade: function(url) {
            url || (url = '');

            return this.filter(Constants.UPGRADE_URL + url);
        },


        // Filters
        // -------------------------------------------------------------------

        filter: function(url) {
            if (this.bustCache) {
                url = this.filter_bust(url);
            }

            return url;
        },

        filter_bust: function(url) {
            url += "?random=" + Math.random();

            return url;
        }

    };

})(window.pm || (window.pm = {}));