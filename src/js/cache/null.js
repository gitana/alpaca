import jQuery from "jquery";
import Alpaca from "../Alpaca.js";
var $ = jQuery;Alpaca.NullCache = function(config)
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

