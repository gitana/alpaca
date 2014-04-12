(function($, Handlebars, HandlebarsPrecompiled)
{
    // runtime cache of precompiled templates keyed by cacheKey
    var COMPILED_TEMPLATES = {};

    var helpers = {};
    helpers["compare"] = function(lvalue, rvalue, options)
    {
        if (arguments.length < 3)
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

        var operator = options.hash.operator || "==";

        var operators = {
            '==':       function(l,r) { return l == r; },
            '===':      function(l,r) { return l === r; },
            '!=':       function(l,r) { return l != r; },
            '<':        function(l,r) { return l < r; },
            '>':        function(l,r) { return l > r; },
            '<=':       function(l,r) { return l <= r; },
            '>=':       function(l,r) { return l >= r; },
            'typeof':   function(l,r) { return typeof l == r; }
        };

        if (!operators[operator])
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

        var result = operators[operator](lvalue,rvalue);

        if( result ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    };
    helpers["times"] = function(n, block) {
        var accum = '';
        for(var i = 0; i < n; ++i)
        {
            accum += block.fn(i);
        }
        return accum;
    };
    helpers["control"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_CONTROL_FIELD + "'></div>";
    };
    helpers["container"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_CONTAINER_FIELD + "'></div>";
    };
    helpers["item"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM + "' " + Alpaca.MARKER_DATA_CONTAINER_FIELD_ITEM_KEY + "='" + this.name + "'></div>";
    };
    helpers["formItems"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_FORM_ITEMS_FIELD + "'></div>";
    };


    //Handlebars.registerHelper("each", helpers["each"]);
    Handlebars.registerHelper("compare", helpers["compare"]);
    Handlebars.registerHelper("control", helpers["control"]);
    Handlebars.registerHelper("container", helpers["container"]);
    Handlebars.registerHelper("item", helpers["item"]);
    Handlebars.registerHelper("formItems", helpers["formItems"]);
    Handlebars.registerHelper("times", helpers["times"]);

    var partials = {};

    Alpaca.HandlebarsTemplateEngine = Alpaca.AbstractTemplateEngine.extend(
    {
        fileExtension: function() {
            return "html";
        },

        supportedMimetypes: function()
        {
            return [
                "text/x-handlebars-template",
                "text/x-handlebars-tmpl"
            ];
        },

        init: function()
        {
            // auto discover any precompiled templates and store them by cache key here
            if (HandlebarsPrecompiled)
            {
                for (var viewId in HandlebarsPrecompiled)
                {
                    var viewTemplates = HandlebarsPrecompiled[viewId];
                    for (var templateId in viewTemplates)
                    {
                        var template = viewTemplates[templateId];
                        if (typeof(template) == "function")
                        {
                            // cache key
                            var cacheKey = Alpaca.makeCacheKey(viewId, "view", viewId, templateId);

                            // cache
                            COMPILED_TEMPLATES[cacheKey] = template;
                        }
                    }
                }
            }
        },

        doCompile: function(cacheKey, html, callback)
        {
            var self = this;

            var template = null;
            try
            {
                var functionString = Handlebars.precompile(html);
                template = eval("(" + functionString + ")");

                // CACHE: write
                COMPILED_TEMPLATES[cacheKey] = template;
            }
            catch (e)
            {
                callback(e);
                return;
            }

            callback();
        },

        doExecute: function(cacheKey, model, errorCallback)
        {
            var self = this;

            // CACHE: read
            var templateFunction = COMPILED_TEMPLATES[cacheKey];
            if (!templateFunction)
            {
                errorCallback(new Error("Could not find handlebars cached template for key: " + cacheKey));
                return;
            }

            // render template
            var html = null;
            try
            {
                html = Handlebars.template(templateFunction)(model);
            }
            catch (e)
            {
                errorCallback(e);
                return null;
            }

            return html;
        },

        isCached: function(cacheKey)
        {
            return (COMPILED_TEMPLATES[cacheKey] ? true  : false);
        },

        findCacheKeys: function(viewId)
        {
            var cacheKeys = [];

            for (var cacheKey in COMPILED_TEMPLATES)
            {
                if (cacheKey.indexOf(viewId + ":") === 0)
                {
                    cacheKeys.push(cacheKey);
                }
            }

            return cacheKeys;
        }

    });

    // auto register
    Alpaca.TemplateEngineRegistry.register("handlebars", new Alpaca.HandlebarsTemplateEngine("handlebars"));

})(jQuery, window.Handlebars, window.HandlebarsPrecompiled);