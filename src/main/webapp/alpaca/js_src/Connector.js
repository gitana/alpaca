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
         * @param successCallback
         * @param errorCallback
         */
        loadData : function (dataSource, successCallback, errorCallback) {
            var data = dataSource.data;
            var schema = dataSource.schema;
            var isValidData = function () {
                return !Alpaca.isEmpty(data) && Alpaca.isUri(data) && (!(schema && schema.format && schema.format == 'uri'));
            };
            if (isValidData()) {
                this.loadJson(data, function(loadedData) {
                    dataSource.data = loadedData;
                    successCallback(dataSource);
                }, errorCallback);
            } else {
                successCallback(dataSource);
            }
        },

        /**
         *
         * @param dataSource
         * @param successCallback
         * @param errorCallback
         */
        loadSchema : function (dataSource, successCallback, errorCallback) {
            var schema = dataSource.schema;
            var isValidSchema = function () {
                return !Alpaca.isEmpty(schema) && Alpaca.isUri(schema);
            };
            if (isValidSchema()) {
                this.loadJson(schema, function(loadedSchema) {
                    dataSource.schema = loadedSchema;
                    successCallback(dataSource);
                }, errorCallback);
            } else {
                successCallback(dataSource);
            }
        },

        /**
         *
         * @param dataSource
         * @param successCallback
         * @param errorCallback
         */
        loadOptions : function (dataSource, successCallback, errorCallback) {
            var options = dataSource.options;
            var isValidOptions = function () {
                return !Alpaca.isEmpty(options) && Alpaca.isUri(options);
            };
            if (isValidOptions()) {
                this.loadJson(options, function(loadedOptions) {
                    dataSource.options = loadedOptions;
                    successCallback(dataSource);
                }, errorCallback);
            } else {
                successCallback(dataSource);
            }
        },

        /**
         *
         * @param dataSource
         * @param successCallback
         * @param errorCallback
         */
        loadView : function (dataSource, successCallback, errorCallback) {
            var view = dataSource.view;
            var isValidView = function () {
                return !Alpaca.isEmpty(view) && Alpaca.isUri(view);
            };
            if (isValidView()) {
                this.loadJson(view, function(loadedView) {
                    dataSource.view = loadedView;
                    successCallback(dataSource);
                }, errorCallback);
            } else {
                successCallback(dataSource);
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

            var successCallback = function (dataSource) {
                loadCounter ++;
                if (loadCounter == 4) {
                    if (onSuccess && Alpaca.isFunction(onSuccess)) {
                        onSuccess(dataSource.data, dataSource.options, dataSource.schema, dataSource.view);
                    }
                }
            };

            var errorCallback = function (loadError) {
                if (onError && Alpaca.isFunction(onError)) {
                    onError(loadError);
                }
            };

            this.loadData(dataSource, successCallback, errorCallback);
            this.loadSchema(dataSource, successCallback, errorCallback);
            this.loadOptions(dataSource, successCallback, errorCallback);
            this.loadView(dataSource, successCallback, errorCallback);

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
        saveData : function (data, successCallback, errorCallback) {

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
