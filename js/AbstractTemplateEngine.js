(function($)
{
    // template cache
    if (typeof(Alpaca.TemplateCache) == "undefined") {
        Alpaca.TemplateCache = {};
    }

    Alpaca.AbstractTemplateEngine = Base.extend(
    {
        constructor: function(id)
        {
            this.base();

            this.id = id;

            this.cleanMarkup = function(html)
            {
                // convert to a dom briefly
                var dom = Alpaca.safeDomParse(html);

                // if if starts with a script tag, then we strip that out
                if ($(dom).length == 1)
                {
                    if ($(dom)[0].nodeName.toLowerCase() == "script")
                    {
                        html = $(dom).html();
                    }
                }

                return html;
            };
        },

        /**
         * Compiles the given template (or URI or dom selector)
         *
         * @param cacheKey
         * @param template
         * @param callback
         */
        compile: function(cacheKey, template, callback)
        {
            var self = this;

            // the value being compiled can be
            //   HTML
            //   URL (http, ./ or /)
            //   dom selector (#abc, .classname)
            //   dom element

            // here we try to determine what type of value it is
            var type = "html";
            if (Alpaca.isString(template))
            {
                if (template.indexOf("./") === 0 || template.indexOf("/") === 0 || template.indexOf("../") === 0)
                {
                    type = "uri";
                }
                else if (template.indexOf("#") === 0 || template.indexOf(".") === 0 || template.indexOf("[") === 0)
                {
                    type = "selector";
                }
            }
            else
            {
                // it's a dom element, we flow through
            }

            // now extract html and compile
            if (type == "selector")
            {
                self._compile(cacheKey, template, callback);
            }
            else if (type == "uri")
            {
                var fileExtension = self.fileExtension();

                var url = template;
                if (url.indexOf("." + fileExtension) === -1) {
                    url += "." + fileExtension;
                }

                // load the template via ajax
                $.ajax({
                    "url": url,
                    "dataType": "html",
                    "success": function(html)
                    {
                        // cleanup html
                        html = self.cleanMarkup(html);

                        self._compile(cacheKey, html, callback);
                    },
                    "failure": function(http)
                    {
                        callback(http, null);
                    }
                });
            }
            else if (type == "html")
            {
                var html = template;
                if (html instanceof jQuery) {
                    html = Alpaca.safeDomParse(template).outerHTML();
                }

                self._compile(cacheKey, html, callback);
            }
            else
            {
                callback(new Error("Template engine cannot determine how to handle type: " + type));
            }
        },

        _compile: function(cacheKey, html, callback)
        {
            // for null templates, set to empty string
            if (Alpaca.isEmpty(html)) {
                html = "";
            }

            // trim the html
            html = Alpaca.trim(html);

            if (html.toLowerCase().indexOf("<script") === 0)
            {
                // already has script tag
            }
            else
            {
                // apply script tag
                html = "<script type='" + this.supportedMimetypes()[0] + "'>" + html + "</script>";
            }

            Alpaca.logDebug("Compiling template: " + this.id + ", cacheKey: " + cacheKey + ", template: " + html);

            this.doCompile(cacheKey, html, callback);
        },

        /**
         * @extension_point
         *
         * @param cacheKey
         * @param html
         * @param callback
         */
        doCompile: function(cacheKey, html, callback)
        {

        },

        /**
         * @extension_point
         *
         * @param cacheKey
         * @param model
         * @param callback
         */
        execute: function(cacheKey, model, callback)
        {
            Alpaca.logDebug("Executing template for cache key: " + cacheKey);

            var html = this.doExecute(cacheKey, model, callback);

            // if wrapped in script tag, strip away
            var strip_script = function(html)
            {
                // if if starts with a script tag, then we strip that out
                var dom = Alpaca.safeDomParse(html);
                if ($(dom).length == 1)
                {
                    if ($(dom)[0].nodeName.toLowerCase() == "script")
                    {
                        return $(dom).html();

                    }
                }

                return html;
            };

            html = strip_script(html);

            return html;
        },

        /**
         * @extension_point
         *
         * @param cacheKey
         * @param model
         * @param callback
         */
        doExecute: function(cacheKey, model, callback)
        {

        },

        /**
         * Hands back the expected file extension for templates loaded via URI.
         *
         * @return {String}
         */
        fileExtension: function() {
            return "html";
        },

        /**
         * Hands back the list of associated script tag types for templates loaded from the DOM.
         *
         * @return {Array}
         */
        supportedMimetypes: function()
        {
            return [];
        },

        /**
         * Determines whether an existing template is already in cache.
         *
         * @param cacheKey
         */
        isCached: function(cacheKey)
        {

        }

    });

})(jQuery);