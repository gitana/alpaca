(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Connector = Base.extend(
    /**
     * @lends Alpaca.Connector.prototype
     */
    {
        /**
         * @constructs
         * @class Connects Alpaca to remote data stores.

         * @param {String} id Connector ID
         * @param {Object} config Connector Config
         */
        constructor: function(id, config)
        {
            if (!config) {
                config = {};
            }

            this.id = id;
            this.config = config;

            // helper function to determine if a resource is a uri
            this.isUri = function(resource)
            {
                return !Alpaca.isEmpty(resource) && Alpaca.isUri(resource);
            };

            if (!config.cache) {
                config.cache = {
                    "type": "null",
                    "config": {}
                };
            }
            if (!config.cache.type) {
                config.cache.type = "null";
                config.cache.config = {};
            }

            this.cache = Alpaca.getCache(config.cache.type)(config.cache.config);
        },

        /**
         * Makes initial connections to data source.
         *
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        connect: function (onSuccess, onError)
        {
            onSuccess();
        },

        /**
         * Loads a template (HTML or Text).
         *
         * If the source is a URI, then it is loaded.
         * If it is not a URI, then the source is simply handed back.
         *
         * @param {Object|String} source Source to be loaded.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadTemplate: function (source, onSuccess, onError)
        {
            if (!Alpaca.isEmpty(source))
            {
                if (Alpaca.isUri(source))
                {
                    this.loadUri(source, false, function(loadedData) {

                        if (onSuccess && Alpaca.isFunction(onSuccess))
                        {
                            onSuccess(loadedData);
                        }

                    }, function (loadError) {

                        if (onError && Alpaca.isFunction(onError))
                        {
                            onError(loadError);
                        }
                    });
                }
                else
                {
                    onSuccess(source);
                }
            }
            else
            {
                onError({
                    "message":"Empty data source.",
                    "reason": "TEMPLATE_LOADING_ERROR"
                });
            }
        },

        /**
         * Loads JSON data.
         *
         * @param {Object|String} resource Resource to be loaded
         * @param {Object} resources Map of resources
         * @param {Function} onSuccess onSuccess callback
         * @param {Function} onError onError callback
         */
        loadData: function (resource, resources, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        /**
         * Loads JSON schema.
         *
         * @param {Object|String} resource Resource to be loaded
         * @param {Object} resources Map of resources
         * @param {Function} onSuccess onSuccess callback
         * @param {Function} onError onError callback
         */
        loadSchema: function (resource, resources, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        /**
         * Loads JSON options.
         *
         * @param {Object|String} resource Resource to be loaded
         * @param {Object} resources Map of resources
         * @param {Function} onSuccess onSuccess callback
         * @param {Function} onError onError callback
         */
        loadOptions: function (resource, resources, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        /**
         * Loads JSON view.
         *
         * @param {Object|String} resource Resource to be loaded
         * @param {Object} resources Map of resources
         * @param {Function} onSuccess onSuccess callback
         * @param {Function} onError onError callback
         */
        loadView: function (resource, resources, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        /**
         * Loads schema, form, view and data in a single call.
         *
         * @param {Object} resources resources
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadAll: function (resources, onSuccess, onError)
        {
            var self = this;

            var onConnectSuccess = function() {

                var dataSource = resources.dataSource;
                var schemaSource = resources.schemaSource;
                var optionsSource = resources.optionsSource;
                var viewSource = resources.viewSource;

                // we allow "schema" to contain a URI as well (backwards-compatibility)
                if (!schemaSource && typeof(resources.schema) === "string")
                {
                    schemaSource = resources.schema;
                }

                // we allow "options" to contain a URI as well (backwards-compatibility)
                if (!optionsSource && typeof(resources.options) === "string")
                {
                    optionsSource = resources.options;
                }

                // we allow "view" to contain a URI as well (backwards-compatibility)
                if (!viewSource && typeof(resources.view) === "string")
                {
                    viewSource = resources.view;
                }

                var loaded = {};

                var loadCounter = 0;
                var invocationCount = 0;

                var successCallback = function()
                {
                    if (loadCounter === invocationCount)
                    {
                        if (onSuccess && Alpaca.isFunction(onSuccess))
                        {
                            onSuccess(loaded.data, loaded.options, loaded.schema, loaded.view);
                        }
                    }
                };

                var errorCallback = function (loadError)
                {
                    if (onError && Alpaca.isFunction(onError))
                    {
                        onError(loadError);
                    }
                };

                // count out the total # of invokes we're going to fire off
                if (dataSource)
                {
                    invocationCount++;
                }
                if (schemaSource)
                {
                    invocationCount++;
                }
                if (optionsSource)
                {
                    invocationCount++;
                }
                if (viewSource)
                {
                    invocationCount++;
                }
                if (invocationCount === 0)
                {
                    // nothing to invoke, so just hand back
                    successCallback();
                    return;
                }

                var doMerge = function(p, v1, v2)
                {
                    loaded[p] = v1;

                    if (v2)
                    {
                        if ((typeof(loaded[p]) === "object") && (typeof(v2) === "object"))
                        {
                            Alpaca.mergeObject(loaded[p], v2);
                        }
                        else
                        {
                            loaded[p] = v2;
                        }
                    }
                };

                // fire off all of the invokes
                if (dataSource)
                {
                    self.loadData(dataSource, resources, function(data) {

                        doMerge("data", resources.data, data);

                        loadCounter++;
                        successCallback();
                    }, errorCallback);
                }
                if (schemaSource)
                {
                    self.loadSchema(schemaSource, resources, function(schema) {

                        doMerge("schema", resources.schema, schema);

                        loadCounter++;
                        successCallback();
                    }, errorCallback);
                }
                if (optionsSource)
                {
                    self.loadOptions(optionsSource, resources, function(options) {

                        doMerge("options", resources.options, options);

                        loadCounter++;
                        successCallback();
                    }, errorCallback);
                }
                if (viewSource)
                {
                    self.loadView(viewSource, resources, function(view) {

                        doMerge("view", resources.view, view);

                        loadCounter++;
                        successCallback();
                    }, errorCallback);
                }

            };

            var onConnectError  = function(err) {
                if (onError && Alpaca.isFunction(onError)) {
                    onError(err);
                }
            };

            self.connect(onConnectSuccess, onConnectError);
        },

        /**
         * Loads a JSON through Ajax call.
         *
         * @param {String} uri location of the json document
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadJson : function(uri, onSuccess, onError) {
            this.loadUri(uri, true, onSuccess, onError);
        } ,

        /**
         * Extension point.  Set up default ajax configuration for URL retrieval.
         *
         * @param uri
         * @param isJson
         * @returns {{url: *, type: string}}
         */
        buildAjaxConfig: function(uri, isJson)
        {
            var ajaxConfig = {
                "url": uri,
                "type": "get"
            };

            if (isJson) {
                ajaxConfig.dataType = "json";
            } else {
                ajaxConfig.dataType = "text";
                if (uri && uri.toLowerCase().indexOf(".html") > -1) {
                    ajaxConfig.dataType = "html";
                }
            }

            return ajaxConfig;
        },

        /**
         * Loads a general document through Ajax call.
         *
         * This uses jQuery to perform the Ajax call.  If you need to customize connectivity to your own remote server,
         * this would be the appropriate place to do so.
         *
         * @param {String} uri uri to be loaded
         * @param {Boolean} isJson Whether the document is a JSON or not.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadUri : function(uri, isJson, onSuccess, onError) {

            var self = this;

            var ajaxConfig = self.buildAjaxConfig(uri, isJson);

            ajaxConfig["success"] = function(jsonDocument) {

                self.cache(uri, jsonDocument);

                if (onSuccess && Alpaca.isFunction(onSuccess)) {
                    onSuccess(jsonDocument);
                }
            };
            ajaxConfig["error"] = function(jqXHR, textStatus, errorThrown) {
                if (onError && Alpaca.isFunction(onError)) {
                    onError({
                        "message":"Unable to load data from uri : " + uri,
                        "stage": "DATA_LOADING_ERROR",
                        "details": {
                            "jqXHR" : jqXHR,
                            "textStatus" : textStatus,
                            "errorThrown" : errorThrown
                        }
                    });
                }
            };

            var cachedDocument = self.cache(uri);

            if (cachedDocument && onSuccess && Alpaca.isFunction(onSuccess)) {
                onSuccess(cachedDocument);
            } else {
                $.ajax(ajaxConfig);
            }
        },

        /**
         * Loads referenced JSON schema.
         *
         * @param {Object|String} resource Resource to be loaded.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadReferenceSchema: function (resource, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        /**
         * Loads referenced JSON options.
         *
         * @param {Object|String} resource Resource to be loaded.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadReferenceOptions: function (resource, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        _handleLoadJsonResource: function (resource, successCallback, errorCallback)
        {
            if (this.isUri(resource))
            {
                this.loadJson(resource, function(loadedResource) {
                    successCallback(loadedResource);
                }, errorCallback);
            }
            else
            {
                successCallback(resource);
            }
        },

        /**
         * Loads data source (value/text) pairs from a remote source.
         * This default implementation allows for config to be a string identifying a URL.
         *
         * @param config
         * @param successCallback
         * @param errorCallback
         * @returns {*}
         */
        loadDataSource: function (config, successCallback, errorCallback)
        {
            return this._handleLoadDataSource(config, successCallback, errorCallback);
        },

        _handleLoadDataSource: function(config, successCallback, errorCallback)
        {
            var url = config;
            if (Alpaca.isObject(url)) {
                url = config.url;
            }

            return this._handleLoadJsonResource(url, successCallback, errorCallback);
        }

    });

    Alpaca.registerConnectorClass("default", Alpaca.Connector);

})(jQuery);
