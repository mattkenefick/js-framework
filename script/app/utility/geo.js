/**
 * @package Project Name
 * @client  Client
 * @authors Matt Kenefick <matt@polymermallard.com>
 */

 ;(function(namespace) {
    'use strict';

    var Colors    = namespace.Colors,
        Events    = namespace.Events,
        Settings  = namespace.Settings,
        State     = namespace.State
    ;

    window.Utility_Geo = _.extend({

        // <> geolocation tracker
        id: null,

        // <Object> Options of the geo tracker
        options: {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 7000
        },


        // Public Methods
        // -------------------------------------------------------------------

        start: function() {
            color("[App] Starting Geolocation Tracking", Colors.DEBUG);

            // refresh if we are already tracking
            if (this.id) {
                this.stopGeoTracking();
            }

            return this.id = navigator.geolocation.watchPosition(
                this.onGeoSuccess,
                this.onGeoError,
                this.options
            );
        },

        stop: function() {
            color("[App] Stopping Geolocation Tracking", Colors.DEBUG);

            if (this.id) {
                navigator.geolocation.clearWatch(this.id);
                this.id = null;
            }
        },


        // Event Handlers
        // --------------------------------------------------------------------

        onGeoError: function() {
            console.warn("[App] Geo couldn't be received.", arguments, Colors.DEBUG);
        },

        onGeoSuccess: function(position) {
            // save user's position
            State.geo.user.latitude = position.coords.latitude;
            State.geo.user.longitude = position.coords.longitude;

            // save to cache
            Settings.set('geo', State.geo);

            // log
            color("[App] Geo Received ( " + State.geo.user.latitude + ", " + State.geo.user.longitude + " )", Colors.DEBUG);

            // trigger
            namespace.trigger(Events.GEO, State.geo.user.latitude, State.geo.user.longitude);
        }

    }, Backbone.Events);

})(window.pm || (window.pm = {}));