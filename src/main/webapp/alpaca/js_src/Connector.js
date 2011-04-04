(function($) {

    var Alpaca = $.alpaca;

    /**
     * Abstract Connector Class
     */
    Alpaca.Connector = Base.extend({

        constructor: function(id, configs) {
            this.id = id;
            this.configs = configs;
        },

        /**
         *
         */
        connect: function (onSuccess, onError) {

        },

        /**
         *
         * @param dataSource
         * @param onSuccess
         * @param onError
         */
        loadTemplate : function (dataSource, onSuccess, onError) {
            if (!Alpaca.isEmpty(dataSource)) {
                if (Alpaca.isUri(dataSource)) {
                    this.loadUri(dataSource, false, function(loadedData) {
                        if (onSuccess && Alpaca.isFunction(onSuccess)) {
                            onSuccess(loadedData);
                        }
                    }, function (loadError) {
                        if (onError && Alpaca.isFunction(onError)) {
                            onError(loadError);
                        }
                    });
                } else {
                    onSuccess(dataSource);
                }
            } else {
                onError('Invalid data source.');
            }
        },

        /**
         *
         * @param dataSource
         * @param onSuccess
         * @param onError
         */
        loadAll : function (dataSource, onSuccess, onError) {
            var loadCounter = 0;
            var data = dataSource.data;
            var options = dataSource.options;
            var schema = dataSource.schema;
            var view = dataSource.view;

            var successCallback = function (data, options, schema, view) {
                loadCounter ++;
                if (loadCounter == 4) {
                    if (onSuccess && Alpaca.isFunction(onSuccess)) {
                        onSuccess(data, options, schema, view);
                    }
                }
            };

            var errorCallback = function (loadError) {
                if (onError && Alpaca.isFunction(onError)) {
                    onError(loadError);
                }
            };

            // make parallel calls if needed
            // load data
            if (data && Alpaca.isUri(data) && (!(schema && schema.format && schema.format == 'uri'))) {
                this.loadJson(data, function(loadedData) {
                    data = loadedData;
                    successCallback(data, options, schema, view);
                }, errorCallback);
            } else {
                successCallback(data, options, schema, view);
            }

            // options
            if (options && Alpaca.isUri(options)) {
                this.loadJson(options, function(loadedData) {
                    options = loadedData;
                    successCallback(data, options, schema, view);
                }, errorCallback);
            } else {
                successCallback(data, options, schema, view);
            }

            // schema
            if (schema && Alpaca.isUri(schema)) {
                this.loadJson(schema, function(loadedData) {
                    schema = loadedData;
                    successCallback(data, options, schema, view);
                }, errorCallback);
            } else {
                successCallback(data, options, schema, view);
            }

            // view
            if (view && Alpaca.isUri(view)) {
                this.loadJson(view, function(loadedData) {
                    view = loadedData;
                    successCallback(data, options, schema, view);
                }, errorCallback);
            } else {
                successCallback(data, options, schema, view);
            }
        },

        /**
         *
         * @param callback
         */
        create : function (onSuccess, onError) {

        },

        /**
         *
         * @param callback
         */
        remove : function (onSuccess, onError) {

        },

        /**
         *
         * @param callback
         */
        save : function (onSuccess, onError) {

        },

        /**
         *
         * @param uri
         * @param onSuccess
         * @param onError
         */
        loadJson : function(uri, onSuccess, onError) {
            this.loadUri(uri, true, onSuccess, onError);
        } ,

        /**
         *
         * @param uri
         * @param onSuccess
         * @param onError
         */
        loadUri : function(uri, isJson, onSuccess, onError) {
            var ajaxConfigs = {
                url: uri,
                type: "get",
                success: function(jsonDocument) {
                    if (onSuccess && Alpaca.isFunction(onSuccess)) {
                        onSuccess(jsonDocument);
                    }
                },
                error: function(error) {
                    if (onError && Alpaca.isFunction(onError)) {
                        onError(error);
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
