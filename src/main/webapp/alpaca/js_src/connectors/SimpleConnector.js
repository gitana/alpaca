(function($) {

    var Alpaca = $.alpaca;

    /**
     * Simple Local File System Connector that loads files from local file systems.
     *
     * Files are placed and named according to following conventions
     *
     * root
     *  |
     *  |---- schema    [schema_key].json (e.g. profile.json)
     *  |
     *  |---- forms     [schema_key]-[form_key].json (e.g. profile-simple.json)
     *  |
     *  |---- views     [view_key].json (e.g. mobile.json)
     *  |
     *  |---- templates [template_key].tmpl (e.g. two_column.tmpl)
     *  |
     *  |---- data      [data_key].json (e.g. taylor_swift.json)
     *
     * The connector takes a single configuration variable, root, for root folder.
     * The default value for root folder is "/".
     *
     *
     * The loadAll method is for loading schema, form, view and data in a single call.
     * Its dataSource parameter should have following format
     *
     *  {
     *   "data": [data_key],
     *   "schema": [schema_key],
     *   "options": [form_key],
     *   "view": [view_key]
     *  }
     *
     *  e.g.
     *
     *  {
     *   "data": "taylor_swift",
     *   "schema": "profile",
     *   "options": "profile-simple",
     *   "view": "mobile"
     *  }
     *
     *
     * The load method is for loading single item such as schema, form, view , data or template.
     * Its dataSource parameter should have following format
     *
     *  {
     *   "key":"data|schema|options|view|template",
     *   "dataSource":dataSource,
     *   "isJson":true|false
     *  }
     *
     *  e.g.
     *
     *  {
     *      "key": template,
     *      "dataSource" : "two_column"
     *  }
     *
     */
    Alpaca.Connectors.SimpleConnector = Alpaca.Connector.extend({

        constructor: function(id, configs) {
            this.base(id, configs);
        },

        /**
         *
         */
        connect: function (onSuccess, onError) {
            var _this = this;
            this.root = this.configs.root ? this.configs.root : "/";
            if (!Alpaca.endsWith(this.root, "/")) {
                this.root = this.root + "/";
            }
            // TODO: It might not be a good idea to check root?
            // Test the root availability
            this.loadUri(this.root, false, function(success) {

                _this.prefixMappings = {
                    "data": _this.root + "data",
                    "schema": _this.root + "schema",
                    "options": _this.root + "forms",
                    "view": _this.root + "views",
                    "template": _this.root + "templates"
                };

                _this.postfixMappings = {
                    "data": ".json",
                    "schema": ".json",
                    "options":".json",
                    "view": ".json",
                    "template": ".tmpl"
                };

                if (onSuccess && Alpaca.isFunction(onSuccess)) {
                    onSuccess(success);
                }
            }, function(error) {
                if (onError && Alpaca.isFunction(onError)) {
                    onError(error);
                }
            });
        },

        /**
         *
         * @param dataSource
         * @param successCallback
         * @param errorCallback
         */
        loadData : function (dataSource, successCallback, errorCallback) {
            var _this = this;
            var base = this.base;
            var data = dataSource.data;
            var isValidData = function () {
                return !Alpaca.isEmpty(data) && Alpaca.isString(data) && !Alpaca.isUri(data);
            };

            if (isValidData()) {
                var tmp = this.prefixMappings["data"] + "/" + data + this.postfixMappings["data"];
                this.loadUri(tmp, true, function(loadedData) {
                    dataSource.data = loadedData;
                    successCallback(dataSource);
                }, function(loadedError) {
                    base(dataSource, function(dataSource) {
                       successCallback(dataSource);
                    }, function(error) {
                        errorCallback(error);
                    });
                });
            } else {
                this.base(dataSource, function(dataSource) {
                   successCallback(dataSource);
                }, function(error) {
                    errorCallback(error);
                });
            }
        },

        /**
         *
         * @param dataSource
         * @param successCallback
         * @param errorCallback
         */
        loadView : function (dataSource, successCallback, errorCallback) {
            var _this = this;
            var base = this.base;
            var view = dataSource.view;
            var isValidView = function () {
                return !Alpaca.isEmpty(view) && Alpaca.isString(view) && !Alpaca.isUri(view) && !Alpaca.isValidViewId(view);
            };
            if (isValidView()) {
                var tmp = this.prefixMappings["view"] + "/" + this.originalDataSource.schema + "-" + this.originalDataSource.options + "-" + view + this.postfixMappings["view"];
                this.loadUri(tmp, true, function(loadedView) {
                    dataSource.view = loadedView;
                    _this.loadData(dataSource, successCallback, errorCallback);
                }, function(loadedError) {
                    base(dataSource, function(dataSource) {
                        _this.loadData(dataSource, successCallback, errorCallback);
                    }, function(error) {
                        _this.loadData(dataSource, successCallback, errorCallback);
                    });
                });
            } else {
                this.base(dataSource, function(dataSource) {
                    _this.loadData(dataSource, successCallback, errorCallback);
                }, function(error) {
                    _this.loadData(dataSource, successCallback, errorCallback);
                });
            }
        },

        /**
         *
         * @param dataSource
         * @param successCallback
         * @param errorCallback
         */
        loadOptions : function (dataSource, successCallback, errorCallback) {
            var _this = this;
            var base = this.base;
            var options = dataSource.options;
            var isValidOptions = function () {
                return !Alpaca.isEmpty(options) && Alpaca.isString(options) && !Alpaca.isUri(options);
            };
            if (isValidOptions()) {
                var tmp = this.prefixMappings["options"] + "/" + this.originalDataSource.schema + "-" + options + this.postfixMappings["options"];
                this.loadUri(tmp, true, function(loadedOptions) {
                    dataSource.options = loadedOptions;
                    _this.loadView(dataSource, successCallback, errorCallback);
                }, function(loadedError) {
                    base(dataSource, function(dataSource) {
                        _this.loadView(dataSource, successCallback, errorCallback);
                    }, function(error) {
                        _this.loadView(dataSource, successCallback, errorCallback);
                    });
                });
            } else {
                this.base(dataSource, function(dataSource) {
                    _this.loadView(dataSource, successCallback, errorCallback);
                }, function(error) {
                    _this.loadView(dataSource, successCallback, errorCallback);
                });
            }
        },

        /**
         *
         * @param dataSource
         * @param successCallback
         * @param errorCallback
         */
        loadSchema : function (dataSource, successCallback, errorCallback) {
            var _this = this;
            var base = this.base;
            var schema = dataSource.schema;
            var isValidSchema = function () {
                return !Alpaca.isEmpty(schema) && Alpaca.isString(schema) && !Alpaca.isUri(schema);
            };
            if (isValidSchema()) {
                var tmp = this.prefixMappings["schema"] + "/" + schema + this.postfixMappings["schema"];
                this.loadUri(tmp, true, function(loadedSchema) {
                    dataSource.schema = loadedSchema;
                    _this.loadOptions(dataSource, successCallback, errorCallback);
                }, function(loadedError) {
                    base(dataSource, function(dataSource) {
                        _this.loadOptions(dataSource, successCallback, errorCallback);
                    }, function(error) {
                        _this.loadOptions(dataSource, successCallback, errorCallback);
                    });
                });
            } else {
                this.base(dataSource, function(dataSource) {
                    _this.loadOptions(dataSource, successCallback, errorCallback);
                }, function(error) {
                    _this.loadOptions(dataSource, successCallback, errorCallback);
                });
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
            this.originalDataSource = Alpaca.cloneObject(dataSource);

            var successCallback = function (dataSource) {
                if (onSuccess && Alpaca.isFunction(onSuccess)) {
                    onSuccess(dataSource.data, dataSource.options, dataSource.schema, dataSource.view);
                }
            };

            var errorCallback = function (loadError) {
                if (onError && Alpaca.isFunction(onError)) {
                    onError(loadError);
                }
            };

            this.loadSchema(dataSource, successCallback, errorCallback);
        },

        /**
         *
         * @param callback
         */
        loadTemplate : function (dataSource, onSuccess, onError) {

            var _this = this;
            var base = this.base;

            if (Alpaca.isString(dataSource) && !Alpaca.isUri(dataSource)
                    && !Alpaca.isValidViewId(dataSource) && dataSource.match(/^[a-zA-Z0-9_\s-]+$/)) {
                var tmp = dataSource = this.prefixMappings["template"] + "/" + dataSource + this.postfixMappings["template"];
                _this.loadUri(tmp, false, function(loadedTemplate) {
                    dataSource = loadedTemplate;
                    base(dataSource, onSuccess, onError);
                }, function(loadedError) {
                    base(dataSource, onSuccess, onError);
                })
            } else {
                base(dataSource, onSuccess, onError);
            }
        }
    });

    Alpaca.registerConnectorClass("simple", Alpaca.Connectors.SimpleConnector);

})(jQuery);