(function($)
{
    var Alpaca = $.alpaca;

    Alpaca.ScopedObservables = {};
    Alpaca.ScopedObservables.map = {};

    Alpaca.ScopedObservables.get = function(scope)
    {
        if (!Alpaca.ScopedObservables.map[scope])
        {
            Alpaca.ScopedObservables.map[scope] = new Alpaca.Observables(scope);
        }

        return Alpaca.ScopedObservables.map[scope];
    };

})(jQuery);
