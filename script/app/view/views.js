/**
 * @package Project Name
 * @client  Client
 * @authors Name <email>
 * @date    2014-06-15 00:00:00
 * @version 0.0.1
 */

;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants,
        Events    = namespace.Events;

    namespace.View_Views = function(view) {
        this._parent = view;
        this._byId   = {};
        this._views  = [];
    };

    namespace.View_Views.prototype = {
        index: 0,
        length: 0,

        _parent: false,
        _byId  : false,
        _views : false,

        add: function(view, name) {
            name || (name = 'model' in view ? view.model.cid : view.cid);

            if (DEBUG && !view) {
                throw 'add requires a view';
            }
            else if (DEBUG && this.has(name)) {
                throw name + ' is already a sub-view';
            }

            this._views.push(view);
            this._byId[name] = view;

            // assign parent view
            if (!view.parent) {
                view.parent = this._parent;
            }

            this.length++;

            return this;
        },

        has: function(nameOrModel) {
            return this._getModelCidOrName(nameOrModel) in this._byId;
        },

        get: function(nameOrModel) {
            var name = this._getModelCidOrName(nameOrModel);

            // string
            if (this.has(name)) {
                return this._byId[name];
            }

            // number
            else if (typeof(nameOrModel) == 'number') {
                return this._views[nameOrModel];
            }
        },

        first: function() {
            return this.at(this.index = 0);
        },

        last: function() {
            return this.at(this.index = this.length - 1);
        },

        at: function(index) {
            return this._views[this.index = index];
        },

        remove: function(names) {
            names  || (names = []);
            names = _(names).isString() ? [names] : names;

            // iterate through list of view names
            _(names).each(function(name) {
                // make sure view exists
                if (this.has(name)) {
                    // call remove first
                    this._byId[name].remove();

                    // get index
                    var index = _.indexOf(this._views, this._byId[name]);

                    // delete hash
                    this._byId[name] = void 0;
                    delete this._byId[name];

                    // delete array
                    this._views.splice(index, 1);

                    // update length
                    this.length--;
                }
            }, this);

            return this;
        },

        reset: function(options) {
            options || (options = {});
            var except = options.except || [];
            except = _(except).isString() ? [except] : except;

            var names = [];

            _.each(this._byId, function(view, name) {
                if (_.indexOf(except, name) === -1) {
                    names.push(name);
                }
            });

            return this.remove(names);
        },

        invoke: function() {
            return _.invoke.apply(_, [this._views].concat(_.toArray(arguments)));
        },

        indexOf: function() {
            return _.indexOf.apply(_, [this._views].concat(_.toArray(arguments)));
        },

        indexOfElement: function($el) {
            for (var i in this._views) {
                if (this.at(i).$el.get(0) == $el) {
                    return i;
                }
            }
        },

        each: function() {
            return _.each.apply(_, [this._views].concat(_.toArray(arguments)));
        },

        every: function() {
            return _.all.apply(_, [this._views].concat(_.toArray(arguments)));
        },

        execAll: function(methodName, params) {
            var args = _.toArray(arguments);
                args.shift();

            _.each(this._views, function(view, index) {
                view[methodName].apply(view, args);
            }, this);
        },

        _getModelCidOrName: function(nameOrModel) {
            return _(nameOrModel).isObject() ? nameOrModel.cid : nameOrModel;
        }
    };

})(window.pm || (window.pm = {}));