
// Console
// --------------------------------------------------------------------------

window.color = function() {
    var aa      = Array.prototype.slice.apply(arguments);
    var options = aa.pop() || {};
    aa[0]       = "%c " + aa[0] + " ";
    aa          = [aa.join(' '), "background: " + options.background + "; color: " + options.color + ";"];

    console.log.apply(console, aa);
};


// Console
// ----------------------------------------------------------

if (window.pm && pm.Flags && !pm.Flags.isLocal) {
    // remove console logging
    $.extend(console, {
        color         : $.noop,
        debug         : $.noop,
        error         : $.noop,
        info          : $.noop,
        log           : $.noop,
        warn          : $.noop,
        dir           : $.noop,
        dirxml        : $.noop,
        table         : $.noop,
        trace         : $.noop,
        assert        : $.noop,
        count         : $.noop,
        markTimeline  : $.noop,
        profile       : $.noop,
        profileEnd    : $.noop,
        time          : $.noop,
        timeEnd       : $.noop,
        timeStamp     : $.noop,
        group         : $.noop,
        groupCollapsed: $.noop,
        groupEnd      : $.noop,
        clear         : $.noop
    })
}