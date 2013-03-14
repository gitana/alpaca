(function($)
{
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

        doCompile: function(cacheKey, html, callback)
        {
            var template = null;
            try
            {
                template = Handlebars.compile(html);
            }
            catch (e)
            {
                callback(e);
                return;
            }

            Alpaca.TemplateCache[cacheKey] = template;

            callback();
        },

        doExecute: function(cacheKey, model, callback)
        {
            var template = Alpaca.TemplateCache[cacheKey];

            // render template
            var html = null;
            try
            {
                html = template(model);
            }
            catch (e)
            {
                callback(e);
                return null;
            }

            return html;
        },

        isCached: function(cacheKey)
        {
            return (Alpaca.TemplateCache[cacheKey] ? true : false);
        }

    });

    // auto register
    Alpaca.TemplateEngineRegistry.register("handlebars", new Alpaca.HandlebarsTemplateEngine("handlebars"));

})(jQuery);