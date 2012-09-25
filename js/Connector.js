(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Connector = Base.extend(
    /**
     * @lends Alpaca.Connector.prototype
     */
    {
        /**
         * @constructs
         * @class Default connector that loads JSONs:
         * <p>
         * 1.as provided objects.
         * </p>
         * <p>
         * 2.through Ajax calls if URIs are provided.
         * </p>
         * <p>
         * 3.through ID references (only for Views and Templates).
         * </p>
         * <p>
         * Usage:
         * </p>
         * <code>
         *     <pre>
         * {
         *   "data": [Object | URI],
         *   "schema": [Object | URI],
         *   "options": [Object | URI],
         *   "view": [Object | URI | View ID]
         *  }
         *      </pre>
         * </code>
         * @param {String} id Connector ID.
         * @param {Object} configs Connector Configurations.
         */
        constructor: function(id, configs) {
            this.id = id;
            this.configs = configs;
        },

        /**
         * Makes initial connections to data source.
         *
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        connect: function (onSuccess, onError) {
            if (onSuccess && Alpaca.isFunction(onSuccess)) {
                onSuccess();
            }
        },

        /**
         * Loads template JSON.
         *
         * @param {Object} dataSource Data source to be loaded.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
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
                onError({
                    "message":"Empty data source.",
                    "reason": "TEMPLATE_LOADING_ERROR"
                });
            }
        },

        /**
         * Loads data JSON.
         *
         * @param {Object} dataSource Data source to load
         * @param {Function} onSuccess onSuccess callback
         * @param {Function} onError onError callback
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
         * Loads schema JSON.
         *
         * @param {Object} dataSource Data source to be loaded.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
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
         * Loads options JSON.
         *
         * @param {Object} dataSource Data source to be loaded.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
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
         * Loads view JSON.
         *
         * @param dataSource Data source to be loaded
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
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
         * Loads schema, form, view and data in a single call.
         *
         * @param {Object} dataSource Data source to be loaded
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
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
         * Saves or creates data through connector.
         *
         * @param {Object} dataSource Data to be created or saved.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        saveData : function (data, onSuccess, onError) {

        },

        /**
         * Loads a JSON through Ajax call.
         *
         * @param {String} uri Target source JSON location.
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        loadJson : function(uri, onSuccess, onError) {
            this.loadUri(uri, true, onSuccess, onError);
        } ,

        /**
         * Loads a general document through Ajax call.
         *
         * @param {String} uri Target source document location.
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
