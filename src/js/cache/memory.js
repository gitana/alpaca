(function($) {

    var Alpaca = $.alpaca;

    Alpaca.MemoryCache = function(config)
    {
        if (!config) {
            config = {};
        }

        var cache = {};

        return function(k, v, ttl)
        {
            if (!Alpaca.isUndefined(v))
            {
                if (v)
                {
                    cache[k] = {
                        v: v
                    };

                    if (!ttl && config.ttl) {
                        ttl = config.ttl;
                    }

                    if (ttl) {
                        cache[k].expires = new Date().getTime() + ttl;
                    }
                }
                else
                {
                    delete cache[k];
                }
            }

            // support for "clear" method - removes everything from cache
            if (k == "clear")
            {
                var za = [];
                for (var z in cache)
                {
                    za.push(z);
                }
                for (var i = 0; i < za.length; i++)
                {
                    delete cache[za[i]];
                }
            }

            var d = cache[k];
            if (!d) {
                return undefined;
            }

            var now = new Date().getTime();
            if (d.expires && d.expires < now)
            {
                delete cache[k];
                return undefined;
            }

            return d.v;
        };
    };

    Alpaca.registerCache("memory", Alpaca.MemoryCache);

})(jQuery);
