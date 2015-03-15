/**
 * @package Project Name
 * @client  Client
 * @authors Matt Kenefick (matt@polymermallard.com)
 */

;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants,
        Colors    = namespace.Colors,
        Events    = namespace.Events,
        Flags     = namespace.Flags,
        State     = namespace.State
    ;

    namespace.Router = Backbone.Router.extend({

        hash: null,

        // used for stats and video ads
        pagesLoaded: 0,
        videosLoaded: 0,

        // previous fragment in the url
        previousFragment: null,


        initialize: function(options) {
            options || (options = {});

            // bindings
            _.bindAll(this, 'onPopState');

            // super
            Backbone.Router.prototype.initialize.call(this, options);

            // vars
            this.hash = {};


            // Route | Home
            this.route( "*path", this.route_home );

            // Route | About
            this.route( "about", this.route_general );

            // Route | Channels
            this.route( /channels\/?/, this.route_simple );
            this.route( "channels/:type", this.route_simple );

            // Route | Films
            this.route( /films\/?/, this.route_general );
            this.route( "films/:type", this.route_films );

            // Route | Film
            this.route( /([0-9]{4})\/([0-9]{2})\/([0-9]{2})\/([a-zA-Z0-9_-]+)/, this.route_film );

            // Route | Search
            this.route( /search\/\?q=([a-zA-Z0-9_-]+)/, this.route_general );

            // Route | Submit
            this.route( "submit", this.route_general );

            // event
            window.onpopstate = this.onPopState;
        },


        // Getters / Setters
        // -----------------------------------------------------

        isFirstLoad: function() {
            return this.pagesLoaded === 1;
        },


        // Routes
        // -----------------------------------------------------

        route_simple: function() {
            this.transition(window.location, 'general');
        },

        route_general: function() {
            // destroy queue
            namespace.VideoAPI_Queue.clear();

            this.transition(window.location, 'general');
        },

        route_home: function() {
            // destroy queue
            namespace.VideoAPI_Queue.unsetCategory();

            return this.route_general();
        },

        route_film: function(year, month, day, slug) {
            var threshold = config.BC || Constants.VIDEO_AD_THRESHOLD;

            // video loaded
            this.videosLoaded ++;

            // intercept ads
            if (this.videosLoaded % threshold === 0 && !Flags.isMobile) {
                // log
                console.color("[Router] Setting a bumper.", Colors.IMPORTANT);

                // state
                State.set('useBumper', true);

                // events
                namespace.trigger(Events.BUMPER, this.videosLoaded);
            }
            else {
                State.set('useBumper', false);
            }

            // go
            this.transition(window.location, 'film');
        },

        route_films: function(type) {
            // destroy queue
            namespace.VideoAPI_Queue.clear();

            // set category
            namespace.VideoAPI_Queue.setCategory(type);

            // go
            return this.route_general();
        },


        // Transition
        // ------------------------------------------------------

        transition: function(url, type) {
            var data;

            // increase pages loaded
            this.pagesLoaded ++;

            // save
            this.previousFragment = Backbone.history.fragment;

            // this means it was the first load, so don't do a transition
            if (this.pagesLoaded < 2) {
                this.renderCurrent();

                return false;
            }

            // events
            namespace.trigger(Events.LOADING);
            namespace.trigger(Events.NAV, {
                type     : Constants.START,
                page     : page
            });

            // set old page
            State.old_page = window.page;

            // exit old page
            if (State.old_page) {
                State.old_page.$el.removeClass('page-active');
                State.old_page.detachEvents();
                State.old_page.reset();

                delete State.old_page;
            }

            // fetch url
            this.fetchContent(url);
        },

        fetchContent: function(url) {
            var self = this, xhr;

            // set html loading
            $('html').addClass('loading-page');

            // log
            // console.color("[Router] Loading page `" + url + "`", Colors.LOADING);

            // fetch
            xhr = $.ajax({
                type: "GET",
                url : url,
                xhr : function() {
                    var xhr = new window.XMLHttpRequest();

                   xhr.addEventListener("progress", function(evt) {
                        var percentComplete;

                        if (evt.lengthComputable) {
                            percentComplete = evt.loaded / evt.total;
                        }
                        else {
                            percentComplete = evt.loaded;
                        }
                   }, false);

                   return xhr;
                },
                success: function(data) {
                    var newHTML, newHead, newBody;

                    // log
                    console.color("[Router] Page loaded, continuing to build it.", Colors.LOADING);

                    data = data.replace("<html", "<ajax-html");
                    data = data.replace("<head", "<ajax-head");
                    data = data.replace("<body", "<ajax-body");

                    // container
                    newHTML = $('<div></div>', { html: data.toString() });
                    newHead = newHTML.find('ajax-head');
                    newBody = newHTML.find('ajax-body');

                    // after page
                    setTimeout(function() {
                        // totop
                        window.scrollTo(0, 0);

                        // class
                        $('html').addClass("not-first-page");

                        // replace body
                        namespace
                            .$body
                            .find('.replaceable-content')
                            .html( newBody.find('.replaceable-content').html() );

                        // replace classes
                        namespace
                            .$body
                            .attr('class', newBody.attr('class'));

                        // replace head
                        $('head').find('meta, title').remove();
                        newHead
                            .find('meta, title')
                            .appendTo( $('head') );

                        // remove old scripts
                        $('#initScripts').remove();

                        // add new scripts
                        newHTML.find('#initScripts').appendTo( $('body') );

                        // log
                        console.color("[Router] Page built, continuing to render it.", Colors.LOADING);

                        // show new
                        self.renderCurrent();

                    }, 1);
                }
            });
        },

        renderCurrent: function() {
            // enter new page
            if (window.page) {
                window.page.reset();
                window.page.attachEvents();
                window.page.render();

                if (!State.disableTransition) {
                    setTimeout(function() {
                        window.page.animateIn();
                        window.page.onAnimatedIn(); // mk, todo: replace this with events
                    }, 2);
                }
                else {
                    console.color("[Router] Disabled transition.", Colors.LOADING);
                    window.page.onAnimatedIn();
                }

                window.page.$el.addClass('page-active');
            }

            // change page
            State.page = window.page;

            // unset
            State.disableTransition = false;

            setTimeout(function() {
                // track
                if (window['_paq']) {
                    _paq.push(['trackPageView', document.title]);
                }
            }, 25);

            // set html loading
            $('html').removeClass('loading-page');
        },


        // Event Handlers
        // ------------------------------------------------------------------

        onPopState: function() {
            function noScrollOnce(event) {
                event.preventDefault();

                document.removeEventListener('scroll', noScrollOnce);

                _.defer(function() {
                    window.scrollTo(0, 0);
                });
            }

            document.addEventListener('scroll', noScrollOnce);
        }

    });

})(window.pm || (window.pm = {}));