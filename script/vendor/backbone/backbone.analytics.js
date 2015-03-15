(function(factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['backbone'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('backbone'));
  } else {
    factory(window.Backbone);
  }
})(function(Backbone) {

  'use strict';

  var loadUrl = Backbone.History.prototype.loadUrl;

  Backbone.History.prototype.loadUrl = function(fragmentOverride) {
    var matched = loadUrl.apply(this, arguments),
        gaFragment = this.fragment;

    if (!/^\//.test(gaFragment)) {
      gaFragment = '/' + gaFragment;
    }

    if (window['gaPlugin']) {
      gaPlugin.trackPage( $.noop, $.noop, gaFragment);
      color("[Tracking] " + gaFragment, { background: "#2099cd", color: "#fff" });
    }
    else {
      color("[Tracking] Test: " + gaFragment, { background: "#2099cd", color: "#fff" });
    }

    return matched;
  };

});
