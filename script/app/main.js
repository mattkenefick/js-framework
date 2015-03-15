/**
 * @package Project Name
 * @client  Client
 * @authors Name <email>
 * @date    2014-06-15 00:00:00
 * @version 0.0.1
 */

;(function(namespace) {
    'use strict';

    // console access (for dummies)
    window.namespace = namespace;

    var UA               = navigator.userAgent,
        isIFrame         = (function() { try { return window !== window.top; } catch(e) { return true; } })(),
        isFile           = location.protocol == 'file:',
        isLocal          = /(localhost|\.(local|dev))$/.test(location.hostname) || isFile,
        isIOS            = /ip(hone|od|ad)/i.test(UA),
        isAndroid        = /android/i.test(UA),
        isAndroidBrowser = /android (?!.*(chrome|kindle))/i.test(UA),
        isChrome         = /chrome/i.test(UA) && !isAndroidBrowser,
        isWindows        = /windows/i.test(UA),
        isIE             = /(msie[0-9.; ]+windows)|windows nt [a-z0-9.; \/]+rv:\d/i.test(UA),
        isIE9            = /msie 9/i.test(UA),
        isFirefox        = /firefox/i.test(UA),
        isSafari         = /safari/i.test(UA) && !/chrome/i.test(UA),
        isSafari5        = /version\/5\..+ safari/i.test(UA),
        isSafariMac      = isSafari && !isWindows && !isIOS,
        isSafariWin      = isWindows && isSafari,
        isDebug          = window['DEBUG_MODE'],

        Colors = namespace.Colors = {
            CRITICAL : { background: "#f00",    color: "#fff" },
            IMPORTANT: { background: "#dcf9dd", color: "#4e8e4e" },
            DEBUG    : { background: "#0E5342", color: "#93d9c7" },
            LOADING  : { background: "#2099cd", color: "#fff" },
            SOUND    : { background: "#003300", color: "#66FF66" },
            TRACKING : { background: "#c3f1c2", color: "#357733" },
            VIEW     : { background: "#fce6bc", color: "#b5862b" },
            WARN     : { background: "#f8ea6c", color: "#9c6d1b" },

            BLUE  : '#2f5ea8',
            GREY  : '#999999',
            RED   : '#b22e31',
            ORANGE: '#f2b31b',
            YELLOW: '#ffe068',
        },

        Constants  = namespace.Constants = {
            // String constants
            OFF   : 'off',
            ON    : 'on',

            // Directional
            BOTTOM: 'bottom',
            LEFT  : 'left',
            RIGHT : 'right',
            TOP   : 'top',

            // Numeric constants
            RAD_TO_DEG: 180 / Math.PI,
            DEG_TO_RAD: Math.PI / 180
        },

        Events = namespace.Events = {
            ADD            : 'add',
            ANIMATE_IN     : 'ANIMATE_IN',
            ANIMATE_OUT    : 'ANIMATE_OUT',
            ANIMATION_START: 'animation:start',
            ANIMATION_END  : 'animation:end',
            CLICK          : 'click',
            COMPLETE       : 'complete',
            ERROR          : 'error',
            MOUSE_DOWN     : 'mousedown',
            MOUSE_MOVE     : 'mousemove',
            MOUSE_OUT      : 'mouseout',
            MOUSE_OVER     : 'mouseover',
            MOUSE_UP       : 'mouseup',
            NAV            : 'nav',
            PROGRESS       : 'progress',
            REMOVE         : 'remove',
            RESIZE         : 'resize',
            SUCCESS        : 'success',
            TRANSITION     : 'transition',


            // Backbone
            // -----------------------

            FETCH_DATA   : 'fetch:data',
            FETCH_ERROR  : 'fetch:error',
            FETCH_SUCCESS: 'fetch:success',


            // Interact
            // -----------------------

            DRAG_ENTER: 'dragenter',
            DRAG_LEAVE: 'dragleave',
            DROP      : 'drop',


            // App Specific
            // -----------------------

        },

        Flags = namespace.Flags = {
            isFile   : isFile,
            isLocal  : isLocal,
            isIOS    : isIOS,
            isAndroid: isAndroid,
            isWebkit : isSafari || isChrome,
            isChrome : isChrome,
            isWindows: isWindows,
            isIE     : isIE,
            isIE9    : isIE9,
            isFirefox: isFirefox,
            isSafari : isSafari,
            isDebug  : isDebug
        },

        Keys = namespace.Keys = {
            SHIFT : 16,
            SPACE : 32,
            ALT   : 18,
            CTRL  : 17,
            DOWN  : 40,
            ESCAPE: 27,
            LEFT  : 37,
            RIGHT : 39,
            UP    : 38,
            NUM_0 : 48,
            NUM_1 : 49,
            NUM_2 : 50,
            NUM_3 : 51,
            NUM_4 : 52,
            NUM_5 : 53,
            NUM_6 : 54,
            NUM_7 : 55,
            NUM_8 : 56,
            NUM_9 : 57,
            Z     : 90
        },

        Pages = namespace.Pages = {
            // Names of pages that can be used in the
            // router
        },

        State = namespace.State = {
            data     : {},
            hasLoaded: false,
            mouseX   : 0,
            mouseY   : 0,
            page     : null
        },

        Stats = namespace.Stats = {
            // Useful for tracking and analytics specific to
            // certain events and such
        },

        URLs = namespace.URLs = {
            // Similar to pages, but URLs
        };


    _.extend(namespace, Backbone.Events, {
        parent   : window.top,
        $document: $(document),
        $window  : $(window),
        $body    : $(document.body),
        $main    : $('main'),
        app      : null,
        func     : { },

        preventDefault: function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

    });


    // Func
    // ------------------------------------------------------

    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    _.mixin({
        bindDelay: function(func, delayMs, context) {
            var boundVersion = _(func).bind(context || func);
            _(boundVersion).delay(delayMs);
        }
    });


    // Load
    // ----------------------------------------------------------

    window.addEventListener('load', function() {
        // Namespace App
        if (namespace.App) {
            namespace.app = new namespace.App({
                el: $('body')
            });
            namespace.app.attachEvents();
            namespace.app.render();

            // set loaded
            State.hasLoaded = true;
        }

        if (namespace.Router) {
            // default hash
            if (window.location.hash.length == 0) {
                window.location.hash = "#/";
            }

            // router init
            namespace.Router.init();
        }
    });

})(window.pm || (window.pm = {}));
