(function()
{
    Alpaca.TemplateEngineRegistry = (function() {

        var registry = {};

        return {

            register: function(id, engine)
            {
                registry[id] = engine;

                engine.init();
            },

            find: function(idOrType)
            {
                var engine = null;

                if (registry[idOrType])
                {
                    engine = registry[idOrType];
                }
                else
                {
                    // inspect by type
                    for (var id in registry)
                    {
                        var supportedMimetypes = registry[id].supportedMimetypes();
                        for (var i = 0; i < supportedMimetypes.length; i++)
                        {
                            if (idOrType.toLowerCase() === supportedMimetypes[i].toLowerCase())
                            {
                                engine = registry[id];
                                break;
                            }
                        }
                    }
                }

                return engine;
            },

            ids: function()
            {
                var ids = [];

                for (var id in registry)
                {
                    ids.push(id);
                }

                return ids;
            }
        };
    })();

})();
