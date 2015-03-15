/**
 * @package Project Name
 * @client  Client
 * @authors Matt Kenefick <matt@polymermallard.com>
 */

 ;(function(namespace) {
    'use strict';

    window.Utility_Math = {


        // Public Methods
        // -------------------------------------------------------------------

        distanceBetweenPoints: function( lat1, lng1, lat2, lng2 ) {
            var xs = 0;
            var ys = 0;

            lat1 = parseFloat(lat1);
            lng1 = parseFloat(lng1);
            lat2 = parseFloat(lat2);
            lng2 = parseFloat(lng2);

            xs = lat2 - lat1;
            xs = xs * xs;

            ys = lng2 - lng1;
            ys = ys * ys;

            return Math.sqrt( xs + ys );
        },

        ord: function(number) {
            return number + ( [,'st','nd','rd'][/1?.$/.exec(number)] || 'th' );
        }

    };

})(window.pm || (window.pm = {}));