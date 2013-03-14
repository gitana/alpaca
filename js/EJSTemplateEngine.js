(function($)
{
    Alpaca.EJSTemplateEngine = Alpaca.AbstractTemplateEngine.extend(
    {
        fileExtension: function() {
            return "ejs";
        },

        supportedMimetypes: function()
        {
            return [
                "text/x-ejs-template",
                "text/x-ejs-tmpl"
            ];
        },

        doCompile: function(cacheKey, html, callback)
        {
            var ejs = null;
            try
            {
                ejs = new EJS({
                    name: cacheKey,
                    text: html
                });
            }
            catch (e)
            {
                callback(e);
                return;
            }

            Alpaca.TemplateCache[cacheKey] = ejs;

            callback();
        },

        doExecute: function(cacheKey, model, callback)
        {
            var ejs = Alpaca.TemplateCache[cacheKey];

            // render template
            var html = null;
            try
            {
                html = ejs.render(model);
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
    Alpaca.TemplateEngineRegistry.register("ejs", new Alpaca.EJSTemplateEngine("ejs"));

})(jQuery);