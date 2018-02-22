(function($)
{
    Alpaca.AbstractTemplateEngine = Base.extend(
    {
        constructor: function(id)
        {
            this.base();

            this.id = id;

            this.cleanup = function(html)
            {
                if (html)
                {
                    // if if starts with a script tag, then we strip that out
                    if ($(html).length === 1)
                    {
                        if ($(html)[0].nodeName.toLowerCase() === "script")
                        {
                            return $(html).html();

                        }
                    }
                }

                return html;
            };
        },

        /**
         * Compiles the given template (or URI or dom selector)
         *
         * The callback is fired once the compile completes and has signature callback(err).
         *
         * @param cacheKey
         * @param template
         * @param connector
         * @param callback
         */
        compile: function(cacheKey, template, connector, callback)
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
                var lc = template.toLowerCase();
                if (Alpaca.isUri(lc))
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
            if (type === "selector")
            {
                self._compile(cacheKey, template, function(err) {
                    callback(err);
                });
            }
            else if (type === "uri")
            {
                var fileExtension = self.fileExtension();

                var url = template;
                if (url.indexOf("." + fileExtension) === -1) {
                    url += "." + fileExtension;
                }

                // load the template using the connector
                connector.loadTemplate(url, function(html) {

                    // cleanup html
                    html = self.cleanup(html);

                    self._compile(cacheKey, html, function(err) {
                        callback(err);
                    });

                }, function(err) {
                    callback(err);
                });
            }
            else if (type === "html")
            {
                var html = template;
                if (html instanceof jQuery)
                {
                    html = $(html).outerHTML();
                }

                self._compile(cacheKey, html, function(err) {
                    callback(err);
                });
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
         * @param errorCallback
         */
        execute: function(cacheKey, model, errorCallback)
        {
            Alpaca.logDebug("Executing template for cache key: " + cacheKey);

            var html = this.doExecute(cacheKey, model, errorCallback);

            // removes wrapping <script/> tag
            html = this.cleanup(html);

            return html;
        },

        /**
         * Execute a template and hand back a text string.
         *
         * @extension_point
         *
         * @param cacheKey
         * @param model
         * @param errorCallback
         */
        doExecute: function(cacheKey, model, errorCallback)
        {
            return null;
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
            return false;
        },

        /**
         * Acquires an array of cache keys matching the view.
         *
         * @param viewId
         */
        findCacheKeys: function(viewId)
        {
            return [];
        }

    });

})(jQuery);
