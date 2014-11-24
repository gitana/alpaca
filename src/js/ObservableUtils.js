/*jshint -W014 */ // bad line breaking
/*jshint -W004 */ // duplicate variables
(function($)
{
    var Alpaca = $.alpaca;

    Alpaca.listenerId = function()
    {
        var x = 0;

        return function()
        {
            return "listener-" + (x++);
        };
    }();

    /**
     * Subscribes a function handler to an observable.
     *
     * @param [String] scope optional scope
     * @param {String} id the variable id
     * @param {Function} callbackFunction the callback function
     *
     * @return descriptor
     */
    Alpaca.subscribe = function()
    {
        var args = Alpaca.makeArray(arguments);

        var scope = null;
        var id = null;
        var listener = null;

        if (args.length == 2)
        {
            scope = "global";
            id = args.shift();
            listener = args.shift();
        }
        else
        {
            scope = args.shift();
            id = args.shift();
            listener = args.shift();
        }

        // pick off path if id is a field
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable subscribe id: " + id);
            return null;
        }

        // function identifier
        var listenerId = listener._lfid;
        if (!listenerId) {
            listenerId = Alpaca.listenerId();
            listener._lfid = listenerId;
        }

        // wrap function into a closure
        var func = function(that) {
            return function() {
                return listener.apply(that, arguments);
            };
        }(this);
        func._lfid = listener._lfid;

        var observables = Alpaca.ScopedObservables.get(scope);
        var observable = observables.observable(id);

        // tell the observable to subscribe
        observable.subscribe(listenerId, func);

        return {
            "scope": scope,
            "id": id,
            "listenerId": listenerId
        };
    };

    /**
     * Unsubscribes a function handler from an observable.
     *
     * @param [String] scope optional scope
     * @param {String} id the variable id
     * @param {String|Function} listener either the function or listener id
     * @return descriptor
     */
    Alpaca.unsubscribe = function()
    {
        var args = Alpaca.makeArray(arguments);

        var scope = null;
        var id = null;
        var listenerOrId = null;

        if (args.length == 2)
        {
            scope = "global";
            id = args.shift();
            listenerOrId = args.shift();
        }
        else if (args.length == 3)
        {
            scope = args.shift();
            id = args.shift();
            listenerOrId = args.shift();
        }

        var listenerId = listenerOrId;
        if (Alpaca.isFunction(listenerId))
        {
            listenerId = listenerId._lfid;
        }

        // pick off path if id is a field
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable id: " + id);
            return null;
        }

        var observables = Alpaca.ScopedObservables.get(scope);
        var observable = observables.observable(id);

        // tell the observable to unsubscribe
        observable.unsubscribe(listenerId);

        return {
            "scope": scope,
            "id": id,
            "listenerId": listenerId
        };
    };

    /**
     * Gets or sets an observable in the given scope.
     *
     * @param [String] scope optional scope
     * @param {String} id the variable id
     */
    Alpaca.observable = function()
    {
        var scope;
        var id;

        var args = Alpaca.makeArray(arguments);
        if (args.length == 1)
        {
            scope = "global";
            id = args.shift();
        }
        else if (args.length == 2)
        {
            scope = args.shift();
            id = args.shift();
        }

        // pick off path if id is a field
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable id: " + JSON.stringify(args));
        }
        else
        {
            var observables = Alpaca.ScopedObservables.get(scope);
            observable = observables.observable(id);
        }

        return observable;
    };

    Alpaca.clearObservable = function()
    {
        var scope;
        var id;

        var args = Alpaca.makeArray(arguments);
        if (args.length == 1)
        {
            scope = "global";
            id = args.shift();
        }
        else if (args.length == 2)
        {
            scope = args.shift();
            id = args.shift();
        }

        // pick off path if id is a field
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable id: " + JSON.stringify(args));
        }

        var observables = Alpaca.ScopedObservables.get(scope);
        var observable = observables.observable(id);

        observable.clear();
    };

    /**
     * Declares and gets a dependent observable in a given scope
     *
     * @param scope
     * @param id
     * @param func
     */
    Alpaca.dependentObservable = function()
    {
        var scope = null;
        var id = null;
        var func = null;

        var args = Alpaca.makeArray(arguments);
        if (args.length == 2)
        {
            scope = "global";
            id = args.shift();
            func = args.shift();
        }
        else if (args.length == 3)
        {
            scope = args.shift();
            id = args.shift();
            func = args.shift();
        }
        else
        {
            Alpaca.error("Wrong number of arguments");
            return;
        }

        // pick off path if id is a field
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable id: " + JSON.stringify(args));
        }

        var observables = Alpaca.ScopedObservables.get(scope);

        return observables.dependentObservable(id, func);
    };

})(jQuery);