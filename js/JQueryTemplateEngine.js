(function($)
{
    Alpaca.JQueryTemplateEngine = Alpaca.AbstractTemplateEngine.extend(
    {
        fileExtension: function() {
            return "html";
        },

        supportedMimetypes: function()
        {
            return [
                "text/x-jquery-template",
                "text/x-jquery-tmpl"
            ];
        },

        doCompile: function(cacheKey, html, callback)
        {
            try
            {
                $.template(cacheKey, html);
            }
            catch (e)
            {
                callback(e);
            }

            Alpaca.TemplateCache[cacheKey] = html;

            callback();
        },

        doExecute: function(cacheKey, model, callback)
        {
            // render template
            var html = null;
            try
            {
                html = $.tmpl(cacheKey, model);
            }
            catch (e)
            {
                callback({
                    "message": e.message
                });
            }

            return html;
        },

        isCached: function(cacheKey)
        {
            return (Alpaca.TemplateCache[cacheKey] ? true : false);
        }

    });

    // auto register
    Alpaca.TemplateEngineRegistry.register("tmpl", new Alpaca.JQueryTemplateEngine("tmpl"));

})(jQuery);