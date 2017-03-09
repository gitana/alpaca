(function($) {

    var Alpaca = $.alpaca;

    Alpaca.NullCache = function(config)
    {
        return function(k, v, ttl)
        {
            if (v) {
                return v;
            }

            return undefined;
        };
    };

    Alpaca.registerCache("null", Alpaca.NullCache);

})(jQuery);
