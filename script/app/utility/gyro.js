/**
 * @package Project Name
 * @client  Client
 * @authors Matt Kenefick <matt@polymermallard.com>
 */

 ;(function(namespace) {
    'use strict';

    var Colors    = namespace.Colors,
        State     = namespace.State
    ;

    window.Utility_Gyro = _.extend({


        // Public Methods
        // -------------------------------------------------------------------

        start: function() {
            color("[App] Starting Gyroscoping Tracking", Colors.DEBUG);

            gyro.startTracking(this.onGyroTracking);
        },

        stop: function() {
            color("[App] Stopping Gyroscoping Tracking", Colors.DEBUG);

            gyro.stopTracking();
        },

        // Event Handlers
        // --------------------------------------------------------------------

        onGyroTracking: function(e) {
            State.gyro = e;
        }

    }, Backbone.Events);

})(window.pm || (window.pm = {}));