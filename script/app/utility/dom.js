/**
 * @package Project Name
 * @client  Client
 * @authors Matt Kenefick <matt@polymermallard.com>
 */

 ;(function(namespace) {
    'use strict';

    window.Utility_DOM = {


        // Public Methods
        // -------------------------------------------------------------------

        unfocus: function() {
            $('*:focus').blur();

            setTimeout(function() { window.scrollTo(0, 0); }, 1);
            setTimeout(function() { window.scrollTo(0, 0); }, 200);
        }

    };

})(window.pm || (window.pm = {}));
