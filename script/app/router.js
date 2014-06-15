/**
 * @package Project Name
 * @client  Client
 * @authors Name <email>
 * @date    2014-06-15 00:00:00
 * @version 0.0.1
 */

;(function(namespace) {
    'use strict';

    var Pages     = namespace.Pages,
        Constants = namespace.Constants,
        State     = namespace.State,
        Events    = namespace.Events,
        URLs      = namespace.URLs
    ;

    var router = namespace.Router = new Router;

    // routes
    router.on('/' + URLs.INTRODUCTION, function() {
        transition(Pages.INTRODUCTION);
    });


    function transition(page_to_animate_in) {
        var page;

        //
        page = namespace.app.pages[page_to_animate_in];

        // start
        namespace.trigger(Events.NAV, {
            page_name: page_to_animate_in,
            page     : page
        });

        // current page
        if (page === State.page) {
            console.log("We're already on this page.", page_to_animate_in);

            return false;
        }

        // log
        console.log("Transitioning in: ", page_to_animate_in);

        // render
        page.reset();
        page.render();
        page.attachEvents();
        setTimeout(function() {
            page.animateIn();
            page.onAnimatedIn(); // mk, todo: replace this with events
        }, 2);
        page.$el.addClass('page-active');

        // animate out
        if (State.page) {
            State.page.$el.removeClass('page-active');
            State.page.detachEvents();
            State.page.animateOut();
            State.page.onAnimatedOut(); // mk, todo: replace this with events
        }

        // change page
        State.page = page;
    }

    // reloader
    router.reload = function() {
        State.page.detachEvents();
        State.page.reset();
        State.page.render();
        State.page.attachEvents();

        setTimeout(function() {
            State.page.animateIn();
            State.page.onAnimatedIn(); // mk, todo: replace this with events
        }, 2);
    };


    // setup
    router.configure({
        notfound: function() {
            console.log("Not found. Redirecting.");

            // home (default route)
            // router.setRoute("introduction");
        }
    });

})(window.pm || (window.pm = {}));