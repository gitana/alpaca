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
                return;
            }

            Alpaca.TemplateCache[cacheKey] = html;

            callback();
        },

        doExecute: function(cacheKey, model, callback)
        {
            var self = this;

            // render template
            var html = null;
            try
            {
                var _html = $.tmpl(cacheKey, model);
                _html = _html.outerHTML();

                // strip out the _tmplitem attribute if it is sticking around anywhere
                var i = -1;
                do
                {
                    i = _html.indexOf("_tmplitem=");
                    if (i > -1)
                    {
                        var j = _html.indexOf(" ", i);
                        if (j == -1)
                        {
                            j = _html.indexOf(">", i);
                        }
                        if (j == -1)
                        {
                            // make sure we don't wander off into an infinite loop
                            callback({
                                "message": "Should have found closing whitespace or '>' for _tmplitem attribute"
                            });
                            return;
                        }

                        _html = _html.substring(0, i) + _html.substring(j);
                    }
                }
                while (i > -1);

                // convert back to dom safely (IE bug resistant)
                html = Alpaca.safeDomParse(_html);
            }
            catch (e)
            {
                callback({
                    "message": e.message
                });

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
    Alpaca.TemplateEngineRegistry.register("tmpl", new Alpaca.JQueryTemplateEngine("tmpl"));

})(jQuery);