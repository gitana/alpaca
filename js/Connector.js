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

         * @param {String} id Connector ID.
         */
        constructor: function(id)
        {
            this.id = id;

            // helper function to determine if a resource is a uri
            this.isUri = function(resource)
            {
                return !Alpaca.isEmpty(resource) && Alpaca.isUri(resource);
            };

        },

        /**
         * Makes initial connections to data source.
         *
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        connect: function (onSuccess, onError)
        {
            if (onSuccess && Alpaca.isFunction(onSuccess))
            {
                onSuccess();
            }
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
        loadTemplate : function (source, onSuccess, onError)
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
         * @param {Object|String} resource Resource to be loaded.
         * @param {Function} onSuccess onSuccess callback
         * @param {Function} onError onError callback
         */
        loadData: function (resource, successCallback, errorCallback)
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
         * Loads JSON schema.
         *
         * @param {Object|String} resource Resource to be loaded.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadSchema: function (resource, successCallback, errorCallback)
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
         * Loads JSON options.
         *
         * @param {Object|String} resource Resource to be loaded.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadOptions: function (resource, successCallback, errorCallback)
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
         * Loads JSON view.
         *
         * @param {Object|String} resource Resource to be loaded.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadView: function (resource, successCallback, errorCallback)
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
         * Loads schema, form, view and data in a single call.
         *
         * @param {Object} resources resources
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadAll: function (resources, onSuccess, onError)
        {
            var dataSource = resources.dataSource;
            var schemaSource = resources.schemaSource;
            var optionsSource = resources.optionsSource;
            var viewSource = resources.viewSource;

            // we allow "schema" to contain a URI as well (backwards-compatibility)
            if (!schemaSource)
            {
                schemaSource = resources.schema;
            }

            // we allow "options" to contain a URI as well (backwards-compatibility)
            if (!optionsSource)
            {
                optionsSource = resources.options;
            }

            // we allow "view" to contain a URI as well (backwards-compatibility)
            if (!viewSource)
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

            // fire off all of the invokes
            if (dataSource)
            {
                this.loadData(dataSource, function(data) {
                    loaded.data = data;
                    loadCounter++;
                    successCallback();
                }, errorCallback);
            }
            if (schemaSource)
            {
                this.loadSchema(schemaSource, function(schema) {
                    loaded.schema = schema;
                    loadCounter++;
                    successCallback();
                }, errorCallback);
            }
            if (optionsSource)
            {
                this.loadOptions(optionsSource, function(options) {
                    loaded.options = options;
                    loadCounter++;
                    successCallback();
                }, errorCallback);
            }
            if (viewSource)
            {
                this.loadView(viewSource, function(view) {
                    loaded.view = view;
                    loadCounter++;
                    successCallback();
                }, errorCallback);
            }
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
            var ajaxConfigs = {
                "url": uri,
                "type": "get",
                "success": function(jsonDocument) {
                    if (onSuccess && Alpaca.isFunction(onSuccess)) {
                        onSuccess(jsonDocument);
                    }
                },
                "error": function(jqXHR, textStatus, errorThrown) {
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
                }
            };

            if (isJson) {
                ajaxConfigs.dataType = "json";
            } else {
                ajaxConfigs.dataType = "text";
            }

            $.ajax(ajaxConfigs);
        }

    });

    Alpaca.registerConnectorClass("default", Alpaca.Connector);

})(jQuery);
